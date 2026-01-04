'use client';

import { useEffect, useState, Suspense, useRef, useMemo, lazy } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, AlertCircle, Crown, HelpCircle } from 'lucide-react';
import { splitLetterPages } from '@/hooks/useCreateCard';

// Components
import Loading from '@/components/ui/Loading';

// ✅ Lazy load step components để giảm bundle size ban đầu
// ✅ Cấu trúc 5 bước:
//    Step 1: Envelope + Stamp (Step1EnvelopeStamp) - gộp từ Step1Envelope + Step2Stamp
//    Step 2: Message + Photos (Step2MessagePhotos) - gộp từ Step3Message + Step4Photos
//    Step 3: Music + Signature (Step3MusicSignature) - gộp từ Step5Music + Step6Signature
//    Step 4: Utilities (Step4Utilities) - Tính năng tiện ích mới
//    Step 5: Preview (Step5Preview)
const Step1EnvelopeStamp = lazy(() => import('@/components/create/Step1EnvelopeStamp'));
const Step2MessagePhotos = lazy(() => import('@/components/create/Step2MessagePhotos'));
const Step3MusicSignature = lazy(() => import('@/components/create/Step3MusicSignature'));
const Step4Utilities = lazy(() => import('@/components/create/Step4Utilities'));
const Step5Preview = lazy(() => import('@/components/create/Step5Preview'));

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useCreateCard } from '@/hooks/useCreateCard';
import { useAutoSave } from '@/hooks/useAutoSave';
import { supabase } from '@/lib/supabase';

