// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateShareLink(cardId: string): string {
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/card/${cardId}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function formatPoints(points: number): string {
  if (points >= 1000000) return (points / 1000000).toFixed(1) + 'M';
  if (points >= 1000) return (points / 1000).toFixed(1) + 'K';
  return points.toString();
}