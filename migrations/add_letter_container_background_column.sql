-- Migration: Add letter_container_background column to card_drafts and cards tables
-- This column stores the background color/gradient for the container around the letter page

-- Add to card_drafts table
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS letter_container_background TEXT DEFAULT 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))';

-- Add to cards table
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS letter_container_background TEXT DEFAULT 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))';

