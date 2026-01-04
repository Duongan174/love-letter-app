// app/api/admin/stamps/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/stamps/batch
 * Tạo mới stamp (cho batch upload)
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
      image_url,
      points_required,
      is_active,
      image_transform,
    } = body;

    // 4. Validate required fields
    if (!name || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields: name, image_url' },
        { status: 400 }
      );
    }

    // 5. Insert
    const insertData: any = {
      name,
      image_url,
      points_required: points_required ?? 0,
      is_active: is_active ?? true,
      image_transform: image_transform ?? { scale: 1, x: 0, y: 0 },
    };

    const { data, error } = await supabase
      .from('stamps')
      .insert(insertData)
      .select('id')
      .single();

    if (error) {
      console.error('Insert stamp error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create stamp' },
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

