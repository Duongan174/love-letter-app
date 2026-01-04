// app/api/legal-requests/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';

/**
 * POST /api/legal-requests
 * Tạo yêu cầu pháp lý mới
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    serverLogger.logRequest('POST', '/api/legal-requests');

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    // Cho phép cả user đã đăng nhập và chưa đăng nhập gửi yêu cầu
    // Nếu chưa đăng nhập, user_id sẽ là null

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { request_type, subject, message, email } = body;

    // Validation
    if (!request_type || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: request_type, subject, message' },
        { status: 400 }
      );
    }

    const validRequestTypes = ['content_removal', 'privacy_complaint', 'data_access', 'copyright'];
    if (!validRequestTypes.includes(request_type)) {
      return NextResponse.json(
        { error: `Invalid request_type. Must be one of: ${validRequestTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Nếu user đã đăng nhập, sử dụng email từ tài khoản nếu không có email trong body
    const finalEmail = email || user?.email || null;

    // Tạo yêu cầu pháp lý
    const { data, error } = await supabase
      .from('legal_requests')
      .insert({
        user_id: user?.id || null,
        request_type,
        subject,
        message,
        email: finalEmail,
        status: 'pending',
        priority: request_type === 'copyright' ? 'high' : 'normal', // Copyright requests có priority cao hơn
      })
      .select('id, request_type, subject, status, created_at')
      .single();

    if (error) {
      serverLogger.logDbOperation('INSERT', 'legal_requests', {
        userId: user?.id || 'anonymous',
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('POST', '/api/legal-requests', {
      userId: user?.id || 'anonymous',
      duration,
      requestType: request_type,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: data.id,
          message: 'Yêu cầu pháp lý của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và phản hồi trong vòng 7-14 ngày làm việc.',
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    serverLogger.logApiError('POST', '/api/legal-requests', e);
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

/**
 * GET /api/legal-requests
 * Lấy danh sách yêu cầu pháp lý (chỉ admin hoặc user xem yêu cầu của chính mình)
 */
export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    serverLogger.logRequest('GET', '/api/legal-requests');

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      serverLogger.warn('Unauthorized GET legal-requests', {});
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra xem user có phải admin không
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = userData?.role === 'admin';

    // Nếu là admin, lấy tất cả requests. Nếu không, chỉ lấy requests của user đó
    let query = supabase
      .from('legal_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      serverLogger.logDbOperation('SELECT', 'legal_requests', {
        userId: user.id,
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('GET', '/api/legal-requests', {
      userId: user.id,
      duration,
      isAdmin,
      count: data?.length || 0,
    });

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('GET', '/api/legal-requests', e);
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

