// app/api/legal-requests/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';

function isUuid(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

/**
 * GET /api/legal-requests/[id]
 * Lấy chi tiết một yêu cầu pháp lý
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const startTime = Date.now();
  try {
    const { id } = await ctx.params;
    if (!isUuid(id)) {
      serverLogger.warn('Invalid UUID in GET legal-request', { id });
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    serverLogger.logRequest('GET', `/api/legal-requests/${id}`);

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      serverLogger.warn('Unauthorized GET legal-request', { requestId: id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra quyền: user chỉ xem được request của mình, admin xem được tất cả
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = userData?.role === 'admin';

    let query = supabase
      .from('legal_requests')
      .select('*')
      .eq('id', id);

    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      serverLogger.logDbOperation('SELECT', 'legal_requests', {
        recordId: id,
        userId: user.id,
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      serverLogger.warn('Legal request not found', { requestId: id, userId: user.id });
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('GET', `/api/legal-requests/${id}`, {
      userId: user.id,
      duration,
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('GET', '/api/legal-requests/[id]', e);
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

/**
 * PATCH /api/legal-requests/[id]
 * Cập nhật yêu cầu pháp lý (chỉ admin)
 */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const startTime = Date.now();
  try {
    const { id } = await ctx.params;
    if (!isUuid(id)) {
      serverLogger.warn('Invalid UUID in PATCH legal-request', { id });
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    serverLogger.logRequest('PATCH', `/api/legal-requests/${id}`);

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      serverLogger.warn('Unauthorized PATCH legal-request', { requestId: id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Chỉ admin mới được cập nhật
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      serverLogger.warn('Non-admin attempted to update legal request', { requestId: id, userId: user.id });
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Whitelist các field có thể update
    const patch: Record<string, any> = {};
    const allowedFields = ['status', 'priority', 'assigned_to', 'response', 'resolved_at'] as const;

    for (const field of allowedFields) {
      if (field in body) {
        patch[field] = body[field];
      }
    }

    // Nếu status là 'resolved', tự động set resolved_at
    if (patch.status === 'resolved' && !patch.resolved_at) {
      patch.resolved_at = new Date().toISOString();
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('legal_requests')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      serverLogger.logDbOperation('UPDATE', 'legal_requests', {
        recordId: id,
        userId: user.id,
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      serverLogger.warn('Legal request not found for PATCH', { requestId: id, userId: user.id });
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('PATCH', `/api/legal-requests/${id}`, {
      userId: user.id,
      duration,
      updatedFields: Object.keys(patch),
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('PATCH', '/api/legal-requests/[id]', e);
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

