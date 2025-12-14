'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Volume2, VolumeX, Share2, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import EnvelopeAnimation from '@/components/card/EnvelopeAnimation';
import CardContent from '@/components/card/CardContent';

interface CardData {
  id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  font_style: string;
  text_effect: string;
  photos: string[];
  signature_url: string | null;
  envelope_color: string;
  stamp_image: string;
  music_url: string | null;
  template_id: string;
  view_count: number;
}

export default function CardViewPage() {
  const params = useParams();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!params.id) return;

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        setError('Không tìm thấy thiệp');
        setLoading(false);
        return;
      }

      setCard(data);
      setLoading(false);

      // Increment view count
      await supabase.rpc('increment_view_count', { card_id: params.id });
    };

    fetchCard();
  }, [params.id]);

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    setIsMuted(false);
  };

  const handleReplay = () => {
    setIsOpened(false);
    setIsMuted(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'Thiệp yêu thương', url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Đã copy link!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Heart className="w-12 h-12 text-rose-500" fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy thiệp</h1>
          <p className="text-gray-600">Thiệp không tồn tại hoặc đã bị xóa</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 50 
            }}
            animate={{ 
              y: -50,
              x: Math.random() * window.innerWidth 
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5 
            }}
          >
            <Heart className="w-6 h-6" fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Music Player */}
      {card.music_url && (
        <audio
          src={card.music_url}
          autoPlay={!isMuted && isOpened}
          loop
          muted={isMuted}
        />
      )}

      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {card.music_url && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-gray-600" /> : <Volume2 className="w-5 h-5 text-rose-500" />}
          </button>
        )}
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
        >
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
        {isOpened && (
          <button
            onClick={handleReplay}
            className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            <EnvelopeAnimation
              key="envelope"
              color={card.envelope_color}
              stamp={card.stamp_image}
              recipientName={card.recipient_name}
              onOpen={handleOpenEnvelope}
            />
          ) : (
            <CardContent
              key="card"
              card={card}
            />
          )}
        </AnimatePresence>
      </div>

      {/* View Count */}
      <div className="fixed bottom-4 left-4 text-sm text-gray-400">
        👁 {card.view_count || 0} lượt xem
      </div>
    </main>
  );
}