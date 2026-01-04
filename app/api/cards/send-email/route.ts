// app/api/cards/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverLogger } from '@/lib/server-logger';
import { sendCardEmail, isValidEmail } from '@/lib/email-service';

/**
 * API endpoint để gửi thiệp qua email
 * Sử dụng email service (có thể là SendGrid, Resend, hoặc SMTP)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const url = new URL(request.url);
  
  try {
    serverLogger.logRequest('POST', url.pathname);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      serverLogger.warn('Unauthorized email send attempt', { path: url.pathname });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { cardId, recipientEmail, recipientName, senderName } = body;

    if (!cardId || !recipientEmail) {
      return NextResponse.json(
        { error: 'cardId và recipientEmail là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(recipientEmail)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Kiểm tra quyền sở hữu card và lấy template/envelope data
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select(`
        *,
        template:card_templates!cards_template_id_fkey(thumbnail),
        envelope:envelopes!cards_envelope_id_fkey(thumbnail)
      `)
      .eq('id', cardId)
      .eq('user_id', user.id)
      .single();

    if (cardError || !card) {
      serverLogger.warn('Card not found for email send', { cardId, userId: user.id });
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Tạo card URL
    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/card/${cardId}`;

    // ✅ Gửi email thực tế với Resend
    const emailSubject = `Thiệp yêu thương từ ${senderName || 'Bạn'} 💌`;
    
    // Lấy preview image từ card nếu có
    const templateData = Array.isArray(card.template) ? card.template[0] : card.template;
    const envelopeData = Array.isArray(card.envelope) ? card.envelope[0] : card.envelope;
    const previewImage = templateData?.thumbnail || envelopeData?.thumbnail || null;
    const cardTitle = card.recipient_name ? `Thiệp gửi ${card.recipient_name}` : undefined;
    
    const emailResult = await sendCardEmail({
      to: recipientEmail,
      subject: emailSubject,
      recipientName: recipientName || card.recipient_name || 'Bạn',
      senderName: senderName || card.sender_name || 'Một người bạn',
      cardUrl,
      cardTitle,
      previewImage,
    });

    if (!emailResult.success) {
      serverLogger.error('Failed to send email after retries', new Error(emailResult.error), {
        cardId,
        recipientEmail,
        userId: user.id,
      });
      
      return NextResponse.json(
        { error: `Không thể gửi email: ${emailResult.error}` },
        { status: 500 }
      );
    }

    serverLogger.info('Email sent successfully', {
      cardId,
      recipientEmail,
      messageId: emailResult.messageId,
      userId: user.id,
    });

    // Cập nhật card status nếu cần
    await supabase
      .from('cards')
      .update({ 
        recipient_email: recipientEmail,
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', cardId);

    const duration = Date.now() - startTime;
    serverLogger.logRequest('POST', url.pathname, {
      body: { cardId, recipientEmail },
      duration,
    });

    return NextResponse.json({
      success: true,
      message: 'Email đã được gửi thành công',
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

