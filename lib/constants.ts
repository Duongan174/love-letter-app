// lib/constants.ts
/**
 * Standard card dimensions for consistency across the application
 * All cards, templates, and images should use this size
 * A4 size: 8.5" x 11" = 612pt x 792pt
 */
export const CARD_DIMENSIONS = {
  width: 612,
  height: 792,
  aspectRatio: 612 / 792, // A4 ratio
} as const;

export const CARD_ASPECT_RATIO = CARD_DIMENSIONS.aspectRatio;

