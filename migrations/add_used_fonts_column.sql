-- Migration: Add used_fonts column to card_drafts and cards tables
-- Run this SQL in your Supabase SQL Editor

-- Add used_fonts column to card_drafts table
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS used_fonts TEXT[] DEFAULT NULL;

-- Add used_fonts column to cards table
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS used_fonts TEXT[] DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN card_drafts.used_fonts IS 'Array of font IDs used in the card content';
COMMENT ON COLUMN cards.used_fonts IS 'Array of font IDs used in the card content';

