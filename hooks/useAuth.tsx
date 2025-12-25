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
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

function normalizeUnknownError(err: unknown) {
  // ✅ Log ra được message/stack thay vì {}
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
    // ✅ chưa có row user -> tạo tối thiểu
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
 * Nếu timeout / network fail → trả { user: null } để app không kẹt.
 */
async function getUserSafe(
  supabase: ReturnType<typeof supabaseBrowser>,
  timeoutMs = 12000
): Promise<{ user: SbUser | null; timedOut: boolean; error?: unknown }> {
  let timer: number | undefined;

  try {
    const timeoutPromise = new Promise<{ kind: 'timeout' }>((resolve) => {
      timer = window.setTimeout(() => {
        resolve({ kind: 'timeout' as const });
      }, timeoutMs);
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
  const [loading, setLoading] = useState(true);

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    const { user: sbUser, timedOut, error } = await getUserSafe(supabase, 12000);

    if (error) {
      // ✅ Không còn console.error {} gây khó chịu nữa
      // Chỉ warn để debug, app vẫn chạy và không kẹt
      console.warn('refreshProfile warn:', { timedOut, ...normalizeUnknownError(error) });
    }

    // ⚠️ CRITICAL: Nếu timeout, không set user = null (giữ nguyên user hiện tại)
    // Chỉ set null nếu thực sự không có user (không phải timeout)
    if (!sbUser) {
      // Chỉ set null nếu không phải timeout (có thể là thực sự đã logout)
      // Nếu timeout, giữ nguyên user hiện tại để không bị đăng xuất
      if (!timedOut && aliveRef.current) {
        setUser(null);
      }
      return;
    }

    try {
      const prof = await fetchProfile(sbUser);
      if (aliveRef.current) setUser(prof);
    } catch (err) {
      console.warn('fetchProfile unexpected warn:', normalizeUnknownError(err));
      if (aliveRef.current) setUser(buildFallbackUser(sbUser));
    }
  }, [supabase]);

  useEffect(() => {
    (async () => {
      try {
        await refreshProfile();
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      try {
        if (event === 'SIGNED_OUT') {
          if (aliveRef.current) setUser(null);
          return;
        }

        if (aliveRef.current) setLoading(true);
        await refreshProfile();
      } catch (err) {
        console.warn('onAuthStateChange warn:', normalizeUnknownError(err));
        if (aliveRef.current) setUser(null);
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [refreshProfile, supabase]);

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
