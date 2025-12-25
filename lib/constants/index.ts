/**
 * ✅ CONSTANTS INDEX
 * Export tất cả gradients và patterns từ một nơi
 */

// Gradients
export {
  GRADIENT_PRESETS,
  GRADIENT_CATEGORIES,
  createGradientCSS,
  getGradientsByTier,
  getGradientsByCategory,
  getFreeGradients,
  canAccessGradient,
  type GradientPreset,
  type GradientTier,
} from './gradients';

// Letter Patterns
export {
  LETTER_PATTERNS,
  LETTER_PATTERN_CATEGORIES,
  getLetterPatternsByCategory,
  getFreeLetterPatterns,
  buildLetterPatternCSS,
  type LetterPattern,
  type PatternTier,
} from './letter-patterns';

// Envelope Patterns
export {
  ENVELOPE_PATTERNS,
  ENVELOPE_PATTERN_CATEGORIES,
  getEnvelopePatternsByCategory,
  getFreeEnvelopePatterns,
  buildEnvelopePatternCSS,
  getIntensityMultiplier,
  type EnvelopePattern,
} from './envelope-patterns';

