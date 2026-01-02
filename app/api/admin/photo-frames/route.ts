// app/api/admin/photo-frames/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/admin/photo-frames
 * Xóa photo frame và xử lý các drafts/cards liên quan
 * 
 * Lưu ý: frame_id có thể nullable, nên ta sẽ set null thay vì xóa
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
      return NextResponse.json({ error: 'Missing frame id' }, { status: 400 });
    }

    // Bước 1: Đếm và set null cho card_drafts đang sử dụng frame này
    const { count: draftsCount } = await supabase
      .from('card_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('frame_id', id);

    if (draftsCount && draftsCount > 0) {
      const { error: updateDraftsError } = await supabase
        .from('card_drafts')
        .update({ frame_id: null })
        .eq('frame_id', id);

      if (updateDraftsError) {
        console.error('Update drafts error:', updateDraftsError);
        return NextResponse.json(
          { error: `Failed to update related drafts: ${updateDraftsError.message}` },
          { status: 500 }
        );
      }
    }

    // Bước 2: Đếm và xử lý cards
    const { count: cardsCount } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('frame_id', id);

    if (cardsCount && cardsCount > 0) {
      // Thử set null trước
      const { error: updateCardsError } = await supabase
        .from('cards')
        .update({ frame_id: null })
        .eq('frame_id', id);

      if (updateCardsError) {
        // Nếu không thể set null (có thể là required), xóa cards
        const { error: deleteCardsError } = await supabase
          .from('cards')
          .delete()
          .eq('frame_id', id);

        if (deleteCardsError) {
          console.error('Delete cards error:', deleteCardsError);
          return NextResponse.json(
            { error: `Failed to handle related cards: ${deleteCardsError.message}` },
            { status: 500 }
          );
        }
      }
    }

    // Bước 3: Xóa photo frame
    const { error: deleteFrameError } = await supabase
      .from('photo_frames')
      .delete()
      .eq('id', id);

    if (deleteFrameError) {
      console.error('Delete frame error:', deleteFrameError);
      return NextResponse.json(
        { error: deleteFrameError.message || 'Failed to delete photo frame' },
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

