// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function resolveEmail(user: any): string | null {
  const meta = user?.user_metadata ?? {};
  const email = user?.email ?? meta.email ?? null;
  if (!email || typeof email !== 'string' || !email.trim()) return null;
  return email.trim();
}

/**
 * Supabase OAuth callback
 * - MUST be a Route Handler to allow setting auth cookies (App Router).
 * - Also protects against open-redirect via `next` param.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get('code');
  const nextParam = url.searchParams.get('next') ?? '/';

  // Security: prevent open-redirect
  const next =
    nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  if (!code) {
    return NextResponse.redirect(new URL(`/auth?error=missing_code`, url.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  // Optional: sync user to public.users (giữ nguyên logic bạn đang dùng)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const meta: any = user.user_metadata ?? {};
    const appMeta: any = user.app_metadata ?? {};
    const email = resolveEmail(user);

    // ✅ nếu DB email NOT NULL mà không có email -> skip upsert để khỏi lỗi
    if (email) {
      await supabase
        .from('users')
        .upsert(
          {
            id: user.id,
            email,
            name: meta.full_name ?? meta.name ?? null,
            avatar: meta.avatar_url ?? null,
            provider: appMeta.provider ?? null,
          },
          { onConflict: 'id' }
        );
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
