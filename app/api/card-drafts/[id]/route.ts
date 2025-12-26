// app/api/card-drafts/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function isUuid(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!isUuid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('card_drafts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!isUuid(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Whitelist field để tránh update bậy + an toàn hơn
    const patch: Record<string, any> = {};
    const allow = [
      'template_id',
      'envelope_id',
      'stamp_id',
      'music_id',
      'recipient_name',
      'sender_name',
      'content',
      'rich_content', // ✅ Thêm rich_content
      'used_fonts', // ✅ Fonts đã sử dụng trong thiệp
      'font_style',
      'text_effect',
      'photos',
      'signature_data',
      // ✅ Step 4: Photo Frame data
      'frame_id',
      'photo_slots',
      // ✅ Step 3: Letter background/pattern
      'letter_background',
      'letter_pattern',
      // ✅ Step 2: Background colors cho các phần khác
      'cover_background',
      'cover_pattern',
      'photo_background',
      'photo_pattern',
      'signature_background',
      'signature_pattern',
      // ✅ Envelope customization fields
      'envelope_color', // ✅ Lưu màu từ customization
      'envelope_pattern',
      'envelope_pattern_color',
      'envelope_pattern_intensity',
      'envelope_seal_design',
      'envelope_seal_color',
      'envelope_liner_pattern_type',
      'envelope_liner_color',
    ] as const;

    for (const k of allow) {
      if (k in body) {
        // ✅ Xử lý used_fonts: chỉ thêm nếu có giá trị, bỏ qua nếu column chưa tồn tại
        if (k === 'used_fonts') {
          // Chỉ thêm nếu có giá trị hợp lệ
          if (body[k] !== null && body[k] !== undefined) {
            patch[k] = Array.isArray(body[k]) ? body[k] : null;
          }
        } else {
          patch[k] = body[k];
        }
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('card_drafts')
      .update(patch)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .maybeSingle();
    
    // ✅ Nếu lỗi do column không tồn tại, thử lại không có used_fonts
    if (error && error.message?.includes('used_fonts')) {
      const patchWithoutUsedFonts = { ...patch };
      delete patchWithoutUsedFonts.used_fonts;
      
      if (Object.keys(patchWithoutUsedFonts).length > 0) {
        const { data: retryData, error: retryError } = await supabase
          .from('card_drafts')
          .update(patchWithoutUsedFonts)
          .eq('id', id)
          .eq('user_id', user.id)
          .select('*')
          .maybeSingle();
        
        if (retryError) {
          return NextResponse.json({ error: retryError.message }, { status: 500 });
        }
        
        return NextResponse.json({ data: retryData }, { status: 200 });
      }
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}
