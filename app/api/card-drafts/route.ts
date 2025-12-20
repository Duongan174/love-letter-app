// app/api/card-drafts/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function isUuid(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const templateId = body?.templateId;
    if (!isUuid(templateId)) {
      return NextResponse.json({ error: 'templateId must be a UUID' }, { status: 400 });
    }

    // NOTE: Tên bảng/field phải đúng theo DB của bạn.
    // Giả định: card_drafts có user_id, template_id
    const { data, error } = await supabase
      .from('card_drafts')
      .insert({
        user_id: user.id,
        template_id: templateId,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}
