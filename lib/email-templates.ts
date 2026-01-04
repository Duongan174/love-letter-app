// lib/email-templates.ts
/**
 * Email templates cho việc gửi thiệp
 * Premium design với vintage theme
 */

export interface EmailTemplateData {
  recipientName: string;
  senderName: string;
  cardUrl: string;
  cardTitle?: string;
  previewImage?: string;
}

/**
 * Template chính cho email gửi thiệp
 * Vintage elegant design với responsive layout
 */
export function getCardEmailTemplate(data: EmailTemplateData): string {
  const { recipientName, senderName, cardUrl, cardTitle, previewImage } = data;
  
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thiệp yêu thương từ ${senderName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; background-color: #F5F0E8;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F5F0E8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FFFCF7; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(114, 47, 55, 0.15);">
          
          <!-- Header với decorative border -->
          <tr>
            <td style="background: linear-gradient(135deg, #722F37 0%, #5A252C 100%); padding: 30px; text-align: center;">
              <div style="border: 2px solid rgba(201, 169, 98, 0.3); padding: 20px; border-radius: 8px;">
                <h1 style="margin: 0; color: #C9A962; font-size: 28px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
                  ✉️ Echo
                </h1>
                <p style="margin: 10px 0 0 0; color: #F5F0E8; font-size: 14px; letter-spacing: 1px;">
                  Vintage E-Card
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Greeting -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="margin: 0 0 10px 0; color: #722F37; font-size: 24px; font-weight: normal;">
                  Xin chào ${recipientName || 'Bạn'}!
                </h2>
                <div style="width: 60px; height: 2px; background: linear-gradient(to right, transparent, #C9A962, transparent); margin: 15px auto;"></div>
              </div>
              
              <!-- Message -->
              <p style="margin: 0 0 20px 0; color: #2C2416; font-size: 16px; line-height: 1.6; text-align: center;">
                <strong style="color: #722F37;">${senderName || 'Một người bạn'}</strong> đã gửi cho bạn một tấm thiệp đặc biệt đầy yêu thương.
              </p>
              
              ${cardTitle ? `
              <p style="margin: 0 0 30px 0; color: #6B5D4A; font-size: 14px; font-style: italic; text-align: center;">
                "${cardTitle}"
              </p>
              ` : ''}
              
              ${previewImage ? `
              <!-- Preview Image -->
              <div style="text-align: center; margin: 30px 0;">
                <img src="${previewImage}" alt="Card Preview" style="max-width: 100%; height: auto; border-radius: 8px; border: 2px solid #E8DFD0; box-shadow: 0 4px 20px rgba(114, 47, 55, 0.1);" />
              </div>
              ` : ''}
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${cardUrl}" 
                   style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #C9A962 0%, #A68B4B 100%); color: #FFFCF7; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; letter-spacing: 1px; box-shadow: 0 4px 20px rgba(201, 169, 98, 0.3); transition: all 0.3s;">
                  🎁 Mở Thiệp Ngay
                </a>
              </div>
              
              <!-- Decorative Divider -->
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-flex; align-items: center; gap: 10px;">
                  <div style="width: 30px; height: 1px; background: linear-gradient(to right, transparent, #C9A962);"></div>
                  <div style="width: 8px; height: 8px; border-radius: 50%; background: #C9A962;"></div>
                  <div style="width: 30px; height: 1px; background: linear-gradient(to left, transparent, #C9A962);"></div>
                </div>
              </div>
              
              <!-- Alternative Link -->
              <p style="margin: 0; color: #6B5D4A; font-size: 13px; text-align: center; line-height: 1.8;">
                Nếu nút không hoạt động, bạn có thể copy link này vào trình duyệt:<br/>
                <a href="${cardUrl}" style="color: #722F37; text-decoration: underline; word-break: break-all;">${cardUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(180deg, #F5F0E8 0%, #E8DFD0 100%); padding: 25px 30px; text-align: center; border-top: 1px solid #E8DFD0;">
              <p style="margin: 0 0 10px 0; color: #6B5D4A; font-size: 12px;">
                Được gửi từ <strong style="color: #722F37;">Echo Vintage E-Card</strong>
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
                Nền tảng gửi thiệp điện tử cao cấp
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Footer Note -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin-top: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0; color: #9CA3AF; font-size: 11px; line-height: 1.6;">
                Email này được gửi tự động từ hệ thống Echo.<br/>
                Nếu bạn không mong đợi email này, vui lòng bỏ qua.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Template đơn giản hơn (fallback nếu HTML không được hỗ trợ)
 */
export function getCardEmailTextTemplate(data: EmailTemplateData): string {
  const { recipientName, senderName, cardUrl } = data;
  
  return `
Xin chào ${recipientName || 'Bạn'}!

${senderName || 'Một người bạn'} đã gửi cho bạn một tấm thiệp đặc biệt đầy yêu thương.

Mở thiệp tại: ${cardUrl}

---
Được gửi từ Echo Vintage E-Card
Nền tảng gửi thiệp điện tử cao cấp
  `.trim();
}

/**
 * Template email cho subscription expiry warning
 */
export interface SubscriptionExpiryEmailData {
  userName: string;
  subscriptionTier: 'plus' | 'pro' | 'ultra';
  expiryDate: string;
  renewalUrl: string;
}

export function getSubscriptionExpiryEmailTemplate(data: SubscriptionExpiryEmailData): string {
  const { userName, subscriptionTier, expiryDate, renewalUrl } = data;
  
  const tierLabels: Record<string, string> = {
    plus: 'Plus',
    pro: 'Pro',
    ultra: 'Ultra',
  };
  
  const tierColors: Record<string, { bg: string; text: string; accent: string }> = {
    plus: { bg: '#10B981', text: '#065F46', accent: '#34D399' },
    pro: { bg: '#3B82F6', text: '#1E40AF', accent: '#60A5FA' },
    ultra: { bg: '#8B5CF6', text: '#5B21B6', accent: '#A78BFA' },
  };
  
  const colors = tierColors[subscriptionTier] || tierColors.plus;
  
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gói ${tierLabels[subscriptionTier]} của bạn sắp hết hạn</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; background-color: #F5F0E8;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F5F0E8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FFFCF7; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(114, 47, 55, 0.15);">
          
          <!-- Header với màu theo tier -->
          <tr>
            <td style="background: linear-gradient(135deg, ${colors.bg} 0%, ${colors.text} 100%); padding: 30px; text-align: center;">
              <div style="border: 2px solid rgba(201, 169, 98, 0.3); padding: 20px; border-radius: 8px;">
                <h1 style="margin: 0; color: #C9A962; font-size: 28px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
                  ⏰ Thông báo quan trọng
                </h1>
                <p style="margin: 10px 0 0 0; color: #F5F0E8; font-size: 14px; letter-spacing: 1px;">
                  Gói ${tierLabels[subscriptionTier]} sắp hết hạn
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Greeting -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="margin: 0 0 10px 0; color: #722F37; font-size: 24px; font-weight: normal;">
                  Xin chào ${userName || 'Bạn'}!
                </h2>
                <div style="width: 60px; height: 2px; background: linear-gradient(to right, transparent, #C9A962, transparent); margin: 15px auto;"></div>
              </div>
              
              <!-- Warning Message -->
              <div style="background: linear-gradient(135deg, ${colors.accent}15 0%, ${colors.bg}15 100%); border-left: 4px solid ${colors.bg}; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0 0 15px 0; color: #2C2416; font-size: 16px; line-height: 1.6;">
                  Gói <strong style="color: ${colors.text};">${tierLabels[subscriptionTier]}</strong> của bạn sẽ hết hạn vào ngày:
                </p>
                <p style="margin: 0; color: ${colors.text}; font-size: 24px; font-weight: bold; text-align: center;">
                  📅 ${new Date(expiryDate).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p style="margin: 15px 0 0 0; color: #6B5D4A; font-size: 14px; text-align: center;">
                  (Còn lại 7 ngày)
                </p>
              </div>
              
              <!-- Info Box -->
              <div style="background-color: #F5F0E8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0 0 15px 0; color: #2C2416; font-size: 15px; line-height: 1.6;">
                  <strong>Điều gì sẽ xảy ra khi hết hạn?</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #6B5D4A; font-size: 14px; line-height: 1.8;">
                  <li>Gói của bạn sẽ tự động chuyển về <strong>Free</strong></li>
                  <li>Bạn sẽ mất quyền truy cập các tính năng ${tierLabels[subscriptionTier]}</li>
                  <li>Dữ liệu và thiệp của bạn vẫn được giữ nguyên</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${renewalUrl}" 
                   style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, ${colors.bg} 0%, ${colors.text} 100%); color: #FFFCF7; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; letter-spacing: 1px; box-shadow: 0 4px 20px ${colors.bg}40; transition: all 0.3s;">
                  🔄 Gia hạn ngay
                </a>
              </div>
              
              <!-- Alternative Link -->
              <p style="margin: 20px 0 0 0; color: #6B5D4A; font-size: 13px; text-align: center; line-height: 1.8;">
                Hoặc truy cập: <a href="${renewalUrl}" style="color: ${colors.text}; text-decoration: underline; word-break: break-all;">${renewalUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(180deg, #F5F0E8 0%, #E8DFD0 100%); padding: 25px 30px; text-align: center; border-top: 1px solid #E8DFD0;">
              <p style="margin: 0 0 10px 0; color: #6B5D4A; font-size: 12px;">
                Được gửi từ <strong style="color: #722F37;">Echo Vintage E-Card</strong>
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
                Nếu bạn đã gia hạn, vui lòng bỏ qua email này.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Text version của subscription expiry email
 */
export function getSubscriptionExpiryEmailTextTemplate(data: SubscriptionExpiryEmailData): string {
  const { userName, subscriptionTier, expiryDate, renewalUrl } = data;
  
  const tierLabels: Record<string, string> = {
    plus: 'Plus',
    pro: 'Pro',
    ultra: 'Ultra',
  };
  
  return `
Xin chào ${userName || 'Bạn'}!

Gói ${tierLabels[subscriptionTier]} của bạn sẽ hết hạn vào ngày ${new Date(expiryDate).toLocaleDateString('vi-VN')} (còn lại 7 ngày).

Điều gì sẽ xảy ra khi hết hạn?
- Gói của bạn sẽ tự động chuyển về Free
- Bạn sẽ mất quyền truy cập các tính năng ${tierLabels[subscriptionTier]}
- Dữ liệu và thiệp của bạn vẫn được giữ nguyên

Gia hạn ngay tại: ${renewalUrl}

---
Được gửi từ Echo Vintage E-Card
Nếu bạn đã gia hạn, vui lòng bỏ qua email này.
  `.trim();
}

