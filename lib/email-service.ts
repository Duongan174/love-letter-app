// lib/email-service.ts
/**
 * Email service wrapper
 * Hỗ trợ Resend và fallback methods
 */

import { Resend } from 'resend';
import { 
  getCardEmailTemplate, 
  getCardEmailTextTemplate, 
  type EmailTemplateData,
  getSubscriptionExpiryEmailTemplate,
  getSubscriptionExpiryEmailTextTemplate,
  type SubscriptionExpiryEmailData
} from './email-templates';
import { serverLogger } from './server-logger';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface SendEmailOptions {
  to: string;
  subject: string;
  recipientName: string;
  senderName: string;
  cardUrl: string;
  cardTitle?: string;
  previewImage?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Gửi email thiệp với retry logic
 */
export async function sendCardEmail(
  options: SendEmailOptions,
  retries: number = 3
): Promise<SendEmailResult> {
  const { to, subject, recipientName, senderName, cardUrl, cardTitle, previewImage } = options;
  
  // ✅ Sử dụng Resend nếu có API key
  if (resend) {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        serverLogger.info(`Sending email via Resend (attempt ${attempt}/${retries})`, {
          to,
          cardUrl,
        });
        
        const templateData: EmailTemplateData = {
          recipientName,
          senderName,
          cardUrl,
          cardTitle,
          previewImage,
        };
        
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Echo <noreply@echo.vintage>',
          to: [to],
          subject,
          html: getCardEmailTemplate(templateData),
          text: getCardEmailTextTemplate(templateData),
        });
        
        if (error) {
          throw new Error(`Resend API error: ${error.message}`);
        }
        
        serverLogger.info('Email sent successfully via Resend', {
          to,
          messageId: data?.id,
        });
        
        return {
          success: true,
          messageId: data?.id,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        serverLogger.error(`Email send attempt ${attempt} failed`, lastError, {
          to,
          attempt,
          retries,
        });
        
        // Nếu không phải lần thử cuối, đợi một chút trước khi retry
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Tất cả retries đều failed
    return {
      success: false,
      error: lastError?.message || 'Unknown error',
    };
  }
  
  // ✅ Fallback: Log và return success (mock mode)
  serverLogger.warn('Resend API key not configured, email send mocked', {
    to,
    cardUrl,
  });
  
  // Trong development, có thể log email để test
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [MOCK EMAIL]');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Card URL:', cardUrl);
  }
  
  return {
    success: true,
    messageId: 'mock-' + Date.now(),
  };
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gửi email thông báo subscription sắp hết hạn
 */
export async function sendSubscriptionExpiryEmail(
  options: {
    to: string;
    userName: string;
    subscriptionTier: 'plus' | 'pro' | 'ultra';
    expiryDate: string;
    renewalUrl: string;
  },
  retries: number = 3
): Promise<SendEmailResult> {
  const { to, userName, subscriptionTier, expiryDate, renewalUrl } = options;
  
  if (!isValidEmail(to)) {
    return {
      success: false,
      error: 'Invalid email address',
    };
  }
  
  // ✅ Sử dụng Resend nếu có API key
  if (resend) {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        serverLogger.info(`Sending subscription expiry email via Resend (attempt ${attempt}/${retries})`, {
          to,
          subscriptionTier,
          expiryDate,
        });
        
        const templateData: SubscriptionExpiryEmailData = {
          userName,
          subscriptionTier,
          expiryDate,
          renewalUrl,
        };
        
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Echo <noreply@echo.vintage>',
          to: [to],
          subject: `⏰ Gói ${subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} của bạn sắp hết hạn - Còn 7 ngày`,
          html: getSubscriptionExpiryEmailTemplate(templateData),
          text: getSubscriptionExpiryEmailTextTemplate(templateData),
        });
        
        if (error) {
          throw new Error(`Resend API error: ${error.message}`);
        }
        
        serverLogger.info('Subscription expiry email sent successfully via Resend', {
          to,
          messageId: data?.id,
          subscriptionTier,
        });
        
        return {
          success: true,
          messageId: data?.id,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        serverLogger.error(`Subscription expiry email send attempt ${attempt} failed`, lastError, {
          to,
          attempt,
          retries,
        });
        
        // Nếu không phải lần thử cuối, đợi một chút trước khi retry
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Tất cả retries đều failed
    return {
      success: false,
      error: lastError?.message || 'Unknown error',
    };
  }
  
  // ✅ Fallback: Log và return success (mock mode)
  serverLogger.warn('Resend API key not configured, subscription expiry email send mocked', {
    to,
    subscriptionTier,
    expiryDate,
  });
  
  // Trong development, có thể log email để test
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [MOCK SUBSCRIPTION EXPIRY EMAIL]');
    console.log('To:', to);
    console.log('Subject: Gói subscription sắp hết hạn');
    console.log('Tier:', subscriptionTier);
    console.log('Expiry Date:', expiryDate);
    console.log('Renewal URL:', renewalUrl);
  }
  
  return {
    success: true,
    messageId: 'mock-' + Date.now(),
  };
}

