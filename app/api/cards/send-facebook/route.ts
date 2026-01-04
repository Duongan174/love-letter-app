// app/api/cards/send-facebook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';
import { sendFacebookMessage, isValidFacebookId } from '@/lib/facebook-service';

/**
 * API endpoint để gửi thiệp qua Facebook Messenger
 * Sử dụng Facebook Graph API hoặc Messenger API
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const url = new URL(request.url);
  
  try {
    serverLogger.logRequest('POST', url.pathname);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      serverLogger.warn('Unauthorized Facebook send attempt', { path: url.pathname });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { cardId, recipientFacebookId, recipientName, senderName } = body;

    if (!cardId || !recipientFacebookId) {
      return NextResponse.json(
        { error: 'cardId và recipientFacebookId là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate Facebook ID format
    if (!isValidFacebookId(recipientFacebookId)) {
      return NextResponse.json(
        { error: 'Facebook ID không hợp lệ' },
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
      serverLogger.warn('Card not found for Facebook send', { cardId, userId: user.id });
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Tạo card URL
    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/card/${cardId}`;

    // ✅ Gửi message qua Facebook Messenger API
    const previewImage = card.template?.thumbnail || card.envelope?.thumbnail || null;
    const cardTitle = card.recipient_name ? `Thiệp gửi ${card.recipient_name}` : undefined;
    
    const facebookResult = await sendFacebookMessage({
      recipientId: recipientFacebookId,
      cardUrl,
      senderName: senderName || card.sender_name || 'Một người bạn',
      recipientName: recipientName || card.recipient_name || 'Bạn',
      cardTitle,
      previewImage,
    });

    if (!facebookResult.success) {
      serverLogger.error('Failed to send Facebook message after retries', new Error(facebookResult.error), {
        cardId,
        recipientFacebookId,
        userId: user.id,
      });
      
      return NextResponse.json(
        { error: `Không thể gửi message: ${facebookResult.error}` },
        { status: 500 }
      );
    }

    serverLogger.info('Facebook message sent successfully', {
      cardId,
      recipientFacebookId,
      messageId: facebookResult.messageId,
      userId: user.id,
    });

    // Cập nhật card status
    await supabase
      .from('cards')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', cardId);

    const duration = Date.now() - startTime;
    serverLogger.logRequest('POST', url.pathname, {
      body: { cardId, recipientFacebookId },
      duration,
    });

    return NextResponse.json({
      success: true,
      message: 'Thiệp đã được gửi qua Facebook thành công',
      cardUrl,
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

