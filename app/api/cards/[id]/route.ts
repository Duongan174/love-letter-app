// app/api/cards/[id]/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/cards/:id
 * Update card khi đang ở trạng thái DRAFT
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // 1️⃣ Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 2️⃣ Lấy card hiện tại
  const { data: card } = await supabase
    .from('cards')
    .select('status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!card || card.status !== 'draft') {
    return NextResponse.json(
      { error: 'Card is not editable' },
      { status: 400 }
    );
  }

  // 3️⃣ Nhận dữ liệu update
  const body = await request.json();

  const { error } = await supabase
    .from('cards')
    .update({
      message: body.message,
      signature: body.signature,
      template_id: body.template_id,
      music_id: body.music_id,
      envelope_id: body.envelope_id,
      stamp_id: body.stamp_id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
