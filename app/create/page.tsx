// app/create/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

// Components MỚI (Đã tách Phong bì & Tem)
import StepIndicator from '@/components/create/StepIndicator';
import Step1Envelope from '@/components/create/Step1Envelope'; // Component 3D mới
import Step2Stamp from '@/components/create/Step2Stamp';       // Component Tem mới
import Step3Message from '@/components/create/Step3Message';
import Step4Photos from '@/components/create/Step4Photos';
import Step5Music from '@/components/create/Step5Music';
import Step6Signature from '@/components/create/Step6Signature';
import Step7Preview from '@/components/create/Step7Preview';
import Loading from '@/components/ui/Loading';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useCreateCard } from '@/hooks/useCreateCard';

// Animation
const pageVariants = {
  initial: { opacity: 0, x: 20, scale: 0.99 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.99 }
};

const pageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

// Component chính (Wrap Suspense để dùng useSearchParams an toàn)
export default function CreatePageWrapper() {
  return (
    <Suspense fallback={<Loading text="Đang tải dữ liệu..." />}>
      <CreatePage />
    </Suspense>
  );
}

function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const {
    state,
    currentStep,
    setTemplateById,
    selectEnvelope,
    selectLiner, // Logic lớp lót mới
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

  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // 1. Kiểm tra Auth & Template ID khi vào trang
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth?redirect=/create');
      return;
    }

    const templateId = searchParams.get('templateId');
    if (!templateId) {
      // Chưa chọn mẫu -> Về trang Gallery
      router.push('/templates');
      return;
    }

    // Set template vào state
    setTemplateById(templateId).then(() => {
      setIsInitializing(false);
    });

  }, [user, authLoading, router, searchParams]);

  // Xử lý thoát
  const handleExit = () => {
    if (currentStep > 1) {
      setShowExitModal(true);
    } else {
      router.push('/templates');
    }
  };

  // Gửi thiệp
  const handleSendCard = async (): Promise<string> => {
    if (!user) throw new Error('Chưa đăng nhập');
    setIsSubmitting(true);

    try {
      const cardData = {
        user_id: user.id,
        template_id: state.templateId,
        recipient_name: state.recipientName,
        sender_name: state.senderName,
        message: state.message,
        font_style: state.fontStyle,
        text_effect: state.textEffect,
        photos: state.photos,
        signature_data: state.signatureData,
        envelope_id: state.envelopeId,
        liner_pattern: state.linerPattern, // Lưu thêm lớp lót
        stamp_id: state.stampId,
        music_id: state.musicId,
        tym_cost: state.totalTymCost,
      };

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      return result.data.id;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isInitializing || isSubmitting) {
    return <Loading text={isSubmitting ? "Đang gửi tấm lòng..." : "Đang vào xưởng thiết kế..."} />;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 overflow-x-hidden pb-32">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-rose-50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline font-medium">Thoát</span>
          </button>

          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <span className="font-bold text-gray-800 text-lg">
              {state.template?.name || 'Tạo Thiệp'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full">
            <span className="text-sm">💜</span>
            <span className="font-bold text-rose-600">{user.points}</span>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="pt-6 pb-2">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {/* --- STEP 1: PHONG BÌ & LỚP LÓT (3D) --- */}
            {currentStep === 1 && (
              <Step1Envelope
                selectedEnvelope={state.envelope}
                selectedLiner={state.linerPattern}
                onSelectEnvelope={selectEnvelope}
                onSelectLiner={selectLiner}
              />
            )}

            {/* --- STEP 2: TEM THƯ --- */}
            {currentStep === 2 && (
              <Step2Stamp
                envelope={state.envelope}
                liner={state.linerPattern}
                selectedStamp={state.stamp}
                onSelectStamp={selectStamp}
              />
            )}

            {/* --- STEP 3: LỜI CHÚC --- */}
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

            {/* --- STEP 4: ẢNH --- */}
            {currentStep === 4 && (
              <Step4Photos
                photos={state.photos}
                onAddPhoto={addPhoto}
                onRemovePhoto={removePhoto}
              />
            )}

            {/* --- STEP 5: NHẠC --- */}
            {currentStep === 5 && (
              <Step5Music
                selectedMusicId={state.musicId}
                onSelectMusic={selectMusic}
              />
            )}

            {/* --- STEP 6: CHỮ KÝ --- */}
            {currentStep === 6 && (
              <Step6Signature
                signatureData={state.signatureData}
                onSetSignature={setSignature}
              />
            )}

            {/* --- STEP 7: XEM TRƯỚC --- */}
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
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-50 safe-area-bottom">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm text-gray-500">Chi phí:</span>
              <div className="flex items-center gap-1">
                <span className="text-sm">💜</span>
                <span className="font-bold text-rose-600 text-lg">
                  {totalTymCost} Tym
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prevStep}
                // Nếu ở bước 1 mà bấm quay lại -> hỏi thoát
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                {currentStep === 1 ? 'Thoát' : 'Quay lại'}
              </button>
              
              <button
                onClick={nextStep}
                disabled={!canProceed(currentStep)}
                className={`
                  px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md
                  ${canProceed(currentStep)
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg hover:shadow-rose-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
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

      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dừng thiết kế?</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Tiến trình của bạn chưa được lưu. Bạn có chắc chắn muốn rời đi không?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-gray-700"
                >
                  Ở lại
                </button>
                <button
                  onClick={() => router.push('/templates')}
                  className="flex-1 py-3 bg-rose-500 rounded-xl font-medium text-white hover:bg-rose-600"
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