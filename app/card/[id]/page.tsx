"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Envelope from "@/components/Envelope";
import { Loader2 } from "lucide-react";

export default function CardViewer() {
  const params = useParams();
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      if (!params.id) return;
      const { data } = await supabase
        .from('cards')
        .select('*')
        .eq('id', params.id)
        .single();
      setCardData(data);
      setLoading(false);
    };
    fetchCard();
  }, [params.id]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#2c2c2c] text-white">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  if (!cardData) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#2c2c2c] text-white flex-col gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Thư này đã bị thất lạc...</p>
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-[#2c2c2c] flex items-center justify-center relative overflow-hidden font-serif">
      
      {/* PHẦN 1: PHONG BÌ */}
      <div 
        className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center z-20 
        ${showContent ? 'opacity-0 scale-150 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
         <Envelope 
            config={{
               recipientName: cardData.recipient_name,
               envelopeColor: cardData.envelope_color,
               waxColor: cardData.wax_color,
               music: cardData.music,
               isPreview: false
            }}
            onOpen={() => setShowContent(true)}
         />
         {!showContent && (
            <div className="text-white/50 text-center mt-4 animate-pulse text-sm tracking-widest uppercase">
               Chạm vào phong bì để mở
            </div>
         )}
      </div>

      {/* PHẦN 2: CUỐN SỔ KỶ NIỆM */}
      <div 
        className={`transition-all duration-1000 transform z-10 
        ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90'}`}
      >
        <div className="bg-[#fdfbf7] w-[95vw] md:w-[900px] h-[85vh] md:h-[600px] shadow-2xl rounded-lg flex flex-col md:flex-row overflow-hidden relative border border-gray-300">
           
           {/* TRANG TRÁI: Ảnh */}
           <div className="w-full md:w-1/2 bg-[#eceff1] p-6 overflow-y-auto border-r border-gray-300 relative">
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-4 h-8 bg-red-800 rounded-b z-10 shadow-md"></div>
              {cardData.image_urls && cardData.image_urls.length > 0 ? (
                 <div className="flex flex-col gap-6 pt-4 pb-10">
                    {cardData.image_urls.map((img:string, i:number) => (
                       <div key={i} className={`bg-white p-3 shadow-lg transform transition hover:scale-105 hover:z-10 duration-300 ${i % 2 === 0 ? 'rotate-2' : '-rotate-2'}`}>
                          <img src={img} className="w-full h-auto object-cover rounded-sm border border-gray-100" />
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <p className="text-sm italic">Không có ảnh đính kèm</p>
                 </div>
              )}
           </div>

           {/* TRANG PHẢI: Lời chúc */}
           <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
              <div className="absolute top-4 right-6 text-8xl font-serif text-gray-200 select-none">❞</div>
              <div className="mt-6 z-10">
                  <p className="text-gray-500 text-xs mb-8 uppercase tracking-[0.2em] border-b border-gray-300 pb-2 inline-block">
                    Gửi đến {cardData.recipient_name}
                  </p>
                  
                  {/* DÒNG QUAN TRỌNG: Thêm class font-handwriting để áp dụng phông chữ mới */}
                  <div className="font-handwriting text-gray-800 text-3xl md:text-4xl leading-relaxed whitespace-pre-line font-medium">
                     {cardData.content}
                  </div>
              </div>
              <div className="mt-auto pt-8 border-t border-gray-300 flex justify-between items-center text-gray-400 text-xs">
                  <span>{new Date(cardData.created_at).toLocaleDateString('vi-VN')}</span>
                  <span className="italic">Vintage E-Card</span>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}