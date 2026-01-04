// app/api/cards/schedule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';

/**
 * API endpoint để lên lịch gửi thiệp
 * Lưu scheduled send vào database để background job xử lý
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const url = new URL(request.url);
  
  try {
    serverLogger.logRequest('POST', url.pathname);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      serverLogger.warn('Unauthorized schedule attempt', { path: url.pathname });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      cardId, 
      scheduledSendDate, 
      sendMethod,
      recipientEmail,
      recipientFacebookId,
    } = body;

    if (!cardId || !scheduledSendDate) {
      return NextResponse.json(
        { error: 'cardId và scheduledSendDate là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate scheduled date phải trong tương lai
    const scheduledDate = new Date(scheduledSendDate);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Ngày gửi phải trong tương lai' },
        { status: 400 }
      );
    }

    // Kiểm tra quyền sở hữu card
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .eq('user_id', user.id)
      .single();

    if (cardError || !card) {
      serverLogger.warn('Card not found for scheduling', { cardId, userId: user.id });
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // ✅ Lưu scheduled send vào database
    // Note: Cần tạo table `scheduled_sends` trong database
    // Hoặc lưu vào card record với status 'scheduled'
    
    const { data: scheduledSend, error: scheduleError } = await supabase
      .from('scheduled_sends')
      .insert({
        card_id: cardId,
        user_id: user.id,
        scheduled_at: scheduledSendDate,
        send_method: sendMethod || 'link',
        recipient_email: recipientEmail || null,
        recipient_facebook_id: recipientFacebookId || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (scheduleError) {
      // Nếu table chưa tồn tại, fallback: lưu vào card metadata
      serverLogger.warn('scheduled_sends table may not exist, using card metadata', {
        error: scheduleError.message,
      });
      
      // Lưu vào card record
      await supabase
        .from('cards')
        .update({
          status: 'scheduled',
          scheduled_send_at: scheduledSendDate,
          scheduled_send_method: sendMethod || 'link',
          recipient_email: recipientEmail || card.recipient_email,
        })
        .eq('id', cardId);
    }

    const duration = Date.now() - startTime;
    serverLogger.logRequest('POST', url.pathname, {
      body: { cardId, scheduledSendDate, sendMethod },
      duration,
    });

    return NextResponse.json({
      success: true,
      message: 'Thiệp đã được lên lịch gửi thành công',
      scheduledSend: scheduledSend || {
        card_id: cardId,
        scheduled_at: scheduledSendDate,
      },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    serverLogger.logApiError('POST', url.pathname, error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

