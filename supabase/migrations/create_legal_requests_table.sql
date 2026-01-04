-- Create legal_requests table for storing legal requests and complaints
CREATE TABLE IF NOT EXISTS legal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  request_type VARCHAR(50) NOT NULL, -- 'content_removal', 'privacy_complaint', 'data_access', 'copyright'
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_review', 'resolved', 'rejected'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL, -- Admin user handling the request
  response TEXT, -- Response from admin
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_legal_requests_user_id ON legal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_requests_status ON legal_requests(status);
CREATE INDEX IF NOT EXISTS idx_legal_requests_request_type ON legal_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_legal_requests_created_at ON legal_requests(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE legal_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own legal requests"
  ON legal_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create legal requests
CREATE POLICY "Users can create legal requests"
  ON legal_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Policy: Admins can view all requests
CREATE POLICY "Admins can view all legal requests"
  ON legal_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Admins can update all requests
CREATE POLICY "Admins can update all legal requests"
  ON legal_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_legal_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_legal_requests_updated_at
  BEFORE UPDATE ON legal_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_legal_requests_updated_at();

