// app/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star, Crown, Search, Loader2, Play, ArrowRight, Feather, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  points_required: number;
  is_premium: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const categories = [
  { id: 'all', name: 'Tất cả', icon: Sparkles },
  { id: 'love', name: 'Tình yêu', icon: Heart },
  { id: 'birthday', name: 'Sinh nhật', icon: Star },
  { id: 'classic', name: 'Cổ điển', icon: Crown },
];

const isVideo = (url: string) => url?.match(/\.(mp4|webm)$/i);

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const OrnamentDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    <Feather className="w-4 h-4 text-gold/60" />
    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // FETCH TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSelectTemplate = (templateId: string) => {
    router.push(`/create?templateId=${templateId}`);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTERED TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  const filteredTemplates = templates.filter(t => {
    const matchCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-cream pb-20">
      <Header />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 bg-vintage-gradient overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-3xl text-gold/20 font-serif">❧</div>
        <div className="absolute top-4 right-4 text-3xl text-gold/20 font-serif rotate-90">❧</div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-script text-2xl text-gold mb-4 block">
              Bộ sưu tập
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4">
              Mẫu Thiệp <span className="text-burgundy">Độc Đáo</span>
            </h1>
            <OrnamentDivider className="max-w-md mx-auto mb-6" />
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
              Chọn một thiết kế ưng ý để bắt đầu hành trình gửi gắm yêu thương. 
              Mỗi mẫu thiệp đều được thiết kế tỉ mỉ với phong cách vintage sang trọng.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FILTERS & SEARCH
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-16 z-30 bg-cream-light/95 backdrop-blur-sm border-b border-gold/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                      font-display text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-burgundy text-cream-light shadow-vintage' 
                        : 'bg-cream text-ink/70 border border-gold/30 hover:border-gold hover:text-burgundy'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input 
                type="text" 
                placeholder="Tìm kiếm mẫu thiệp..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-vintage pl-10 py-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TEMPLATES GRID
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full border-4 border-gold/30 border-t-burgundy animate-spin mb-4" />
            <p className="font-elegant text-ink/60">Đang tải mẫu thiệp...</p>
          </div>
        ) : filteredTemplates.length > 0 ? (
          /* Templates Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredId(template.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group"
                >
                  <div className="relative bg-cream-light border border-gold/20 rounded-soft overflow-hidden shadow-vintage hover:shadow-elevated hover:border-gold/40 transition-all duration-500">
                    
                    {/* Premium Badge */}
                    {template.is_premium && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-gold text-cream-light text-xs font-display tracking-wider rounded-full shadow-lg">
                        <Crown className="w-3 h-3" />
                        PREMIUM
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                      {isVideo(template.thumbnail) ? (
                        <>
                          <video
                            src={template.thumbnail}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            autoPlay={hoveredId === template.id}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-ink/20 group-hover:bg-transparent transition-colors">
                            <div className="w-12 h-12 rounded-full bg-cream-light/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 text-burgundy ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                        <Button 
                          variant="gold" 
                          size="sm"
                          icon={<ArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                          onClick={() => handleSelectTemplate(template.id)}
                          className="w-full"
                        >
                          Chọn mẫu này
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 border-t border-gold/10">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-semibold text-ink group-hover:text-burgundy transition-colors">
                            {template.name}
                          </h3>
                          <p className="font-elegant text-sm text-ink/50 capitalize">
                            {template.category}
                          </p>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-burgundy/10 rounded-full">
                          <span className="text-burgundy">💜</span>
                          <span className="font-display font-semibold text-burgundy text-sm">
                            {template.points_required || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-burgundy/10 border-2 border-burgundy/20 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-burgundy/40" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-3">
              Không tìm thấy mẫu thiệp
            </h3>
            <OrnamentDivider className="max-w-[200px] mb-4" />
            <p className="font-body text-ink/60 max-w-md mb-6">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem các mẫu thiệp khác.
            </p>
            <Button 
              variant="secondary"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              Xem tất cả mẫu
            </Button>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="relative p-8 md:p-12 bg-burgundy rounded-soft overflow-hidden text-center">
          {/* Decorative */}
          <div className="absolute top-4 left-4 text-3xl text-gold/20 font-serif">❧</div>
          <div className="absolute bottom-4 right-4 text-3xl text-gold/20 font-serif rotate-180">❧</div>
          
          <span className="font-script text-xl text-gold mb-3 block">
            Bạn có ý tưởng riêng?
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-cream-light mb-4">
            Tạo thiệp từ đầu với sáng tạo của bạn
          </h2>
          <p className="font-body text-cream-light/70 max-w-lg mx-auto mb-6">
            Nếu không tìm thấy mẫu ưng ý, bạn có thể bắt đầu với một khung thiệp trống 
            và tự do sáng tạo theo phong cách riêng.
          </p>
          <Button 
            variant="gold" 
            size="lg"
            icon={<Sparkles className="w-5 h-5" />}
            onClick={() => router.push('/create')}
          >
            Tạo Thiệp Tùy Chỉnh
          </Button>
        </div>
      </section>
    </div>
  );
}