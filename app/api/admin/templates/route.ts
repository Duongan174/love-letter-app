// app/api/admin/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/templates
 * Tạo mới template (server-side để bypass RLS)
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

    // 2. Kiểm tra role admin (nếu có bảng users với role)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    // Nếu có role check và không phải admin, từ chối
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
      is_premium,
      is_active,
      media_type,
      image_transform,
      preview_url,
      animation_type,
    } = body;

    // 4. Validate required fields
    if (!name || !thumbnail || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, thumbnail, category' },
        { status: 400 }
      );
    }

    // 5. Insert với created_by
    const { data, error } = await supabase
      .from('card_templates')
      .insert({
        name,
        thumbnail,
        category,
        points_required: points_required ?? 0,
        is_premium: is_premium ?? false,
        is_active: is_active ?? true,
        media_type: media_type ?? 'image',
        image_transform: image_transform ?? { scale: 1, x: 0, y: 0 },
        preview_url: preview_url || null,
        animation_type: animation_type || null,
        created_by: user.id, // ✅ Set created_by để pass RLS
      })
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

/**
 * PUT /api/admin/templates
 * Cập nhật template
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra role admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData && userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing template id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('card_templates')
      .update(updateData)
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      console.error('Update template error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update template' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/templates
 * Xóa template và các drafts liên quan
 * 
 * Thứ tự xóa:
 * 1. Xóa các card_drafts đang sử dụng template này (để tránh foreign key constraint)
 * 2. Xóa các cards đang sử dụng template này (nếu có)
 * 3. Xóa template
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra role admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData && userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing template id' }, { status: 400 });
    }

    // Bước 1: Đếm và xóa tất cả card_drafts đang sử dụng template này
    const { count: draftsCount } = await supabase
      .from('card_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id);

    const { error: deleteDraftsError } = await supabase
      .from('card_drafts')
      .delete()
      .eq('template_id', id);

    if (deleteDraftsError) {
      console.error('Delete drafts error:', deleteDraftsError);
      return NextResponse.json(
        { error: `Failed to delete related drafts: ${deleteDraftsError.message}` },
        { status: 500 }
      );
    }

    // Bước 2: Đếm và xóa các cards đang sử dụng template này (nếu có)
    const { count: cardsCount } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id);

    if (cardsCount && cardsCount > 0) {
      // Có cards đang sử dụng template này - xóa luôn để đảm bảo có thể xóa template
      const { error: deleteCardsError } = await supabase
        .from('cards')
        .delete()
        .eq('template_id', id);

      if (deleteCardsError) {
        console.error('Delete cards error:', deleteCardsError);
        return NextResponse.json(
          { error: `Failed to delete related cards: ${deleteCardsError.message}` },
          { status: 500 }
        );
      }
    }

    // Bước 3: Xóa template
    const { error: deleteTemplateError } = await supabase
      .from('card_templates')
      .delete()
      .eq('id', id);

    if (deleteTemplateError) {
      console.error('Delete template error:', deleteTemplateError);
      return NextResponse.json(
        { error: deleteTemplateError.message || 'Failed to delete template' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      deletedDrafts: draftsCount || 0,
      deletedCards: cardsCount || 0
    }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

