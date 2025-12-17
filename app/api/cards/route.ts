import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('cards')
      .insert([{
        user_id: body.user_id,
        recipient_name: body.recipient_name,
        recipient_email: body.recipient_email || null,
        sender_name: body.sender_name,
        content: body.message,
        font_style: body.font_style || 'dancing',
        text_effect: body.text_effect || 'none',
        photos: body.photos || [],
        signature_data: body.signature_data || null,
        signature_url: body.signature_url || null,
        envelope_id: body.envelope_id || null,
        envelope_color: body.envelope_color || '#f8b4c4',
        stamp_id: body.stamp_id || null,
        music_id: body.music_id || null,
        view_count: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Trừ Tym
    if (body.tym_cost > 0 && body.user_id) {
      const { data: userData } = await supabase
        .from('users')
        .select('points')
        .eq('id', body.user_id)
        .single();
      
      if (userData) {
        await supabase
          .from('users')
          .update({ points: userData.points - body.tym_cost })
          .eq('id', body.user_id);
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}