import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { code, user_id } = body;

    console.log('Redeem request:', { code, user_id: user_id ? 'present' : 'missing' });

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập mã khuyến mãi' }, { status: 400 });
    }

    if (!user_id || user_id.trim() === '') {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để sử dụng mã khuyến mãi' }, { status: 401 });
    }

    // Xác thực user từ session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để sử dụng mã khuyến mãi' }, { status: 401 });
    }

    // Đảm bảo user_id từ request khớp với user đã đăng nhập
    if (authUser.id !== user_id) {
      return NextResponse.json({ error: 'User ID không khớp' }, { status: 403 });
    }

    // Kiểm tra và tạo user nếu chưa có trong bảng users
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, points')
      .eq('id', user_id)
      .single();

    if (!existingUser) {
      // Tạo user mới trong bảng users từ thông tin auth
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
          avatar: authUser.user_metadata?.avatar_url || null,
          provider: authUser.app_metadata?.provider || null,
          points: 1000, // ✅ User mới nhận 1000 đồng xu ban đầu
          role: 'user',
        });

      if (createError) {
        console.error('Create user error:', createError);
        return NextResponse.json({ error: 'Không thể tạo user. Vui lòng thử lại.' }, { status: 500 });
    }
    }

    // Sử dụng function Supabase để redeem an toàn hơn
    const { data: result, error: functionError } = await supabase.rpc('redeem_promo_code', {
      p_code: code.trim(),
      p_user_id: user_id,
    });

    if (functionError) {
      console.error('Function error:', functionError);
      return NextResponse.json({ error: 'Lỗi xử lý mã khuyến mãi' }, { status: 500 });
    }

    if (!result || !result.success) {
      const errorMessage = result?.error || 'Không thể đổi mã khuyến mãi';
      // Xử lý trường hợp USER_NOT_FOUND (không nên xảy ra vì đã tạo ở trên)
      if (errorMessage === 'USER_NOT_FOUND') {
        return NextResponse.json({ error: 'Không tìm thấy user. Vui lòng đăng nhập lại.' }, { status: 404 });
      }
      const statusCode = errorMessage.includes('Không tìm thấy') ? 404 : 400;
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: result.message || `Nhận thành công ${result.tym_received} Tym!`,
      tym_received: result.tym_received,
      new_balance: result.new_balance,
    });

  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}