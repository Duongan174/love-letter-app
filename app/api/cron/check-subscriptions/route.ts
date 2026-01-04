// app/api/cron/check-subscriptions/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';
import { sendSubscriptionExpiryEmail } from '@/lib/email-service';

/**
 * POST /api/cron/check-subscriptions
 * Cron job để tự động kiểm tra và downgrade subscriptions hết hạn
 * Có thể gọi từ Vercel Cron hoặc external cron service
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    // Kiểm tra authorization header (bảo mật cho cron job)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      serverLogger.warn('Unauthorized cron request', {});
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    serverLogger.logRequest('POST', '/api/cron/check-subscriptions');

    const supabase = await createClient();

    // 1. Gọi function để tự động downgrade subscriptions hết hạn
    const { error: downgradeError } = await supabase.rpc('check_and_downgrade_expired_subscriptions');

    if (downgradeError) {
      serverLogger.logDbOperation('RPC', 'check_and_downgrade_expired_subscriptions', {
        error: downgradeError,
      });
      return NextResponse.json({ error: downgradeError.message }, { status: 500 });
    }

    // 2. Tìm users có subscription sắp hết hạn trong 7 ngày tới
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: expiringUsers, error: expiringError } = await supabase
      .from('users')
      .select('id, email, name, subscription_tier, subscription_expires_at')
      .in('subscription_tier', ['plus', 'pro', 'ultra'])
      .not('subscription_expires_at', 'is', null)
      .gte('subscription_expires_at', today.toISOString())
      .lte('subscription_expires_at', sevenDaysFromNow.toISOString());

    if (expiringError) {
      serverLogger.logDbOperation('SELECT', 'users', {
        error: expiringError,
      });
      // Không return error, chỉ log và tiếp tục
    }

    // 3. Gửi email notification cho từng user
    let emailsSent = 0;
    let emailsFailed = 0;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (expiringUsers && expiringUsers.length > 0) {
      for (const user of expiringUsers) {
        if (!user.email) continue;

        // Kiểm tra xem đã gửi email cho expiry date này chưa
        const expiryDate = new Date(user.subscription_expires_at!);
        const expiryDateStr = expiryDate.toISOString().split('T')[0]; // YYYY-MM-DD

        const { data: existingEmail } = await supabase
          .from('subscription_expiry_emails')
          .select('id')
          .eq('user_id', user.id)
          .eq('expiry_date', expiryDateStr)
          .maybeSingle();

        // Nếu đã gửi rồi, skip
        if (existingEmail) {
          serverLogger.info('Subscription expiry email already sent', {
            userId: user.id,
            expiryDate: expiryDateStr,
          });
          continue;
        }

        // Gửi email
        const renewalUrl = `${appUrl}/services?tier=${user.subscription_tier}`;
        const result = await sendSubscriptionExpiryEmail({
          to: user.email,
          userName: user.name || 'Bạn',
          subscriptionTier: user.subscription_tier as 'plus' | 'pro' | 'ultra',
          expiryDate: user.subscription_expires_at!,
          renewalUrl,
        });

        if (result.success) {
          // Lưu record đã gửi email
          await supabase.from('subscription_expiry_emails').insert({
            user_id: user.id,
            subscription_tier: user.subscription_tier,
            expiry_date: expiryDateStr,
          });
          emailsSent++;
          serverLogger.info('Subscription expiry email sent', {
            userId: user.id,
            email: user.email,
            subscriptionTier: user.subscription_tier,
          });
        } else {
          emailsFailed++;
          serverLogger.error('Failed to send subscription expiry email', new Error(result.error || 'Unknown error'), {
            userId: user.id,
            email: user.email,
          });
        }
      }
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('POST', '/api/cron/check-subscriptions', {
      duration,
      emailsSent,
      emailsFailed,
      expiringUsersCount: expiringUsers?.length || 0,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Subscription check completed',
      timestamp: new Date().toISOString(),
      stats: {
        expiringUsers: expiringUsers?.length || 0,
        emailsSent,
        emailsFailed,
      }
    }, { status: 200 });
  } catch (e: any) {
    serverLogger.logApiError('POST', '/api/cron/check-subscriptions', e);
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

/**
 * GET /api/cron/check-subscriptions
 * Cho phép test endpoint (chỉ trong development)
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  return POST(req);
}

