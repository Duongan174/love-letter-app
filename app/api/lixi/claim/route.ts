import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock payment gateway URLs - Replace with actual integration
const PAYMENT_GATEWAYS = {
  momo: 'https://payment.momo.vn/gateway',
  zalopay: 'https://zalopay.vn/payment',
  shopeepay: 'https://shopeepay.vn/payment',
};

// Mock voucher providers - Replace with actual API
const VOUCHER_PROVIDERS = {
  urbox: 'https://api.urbox.vn/vouchers',
  gotit: 'https://api.gotit.vn/vouchers',
};

export async function POST(request: NextRequest) {
  try {
    const { cardId, giftType, recipientName } = await request.json();

    if (!cardId || !giftType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if gift already claimed
    const { data: existing } = await supabase
      .from('card_gifts')
      .select('*')
      .eq('card_id', cardId)
      .eq('claimed', true)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Gift already claimed' },
        { status: 400 }
      );
    }

    // Get card info
    const { data: card } = await supabase
      .from('cards')
      .select('*, user_id')
      .eq('id', cardId)
      .single();

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    let result: any = { success: true };

    if (giftType === 'money') {
      // Generate payment URL (MoMo/ZaloPay)
      // In production, integrate with actual payment gateway SDK
      const paymentUrl = `${PAYMENT_GATEWAYS.momo}?amount=50000&cardId=${cardId}`;
      
      result.paymentUrl = paymentUrl;
      
      // Save gift record
      await supabase.from('card_gifts').insert({
        card_id: cardId,
        gift_type: 'money',
        amount: 50000, // Default amount, can be configurable
        status: 'pending',
      });
    } else if (giftType === 'coffee') {
      // Generate voucher from provider
      // Mock voucher code - Replace with actual API call
      const voucherCode = `HIGHLAND-${Date.now().toString(36).toUpperCase()}`;
      
      result.voucherCode = voucherCode;
      
      // Save gift record
      await supabase.from('card_gifts').insert({
        card_id: cardId,
        gift_type: 'voucher',
        voucher_type: 'coffee',
        voucher_code: voucherCode,
        status: 'claimed',
        claimed: true,
        claimed_at: new Date().toISOString(),
      });
    } else if (giftType === 'voucher') {
      // Generate shopping voucher
      const voucherCode = `SHOPEE-${Date.now().toString(36).toUpperCase()}`;
      
      result.voucherCode = voucherCode;
      
      await supabase.from('card_gifts').insert({
        card_id: cardId,
        gift_type: 'voucher',
        voucher_type: 'shopping',
        voucher_code: voucherCode,
        status: 'claimed',
        claimed: true,
        claimed_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error claiming gift:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

