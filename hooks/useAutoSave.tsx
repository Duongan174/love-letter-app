// hooks/useAutoSave.tsx
/**
 * Hook quản lý auto save cho card creation
 * - Debounce để tránh save quá nhiều
 * - Visual feedback (loading state)
 * - Error handling và retry logic
 * - Beforeunload handler để save khi user rời trang
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CreateCardState } from './useCreateCard';

export interface AutoSaveOptions {
  /** Draft ID để lưu */
  draftId: string | null;
  /** State hiện tại của card */
  state: CreateCardState;
  /** Flag để bật/tắt auto save */
  enabled?: boolean;
  /** Debounce delay (ms) - mặc định 800ms */
  debounceMs?: number;
  /** Callback khi save thành công */
  onSaveSuccess?: () => void;
  /** Callback khi save thất bại */
  onSaveError?: (error: Error) => void;
}

export interface AutoSaveStatus {
  /** Đang trong quá trình save */
  isSaving: boolean;
  /** Lần save cuối cùng thành công */
  lastSavedAt: Date | null;
  /** Lần save cuối cùng thất bại */
  lastError: Error | null;
  /** Số lần retry hiện tại */
  retryCount: number;
}

/**
 * Serialize state thành payload để gửi lên API
 */
function serializeState(state: CreateCardState): string {
  const payload = {
    template_id: state.templateId ?? null,
    envelope_id: state.envelopeId ?? null,
    stamp_id: state.stampId ?? null,
    music_id: state.musicId ?? null,
    recipient_name: state.recipientName ?? '',
    sender_name: state.senderName ?? '',
    content: state.message ?? '',
    rich_content: state.richContent ?? null,
    used_fonts: Array.isArray(state.usedFonts) ? state.usedFonts : null,
    font_style: state.fontStyle ?? 'serif',
    text_effect: state.textEffect ?? null,
    photos: Array.isArray(state.photos) ? state.photos : [],
    frame_id: state.frameId ?? null,
    photo_slots: Array.isArray(state.photoSlots) ? state.photoSlots : [],
    signature_data: state.signatureData ?? null,
    letter_background: state.letterBackground ?? '#ffffff',
    letter_pattern: state.letterPattern ?? 'solid',
    letter_container_background: state.letterContainerBackground ?? 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))',
    cover_background: state.coverBackground ?? '#fdf2f8',
    cover_pattern: state.coverPattern ?? 'solid',
    photo_background: state.photoBackground ?? '#fff8e1',
    photo_pattern: state.photoPattern ?? 'solid',
    signature_background: state.signatureBackground ?? '#fce4ec',
    signature_pattern: state.signaturePattern ?? 'solid',
    envelope_color: state.envelope?.color ?? state.envelope?.envelopeBaseColor ?? null,
    envelope_pattern: state.envelope?.pattern ?? 'solid',
    envelope_pattern_color: state.envelope?.patternColor ?? '#5d4037',
    envelope_pattern_intensity: state.envelope?.patternIntensity ?? 0.15,
    envelope_seal_design: state.envelope?.sealDesign ?? 'heart',
    envelope_seal_color: state.envelope?.sealColor ?? '#c62828',
    envelope_liner_pattern_type: state.envelope?.linerPatternType ?? null,
    envelope_liner_color: state.envelope?.linerColor ?? '#ffffff',
    utilities: state.utilities || null,
  };

  return JSON.stringify(payload);
}

/**
 * Save draft lên server
 */
