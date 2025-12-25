// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

/**
 * Remove background from image using Cloudinary's AI background removal
 * Note: This requires Cloudinary's Advanced add-on or similar service
 * Alternative: Use remove.bg API if available
 */
export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Thiếu URL ảnh' },
        { status: 400 }
      );
    }

    // Option 1: Use Cloudinary's background removal (if available)
    // This requires Cloudinary Advanced add-on
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: 'vintage-ecard/stickers',
        effect: 'background_removal',
        flags: 'png',
      });

      return NextResponse.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (cloudinaryError: any) {
      console.warn('Cloudinary background removal not available:', cloudinaryError.message);
      
      // Option 2: Fallback - return original image with note
      // In production, you might want to use remove.bg API or similar service
      return NextResponse.json({
        url: imageUrl,
        note: 'Background removal feature requires Cloudinary Advanced add-on or external API',
      });
    }
  } catch (error: any) {
    console.error('Remove background error:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi xóa nền' },
      { status: 500 }
    );
  }
}

