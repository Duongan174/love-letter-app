// app/cards/new/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCardPage() {
  const router = useRouter();

  useEffect(() => {
    const createDraft = async () => {
      const res = await fetch('/api/cards', {
        method: 'POST',
      });

      if (!res.ok) {
        alert('Không thể tạo thiệp mới');
        return;
      }

      const card = await res.json();

      // 🔥 CHÍNH DÒNG NÀY LÀM MỌI THỨ THỨC DẬY
      router.replace(`/cards/${card.id}/edit`);
    };

    createDraft();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-sm text-gray-500">Đang tạo thiệp mới…</p>
    </div>
  );
}
