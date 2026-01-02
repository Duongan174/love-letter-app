// app/api/admin/music/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/admin/music
 * Xóa music và xử lý các drafts/cards liên quan
 * 
 * Lưu ý: music_id có thể nullable trong card_drafts và cards,
 * nên ta sẽ set null thay vì xóa drafts/cards
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra role admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData && userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing music id' }, { status: 400 });
    }

    // Bước 1: Đếm và set null cho card_drafts đang sử dụng music này
    const { count: draftsCount } = await supabase
      .from('card_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('music_id', id);

    if (draftsCount && draftsCount > 0) {
      const { error: updateDraftsError } = await supabase
        .from('card_drafts')
        .update({ music_id: null })
        .eq('music_id', id);

      if (updateDraftsError) {
        console.error('Update drafts error:', updateDraftsError);
        return NextResponse.json(
          { error: `Failed to update related drafts: ${updateDraftsError.message}` },
          { status: 500 }
        );
      }
    }

    // Bước 2: Kiểm tra cards - nếu music_id là required, cần xóa cards
    // Nếu nullable, chỉ cần set null
    const { count: cardsCount } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('music_id', id);

    if (cardsCount && cardsCount > 0) {
      // Kiểm tra xem music_id có required trong cards không
      // Nếu required, phải xóa cards. Nếu nullable, set null
      // Ở đây ta sẽ thử set null trước, nếu lỗi thì xóa
      const { error: updateCardsError } = await supabase
        .from('cards')
        .update({ music_id: null })
        .eq('music_id', id);

      if (updateCardsError) {
        // Nếu không thể set null (có thể là required), xóa cards
        const { error: deleteCardsError } = await supabase
          .from('cards')
          .delete()
          .eq('music_id', id);

        if (deleteCardsError) {
          console.error('Delete cards error:', deleteCardsError);
          return NextResponse.json(
            { error: `Failed to handle related cards: ${deleteCardsError.message}` },
            { status: 500 }
          );
        }
      }
    }

    // Bước 3: Xóa music
    const { error: deleteMusicError } = await supabase
      .from('music')
      .delete()
      .eq('id', id);

    if (deleteMusicError) {
      console.error('Delete music error:', deleteMusicError);
      return NextResponse.json(
        { error: deleteMusicError.message || 'Failed to delete music' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      updatedDrafts: draftsCount || 0,
      updatedCards: cardsCount || 0
    }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

