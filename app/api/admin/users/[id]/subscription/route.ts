// app/api/admin/users/[id]/subscription/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';

function isUuid(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

/**
 * PATCH /api/admin/users/[id]/subscription
 * Cập nhật subscription của user (chỉ admin)
 */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const startTime = Date.now();
  try {
    const { id } = await ctx.params;
    if (!isUuid(id)) {
      serverLogger.warn('Invalid UUID in PATCH user subscription', { id });
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    serverLogger.logRequest('PATCH', `/api/admin/users/${id}/subscription`);

    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      serverLogger.warn('Unauthorized PATCH user subscription', { userId: id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra quyền admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      serverLogger.warn('Non-admin attempted to update user subscription', { userId: id, adminId: user.id });
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { subscription_tier, months } = body;

    // Validation
    const validTiers = ['free', 'plus', 'pro', 'ultra'];
    if (!validTiers.includes(subscription_tier)) {
      return NextResponse.json(
        { error: `Invalid subscription_tier. Must be one of: ${validTiers.join(', ')}` },
        { status: 400 }
      );
    }

    // Tính toán expires_at
    let subscription_expires_at: string | null = null;
    if (subscription_tier === 'free') {
      subscription_expires_at = null; // Free tier không có expiry
    } else if (months && months > 0) {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + months);
      subscription_expires_at = expiryDate.toISOString();
    } else {
      return NextResponse.json(
        { error: 'months is required for paid tiers (plus, pro, ultra)' },
        { status: 400 }
      );
    }

    // Update subscription
    const { data, error } = await supabase
      .from('users')
      .update({
        subscription_tier,
        subscription_expires_at,
      })
      .eq('id', id)
      .select('id, subscription_tier, subscription_expires_at')
      .maybeSingle();

    if (error) {
      serverLogger.logDbOperation('UPDATE', 'users', {
        recordId: id,
        userId: user.id,
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      serverLogger.warn('User not found for subscription update', { userId: id, adminId: user.id });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('PATCH', `/api/admin/users/${id}/subscription`, {
      userId: user.id,
      duration,
      subscriptionTier: subscription_tier,
      months,
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('PATCH', '/api/admin/users/[id]/subscription', e);
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

