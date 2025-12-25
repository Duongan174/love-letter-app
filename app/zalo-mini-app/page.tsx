'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Send, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCard } from '@/hooks/useCreateCard';
import Loading from '@/components/ui/Loading';

/**
 * Zalo Mini App Page
 * 
 * This page is designed to work within Zalo Mini App environment.
 * Users can create and send cards directly from Zalo without leaving the app.
 */
function ZaloMiniAppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { state, nextStep, prevStep } = useCreateCard();
  const [zaloUser, setZaloUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get Zalo user info from Zalo SDK
    if (typeof window !== 'undefined' && (window as any).ZaloSDK) {
      (window as any).ZaloSDK.getProfile((response: any) => {
        if (response.returnCode === 1) {
          setZaloUser(response.data);
        }
        setLoading(false);
      });
    } else {
      // Fallback for web testing
      setLoading(false);
    }
  }, []);

  const handleSendInZalo = async () => {
    try {
      // Create card
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: searchParams.get('draftId'),
        }),
      });

      const data = await response.json();
      if (data.data?.id) {
        const cardUrl = `${window.location.origin}/card/${data.data.id}`;
        
        // Send via Zalo chat
        if (typeof window !== 'undefined' && (window as any).ZaloSDK) {
          (window as any).ZaloSDK.share({
            type: 'link',
            link: cardUrl,
            title: 'Thiệp chúc mừng từ Vintage E-Card',
            desc: state.message || 'Một tấm thiệp đặc biệt dành cho bạn',
            thumb: state.envelope?.thumbnail || '',
          }, (response: any) => {
            if (response.returnCode === 1) {
              alert('Đã gửi thiệp thành công!');
            }
          });
        } else {
          // Fallback: copy link
          navigator.clipboard.writeText(cardUrl);
          alert('Đã copy link thiệp! Dán vào Zalo chat để gửi.');
        }
      }
    } catch (error) {
      console.error('Error sending card:', error);
      alert('Có lỗi xảy ra khi gửi thiệp!');
    }
  };

  if (authLoading || loading) {
    return <Loading text="Đang tải Zalo Mini App..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Zalo Mini App Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Vintage E-Card</h1>
            <p className="text-xs text-gray-500">Tạo thiệp trong Zalo</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {zaloUser && (
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-600">
              Xin chào, <strong>{zaloUser.name}</strong>!
            </p>
          </div>
        )}

        {/* Card Preview */}
        <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Xem trước thiệp</h2>
          {/* Card preview component */}
          <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
            <Heart className="w-16 h-16 text-rose-400" />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendInZalo}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg"
          >
            <Send className="w-5 h-5" />
            <span>Gửi trong Zalo</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Share to Zalo Story
              if (typeof window !== 'undefined' && (window as any).ZaloSDK) {
                (window as any).ZaloSDK.share({
                  type: 'photo',
                  link: `${window.location.origin}/card/${(state as any).cardId || 'preview'}`,
                });
              }
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-semibold"
          >
            <Share2 className="w-5 h-5" />
            <span>Chia sẻ lên Story</span>
          </motion.button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            💡 <strong>Mẹo:</strong> Bạn có thể tạo thiệp ngay trong Zalo và gửi cho bạn bè mà không cần thoát app!
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function ZaloMiniAppPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ZaloMiniAppContent />
    </Suspense>
  );
}
