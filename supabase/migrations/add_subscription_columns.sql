-- Migration: Thêm subscription columns vào bảng users
-- File: supabase/migrations/add_subscription_columns.sql

-- ✅ Thêm subscription_tier column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro', 'ultra'));

-- ✅ Thêm subscription_expires_at column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- ✅ Tạo index để tối ưu query subscription
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_expires_at ON users(subscription_expires_at) WHERE subscription_expires_at IS NOT NULL;

-- ✅ Function để kiểm tra và tự động downgrade subscription hết hạn
CREATE OR REPLACE FUNCTION check_and_downgrade_expired_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET 
    subscription_tier = 'free',
    subscription_expires_at = NULL
  WHERE 
    subscription_tier != 'free'
    AND subscription_expires_at IS NOT NULL
    AND subscription_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ✅ Tạo comment cho các columns
COMMENT ON COLUMN users.subscription_tier IS 'Gói dịch vụ: free, plus, pro, ultra';
COMMENT ON COLUMN users.subscription_expires_at IS 'Thời gian hết hạn của gói subscription (NULL = không bao giờ hết hạn cho free tier)';

-- ✅ Tạo table để track subscription expiry emails đã gửi (tránh spam)
CREATE TABLE IF NOT EXISTS subscription_expiry_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier VARCHAR(20) NOT NULL,
  expiry_date DATE NOT NULL,
  email_sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, expiry_date) -- Tránh gửi duplicate email cho cùng một expiry date
);

-- Index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_subscription_expiry_emails_user_id ON subscription_expiry_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_expiry_emails_expiry_date ON subscription_expiry_emails(expiry_date);

