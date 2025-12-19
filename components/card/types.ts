// components/card/types.ts
export type CardMode = 'draft' | 'preview' | 'published';

export interface CardData {
  templateUrl: string; // animation/video/gif
  message: string;
  signature: string;
  musicUrl?: string;
}
