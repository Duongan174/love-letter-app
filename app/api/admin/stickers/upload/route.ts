// app/api/admin/stickers/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/stickers/upload
 * Upload sticker image to Supabase Storage (server-side để bypass RLS)
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

    // 2. Kiểm tra role admin (nếu có)
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData && userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    // 3. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 4. Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed' },
        { status: 400 }
      );
    }

    // 5. Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // 6. Upload to Supabase Storage (server-side bypass RLS)
    const fileExt = file.name.split('.').pop();
    const fileName = `sticker_${Date.now()}.${fileExt}`;
    const filePath = `stickers/${fileName}`;

    // Convert File to ArrayBuffer for server-side upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload file' },
        { status: 500 }
      );
    }

    // 7. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

