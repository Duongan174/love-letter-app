'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface CardContentProps {
  card: {
    recipient_name: string;
    sender_name: string;
    message: string;
    font_style: string;
    text_effect: string;
    photos: string[];
    signature_url: string | null;
  };
}

export default function CardContent({ card }: CardContentProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showPhotos, setShowPhotos] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (card.text_effect === 'typewriter') {
      let i = 0;
      const timer = setInterval(() => {
        if (i < card.message.length) {
          setDisplayedText(card.message.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          setShowPhotos(true);
          setTimeout(() => setShowSignature(true), 500);
        }
      }, 50);
      return () => clearInterval(timer);
    } else {
      setDisplayedText(card.message);
      setTimeout(() => setShowPhotos(true), 1000);
      setTimeout(() => setShowSignature(true), 1500);
    }
  }, [card.message, card.text_effect]);

  const getFontClass = () => {
    switch (card.font_style) {
      case 'dancing': return 'font-dancing';
      case 'playfair': return 'font-playfair';
      case 'pacifico': return 'font-pacifico';
      default: return 'font-lexend';
    }
  };

  const getTextAnimation = () => {
    switch (card.text_effect) {
      case 'fade':
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 2 } };
      case 'slide':
        return { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 } };
      case 'glow':
        return { 
          initial: { opacity: 0 }, 
          animate: { opacity: 1, textShadow: ['0 0 0px #fff', '0 0 20px #f43f5e', '0 0 0px #fff'] },
          transition: { duration: 2, textShadow: { repeat: Infinity, duration: 2 } }
        };
      default:
        return { initial: { opacity: 1 }, animate: { opacity: 1 } };
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="w-full flex justify-center"
    >
      {/* Card */}
      <div 
        className="bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto"
        style={{
          width: '1080px',
          height: '1440px',
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 100px)',
          aspectRatio: '1080 / 1440',
        }}
      >
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500" />
        
        <div className="p-6 md:p-8">
          {/* Recipient */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-gray-500 text-sm">Gửi đến</p>
            <p className={`text-2xl text-rose-600 font-bold ${getFontClass()}`}>
              {card.recipient_name}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1" />
            <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
            <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1" />
          </div>

          {/* Message */}
          <motion.div
            {...getTextAnimation()}
            className={`text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap mb-6 ${getFontClass()}`}
          >
            {card.text_effect === 'typewriter' ? displayedText : card.message}
            {card.text_effect === 'typewriter' && displayedText.length < card.message.length && (
              <span className="animate-pulse">|</span>
            )}
          </motion.div>

          {/* Photos */}
          {showPhotos && card.photos && card.photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`grid gap-2 mb-6 ${
                card.photos.length === 1 ? 'grid-cols-1' :
                card.photos.length === 2 ? 'grid-cols-2' :
                'grid-cols-2'
              }`}
            >
              {card.photos.map((photo, index) => (
                <motion.img
                  key={index}
                  src={photo}
                  alt={`Ảnh ${index + 1}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="w-full h-32 md:h-40 object-cover rounded-xl shadow-md"
                />
              ))}
            </motion.div>
          )}

          {/* Signature */}
          {showSignature && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-right mt-6"
            >
              <p className="text-gray-500 text-sm">Yêu thương,</p>
              {card.signature_url ? (
                <img 
                  src={card.signature_url} 
                  alt="Chữ ký" 
                  className="max-w-[150px] h-auto ml-auto"
                />
              ) : (
                <p className={`text-xl text-rose-600 font-bold ${getFontClass()}`}>
                  {card.sender_name}
                </p>
              )}
            </motion.div>
          )}

          {/* Footer decoration */}
          <div className="flex justify-center gap-2 mt-8 text-rose-300">
            <Heart className="w-4 h-4" fill="currentColor" />
            <Heart className="w-5 h-5" fill="currentColor" />
            <Heart className="w-4 h-4" fill="currentColor" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
