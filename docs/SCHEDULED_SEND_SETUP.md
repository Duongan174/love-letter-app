# Hướng Dẫn Setup Scheduled Send (Gửi Theo Lịch)

## Tổng Quan

Hệ thống hỗ trợ gửi thiệp tự động qua Email/Facebook và có thể lên lịch gửi vào thời gian cụ thể.

## Tính Năng

### 1. Gửi Tự Động
- **Email**: Gửi thiệp qua Gmail/Email
- **Facebook**: Gửi thiệp qua Facebook Messenger
- **Cả hai**: Gửi đồng thời qua cả Email và Facebook

### 2. Scheduled Send
- Đặt ngày và giờ cụ thể để tự động gửi thiệp
- Background job sẽ kiểm tra và gửi thiệp đúng thời gian

## Setup Database

### 1. Chạy Migration

```sql
-- Chạy file migration
psql -U postgres -d your_database -f supabase/migrations/add_scheduled_send_columns.sql
```

Hoặc chạy trực tiếp trong Supabase SQL Editor.

### 2. Kiểm Tra Tables

```sql
-- Kiểm tra scheduled_sends table
SELECT * FROM scheduled_sends LIMIT 1;

-- Kiểm tra utilities column
SELECT utilities FROM cards LIMIT 1;
```

## Setup Email Service

### Option 1: Resend (Khuyến nghị - dễ setup)

1. Đăng ký tại https://resend.com
2. Lấy API key
3. Thêm vào `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

4. Cập nhật `app/api/cards/send-email/route.ts`:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Echo <noreply@yourdomain.com>',
  to: recipientEmail,
  subject: emailSubject,
  html: emailBody,
});
```

### Option 2: SendGrid

1. Đăng ký tại https://sendgrid.com
2. Lấy API key
3. Thêm vào `.env.local`:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Option 3: Nodemailer với SMTP

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

## Setup Facebook Messenger API

1. Tạo Facebook App tại https://developers.facebook.com
2. Thêm Messenger product
3. Lấy Page Access Token
4. Thêm vào `.env.local`:
```env
FACEBOOK_PAGE_ACCESS_TOKEN=xxxxxxxxxxxxx
```

5. Cập nhật `app/api/cards/send-facebook/route.ts` với Facebook Graph API thực tế.

## Setup Cron Job

### Option 1: Vercel Cron (Nếu deploy trên Vercel)

Thêm vào `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/process-scheduled-sends",
    "schedule": "*/5 * * * *"
  }]
}
```

### Option 2: GitHub Actions

Tạo `.github/workflows/scheduled-sends.yml`:
```yaml
name: Process Scheduled Sends
on:
  schedule:
    - cron: '*/5 * * * *' # Mỗi 5 phút
  workflow_dispatch:

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/process-scheduled-sends
```

### Option 3: External Cron Service

- EasyCron: https://www.easycron.com
- Cron-job.org: https://cron-job.org

Setup để gọi: `GET https://your-domain.com/api/cron/process-scheduled-sends`

**Security**: Thêm `CRON_SECRET` vào `.env.local` và pass trong Authorization header.

## Cách Sử Dụng

### Trong Step 4 (Utilities)

1. **Chọn phương thức gửi**:
   - Link: Chỉ tạo link (mặc định)
   - Email: Gửi qua email
   - Facebook: Gửi qua Facebook
   - Cả hai: Gửi qua cả Email và Facebook

2. **Nhập thông tin người nhận**:
   - Email (nếu chọn Email hoặc Cả hai)
   - Facebook ID/Username (nếu chọn Facebook hoặc Cả hai)

3. **Lên lịch gửi**:
   - Bật "Gửi Theo Lịch"
   - Chọn ngày và giờ gửi
   - Thiệp sẽ được gửi tự động đúng thời gian

### Trong Step 5 (Preview)

- Click "Gửi thiệp" để:
  - Tạo card
  - Gửi tự động (nếu đã cấu hình)
  - Lên lịch gửi (nếu đã set scheduled send)

## API Endpoints

### POST `/api/cards/send-email`
Gửi thiệp qua email

**Body:**
```json
{
  "cardId": "uuid",
  "recipientEmail": "user@example.com",
  "recipientName": "Tên người nhận",
  "senderName": "Tên người gửi"
}
```

### POST `/api/cards/send-facebook`
Gửi thiệp qua Facebook

**Body:**
```json
{
  "cardId": "uuid",
  "recipientFacebookId": "facebook_id",
  "recipientName": "Tên người nhận",
  "senderName": "Tên người gửi"
}
```

### POST `/api/cards/schedule`
Lên lịch gửi thiệp

**Body:**
```json
{
  "cardId": "uuid",
  "scheduledSendDate": "2024-12-25T10:00:00Z",
  "sendMethod": "email",
  "recipientEmail": "user@example.com"
}
```

### GET `/api/cron/process-scheduled-sends`
Background job để xử lý scheduled sends (gọi bởi cron)

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
```

## Troubleshooting

### Email không gửi được
1. Kiểm tra API key đã đúng chưa
2. Kiểm tra domain đã verify chưa (Resend/SendGrid)
3. Kiểm tra spam folder

### Facebook không gửi được
1. Kiểm tra Page Access Token
2. Kiểm tra app đã được approve chưa
3. Kiểm tra recipient ID có đúng không

### Scheduled send không chạy
1. Kiểm tra cron job đã setup chưa
2. Kiểm tra `CRON_SECRET` đã đúng chưa
3. Kiểm tra database có scheduled_sends records không
4. Kiểm tra logs của cron job

## Best Practices

1. **Email Service**: Nên dùng Resend hoặc SendGrid (dễ setup, reliable)
2. **Cron Frequency**: Mỗi 5 phút là hợp lý (không quá thường xuyên)
3. **Error Handling**: Log errors và retry failed sends
4. **Rate Limiting**: Giới hạn số lượng email/Facebook messages mỗi giờ
5. **Monitoring**: Theo dõi success rate và failed sends

