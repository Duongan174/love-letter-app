// components/create/Step3MusicSignature.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2, VolumeX, Check, Sparkles, PenTool, RotateCcw, Palette, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  src?: string;
  url?: string;
  thumbnail?: string;
  points_required: number;
}

interface Step3MusicSignatureProps {
  selectedMusicId: string | null;
  selectedVolume?: number;
  onSelectMusic: (music: any) => void;
  onVolumeChange?: (volume: number) => void;
  signatureData: string | null;
  onSetSignature: (data: string | null) => void;
}

const penColors = [
  { id: 'black', color: '#000000', name: 'Đen' },
  { id: 'blue', color: '#1a56db', name: 'Xanh' },
  { id: 'red', color: '#dc2626', name: 'Đỏ' },
  { id: 'purple', color: '#7c3aed', name: 'Tím' },
  { id: 'rose', color: '#e11d48', name: 'Hồng' },
];

export default function Step3MusicSignature({ 
  selectedMusicId, 
  selectedVolume = 0.7,
  onSelectMusic,
  onVolumeChange,
  signatureData,
  onSetSignature,
}: Step3MusicSignatureProps) {
  // Music state
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState(selectedVolume);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Signature state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);

  // Fetch nhạc từ DB
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const { data, error } = await supabase
          .from('music')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTracks(data || []);
      } catch (error) {
        console.error('Lỗi tải nhạc:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // For retina displays
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Set initial styles
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load existing signature if any
    if (signatureData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = signatureData;
    }
  }, []);

  // Update pen style when color/width changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
    }
  }, [penColor, penWidth]);

  // Update audio volume when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync external volume
  useEffect(() => {
    setVolume(selectedVolume);
  }, [selectedVolume]);

  // Music functions
  const getTrackUrl = (track: MusicTrack) => {
    return track.src || track.url || track.thumbnail || '';
  };

  const handlePlayPreview = async (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    const trackUrl = getTrackUrl(track);

    if (playingId === track.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    try {
      if (!trackUrl) {
        alert("Lỗi dữ liệu: Không tìm thấy đường dẫn file nhạc!");
        return;
      }

      setPlayingId(track.id);
      audio.src = trackUrl;
      audio.volume = isMuted ? 0 : volume;
      audio.load();
      await audio.play();
    } catch (error) {
      console.error("Lỗi phát nhạc:", error);
      alert("Không thể phát bài nhạc này.");
      setPlayingId(null);
    }
  };

  const handleAudioEnded = () => {
    setPlayingId(null);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    onVolumeChange?.(newVolume);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Signature functions
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSetSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSetSignature(dataUrl);
  };

  const selectedTrack = tracks.find(t => t.id === selectedMusicId);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-burgundy" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">Nhạc Nền & Chữ Ký</h2>
        </div>
        <p className="font-vn text-ink/60">Hoàn thiện thiệp với nhạc nền và chữ ký cá nhân</p>
      </div>

      {/* Decorative Divider */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <span className="text-gold/60 text-sm">♪ ✍</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
      </div>

      <audio 
        ref={audioRef} 
        className="hidden" 
        onEnded={handleAudioEnded} 
        onError={() => setPlayingId(null)}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Music Section */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-ink mb-2 flex items-center gap-2">
              <Music className="w-5 h-5 text-burgundy" />
              Chọn Nhạc Nền
            </h3>
            <p className="text-sm text-ink/60">Giai điệu giúp cảm xúc thêm thăng hoa</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-burgundy w-8 h-8" />
            </div>
          ) : (
            <>
              {/* Volume Control - Show when music is selected */}
              {selectedMusicId && selectedTrack && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-burgundy/5 rounded-2xl border border-burgundy/20"
                >
                  <div className="flex items-center gap-4">
                    {/* Now Playing */}
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-burgundy/20 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-burgundy" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-vn font-medium text-ink truncate">{selectedTrack.name}</p>
                        <p className="text-xs text-ink/50 truncate">{selectedTrack.artist || 'Unknown'}</p>
                      </div>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-burgundy/10 rounded-lg transition shrink-0"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5 text-ink/50" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-burgundy" />
                        )}
                      </button>
                      
                      <div className="flex items-center gap-2 w-32">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gold/20 rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-4
                            [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:bg-burgundy
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:shadow-md
                            [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-moz-range-thumb]:w-4
                            [&::-moz-range-thumb]:h-4
                            [&::-moz-range-thumb]:bg-burgundy
                            [&::-moz-range-thumb]:rounded-full
                            [&::-moz-range-thumb]:border-0
                            [&::-moz-range-thumb]:cursor-pointer
                          "
                        />
                        <span className="text-xs text-ink/60 font-mono w-8 shrink-0">
                          {Math.round((isMuted ? 0 : volume) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Music Grid */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {/* Option: No music */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelectMusic(null)}
                  className={`
                    flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                    ${selectedMusicId === null 
                      ? 'border-burgundy bg-burgundy/5 shadow-md' 
                      : 'border-gold/20 bg-cream hover:border-burgundy/30 hover:shadow-sm'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition shrink-0
                    ${selectedMusicId === null ? 'bg-burgundy text-cream' : 'bg-gold/10 text-ink/40'}
                  `}>
                    <VolumeX className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-vn font-semibold ${selectedMusicId === null ? 'text-burgundy' : 'text-ink'}`}>
                      Không dùng nhạc
                    </p>
                    <p className="text-xs text-ink/50">Im lặng là vàng</p>
                  </div>
                  {selectedMusicId === null && (
                    <div className="w-6 h-6 rounded-full bg-burgundy flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-cream" />
                    </div>
                  )}
                </motion.div>

                {/* Music Tracks */}
                {tracks.length > 0 ? (
                  tracks.map((track, index) => {
                    const isSelected = selectedMusicId === track.id;
                    const isPlaying = playingId === track.id;
                    const hasUrl = !!getTrackUrl(track);

                    return (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => hasUrl && onSelectMusic(track)}
                        className={`
                          flex items-center justify-between p-4 rounded-2xl border-2 transition-all group
                          ${isSelected 
                            ? 'border-burgundy bg-burgundy/5 shadow-md' 
                            : 'border-gold/20 bg-cream hover:border-burgundy/30 hover:shadow-sm'
                          }
                          ${!hasUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Play button */}
                          <button
                            onClick={(e) => handlePlayPreview(track, e)}
                            disabled={!hasUrl}
                            className={`
                              w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm
                              ${isPlaying 
                                ? 'bg-burgundy text-cream scale-110' 
                                : isSelected
                                  ? 'bg-burgundy/20 text-burgundy group-hover:bg-burgundy/30'
                                  : 'bg-gold/10 text-ink/50 group-hover:bg-gold/20'
                              }
                            `}
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </button>
                          
                          {/* Track info */}
                          <div className="min-w-0">
                            <p className={`font-vn font-semibold truncate ${isSelected ? 'text-burgundy' : 'text-ink'}`}>
                              {track.name}
                            </p>
                            <p className="text-xs text-ink/50 truncate">
                              {track.artist || 'Unknown Artist'}
                            </p>
                            {!hasUrl && (
                              <p className="text-[10px] text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                File không khả dụng
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Price */}
                          <span className={`
                            text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap
                            ${track.points_required > 0 
                              ? 'bg-gold/20 text-gold-dark' 
                              : 'bg-forest/10 text-forest'
                            }
                          `}>
                            {track.points_required > 0 ? `${track.points_required} Tym` : '✓ Free'}
                          </span>

                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-burgundy flex items-center justify-center">
                              <Check className="w-4 h-4 text-cream" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-ink/40 flex flex-col items-center">
                    <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                    <p className="font-vn">Chưa có bài nhạc nào trong hệ thống.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Signature Section */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-ink mb-2 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-rose-500" />
              Ký Tên Của Bạn
            </h3>
            <p className="text-sm text-ink/60">Thêm chữ ký cá nhân để thiệp thêm ý nghĩa (tùy chọn)</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Vẽ chữ ký</span>
              </div>
              
              {/* Pen Colors */}
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-400" />
                {penColors.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPenColor(p.color)}
                    className={`
                      w-6 h-6 rounded-full transition-all
                      ${penColor === p.color ? 'ring-2 ring-offset-2 ring-rose-500' : ''}
                    `}
                    style={{ backgroundColor: p.color }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-64 cursor-crosshair touch-none"
                style={{ background: '#fafafa' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              
              {/* Hint text */}
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-300 text-lg">Ký tên ở đây...</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={clearCanvas}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
                Xóa & vẽ lại
              </button>
              
              <button
                onClick={saveSignature}
                disabled={!hasDrawn}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition
                  ${hasDrawn 
                    ? 'bg-rose-500 text-white hover:bg-rose-600' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Check className="w-4 h-4" />
                Lưu chữ ký
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Xem trước chữ ký</h3>
            
            <div className="bg-white rounded-xl shadow p-4 min-h-[150px] flex items-end justify-end">
              {signatureData ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-right"
                >
                  <img 
                    src={signatureData} 
                    alt="Chữ ký" 
                    className="max-w-[150px] h-auto"
                  />
                  <p className="text-xs text-gray-400 mt-2">Chữ ký đã lưu ✓</p>
                </motion.div>
              ) : (
                <p className="text-gray-300 text-sm italic">
                  Chữ ký sẽ hiển thị ở đây...
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <p>💡 Sử dụng ngón tay hoặc chuột để ký</p>
              <p>💡 Chữ ký sẽ xuất hiện cuối thiệp</p>
              <p>💡 Bạn có thể bỏ qua nếu không muốn ký</p>
            </div>
          </div>
        </div>
      </div>

      {/* Volume reminder */}
      {selectedMusicId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gold/10 rounded-xl border border-gold/20 flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-vn font-medium text-ink text-sm">Mẹo hay</p>
            <p className="text-xs text-ink/60">
              Điều chỉnh âm lượng nhạc nền để phù hợp với không khí thiệp. 
              Âm lượng này sẽ được lưu lại khi thiệp được gửi đi.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
