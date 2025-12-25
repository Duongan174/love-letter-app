import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { cardId, zaloUserId, recipientZaloId } = await request.json();

    if (!cardId || !zaloUserId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get card info
    const { data: card } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single();

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/card/${cardId}`;

    // In production, use Zalo Open API to send message
    // For now, return share link
    return NextResponse.json({
      success: true,
      shareUrl: cardUrl,
      message: 'Card ready to share in Zalo',
      // Zalo share parameters
      zaloShare: {
        type: 'link',
        link: cardUrl,
        title: `Thiệp từ ${card.sender_name}`,
        desc: card.content?.substring(0, 100) || 'Một tấm thiệp đặc biệt',
        thumb: card.envelope?.thumbnail || '',
      },
    });
  } catch (error: any) {
    console.error('Error sending card via Zalo:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

