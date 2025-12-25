// app/api/cards/[id]/publish/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/cards/:id/publish
 * Publish card + trừ Tym
 */
export async function POST(
  _req: Request,
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

  // 2️⃣ Lấy card
  const { data: card } = await supabase
    .from('cards')
    .select('status, total_tym')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!card || card.status !== 'draft') {
    return NextResponse.json(
      { error: 'Invalid card state' },
      { status: 400 }
    );
  }

  // ⚠️ TODO: ở bước sau sẽ thêm transaction trừ Tym
  await supabase
    .from('cards')
    .update({ status: 'published' })
    .eq('id', id);

  return NextResponse.json({ success: true });
}
