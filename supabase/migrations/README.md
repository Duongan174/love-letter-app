# Database Migrations

## Migration: Add Frame and Photo Slots Support

File: `add_frame_and_photo_slots.sql`

### Mô tả
Migration này thêm các cột cần thiết để hỗ trợ:
- **Step 4**: Photo Frames với photo slots và transforms
- **Step 5**: Music (đã có sẵn)
- **Step 6**: Signature (đã có sẵn)
- Envelope customization fields

### Cách chạy migration

#### Cách 1: Qua Supabase Dashboard (Khuyến nghị)
1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)
4. Click **New Query**
5. Copy toàn bộ nội dung file `add_frame_and_photo_slots.sql`
6. Paste vào SQL Editor
7. Click **Run** hoặc nhấn `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

#### Cách 2: Qua Supabase CLI
```bash
# Nếu bạn đã setup Supabase CLI
supabase db push
```

### Kiểm tra migration thành công

Sau khi chạy migration, kiểm tra bằng SQL query sau:

```sql
-- Kiểm tra card_drafts table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'card_drafts' 
AND column_name IN ('frame_id', 'photo_slots', 'rich_content', 'envelope_pattern', 'envelope_seal_design')
ORDER BY column_name;

-- Kiểm tra cards table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND column_name IN ('frame_id', 'photo_slots', 'envelope_pattern', 'envelope_seal_design')
ORDER BY column_name;
```

### Sau khi migration

1. **Regenerate TypeScript types** (nếu dùng Supabase CLI):
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
   ```

2. **Hoặc cập nhật types thủ công** trong `types/supabase.ts`:
   - Thêm `frame_id: string | null` vào `card_drafts.Row`, `Insert`, `Update`
   - Thêm `photo_slots: Json | null` vào `card_drafts.Row`, `Insert`, `Update`
   - Tương tự cho bảng `cards`

### Rollback (nếu cần)

Nếu cần rollback migration:

```sql
-- Rollback card_drafts
ALTER TABLE card_drafts
DROP COLUMN IF EXISTS frame_id,
DROP COLUMN IF EXISTS photo_slots,
DROP COLUMN IF EXISTS envelope_pattern,
DROP COLUMN IF EXISTS envelope_pattern_color,
DROP COLUMN IF EXISTS envelope_pattern_intensity,
DROP COLUMN IF EXISTS envelope_seal_design,
DROP COLUMN IF EXISTS envelope_seal_color,
DROP COLUMN IF EXISTS envelope_liner_pattern_type,
DROP COLUMN IF EXISTS envelope_liner_color,
DROP COLUMN IF EXISTS rich_content;

-- Rollback cards
ALTER TABLE cards
DROP COLUMN IF EXISTS frame_id,
DROP COLUMN IF EXISTS photo_slots,
DROP COLUMN IF EXISTS envelope_pattern,
DROP COLUMN IF EXISTS envelope_pattern_color,
DROP COLUMN IF EXISTS envelope_pattern_intensity,
DROP COLUMN IF EXISTS envelope_seal_design,
DROP COLUMN IF EXISTS envelope_seal_color,
DROP COLUMN IF EXISTS envelope_liner_pattern_type,
DROP COLUMN IF EXISTS envelope_liner_color;
```

### Lưu ý

- Migration sử dụng `IF NOT EXISTS` nên an toàn khi chạy nhiều lần
- Các cột mới đều có giá trị mặc định hoặc cho phép NULL
- Indexes được tạo tự động để tối ưu performance

