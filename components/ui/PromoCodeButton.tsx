'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';
import PromoCodeModal from './PromoCodeModal';

interface PromoCodeButtonProps {
  userId: string;
  onBalanceUpdate?: (newBalance: number) => void;
}

export default function PromoCodeButton({ userId, onBalanceUpdate }: PromoCodeButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:opacity-90 transition shadow-lg"
      >
        <Gift className="w-5 h-5" />
        <span className="font-medium">Nhập mã</span>
      </button>

      <PromoCodeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        onSuccess={(newBalance) => {
          if (onBalanceUpdate) {
            onBalanceUpdate(newBalance);
          }
        }}
      />
    </>
  );
}