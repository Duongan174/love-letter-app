// components/create/Step5Music.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Định nghĩa linh hoạt hơn để bắt mọi trường hợp tên cột
interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  src?: string;       // Trường hợp 1: Tên chuẩn
  url?: string;       // Trường hợp 2: Tên thường gặp
  thumbnail?: string; // Trường hợp 3: Do copy từ code ảnh
  points_required: number;
}

interface Step5MusicProps {
  selectedMusicId: string | null;
  onSelectMusic: (music: any) => void;
}

export default function Step5Music({ selectedMusicId, onSelectMusic }: Step5MusicProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Hàm lấy URL thực sự của bài hát bất kể tên cột là gì
  const getTrackUrl = (track: MusicTrack) => {
    return track.src || track.url || track.thumbnail || '';
  };

  // Xử lý phát thử
  const handlePlayPreview = async (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    // Lấy URL chuẩn
    const trackUrl = getTrackUrl(track);

    if (playingId === track.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    try {
      if (!trackUrl) {
        alert("Lỗi dữ liệu: Không tìm thấy đường dẫn file nhạc!");
        console.log("Track Data:", track); // Log để debug
        return;
      }

      setPlayingId(track.id);
      audio.src = trackUrl;
      audio.load();
      await audio.play();
    } catch (error) {
      console.error("Lỗi phát nhạc:", error);
      alert("Không thể phát bài nhạc này. Định dạng không hỗ trợ hoặc link hỏng.");
      setPlayingId(null);
    }
  };

  const handleAudioEnded = () => {
    setPlayingId(null);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn Nhạc Nền</h2>
        <p className="text-gray-600">Giai điệu giúp cảm xúc thêm thăng hoa.</p>
      </div>

      <audio 
        ref={audioRef} 
        className="hidden" 
        onEnded={handleAudioEnded} 
        onError={() => setPlayingId(null)}
      />

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-rose-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Option: Không dùng nhạc */}
          <div
            onClick={() => onSelectMusic(null)}
            className={`
              flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white
              ${selectedMusicId === null ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-rose-200'}
            `}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-700">Không dùng nhạc</p>
              <p className="text-xs text-gray-500">Im lặng</p>
            </div>
          </div>

          {/* Danh sách nhạc */}
          {tracks.length > 0 ? (
            tracks.map((track) => {
              const isSelected = selectedMusicId === track.id;
              const isPlaying = playingId === track.id;
              const hasUrl = !!getTrackUrl(track); // Kiểm tra xem có link không

              return (
                <div
                  key={track.id}
                  onClick={() => hasUrl && onSelectMusic(track)}
                  className={`
                    flex items-center justify-between p-4 rounded-xl border-2 transition-all bg-white group
                    ${isSelected ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-rose-200'}
                    ${!hasUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handlePlayPreview(track, e)}
                      disabled={!hasUrl}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0
                        ${isPlaying 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-rose-100 text-rose-500 group-hover:bg-rose-200'
                        }
                      `}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                    </button>
                    
                    <div className="overflow-hidden">
                      <p className={`font-bold truncate ${isSelected ? 'text-rose-700' : 'text-gray-800'}`}>
                        {track.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {track.artist || 'Unknown Artist'}
                      </p>
                      {!hasUrl && <p className="text-[10px] text-red-500">Lỗi: Mất file nhạc</p>}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${track.points_required > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {track.points_required > 0 ? `${track.points_required} Tym` : 'Free'}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-400 flex flex-col items-center">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>Chưa có bài nhạc nào trong hệ thống.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}