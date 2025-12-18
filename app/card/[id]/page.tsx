// app/card/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope3D from '@/components/create/Envelope3D';
import { ChevronRight, ChevronLeft, Heart, X, Sparkles } from 'lucide-react';
import Loading from '@/components/ui/Loading';

// Mock Data (Thay bằng fetch Supabase sau)
const mockData = {
  templateUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
  photoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  pages: [
    "Chào cậu, tớ có điều này muốn nói...",
    "Từ ngày gặp cậu, cuộc sống tớ thêm nhiều màu sắc.",
    "Cảm ơn cậu vì đã luôn ở bên tớ nhé!",
    "Mong những điều tốt đẹp nhất sẽ đến với cậu."
  ],
  signature: "Minh Anh",
  wish: "Happy Birthday!",
  envelope_color: "#f8b4c4",
  stamp_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  liner_pattern: "https://www.transparenttextures.com/patterns/cubes.png"
};

export default function CardViewPage({ params }: { params: { id: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Giả lập load dữ liệu
    setTimeout(() => setData(mockData), 1000);
  }, []);

  if (!data) return <Loading text="Đang nhận thư..." />;

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Sau 1.5s (khi hiệu ứng trượt xong) -> Vào chế độ đọc
      setTimeout(() => setIsReading(true), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background hiệu ứng */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <AnimatePresence>
        {/* GIAI ĐOẠN 1: PHONG BÌ */}
        {!isReading && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="cursor-pointer z-10"
            onClick={handleOpen}
          >
            <Envelope3D 
              color={data.envelope_color}
              isOpen={isOpen}
              stampUrl={data.stamp_url}
              linerPattern={data.liner_pattern}
            />
            
            <motion.p 
              className="text-white/50 text-center mt-12 font-lexend text-sm tracking-widest uppercase"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isOpen ? "Đang mở thư..." : "Chạm để mở thư"}
            </motion.p>
          </motion.div>
        )}

        {/* GIAI ĐOẠN 2: ĐỌC THIỆP (FLIPBOOK) */}
        {isReading && (
          <FlipBook data={data} onClose={() => window.location.reload()} />
        )}
      </AnimatePresence>
    </div>
  );
}

// === COMPONENT SÁCH LẬT (FLIPBOOK) - GIỮ NGUYÊN ===
function FlipBook({ data, onClose }: { data: any, onClose: () => void }) {
  const [page, setPage] = useState(0);
  
  // Logic trang: 0(Bìa) -> 1(Ảnh) -> 2...(Nội dung) -> Cuối(Chữ ký)
  const contentPages = data.pages || [];
  const hasPhoto = !!data.photoUrl;
  const totalPages = 1 + (hasPhoto ? 1 : 0) + contentPages.length + 1;

  const nextPage = () => setPage(p => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setPage(p => Math.max(0, p - 1));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-20 w-full max-w-md aspect-[2/3] perspective-1000"
    >
      <button onClick={onClose} className="absolute -top-12 right-0 text-white/50 hover:text-white p-2">
        <X />
      </button>

      <div 
        className="w-full h-full relative cursor-pointer shadow-2xl rounded-lg overflow-hidden bg-[#fffbf0]"
        onClick={nextPage}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* TRANG BÌA */}
            {page === 0 && (
              <div className="w-full h-full relative">
                <img src={data.templateUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg text-center">
                    <Heart className="w-10 h-10 text-rose-500 mx-auto mb-2 animate-pulse" fill="currentColor" />
                    <h2 className="font-playfair text-2xl font-bold text-gray-800">Gửi Người Thương</h2>
                    <p className="text-xs text-gray-500 mt-1">Chạm để mở</p>
                  </div>
                </div>
              </div>
            )}

            {/* TRANG ẢNH */}
            {hasPhoto && page === 1 && (
              <div className="w-full h-full flex items-center justify-center bg-black p-4">
                <div className="relative bg-white p-2 pb-12 shadow-lg rotate-1 transform">
                  <img src={data.photoUrl} className="max-w-full max-h-[400px] object-cover" />
                  <p className="absolute bottom-4 left-0 right-0 text-center font-dancing text-gray-600">Kỷ niệm của chúng ta</p>
                </div>
              </div>
            )}

            {/* TRANG NỘI DUNG */}
            {page >= (hasPhoto ? 2 : 1) && page < totalPages - 1 && (
              <div className="w-full h-full p-8 flex flex-col justify-center items-center text-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                <Sparkles className="w-6 h-6 text-amber-400 mb-4" />
                <p className="font-dancing text-2xl md:text-3xl text-gray-800 leading-loose">
                  {contentPages[page - (hasPhoto ? 2 : 1)]}
                </p>
                <div className="mt-8 text-xs text-rose-300 font-bold">
                  — {page} —
                </div>
              </div>
            )}

            {/* TRANG CUỐI */}
            {page === totalPages - 1 && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 text-center p-8">
                <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-2">{data.wish}</h2>
                <div className="w-16 h-1 bg-rose-300 my-6 rounded-full" />
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Gửi bởi</p>
                <p className="text-5xl font-dancing text-rose-600 transform -rotate-2">{data.signature}</p>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Tính năng gửi lại đang phát triển!'); }}
                  className="mt-16 px-6 py-3 bg-white text-rose-500 rounded-full font-bold shadow-md hover:shadow-lg transition"
                >
                  Gửi lại thiệp này
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 w-full flex justify-between px-6 text-gray-400 text-xs font-bold pointer-events-none">
          <span className={page === 0 ? 'opacity-0' : ''}>← TRƯỚC</span>
          <span className={page === totalPages - 1 ? 'opacity-0' : ''}>TIẾP THEO →</span>
        </div>
      </div>
    </motion.div>
  );
}