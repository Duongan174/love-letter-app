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
  points: number; // ✅ DB đang là points
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

function safeSbError(err: unknown) {
  if (!err || typeof err !== 'object') return { message: String(err) };
  const e = err as any;
  return {
    message: e.message,
    code: e.code,
    details: e.details,
    hint: e.hint,
    status: e.status,
  };
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
  // đa số OAuth có email, nhưng cứ phòng trường hợp
  const email = sbUser.email ?? meta.email ?? null;
  if (!email || typeof email !== 'string' || !email.trim()) return null;
  return email.trim();
}

async function fetchProfile(sbUser: SbUser): Promise<AppUser> {
  const supabase = supabaseBrowser();

  // ✅ đúng cột: points
  const { data, error } = await supabase
    .from('users')
    .select('id,email,name,avatar,provider,points,role')
    .eq('id', sbUser.id)
    .maybeSingle();

  if (error) {
    console.error('fetch profile error:', safeSbError(error));
    return buildFallbackUser(sbUser);
  }

  // nếu chưa có row -> tạo row tối thiểu
  if (!data) {
    const meta: any = sbUser.user_metadata ?? {};
    const appMeta: any = sbUser.app_metadata ?? {};

    const email = resolveEmail(sbUser);

    // ✅ nếu DB email NOT NULL mà bạn không có email → không insert (tránh crash)
    if (!email) return buildFallbackUser(sbUser);

    const insertPayload = {
      id: sbUser.id,
      email, // ✅ luôn là string
      name: meta.full_name ?? meta.name ?? null,
      avatar: meta.avatar_url ?? null,
      provider: appMeta.provider ?? null,
    };

    const ins = await supabase
      .from('users')
      .insert(insertPayload)
      .select('id,email,name,avatar,provider,points,role')
      .maybeSingle();

    if (ins.error) {
      console.error('create profile error:', safeSbError(ins.error));
      return buildFallbackUser(sbUser);
    }

    if (!ins.data) return buildFallbackUser(sbUser);

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
    const { data } = await supabase.auth.getUser();
    const sbUser = data.user;

    if (!sbUser) {
      if (aliveRef.current) setUser(null);
      return;
    }

    const prof = await fetchProfile(sbUser);
    if (aliveRef.current) setUser(prof);
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
      if (event === 'SIGNED_OUT') {
        if (aliveRef.current) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (aliveRef.current) setLoading(true);
      await refreshProfile();
      if (aliveRef.current) setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [refreshProfile, supabase]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) console.error('signIn google error:', safeSbError(error));
  }, [supabase]);

  const signInWithFacebook = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) console.error('signIn facebook error:', safeSbError(error));
  }, [supabase]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('signOut error:', safeSbError(error));
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
