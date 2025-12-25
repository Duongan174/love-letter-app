'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ARPage() {
  const params = useParams();
  const cardId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [arType, setArType] = useState<'dragon' | 'flower' | 'fireworks'>('fireworks');

  useEffect(() => {
    // Auto-start AR when page loads
    startAR();
  }, []);

  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Không thể truy cập camera. Vui lòng cho phép quyền camera.');
    }
  };

  const stopAR = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsScanning(false);
      window.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* AR Overlay - 3D Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dragon Animation */}
          {arType === 'dragon' && (
            <motion.div
              className="absolute top-1/4 left-1/2 -translate-x-1/2"
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <div className="text-8xl drop-shadow-2xl">🐉</div>
            </motion.div>
          )}

          {/* Flower Bloom Animation */}
          {arType === 'flower' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-5xl"
                  style={{
                    transformOrigin: 'center',
                  }}
                  initial={{ scale: 0, rotate: i * 30 }}
                  animate={{
                    scale: [0, 1.5, 1],
                    rotate: i * 30,
                    y: [0, -50, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  🌸
                </motion.div>
              ))}
            </div>
          )}

          {/* Fireworks */}
          {arType === 'fireworks' && (
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 2, 0],
                    opacity: [1, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={stopAR}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg z-10"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        {/* AR Type Selector */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-3">
          {(['dragon', 'flower', 'fireworks'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setArType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                arType === type
                  ? 'bg-white text-purple-600'
                  : 'bg-white/50 text-white'
              }`}
            >
              {type === 'dragon' && '🐉 Rồng'}
              {type === 'flower' && '🌸 Hoa'}
              {type === 'fireworks' && '✨ Pháo hoa'}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white bg-black/50 backdrop-blur px-4 py-2 rounded-full inline-block flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Di chuyển camera xung quanh để xem hiệu ứng
          </p>
        </div>
      </div>
    </div>
  );
}

