// app/api/admin/templates/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/templates/batch
 * Tạo mới template (cho batch upload)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Kiểm tra auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Kiểm tra role admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userError && userData && userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    // 3. Parse body
    const body = await request.json();
    const {
      name,
      thumbnail,
      category,
      points_required,
      subscription_tier,
      media_type,
      image_transform,
    } = body;

    // 4. Validate required fields
    if (!name || !thumbnail || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, thumbnail, category' },
        { status: 400 }
      );
    }

    // 5. Insert với created_by
    const insertData: any = {
      name,
      thumbnail,
      category,
      points_required: points_required ?? 0,
      subscription_tier: subscription_tier || 'free',
      is_active: true,
      media_type: media_type ?? 'image',
      image_transform: image_transform ?? { scale: 1, x: 0, y: 0 },
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from('card_templates')
      .insert(insertData)
      .select('id')
      .single();

    if (error) {
      console.error('Insert template error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create template' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

