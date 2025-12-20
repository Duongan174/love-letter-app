// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Next.js 16: cookies() có thể là async (TS sẽ báo "Did you forget to use await?")
 * Dùng @supabase/ssr để sync session bằng cookies đúng chuẩn App Router.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        // cookieStore.getAll() -> { name, value }[]
        return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet) {
        // Trong một số ngữ cảnh RSC, set có thể bị chặn -> swallow để tránh crash.
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set({
              name,
              value,
              ...(options ?? ({} as CookieOptions)),
            });
          } catch {
            // ignore
          }
        });
      },
    },
  });
}

// Backward compatible alias (nếu code cũ còn import supabaseServer)
export const supabaseServer = createClient;
