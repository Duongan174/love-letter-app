// hooks/useAuth.tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { User as SbUser } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase/client';

type Role = 'admin' | 'user' | string;

export type AppUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  provider: string | null;
  points: number;
  role: Role;
};

type AuthCtx = {
  user: AppUser | null;
  /** Only for initial bootstrapping. Not toggled for TOKEN_REFRESHED. */
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

function normalizeUnknownError(err: unknown) {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  if (typeof err === 'string') return { message: err };
  if (err && typeof err === 'object') {
    const e = err as any;
    const keys = Object.keys(e);
    return {
      keys,
      message: e.message,
      code: e.code,
      details: e.details,
      hint: e.hint,
      status: e.status,
      raw: keys.length ? e : String(err),
    };
  }
  return { message: String(err) };
}

function buildFallbackUser(sbUser: SbUser): AppUser {
  const meta: any = sbUser.user_metadata ?? {};
  const appMeta: any = sbUser.app_metadata ?? {};
  return {
    id: sbUser.id,
    email: sbUser.email ?? null,
    name: meta.full_name ?? meta.name ?? null,
    avatar: meta.avatar_url ?? null,
    provider: appMeta.provider ?? null,
    points: 0,
    role: 'user',
  };
}

function resolveEmail(sbUser: SbUser): string | null {
  const meta: any = sbUser.user_metadata ?? {};
  const email = (sbUser.email ?? meta.email ?? '').trim();
  return email ? email : null;
}

async function fetchProfile(sbUser: SbUser): Promise<AppUser> {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from('users')
    .select('id,email,name,avatar,provider,points,role')
    .eq('id', sbUser.id)
    .maybeSingle();

  if (error) {
    console.warn('fetchProfile error:', normalizeUnknownError(error));
    return buildFallbackUser(sbUser);
  }

  if (!data) {
    const meta: any = sbUser.user_metadata ?? {};
    const appMeta: any = sbUser.app_metadata ?? {};

    const email = resolveEmail(sbUser);
    if (!email) return buildFallbackUser(sbUser);

    const insertPayload = {
      id: sbUser.id,
      email,
      name: meta.full_name ?? meta.name ?? null,
      avatar: meta.avatar_url ?? null,
      provider: appMeta.provider ?? null,
    };

    const ins = await supabase
      .from('users')
      .insert(insertPayload)
      .select('id,email,name,avatar,provider,points,role')
      .maybeSingle();

    if (ins.error || !ins.data) {
      console.warn('createProfile error:', normalizeUnknownError(ins.error));
      return buildFallbackUser(sbUser);
    }

    return {
      id: ins.data.id,
      email: ins.data.email ?? null,
      name: ins.data.name ?? null,
      avatar: ins.data.avatar ?? null,
      provider: ins.data.provider ?? null,
      points: Number((ins.data as any).points ?? 0),
      role: ((ins.data as any).role ?? 'user') as Role,
    };
  }

  return {
    id: data.id,
    email: data.email ?? null,
    name: data.name ?? null,
    avatar: data.avatar ?? null,
    provider: data.provider ?? null,
    points: Number((data as any).points ?? 0),
    role: ((data as any).role ?? 'user') as Role,
  };
}

/**
 * ✅ Lấy user có timeout nhưng KHÔNG throw.
 * NOTE: background tabs can throttle timers; we only use this for initial / manual refresh.
 */
async function getUserSafe(
  supabase: ReturnType<typeof supabaseBrowser>,
  timeoutMs = 12000
): Promise<{ user: SbUser | null; timedOut: boolean; error?: unknown }> {
  let timer: number | undefined;

  try {
    const timeoutPromise = new Promise<{ kind: 'timeout' }>((resolve) => {
      timer = window.setTimeout(() => resolve({ kind: 'timeout' as const }), timeoutMs);
    });

    const res = await Promise.race([
      supabase.auth.getUser().then((r) => ({ kind: 'ok' as const, r })),
      timeoutPromise,
    ]);

    if (res.kind === 'timeout') {
      return { user: null, timedOut: true, error: new Error('supabase.auth.getUser timeout') };
    }

    const { data, error } = res.r;
    if (error) return { user: null, timedOut: false, error };

    return { user: data.user ?? null, timedOut: false };
  } catch (err) {
    return { user: null, timedOut: false, error: err };
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [user, setUser] = useState<AppUser | null>(null);

  // ✅ Keep latest user presence without re-subscribing auth listener
  const hasUserRef = useRef(false);
  useEffect(() => {
    hasUserRef.current = !!user;
  }, [user]);

  // ✅ Only for initial boot. Not toggled for TOKEN_REFRESHED/USER_UPDATED.
  const [loading, setLoading] = useState(true);

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const applyProfileFromSbUser = useCallback(async (sbUser: SbUser) => {
    try {
      const prof = await fetchProfile(sbUser);
      if (aliveRef.current) {
        // ✅ FIX 3 — Tránh re-render layout vì auth change nhỏ
        // Chỉ update nếu user thực sự thay đổi (so sánh id và các field quan trọng)
        setUser(prev => {
          if (prev?.id === prof.id && 
              prev?.email === prof.email && 
              prev?.name === prof.name && 
              prev?.avatar === prof.avatar &&
              prev?.points === prof.points &&
              prev?.role === prof.role) {
            return prev; // Giữ nguyên reference để tránh re-render
          }
          return prof;
        });
      }
    } catch (err) {
      console.warn('fetchProfile unexpected warn:', normalizeUnknownError(err));
      if (aliveRef.current) {
        const fallbackUser = buildFallbackUser(sbUser);
        setUser(prev => {
          if (prev?.id === fallbackUser.id && 
              prev?.email === fallbackUser.email && 
              prev?.name === fallbackUser.name && 
              prev?.avatar === fallbackUser.avatar &&
              prev?.points === fallbackUser.points &&
              prev?.role === fallbackUser.role) {
            return prev;
          }
          return fallbackUser;
        });
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const { user: sbUser, timedOut, error } = await getUserSafe(supabase, 12000);

    if (error) {
      console.warn('refreshProfile warn:', { timedOut, ...normalizeUnknownError(error) });
    }

    // If timeout, keep current user to avoid UI flicker / false logout.
    if (!sbUser) {
      if (!timedOut && aliveRef.current) setUser(null);
      return;
    }

    await applyProfileFromSbUser(sbUser);
  }, [applyProfileFromSbUser, supabase]);

  useEffect(() => {
    // Initial bootstrap
    (async () => {
      try {
        await refreshProfile();
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    })();

    // Auth events (fast path): use session.user directly to avoid hanging getUser() when tab switches.
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT') {
          if (aliveRef.current) setUser(null);
          return;
        }

        const sbUser = session?.user ?? null;

        // ✅ Don't show full-screen loading for token refreshes (prevents admin stuck spinner).
        const shouldShowLoading = event === 'SIGNED_IN' && !hasUserRef.current;

        if (shouldShowLoading && aliveRef.current) setLoading(true);

        if (sbUser) {
          await applyProfileFromSbUser(sbUser);
        } else {
          // rare fallback
          await refreshProfile();
        }
      } catch (err) {
        console.warn('onAuthStateChange warn:', normalizeUnknownError(err));
        // Don't force logout on transient refresh issues
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
    // Intentionally not depending on `user` to avoid resubscribe loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyProfileFromSbUser, refreshProfile, supabase]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) console.warn('signIn google warn:', normalizeUnknownError(error));
  }, [supabase]);

  const signInWithFacebook = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) console.warn('signIn facebook warn:', normalizeUnknownError(error));
  }, [supabase]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.warn('signOut warn:', normalizeUnknownError(error));
  }, [supabase]);

  const value: AuthCtx = useMemo(
    () => ({ user, loading, signInWithGoogle, signInWithFacebook, signOut, refreshProfile }),
    [user, loading, signInWithGoogle, signInWithFacebook, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider />');
  return ctx;
}
