'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, X, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface WebARViewerProps {
  cardId: string;
  arContent?: {
    type: 'dragon' | 'flower' | 'fireworks' | 'custom';
    modelUrl?: string;
    animation?: string;
  };
}

export default function WebARViewer({ cardId, arContent }: WebARViewerProps) {
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const arUrl = `${window.location.origin}/ar/${cardId}`;
        const qr = await QRCode.toDataURL(arUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeUrl(qr);
      } catch (error) {
        console.error('Error generating QR:', error);
      }
    };

    if (showQR) {
      generateQR();
    }
  }, [showQR, cardId]);

  const startAR = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera
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
    }
  };

  return (
    <>
      {/* QR Code Display */}
      <AnimatePresence>
        {showQR && qrCodeUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Quét mã để xem AR
                </h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl mb-4 flex justify-center">
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              </div>

              <p className="text-sm text-gray-600 text-center">
                Mở camera điện thoại và quét mã QR này để xem hiệu ứng AR
              </p>

              <button
                onClick={startAR}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                <Camera className="w-5 h-5" />
                <span>Mở Camera AR</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AR Camera View */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          >
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />

              {/* AR Overlay - 3D Effects */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Dragon Animation */}
                {arContent?.type === 'dragon' && (
                  <motion.div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <div className="text-6xl">🐉</div>
                  </motion.div>
                )}

                {/* Flower Bloom Animation */}
                {arContent?.type === 'flower' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-4xl"
                        style={{
                          transformOrigin: 'center',
                        }}
                        initial={{ scale: 0, rotate: i * 45 }}
                        animate={{
                          scale: [0, 1.2, 1],
                          rotate: i * 45,
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      >
                        🌸
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Fireworks */}
                {arContent?.type === 'fireworks' && (
                  <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-2xl"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: 1,
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
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>

              {/* Instructions */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white bg-black/50 backdrop-blur px-4 py-2 rounded-full inline-block">
                  Di chuyển camera xung quanh để xem hiệu ứng
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowQR(true)}
        className="fixed bottom-24 right-8 z-40 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center gap-2 font-semibold hover:from-purple-600 hover:to-pink-600 transition"
      >
        <QrCode className="w-5 h-5" />
        <span>Xem AR</span>
        <Sparkles className="w-4 h-4" />
      </motion.button>
    </>
  );
}

