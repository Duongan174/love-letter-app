// components/create/Step1Template.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, Crown } from 'lucide-react';
import { CardTemplate } from '@/hooks/useCreateCard';

interface Step1TemplateProps {
  selectedId: string | null;
  onSelect: (template: CardTemplate) => void;
}

// Mock templates - sẽ thay bằng data từ Supabase sau
const mockTemplates: CardTemplate[] = [
  {
    id: '1',
    name: 'Tình Yêu Lãng Mạn',
    thumbnail: '/templates/romantic.jpg',
    category: 'love',
    animation_type: 'fade',
    tym_cost: 0, // Free for testing
    is_premium: false,
  },
  {
    id: '2',
    name: 'Hoa Hồng Đỏ',
    thumbnail: '/templates/roses.jpg',
    category: 'love',
    animation_type: 'slide',
    tym_cost: 0,
    is_premium: false,
  },
  {
    id: '3',
    name: 'Bầu Trời Sao',
    thumbnail: '/templates/stars.jpg',
    category: 'love',
    animation_type: 'sparkle',
    tym_cost: 0,
    is_premium: true,
  },
  {
    id: '4',
    name: 'Vintage Classic',
    thumbnail: '/templates/vintage.jpg',
    category: 'classic',
    animation_type: 'fade',
    tym_cost: 0,
    is_premium: false,
  },
  {
    id: '5',
    name: 'Sinh Nhật Vui Vẻ',
    thumbnail: '/templates/birthday.jpg',
    category: 'birthday',
    animation_type: 'bounce',
    tym_cost: 0,
    is_premium: false,
  },
  {
    id: '6',
    name: 'Anniversary',
    thumbnail: '/templates/anniversary.jpg',
    category: 'anniversary',
    animation_type: 'zoom',
    tym_cost: 0,
    is_premium: true,
  },
];

const categories = [
  { id: 'all', name: 'Tất cả', icon: Sparkles },
  { id: 'love', name: 'Tình yêu', icon: Heart },
  { id: 'birthday', name: 'Sinh nhật', icon: Star },
  { id: 'classic', name: 'Cổ điển', icon: Crown },
];

export default function Step1Template({ selectedId, onSelect }: Step1TemplateProps) {
  const [templates, setTemplates] = useState<CardTemplate[]>(mockTemplates);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Filter templates by category
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Chọn mẫu thiệp
        </h2>
        <p className="text-gray-600">
          Lựa chọn mẫu thiệp phù hợp với thông điệp của bạn
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                ${isActive 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                  : 'bg-white text-gray-600 hover:bg-rose-50 border border-gray-200'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredTemplates.map((template, index) => {
          const isSelected = selectedId === template.id;
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(template)}
              className={`
                relative cursor-pointer rounded-2xl overflow-hidden
                transition-all duration-300 group
                ${isSelected 
                  ? 'ring-4 ring-rose-500 shadow-xl shadow-rose-200' 
                  : 'hover:shadow-lg hover:-translate-y-1'
                }
              `}
            >
              {/* Thumbnail */}
              <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-pink-100 relative">
                {/* Placeholder - replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Heart 
                      className={`w-12 h-12 mx-auto mb-2 ${isSelected ? 'text-rose-500' : 'text-rose-300'}`} 
                      fill="currentColor" 
                    />
                    <p className="text-sm font-medium text-gray-600">{template.name}</p>
                  </div>
                </div>
                
                {/* Premium Badge */}
                {template.is_premium && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-white text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </div>
                )}
                
                {/* Selected Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
                
                {/* Hover Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity
                  flex items-end p-4
                `}>
                  <div className="text-white">
                    <p className="font-semibold">{template.name}</p>
                    <p className="text-sm text-white/80">
                      {template.tym_cost === 0 ? 'Miễn phí' : `${template.tym_cost} Tym`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-white">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {template.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500 capitalize">
                    {template.animation_type}
                  </span>
                  <span className={`text-xs font-bold ${template.tym_cost === 0 ? 'text-green-600' : 'text-rose-600'}`}>
                    {template.tym_cost === 0 ? 'Miễn phí' : `💜 ${template.tym_cost}`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Không tìm thấy mẫu thiệp nào</p>
        </div>
      )}
    </div>
  );
}
