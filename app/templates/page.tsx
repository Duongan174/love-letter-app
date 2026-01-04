// app/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star, Crown, Search, Loader2, Play, ArrowRight, Feather, Filter, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
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
interface Category {
  id: string;
  name: string;
  label: string;
  emoji: string;
  display_order: number;
  is_active: boolean;
  parent_id?: string | null;
  parent?: {
    id: string;
    name: string;
    label: string;
    emoji: string;
  } | null;
  subcategories?: Category[];
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // FETCH TEMPLATES & CATEGORIES
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

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch categories');
        }
        const { data } = await res.json();
        setCategories(data || []);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        // Set empty array on error to prevent UI crashes
        setCategories([]);
      }
    };

    fetchTemplates();
    fetchCategories();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────────────────────────────────────
const handleSelectTemplate = async (templateId: string) => {
  // Nếu chưa login: giữ hành vi cũ để create page tự redirect auth
  const { data } = await supabase.auth.getSession();
  if (!data?.session) {
    router.push(`/create?templateId=${templateId}`);
    return;
  }

  // Nếu đã login: tạo draft ngay để wizard auto-save
  const res = await fetch('/api/card-drafts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId }),
  });

  // ✅ Không dùng res.json() trực tiếp để tránh crash khi body rỗng / không phải JSON
  const raw = await res.text();

  let json: any = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    // server có thể trả HTML/empty -> cứ fallback
  }

  if (!res.ok) {
    // fallback về flow cũ cho chắc
    router.push(`/create?templateId=${templateId}`);
    return;
  }

  const draftId = json?.data?.id;
  if (!draftId) {
    router.push(`/create?templateId=${templateId}`);
    return;
  }

  router.push(`/create?draftId=${draftId}`);
}; // ✅ QUAN TRỌNG: đóng function ở đây



  // ─────────────────────────────────────────────────────────────────────────────
  // FILTERED TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  const filteredTemplates = templates.filter(t => {
    let matchCategory = false;
    if (activeCategory === 'all') {
      matchCategory = true;
    } else {
      // Check if it matches the selected category (parent or subcategory)
      matchCategory = t.category === activeCategory;
      // Also include subcategories when parent is selected
      if (!matchCategory) {
        const selectedParent = categories.find(c => c.name === activeCategory && !c.parent_id);
        if (selectedParent?.subcategories) {
          matchCategory = selectedParent.subcategories.some(sub => sub.name === t.category);
        }
      }
    }
    return matchCategory;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col h-screen bg-cream overflow-hidden">
      {/* Header và Hero section - không co giãn (flex-shrink-0) */}
      <div className="flex-shrink-0 z-10">
        <Header />

        {/* ═══════════════════════════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════════════════════════════ */}
        <section className="relative py-12 bg-vintage-gradient overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-3xl text-gold/20 font-serif">❧</div>
        <div className="absolute top-4 right-4 text-3xl text-gold/20 font-serif rotate-90">❧</div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-script text-2xl text-gold mb-2 block">
              Bộ sưu tập
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-2">
              Mẫu Thiệp <span className="text-burgundy">Độc Đáo</span>
            </h1>
            <OrnamentDivider className="max-w-md mx-auto mb-4" />
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
              Chọn một thiết kế ưng ý để bắt đầu hành trình gửi gắm yêu thương. 
              Mỗi mẫu thiệp đều được thiết kế tỉ mỉ với phong cách vintage sang trọng.
            </p>
          </motion.div>
        </div>
      </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTENT WITH SIDEBAR - Sử dụng flex-1 để tự động lấp đầy
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 gap-6 max-w-full mx-auto px-4 pt-4 pb-0 overflow-hidden w-full">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 p-2 bg-burgundy text-cream-light rounded-lg shadow-lg hover:bg-burgundy-dark transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-ink/50 backdrop-blur-sm z-40"
          />
        )}

        {/* Sidebar - Category Filters */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen || isDesktop ? 0 : '-100%',
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`
            fixed lg:relative lg:block left-0 top-0 
            h-full
            w-64 flex-shrink-0 z-40 lg:z-auto
            bg-cream-light lg:bg-transparent
            overflow-y-auto
            ${sidebarOpen ? 'shadow-2xl' : 'lg:shadow-none'}
          `}
        >
          <div className="bg-cream-light rounded-xl p-4 border border-gold/20 shadow-sm mb-4 lg:sticky lg:top-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-ink text-sm uppercase tracking-wide">
                Danh mục
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gold/10 rounded transition"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4 text-ink/60" />
              </button>
            </div>
            
            {/* All category */}
            <motion.button
              onClick={() => {
                setActiveCategory('all');
                setSidebarOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-2 px-3 py-2.5 rounded-lg mb-2
                font-vn text-sm font-medium transition-all duration-300
                ${activeCategory === 'all'
                  ? 'bg-burgundy text-cream-light shadow-vintage' 
                  : 'bg-cream text-ink/70 border border-gold/30 hover:border-gold hover:text-burgundy hover:bg-gold/10'
                }
              `}
            >
              <Sparkles className="w-4 h-4" />
              Tất cả
            </motion.button>
            
            {/* Parent categories from API */}
            <div className="space-y-1">
              {categories
                .filter(cat => !cat.parent_id)
                .sort((a, b) => a.display_order - b.display_order)
                .map((parentCat) => {
                  const isActive = activeCategory === parentCat.name;
                  const hasSubcategories = parentCat.subcategories && parentCat.subcategories.length > 0;
                  const isExpanded = expandedParents.has(parentCat.id) || isActive;
                  const showSubcategories = isExpanded && hasSubcategories;
                  
                  return (
                    <div key={parentCat.id} className="mb-1">
                      <motion.button
                        onClick={() => {
                          if (hasSubcategories) {
                            setExpandedParents(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(parentCat.id)) {
                                newSet.delete(parentCat.id);
                              } else {
                                newSet.add(parentCat.id);
                              }
                              return newSet;
                            });
                          }
                          setActiveCategory(parentCat.name);
                          setSidebarOpen(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          w-full flex items-center gap-2 px-3 py-2.5 rounded-lg
                          font-vn text-sm font-medium transition-all duration-300
                          ${isActive 
                            ? 'bg-burgundy text-cream-light shadow-vintage' 
                            : 'bg-cream text-ink/70 border border-gold/30 hover:border-gold hover:text-burgundy hover:bg-gold/10'
                          }
                        `}
                      >
                        <span className="text-base">{parentCat.emoji}</span>
                        <span className="flex-1 text-left">{parentCat.label}</span>
                        {hasSubcategories && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.button>
                      
                      {/* Subcategories (animated) */}
                      <AnimatePresence>
                        {showSubcategories && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 ml-4 space-y-1 pl-4 border-l-2 border-gold/30">
                              {parentCat.subcategories
                                ?.sort((a, b) => a.display_order - b.display_order)
                                .map((subCat, index) => {
                                  const isSubActive = activeCategory === subCat.name;
                                  return (
                                    <motion.button
                                      key={subCat.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      onClick={() => {
                                        setActiveCategory(subCat.name);
                                        setSidebarOpen(false);
                                      }}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className={`
                                        w-full flex items-center gap-2 px-3 py-2 rounded-lg
                                        font-vn text-xs font-medium transition-all duration-300
                                        ${isSubActive 
                                          ? 'bg-burgundy/80 text-cream-light shadow-vintage' 
                                          : 'bg-cream/80 text-ink/70 border border-gold/20 hover:border-gold hover:text-burgundy hover:bg-gold/10'
                                        }
                                      `}
                                    >
                                      <span className="text-sm">{subCat.emoji}</span>
                                      <span className="flex-1 text-left">{subCat.label}</span>
                                    </motion.button>
                                  );
                                })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.aside>

        {/* Main Content - Templates Grid */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto pb-20 pr-2">
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full border-4 border-gold/30 border-t-burgundy animate-spin mb-4" />
              <p className="font-elegant text-ink/60">Đang tải mẫu thiệp...</p>
            </div>
          ) : filteredTemplates.length > 0 ? (
            /* Templates Grid */
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
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
                    <div className="relative aspect-[3/4] overflow-hidden bg-cream">
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
          </motion.div>
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
              Thử thay đổi danh mục để xem các mẫu thiệp khác.
            </p>
            <Button 
              variant="secondary"
              onClick={() => setActiveCategory('all')}
            >
              Xem tất cả mẫu
            </Button>
          </div>
        )}
        </main>
      </div>

    </div>
  );
}