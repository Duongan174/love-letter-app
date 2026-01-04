# Email & Messenger Setup Guide

Hướng dẫn thiết lập email service (Resend) và Facebook Messenger API cho tính năng gửi thiệp.

## 📧 Email Service (Resend)

### 1. Đăng ký tài khoản Resend

1. Truy cập [https://resend.com](https://resend.com)
2. Đăng ký tài khoản miễn phí (100 emails/ngày)
3. Xác thực domain của bạn (hoặc dùng domain mặc định của Resend)

### 2. Lấy API Key

1. Vào **API Keys** trong dashboard
2. Tạo API key mới
3. Copy API key (chỉ hiển thị 1 lần)

### 3. Cấu hình Environment Variables

Thêm vào `.env.local` hoặc Vercel Environment Variables:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Echo <noreply@yourdomain.com>
```

**Lưu ý:**
- `RESEND_FROM_EMAIL` phải là email đã được verify trong Resend
- Format: `Display Name <email@domain.com>`

### 4. Verify Domain (Optional nhưng khuyến nghị)

1. Vào **Domains** trong Resend dashboard
2. Thêm domain của bạn
3. Thêm DNS records như hướng dẫn
4. Sau khi verify, có thể dùng email từ domain đó

---

## 📱 Facebook Messenger API

### 1. Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo App mới > Chọn **Business** type
3. Thêm **Messenger** product vào app

### 2. Tạo Facebook Page

1. Tạo một Facebook Page (hoặc dùng page có sẵn)
2. Trong App Settings > Messenger > Settings:
   - Chọn Page của bạn
   - Generate **Page Access Token**
   - Copy token (có thể regenerate sau)

### 3. Cấu hình Webhook (Optional - cho 2-way messaging)

Nếu chỉ cần gửi message (1-way), có thể bỏ qua bước này.

1. Trong Messenger > Settings > Webhooks
2. Add Callback URL: `https://yourdomain.com/api/webhooks/facebook`
3. Verify Token: tạo một token bất kỳ
4. Subscribe to events: `messages`, `messaging_postbacks`

### 4. Cấu hình Environment Variables

Thêm vào `.env.local` hoặc Vercel Environment Variables:

```bash
FACEBOOK_PAGE_ACCESS_TOKEN=EAABxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_API_VERSION=v18.0
```

**Lưu ý:**
- Page Access Token có thể expire, cần refresh định kỳ
- API Version mặc định là `v18.0`, có thể update theo Facebook

---

## ⏰ Vercel Cron Jobs

### 1. Cấu hình trong Vercel

File `vercel.json` đã được tạo với cấu hình:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-scheduled-sends",
      "schedule": "* * * * *"
    }
  ]
}
```

### 2. Setup trong Vercel Dashboard

1. Vào **Settings** > **Cron Jobs** trong Vercel project
2. Cron job sẽ tự động được detect từ `vercel.json`
3. Hoặc tạo manual:
   - Path: `/api/cron/process-scheduled-sends`
   - Schedule: `* * * * *` (mỗi phút)

### 3. Security (Khuyến nghị)

Thêm `CRON_SECRET` để bảo vệ endpoint:

```bash
CRON_SECRET=your-random-secret-key-here
```

Vercel sẽ tự động thêm header `Authorization: Bearer <CRON_SECRET>` khi gọi cron job.

---

## 🧪 Testing

### Test Email

```bash
# Test endpoint
curl -X POST http://localhost:3000/api/cards/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "your-card-id",
    "recipientEmail": "test@example.com",
    "recipientName": "Test User",
    "senderName": "Test Sender"
  }'
```

### Test Facebook Messenger

```bash
# Test endpoint
curl -X POST http://localhost:3000/api/cards/send-facebook \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "your-card-id",
    "recipientFacebookId": "123456789",
    "recipientName": "Test User",
    "senderName": "Test Sender"
  }'
```

### Test Scheduled Send

```bash
# Schedule email send
curl -X POST http://localhost:3000/api/cards/schedule-send \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "your-card-id",
    "scheduledAt": "2024-12-25T10:00:00Z",
    "sendMethod": "email",
    "recipientEmail": "test@example.com",
    "recipientName": "Test User"
  }'
```

### Test Cron Job (Local)

```bash
# Manually trigger cron job
curl -X GET http://localhost:3000/api/cron/process-scheduled-sends \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 📊 Monitoring & Logging

Tất cả email và messenger sends đều được log qua `serverLogger`:

- **Success**: Log với `messageId`
- **Failed**: Log với error message và retry attempts
- **Scheduled**: Log khi tạo và khi process

Xem logs trong:
- **Development**: Console output
- **Production**: Vercel Logs hoặc monitoring service

---

## 🔄 Retry Logic

Cả email và messenger đều có retry logic:

- **Max retries**: 3 lần
- **Backoff strategy**: Exponential (1s, 2s, 4s)
- **Max delay**: 10 giây

Sau khi retry hết, scheduled send sẽ được mark là `failed` và lưu error message.

---

## 🚨 Troubleshooting

### Email không gửi được

1. Kiểm tra `RESEND_API_KEY` có đúng không
2. Kiểm tra `RESEND_FROM_EMAIL` đã được verify chưa
3. Xem logs trong Resend dashboard
4. Kiểm tra email có vào spam không

### Facebook Messenger không gửi được

1. Kiểm tra `FACEBOOK_PAGE_ACCESS_TOKEN` có còn valid không
2. Kiểm tra Page Access Token có quyền `pages_messaging` không
3. Kiểm tra recipient ID có đúng format không (phải là numeric string)
4. Xem logs trong Facebook App dashboard

### Cron job không chạy

1. Kiểm tra `vercel.json` có đúng format không
2. Kiểm tra cron job đã được enable trong Vercel dashboard chưa
3. Kiểm tra logs trong Vercel để xem có error không
4. Test manual bằng cách gọi endpoint trực tiếp

---

## 📝 Notes

- **Development mode**: Email và Messenger sẽ được mock (log ra console)
- **Production mode**: Cần đầy đủ API keys để hoạt động
- **Rate limits**: 
  - Resend free tier: 100 emails/ngày
  - Facebook Messenger: 250 messages/user/24h (standard)
- **Cost**: 
  - Resend: Free tier đủ cho testing, paid từ $20/tháng
  - Facebook Messenger: Miễn phí

