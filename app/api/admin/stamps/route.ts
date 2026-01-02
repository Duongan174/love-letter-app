// app/api/admin/stamps/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/admin/stamps
 * Xóa stamp và các drafts/cards liên quan
 * 
 * Thứ tự xóa:
 * 1. Xóa các card_drafts đang sử dụng stamp này
 * 2. Xóa các cards đang sử dụng stamp này (nếu có)
 * 3. Xóa stamp
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
      return NextResponse.json({ error: 'Missing stamp id' }, { status: 400 });
    }

    // Bước 1: Đếm và xóa tất cả card_drafts đang sử dụng stamp này
    const { count: draftsCount } = await supabase
      .from('card_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('stamp_id', id);

    const { error: deleteDraftsError } = await supabase
      .from('card_drafts')
      .delete()
      .eq('stamp_id', id);

    if (deleteDraftsError) {
      console.error('Delete drafts error:', deleteDraftsError);
      return NextResponse.json(
        { error: `Failed to delete related drafts: ${deleteDraftsError.message}` },
        { status: 500 }
      );
    }

    // Bước 2: Đếm và xóa các cards đang sử dụng stamp này (nếu có)
    const { count: cardsCount } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('stamp_id', id);

    if (cardsCount && cardsCount > 0) {
      const { error: deleteCardsError } = await supabase
        .from('cards')
        .delete()
        .eq('stamp_id', id);

      if (deleteCardsError) {
        console.error('Delete cards error:', deleteCardsError);
        return NextResponse.json(
          { error: `Failed to delete related cards: ${deleteCardsError.message}` },
          { status: 500 }
        );
      }
    }

    // Bước 3: Xóa stamp
    const { error: deleteStampError } = await supabase
      .from('stamps')
      .delete()
      .eq('id', id);

    if (deleteStampError) {
      console.error('Delete stamp error:', deleteStampError);
      return NextResponse.json(
        { error: deleteStampError.message || 'Failed to delete stamp' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      deletedDrafts: draftsCount || 0,
      deletedCards: cardsCount || 0
    }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

