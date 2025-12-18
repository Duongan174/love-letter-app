// app/providers.tsx
'use client';

// Vì useAuth đã chuyển thành hook độc lập để sửa lỗi Admin, 
// nên ta không cần bọc AuthProvider nữa.
// File này giữ lại để code không bị lỗi và dùng cho các tiện ích sau này.

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}