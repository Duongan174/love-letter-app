// app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/admin/categories/[id]
 * Update a category (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
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

    // Parse body
    const body = await request.json();
    const { name, label, emoji, display_order, is_active, parent_id } = body;

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.toLowerCase().trim();
    if (label !== undefined) updateData.label = label.trim();
    if (emoji !== undefined) updateData.emoji = emoji.trim();
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (parent_id !== undefined) {
      // Prevent circular reference (category cannot be its own parent)
      if (parent_id === id) {
        return NextResponse.json(
          { error: 'Category cannot be its own parent' },
          { status: 400 }
        );
      }
      // If parent_id is null, remove parent relationship
      if (parent_id === null || parent_id === '') {
        updateData.parent_id = null;
      } else {
        // Validate parent exists
        const { data: parent } = await supabase
          .from('categories')
          .select('id')
          .eq('id', parent_id)
          .single();

        if (!parent) {
          return NextResponse.json(
            { error: 'Parent category not found' },
            { status: 400 }
          );
        }
        updateData.parent_id = parent_id;
      }
    }

    // Update category
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update category error:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Category name already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || 'Failed to update category' },
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
 * DELETE /api/admin/categories/[id]
 * Delete a category (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
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

    // Get category name
    const { data: category } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single();

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category is being used by templates
    const { count: templateCount } = await supabase
      .from('card_templates')
      .select('*', { count: 'exact', head: true })
      .eq('category', category.name);

    // Check if category has subcategories
    const { count: subcategoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', id);

    if (templateCount && templateCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete category that is being used by templates',
          template_count: templateCount
        },
        { status: 400 }
      );
    }

    if (subcategoryCount && subcategoryCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete category that has subcategories',
          subcategory_count: subcategoryCount
        },
        { status: 400 }
      );
    }

    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete category error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

