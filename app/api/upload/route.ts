// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // 1. Kiểm tra cấu hình trước
    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
      console.error('❌ Thiếu cấu hình Cloudinary trong .env.local');
      return NextResponse.json(
        { error: 'Server chưa cấu hình Cloudinary' }, 
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'vintage-ecard';

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 });
    }

    // 2. Chuyển file sang Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 3. Upload lên Cloudinary bằng Promise
    // Sử dụng upload_stream để an toàn hơn với file lớn
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto', // Tự động nhận diện ảnh/nhạc/video
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    });

  } catch (error: any) {
    console.error('❌ Upload API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi upload server' }, 
      { status: 500 }
    );
  }
}