// components/create/Step5Music.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2, VolumeX, Heart, Clock, Check, X } from 'lucide-react';
import { MusicTrack } from '@/hooks/useCreateCard';

interface Step5MusicProps {
  selectedMusicId: string | null;
  onSelectMusic: (music: MusicTrack | null) => void;
}

// Mock music data - sẽ thay bằng Supabase
const mockMusicTracks: MusicTrack[] = [
  { id: '1', name: 'Nhạc Nhẹ Nhàng', url: '/music/soft.mp3', category: 'romantic', duration: 180, tym_cost: 0 },
  { id: '2', name: 'Piano Tình Yêu', url: '/music/piano.mp3', category: 'romantic', duration: 210, tym_cost: 0 },
  { id: '3', name: 'Guitar Acoustic', url: '/music/guitar.mp3', category: 'acoustic', duration: 195, tym_cost: 0 },
  { id: '4', name: 'Violin Romance', url: '/music/violin.mp3', category: 'classical', duration: 240, tym_cost: 0 },
  { id: '5', name: 'Jazz Cafe', url: '/music/jazz.mp3', category: 'jazz', duration: 225, tym_cost: 0 },
  { id: '6', name: 'Lofi Beats', url: '/music/lofi.mp3', category: 'modern', duration: 200, tym_cost: 0 },
];

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'romantic', name: 'Lãng mạn' },
  { id: 'acoustic', name: 'Acoustic' },
  { id: 'classical', name: 'Cổ điển' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'modern', name: 'Hiện đại' },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Step5Music({
  selectedMusicId,
  onSelectMusic,
}: Step5MusicProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredTracks = activeCategory === 'all'
    ? mockMusicTracks
    : mockMusicTracks.filter(t => t.category === activeCategory);

  const selectedTrack = mockMusicTracks.find(t => t.id === selectedMusicId);

  // Handle play/pause
  const togglePlay = (track: MusicTrack) => {
    if (playingId === track.id) {
      // Pause
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // In real app, create audio element with actual URL
      // For now, just toggle state
      setPlayingId(track.id);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Chọn nhạc nền
        </h2>
        <p className="text-gray-600">
          Thêm âm nhạc để thiệp thêm cảm xúc (tùy chọn)
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${activeCategory === cat.id 
                ? 'bg-rose-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-rose-50 border border-gray-200'
              }
            `}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* No Music Option */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onSelectMusic(null)}
        className={`
          w-full mb-4 p-4 rounded-xl border-2 transition-all flex items-center justify-between
          ${selectedMusicId === null 
            ? 'border-rose-500 bg-rose-50' 
            : 'border-gray-200 hover:border-rose-300'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${selectedMusicId === null ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}
          `}>
            <VolumeX className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-800">Không có nhạc</p>
            <p className="text-sm text-gray-500">Thiệp sẽ hiển thị không có âm thanh</p>
          </div>
        </div>
        {selectedMusicId === null && (
          <Check className="w-6 h-6 text-rose-500" />
        )}
      </motion.button>

      {/* Music Tracks List */}
      <div className="space-y-3">
        {filteredTracks.map((track, index) => {
          const isSelected = selectedMusicId === track.id;
          const isPlaying = playingId === track.id;
          
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-rose-500 bg-rose-50 shadow-lg' 
                  : 'border-gray-200 hover:border-rose-300 bg-white'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Play Button */}
                <button
                  onClick={() => togglePlay(track)}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${isPlaying 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-rose-100 text-rose-500 hover:bg-rose-200'
                    }
                  `}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                {/* Track Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{track.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="capitalize">{track.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(track.duration)}
                    </span>
                    <span className={track.tym_cost === 0 ? 'text-green-600' : 'text-rose-600'}>
                      {track.tym_cost === 0 ? 'Miễn phí' : `💜 ${track.tym_cost} Tym`}
                    </span>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelectMusic(track)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${isSelected 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-600'
                    }
                  `}
                >
                  {isSelected ? 'Đã chọn' : 'Chọn'}
                </button>
              </div>

              {/* Waveform Animation (when playing) */}
              {isPlaying && (
                <div className="mt-3 flex items-center gap-1 justify-center">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [8, 24, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                      className="w-1 bg-rose-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Track Summary */}
      {selectedTrack && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhạc đã chọn</p>
                <p className="font-semibold text-gray-800">{selectedTrack.name}</p>
              </div>
            </div>
            <button
              onClick={() => onSelectMusic(null)}
              className="text-rose-500 hover:text-rose-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Note */}
      <p className="text-center text-sm text-gray-400 mt-6">
        💡 Nhạc sẽ tự động phát khi người nhận mở thiệp
      </p>
    </div>
  );
}
