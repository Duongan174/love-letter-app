'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Pause, Upload, Sparkles, Volume2 } from 'lucide-react';

interface AIVoiceCardProps {
  cardId: string;
  message: string;
  senderName: string;
}

export default function AIVoiceCard({ cardId, message, senderName }: AIVoiceCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await uploadVoiceSample(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error recording:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVoiceSample = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'voice-sample.webm');
    formData.append('cardId', cardId);

    try {
      const response = await fetch('/api/ai-voice/upload-sample', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Voice sample uploaded, now generate AI voice
        generateAIVoice();
      }
    } catch (error) {
      console.error('Error uploading voice:', error);
    }
  };

  const generateAIVoice = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          message,
          senderName,
        }),
      });

      const data = await response.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
      }
    } catch (error) {
      console.error('Error generating AI voice:', error);
      alert('Có lỗi khi tạo giọng nói AI. Vui lòng thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-32 right-8 z-40">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Voice Card</h3>
            <p className="text-xs text-gray-500">Giọng nói của {senderName}</p>
          </div>
        </div>

        {!audioUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Ghi âm 10 giây giọng nói của bạn để AI học và đọc lời chúc
            </p>

            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                <Mic className="w-5 h-5" />
                <span>Bắt đầu ghi âm</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-rose-500">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-rose-500 rounded-full"
                  />
                  <span className="font-medium">Đang ghi âm...</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  <Pause className="w-5 h-5" />
                  <span>Dừng ghi âm</span>
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-4">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-sm text-gray-600">
                  AI đang học giọng nói và tạo audio...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">
                Giọng nói AI đã sẵn sàng!
              </p>
            </div>

            <button
              onClick={togglePlay}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Dừng phát</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Nghe lời chúc</span>
                </>
              )}
            </button>

            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

