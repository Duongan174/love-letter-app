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
  stampId: string | null;
  recipientName: string;
  senderName: string;
  message: string;
  fontStyle: string;
  textEffect: string;
  photos: string[];
  musicId: string | null;
  signatureData: string | null;
  totalTymCost: number;
  // Full objects for preview
  template: any;
  envelope: any;
  stamp: any;
  music: any;
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

  const setEnvelopeById = async (id: string) => {
    if (!id) return;
    const { data } = await supabase.from('envelopes').select('*').eq('id', id).single();
    if (data) setState(prev => ({ ...prev, envelopeId: id, envelope: data }));
  };

  const setStampById = async (id: string) => {
    if (!id) return;
    const { data } = await supabase.from('stamps').select('*').eq('id', id).single();
    if (data) setState(prev => ({ ...prev, stampId: id, stamp: data }));
  };

  const setMusicById = async (id: string) => {
    if (!id) return;
    const { data } = await supabase.from('music').select('*').eq('id', id).single();
    if (data) setState(prev => ({ ...prev, musicId: id, music: data }));
  };

  const selectEnvelope = (envelope: any) => {
    setState(prev => ({ ...prev, envelopeId: envelope.id, envelope }));
  };

  const selectStamp = (stamp: any) => {
    setState(prev => ({ ...prev, stampId: stamp.id, stamp }));
  };

  const updateMessage = (data: any) => setState(prev => ({ ...prev, ...data }));
  const addPhoto = (photoUrl: string) => setState(prev => ({ ...prev, photos: [...prev.photos, photoUrl] }));
  const removePhoto = (index: number) =>
    setState(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
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
    totalTymCost: state.totalTymCost,
  };
}

// ✅ Export both styles
export { useCreateCard };
export default useCreateCard;
