'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          router.replace('/auth?error=auth_failed');
          return;
        }

        if (session?.user) {
          // Dùng đúng tên cột: name, avatar (không phải full_name, avatar_url)
          await supabase.from('users').upsert({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
            avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
            provider: session.user.app_metadata?.provider || 'google',
            points: 100,
            role: 'user',
          }, { onConflict: 'id' });

          router.replace('/dashboard');
        } else {
          router.replace('/auth');
        }
      } catch (err) {
        console.error('Error:', err);
        router.replace('/auth');
      }
    };

    setTimeout(handleCallback, 1000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}