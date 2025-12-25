# Zalo Mini App Integration Guide

## Tổng quan
Zalo Mini App cho phép người dùng tạo và gửi thiệp trực tiếp trong Zalo mà không cần thoát ứng dụng.

## Setup

### 1. Đăng ký Zalo Developer
1. Truy cập: https://developers.zalo.me/
2. Tạo ứng dụng mới
3. Chọn loại: **Mini App**
4. Lấy App ID và App Secret

### 2. Cấu hình Environment Variables
Thêm vào `.env.local`:
```
ZALO_APP_ID=your_app_id
ZALO_APP_SECRET=your_app_secret
ZALO_REDIRECT_URI=https://yourdomain.com/api/zalo/callback
```

### 3. Tạo Zalo Mini App Page
File: `app/zalo-mini-app/page.tsx` (đã tạo)

### 4. API Routes
- `/api/zalo/auth` - Xác thực Zalo
- `/api/zalo/send-card` - Gửi thiệp trong Zalo

## Tính năng
- Tạo thiệp trong Zalo
- Gửi thiệp qua Zalo chat
- Share thiệp lên Zalo Story
- Tích hợp Zalo Pay cho lì xì

## Lưu ý
- Cần phê duyệt từ Zalo trước khi publish
- Mini App chỉ hoạt động trong Zalo app (iOS/Android)
- Web version vẫn hoạt động bình thường

