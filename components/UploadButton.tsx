"use client";
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus } from 'lucide-react';

interface UploadButtonProps {
  onUpload: (url: string) => void;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
  return (
    <CldUploadWidget 
      uploadPreset="drtzvauk" // Tạm thời dùng preset mặc định, tý mình chỉ cách tạo
      onSuccess={(result: any) => {
        // Khi upload xong, lấy link ảnh trả về cho cha
        onUpload(result.info.secure_url);
      }}
    >
      {({ open }) => {
        return (
          <button
            onClick={() => open()}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-black hover:text-black transition bg-white"
          >
            <ImagePlus size={24} />
            <span className="text-sm font-semibold">Thêm ảnh kỷ niệm</span>
          </button>
        );
      }}
    </CldUploadWidget>
  );
}