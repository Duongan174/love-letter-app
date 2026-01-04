// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/categories
 * Get all categories (admin can see all, including inactive)
 */
export async function GET(request: NextRequest) {
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

    const isAdmin = userData?.role === 'admin';

    // Fetch all categories
    let query = supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    // If not admin, only show active categories
    if (!isAdmin) {
      query = query.eq('is_active', true);
    }

    const { data: allCategories, error } = await query;

    if (error) {
      console.error('Fetch categories error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    if (!allCategories || allCategories.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Get template counts for each category
    const { data: templateCounts } = await supabase
      .from('card_templates')
      .select('category');

    const counts: Record<string, number> = {};
    templateCounts?.forEach(t => {
      const cat = allCategories.find(c => c.name === t.category);
      if (cat) {
        counts[cat.id] = (counts[cat.id] || 0) + 1;
      }
    });

    // Build parent-child relationships
    const parentCategories = allCategories.filter(c => !c.parent_id);
    const subcategoriesMap = new Map<string, typeof allCategories>();
    
    allCategories.forEach(cat => {
      if (cat.parent_id) {
        if (!subcategoriesMap.has(cat.parent_id)) {
          subcategoriesMap.set(cat.parent_id, []);
        }
        subcategoriesMap.get(cat.parent_id)!.push(cat);
      }
    });

    // Build result with parent info and subcategories
    const categoriesWithRelations = allCategories.map(cat => {
      const parent = cat.parent_id ? allCategories.find(p => p.id === cat.parent_id) : null;
      const subcategories = subcategoriesMap.get(cat.id) || [];
      
      return {
        ...cat,
        parent: parent ? {
          id: parent.id,
          name: parent.name,
          label: parent.label,
          emoji: parent.emoji,
        } : null,
        subcategories: subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          label: sub.label,
          emoji: sub.emoji,
          display_order: sub.display_order,
          is_active: sub.is_active,
        })),
        template_count: counts[cat.id] || 0,
        subcategory_count: subcategories.length,
      };
    });

    return NextResponse.json({ data: categoriesWithRelations }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Create a new category (admin only)
 */
export async function POST(request: NextRequest) {
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

    // Parse body
    const body = await request.json();
    const { name, label, emoji, display_order, is_active, parent_id } = body;

    // Validate required fields
    if (!name || !label || !emoji) {
      return NextResponse.json(
        { error: 'Missing required fields: name, label, emoji' },
        { status: 400 }
      );
    }

    // If parent_id is provided, validate it exists
    if (parent_id) {
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
    }

    // Insert category
    const insertData: any = {
      name: name.toLowerCase().trim(),
      label: label.trim(),
      emoji: emoji.trim(),
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    };

    if (parent_id) {
      insertData.parent_id = parent_id;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Create category error:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Category name already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || 'Failed to create category' },
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

