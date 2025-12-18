// hooks/useCreateCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  // ĐÃ XÓA linerPattern
  stampId: string | null;
  recipientName: string;
  senderName: string;
  message: string;
  fontStyle: string;
  textEffect: string;
  photos: any[];
  musicId: string | null;
  signatureData: string | null;
  totalTymCost: number;
  // Full objects for preview
  template: any;
  envelope: any;
  stamp: any;
  music: any;
}

export function useCreateCard() {
  const [state, setState] = useState<CreateCardState>({
    templateId: null,
    envelopeId: null,
    stampId: null,
    recipientName: '',
    senderName: '',
    message: '',
    fontStyle: 'font-dancing',
    textEffect: 'none',
    photos: [],
    musicId: null,
    signatureData: null,
    totalTymCost: 0,
    template: null,
    envelope: null,
    stamp: null,
    music: null,
  });

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    let cost = 0;
    if (state.template?.points_required) cost += state.template.points_required;
    if (state.envelope?.points_required) cost += state.envelope.points_required;
    if (state.stamp?.points_required) cost += state.stamp.points_required;
    if (state.music?.points_required) cost += state.music.points_required;
    setState(prev => ({ ...prev, totalTymCost: cost }));
  }, [state.template, state.envelope, state.stamp, state.music]);

  // Actions
  const setTemplateById = async (id: string) => {
    if (!id) return;
    const { data } = await supabase.from('card_templates').select('*').eq('id', id).single();
    if (data) setState(prev => ({ ...prev, templateId: id, template: data }));
  };

  const selectEnvelope = (envelope: any) => {
    setState(prev => ({ ...prev, envelopeId: envelope.id, envelope }));
  };

  // ĐÃ XÓA hàm selectLiner

  const selectStamp = (stamp: any) => {
    setState(prev => ({ ...prev, stampId: stamp.id, stamp }));
  };

  const updateMessage = (data: any) => setState(prev => ({ ...prev, ...data }));
  const addPhoto = (photo: any) => setState(prev => ({ ...prev, photos: [...prev.photos, photo] }));
  const removePhoto = (id: string) => setState(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }));
  const selectMusic = (music: any) => setState(prev => ({ ...prev, musicId: music?.id || null, music }));
  const setSignature = (data: string) => setState(prev => ({ ...prev, signatureData: data }));

  // Navigation Logic
  const canProceed = (step: number) => {
    switch (step) {
      case 1: return !!state.envelopeId; 
      case 2: return !!state.stampId;
      case 3: return !!state.recipientName && !!state.message;
      default: return true;
    }
  };

  const nextStep = () => { if (canProceed(currentStep)) setCurrentStep(prev => prev + 1); };
  const prevStep = () => { setCurrentStep(prev => Math.max(1, prev - 1)); };

  return {
    state,
    currentStep,
    setTemplateById,
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
    totalTymCost: state.totalTymCost,
  };
}