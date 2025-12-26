# Database Migrations

## Add used_fonts Column

File: `add_used_fonts_column.sql`

### Mô tả
Thêm column `used_fonts` vào bảng `card_drafts` và `cards` để lưu danh sách font IDs đã sử dụng trong thiệp.

### Cách chạy

1. Mở Supabase Dashboard
2. Vào SQL Editor
3. Copy và paste nội dung từ file `add_used_fonts_column.sql`
4. Click "Run" để thực thi

### Hoặc chạy trực tiếp trong Supabase SQL Editor:

```sql
-- Add used_fonts column to card_drafts table
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS used_fonts TEXT[] DEFAULT NULL;

-- Add used_fonts column to cards table
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS used_fonts TEXT[] DEFAULT NULL;
```

### Lưu ý
- Migration này an toàn, có thể chạy nhiều lần (sử dụng `IF NOT EXISTS`)
- Column sẽ có giá trị mặc định là `NULL`
- Type là `TEXT[]` (array of strings) để lưu danh sách font IDs

### Sau khi chạy migration
- Code sẽ tự động sử dụng column `used_fonts` để lưu fonts đã sử dụng
- Nếu column chưa tồn tại, code sẽ tự động bỏ qua và không gây lỗi

---

## Add letter_container_background Column

File: `add_letter_container_background_column.sql`

### Mô tả
Thêm column `letter_container_background` vào bảng `card_drafts` và `cards` để lưu màu nền/gradient của container bên ngoài trang giấy viết.

### Cách chạy

1. Mở Supabase Dashboard
2. Vào SQL Editor
3. Copy và paste nội dung từ file `add_letter_container_background_column.sql`
4. Click "Run" để thực thi

### Hoặc chạy trực tiếp trong Supabase SQL Editor:

```sql
-- Add to card_drafts table
ALTER TABLE card_drafts
ADD COLUMN IF NOT EXISTS letter_container_background TEXT DEFAULT 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))';

-- Add to cards table
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS letter_container_background TEXT DEFAULT 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))';
```

### Lưu ý
- Migration này an toàn, có thể chạy nhiều lần (sử dụng `IF NOT EXISTS`)
- Column sẽ có giá trị mặc định là gradient nhẹ
- Type là `TEXT` để lưu CSS gradient hoặc màu đơn sắc

### Sau khi chạy migration
- Code sẽ tự động sử dụng column `letter_container_background` để lưu nền container
- Nếu column chưa tồn tại, autosave sẽ bị lỗi 500

