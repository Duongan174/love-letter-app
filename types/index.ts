// types/index.ts

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  points: number;
  provider: 'facebook' | 'tiktok';
  created_at: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  thumbnail: string;
  preview_url: string;
  animation_type: 'fade' | 'slide' | 'zoom' | 'flip' | 'sparkle';
  category: string;
  points_required: number;
  is_premium: boolean;
  created_at: string;
}

export interface Envelope {
  id: string;
  name: string;
  color: string;
  texture?: string;
  thumbnail: string;
  points_required: number;
}

export interface Stamp {
  id: string;
  name: string;
  image_url: string;
  points_required: number;
}

export interface Music {
  id: string;
  name: string;
  url: string;
  duration: number;
  category: string;
  points_required: number;
}

export interface FontStyle {
  id: string;
  name: string;
  font_family: string;
  preview: string;
}

export interface TextEffect {
  id: string;
  name: string;
  type: 'typewriter' | 'fade-in' | 'slide-up' | 'glow' | 'handwriting';
  preview: string;
}

export interface Card {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_email?: string;
  template_id: string;
  envelope_id: string;
  stamp_id: string;
  music_id: string;
  content: string;
  font_style: string;
  text_effect: string;
  images: string[];
  signature_data?: string; // Base64 của chữ ký
  sender_name: string;
  status: 'draft' | 'sent' | 'viewed';
  view_count: number;
  created_at: string;
  sent_at?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  points: number;
  max_uses: number;
  current_uses: number;
  expires_at: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface CreateCardState {
  step: number;
  template: CardTemplate | null;
  envelope: Envelope | null;
  stamp: Stamp | null;
  music: Music | null;
  content: string;
  fontStyle: string;
  textEffect: string;
  images: string[];
  signature: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
}