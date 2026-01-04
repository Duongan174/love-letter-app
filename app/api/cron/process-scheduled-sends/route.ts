// app/api/cron/process-scheduled-sends/route.ts
/**
 * Vercel Cron Job: Xử lý scheduled card sends
 * Chạy mỗi phút để kiểm tra và gửi các thiệp đã được lên lịch
 * 
 * Setup trong vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-scheduled-sends",
 *     "schedule": "* * * * *" // Mỗi phút
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';
import { sendCardEmail } from '@/lib/email-service';
import { sendFacebookMessage } from '@/lib/facebook-service';

// ✅ Verify cron secret để tránh unauthorized access
const CRON_SECRET = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET;

/**
 * Process scheduled sends với retry logic
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // ✅ Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      serverLogger.warn('Unauthorized cron access attempt', {
        path: '/api/cron/process-scheduled-sends',
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    serverLogger.info('Processing scheduled sends', {
      timestamp: new Date().toISOString(),
    });
    
    const supabase = await createClient();
    
    // ✅ Lấy tất cả scheduled sends đang pending và đã đến giờ
    const now = new Date().toISOString();
    const { data: scheduledSends, error: fetchError } = await supabase
      .from('scheduled_sends')
      .select(`
        *,
        cards!inner (
          id,
          user_id,
          recipient_name,
          recipient_email,
          sender_name,
          template:card_templates!cards_template_id_fkey (
            thumbnail
          ),
          envelope:envelopes!cards_envelope_id_fkey (
            thumbnail
          )
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(50); // Process tối đa 50 sends mỗi lần
    
    if (fetchError) {
      throw new Error(`Failed to fetch scheduled sends: ${fetchError.message}`);
    }
    
    if (!scheduledSends || scheduledSends.length === 0) {
      serverLogger.info('No scheduled sends to process', {
        timestamp: now,
      });
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No scheduled sends to process',
      });
    }
    
    serverLogger.info(`Found ${scheduledSends.length} scheduled sends to process`, {
      count: scheduledSends.length,
    });
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    // ✅ Process từng scheduled send
    for (const scheduledSend of scheduledSends) {
      try {
        const card = Array.isArray(scheduledSend.cards) ? scheduledSend.cards[0] : scheduledSend.cards;
        if (!card) {
          throw new Error('Card not found');
        }
        
        const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/card/${card.id}`;
        const templateData = Array.isArray(card.template) ? card.template[0] : card.template;
        const envelopeData = Array.isArray(card.envelope) ? card.envelope[0] : card.envelope;
        const previewImage = templateData?.thumbnail || envelopeData?.thumbnail || null;
        const cardTitle = card.recipient_name ? `Thiệp gửi ${card.recipient_name}` : undefined;
        
        let sendResult: { success: boolean; messageId?: string; error?: string } | null = null;
        
        // ✅ Gửi theo method
        if (scheduledSend.send_method === 'email' && scheduledSend.recipient_email) {
          sendResult = await sendCardEmail({
            to: scheduledSend.recipient_email,
            subject: `Thiệp yêu thương từ ${card.sender_name || 'Bạn'} 💌`,
            recipientName: scheduledSend.recipient_name || card.recipient_name || 'Bạn',
            senderName: card.sender_name || 'Một người bạn',
            cardUrl,
            cardTitle,
            previewImage,
          }, 3); // 3 retries
        } else if (scheduledSend.send_method === 'facebook' && scheduledSend.recipient_facebook_id) {
          sendResult = await sendFacebookMessage({
            recipientId: scheduledSend.recipient_facebook_id,
            cardUrl,
            senderName: card.sender_name || 'Một người bạn',
            recipientName: scheduledSend.recipient_name || card.recipient_name || 'Bạn',
            cardTitle,
            previewImage,
          }, 3); // 3 retries
        } else if (scheduledSend.send_method === 'both') {
          // Gửi cả email và Facebook
          const emailResult = scheduledSend.recipient_email
            ? await sendCardEmail({
                to: scheduledSend.recipient_email,
                subject: `Thiệp yêu thương từ ${card.sender_name || 'Bạn'} 💌`,
                recipientName: scheduledSend.recipient_name || card.recipient_name || 'Bạn',
                senderName: card.sender_name || 'Một người bạn',
                cardUrl,
                cardTitle,
                previewImage,
              }, 3)
            : { success: true };
          
          const facebookResult = scheduledSend.recipient_facebook_id
            ? await sendFacebookMessage({
                recipientId: scheduledSend.recipient_facebook_id,
                cardUrl,
                senderName: card.sender_name || 'Một người bạn',
                recipientName: scheduledSend.recipient_name || card.recipient_name || 'Bạn',
                cardTitle,
                previewImage,
              }, 3)
            : { success: true };
          
          sendResult = {
            success: emailResult.success && facebookResult.success,
            messageId: `${emailResult.messageId || 'none'}-${facebookResult.messageId || 'none'}`,
            error: !emailResult.success ? emailResult.error : !facebookResult.success ? facebookResult.error : undefined,
          };
        } else {
          // 'link' method - chỉ cập nhật status
          sendResult = { success: true, messageId: 'link-share' };
        }
        
        // ✅ Cập nhật status
        if (sendResult.success) {
          await supabase
            .from('scheduled_sends')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
            })
            .eq('id', scheduledSend.id);
          
          // Cập nhật card status
          await supabase
            .from('cards')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
            })
            .eq('id', card.id);
          
          results.success++;
          serverLogger.info('Scheduled send processed successfully', {
            scheduledSendId: scheduledSend.id,
            cardId: card.id,
            method: scheduledSend.send_method,
          });
        } else {
          // ✅ Mark as failed sau khi retry hết
          await supabase
            .from('scheduled_sends')
            .update({
              status: 'failed',
              error_message: sendResult.error || 'Unknown error',
            })
            .eq('id', scheduledSend.id);
          
          results.failed++;
          results.errors.push(`Card ${card.id}: ${sendResult.error}`);
          serverLogger.error('Scheduled send failed', new Error(sendResult.error || 'Unknown error'), {
            scheduledSendId: scheduledSend.id,
            cardId: card.id,
            method: scheduledSend.send_method,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.failed++;
        results.errors.push(`Scheduled send ${scheduledSend.id}: ${errorMessage}`);
        
        // Mark as failed
        await supabase
          .from('scheduled_sends')
          .update({
            status: 'failed',
            error_message: errorMessage,
          })
          .eq('id', scheduledSend.id);
        
        serverLogger.error('Error processing scheduled send', error instanceof Error ? error : new Error(errorMessage), {
          scheduledSendId: scheduledSend.id,
        });
      }
    }
    
    const duration = Date.now() - startTime;
    serverLogger.info('Scheduled sends processing completed', {
      processed: scheduledSends.length,
      success: results.success,
      failed: results.failed,
      duration,
    });
    
    return NextResponse.json({
      success: true,
      processed: scheduledSends.length,
      successCount: results.success,
      failedCount: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
      duration,
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    serverLogger.logApiError('GET', '/api/cron/process-scheduled-sends', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
