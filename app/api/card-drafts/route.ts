// app/api/card-drafts/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';

function isUuid(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

/**
 * GET /api/card-drafts
 * Lấy danh sách tất cả drafts của user hiện tại
 */
export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    serverLogger.logRequest('GET', '/api/card-drafts');

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      serverLogger.warn('Unauthorized GET card-drafts', {});
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lấy tất cả drafts của user, join với templates để có thông tin template
    const { data, error } = await supabase
      .from('card_drafts')
      .select(`
        *,
        card_templates (
          id,
          name,
          thumbnail,
          category
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false }); // Sắp xếp theo lần cập nhật gần nhất

    if (error) {
      serverLogger.logDbOperation('SELECT', 'card_drafts', {
        userId: user.id,
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('GET', '/api/card-drafts', {
      userId: user.id,
      duration,
      query: { count: data?.length || 0 },
    });

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('GET', '/api/card-drafts', e);
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const templateId = body?.templateId;
    if (!isUuid(templateId)) {
      return NextResponse.json({ error: 'templateId must be a UUID' }, { status: 400 });
    }

    // NOTE: Tên bảng/field phải đúng theo DB của bạn.
    // Giả định: card_drafts có user_id, template_id
    const { data, error } = await supabase
      .from('card_drafts')
      .insert({
        user_id: user.id,
        template_id: templateId,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}
