-- Create categories table for card templates
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Insert default categories
INSERT INTO categories (name, label, emoji, display_order) VALUES
  ('love', 'Tình yêu', '❤️', 1),
  ('birthday', 'Sinh nhật', '🎂', 2),
  ('classic', 'Cổ điển', '📜', 3),
  ('thankyou', 'Cảm ơn', '🙏', 4),
  ('wedding', 'Cưới hỏi', '💒', 5),
  ('holiday', 'Lễ hội', '🎉', 6)
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true);

-- Policy: Only admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

