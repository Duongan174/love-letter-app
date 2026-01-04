# 🚀 Vercel Deployment Checklist

**File này ghi nhớ tất cả các phần cần cấu hình trên Vercel trước khi deploy production.**

> ⚠️ **QUAN TRỌNG**: Đọc file này trước khi deploy lên Vercel để đảm bảo không thiếu bất kỳ cấu hình nào.

---

## 📋 Mục lục

1. [Environment Variables](#1-environment-variables)
2. [Cron Jobs Configuration](#2-cron-jobs-configuration)
3. [Database Migrations](#3-database-migrations)
4. [Domain & DNS](#4-domain--dns)
5. [Third-party Services](#5-third-party-services)
6. [Security Settings](#6-security-settings)
7. [Pre-deployment Checklist](#7-pre-deployment-checklist)

---

## 1. Environment Variables

### 🔴 Bắt buộc (Required)

Thêm các biến môi trường sau vào **Vercel Project Settings > Environment Variables**:

#### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Lấy từ đâu:**
- Vào Supabase Dashboard > Project Settings > API
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **QUAN TRỌNG cho admin features**

**Lưu ý về Service Role Key:**
- ⚠️ **KHÔNG BAO GIỜ** expose key này trong client-side code
- Chỉ dùng trong server-side API routes
- Key này bypass tất cả RLS policies, cần bảo mật cẩn thận
- Cần cho admin panel để xem tất cả users (bypass RLS)

#### Application URL
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Lưu ý:**
- Sử dụng domain production (không dùng `localhost:3000`)
- Cần cho subscription renewal links và email notifications

---

### 🟡 Khuyến nghị (Recommended)

#### Email Service (Resend)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Echo <noreply@yourdomain.com>
```

**Setup:**
1. Đăng ký tại [resend.com](https://resend.com)
2. Verify domain hoặc dùng domain mặc định của Resend
3. Tạo API key trong Resend Dashboard
4. `RESEND_FROM_EMAIL` phải là email đã được verify

**Công dụng:**
- Gửi email thiệp
- Gửi email subscription expiry warnings
- Email notifications khác

#### Cloudinary (File Upload)
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Setup:**
1. Đăng ký tại [cloudinary.com](https://cloudinary.com)
2. Lấy credentials từ Dashboard
3. Cần cho upload ảnh, nhạc, video

#### Cron Job Security
```bash
CRON_SECRET=your-random-secret-string-here
```

**Tạo secret:**
```bash
# Generate random secret
openssl rand -base64 32
```

**Công dụng:**
- Bảo vệ cron endpoints khỏi unauthorized access
- Sử dụng trong `Authorization: Bearer {CRON_SECRET}` header

---

### 🟢 Tùy chọn (Optional)

#### Facebook Messenger API
```bash
FACEBOOK_PAGE_ACCESS_TOKEN=your-page-access-token
FACEBOOK_VERIFY_TOKEN=your-verify-token
```

**Công dụng:**
- Gửi thiệp qua Facebook Messenger
- Xem chi tiết trong `docs/EMAIL_AND_MESSENGER_SETUP.md`

#### Zalo Mini App
```bash
ZALO_APP_ID=your-zalo-app-id
ZALO_APP_SECRET=your-zalo-app-secret
ZALO_REDIRECT_URI=https://yourdomain.com/api/zalo/callback
```

**Công dụng:**
- Tích hợp Zalo Mini App
- Xem chi tiết trong `docs/ZALO_MINI_APP_SETUP.md`

---

## 2. Cron Jobs Configuration

### Tạo file `vercel.json` trong root directory

```json
{
  "crons": [
    {
      "path": "/api/cron/process-scheduled-sends",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/cron/check-subscriptions",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Cron Jobs Details

#### 1. Process Scheduled Sends
- **Path**: `/api/cron/process-scheduled-sends`
- **Schedule**: `* * * * *` (Mỗi phút)
- **Mục đích**: Kiểm tra và gửi các thiệp đã được lên lịch
- **Method**: GET
- **Security**: Sử dụng `CRON_SECRET` hoặc `VERCEL_CRON_SECRET`

#### 2. Check Subscriptions
- **Path**: `/api/cron/check-subscriptions`
- **Schedule**: `0 9 * * *` (9:00 AM mỗi ngày - giờ UTC)
- **Mục đích**: 
  - Tự động downgrade subscriptions hết hạn
  - Gửi email warning cho subscriptions sắp hết hạn (7 ngày trước)
- **Method**: POST (hoặc GET trong development)
- **Security**: Sử dụng `CRON_SECRET` trong Authorization header

### Alternative: External Cron Service

Nếu không dùng Vercel Cron, có thể dùng:
- **Cron-job.org** (free)
- **EasyCron** (free tier)
- **GitHub Actions** (free)
- **Supabase Edge Functions** (nếu dùng Supabase)

**Cấu hình:**
- URL: `https://yourdomain.com/api/cron/check-subscriptions`
- Method: POST
- Headers: `Authorization: Bearer {CRON_SECRET}`
- Schedule: Daily at 9:00 AM UTC

---

## 3. Database Migrations

### Chạy các migrations trong Supabase

Vào **Supabase Dashboard > SQL Editor** và chạy theo thứ tự:

#### Migration 1: Scheduled Send Columns
```sql
-- File: supabase/migrations/add_scheduled_send_columns.sql
-- Chạy migration này trước
```

#### Migration 2: Subscription Columns
```sql
-- File: supabase/migrations/add_subscription_columns.sql
-- Bao gồm:
-- - subscription_tier column
-- - subscription_expires_at column
-- - check_and_downgrade_expired_subscriptions() function
-- - subscription_expiry_emails table
```

#### Migration 3: Legal Requests Table
```sql
-- File: supabase/migrations/create_legal_requests_table.sql
-- Tạo bảng cho legal requests/complaints
```

### Kiểm tra sau khi chạy migrations

1. Vào **Supabase Dashboard > Table Editor**
2. Kiểm tra các bảng mới:
   - `subscription_expiry_emails` ✓
   - `legal_requests` ✓
3. Kiểm tra functions:
   - `check_and_downgrade_expired_subscriptions()` ✓

---

## 4. Domain & DNS

### Custom Domain Setup

1. **Thêm domain trong Vercel:**
   - Vào Project Settings > Domains
   - Add domain: `yourdomain.com` và `www.yourdomain.com`

2. **Cấu hình DNS:**
   - Thêm A record hoặc CNAME record theo hướng dẫn của Vercel
   - Thường là:
     ```
     A record: @ → 76.76.21.21
     CNAME: www → cname.vercel-dns.com
     ```

3. **SSL Certificate:**
   - Vercel tự động cung cấp SSL (Let's Encrypt)
   - Đợi vài phút để certificate được cấp

### Update Environment Variables

Sau khi có domain, cập nhật:
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 5. Third-party Services

### Resend Email Service

1. **Verify Domain:**
   - Vào Resend Dashboard > Domains
   - Add domain và thêm DNS records
   - Hoặc dùng domain mặc định của Resend

2. **Test Email:**
   - Gửi test email từ app
   - Kiểm tra inbox/spam folder

### Cloudinary

1. **Setup Upload Presets:**
   - Vào Cloudinary Dashboard > Settings > Upload
   - Tạo upload presets nếu cần

2. **Test Upload:**
   - Thử upload ảnh từ app
   - Kiểm tra trong Cloudinary Media Library

### Supabase

1. **Production Database:**
   - Đảm bảo đang dùng production database (không phải local)
   - Kiểm tra RLS policies đã được setup đúng

2. **Auth Settings:**
   - Vào Authentication > URL Configuration
   - Thêm production URLs:
     - Site URL: `https://yourdomain.com`
     - Redirect URLs: `https://yourdomain.com/auth/callback`

---

## 6. Security Settings

### Vercel Security

1. **Environment Variables:**
   - ✅ Không commit `.env.local` vào git
   - ✅ Chỉ thêm sensitive variables vào Vercel Dashboard
   - ✅ Sử dụng different values cho Production, Preview, Development

2. **Cron Secret:**
   - ✅ Tạo `CRON_SECRET` mạnh (32+ characters)
   - ✅ Không share secret này
   - ✅ Sử dụng trong cron job requests

3. **API Routes:**
   - ✅ Tất cả admin routes đã có authentication check
   - ✅ Cron jobs có secret verification
   - ✅ RLS policies trong Supabase

### Supabase Security

1. **RLS Policies:**
   - Kiểm tra Row Level Security đã được enable
   - Users chỉ xem được data của mình
   - Admins có quyền xem tất cả

2. **API Keys:**
   - ✅ Chỉ expose `anon` key (không expose `service_role` key)
   - ✅ `anon` key đã được dùng trong `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 7. Pre-deployment Checklist

### ✅ Code & Build

- [ ] Code đã được test kỹ trên local
- [ ] Không có linter errors: `npm run lint`
- [ ] Build thành công: `npm run build`
- [ ] Tất cả TypeScript errors đã được fix

### ✅ Database

- [ ] Đã chạy tất cả migrations trong Supabase
- [ ] Kiểm tra các tables mới đã được tạo
- [ ] Kiểm tra functions đã được tạo
- [ ] Test RLS policies hoạt động đúng

### ✅ Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Production Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Production anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Production service role key ⚠️ **QUAN TRỌNG cho admin**
- [ ] `NEXT_PUBLIC_APP_URL` - Production domain
- [ ] `RESEND_API_KEY` - Resend API key (nếu dùng email)
- [ ] `RESEND_FROM_EMAIL` - Verified email address
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `CRON_SECRET` - Random secret string
- [ ] `FACEBOOK_PAGE_ACCESS_TOKEN` - (Optional) Facebook token
- [ ] `ZALO_APP_ID` - (Optional) Zalo app ID
- [ ] `ZALO_APP_SECRET` - (Optional) Zalo app secret

### ✅ Cron Jobs

- [ ] Đã tạo file `vercel.json` với cron jobs
- [ ] Test cron endpoints hoạt động (có thể test bằng GET trong dev)
- [ ] `CRON_SECRET` đã được set trong Vercel
- [ ] Schedule times đã được set đúng (UTC timezone)

### ✅ Domain & DNS

- [ ] Domain đã được add vào Vercel
- [ ] DNS records đã được cấu hình đúng
- [ ] SSL certificate đã được cấp
- [ ] `NEXT_PUBLIC_APP_URL` đã được update với production domain

### ✅ Third-party Services

- [ ] Resend domain đã được verify
- [ ] Cloudinary account đã được setup
- [ ] Supabase production database đã được setup
- [ ] Supabase Auth redirect URLs đã được cấu hình

### ✅ Testing

- [ ] Test đăng nhập/đăng xuất
- [ ] Test tạo thiệp
- [ ] Test gửi thiệp qua email
- [ ] Test subscription management (admin)
- [ ] Test cron jobs (nếu có thể)
- [ ] Test upload files (ảnh, nhạc)

### ✅ Monitoring

- [ ] Setup error tracking (Sentry, LogRocket, etc.) - Optional
- [ ] Setup analytics (Google Analytics, Vercel Analytics) - Optional
- [ ] Kiểm tra Vercel Logs có hoạt động

---

## 8. Post-deployment Verification

Sau khi deploy, kiểm tra:

### 🔍 Health Checks

1. **Homepage:**
   ```
   https://yourdomain.com
   ```
   - ✅ Trang chủ load được
   - ✅ Không có console errors

2. **Auth:**
   ```
   https://yourdomain.com/auth
   ```
   - ✅ Login page hiển thị
   - ✅ OAuth buttons hoạt động

3. **Dashboard:**
   ```
   https://yourdomain.com/dashboard
   ```
   - ✅ User có thể đăng nhập
   - ✅ Dashboard hiển thị đúng

4. **Admin:**
   ```
   https://yourdomain.com/admin
   ```
   - ✅ Admin có thể truy cập
   - ✅ Users list hiển thị
   - ✅ Subscription management hoạt động

### 🔍 API Endpoints

1. **Cron Jobs:**
   ```bash
   # Test subscription check (development only)
   curl https://yourdomain.com/api/cron/check-subscriptions
   
   # Production:
   curl -X POST https://yourdomain.com/api/cron/check-subscriptions \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

2. **Email Service:**
   - Tạo một thiệp và gửi qua email
   - Kiểm tra email có đến inbox

3. **File Upload:**
   - Upload một ảnh
   - Kiểm tra ảnh có hiển thị trên Cloudinary

### 🔍 Database

1. **Check Tables:**
   - Vào Supabase Dashboard > Table Editor
   - Kiểm tra data có được insert đúng

2. **Check Functions:**
   - Test `check_and_downgrade_expired_subscriptions()` function
   - Kiểm tra logs trong Supabase

---

## 9. Troubleshooting

### ❌ Build Errors

**Lỗi:** `Module not found` hoặc `Type errors`
- ✅ Kiểm tra `package.json` có đầy đủ dependencies
- ✅ Chạy `npm install` lại
- ✅ Kiểm tra TypeScript config

**Lỗi:** `Environment variable missing`
- ✅ Kiểm tra tất cả env vars đã được add vào Vercel
- ✅ Đảm bảo `NEXT_PUBLIC_*` vars được expose đúng

### ❌ Runtime Errors

**Lỗi:** `Supabase connection failed`
- ✅ Kiểm tra `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Kiểm tra Supabase project đang active
- ✅ Kiểm tra network connectivity

**Lỗi:** `Email send failed`
- ✅ Kiểm tra `RESEND_API_KEY` đã được set
- ✅ Kiểm tra `RESEND_FROM_EMAIL` đã được verify
- ✅ Kiểm tra Resend account không bị limit

**Lỗi:** `Cron job unauthorized`
- ✅ Kiểm tra `CRON_SECRET` đã được set trong Vercel
- ✅ Kiểm tra Authorization header trong cron request

### ❌ Database Errors

**Lỗi:** `Function not found`
- ✅ Chạy lại migration `add_subscription_columns.sql`
- ✅ Kiểm tra function đã được tạo trong Supabase

**Lỗi:** `Table not found`
- ✅ Chạy lại migrations
- ✅ Kiểm tra table names đúng (case-sensitive)

---

## 10. Maintenance

### 📅 Regular Tasks

1. **Daily:**
   - Cron job tự động check subscriptions (đã setup)
   - Monitor Vercel logs cho errors

2. **Weekly:**
   - Review error logs
   - Check subscription expiry emails có được gửi

3. **Monthly:**
   - Review usage stats (Resend, Cloudinary, Supabase)
   - Check billing (nếu có)
   - Update dependencies nếu cần

### 📊 Monitoring

1. **Vercel Analytics:**
   - Enable Vercel Analytics trong Project Settings
   - Monitor page views, performance

2. **Error Tracking:**
   - Setup Sentry hoặc LogRocket (optional)
   - Monitor production errors

3. **Database:**
   - Monitor Supabase usage
   - Check query performance

---

## 11. Quick Reference

### Environment Variables Summary

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # ⚠️ QUAN TRỌNG cho admin panel
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Email (Recommended)
RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=Echo <noreply@yourdomain.com>

# File Upload (Recommended)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Security (Recommended)
CRON_SECRET=random-32-char-string

# Optional
FACEBOOK_PAGE_ACCESS_TOKEN=xxx
ZALO_APP_ID=xxx
ZALO_APP_SECRET=xxx
```

### Cron Jobs Summary

```json
{
  "crons": [
    {
      "path": "/api/cron/process-scheduled-sends",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/cron/check-subscriptions",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Migration Files Order

1. `add_scheduled_send_columns.sql`
2. `add_subscription_columns.sql`
3. `create_legal_requests_table.sql`

---

## 📝 Notes

- **Timezone**: Vercel cron jobs chạy theo UTC timezone
- **Cold Starts**: Vercel functions có thể có cold start delay (1-2s)
- **Rate Limits**: Resend free tier: 100 emails/ngày
- **Database**: Supabase free tier có giới hạn, upgrade nếu cần

---

## 🔗 Related Documentation

- `docs/EMAIL_AND_MESSENGER_SETUP.md` - Email & Facebook setup
- `docs/SCHEDULED_SEND_SETUP.md` - Scheduled send setup
- `docs/ZALO_MINI_APP_SETUP.md` - Zalo integration

---

**Last Updated:** 2025-01-XX  
**Version:** 1.0.0

