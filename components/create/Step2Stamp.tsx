// components/create/Step2Stamp.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Envelope3D from './Envelope3D';
import { Loader2 } from 'lucide-react';

interface Step2StampProps {
  envelope: any;
  liner: string | null;
  selectedStamp: any;
  onSelectStamp: (stamp: any) => void;
}

export default function Step2Stamp({
  envelope,
  liner,
  selectedStamp,
  onSelectStamp
}: Step2StampProps) {
  const [stamps, setStamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('stamps').select('*').order('points_required').then(({ data }) => {
      setStamps(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
      
      {/* PREVIEW: PHONG BÌ ĐÓNG + TEM */}
      <div className="bg-rose-50/50 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
        <Envelope3D 
          color={envelope?.color || '#eee'}
          texture={envelope?.thumbnail}
          linerPattern={liner}
          stampUrl={selectedStamp?.thumbnail}
          isOpen={false} // ĐÓNG NẮP để thấy tem
        />
      </div>

      {/* SELECTION */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Chọn Tem Thư (Stamp)</h3>
        {loading ? <Loader2 className="animate-spin" /> : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {stamps.map((stamp) => (
              <button
                key={stamp.id}
                onClick={() => onSelectStamp(stamp)}
                className={`
                  p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 bg-white
                  ${selectedStamp?.id === stamp.id ? 'border-rose-500 shadow-md ring-2 ring-rose-100' : 'border-gray-100 hover:border-rose-200'}
                `}
              >
                <div className="w-16 h-16 object-contain p-1">
                  <img src={stamp.thumbnail} className="w-full h-full object-contain" alt={stamp.name} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600 truncate max-w-[80px]">{stamp.name}</p>
                  <span className={`text-[10px] font-bold ${stamp.points_required > 0 ? 'text-amber-500' : 'text-green-600'}`}>
                    {stamp.points_required === 0 ? 'Free' : `${stamp.points_required} Tym`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}