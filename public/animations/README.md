# 🎨 Animated Icons Folder

Thư mục này chứa các file animation từ Flaticon (Lottie JSON format).

## 📁 Folder Structure

```
public/animations/
├── icons/          # Icons thông thường (heart, envelope, sparkle, etc.)
├── loading/        # Loading animations
└── success/        # Success/confirmation animations
```

## 📥 Cách Download Icons từ Flaticon

1. **Truy cập Flaticon**: https://www.flaticon.com/animated-icons
2. **Tìm kiếm icon** bạn muốn (ví dụ: "heart", "mail", "sparkle")
3. **Click vào icon** để xem chi tiết
4. **Download format**: Chọn **JSON (Lottie)** format
5. **Lưu file** vào folder tương ứng:
   - Icons thông thường → `icons/`
   - Loading animations → `loading/`
   - Success animations → `success/`

## 📋 Recommended Icons để Download

### Core Icons (Priority 1)
- ✅ `heart.json` - Heart animation (like/favorite)
- ✅ `envelope.json` hoặc `mail.json` - Mail/envelope animation
- ✅ `sparkle.json` hoặc `star.json` - Sparkle animation

### Loading Icons (Priority 2)
- ✅ `loader-heart.json` - Heart pulse loading
- ✅ `loader-sparkle.json` - Sparkle loading

### Success Icons (Priority 3)
- ✅ `success-checkmark.json` - Success checkmark
- ✅ `success-heart.json` - Success with heart

## 💡 Example Usage

Sau khi download icon, sử dụng như sau:

```tsx
import AnimatedIcon from '@/components/ui/AnimatedIcon';
import heartAnimation from '@/public/animations/icons/heart.json';

// Basic usage
<AnimatedIcon 
  animationData={heartAnimation}
  width={64}
  height={64}
  loop={true}
/>

// Trong button
<button>
  <AnimatedIcon 
    animationData={heartAnimation}
    width={32}
    height={32}
    loop={false}
  />
  Like
</button>
```

## ⚠️ Lưu ý

- File JSON từ Flaticon có thể lớn, nên optimize nếu cần
- Free account Flaticon có giới hạn downloads
- Premium account cho unlimited downloads
- Format JSON (Lottie) là recommended (nhẹ nhất)

## 🔗 Resources

- Flaticon: https://www.flaticon.com/animated-icons
- Lottie Docs: https://airbnb.io/lottie/
- Component: `components/ui/AnimatedIcon.tsx`

