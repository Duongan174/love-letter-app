// app/card/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope3D from '@/components/create/Envelope3D';
import { ChevronRight, ChevronLeft, Heart, X, Sparkles } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { supabase } from '@/lib/supabase';

type ViewData = {
  templateUrl: string | null;
  photoUrl: string | null;
  pages: string[];
  signature: string | null;
  wish: string | null;
  envelope_color: string;
  stamp_url: string | null;
  texture: string | null;
};

function splitToPages(content: string): string[] {
  const blocks = content
    .split(/\n{2,}/g)
    .map(s => s.trim())
    .filter(Boolean);

  if (blocks.length > 0) return blocks;

  return content
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
}

export default function CardViewPage({ params }: { params: { id: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [data, setData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const { data: card, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !card) {
        setData(null);
        setLoading(false);
        return;
      }

      // fetch related (minimal, tránh phụ thuộc join)
      const [tplRes, envRes, stampRes] = await Promise.all([
        card.template_id
          ? supabase.from('card_templates').select('thumbnail,preview_url').eq('id', card.template_id).single()
          : Promise.resolve({ data: null as any }),
        card.envelope_id
          ? supabase.from('envelopes').select('color,texture').eq('id', card.envelope_id).single()
          : Promise.resolve({ data: null as any }),
        card.stamp_id
          ? supabase.from('stamps').select('image_url').eq('id', card.stamp_id).single()
          : Promise.resolve({ data: null as any }),
      ]);

      const templateUrl =
        tplRes.data?.preview_url ||
        tplRes.data?.thumbnail ||
        null;

      const photoUrl = Array.isArray(card.photos) && card.photos.length > 0 ? card.photos[0] : null;

      setData({
        templateUrl,
        photoUrl,
        pages: splitToPages(card.content || ''),
        signature: card.sender_name || null,
        wish: null,
        envelope_color: envRes.data?.color || card.envelope_color || '#f8b4c4',
        stamp_url: stampRes.data?.image_url || null,
        texture: envRes.data?.texture || null,
      });

      setLoading(false);
    };

    run().catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <Loading text="Đang mở thiệp..." />;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy thiệp</p>
          <p className="text-gray-600">Link có thể sai hoặc thiệp chưa được publish.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 flex items-center justify-center">
      {/* Envelope */}
      <div className="max-w-lg w-full">
        <div className="relative">
          <Envelope3D
            color={data.envelope_color}
            texture={data.texture}
            stampUrl={data.stamp_url}
            isOpen={isOpen}
          />

          {!isOpen && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="px-6 py-3 rounded-2xl bg-white/80 backdrop-blur border border-rose-100 shadow text-rose-600 font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Mở thư
              </span>
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && !isReading && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="mt-6 text-center"
            >
              <button
                onClick={() => setIsReading(true)}
                className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition flex items-center justify-center gap-2 w-full"
              >
                <Heart className="w-5 h-5" />
                Đọc thư
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReading && (
            <ReaderModal
              data={data}
              onClose={() => {
                setIsReading(false);
                setIsOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReaderModal({ data, onClose }: { data: ViewData; onClose: () => void }) {
  const [page, setPage] = useState(0);

  const contentPages = data.pages || [];
  const hasPhoto = !!data.photoUrl;

  // 0 = cover, 1 = photo (optional), 2.. = content, last = signature
  const totalPages = 1 + (hasPhoto ? 1 : 0) + contentPages.length + 1;

  const nextPage = () => setPage(p => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setPage(p => Math.max(0, p - 1));

  const renderPage = () => {
    // cover
    if (page === 0) {
      return (
        <div className="h-full flex items-center justify-center text-center p-8">
          <div>
            <p className="text-3xl font-bold text-rose-600 mb-2">With Love</p>
            <p className="text-gray-600">Vuốt / bấm để đọc</p>
          </div>
        </div>
      );
    }

    // photo
    if (hasPhoto && page === 1) {
      return (
        <div className="h-full p-6 flex items-center justify-center">
          <img src={data.photoUrl!} className="max-h-full max-w-full rounded-2xl shadow object-cover" />
        </div>
      );
    }

    // content pages
    const contentIndex = page - 1 - (hasPhoto ? 1 : 0);
    if (contentIndex >= 0 && contentIndex < contentPages.length) {
      return (
        <div className="h-full p-8 flex items-center justify-center">
          <p className="text-lg leading-relaxed text-gray-800 text-center whitespace-pre-wrap">
            {contentPages[contentIndex]}
          </p>
        </div>
      );
    }

    // signature
    return (
      <div className="h-full p-8 flex items-center justify-center text-center">
        <div>
          <p className="text-gray-600 mb-3">Thân ái,</p>
          <p className="text-3xl font-bold text-rose-600">{data.signature || '❤️'}</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.96, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 24 }}
        className="w-full max-w-2xl h-[80vh] bg-white rounded-3xl shadow-xl overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-full">{renderPage()}</div>

        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className="w-12 h-12 rounded-full bg-white shadow border disabled:opacity-50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-4 py-2 rounded-full bg-white shadow border text-sm text-gray-700">
            {page + 1} / {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === totalPages - 1}
            className="w-12 h-12 rounded-full bg-white shadow border disabled:opacity-50 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
