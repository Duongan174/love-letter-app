// app/card/[id]/page.tsx
'use client';

import { useState, useEffect, use, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope2D, { type SealDesign } from '@/components/create/Envelope2D';
import { ChevronRight, ChevronLeft, Heart, X, Sparkles, RotateCw, Volume2, VolumeX, Music, Pause, Play } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { supabase } from '@/lib/supabase';
import { splitLetterPages, LETTER_PAGE_BREAK_TOKEN } from '@/hooks/useCreateCard';
import { resolveImageUrl } from '@/lib/utils';

// ✅ Import pattern styles từ hệ thống mới (100+ patterns)
import { 
  LETTER_PATTERNS,
  getLetterPatternStyle as getPatternStyleFromPreset,
} from '@/lib/design-presets';

// ✅ Import font loader để load fonts khi xem thiệp
import { ensureFontsLoaded } from '@/lib/font-loader';
import { getAllFonts, type FontId } from '@/lib/font-registry';

/**
 * Component to render HTML content with proper font-family support
 * ✅ Load fonts on-demand từ HTML và apply styles
 */
function ContentWithFonts({ html, className, style, usedFonts }: { 
  html: string; 
  className?: string; 
  style?: React.CSSProperties;
  usedFonts?: FontId[]; // ✅ Fonts đã được lưu từ DB
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Load fonts khi component mount hoặc HTML thay đổi
  useEffect(() => {
    if (usedFonts && usedFonts.length > 0) {
      // Load fonts đã được lưu từ DB
      ensureFontsLoaded(usedFonts);
    } else if (html) {
      // Fallback: extract fonts từ HTML nếu không có usedFonts
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const spansWithFont = tempDiv.querySelectorAll('span[style*="font-family"]');
      
      const fontIds: FontId[] = [];
      spansWithFont.forEach((span) => {
        const htmlElement = span as HTMLElement;
        const styleAttr = htmlElement.getAttribute('style') || '';
        const fontMatch = styleAttr.match(/font-family:\s*([^;]+)/);
        
        if (fontMatch) {
          const fontValue = fontMatch[1].trim();
          const fontName = fontValue.split("'")[1] || fontValue.split('"')[1] || fontValue.split(',')[0].trim();
          
          // Tìm trong registry
          const foundFont = getAllFonts().find(f => 
            f.googleFamily === fontName || 
            fontValue.includes(f.googleFamily)
          );
          
          if (foundFont) {
            fontIds.push(foundFont.id);
          }
        }
      });
      
      if (fontIds.length > 0) {
        ensureFontsLoaded(fontIds);
      }
    }
  }, [html, usedFonts]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Find all spans with inline font-family style and force the style
    const spansWithFont = containerRef.current.querySelectorAll('span[style*="font-family"]');
    spansWithFont.forEach((span) => {
      const htmlElement = span as HTMLElement;
      const styleAttr = htmlElement.getAttribute('style') || '';
      const fontMatch = styleAttr.match(/font-family:\s*([^;]+)/);
      
      if (fontMatch) {
        // Extract the font value and apply it directly with !important
        const fontValue = fontMatch[1].trim().replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        htmlElement.style.setProperty('font-family', fontValue, 'important');
      }
    });
  }, [html]);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type ViewData = {
  templateUrl: string | null;
  templateAnimation: string | null;
  templateThumbnail: string | null;
  photos: string[]; // ✅ Đổi từ photoUrl thành photos array
  pages: string[];
  signature: string | null;
  wish: string | null;
  envelope_color: string;
  stamp_url: string | null;
  texture: string | null;
  envelope_pattern?: string | null;
  envelope_pattern_color?: string | null;
  envelope_pattern_intensity?: number | null;
  envelope_seal_design?: string | null;
  envelope_seal_color?: string | null;
  envelope_liner_pattern_type?: string | null;
  envelope_liner_color?: string | null;
  senderName: string;
  recipientName: string;
  message: string;
  richContent?: string | null;
  frameId?: string | null; // ✅ Backward compatibility
  photoSlots?: any; // ✅ Backward compatibility
  // ✅ Hỗ trợ nhiều frames - mỗi frame là một trang
  frames?: Array<{ frameId: string; photoSlots: Array<{ slotIndex: number; photoUrl: string; transform?: any }> }>;
  // ✅ Step 5: Music data
  musicId?: string | null;
  musicUrl?: string | null;
  musicName?: string | null;
  musicArtist?: string | null;
  // ✅ Step 3: Letter background/pattern
  letterBackground?: string;
  letterPattern?: string;
  // ✅ Step 2: Background colors cho các phần khác
  coverBackground?: string;
  coverPattern?: string;
  photoBackground?: string;
  photoPattern?: string;
  signatureBackground?: string;
  signaturePattern?: string;
  // ✅ Fonts đã sử dụng trong thiệp (để load on-demand)
  usedFonts?: FontId[];
};

export default function CardViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isOpen, setIsOpen] = useState(false); // Phong bì đóng ban đầu
  const [isReading, setIsReading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [data, setData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const { data: card, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (error || !card) {
        setData(null);
        setLoading(false);
        return;
      }

      // fetch related (minimal, tránh phụ thuộc join)
      const [tplRes, envRes, stampRes, musicRes] = await Promise.all([
        card.template_id
          ? supabase.from('card_templates').select('thumbnail,preview_url,animation_type').eq('id', card.template_id).single()
          : Promise.resolve({ data: null as any }),
        card.envelope_id
          ? supabase.from('envelopes').select('color,texture,pattern,liner_pattern').eq('id', card.envelope_id).single()
          : Promise.resolve({ data: null as any }),
        card.stamp_id
          ? supabase.from('stamps').select('image_url').eq('id', card.stamp_id).single()
          : Promise.resolve({ data: null as any }),
        // ✅ Step 5: Fetch music data
        card.music_id
          ? supabase.from('music').select('id,name,artist,url,src').eq('id', card.music_id).single()
          : Promise.resolve({ data: null as any }),
      ]);

      // ⚠️ CRITICAL: Template bắt buộc phải có preview_url hoặc thumbnail
      const templateUrl = tplRes.data?.preview_url || null;
      const templateThumbnail = tplRes.data?.thumbnail || null;
      const templateAnimation = tplRes.data?.animation_type || null;
      
      // Validate: Template bắt buộc phải có ít nhất preview_url hoặc thumbnail
      if (!templateUrl && !templateThumbnail) {
        console.error('Template missing: No preview_url or thumbnail found', {
          templateId: card.template_id,
          templateData: tplRes.data
        });
        setData(null);
        setLoading(false);
        return;
      }

      // Get all photos - handle both string and array formats
      let photos: string[] = [];
      if (card.photos) {
        if (Array.isArray(card.photos)) {
          photos = card.photos.filter((p: unknown): p is string => typeof p === 'string' && p.length > 0);
        } else if (typeof card.photos === 'string') {
          photos = [card.photos];
        }
      }

      // ✅ Sử dụng splitLetterPages để tách đúng số trang theo PAGE_BREAK_TOKEN
      // ✅ Ưu tiên rich_content nếu có (HTML), nếu không dùng content (plain text hoặc serialized pages)
      const contentToSplit = card.rich_content || card.content || '';
      const pages = splitLetterPages(contentToSplit);

      // ✅ Lấy chữ ký từ signature_data (base64) hoặc signature_url
      let signatureData: string | null = null;
      if (card.signature_data) {
        // Nếu là base64, giữ nguyên
        if (card.signature_data.startsWith('data:image')) {
          signatureData = card.signature_data;
        } else {
          // Nếu chỉ là base64 string, thêm prefix
          signatureData = `data:image/png;base64,${card.signature_data}`;
        }
      } else if (card.signature_url) {
        signatureData = card.signature_url;
      }

      // ✅ Step 5: Extract music URL from response
      const musicData = musicRes?.data;
      const musicUrl = musicData?.src || musicData?.url || null;

      setData({
        templateUrl,
        templateAnimation,
        templateThumbnail,
        photos, // ✅ Tất cả ảnh, không chỉ ảnh đầu tiên
        pages, // ✅ Số trang đúng theo PAGE_BREAK_TOKEN
        signature: signatureData || null, // ✅ Chỉ dùng signature image, không fallback sang sender_name
        wish: null,
        envelope_color: card.envelope_color || envRes.data?.color || '#f8b4c4', // ✅ Ưu tiên màu từ customization
        stamp_url: stampRes.data?.image_url || null,
        texture: envRes.data?.texture || null,
        envelope_pattern: card.envelope_pattern || envRes.data?.pattern || 'solid',
        envelope_pattern_color: card.envelope_pattern_color || '#5d4037',
        envelope_pattern_intensity: card.envelope_pattern_intensity ?? 0.15,
        envelope_seal_design: card.envelope_seal_design || 'heart',
        envelope_seal_color: card.envelope_seal_color || '#c62828',
        envelope_liner_pattern_type: card.envelope_liner_pattern_type || null,
        envelope_liner_color: card.envelope_liner_color || '#ffffff',
        senderName: card.sender_name || '',
        recipientName: card.recipient_name || '',
        message: card.content || '',
        richContent: card.rich_content || null, // ✅ Lấy rich_content nếu có
        frameId: card.frame_id || null, // ✅ Lấy frame_id nếu có
        photoSlots: card.photo_slots || null, // ✅ Lấy photo_slots nếu có
        // ✅ Step 5: Music data
        musicId: card.music_id || null,
        musicUrl: musicUrl,
        musicName: musicData?.name || null,
        musicArtist: musicData?.artist || null,
        // ✅ Step 3: Letter background/pattern
        letterBackground: card.letter_background || '#ffffff',
        letterPattern: card.letter_pattern || 'solid',
        // ✅ Step 2: Background colors cho các phần khác
        coverBackground: card.cover_background || '#fdf2f8',
        coverPattern: card.cover_pattern || 'solid',
        // ✅ Fonts đã sử dụng (từ DB hoặc extract từ HTML)
        usedFonts: (card.used_fonts as FontId[]) || undefined,
        photoBackground: card.photo_background || '#fff8e1',
        photoPattern: card.photo_pattern || 'solid',
        signatureBackground: card.signature_background || '#fce4ec',
        signaturePattern: card.signature_pattern || 'solid',
      });

      setLoading(false);
    };

    run().catch(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) return <Loading text="Đang mở thiệp..." />;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-rose-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi hiển thị thiệp</h2>
          <p className="text-gray-600 mb-4">
            Không thể tải thiệp. Có thể do:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Thiệp chưa có template animation hoặc template tĩnh</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Link thiệp không hợp lệ hoặc đã hết hạn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Thiệp chưa được publish</span>
            </li>
          </ul>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 flex items-center justify-center">
      {/* Envelope */}
      <div className="max-w-lg w-full">
        {/* ✅ Nút lật phong bì - chỉ hiển thị khi chưa đọc thư */}
        {!isReading && (
          <div className="flex justify-center mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-rose-200 rounded-full shadow-md text-rose-600 font-medium flex items-center gap-2 hover:bg-white hover:shadow-lg transition"
              title="Lật phong bì"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-sm">Lật mặt</span>
            </motion.button>
          </div>
        )}
        
        {/* ✅ Phong bì - đóng ban đầu, có thể mở */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative"
            style={{ perspective: '1200px' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isOpen) setIsOpen(true);
                else setIsReading(true);
              }
            }}
            onClick={() => {
              if (!isOpen) setIsOpen(true);
              else setIsReading(true);
            }}
          >
            <Envelope2D
              color={data.envelope_color}
              texture={data.texture}
              stampUrl={data.stamp_url}
              isOpen={isOpen}
              side={isFlipped ? 'back' : 'front'}
              pattern={data.envelope_pattern || 'solid'}
              patternColor={data.envelope_pattern_color ?? undefined}
              patternIntensity={data.envelope_pattern_intensity ?? 0.15}
              sealDesign={(data.envelope_seal_design || 'heart') as SealDesign}
              sealColor={data.envelope_seal_color || '#c62828'}
              // Seal click (mặt sau) cũng phải đồng bộ behavior
              onToggleOpen={() => {
                if (!isOpen) setIsOpen(true);
                else setIsReading(true);
              }}
            />
          </div>
          
          {/* Nút điều khiển */}
          {!isReading && (
            <div className="flex items-center gap-3">
              {!isOpen && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:from-rose-600 hover:to-pink-600 transition-all flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Mở thư</span>
                </button>
              )}
              {isOpen && (
                <button
                  onClick={() => setIsReading(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2"
                >
                  <span>Đọc thiệp</span>
                </button>
              )}
            </div>
          )}
        </div>

        <AnimatePresence>
          {isReading && (
            <ReaderModal
              data={data}
              onClose={() => {
                setIsReading(false);
                // ✅ Giữ phong bì mở khi đóng modal
              }}
            />
          )}
        </AnimatePresence>

        {/* ✅ Step 5: Music Player - hiển thị khi đọc thiệp và có nhạc */}
        <AnimatePresence>
          {isReading && data.musicUrl && (
            <MusicPlayer
              musicUrl={data.musicUrl}
              musicName={data.musicName}
              musicArtist={data.musicArtist}
              autoPlay={true}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * ✅ Step 4: Component để render photo với frame
 * Hiển thị tất cả ảnh trong frame với các vị trí slot tương ứng
 */
function FramePhotoViewer({ 
  frameId, 
  photoSlots,
}: { 
  frameId: string; 
  photoSlots: any[];
}) {
  const [frame, setFrame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFrame = async () => {
      try {
        const { data, error } = await supabase
          .from('photo_frames')
          .select('*')
          .eq('id', frameId)
          .single();
        
        if (error) throw error;
        setFrame(data);
      } catch (error) {
        console.error('Error loading frame:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (frameId) loadFrame();
  }, [frameId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!frame) {
    return <div className="text-gray-500 text-center">Không tìm thấy khuôn ảnh</div>;
  }

  // Lấy tất cả frame slots từ database
  const frameSlots = frame.photo_slots || [];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-full"
      style={{ 
        width: '100%',
        maxHeight: '100vh',
      }}
    >
      {/* Frame Image */}
      <img
        src={resolveImageUrl(frame.frame_image_url) || ''}
        alt={frame.name}
        className="w-full h-auto"
        style={{ aspectRatio: 'auto' }}
      />
      
      {/* Render all photos in their slots */}
      {frameSlots.map((frameSlot: any, index: number) => {
        // Tìm photo data cho slot này
        const photoData = photoSlots?.find((s: any) => s.slotIndex === index);
        
        if (!photoData?.photoUrl) {
          return null; // Skip empty slots
        }

        return (
          <div
            key={index}
            className="absolute overflow-hidden rounded-sm"
            style={{
              left: `${frameSlot.x}%`,
              top: `${frameSlot.y}%`,
              width: `${frameSlot.width}%`,
              height: `${frameSlot.height}%`,
              transform: frameSlot.rotation ? `rotate(${frameSlot.rotation}deg)` : undefined,
              zIndex: frameSlot.zIndex || 10,
            }}
          >
            <img
              src={photoData.photoUrl}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
              style={{
                transform: photoData.transform 
                  ? `scale(${photoData.transform.scale || 1}) translate(${photoData.transform.x || 0}px, ${photoData.transform.y || 0}px)`
                  : undefined,
                transformOrigin: 'center center',
              }}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

/**
 * ✅ Step 4: Component để render single photo khi có frame
 * Hiển thị 1 photo cụ thể trong frame
 */
function SinglePhotoInFrame({ 
  frameId, 
  photoSlots,
  photoIndex 
}: { 
  frameId: string; 
  photoSlots: any[];
  photoIndex: number;
}) {
  const [frame, setFrame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFrame = async () => {
      try {
        const { data, error } = await supabase
          .from('photo_frames')
          .select('*')
          .eq('id', frameId)
          .single();
        
        if (error) throw error;
        setFrame(data);
      } catch (error) {
        console.error('Error loading frame:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (frameId) loadFrame();
  }, [frameId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!frame) {
    return <div className="text-gray-500 text-center">Không tìm thấy khuôn ảnh</div>;
  }

  // Tìm photo data cho slot này
  const photoData = photoSlots?.find((s: any) => s.slotIndex === photoIndex);
  if (!photoData?.photoUrl) {
    return <div className="text-gray-500 text-center">Không tìm thấy ảnh</div>;
  }

  // Lấy frame slot position
  const frameSlot = frame.photo_slots?.[photoIndex];
  if (!frameSlot) {
    // Fallback: hiển thị ảnh không có frame
    return (
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src={photoData.photoUrl}
        alt={`Photo ${photoIndex + 1}`}
        className="w-full h-full object-contain"
        style={{
          maxWidth: '100%',
          maxHeight: '100vh'
        }}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-full"
    >
      {/* Frame Image */}
      <img
        src={resolveImageUrl(frame.frame_image_url) || ''}
        alt={frame.name}
        className="w-full h-auto"
        style={{ aspectRatio: 'auto' }}
      />
      
      {/* Photo in slot */}
      <div
        className="absolute overflow-hidden rounded-sm"
        style={{
          left: `${frameSlot.x}%`,
          top: `${frameSlot.y}%`,
          width: `${frameSlot.width}%`,
          height: `${frameSlot.height}%`,
          transform: frameSlot.rotation ? `rotate(${frameSlot.rotation}deg)` : undefined,
          zIndex: frameSlot.zIndex || 10,
        }}
      >
        <img
          src={photoData.photoUrl}
          alt={`Photo ${photoIndex + 1}`}
          className="w-full h-full object-cover"
          style={{
            transform: photoData.transform 
              ? `scale(${photoData.transform.scale || 1}) translate(${photoData.transform.x || 0}px, ${photoData.transform.y || 0}px)`
              : undefined,
            transformOrigin: 'center center',
          }}
        />
      </div>
    </motion.div>
  );
}

/**
 * ✅ Enhanced pattern styles cho trang xem thiệp
 * Sử dụng patterns từ hệ thống design-presets mới (100+ patterns)
 * Hỗ trợ cả gradient và solid color
 */
function getLetterPatternStyle(pattern: string, color: string): React.CSSProperties {
  // Sử dụng function từ lib/design-presets
  return getPatternStyleFromPreset(pattern, color);
}

/**
 * ✅ Step 5: Music Player Component for Card Viewing
 * Hiển thị và phát nhạc nền khi xem thiệp
 */
function MusicPlayer({ 
  musicUrl, 
  musicName, 
  musicArtist,
  autoPlay = true 
}: { 
  musicUrl: string; 
  musicName?: string | null; 
  musicArtist?: string | null;
  autoPlay?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showControls, setShowControls] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Auto-play music when component mounts or when envelope opens
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoPlay) return;

    // Try to autoplay (may be blocked by browser)
    const playAudio = async () => {
      try {
        audio.volume = isMuted ? 0 : volume;
        audio.loop = true;
        await audio.play();
        setIsPlaying(true);
      } catch (error: any) {
        // Autoplay was prevented, user needs to click play
        console.log('Autoplay blocked, waiting for user interaction:', error);
        setIsPlaying(false);
      }
    };

    // Small delay to ensure audio is ready
    const timeout = setTimeout(playAudio, 300);
    
    // ✅ Thêm event listener để play khi user tương tác lần đầu
    const handleFirstInteraction = async () => {
      if (!isPlaying && audio.paused) {
        try {
          await playAudio();
        } catch (e) {
          console.log('Play on interaction failed:', e);
        }
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [musicUrl, autoPlay, volume, isMuted]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error: any) {
      console.error('Error toggling audio:', error);
      setAudioError('Không thể phát nhạc');
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  if (audioError) {
    return null; // Hide if error
  }

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        onError={() => {
          console.error('Audio load error:', musicUrl);
          setAudioError('Không thể tải nhạc');
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Music Controls */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Collapsed view - just play/pause button */}
        {!showControls ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowControls(true)}
            className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center border border-rose-200"
          >
            <Music className="w-6 h-6 text-rose-500" />
          </motion.button>
        ) : (
          /* Expanded controls */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 p-4 min-w-[280px]"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Music className="w-4 h-4 text-rose-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{musicName || 'Nhạc nền'}</p>
                  {musicArtist && (
                    <p className="text-xs text-gray-500 truncate">{musicArtist}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Play/Pause + Volume Controls */}
            <div className="flex items-center gap-3">
              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isPlaying 
                    ? 'bg-rose-500 text-white shadow-lg' 
                    : 'bg-rose-100 text-rose-500 hover:bg-rose-200'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>

              {/* Volume Controls */}
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-rose-500" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-rose-500
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:bg-rose-500
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer
                  "
                />
                <span className="text-xs text-gray-500 font-mono w-8">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>

            {/* Tip */}
            <p className="text-xs text-gray-400 mt-3 text-center">
              🎵 Nhạc nền sẽ tự động lặp lại
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

function ReaderModal({ 
  data, 
  onClose 
}: { 
  data: ViewData; 
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [templateAnimationComplete, setTemplateAnimationComplete] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [templateLoadError, setTemplateLoadError] = useState<string | null>(null);
  const [templateFallback, setTemplateFallback] = useState<boolean>(false);

  const contentPages = data.pages || [];
  const hasPhotos = Array.isArray(data.photos) && data.photos.length > 0;
  const photosCount = hasPhotos ? data.photos.length : 0;
  const hasTemplate = !!(data.templateUrl || data.templateThumbnail);
  
  // ✅ Step 6: Kiểm tra signature - phải là base64 image hoặc URL
  const hasSignature = !!(data.signature && 
    (data.signature.startsWith('data:image') || data.signature.startsWith('http')));
  
  // ✅ Step 4: Hỗ trợ nhiều frames - mỗi frame là một trang
  const hasFrames = Array.isArray(data.frames) && data.frames.length > 0;
  const framesCount = hasFrames ? data.frames!.length : 0;
  
  // ✅ Backward compatibility: kiểm tra frameId và photoSlots cũ
  const hasFrame = data.frameId && data.photoSlots && Array.isArray(data.photoSlots) && data.photoSlots.length > 0;
  const photoSlotsCount = hasFrame ? data.photoSlots!.length : 0;
  
  // Tính số trang photos: ưu tiên frames array, sau đó photoSlots, cuối cùng là photos array
  const actualPhotosCount = hasFrames ? framesCount : (hasFrame ? photoSlotsCount : photosCount);

  // ⚠️ CRITICAL: Template bắt buộc phải có
  // Page structure: 0 = template (BẮT BUỘC), 1+ = photos (nếu có), tiếp theo = content pages, last = signature (nếu có)
  // ✅ Bỏ cover page, chỉ tính template + photos + content + signature
  const totalPages = 1 + actualPhotosCount + contentPages.length + (hasSignature ? 1 : 0);

  const nextPage = () => setPage(p => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setPage(p => Math.max(0, p - 1));

  // Touch/Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }
  };

  const renderPage = () => {
    // Template animation page (first page - BẮT BUỘC)
    if (page === 0) {
      // ⚠️ CRITICAL: Template bắt buộc phải có
      if (!hasTemplate) {
        return (
          <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-red-50 via-white to-rose-50">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Lỗi: Thiếu Template</h3>
              <p className="text-gray-600 mb-4">
                Thiệp này không có template animation hoặc template tĩnh.
              </p>
              <p className="text-sm text-gray-500">
                Vui lòng liên hệ người gửi để báo lỗi này.
              </p>
            </div>
          </div>
        );
      }

      // Helper function to check if URL is a video
      const isVideo = (url: string | null): boolean => {
        if (!url) return false;
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
      };

      // ✅ Ưu tiên: nếu video lỗi thì fallback sang thumbnail
      const primaryUrl = data.templateUrl || data.templateThumbnail;
      const fallbackUrl = data.templateThumbnail || data.templateUrl;
      const templateUrlToShow = templateFallback ? fallbackUrl : primaryUrl;
      const isTemplateVideo = templateUrlToShow ? isVideo(templateUrlToShow) : false;

      // ✅ Áp dụng background color/pattern cho template page
      const templateBg = data.coverBackground || '#fdf2f8';
      const templatePat = data.coverPattern || 'solid';
      const templatePatternStyles = getLetterPatternStyle(templatePat, templateBg);
      
      return (
        <div 
          className="h-full flex items-center justify-center"
          style={{ 
            aspectRatio: '1080 / 1440',
            maxHeight: '100vh',
            width: '100%',
            maxWidth: '100vw',
            ...templatePatternStyles,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex items-center justify-center"
            style={{
              width: '1080px',
              height: '1440px',
              maxWidth: '100%',
              maxHeight: '100vh',
              aspectRatio: '1080 / 1440'
            }}
          >
            {templateLoadError ? (
              // ✅ Hiển thị thông báo lỗi rõ ràng
              <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Không thể tải template</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {templateLoadError}
                </p>
                {fallbackUrl && !templateFallback && (
                  <button
                    onClick={() => {
                      setTemplateFallback(true);
                      setTemplateLoadError(null);
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  >
                    Thử tải thumbnail
                  </button>
                )}
              </div>
            ) : templateUrlToShow ? (
              isTemplateVideo && !templateFallback ? (
                <motion.video
                  src={templateUrlToShow}
                  autoPlay
                  loop
                  muted
                  playsInline
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="w-full h-full object-contain"
                  style={{
                    width: '1080px',
                    height: '1440px',
                    maxWidth: '100%',
                    maxHeight: '100vh'
                  }}
                  onLoadedData={() => {
                    setTemplateAnimationComplete(true);
                    setTemplateLoadError(null);
                  }}
                  onError={(e) => {
                    const video = e.target as HTMLVideoElement;
                    const errorMsg = `Video không thể tải: ${templateUrlToShow}`;
                    console.error('Failed to load template video:', templateUrlToShow);
                    
                    // ✅ Thử fallback sang thumbnail nếu có
                    if (fallbackUrl && !templateFallback) {
                      console.log('Falling back to thumbnail:', fallbackUrl);
                      setTemplateFallback(true);
                      setTemplateLoadError(null);
                    } else {
                      setTemplateLoadError(errorMsg);
                      video.style.display = 'none';
                    }
                  }}
                />
              ) : (
                <motion.img
                  src={templateUrlToShow}
                  alt="Template Animation"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="w-full h-full object-contain"
                  style={{
                    width: '1080px',
                    height: '1440px',
                    maxWidth: '100%',
                    maxHeight: '100vh'
                  }}
                  onLoad={() => {
                    setTemplateAnimationComplete(true);
                    setTemplateLoadError(null);
                  }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    const errorMsg = `Ảnh không thể tải: ${templateUrlToShow}`;
                    console.error('Failed to load template image:', templateUrlToShow);
                    setTemplateLoadError(errorMsg);
                    img.style.display = 'none';
                  }}
                />
              )
            ) : null}
          </motion.div>
        </div>
      );
    }

    // ✅ Bỏ cover page - Photo pages bắt đầu từ page 1
    // Photo pages (page 1, 2, 3... nếu có nhiều ảnh hoặc có photoSlots hoặc có nhiều frames)
    const photoStartIndex = 1;
    const photoIndex = page - photoStartIndex;
    
    // ✅ Hỗ trợ nhiều frames - mỗi frame là một trang
    const hasFrames = Array.isArray(data.frames) && data.frames.length > 0;
    if (hasFrames && photoIndex >= 0 && photoIndex < data.frames!.length) {
      const frameData = data.frames![photoIndex];
      // ✅ Áp dụng background color/pattern cho photo pages
      const photoBg = data.photoBackground || '#fff8e1';
      const photoPat = data.photoPattern || 'solid';
      const photoPatternStyles = getLetterPatternStyle(photoPat, photoBg);
      
      return (
        <div 
          className="h-full flex items-center justify-center p-4"
          style={{ 
            aspectRatio: '1080 / 1440',
            maxHeight: '100vh',
            width: '100%',
            maxWidth: '100vw',
            ...photoPatternStyles,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-full max-w-3xl mx-auto">
            <FramePhotoViewer 
              frameId={frameData.frameId}
              photoSlots={frameData.photoSlots}
            />
          </div>
        </div>
      );
    }
    
    // ✅ Backward compatibility: Kiểm tra xem có frame và photoSlots không (single frame)
    const hasFrame = data.frameId && data.photoSlots && Array.isArray(data.photoSlots) && data.photoSlots.length > 0;
    const photoSlotsCount = hasFrame ? data.photoSlots.length : 0;
    
    // Nếu có frame (single), hiển thị theo photoSlots
    if (hasFrame && photoIndex >= 0 && photoIndex < photoSlotsCount) {
      // ✅ Áp dụng background color/pattern cho photo pages
      const photoBg = data.photoBackground || '#fff8e1';
      const photoPat = data.photoPattern || 'solid';
      const photoPatternStyles = getLetterPatternStyle(photoPat, photoBg);
      
      return (
        <div 
          className="h-full flex items-center justify-center p-4"
          style={{ 
            aspectRatio: '1080 / 1440',
            maxHeight: '100vh',
            width: '100%',
            maxWidth: '100vw',
            ...photoPatternStyles,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-full max-w-3xl mx-auto">
            <SinglePhotoInFrame 
              frameId={data.frameId!}
              photoSlots={data.photoSlots}
              photoIndex={photoIndex}
            />
          </div>
        </div>
      );
    }
    
    // ✅ Nếu không có frame nhưng có photos array, render ảnh đơn giản
    if (!hasFrame && hasPhotos && photoIndex >= 0 && photoIndex < photosCount) {
      // ✅ Áp dụng background color/pattern cho photo pages
      const photoBg = data.photoBackground || '#fff8e1';
      const photoPat = data.photoPattern || 'solid';
      const photoPatternStyles = getLetterPatternStyle(photoPat, photoBg);
      
      return (
        <div 
          className="h-full flex items-center justify-center"
          style={{ 
            aspectRatio: '1080 / 1440',
            maxHeight: '100vh',
            width: '100%',
            maxWidth: '100vw',
            ...photoPatternStyles,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <motion.img
            src={data.photos[photoIndex]}
            alt={`Photo ${photoIndex + 1}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="object-contain"
            style={{
              width: '1080px',
              height: '1440px',
              maxWidth: '100%',
              maxHeight: '100vh'
            }}
            onError={(e) => {
              console.error('Failed to load photo:', data.photos[photoIndex]);
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
        </div>
      );
    }

    // Content pages (start after photos)
    const contentStartIndex = photoStartIndex + actualPhotosCount;
    const contentIndex = page - contentStartIndex;
    if (contentIndex >= 0 && contentIndex < contentPages.length && contentPages.length > 0) {
      let pageContent = contentPages[contentIndex] || '';
      
      // ✅ Thêm recipient name vào trang đầu tiên (giống Step3Message)
      if (contentIndex === 0 && data.recipientName) {
        // Remove any existing recipient header first
        pageContent = pageContent.replace(/^<p>Gửi\s+<span[^>]*>[^<]*<\/span>,?<\/p>(<p><br><\/p>)?/i, '');
        // Add recipient header
        const recipientHtml = `<p>Gửi <span style="color: #b45309; font-weight: 600;">${data.recipientName}</span>,</p><p><br></p>`;
        pageContent = recipientHtml + pageContent;
      }
      
      // ✅ Thêm sender name vào trang cuối cùng
      const isLastContentPage = contentIndex === contentPages.length - 1;
      if (isLastContentPage && data.senderName) {
        // Remove any existing sender footer first
        pageContent = pageContent.replace(/<p><br><\/p><p[^>]*style="text-align:\s*right[^"]*"[^>]*>Yêu thương,[\s\S]*?<\/p>$/i, '');
        // Add sender footer
        const senderHtml = `<p><br></p><p style="text-align: right;">Yêu thương,<br><span style="color: #b45309; font-weight: 600; font-size: 1.1em;">${data.senderName}</span></p>`;
        pageContent = pageContent + senderHtml;
      }
      
      // ✅ Kiểm tra xem có HTML tags không (luôn render HTML nếu có tags)
      const isHTML = pageContent.includes('<') && (pageContent.includes('<p>') || pageContent.includes('<span>') || pageContent.includes('<br>') || pageContent.includes('<div>'));
      
      // ✅ Lấy letter background/pattern styles (giống Step3Message)
      const letterBg = data.letterBackground || '#ffffff';
      const letterPat = data.letterPattern || 'solid';
      const patternStyles = getLetterPatternStyle(letterPat, letterBg);
      
      return (
        <div 
          className="h-full flex items-center justify-center"
          style={{ 
            aspectRatio: '1080 / 1440',
            maxHeight: '100vh',
            width: '100%',
            maxWidth: '100vw',
            background: 'linear-gradient(135deg, #fdf2f8 0%, #fef3c7 50%, #fce7f3 100%)',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* ✅ Letter paper with background & pattern - giống Step3Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative rounded-xl shadow-2xl overflow-hidden"
            style={{ 
              width: 'calc(100% - 2rem)',
              maxWidth: '600px',
              height: 'calc(100% - 3rem)',
              maxHeight: '90vh',
              ...patternStyles,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Decorative paper edges */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent" />
              <div className="absolute inset-2 border border-amber-200/30 rounded-lg" />
            </div>
            
            {/* Content container */}
            <div className="h-full overflow-y-auto p-6 md:p-8">
              {isHTML ? (
                <ContentWithFonts 
                  html={pageContent}
                  className="w-full letter-content rich-text-content max-w-none"
                  style={{ 
                    color: '#1f2937',
                    fontSize: '1.125rem',
                    lineHeight: '1.875rem',
                  }}
                  usedFonts={data.usedFonts}
                />
              ) : (
                <div className="w-full">
                  {/* ✅ Thêm recipient name nếu là trang đầu tiên */}
                  {contentIndex === 0 && data.recipientName && (
                    <p className="text-lg leading-relaxed text-gray-800 mb-4">
                      Gửi <strong style={{ color: '#b45309' }}>{data.recipientName}</strong>,
                    </p>
                  )}
                  <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {pageContent}
                  </p>
                  {/* ✅ Thêm sender name nếu là trang cuối cùng */}
                  {isLastContentPage && data.senderName && (
                    <p className="text-lg leading-relaxed text-gray-800 mt-4 text-right">
                      Yêu thương,<br />
                      <strong style={{ color: '#b45309', fontSize: '1.1em' }}>{data.senderName}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Page number indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <span className="text-xs text-amber-600/50 font-medium bg-white/60 px-3 py-1 rounded-full shadow-sm">
                Trang {contentIndex + 1}/{contentPages.length}
              </span>
            </div>
          </motion.div>
        </div>
      );
    }

    // ✅ Step 6: Signature (last page) - chỉ render nếu có signature image
    // Signature page index = totalPages - 1 (nếu có signature)
    const signaturePageIndex = hasSignature ? totalPages - 1 : -1;
    if (page === signaturePageIndex && hasSignature) {
      // ✅ Áp dụng background color/pattern cho signature page
      const sigBg = data.signatureBackground || '#fce4ec';
      const sigPat = data.signaturePattern || 'solid';
      const sigPatternStyles = getLetterPatternStyle(sigPat, sigBg);
      
      return (
        <div 
          className="h-full flex items-center justify-center text-center"
          style={{ 
            aspectRatio: '1080 / 1440',
            maxHeight: '100vh',
            width: '100%',
            maxWidth: '100vw',
            ...sigPatternStyles,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center p-8"
            style={{ width: '1080px', height: '1440px', maxWidth: '100%', maxHeight: '100vh' }}
          >
            {/* Decorative line */}
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mb-8" />
            
            {/* Thân ái text */}
            <p className="text-xl text-gray-500 mb-6 font-serif italic">Thân ái,</p>
            
            {/* Signature Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              <img
                src={data.signature!}
                alt="Chữ ký"
                className="max-w-xs md:max-w-md max-h-40 md:max-h-48 object-contain"
                style={{ 
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                }}
                onError={(e) => {
                  // Hide if image fails to load
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            </motion.div>
            
            {/* Sender name nếu có */}
            {data.senderName && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6 text-lg text-rose-600 font-semibold"
              >
                {data.senderName}
              </motion.p>
            )}
            
            {/* Decorative heart */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8"
            >
              <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
            </motion.div>
          </motion.div>
        </div>
      );
    }

    // Fallback: Nếu không match với bất kỳ page nào, hiển thị empty
    return (
      <div 
        className="h-full flex items-center justify-center text-center bg-gradient-to-br from-rose-50 via-white to-pink-50"
        style={{ 
          aspectRatio: '1080 / 1440',
          maxHeight: '100vh',
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        <p className="text-gray-400">Trang không tồn tại</p>
      </div>
    );
  };

  // ✅ Tạo gradient background đẹp cho modal dựa trên letter background
  const getModalBackground = () => {
    const letterBg = data.letterBackground || '#fdf2f8';
    // Nếu có gradient, dùng gradient làm base
    if (letterBg.includes('gradient')) {
      return letterBg;
    }
    // Fallback: tạo gradient đẹp từ màu đơn
    return `linear-gradient(135deg, ${letterBg} 0%, #fce7f3 50%, #fef3c7 100%)`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        padding: 0,
        background: getModalBackground(),
      }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 24 }}
        className="w-full h-full bg-transparent overflow-hidden relative"
        style={{
          aspectRatio: '1080 / 1440',
          maxHeight: '100vh',
          maxWidth: '100vw'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg flex items-center justify-center z-20 transition"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Left navigation area - Always visible on mobile, hover on desktop */}
        {page > 0 && (
          <button
            onClick={prevPage}
            className="absolute left-0 top-0 bottom-0 w-1/4 z-10 flex items-center justify-start pl-2 md:pl-4 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity group touch-none"
            aria-label="Previous page"
            onTouchStart={(e) => {
              e.stopPropagation();
              prevPage();
            }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center group-hover:bg-white transition">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
          </button>
        )}

        {/* Right navigation area - Always visible on mobile, hover on desktop */}
        {page < totalPages - 1 && (
          <button
            onClick={nextPage}
            className="absolute right-0 top-0 bottom-0 w-1/4 z-10 flex items-center justify-end pr-2 md:pr-4 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity group touch-none"
            aria-label="Next page"
            onTouchStart={(e) => {
              e.stopPropagation();
              nextPage();
            }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center group-hover:bg-white transition">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
          </button>
        )}

        {/* Main content - full screen */}
        <div className="h-full w-full">{renderPage()}</div>
      </motion.div>
    </motion.div>
  );
}
