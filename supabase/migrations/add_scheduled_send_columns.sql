-- Migration: Thêm columns cho scheduled send và utilities
-- File: supabase/migrations/add_scheduled_send_columns.sql

-- ✅ Thêm utilities column vào card_drafts
ALTER TABLE card_drafts 
ADD COLUMN IF NOT EXISTS utilities JSONB;

-- ✅ Thêm utilities column vào cards
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS utilities JSONB;

-- ✅ Thêm scheduled send columns vào cards (fallback nếu không có scheduled_sends table)
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS scheduled_send_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS scheduled_send_method TEXT DEFAULT 'link';

-- ✅ Tạo table scheduled_sends (nếu chưa có)
CREATE TABLE IF NOT EXISTS scheduled_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  send_method TEXT NOT NULL DEFAULT 'link', -- 'link' | 'email' | 'facebook' | 'both'
  recipient_email TEXT,
  recipient_facebook_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'sent' | 'failed'
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ Tạo index để query nhanh
CREATE INDEX IF NOT EXISTS idx_scheduled_sends_status_at 
ON scheduled_sends(status, scheduled_at) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_cards_scheduled_send_at 
ON cards(scheduled_send_at) 
WHERE scheduled_send_at IS NOT NULL;

-- ✅ Tạo function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ Tạo trigger để auto-update updated_at
DROP TRIGGER IF EXISTS update_scheduled_sends_updated_at ON scheduled_sends;
CREATE TRIGGER update_scheduled_sends_updated_at
  BEFORE UPDATE ON scheduled_sends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ✅ RLS Policies (nếu cần)
-- ALTER TABLE scheduled_sends ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own scheduled sends"
--   ON scheduled_sends FOR SELECT
--   USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can create their own scheduled sends"
--   ON scheduled_sends FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

