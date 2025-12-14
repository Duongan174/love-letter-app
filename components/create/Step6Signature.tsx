// components/create/Step6Signature.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, RotateCcw, Download, Check, Palette } from 'lucide-react';

interface Step6SignatureProps {
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

export default function Step6Signature({
  signatureData,
  onSetSignature,
}: Step6SignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);

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

  const skipSignature = () => {
    onSetSignature(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Ký tên của bạn
        </h2>
        <p className="text-gray-600">
          Thêm chữ ký cá nhân để thiệp thêm ý nghĩa (tùy chọn)
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="md:col-span-2">
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

          {/* Skip option */}
          <button
            onClick={skipSignature}
            className="w-full mt-4 py-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            Bỏ qua bước này →
          </button>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 h-full">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Xem trước</h3>
            
            <div className="bg-white rounded-xl shadow p-4 min-h-[200px] flex items-end justify-end">
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
              <p>💡 Ký tên sẽ xuất hiện cuối thiệp</p>
              <p>💡 Bạn có thể bỏ qua nếu không muốn ký</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Status */}
      {signatureData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-green-800">Chữ ký đã được lưu!</p>
            <p className="text-sm text-green-600">Bạn có thể tiếp tục sang bước tiếp theo</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
