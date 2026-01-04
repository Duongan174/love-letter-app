-- Migration: Thêm subscription_tier vào bảng card_templates
-- File: supabase/migrations/add_subscription_tier_to_templates.sql

-- ✅ Thêm subscription_tier column
ALTER TABLE card_templates 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro', 'ultra'));

-- ✅ Tạo index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_card_templates_subscription_tier ON card_templates(subscription_tier);

-- ✅ Update existing templates: nếu is_premium = true thì set subscription_tier = 'ultra', ngược lại = 'free'
UPDATE card_templates
SET subscription_tier = CASE 
  WHEN is_premium = true THEN 'ultra'
  ELSE 'free'
END
WHERE subscription_tier IS NULL OR subscription_tier = 'free';

-- ✅ Tạo comment
COMMENT ON COLUMN card_templates.subscription_tier IS 'Gói dịch vụ có thể sử dụng mẫu này: free, plus, pro, ultra';

