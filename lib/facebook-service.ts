// lib/facebook-service.ts
/**
 * Facebook Messenger API service
 * Hỗ trợ gửi thiệp qua Facebook Messenger
 */

import { serverLogger } from './server-logger';

export interface SendFacebookMessageOptions {
  recipientId: string;
  cardUrl: string;
  senderName: string;
  recipientName: string;
  cardTitle?: string;
  previewImage?: string;
}

export interface SendFacebookMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Gửi message qua Facebook Messenger với retry logic
 */
export async function sendFacebookMessage(
  options: SendFacebookMessageOptions,
  retries: number = 3
): Promise<SendFacebookMessageResult> {
  const { recipientId, cardUrl, senderName, recipientName, cardTitle, previewImage } = options;
  
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const apiVersion = process.env.FACEBOOK_API_VERSION || 'v18.0';
  
  if (!pageAccessToken) {
    serverLogger.warn('Facebook Page Access Token not configured, message send mocked', {
      recipientId,
      cardUrl,
    });
    
    // Mock mode for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 [MOCK FACEBOOK MESSAGE]');
      console.log('To:', recipientId);
      console.log('Card URL:', cardUrl);
    }
    
    return {
      success: true,
      messageId: 'mock-' + Date.now(),
    };
  }
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      serverLogger.info(`Sending Facebook message (attempt ${attempt}/${retries})`, {
        recipientId,
        cardUrl,
      });
      
      // Tạo message template với generic template
      const messagePayload: any = {
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: `💌 Thiệp từ ${senderName}`,
                  subtitle: cardTitle || `Một tấm thiệp đặc biệt dành cho ${recipientName}`,
                  image_url: previewImage || undefined,
                  buttons: [
                    {
                      type: 'web_url',
                      url: cardUrl,
                      title: '🎁 Mở Thiệp Ngay',
                      webview_height_ratio: 'tall',
                    },
                  ],
                },
              ],
            },
          },
        },
      };
      
      const response = await fetch(`https://graph.facebook.com/${apiVersion}/me/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pageAccessToken}`,
        },
        body: JSON.stringify(messagePayload),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${data.error?.message || JSON.stringify(data)}`);
      }
      
      serverLogger.info('Facebook message sent successfully', {
        recipientId,
        messageId: data.message_id,
      });
      
      return {
        success: true,
        messageId: data.message_id,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      serverLogger.error(`Facebook message send attempt ${attempt} failed`, lastError, {
        recipientId,
        attempt,
        retries,
      });
      
      // Exponential backoff
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return {
    success: false,
    error: lastError?.message || 'Unknown error',
  };
}

/**
 * Validate Facebook recipient ID format
 */
export function isValidFacebookId(id: string): boolean {
  // Facebook IDs are typically numeric strings
  return /^\d+$/.test(id);
}

