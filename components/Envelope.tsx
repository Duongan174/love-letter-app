"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface EnvelopeProps {
  config: {
    recipientName: string;
    envelopeColor: string;
    waxColor: string;
    music?: string;
    isPreview?: boolean;
  };
  onOpen?: () => void;
}

export default function Envelope({ config, onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (config.isPreview) {
      setIsOpen(false);
      // Dừng nhạc khi thoát khỏi chế độ preview
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [config]);

  const handleOpen = () => {
    if (config.isPreview) return;

    if (!isOpen) {
      setIsOpen(true);
      
      // --- XỬ LÝ PHÁT NHẠC ---
      if (config.music && config.music !== "none") {
        const audio = new Audio(config.music);
        audio.volume = 0.5; // Âm lượng vừa phải
        audio.loop = true;  // Lặp lại liên tục
        
        // Luôn dùng Promise để xử lý lỗi trình duyệt chặn tự động phát
        audio.play().catch((error) => {
            console.error("LỖI PHÁT NHẠC:", error.name);
            // Gợi ý nhỏ: Người dùng cần tương tác thêm một lần nữa
        });
        audioRef.current = audio;
      }
      
      // Đợi hiệu ứng mở xong thì báo tin
      if (onOpen) setTimeout(onOpen, 1500); 
    }
  };

  return (
    <div className="relative flex items-center justify-center h-full w-full py-10">
      <div 
        className="relative w-[300px] h-[200px] md:w-[350px] md:h-[240px] cursor-pointer group" 
        onClick={handleOpen}
      >
        
        {/* 1. Lưng phong bì */}
        <div 
          className="absolute inset-0 rounded-b-md shadow-2xl transition-colors duration-300"
          style={{ backgroundColor: config.envelopeColor }} 
        />

        {/* 2. Tấm thiệp bên trong */}
        <motion.div
          initial={{ y: 0 }}
          animate={isOpen ? { y: -100 } : { y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute left-2 right-2 top-2 h-[90%] bg-[#fdfbf7] rounded-sm flex flex-col items-center justify-center z-10 shadow-md border border-gray-100"
        >
          <div className="text-center p-4">
             <p className="font-serif text-gray-400 text-[10px] mb-1">Gửi tới</p>
             <h2 className="font-serif text-lg text-[#5d4037] font-bold truncate max-w-[180px]">
               {config.recipientName || "Người nhận"}
             </h2>
          </div>
        </motion.div>

        {/* 3. Vỏ phong bì */}
        <div className="absolute inset-0 z-20 pointer-events-none">
            <div 
                className="absolute left-0 bottom-0 w-0 h-0 border-t-[100px] border-r-[150px] border-b-[100px] border-l-[150px] md:border-t-[120px] md:border-r-[175px] md:border-b-[120px] md:border-l-[175px] border-transparent transition-colors duration-300 filter brightness-90"
                style={{ borderLeftColor: config.envelopeColor, borderBottomColor: config.envelopeColor }} 
            />
            <div 
                className="absolute right-0 bottom-0 w-0 h-0 border-t-[100px] border-r-[150px] border-b-[100px] border-l-[150px] md:border-t-[120px] md:border-r-[175px] md:border-b-[120px] md:border-l-[175px] border-transparent transition-colors duration-300 filter brightness-75"
                style={{ borderRightColor: config.envelopeColor, borderBottomColor: config.envelopeColor }} 
            />
        </div>
        
        {/* 4. Nắp phong bì */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 30 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full z-30 drop-shadow-md"
          style={{ transformOrigin: "top" }}
        >
             <div 
                className="w-0 h-0 border-l-[150px] border-r-[150px] border-t-[100px] md:border-l-[175px] md:border-r-[175px] md:border-t-[120px] border-transparent transition-colors duration-300 filter brightness-110"
                style={{ borderTopColor: config.envelopeColor }}
             />
        </motion.div>

        {/* 5. Con dấu sáp */}
        {!isOpen && (
            <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full shadow-lg border-2 border-white/20 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: config.waxColor }}
            >
                <span className="text-white font-serif text-lg font-bold">W</span>
            </div>
        )}
      </div>
    </div>
  );
}