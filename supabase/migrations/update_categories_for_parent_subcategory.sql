-- Update categories table to support parent-child relationship
-- Add parent_id column for subcategories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Update existing categories to be parent categories (no parent_id)
-- This migration assumes existing categories are all parent categories

-- Add a function to get category hierarchy
CREATE OR REPLACE FUNCTION get_category_hierarchy()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  label VARCHAR,
  emoji VARCHAR,
  display_order INTEGER,
  is_active BOOLEAN,
  parent_id UUID,
  parent_name VARCHAR,
  parent_label VARCHAR,
  level INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE category_tree AS (
    -- Parent categories (no parent_id)
    SELECT 
      c.id,
      c.name,
      c.label,
      c.emoji,
      c.display_order,
      c.is_active,
      c.parent_id,
      NULL::VARCHAR as parent_name,
      NULL::VARCHAR as parent_label,
      1 as level
    FROM categories c
    WHERE c.parent_id IS NULL
    
    UNION ALL
    
    -- Subcategories (with parent_id)
    SELECT 
      c.id,
      c.name,
      c.label,
      c.emoji,
      c.display_order,
      c.is_active,
      c.parent_id,
      p.name as parent_name,
      p.label as parent_label,
      ct.level + 1 as level
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
    LEFT JOIN categories p ON c.parent_id = p.id
  )
  SELECT * FROM category_tree
  ORDER BY level, display_order, name;
END;
$$ LANGUAGE plpgsql;

