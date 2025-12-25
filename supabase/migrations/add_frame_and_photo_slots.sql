-- Migration: Add frame_id and photo_slots columns to card_drafts and cards tables
-- Created: 2025-01-XX
-- Description: Support for Step 4 (Photo Frames) functionality

-- ============================================
-- 1. Add columns to card_drafts table
-- ============================================

-- Add frame_id column (references photo_frames table)
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS frame_id UUID REFERENCES photo_frames(id) ON DELETE SET NULL;

-- Add photo_slots column (JSONB to store array of photo slots with transforms)
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS photo_slots JSONB DEFAULT '[]'::jsonb;

-- Add index for frame_id for better query performance
CREATE INDEX IF NOT EXISTS idx_card_drafts_frame_id ON card_drafts(frame_id);

-- Add GIN index for photo_slots JSONB queries
CREATE INDEX IF NOT EXISTS idx_card_drafts_photo_slots ON card_drafts USING GIN (photo_slots);

-- ============================================
-- 2. Add columns to cards table
-- ============================================

-- Add frame_id column (references photo_frames table)
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS frame_id UUID REFERENCES photo_frames(id) ON DELETE SET NULL;

-- Add photo_slots column (JSONB to store array of photo slots with transforms)
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS photo_slots JSONB DEFAULT '[]'::jsonb;

-- Add index for frame_id for better query performance
CREATE INDEX IF NOT EXISTS idx_cards_frame_id ON cards(frame_id);

-- Add GIN index for photo_slots JSONB queries
CREATE INDEX IF NOT EXISTS idx_cards_photo_slots ON cards USING GIN (photo_slots);

-- ============================================
-- 3. Add envelope customization columns if not exists
-- ============================================

-- For card_drafts
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS envelope_color TEXT, -- ✅ Màu từ customization
ADD COLUMN IF NOT EXISTS envelope_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS envelope_pattern_color TEXT DEFAULT '#5d4037',
ADD COLUMN IF NOT EXISTS envelope_pattern_intensity NUMERIC(3,2) DEFAULT 0.15,
ADD COLUMN IF NOT EXISTS envelope_seal_design TEXT DEFAULT 'heart',
ADD COLUMN IF NOT EXISTS envelope_seal_color TEXT DEFAULT '#c62828',
ADD COLUMN IF NOT EXISTS envelope_liner_pattern_type TEXT,
ADD COLUMN IF NOT EXISTS envelope_liner_color TEXT DEFAULT '#ffffff';

-- For cards
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS envelope_color TEXT, -- ✅ Màu từ customization
ADD COLUMN IF NOT EXISTS envelope_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS envelope_pattern_color TEXT DEFAULT '#5d4037',
ADD COLUMN IF NOT EXISTS envelope_pattern_intensity NUMERIC(3,2) DEFAULT 0.15,
ADD COLUMN IF NOT EXISTS envelope_seal_design TEXT DEFAULT 'heart',
ADD COLUMN IF NOT EXISTS envelope_seal_color TEXT DEFAULT '#c62828',
ADD COLUMN IF NOT EXISTS envelope_liner_pattern_type TEXT,
ADD COLUMN IF NOT EXISTS envelope_liner_color TEXT DEFAULT '#ffffff';

-- ============================================
-- 4. Add rich_content column if not exists
-- ============================================

ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS rich_content TEXT;

-- ============================================
-- 5. Add letter_background and letter_pattern columns
-- ============================================

-- For card_drafts
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS letter_background TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS letter_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS cover_background TEXT DEFAULT '#fdf2f8',
ADD COLUMN IF NOT EXISTS cover_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS photo_background TEXT DEFAULT '#fff8e1',
ADD COLUMN IF NOT EXISTS photo_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS signature_background TEXT DEFAULT '#fce4ec',
ADD COLUMN IF NOT EXISTS signature_pattern TEXT DEFAULT 'solid';

-- For cards
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS letter_background TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS letter_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS cover_background TEXT DEFAULT '#fdf2f8',
ADD COLUMN IF NOT EXISTS cover_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS photo_background TEXT DEFAULT '#fff8e1',
ADD COLUMN IF NOT EXISTS photo_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS signature_background TEXT DEFAULT '#fce4ec',
ADD COLUMN IF NOT EXISTS signature_pattern TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS rich_content TEXT;

-- ============================================
-- Notes:
-- ============================================
-- After running this migration:
-- 1. Regenerate TypeScript types from Supabase:
--    npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
--
-- 2. Verify columns were added:
--    SELECT column_name, data_type 
--    FROM information_schema.columns 
--    WHERE table_name = 'card_drafts' 
--    AND column_name IN ('frame_id', 'photo_slots', 'rich_content');
--
-- 3. Verify columns in cards table:
--    SELECT column_name, data_type 
--    FROM information_schema.columns 
--    WHERE table_name = 'cards' 
--    AND column_name IN ('frame_id', 'photo_slots');

