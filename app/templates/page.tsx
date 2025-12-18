// app/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star, Crown, Search, Loader2, Play, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

// Types
interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  points_required: number;
  is_premium: boolean;
}

const categories = [
  { id: 'all', name: 'Tất cả', icon: Sparkles },
  { id: 'love', name: 'Tình yêu', icon: Heart },
  { id: 'birthday', name: 'Sinh nhật', icon: Star },
  { id: 'classic', name: 'Cổ điển', icon: Crown },
];

const isVideo = (url: string) => url?.match(/\.(mp4|webm)$/i);

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('card_templates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (templateId: string) => {
    // Chuyển hướng sang trang Create kèm ID mẫu
    router.push(`/create?templateId=${templateId}`);
  };

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Kho Mẫu Thiệp <span className="text-rose-500">Độc Đáo</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Chọn một thiết kế ưng ý để bắt đầu hành trình gửi gắm yêu thương.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all
                ${activeCategory === cat.id 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                  : 'bg-white text-gray-600 hover:bg-rose-50 border border-gray-200'
                }
              `}
            >
              <cat.icon className="w-4 h-4" /> {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-rose-500 w-10 h-10" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template, index) => {
              const isVid = isVideo(template.thumbnail);
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Media */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                    {template.thumbnail ? (
                      isVid ? (
                        <video 
                          src={template.thumbnail}
                          autoPlay muted loop playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-rose-200">
                        <Heart className="w-12 h-12" />
                      </div>
                    )}

                    {/* Premium Badge */}
                    {template.is_premium && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex gap-1 z-10 shadow-sm">
                        <Crown className="w-3 h-3" /> PREMIUM
                      </div>
                    )}

                    {/* Overlay Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <Button 
                        onClick={() => handleSelectTemplate(template.id)}
                        className="w-full bg-white text-rose-600 hover:bg-rose-50 font-bold shadow-lg"
                      >
                        Tạo Thiệp Ngay
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 truncate mb-1">{template.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm font-bold text-rose-500">
                        {template.points_required === 0 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          <>
                            <Heart className="w-3 h-3 fill-current" />
                            {template.points_required} Tym
                          </>
                        )}
                      </div>
                      <button 
                        onClick={() => handleSelectTemplate(template.id)}
                        className="text-gray-400 hover:text-rose-500 transition"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}