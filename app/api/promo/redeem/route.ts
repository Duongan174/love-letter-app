import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { code, user_id } = await request.json();

    if (!code || !user_id) {
      return NextResponse.json({ error: 'Thiếu mã hoặc user_id' }, { status: 400 });
    }

    const { data: promo, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .single();

    if (promoError) {
      console.error('Promo lookup error:', promoError);
      return NextResponse.json({ error: 'Không thể kiểm tra mã khuyến mãi' }, { status: 500 });
    }

    if (!promo) {
      return NextResponse.json({ error: 'Mã không tồn tại' }, { status: 400 });
    }

    if (!promo.is_active) {
      return NextResponse.json({ error: 'Mã đã ngừng hoạt động' }, { status: 400 });
    }

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Mã đã hết hạn' }, { status: 400 });
    }

    if (promo.current_uses >= promo.max_uses) {
      return NextResponse.json({ error: 'Mã đã hết lượt sử dụng' }, { status: 400 });
    }

    const { data: existingUse } = await supabase
      .from('promo_code_uses')
      .select('id')
      .eq('promo_code_id', promo.id)
      .eq('user_id', user_id)
      .single();

    if (existingUse) {
      return NextResponse.json({ error: 'Bạn đã sử dụng mã này rồi' }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 });
    }

    const newPoints = (user.points || 0) + promo.points;
    
    await supabase
      .from('users')
      .update({ points: newPoints })
      .eq('id', user_id);

    await supabase.from('promo_code_uses').insert([{
      promo_code_id: promo.id,
      user_id: user_id,
    }]);

    await supabase
      .from('promo_codes')
      .update({ current_uses: promo.current_uses + 1 })
      .eq('id', promo.id);

    return NextResponse.json({
      success: true,
      message: `Nhận thành công ${promo.points} Tym!`,
      tym_received: promo.points,
      new_balance: newPoints,
    });

  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}