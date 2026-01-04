// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { serverLogger } from '@/lib/server-logger';

/**
 * GET /api/admin/users
 * Lấy danh sách tất cả users (chỉ admin)
 * Sử dụng admin client với service role key để bypass RLS
 */
export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    serverLogger.logRequest('GET', '/api/admin/users');

    // 1. Verify user authentication với regular client
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      serverLogger.warn('Unauthorized GET admin/users', {});
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Kiểm tra quyền admin với regular client (có thể bị RLS nhưng vẫn check được chính mình)
    const { data: userData, error: userErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userErr || !userData || userData.role !== 'admin') {
      serverLogger.warn('Non-admin attempted to access admin/users', { userId: user.id });
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    // 3. Sử dụng admin client (service role key) để bypass RLS và lấy tất cả users
    const adminSupabase = createAdminClient();

    // Kiểm tra và tự động downgrade subscriptions hết hạn
    await adminSupabase.rpc('check_and_downgrade_expired_subscriptions');

    // Lấy tất cả users (bypass RLS)
    const { data, error } = await adminSupabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      serverLogger.logDbOperation('SELECT', 'users', {
        userId: user.id,
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('GET', '/api/admin/users', {
      userId: user.id,
      duration,
      count: data?.length || 0,
    });

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('GET', '/api/admin/users', e);
    
    // Nếu lỗi do thiếu service role key, trả về error message rõ ràng
    if (e?.message?.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ 
        error: 'Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY. Please add this environment variable to enable admin features.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

