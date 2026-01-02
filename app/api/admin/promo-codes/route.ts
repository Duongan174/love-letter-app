// app/api/admin/promo-codes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/admin/promo-codes
 * Xóa promo code và các records liên quan trong promo_code_uses
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
      return NextResponse.json({ error: 'Missing promo code id' }, { status: 400 });
    }

    // Bước 1: Đếm và xóa các records trong promo_code_uses
    const { count: usesCount } = await supabase
      .from('promo_code_uses')
      .select('*', { count: 'exact', head: true })
      .eq('promo_code_id', id);

    if (usesCount && usesCount > 0) {
      const { error: deleteUsesError } = await supabase
        .from('promo_code_uses')
        .delete()
        .eq('promo_code_id', id);

      if (deleteUsesError) {
        console.error('Delete promo_code_uses error:', deleteUsesError);
        return NextResponse.json(
          { error: `Failed to delete related uses: ${deleteUsesError.message}` },
          { status: 500 }
        );
      }
    }

    // Bước 2: Xóa promo code
    const { error: deletePromoError } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id);

    if (deletePromoError) {
      console.error('Delete promo code error:', deletePromoError);
      return NextResponse.json(
        { error: deletePromoError.message || 'Failed to delete promo code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      deletedUses: usesCount || 0
    }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

