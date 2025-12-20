import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

function resolveEmail(user: any): string | null {
  const meta = user?.user_metadata ?? {};
  const email = user?.email ?? meta.email ?? null;
  if (!email || typeof email !== 'string' || !email.trim()) return null;
  return email.trim();
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; next?: string };
}) {
  const supabase = await supabaseServer();

  const code = searchParams.code;
  const next = searchParams.next ?? '/';

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) console.error('exchangeCodeForSession error:', error.message);
  }

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
            email, // ✅ luôn string
            name: meta.full_name ?? meta.name ?? null,
            avatar: meta.avatar_url ?? null,
            provider: appMeta.provider ?? null,
          },
          { onConflict: 'id' }
        );
    }
  }

  redirect(next);
}
