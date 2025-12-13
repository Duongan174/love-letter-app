"use client";
import { useState } from "react";
import Envelope from "@/components/Envelope";
import UploadButton from "@/components/UploadButton";
import TextEditor from "@/components/TextEditor"; // Import trình soạn thảo mới
import { Send, Loader2, PenLine, X, Music } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [config, setConfig] = useState({
    recipientName: "",
    envelopeColor: "#8d6e63",
    waxColor: "#b91c1c",
    content: "", // Nội dung sẽ là HTML
    images: [] as string[],
    music: "none",
    isPreview: true,
  });

  const [loading, setLoading] = useState(false);

  const musicOptions = [
    { id: "none", name: "Không dùng nhạc" },
    { id: "/music/piano1.mp3", name: "🎹 Piano Nhẹ Nhàng" },
  ];

  const handleAddImage = (url: string) => {
    setConfig({ ...config, images: [...config.images, url] });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setConfig({
      ...config,
      images: config.images.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSave = async () => {
    if (!config.recipientName) return alert("Chưa nhập tên người nhận!");
    // Vẫn kiểm tra nội dung, dù là HTML
    if (config.content.length < 10) return alert("Thư chưa có nội dung, gửi phong bì rỗng kỳ lắm!"); 
    
    setLoading(true);

    const { data, error } = await supabase
      .from('cards')
      .insert([
        { 
          recipient_name: config.recipientName,
          envelope_color: config.envelopeColor,
          wax_color: config.waxColor,
          content: config.content, // Lưu nội dung HTML
          image_urls: config.images,
          music: config.music
        }
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      const link = `${window.location.origin}/card/${data.id}`;
      prompt("Tạo thư thành công! Copy link:", link);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">
      
      {/* CỘT TRÁI: Công cụ */}
      <div className="w-full md:w-1/3 p-6 bg-white border-r shadow-2xl z-20 flex flex-col gap-5 overflow-y-auto h-screen">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           <PenLine className="bg-black text-white p-1 rounded" size={28}/> Soạn Thư
        </h1>
        
        {/* 1. Nhập tên */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Gửi cho ai?</label>
          <input 
            type="text" 
            value={config.recipientName}
            onChange={(e) => setConfig({...config, recipientName: e.target.value})}
            className="w-full mt-1 p-3 border rounded-lg bg-gray-50 font-serif text-lg"
            placeholder="Tên người nhận..."
          />
        </div>

        {/* 2. Chọn nhạc */}
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
             <Music size={14}/> Âm nhạc cảm xúc
           </label>
           <select 
             value={config.music}
             onChange={(e) => setConfig({...config, music: e.target.value})}
             className="w-full p-3 border rounded-lg bg-gray-50 cursor-pointer outline-none focus:ring-2 focus:ring-black"
           >
             {musicOptions.map((option) => (
               <option key={option.id} value={option.id}>{option.name}</option>
             ))}
           </select>
        </div>

        {/* 3. Upload Ảnh */}
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Kẹp thêm ảnh (Tối đa 4)</label>
           <div className="grid grid-cols-4 gap-2 mb-2">
              {config.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                   <img src={img} alt="preview" className="object-cover w-full h-full" />
                   <button 
                     onClick={() => handleRemoveImage(idx)}
                     className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl hover:bg-red-700"
                   >
                     <X size={12}/>
                   </button>
                </div>
              ))}
           </div>
           {config.images.length < 4 && (
              <UploadButton onUpload={handleAddImage} />
           )}
        </div>

        {/* 4. Nội dung (Rich Text Editor - MỚI) */}
        <div className="flex-1 flex flex-col min-h-[250px]">
          <label className="text-xs font-bold text-gray-500 uppercase">Lời nhắn</label>
          <TextEditor
            content={config.content}
            onChange={(htmlContent) => setConfig({...config, content: htmlContent})}
            placeholder="Viết những lời từ trái tim vào đây..."
          />
        </div>

        {/* 5. Màu sắc */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Màu phong bì</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['#8d6e63', '#3e2723', '#1a237e', '#880e4f', '#004d40'].map((color) => (
              <button
                key={color}
                onClick={() => setConfig({...config, envelopeColor: color})}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${config.envelopeColor === color ? 'border-blue-500' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />} 
          {loading ? "Đang xử lý..." : "Hoàn tất & Lấy Link"}
        </button>
      </div>

      {/* CỘT PHẢI */}
      <div className="w-full md:w-2/3 bg-[#d7ccc8] flex items-center justify-center relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30 pointer-events-none" />
         <Envelope config={config} />
      </div>
    </main>
  );
}