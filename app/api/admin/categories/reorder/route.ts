// app/api/admin/categories/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/admin/categories/reorder
 * Reorder categories (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    // Parse body - expects array of { id, display_order }
    const body = await request.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected array of categories' },
        { status: 400 }
      );
    }

    // Update display_order for each category
    const updates = categories.map((cat: { id: string; display_order: number }) =>
      supabase
        .from('categories')
        .update({ display_order: cat.display_order })
        .eq('id', cat.id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

