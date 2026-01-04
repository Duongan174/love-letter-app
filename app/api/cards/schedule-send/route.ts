// app/api/cards/schedule-send/route.ts
/**
 * API endpoint để lên lịch gửi thiệp
 * Hỗ trợ email, Facebook Messenger, hoặc cả hai
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';
import { isValidEmail } from '@/lib/email-service';
import { isValidFacebookId } from '@/lib/facebook-service';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const url = new URL(request.url);
  
  try {
    serverLogger.logRequest('POST', url.pathname);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      serverLogger.warn('Unauthorized schedule send attempt', { path: url.pathname });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      cardId,
      scheduledAt, // ISO string
      sendMethod, // 'email' | 'facebook' | 'both' | 'link'
      recipientEmail,
      recipientFacebookId,
      recipientName,
    } = body;

    if (!cardId || !scheduledAt || !sendMethod) {
      return NextResponse.json(
        { error: 'cardId, scheduledAt và sendMethod là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate scheduledAt phải trong tương lai
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: 'scheduledAt không hợp lệ' },
        { status: 400 }
      );
    }

    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'scheduledAt phải trong tương lai' },
        { status: 400 }
      );
    }

    // Validate send method và recipient
    if (sendMethod === 'email' && !recipientEmail) {
      return NextResponse.json(
        { error: 'recipientEmail là bắt buộc khi sendMethod là email' },
        { status: 400 }
      );
    }

    if (sendMethod === 'email' && !isValidEmail(recipientEmail)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    if (sendMethod === 'facebook' && !recipientFacebookId) {
      return NextResponse.json(
        { error: 'recipientFacebookId là bắt buộc khi sendMethod là facebook' },
        { status: 400 }
      );
    }

    if (sendMethod === 'facebook' && !isValidFacebookId(recipientFacebookId)) {
      return NextResponse.json(
        { error: 'Facebook ID không hợp lệ' },
        { status: 400 }
      );
    }

    if (sendMethod === 'both' && (!recipientEmail || !recipientFacebookId)) {
      return NextResponse.json(
        { error: 'recipientEmail và recipientFacebookId đều bắt buộc khi sendMethod là both' },
        { status: 400 }
      );
    }

    // Kiểm tra quyền sở hữu card
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('id, user_id, status')
      .eq('id', cardId)
      .eq('user_id', user.id)
      .single();

    if (cardError || !card) {
      serverLogger.warn('Card not found for schedule send', { cardId, userId: user.id });
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // ✅ Tạo scheduled send record
    const { data: scheduledSend, error: insertError } = await supabase
      .from('scheduled_sends')
      .insert({
        card_id: cardId,
        user_id: user.id,
        scheduled_at: scheduledAt,
        send_method: sendMethod,
        recipient_email: recipientEmail || null,
        recipient_facebook_id: recipientFacebookId || null,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      serverLogger.error('Failed to create scheduled send', insertError, {
        cardId,
        userId: user.id,
      });
      return NextResponse.json(
        { error: `Không thể tạo lịch gửi: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Cập nhật card với scheduled_send_at (backward compatibility)
    await supabase
      .from('cards')
      .update({
        scheduled_send_at: scheduledAt,
        scheduled_send_method: sendMethod,
      })
      .eq('id', cardId);

    const duration = Date.now() - startTime;
    serverLogger.info('Scheduled send created successfully', {
      scheduledSendId: scheduledSend.id,
      cardId,
      scheduledAt,
      sendMethod,
      duration,
    });

    return NextResponse.json({
      success: true,
      message: 'Thiệp đã được lên lịch gửi thành công',
      scheduledSend: {
        id: scheduledSend.id,
        scheduledAt: scheduledSend.scheduled_at,
        sendMethod: scheduledSend.send_method,
        status: scheduledSend.status,
      },
    });

  } catch (error) {
    serverLogger.logApiError('POST', url.pathname, error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

