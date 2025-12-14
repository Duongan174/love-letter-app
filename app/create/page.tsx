// app/create/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ChevronLeft, ChevronRight, X, 
  Home, AlertCircle 
} from 'lucide-react';

// Components
import StepIndicator from '@/components/create/StepIndicator';
import Step1Template from '@/components/create/Step1Template';
import Step2Envelope from '@/components/create/Step2Envelope';
import Step3Message from '@/components/create/Step3Message';
import Step4Photos from '@/components/create/Step4Photos';
import Step5Music from '@/components/create/Step5Music';
import Step6Signature from '@/components/create/Step6Signature';
import Step7Preview from '@/components/create/Step7Preview';

// Hooks & Utils
import { useAuth } from '../providers';
import { useCreateCard } from '@/hooks/useCreateCard';

export default function CreatePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    state,
    currentStep,
    selectTemplate,
    selectEnvelope,
    selectStamp,
    updateMessage,
    addPhoto,
    removePhoto,
    selectMusic,
    setSignature,
    nextStep,
    prevStep,
    canProceed,
    totalTymCost,
  } = useCreateCard();

  const [showExitModal, setShowExitModal] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?redirect=/create');
    }
  }, [user, authLoading, router]);

  // Handle browser back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep > 1) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep]);

  const handleExit = () => {
    if (currentStep > 1) {
      setShowExitModal(true);
    } else {
      router.push('/dashboard');
    }
  };

  // Tìm hàm handleSendCard và thay thế bằng:

const handleSendCard = async (): Promise<string> => {
  if (!user) throw new Error('Chưa đăng nhập');

  const cardData = {
    user_id: user.id,
    recipient_name: state.recipientName,
    recipient_email: state.recipientEmail || null,
    sender_name: state.senderName,
    message: state.message,
    font_style: state.fontStyle,
    text_effect: state.textEffect,
    photos: state.photos,
    signature_data: state.signatureData,
    signature_url: state.signatureUrl,
    envelope_id: state.envelope?.id || null,
    envelope_color: state.envelope?.color || '#f8b4c4',
    stamp_id: state.stamp?.id || null,
    music_id: state.music?.id || null,
    tym_cost: state.totalTymCost,
  };

  const res = await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });

  const result = await res.json();
  
  if (result.error) {
    throw new Error(result.error);
  }

  return result.data.id;
};

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={handleExit}
              className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Thoát</span>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
              <span className="font-bold text-gray-800">Tạo Thiệp</span>
            </div>

            {/* Tym Balance */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full">
              <span className="text-lg">💜</span>
              <span className="font-bold text-rose-600">{user.points}</span>
              <span className="text-xs text-rose-500 hidden sm:inline">Tym</span>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Step Content */}
      <div className="pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="py-6"
          >
            {currentStep === 1 && (
              <Step1Template
                selectedId={state.templateId}
                onSelect={selectTemplate}
              />
            )}

            {currentStep === 2 && (
              <Step2Envelope
                selectedEnvelopeId={state.envelopeId}
                selectedStampId={state.stampId}
                onSelectEnvelope={selectEnvelope}
                onSelectStamp={selectStamp}
              />
            )}

            {currentStep === 3 && (
              <Step3Message
                recipientName={state.recipientName}
                senderName={state.senderName}
                message={state.message}
                fontStyle={state.fontStyle}
                textEffect={state.textEffect}
                onUpdate={updateMessage}
              />
            )}

            {currentStep === 4 && (
              <Step4Photos
                photos={state.photos}
                onAddPhoto={addPhoto}
                onRemovePhoto={removePhoto}
              />
            )}

            {currentStep === 5 && (
              <Step5Music
                selectedMusicId={state.musicId}
                onSelectMusic={selectMusic}
              />
            )}

            {currentStep === 6 && (
              <Step6Signature
                signatureData={state.signatureData}
                onSetSignature={setSignature}
              />
            )}

            {currentStep === 7 && (
              <Step7Preview
                state={state}
                userTym={user.points}
                onSend={handleSendCard}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {currentStep < 7 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Cost Preview */}
            <div className="text-sm">
              <span className="text-gray-500">Chi phí: </span>
              <span className="font-bold text-rose-600">
                💜 {totalTymCost} Tym
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại
                </button>
              )}
              
              <button
                onClick={nextStep}
                disabled={!canProceed(currentStep)}
                className={`
                  px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
                  ${canProceed(currentStep)
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg hover:shadow-rose-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Tiếp tục
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Thoát tạo thiệp?
                </h3>
                <p className="text-gray-600">
                  Tiến trình của bạn sẽ không được lưu. Bạn có chắc muốn thoát?
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Ở lại
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition"
                >
                  Thoát
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}