// Components
import AutoSaveIndicator from '@/components/create/AutoSaveIndicator';

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
  const { user, loading: authLoading, signOut } = useAuth();
  
  // Get draftId and templateId once at the top level
  const draftId = searchParams.get('draftId') ?? '';
  const templateId = searchParams.get('templateId');

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
    updateLetterPages,
    setOpenMode,
    addPhoto,
    removePhoto,
    updatePhotoTransform,
    selectFrame,
    updatePhotoSlot,
    updatePhotoSlotTransform,
    removePhotoSlot,
    selectMusic,
    setSignature,
    updateUtilities,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    totalTymCost,
  } = useCreateCard();

  const [isInitializing, setIsInitializing] = useState(false); // Start with false to show UI immediately
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false); // ✅ Track when draft is fully loaded

  // ⛔ CHỐT HẠ: không cho init chạy lặp
  const initOnceRef = useRef(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  
  // ✅ Prefetch data cho step components (chạy song song, không block UI)
  useEffect(() => {
    if (!user || authLoading) return;
    
    // Prefetch envelopes, stamps, music ngay khi user đã login
    // Không cần await, chạy background để step components load nhanh hơn
    Promise.all([
      supabase.from('envelopes').select('*').order('points_required'),
      supabase.from('stamps').select('*').order('points_required'),
      supabase.from('music').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    ]).catch(err => {
      // Silent fail - các step components sẽ fetch lại nếu cần
      console.debug('Prefetch failed (non-critical):', err);
    });
  }, [user, authLoading]);

  // ─────────────────────────────────────────────
  // INIT: Auth + Draft / Template (Blocking - wait for completion)
  // ─────────────────────────────────────────────
  useEffect(() => {
    // ⚠️ CRITICAL: Redirect immediately if no templateId or draftId
    // This prevents showing step 1 before redirecting to templates
    if (!draftId && !templateId && !authLoading) {
      router.replace('/templates');
      return;
    }

    // If already initialized and completed, don't re-run
    if (isInitializedRef.current) {
      return;
    }
    
    // If init is already in progress, don't start another one
    if (initPromiseRef.current) {
      return;
    }

    // Wait for auth to complete
    if (authLoading) {
      return;
    }

    // ⛔ STRICT AUTH CHECK: Always require user to be logged in
    if (!user) {
      const redirect = draftId
        ? `/create?draftId=${encodeURIComponent(draftId)}`
        : templateId
        ? `/create?templateId=${encodeURIComponent(templateId)}`
        : '/templates';

      router.replace(`/auth?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    // Show loading for initialization
    if (templateId && !draftId) {
      setIsInitializing(true);
    } else if (draftId) {
      setIsInitializing(true);
    }

    initOnceRef.current = true;

    const run = async () => {
      try {
        // A) Có draftId → load draft (blocking - wait for completion)
        if (draftId) {
          try {
            const res = await fetch(`/api/card-drafts/${draftId}`);
            
            const text = await res.text();
            const json = text ? JSON.parse(text) : null;

            if (!res.ok || !json?.data) {
              router.replace('/templates');
              return;
            }

            const d = json.data;

            // ✅ Tối ưu: Chạy song song tất cả API calls thay vì tuần tự
            // ⚠️ CRITICAL: Template MUST be loaded first as it's required
            const promises = [];
            if (d.template_id) {
              // Load template first and wait for it
              await setTemplateById(d.template_id);
            }
            // Then load other items in parallel
            // ✅ Load envelope với customization data từ draft
            let envelopeData: any = null;
            if (d.envelope_id) {
              // Load envelope từ database
              const { data: envData } = await supabase.from('envelopes').select('*').eq('id', d.envelope_id).single();
              if (envData) {
                // Merge với customization data từ draft
                envelopeData = {
                  ...envData,
                  color: d.envelope_color || envData.color, // ✅ Ưu tiên màu từ customization
                  pattern: d.envelope_pattern || envData.pattern || 'solid',
                  patternColor: d.envelope_pattern_color || envData.patternColor || '#5d4037',
                  patternIntensity: d.envelope_pattern_intensity ?? envData.patternIntensity ?? 0.15,
                  sealDesign: d.envelope_seal_design || envData.sealDesign || 'heart',
                  sealColor: d.envelope_seal_color || envData.sealColor || '#c62828',
                  linerPatternType: d.envelope_liner_pattern_type || envData.linerPatternType || null,
                  linerColor: d.envelope_liner_color || envData.linerColor || '#ffffff',
                };
                // Set envelope với customization data đã merge
                selectEnvelope(envelopeData);
              } else {
                // Fallback: vẫn gọi setEnvelopeById nếu không load được
                promises.push(setEnvelopeById(d.envelope_id));
              }
            }
            if (d.stamp_id) promises.push(setStampById(d.stamp_id));
            if (d.music_id) promises.push(setMusicById(d.music_id));
            
            // Chờ tất cả hoàn thành
            await Promise.allSettled(promises);

            // Parse content to extract letterPages if it contains page breaks
            const parsedPages = splitLetterPages(d.content || '');
            
            updateMessage({
              recipientName: d.recipient_name || '',
              senderName: d.sender_name || '',
              message: d.content || '',
              letterPages: parsedPages, // Explicitly set letterPages to preserve multi-page structure
              fontStyle: d.font_style || 'font-dancing',
              textEffect: d.text_effect || 'none',
              photos: Array.isArray(d.photos) ? d.photos : [],
              signatureData: d.signature_data || null,
              // ✅ Step 4: Load frame and photoSlots from draft
              frameId: d.frame_id || null,
              photoSlots: Array.isArray(d.photo_slots) ? d.photo_slots : [],
              // ✅ Step 3: Load letter background/pattern from draft
              letterBackground: d.letter_background || '#ffffff',
              letterPattern: d.letter_pattern || 'solid',
              letterContainerBackground: d.letter_container_background || 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))',
              // ✅ Step 2: Load background colors từ draft
              coverBackground: d.cover_background || '#fdf2f8',
              coverPattern: d.cover_pattern || 'solid',
              photoBackground: d.photo_background || '#fff8e1',
              photoPattern: d.photo_pattern || 'solid',
              signatureBackground: d.signature_background || '#fce4ec',
              signaturePattern: d.signature_pattern || 'solid',
            });
            
            // ✅ Step 4: Load utilities từ draft
            if (d.utilities) {
              try {
                const utilities = typeof d.utilities === 'string' 
                  ? JSON.parse(d.utilities) 
                  : d.utilities;
                updateUtilities(utilities);
              } catch (e) {
                console.warn('Failed to parse utilities from draft:', e);
              }
            }
            
            // ✅ Mark draft as fully loaded - enable autosave
            setIsDraftLoaded(true);
          } catch (fetchError: any) {
            console.error('Init fetch error:', fetchError);
            router.replace('/templates');
          }

          return;
        }

        // B) Có templateId → tạo draft
        if (templateId) {
          // No abort controller - let it complete even if tab switches
          
          try {
            // ⚠️ CRITICAL: Set template into state FIRST before creating draft
            await setTemplateById(templateId);
            
            const res = await fetch('/api/card-drafts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ templateId }),
            });

            const text = await res.text();
            const json = text ? JSON.parse(text) : null;

            if (!res.ok || !json?.data?.id) {
              if (document.visibilityState === 'visible') {
                router.replace(`/create?templateId=${templateId}`);
              }
              return;
            }

            // ✅ Mark as loaded before redirecting (for smooth transition)
            setIsDraftLoaded(true);
            
            // Redirect to draft page
            if (document.visibilityState === 'visible') {
              router.replace(`/create?draftId=${json.data.id}`);
            }
          } catch (fetchError: any) {
            console.error('Create draft error:', fetchError);
            // Don't redirect on error
          }
          return;
        }

        // C) Không có gì → về templates
        if (document.visibilityState === 'visible') {
          router.replace('/templates');
        }
      } catch (e) {
        console.error('Init create failed:', e);
        // Don't redirect on error - let user continue
      } finally {
        setIsInitializing(false);
        isInitializedRef.current = true;
        initPromiseRef.current = null;
      }
    };

    // Store promise so we can check if init is in progress
    initPromiseRef.current = run();
    
    // Cleanup on unmount
    return () => {
      // Don't abort - let it complete in background
    };
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

  // ─────────────────────────────────────────────
  // AUTO-SAVE DRAFT - Sử dụng hook useAutoSave
  // ─────────────────────────────────────────────
  const { status: autoSaveStatus } = useAutoSave({
    draftId: draftId || null,
    state,
    enabled: isDraftLoaded && !!draftId, // ⚠️ CRITICAL: Chỉ enable khi draft đã load xong
    debounceMs: 800, // Debounce 800ms để tối ưu performance
    onSaveSuccess: () => {
      // Optional: Có thể thêm toast notification ở đây
      // toast.success('Đã lưu tự động');
    },
    onSaveError: (error) => {
      // Optional: Có thể thêm toast notification ở đây
      console.error('Auto save failed:', error);
      // toast.error('Lưu tự động thất bại: ' + error.message);
    },
  });




  // ─────────────────────────────────────────────
  // SEND CARD
  // ─────────────────────────────────────────────
  const handleSendCard = async (): Promise<string> => {
    if (!user) throw new Error('Chưa đăng nhập');

    if (!draftId) throw new Error('Thiếu draftId');

    setIsSubmitting(true);

    try {
      console.log('Sending card with draftId:', draftId);
      
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId }),
      });

      const text = await res.text();
      let json: any = null;
      
      try {
        json = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        console.error('Failed to parse response:', parseErr);
        throw new Error(`Server response error: ${text}`);
      }

      console.log('API response:', { status: res.status, json });

      if (!res.ok) {
        const errorMsg = json?.error || `HTTP ${res.status}: ${res.statusText}`;
        console.error('API error:', errorMsg);
        throw new Error(errorMsg);
      }

      if (!json?.data?.id) {
        console.error('Missing card ID in response:', json);
        throw new Error('Server không trả về ID thiệp');
      }

      console.log('Card created successfully with ID:', json.data.id);
      return json.data.id as string;
    } catch (error: any) {
      console.error('Error in handleSendCard:', error);
      throw error; // Re-throw to let Step5Preview handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // AUTH REDIRECT: Handle redirect in useEffect to avoid setState during render
  // ─────────────────────────────────────────────
  // ⚠️ CRITICAL: This useEffect must be called BEFORE any conditional returns
  useEffect(() => {
    // Only redirect if auth is not loading and user is not present
    if (!user && !authLoading) {
      const redirect = draftId
        ? `/create?draftId=${encodeURIComponent(draftId)}`
        : templateId
        ? `/create?templateId=${encodeURIComponent(templateId)}`
        : '/templates';
      router.replace(`/auth?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [user, authLoading, draftId, templateId, router]);

  // ─────────────────────────────────────────────
  // LOADING STATES
  // ─────────────────────────────────────────────
  // Only show loading for:
  // 1. Submitting (sending card)
  // 2. Initializing with templateId (needs to create draft first)
  // 3. Auth loading ONLY on first load (not when returning to tab)
  // If we already have user or isInitializedRef is true, don't show loading for auth
  const isFirstLoad = !isInitializedRef.current && !user;
  const shouldShowLoading = 
    isSubmitting || 
    (isInitializing && templateId && !draftId) ||
    (authLoading && isFirstLoad); // Only show loading for first auth check
  
  if (shouldShowLoading) {
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

  // ⛔ STRICT AUTH CHECK: Always require user to be logged in
  // If auth is loading or user is not present, show nothing (wait for auth or redirect)
  if (!user) {
    return null;
  }

  // ─────────────────────────────────────────────
  // UI - Redesigned for 7-step flow
  // ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-rose-50/30 flex flex-col overflow-hidden pt-16">
      {/* Simplified Header with Progress Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-b from-white via-amber-50/30 to-white border-b border-amber-200/50 shadow-lg flex-shrink-0">
        {/* Top Bar: Logo & Navigation */}
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo & Back */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() =>
                currentStep > 1 ? setShowExitModal(true) : router.push('/templates')
              }
              className="p-2.5 hover:bg-amber-100 rounded-xl transition-all border border-transparent hover:border-amber-200"
            >
              <ChevronLeft className="w-5 h-5 text-amber-700" />
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-amber-700 fill-current" />
              <span className="text-xl font-bold text-amber-900 tracking-tight" style={{ fontFamily: 'serif' }}>Echoshop</span>
            </div>
          </div>


          {/* Right: Navigation */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`p-2.5 rounded-xl transition-all ${
                currentStep === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-amber-700 hover:bg-amber-100 border border-transparent hover:border-amber-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative group">
              <button
                onClick={nextStep}
                disabled={!canProceed(currentStep) || currentStep === 5}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl transition-all font-semibold text-sm relative ${
                  canProceed(currentStep) && currentStep < 5
                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-sm'
                }`}
              >
                <span>{currentStep === 5 ? 'Hoàn thành' : `Tiếp theo (${currentStep}/5)`}</span>
                {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
              </button>
              {/* Tooltip khi disabled */}
              {(!canProceed(currentStep) || currentStep === 5) && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {currentStep === 5 
                    ? 'Đã hoàn thành tất cả các bước'
                    : currentStep === 1
                    ? 'Vui lòng chọn phong bì và tem thư'
                    : currentStep === 2
                    ? 'Vui lòng lưu ít nhất 1 trang trước khi tiếp tục'
                    : 'Vui lòng hoàn thành bước hiện tại'
                  }
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress Bar - Mảnh, hiển thị tiến trình rõ ràng */}
        <div className="w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </header>

      {/* Auto Save Indicator */}
      <AutoSaveIndicator status={autoSaveStatus} position="top-center" />

      {/* Main Content Area - Professional Layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Central Canvas */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-amber-50/20 via-white to-rose-50/20 w-full">
          <div className="max-w-7xl mx-auto px-4 py-2">
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
              <Suspense fallback={<Loading text="Đang tải..." />}>
              <Step1EnvelopeStamp
                selectedEnvelope={state.envelope}
                onSelectEnvelope={selectEnvelope}
                envelope={state.envelope}
                liner={null}
                selectedStamp={state.stamp}
                onSelectStamp={selectStamp}
                coverBackground={state.coverBackground}
                coverPattern={state.coverPattern}
                photoBackground={state.photoBackground}
                photoPattern={state.photoPattern}
                signatureBackground={state.signatureBackground}
                signaturePattern={state.signaturePattern}
                letterBackground={state.letterBackground}
                letterPattern={state.letterPattern}
                letterContainerBackground={state.letterContainerBackground}
                onUpdateBackgrounds={(data) => {
                  updateMessage(data);
                }}
              />
              </Suspense>
            )}
            {currentStep === 2 && (
              <Suspense fallback={<Loading text="Đang tải..." />}>
              <Step2MessagePhotos
                message={state.message}
                letterPages={state.letterPages}
                onUpdateLetterPages={updateLetterPages}
                fontStyle={state.fontStyle}
                textEffect={state.textEffect}
                letterBackground={state.letterBackground}
                letterPattern={state.letterPattern}
                letterContainerBackground={state.letterContainerBackground}
                stickers={state.stickers}
                signatureData={state.signatureData}
                userTym={user?.points || 0}
                onUpdate={updateMessage}
                photos={state.photos}
                onAddPhoto={addPhoto}
                onRemovePhoto={removePhoto}
                onUpdatePhotoTransform={updatePhotoTransform}
                photoTransforms={state.photoTransforms}
              />
              </Suspense>
            )}
            {currentStep === 3 && (
              <Suspense fallback={<Loading text="Đang tải..." />}>
              <Step3MusicSignature
                selectedMusicId={state.musicId}
                onSelectMusic={selectMusic}
                signatureData={state.signatureData}
                onSetSignature={(data) => {
                  if (data === null) {
                    setSignature('');
                    return;
                  }
                  setSignature(data);
                }}
              />
              </Suspense>
            )}
            {currentStep === 4 && (
              <Suspense fallback={<Loading text="Đang tải..." />}>
              <Step4Utilities
                utilities={state.utilities || {
                  enableQRCode: true,
                  qrCodeStyle: 'default',
                  enablePassword: false,
                  password: undefined,
                  enableExpiry: false,
                  expiryDate: null,
                  enableEmailNotification: false,
                  enableAnalytics: true,
                  shareSettings: {
                    allowFacebook: true,
                    allowTwitter: true,
                    allowCopy: true,
                    allowDownload: true,
                  },
                  customDomain: undefined,
                  sendMethod: 'link',
                  scheduledSend: false,
                }}
                onUpdate={updateUtilities}
              />
              </Suspense>
            )}
            {currentStep === 5 && (
              <Suspense fallback={<Loading text="Đang tải..." />}>
              <Step5Preview
                state={state}
                userTym={user?.points ?? 0}
                onSend={handleSendCard}
              />
              </Suspense>
            )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>


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
