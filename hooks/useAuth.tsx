// hooks/useAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
// Đảm bảo bạn có file types định nghĩa User, nếu chưa có thì thay User bằng any tạm thời
import { User } from '@/types'; 

export function useAuth() {
  const [user, setUser] = useState<User | any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hàm xử lý: Lấy thông tin User từ DB, nếu chưa có thì tạo mới
  const fetchUserProfile = async (sessionUser: any) => {
    if (!sessionUser) return null;

    try {
      // 1. Tìm user trong bảng 'users'
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (data) {
        return data;
      } 
      
      // 2. Nếu lỗi là do không tìm thấy (PGRST116) -> Tạo mới
      if (error?.code === 'PGRST116') {
        const newUser = {
          id: sessionUser.id,
          email: sessionUser.email || '',
          name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User',
          avatar: sessionUser.user_metadata?.avatar_url || sessionUser.user_metadata?.picture || null,
          role: 'user',
          points: 100, // Tặng 100 tym
          provider: sessionUser.app_metadata?.provider || 'email',
        };

        const { data: created, error: createError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (createError) {
          console.error('Lỗi tạo user mới:', createError);
          return null;
        }
        return created;
      }
      
      return null;
    } catch (err) {
      console.error('Lỗi fetch user:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Hàm khởi tạo Auth
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user);
          if (mounted) setUser(profile);
        } else {
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Lắng nghe thay đổi (Đăng nhập/Đăng xuất)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Chỉ fetch lại nếu chưa có user hoặc user thay đổi
        const profile = await fetchUserProfile(session.user);
        if (mounted) setUser(profile);
      } else {
        if (mounted) setUser(null);
        // Nếu đăng xuất -> redirect (Tuỳ chọn)
        if (event === 'SIGNED_OUT') {
           router.push('/auth');
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // --- CÁC HÀM HÀNH ĐỘNG ---

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert(error.message);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) alert(error.message);
  };

  const signInWithTikTok = async () => {
    alert('Tính năng đang bảo trì.');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth');
  };

  // Trả về trực tiếp, không dùng Context Provider nữa
  return { 
    user, 
    loading, 
    signInWithFacebook, 
    signInWithGoogle, 
    signInWithTikTok, 
    signOut 
  };
}