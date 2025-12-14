'use client';

import { useState, useCallback } from 'react';

export interface CardTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  animation_type: string;
  tym_cost: number;
  is_premium: boolean;
}

export interface Envelope {
  id: string;
  name: string;
  color: string;
  texture: string;
  thumbnail: string;
  tym_cost: number;
}

export interface Stamp {
  id: string;
  name: string;
  image: string;
  tym_cost: number;
}

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  category: string;
  duration: number;
  tym_cost: number;
}

export interface CreateCardState {
  templateId: string | null;
  template: CardTemplate | null;
  envelopeId: string | null;
  envelope: Envelope | null;
  stampId: string | null;
  stamp: Stamp | null;
  recipientName: string;
  senderName: string;
  message: string;
  fontStyle: string;
  textEffect: string;
  photos: string[];
  musicId: string | null;
  music: MusicTrack | null;
  signatureData: string | null;
  totalTymCost: number;
}

const initialState: CreateCardState = {
  templateId: null,
  template: null,
  envelopeId: null,
  envelope: null,
  stampId: null,
  stamp: null,
  recipientName: '',
  senderName: '',
  message: '',
  fontStyle: 'dancing',
  textEffect: 'none',
  photos: [],
  musicId: null,
  music: null,
  signatureData: null,
  totalTymCost: 0,
};

export function useCreateCard() {
  const [state, setState] = useState<CreateCardState>(initialState);
  const [currentStep, setCurrentStep] = useState(1);

  const calculateTymCost = useCallback((newState: Partial<CreateCardState>) => {
    const merged = { ...state, ...newState };
    let total = 0;
    if (merged.template) total += merged.template.tym_cost;
    if (merged.envelope) total += merged.envelope.tym_cost;
    if (merged.stamp) total += merged.stamp.tym_cost;
    if (merged.music) total += merged.music.tym_cost;
    return total;
  }, [state]);

  const updateState = useCallback((updates: Partial<CreateCardState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      newState.totalTymCost = calculateTymCost(updates);
      return newState;
    });
  }, [calculateTymCost]);

  const selectTemplate = useCallback((template: CardTemplate) => {
    updateState({ templateId: template.id, template });
  }, [updateState]);

  const selectEnvelope = useCallback((envelope: Envelope) => {
    updateState({ envelopeId: envelope.id, envelope });
  }, [updateState]);

  const selectStamp = useCallback((stamp: Stamp) => {
    updateState({ stampId: stamp.id, stamp });
  }, [updateState]);

  const updateMessage = useCallback((data: {
    recipientName?: string;
    senderName?: string;
    message?: string;
    fontStyle?: string;
    textEffect?: string;
  }) => {
    updateState(data);
  }, [updateState]);

  const addPhoto = useCallback((photoUrl: string) => {
    if (state.photos.length < 4) {
      updateState({ photos: [...state.photos, photoUrl] });
    }
  }, [state.photos, updateState]);

  const removePhoto = useCallback((index: number) => {
    updateState({ photos: state.photos.filter((_, i) => i !== index) });
  }, [state.photos, updateState]);

  const selectMusic = useCallback((music: MusicTrack | null) => {
    updateState({ musicId: music?.id || null, music });
  }, [updateState]);

  const setSignature = useCallback((signatureData: string | null) => {
    updateState({ signatureData });
  }, [updateState]);

  const nextStep = useCallback(() => {
    if (currentStep < 7) setCurrentStep(prev => prev + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 7) setCurrentStep(step);
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    setCurrentStep(1);
  }, []);

  const canProceed = useCallback((step: number): boolean => {
    switch (step) {
      case 1: return !!state.templateId;
      case 2: return !!state.envelopeId;
      case 3: return !!state.recipientName && !!state.message;
      default: return true;
    }
  }, [state]);

  return {
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
    goToStep,
    reset,
    canProceed,
    totalTymCost: state.totalTymCost,
  };
}