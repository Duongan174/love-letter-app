// app/api/cards/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const draftId = body?.draftId;

  if (!draftId || typeof draftId !== 'string') {
    return NextResponse.json({ error: 'draftId is required' }, { status: 400 });
  }

  // 1) Load draft (ownership check)
  const { data: draft, error: draftError } = await supabase
    .from('card_drafts')
    .select('*')
    .eq('id', draftId)
    .eq('user_id', user.id)
    .single();

  if (draftError || !draft) {
    return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  }

  if (!draft.template_id) {
    return NextResponse.json({ error: 'Draft missing template' }, { status: 400 });
  }
  if (!draft.envelope_id) {
    return NextResponse.json({ error: 'Draft missing envelope' }, { status: 400 });
  }
  if (!draft.stamp_id) {
    return NextResponse.json({ error: 'Draft missing stamp' }, { status: 400 });
  }
  if (!draft.recipient_name || !draft.content) {
    return NextResponse.json({ error: 'Draft missing recipient/content' }, { status: 400 });
  }

  // 2) Tính cost server-side
  const [
    tplRes,
    envRes,
    stampRes,
    musicRes,
    userRes,
  ] = await Promise.all([
    supabase.from('card_templates').select('points_required').eq('id', draft.template_id).single(),
    supabase.from('envelopes').select('points_required,color,texture').eq('id', draft.envelope_id).single(),
    supabase.from('stamps').select('points_required,image_url').eq('id', draft.stamp_id).single(),
    draft.music_id
      ? supabase.from('music').select('points_required').eq('id', draft.music_id).single()
      : Promise.resolve({ data: { points_required: 0 } as any, error: null }),
    supabase.from('users').select('points').eq('id', user.id).single(),
  ]);

  if (tplRes.error) return NextResponse.json({ error: tplRes.error.message }, { status: 400 });
  if (envRes.error) return NextResponse.json({ error: envRes.error.message }, { status: 400 });
  if (stampRes.error) return NextResponse.json({ error: stampRes.error.message }, { status: 400 });
  if (musicRes && (musicRes as any).error) return NextResponse.json({ error: (musicRes as any).error.message }, { status: 400 });
  if (userRes.error) return NextResponse.json({ error: userRes.error.message }, { status: 400 });

  const cost =
    (tplRes.data?.points_required ?? 0) +
    (envRes.data?.points_required ?? 0) +
    (stampRes.data?.points_required ?? 0) +
    ((musicRes as any)?.data?.points_required ?? 0);

  const currentPoints = userRes.data?.points ?? 0;
  if (currentPoints < cost) {
    return NextResponse.json({ error: 'Bạn không đủ Tym!' }, { status: 400 });
  }

  // 3) Insert card
  const { data: card, error: cardError } = await supabase
    .from('cards')
    .insert({
      user_id: user.id,
      recipient_name: draft.recipient_name,
      recipient_email: draft.recipient_email || null,
      template_id: draft.template_id,
      envelope_id: draft.envelope_id,
      stamp_id: draft.stamp_id,
      music_id: draft.music_id || null,

      content: draft.content,
      rich_content: draft.rich_content || null, // ✅ Lưu rich_content vào cards
      font_style: draft.font_style || 'font-dancing',
      text_effect: draft.text_effect || 'typewriter',
      photos: Array.isArray(draft.photos) ? draft.photos : [],
      signature_data: draft.signature_data || null,
      sender_name: draft.sender_name || null,

      // ✅ Step 4: Photo Frame data - lưu vào cards
      frame_id: draft.frame_id || null,
      photo_slots: Array.isArray(draft.photo_slots) ? draft.photo_slots : null,

      // ✅ Step 3: Letter background/pattern cho trang xem thiệp
      letter_background: draft.letter_background || '#ffffff',
      letter_pattern: draft.letter_pattern || 'solid',
      // ✅ Step 2: Background colors cho các phần khác
      cover_background: draft.cover_background || '#fdf2f8',
      cover_pattern: draft.cover_pattern || 'solid',
      photo_background: draft.photo_background || '#fff8e1',
      photo_pattern: draft.photo_pattern || 'solid',
      signature_background: draft.signature_background || '#fce4ec',
      signature_pattern: draft.signature_pattern || 'solid',

      // giúp public share link dễ (tuỳ RLS của bạn)
      status: 'sent',
      sent_at: new Date().toISOString(),

      // ✅ Ưu tiên màu từ customization, nếu không có thì lấy từ database
      envelope_color: draft.envelope_color ?? envRes.data?.color ?? undefined,
      // ✅ Envelope customization data
      envelope_pattern: draft.envelope_pattern ?? 'solid',
      envelope_pattern_color: draft.envelope_pattern_color ?? '#5d4037',
      envelope_pattern_intensity: draft.envelope_pattern_intensity ?? 0.15,
      envelope_seal_design: draft.envelope_seal_design ?? 'heart',
      envelope_seal_color: draft.envelope_seal_color ?? '#c62828',
      envelope_liner_pattern_type: draft.envelope_liner_pattern_type ?? null,
      envelope_liner_color: draft.envelope_liner_color ?? '#ffffff',
    })
    .select('id')
    .single();

  if (cardError || !card) {
    return NextResponse.json({ error: cardError?.message || 'Create card failed' }, { status: 400 });
  }

  // 4) Trừ điểm + log transaction (không atomic, nhưng an toàn hơn client-side)
  const newPoints = currentPoints - cost;

  const { error: upError } = await supabase
    .from('users')
    .update({ points: newPoints, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (upError) {
    // NOTE: ở production nên dùng RPC/transaction để atomic
    return NextResponse.json({ error: upError.message }, { status: 400 });
  }

  await supabase.from('point_transactions').insert({
    user_id: user.id,
    amount: cost,
    type: 'spend',
    description: `Create card (${card.id})`,
  });

  return NextResponse.json({ data: { id: card.id } });
}
