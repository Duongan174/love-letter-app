// hooks/useCreateCard.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ImageTransform } from '@/components/ui/ImageEditor';

// Định nghĩa các type dữ liệu
export interface CardTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  animation_type?: string;
  tym_cost: number;
  is_premium: boolean;
}

export interface CreateCardState {
  templateId: string | null;
  envelopeId: string | null;
  stampId: string | null;
  recipientName: string;
  senderName: string;
  message: string;
  /**
   * Multi-page letter content.
   * We keep `message` for backward compatibility (draft storage & existing APIs),
   * and serialize pages into it using a dedicated page-break token.
   */
  letterPages: string[];
  /** Envelope opening mode used by the viewer UX (stable, minimal options). */
  openMode: 'classic' | 'minimal';
  fontStyle: string;
  textEffect: string;
  letterBackground: string;
  letterPattern: string;
  // ✅ Background colors cho các phần khác
  coverBackground: string;
  coverPattern: string;
  photoBackground: string;
  photoPattern: string;
  signatureBackground: string;
  signaturePattern: string;
  stickers: Array<{ id: string; x: number; y: number; width?: number; height?: number; sticker_id: string; image_url: string }>;
  richContent: string | null;
  photos: string[];
  frameId: string | null; // ✅ Backward compatibility
  photoSlots: Array<{ slotIndex: number; photoUrl: string; transform?: ImageTransform }>; // ✅ Backward compatibility
  // ✅ Hỗ trợ nhiều frames - mỗi frame là một trang
  frames: Array<{ frameId: string; photoSlots: Array<{ slotIndex: number; photoUrl: string; transform?: ImageTransform }> }>;
  musicId: string | null;
  signatureData: string | null;
  totalTymCost: number;
  // Full objects for preview
  template: any;
  envelope: any;
  stamp: any;
  music: any;
}

/**
 * Token used to split/join pages when saving to a single `content/message` string.
 * - Unlikely to be typed by normal users
 * - Easy to parse reliably
 */
export const LETTER_PAGE_BREAK_TOKEN = '[[[PAGE_BREAK]]]';

export function splitLetterPages(content: string): string[] {
  if (!content) return [''];

  // Preferred: explicit token
  if (content.includes(LETTER_PAGE_BREAK_TOKEN)) {
    const parts = content
      .split(LETTER_PAGE_BREAK_TOKEN)
      .map((s) => s.replace(/^\s+|\s+$/g, ''));
    return parts.length ? parts : [''];
  }

  // Fallback: treat as single page
  return [content];
}

export function joinLetterPages(pages: string[]): string {
  const safe = Array.isArray(pages) && pages.length > 0 ? pages : [''];
  // Keep empty pages to preserve page count (UX), but normalize to string
  return safe
    .map((p) => (typeof p === 'string' ? p : String(p ?? '')))
    .join(`\n\n${LETTER_PAGE_BREAK_TOKEN}\n\n`);
}

