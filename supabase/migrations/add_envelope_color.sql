-- Migration: Add envelope_color column to card_drafts and cards tables
-- Created: 2025-01-XX
-- Description: Add envelope_color column to support envelope color customization

-- Add envelope_color to card_drafts if not exists
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS envelope_color TEXT;

-- Add envelope_color to cards if not exists
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS envelope_color TEXT;

-- Verify columns were added
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'card_drafts' 
-- AND column_name = 'envelope_color';

