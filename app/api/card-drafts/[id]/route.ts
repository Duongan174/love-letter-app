// app/api/card-drafts/[id]/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Params {
  params: { id: string };
}

/**
 * GET /api/card-drafts/:id
 * Lấy draft của user hiện tại
 */
export async function GET(_: Request, { params }: Params) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('card_drafts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  }

  // RLS đã đảm bảo chỉ user sở hữu mới đọc được
  return NextResponse.json(data);
}