// ✅ IMPORTANT: define function normally, then export BOTH named & default
function useCreateCard() {
  const [state, setState] = useState<CreateCardState>({
    templateId: null,
    envelopeId: null,
    stampId: null,
    recipientName: '',
    senderName: '',
    message: '',
    letterPages: [''],
    openMode: 'classic',
    fontStyle: 'font-dancing',
    textEffect: 'none',
    letterBackground: '#ffffff',
    letterPattern: 'solid',
    // ✅ Background colors mặc định cho các phần
    coverBackground: '#fdf2f8',
    coverPattern: 'solid',
    photoBackground: '#fff8e1',
    photoPattern: 'solid',
    signatureBackground: '#fce4ec',
    signaturePattern: 'solid',
    stickers: [],
    richContent: null,
    photos: [],
    frameId: null,
    photoSlots: [],
    frames: [], // ✅ Hỗ trợ nhiều frames
    musicId: null,
    signatureData: null,
    totalTymCost: 0,
    template: null,
    envelope: null,
    stamp: null,
    music: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  
  // ✅ Cache để tránh fetch lại data đã có
  const cacheRef = useRef<{
    templates: Map<string, any>;
    envelopes: Map<string, any>;
    stamps: Map<string, any>;
    music: Map<string, any>;
  }>({
    templates: new Map(),
    envelopes: new Map(),
    stamps: new Map(),
    music: new Map(),
  });

  useEffect(() => {
    let cost = 0;
    if (state.template?.points_required) cost += state.template.points_required;
    if (state.envelope?.points_required) cost += state.envelope.points_required;
    if (state.stamp?.points_required) cost += state.stamp.points_required;
    if (state.music?.points_required) cost += state.music.points_required;
    setState(prev => ({ ...prev, totalTymCost: cost }));
  }, [state.template, state.envelope, state.stamp, state.music]);

  // Actions với caching
  const setTemplateById = async (id: string) => {
    if (!id) return;
    // Kiểm tra cache trước
    if (cacheRef.current.templates.has(id)) {
      const cached = cacheRef.current.templates.get(id);
      setState(prev => ({ ...prev, templateId: id, template: cached }));
      return;
    }
    const { data } = await supabase.from('card_templates').select('*').eq('id', id).single();
    if (data) {
      cacheRef.current.templates.set(id, data);
      setState(prev => ({ ...prev, templateId: id, template: data }));
    }
  };

  const setEnvelopeById = async (id: string) => {
    if (!id) return;
    // Kiểm tra cache trước
    if (cacheRef.current.envelopes.has(id)) {
      const cached = cacheRef.current.envelopes.get(id);
      setState(prev => ({ ...prev, envelopeId: id, envelope: cached }));
      return;
    }
    const { data } = await supabase.from('envelopes').select('*').eq('id', id).single();
    if (data) {
      cacheRef.current.envelopes.set(id, data);
      setState(prev => ({ ...prev, envelopeId: id, envelope: data }));
    }
  };

  const setStampById = async (id: string) => {
    if (!id) return;
    // Kiểm tra cache trước
    if (cacheRef.current.stamps.has(id)) {
      const cached = cacheRef.current.stamps.get(id);
      setState(prev => ({ ...prev, stampId: id, stamp: cached }));
      return;
    }
    const { data } = await supabase.from('stamps').select('*').eq('id', id).single();
    if (data) {
      cacheRef.current.stamps.set(id, data);
      setState(prev => ({ ...prev, stampId: id, stamp: data }));
    }
  };

  const setMusicById = async (id: string) => {
    if (!id) return;
    // Kiểm tra cache trước
    if (cacheRef.current.music.has(id)) {
      const cached = cacheRef.current.music.get(id);
      setState(prev => ({ ...prev, musicId: id, music: cached }));
      return;
    }
    const { data } = await supabase.from('music').select('*').eq('id', id).single();
    if (data) {
      cacheRef.current.music.set(id, data);
      setState(prev => ({ ...prev, musicId: id, music: data }));
    }
  };

  const selectEnvelope = (envelope: any) => {
    setState(prev => ({ ...prev, envelopeId: envelope.id, envelope }));
  };

  const selectStamp = (stamp: any) => {
    setState(prev => ({ ...prev, stampId: stamp.id, stamp }));
  };

  const updateMessage = (data: any) => {
    // Back-compat: if caller updates `message` but not `letterPages`, derive pages.
    // BUT: Only if we don't already have letterPages with multiple pages (preserve existing structure)
    if (data && typeof data.message === 'string' && !('letterPages' in data)) {
      const pages = splitLetterPages(data.message);
      setState((prev) => {
        // If we already have multiple pages, preserve them unless explicitly overwriting
        const shouldPreservePages = prev.letterPages && prev.letterPages.length > 1;
        return {
          ...prev,
          ...data,
          letterPages: shouldPreservePages ? prev.letterPages : (pages.length ? pages : ['']),
        };
      });
      return;
    }
    // ✅ Nếu có richContent, cũng cập nhật letterPages từ richContent
    if (data && data.richContent) {
      const pages = splitLetterPages(data.richContent);
      setState(prev => ({ 
        ...prev, 
        ...data,
        letterPages: pages.length ? pages : prev.letterPages || [''],
      }));
      return;
    }
    // ✅ Step 4 & 6: Hỗ trợ update frameId, photoSlots, signatureData từ draft load
    setState(prev => {
      const newState = { ...prev, ...data };
      // Đảm bảo photoSlots luôn là array
      if ('photoSlots' in data) {
        newState.photoSlots = Array.isArray(data.photoSlots) ? data.photoSlots : [];
      }
      // ✅ Step 3: Letter background/pattern từ draft load
      if ('letterBackground' in data && data.letterBackground) {
        newState.letterBackground = data.letterBackground;
      }
      if ('letterPattern' in data && data.letterPattern) {
        newState.letterPattern = data.letterPattern;
      }
      return newState;
    });
  };

  /** Update pages and keep `message` serialized in sync for storage/API. */
  const updateLetterPages = (pages: string[]) => {
    const nextPages = Array.isArray(pages) && pages.length > 0 ? pages : [''];
    setState((prev) => ({
      ...prev,
      letterPages: nextPages,
      message: joinLetterPages(nextPages),
    }));
  };

  const setOpenMode = (mode: 'classic' | 'minimal') => {
    setState((prev) => ({ ...prev, openMode: mode }));
  };

  const addPhoto = (photoUrl: string) => setState(prev => ({ ...prev, photos: [...prev.photos, photoUrl] }));
  const removePhoto = (index: number) =>
    setState(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  const selectFrame = (frame: any) => setState(prev => ({ ...prev, frameId: frame?.id || null, frame }));
  const updatePhotoSlot = (slotIndex: number, photoUrl: string, transform?: ImageTransform) => {
    setState(prev => {
      const existing = prev.photoSlots.find(s => s.slotIndex === slotIndex);
      const newSlots = existing
        ? prev.photoSlots.map(s => s.slotIndex === slotIndex ? { slotIndex, photoUrl, transform } : s)
        : [...prev.photoSlots, { slotIndex, photoUrl, transform }];
      return { ...prev, photoSlots: newSlots };
    });
  };
  const updatePhotoSlotTransform = (slotIndex: number, transform: ImageTransform) => {
    setState(prev => {
      const existing = prev.photoSlots.find(s => s.slotIndex === slotIndex);
      if (existing) {
        return {
          ...prev,
          photoSlots: prev.photoSlots.map(s =>
            s.slotIndex === slotIndex ? { ...s, transform } : s
          ),
        };
      }
      return prev;
    });
  };
  const removePhotoSlot = (slotIndex: number) => {
    setState(prev => ({ ...prev, photoSlots: prev.photoSlots.filter(s => s.slotIndex !== slotIndex) }));
  };
  // ✅ Functions để quản lý nhiều frames
  const addFrame = (frame: any) => {
    setState(prev => ({
      ...prev,
      frames: [...prev.frames, { frameId: frame.id, photoSlots: [] }]
    }));
  };
  const removeFrame = (frameIndex: number) => {
    setState(prev => ({
      ...prev,
      frames: prev.frames.filter((_, i) => i !== frameIndex)
    }));
  };
  const updateFramePhotoSlot = (frameIndex: number, slotIndex: number, photoUrl: string, transform?: ImageTransform) => {
    setState(prev => {
      const newFrames = [...prev.frames];
      if (frameIndex >= 0 && frameIndex < newFrames.length) {
        const frame = newFrames[frameIndex];
        const existing = frame.photoSlots.find(s => s.slotIndex === slotIndex);
        const newSlots = existing
          ? frame.photoSlots.map(s => s.slotIndex === slotIndex ? { slotIndex, photoUrl, transform } : s)
          : [...frame.photoSlots, { slotIndex, photoUrl, transform }];
        newFrames[frameIndex] = { ...frame, photoSlots: newSlots };
      }
      return { ...prev, frames: newFrames };
    });
  };
  const selectMusic = (music: any) => setState(prev => ({ ...prev, musicId: music?.id || null, music }));
  const setSignature = (data: string) => setState(prev => ({ ...prev, signatureData: data }));

  // Navigation Logic
  const canProceed = (step: number) => {
    switch (step) {
      case 1: return !!state.envelopeId;
      case 2: return !!state.stampId;
      case 3:
        return (
          !!state.recipientName &&
          Array.isArray(state.letterPages) &&
          state.letterPages.some((p) => (p ?? '').trim().length > 0)
        );
      default: return true;
    }
  };

  const nextStep = () => { if (canProceed(currentStep)) setCurrentStep(prev => prev + 1); };
  const prevStep = () => { setCurrentStep(prev => Math.max(1, prev - 1)); };
  const goToStep = (step: number) => { 
    // Only allow going to completed steps (steps before current)
    if (step >= 1 && step <= 7 && step < currentStep) {
      setCurrentStep(step);
    }
  };

  return {
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
    setOpenMode, // ✅ FIX: trả ra setOpenMode để page.tsx dùng được
    addPhoto,
    removePhoto,
    selectFrame,
    updatePhotoSlot,
    updatePhotoSlotTransform,
    removePhotoSlot,
    // ✅ Functions để quản lý nhiều frames
    addFrame,
    removeFrame,
    updateFramePhotoSlot,
    selectMusic,
    setSignature,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    totalTymCost: state.totalTymCost,
  };
}

// ✅ Export both styles
export { useCreateCard };
export default useCreateCard;
