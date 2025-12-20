'use client';

import { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';


// Components
import StepIndicator from '@/components/create/StepIndicator';
import Step1Envelope from '@/components/create/Step1Envelope';
import Step2Stamp from '@/components/create/Step2Stamp';
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
  exit: { opacity: 0, x: -20, scale: 0.99 },
};

const pageTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// Wrapper để dùng useSearchParams an toàn
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
    setEnvelopeById,
    setStampById,
    setMusicById,
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

  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // ⛔ CHỐT HẠ: không cho init chạy lặp
  const initOnceRef = useRef(false);

  // ─────────────────────────────────────────────
  // INIT: Auth + Draft / Template
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (initOnceRef.current) return;

    const draftId = searchParams.get('draftId');
    const templateId = searchParams.get('templateId');

    // Chưa login → redirect auth
    if (!user) {
      const redirect =
        draftId
          ? `/create?draftId=${encodeURIComponent(draftId)}`
          : templateId
          ? `/create?templateId=${encodeURIComponent(templateId)}`
          : '/templates';

      router.replace(`/auth?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    initOnceRef.current = true;

    const run = async () => {
      setIsInitializing(true);

      try {
        // A) Có draftId → load draft
        if (draftId) {
          const res = await fetch(`/api/card-drafts/${draftId}`);
          const text = await res.text();
          const json = text ? JSON.parse(text) : null;

          if (!res.ok || !json?.data) {
            router.replace('/templates');
            return;
          }

          const d = json.data;

          if (d.template_id) await setTemplateById(d.template_id);
          if (d.envelope_id) await setEnvelopeById(d.envelope_id);
          if (d.stamp_id) await setStampById(d.stamp_id);
          if (d.music_id) await setMusicById(d.music_id);

          updateMessage({
            recipientName: d.recipient_name || '',
            senderName: d.sender_name || '',
            message: d.content || '',
            fontStyle: d.font_style || 'font-dancing',
            textEffect: d.text_effect || 'none',
            photos: Array.isArray(d.photos) ? d.photos : [],
            signatureData: d.signature_data || null,
          });

          return;
        }

        // B) Có templateId → tạo draft
        if (templateId) {
          const res = await fetch('/api/card-drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId }),
          });

          const text = await res.text();
          const json = text ? JSON.parse(text) : null;

          if (!res.ok || !json?.data?.id) {
            router.replace(`/create?templateId=${templateId}`);
            return;
          }

          router.replace(`/create?draftId=${json.data.id}`);
          return;
        }

        // C) Không có gì → về templates
        router.replace('/templates');
      } catch (e) {
        console.error('Init create failed:', e);
        router.replace('/templates');
      } finally {
        setIsInitializing(false);
      }
    };

    run();
  }, [
    authLoading,
    user,
    router,
    searchParams,
    setTemplateById,
    setEnvelopeById,
    setStampById,
    setMusicById,
    updateMessage,
  ]);

  // AUTO-SAVE DRAFT (debounce) - stable deps (fix "deps changed size")
const draftId = searchParams.get('draftId') ?? '';

// Gom mọi thứ cần autosave vào 1 key ổn định (deps luôn cố định 2 phần tử)
const autosaveKey = useMemo(() => {
  // IMPORTANT: luôn trả về string (kể cả khi photos undefined)
  const payload = {
    template_id: state.templateId ?? null,
    envelope_id: state.envelopeId ?? null,
    stamp_id: state.stampId ?? null,
    music_id: state.musicId ?? null,
    recipient_name: state.recipientName ?? '',
    sender_name: state.senderName ?? '',
    content: state.message ?? '',
    font_style: state.fontStyle ?? 'serif',
    text_effect: state.textEffect ?? null,
    photos: Array.isArray(state.photos) ? state.photos : [], // luôn là array
  };

  return JSON.stringify(payload);
}, [
  state.templateId,
  state.envelopeId,
  state.stampId,
  state.musicId,
  state.recipientName,
  state.senderName,
  state.message,
  state.fontStyle,
  state.textEffect,
  state.photos,
]);

useEffect(() => {
  if (!draftId) return;

  const controller = new AbortController();

  const t = window.setTimeout(async () => {
    try {
      const res = await fetch(`/api/card-drafts/${encodeURIComponent(draftId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: autosaveKey, // autosaveKey chính là JSON string payload
        signal: controller.signal,
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (!res.ok) {
        console.error('autosave failed', { status: res.status, body: json ?? text });
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') console.error('autosave exception', err);
    }
  }, 600);

  return () => {
    controller.abort();
    window.clearTimeout(t);
  };
}, [draftId, autosaveKey]); // ✅ deps luôn cố định 2 phần tử



  // ─────────────────────────────────────────────
  // SEND CARD
  // ─────────────────────────────────────────────
  const handleSendCard = async (): Promise<string> => {
    if (!user) throw new Error('Chưa đăng nhập');

    const draftId = searchParams.get('draftId');
    if (!draftId) throw new Error('Thiếu draftId');

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId }),
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (!res.ok || !json?.data?.id) {
        throw new Error(json?.error || 'Create card failed');
      }

      return json.data.id as string;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // LOADING STATES
  // ─────────────────────────────────────────────
  if (authLoading || isInitializing || isSubmitting) {
    return (
      <Loading
        text={
          isSubmitting
            ? 'Đang gửi tấm lòng...'
            : 'Đang vào xưởng thiết kế...'
        }
      />
    );
  }

  if (!user) return null;

  // ─────────────────────────────────────────────
  // UI (GIỮ NGUYÊN)
  // ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 overflow-x-hidden pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() =>
              currentStep > 1 ? setShowExitModal(true) : router.push('/templates')
            }
            className="flex items-center gap-2 text-gray-600 hover:text-rose-500"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Thoát</span>
          </button>

          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <span className="font-bold">
              {state.template?.name || 'Tạo Thiệp'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full">
            <span>💜</span>
            <span className="font-bold text-rose-600">{user.points}</span>
          </div>
        </div>
      </header>

      <div className="pt-6 pb-2">
        <StepIndicator currentStep={currentStep} />
      </div>

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
            {currentStep === 1 && (
              <Step1Envelope
                selectedEnvelope={state.envelope}
                onSelectEnvelope={selectEnvelope}
              />
            )}
            {currentStep === 2 && (
              <Step2Stamp
                envelope={state.envelope}
                liner={null}
                selectedStamp={state.stamp}
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
                onSetSignature={(data) => {
                  if (data === null) {
                    setSignature('');
                     return;
                  }
                  setSignature(data);
                }}
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

      {currentStep < 7 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 border-t p-4 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>💜</span>
              <span className="font-bold text-rose-600">
                {totalTymCost} Tym
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-100 rounded-xl"
              >
                Quay lại
              </button>
              <button
                onClick={nextStep}
                disabled={!canProceed(currentStep)}
                className={`px-8 py-3 rounded-xl ${
                  canProceed(currentStep)
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showExitModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-amber-500" />
                <h3 className="text-lg font-bold mt-2">Dừng thiết kế?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tiến trình của bạn sẽ bị mất.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3 bg-gray-100 rounded-xl"
                >
                  Ở lại
                </button>
                <button
                  onClick={() => router.push('/templates')}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl"
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