async function saveDraft(
  draftId: string,
  payload: string,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`/api/card-drafts/${encodeURIComponent(draftId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    signal,
  });

  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text();
      const errorBody = errorText ? JSON.parse(errorText) : null;
      throw new Error(errorBody?.error || `HTTP ${res.status}: ${res.statusText}`);
    } catch (parseErr) {
      throw new Error(`Save failed: ${res.status} ${res.statusText}`);
    }
  }
}

/**
 * Hook quản lý auto save
 */
export function useAutoSave({
  draftId,
  state,
  enabled = true,
  debounceMs = 800,
  onSaveSuccess,
  onSaveError,
}: AutoSaveOptions) {
  const [status, setStatus] = useState<AutoSaveStatus>({
    isSaving: false,
    lastSavedAt: null,
    lastError: null,
    retryCount: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const lastSavedPayloadRef = useRef<string | null>(null);
  const pendingSaveRef = useRef<boolean>(false);
  const stateRef = useRef<CreateCardState>(state);
  
  // Update ref khi state thay đổi
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * Hàm save với retry logic
   */
  const performSave = useCallback(
    async (payload: string, signal?: AbortSignal, retryCount = 0): Promise<void> => {
      try {
        if (!draftId) {
          throw new Error('Draft ID is required');
        }

        await saveDraft(draftId, payload, signal);
        
        // Save thành công
        setStatus((prev) => ({
          ...prev,
          isSaving: false,
          lastSavedAt: new Date(),
          lastError: null,
          retryCount: 0,
        }));

        lastSavedPayloadRef.current = payload;
        pendingSaveRef.current = false;
        onSaveSuccess?.();
      } catch (error: any) {
        // Bỏ qua nếu bị abort
        if (error?.name === 'AbortError') {
          return;
        }

        const err = error instanceof Error ? error : new Error(String(error));

        // Retry logic: thử lại tối đa 2 lần với exponential backoff
        if (retryCount < 2 && !signal?.aborted) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
          
          setTimeout(() => {
            if (!signal?.aborted) {
              performSave(payload, signal, retryCount + 1);
            }
          }, delay);

          setStatus((prev) => ({
            ...prev,
            retryCount: retryCount + 1,
          }));
        } else {
          // Hết retry hoặc bị abort
          setStatus((prev) => ({
            ...prev,
            isSaving: false,
            lastError: err,
            retryCount: 0,
          }));

          pendingSaveRef.current = false;
          onSaveError?.(err);
        }
      }
    },
    [draftId, onSaveSuccess, onSaveError]
  );

  /**
   * Trigger save với debounce
   */
  const triggerSave = useCallback(() => {
    if (!enabled || !draftId) return;

    // Clear timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abort request cũ nếu có
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Tạo controller mới
    controllerRef.current = new AbortController();

    // Set pending flag
    pendingSaveRef.current = true;

    // Serialize state
    const payload = serializeState(state);

    // Kiểm tra xem có thay đổi không
    if (payload === lastSavedPayloadRef.current) {
      pendingSaveRef.current = false;
      return;
    }

    // Set saving state
    setStatus((prev) => ({ ...prev, isSaving: true }));

    // Debounce save
    timeoutRef.current = setTimeout(() => {
      performSave(payload, controllerRef.current?.signal);
    }, debounceMs);
  }, [enabled, draftId, state, debounceMs, performSave]);

  /**
   * Force save ngay lập tức (không debounce) - dùng cho beforeunload
   */
  const forceSave = useCallback(async (): Promise<void> => {
    if (!enabled || !draftId) return;

    // Clear timeout nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Abort request cũ
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Tạo controller mới
    controllerRef.current = new AbortController();

    const payload = serializeState(state);

    // Kiểm tra xem có thay đổi không
    if (payload === lastSavedPayloadRef.current) {
      return;
    }

    // Set saving state
    setStatus((prev) => ({ ...prev, isSaving: true }));

    // Save ngay lập tức (không debounce)
    await performSave(payload, controllerRef.current.signal);
  }, [enabled, draftId, state, performSave]);

  /**
   * Auto save khi state thay đổi
   * Sử dụng serialized payload làm dependency để tránh vòng lặp vô hạn
   * ⚠️ QUAN TRỌNG: Serialize state thành string để so sánh, không dùng state object trực tiếp
   */
  
  // Serialize state thành string để dùng làm dependency ổn định
  const statePayload = serializeState(state);
  
  useEffect(() => {
    if (!enabled || !draftId) return;

    // Kiểm tra xem có thay đổi không
    if (statePayload === lastSavedPayloadRef.current) {
      return;
    }

    // Clear timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abort request cũ nếu có
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Tạo controller mới
    controllerRef.current = new AbortController();

    // Set pending flag
    pendingSaveRef.current = true;

    // Debounce save - set status trong setTimeout để tránh trigger useEffect ngay lập tức
    timeoutRef.current = setTimeout(() => {
      // Set saving state ngay trước khi save
      setStatus((prev) => {
        // Chỉ update nếu chưa đang saving để tránh re-render không cần thiết
        if (prev.isSaving) return prev;
        return { ...prev, isSaving: true };
      });
      performSave(statePayload, controllerRef.current?.signal);
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [enabled, draftId, debounceMs, performSave, statePayload]); // ✅ Dùng statePayload thay vì state

  /**
   * Beforeunload handler - save khi user rời trang
   * ⚠️ LƯU Ý: beforeunload không thể đợi async operations
   * Chúng ta chỉ có thể cảnh báo user, không thể force save sync
   */
  useEffect(() => {
    if (!enabled || !draftId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Nếu có pending save hoặc đang save, cảnh báo user
      if (pendingSaveRef.current || status.isSaving) {
        // Kiểm tra xem có thay đổi chưa được lưu không
        const currentPayload = serializeState(stateRef.current);
        if (currentPayload !== lastSavedPayloadRef.current) {
          // Hiển thị warning
          e.preventDefault();
          e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang?';
          return e.returnValue;
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, draftId, status.isSaving]);

  /**
   * Cleanup khi unmount
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return {
    status,
    triggerSave,
    forceSave,
  };
}

