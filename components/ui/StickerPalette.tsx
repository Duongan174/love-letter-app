// components/ui/StickerPalette.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { supabase } from '@/lib/supabase';

interface Sticker {
  id: string;
  name: string;
  image_url: string;
  category: string;
  points_required: number;
}

interface StickerPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onStickerSelect: (sticker: Sticker) => void;
  userPoints: number;
}

// Draggable Sticker Component
function DraggableSticker({ 
  sticker, 
  canAfford, 
  onSelect 
}: { 
  sticker: Sticker;
  canAfford: boolean;
  onSelect: () => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'sticker-palette',
    item: { sticker },
    canDrag: canAfford,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.button
      ref={drag as any}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: isDragging ? 0.9 : 1 }}
      whileHover={{ scale: canAfford ? 1.05 : 1 }}
      whileTap={{ scale: canAfford ? 0.95 : 1 }}
      onClick={onSelect}
      disabled={!canAfford}
      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
        canAfford
          ? 'border-gold/30 hover:border-burgundy cursor-move'
          : 'border-ink/20 opacity-50 cursor-not-allowed'
      }`}
    >
      <img
        src={sticker.image_url}
        alt={sticker.name}
        className="w-full h-full object-cover"
      />
      {!canAfford && (
        <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
          <span className="text-xs text-cream font-bold">
            💜 {sticker.points_required}
          </span>
        </div>
      )}
      {canAfford && sticker.points_required > 0 && (
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-burgundy/80 rounded text-xs text-cream font-bold">
          💜 {sticker.points_required}
        </div>
      )}
    </motion.button>
  );
}

export default function StickerPalette({
  isOpen,
  onClose,
  onStickerSelect,
  userPoints,
}: StickerPaletteProps) {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchStickers();
    }
  }, [isOpen]);

  const fetchStickers = async () => {
    try {
      const { data } = await supabase
        .from('stickers')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      setStickers(data || []);
    } catch (error) {
      console.error('Error fetching stickers:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(stickers.map(s => s.category)))];

  const filteredStickers = selectedCategory === 'all'
    ? stickers
    : stickers.filter(s => s.category === selectedCategory);

  const handleStickerClick = (sticker: Sticker) => {
    if (userPoints >= sticker.points_required) {
      onStickerSelect(sticker);
    } else {
      alert(`Bạn cần ${sticker.points_required} Tym để sử dụng sticker này!`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40"
          />

          {/* Palette */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cream-light border-l border-gold/20 shadow-vintage z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-burgundy/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-burgundy" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-ink">Sticker</h2>
                    <p className="text-xs text-ink/50">Kéo thả vào thư</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gold/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-ink/50" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-vn whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-burgundy text-cream'
                        : 'bg-cream text-ink/70 hover:bg-gold/10'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stickers Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredStickers.length === 0 ? (
                <div className="text-center py-20">
                  <Sparkles className="w-16 h-16 text-ink/20 mx-auto mb-4" />
                  <p className="text-ink/50 font-vn">Chưa có sticker nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {filteredStickers.map((sticker) => {
                    const canAfford = userPoints >= sticker.points_required;
                    return (
                      <DraggableSticker
                        key={sticker.id}
                        sticker={sticker}
                        canAfford={canAfford}
                        onSelect={() => handleStickerClick(sticker)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

