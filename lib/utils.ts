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

/**
 * Resolve an image URL coming from DB/admin input.
 *
 * Supports:
 * - Absolute URLs (http/https)
 * - data:/blob:
 * - Root-relative (/foo.png)
 * - Supabase Storage public paths ("storage/v1/..." or "bucket/path")
 *
 * Security: blocks `javascript:` URLs.
 */
export function resolveImageUrl(raw?: string | null): string | null {
  if (!raw) return null;

  const s = String(raw).trim();
  if (!s) return null;

  const lower = s.toLowerCase();
  if (lower.startsWith('javascript:')) return null;

  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('data:') ||
    lower.startsWith('blob:')
  ) {
    return s;
  }

  if (s.startsWith('/')) return s;

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/g, '');
  if (!supabaseUrl) {
    return `/${s}`;
  }

  if (s.startsWith('storage/v1/')) {
    return `${supabaseUrl}/${s}`;
  }

  // Treat as "bucket/path"
  return `${supabaseUrl}/storage/v1/object/public/${s}`;
}
