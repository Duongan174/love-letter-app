// components/create/Step1Envelope.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Envelope3D from './Envelope3D';
import { Loader2 } from 'lucide-react';

interface Step1EnvelopeProps {
  selectedEnvelope: any;
  onSelectEnvelope: (env: any) => void;
}

export default function Step1Envelope({
  selectedEnvelope,
  onSelectEnvelope,
}: Step1EnvelopeProps) {
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('envelopes').select('*').order('points_required').then(({ data }) => {
      setEnvelopes(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
      
      {/* CỘT TRÁI: PREVIEW */}
      <div className="bg-rose-50/50 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
        {selectedEnvelope ? (
          <Envelope3D 
            color={selectedEnvelope.color} 
            texture={selectedEnvelope.thumbnail} 
            isOpen={false} 
          />
        ) : (
          <div className="text-gray-400 text-center">
            <p>Vui lòng chọn phong bì bên phải</p>
          </div>
        )}
      </div>

      {/* CỘT PHẢI: SELECTION */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Chọn Mẫu Vỏ Phong Bì
          </h3>
          <p className="text-gray-500 text-sm mb-6">Chiếc áo choàng đầu tiên cho thông điệp của bạn.</p>
          
          {loading ? <Loader2 className="animate-spin text-rose-500" /> : (
            <div className="grid grid-cols-3 gap-4">
              {envelopes.map((env) => (
                <button
                  key={env.id}
                  onClick={() => onSelectEnvelope(env)}
                  className={`
                    p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group
                    ${selectedEnvelope?.id === env.id 
                      ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200' 
                      : 'border-gray-100 hover:border-rose-200 hover:shadow-lg'
                    }
                  `}
                >
                  <div 
                    className="w-full h-16 rounded-xl shadow-sm transition-transform group-hover:scale-105"
                    style={{ backgroundColor: env.color || '#eee' }}
                  />
                  <div className="text-center w-full">
                    <p className="text-sm font-bold text-gray-700 truncate">{env.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${env.points_required === 0 ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-600'}`}>
                      {env.points_required === 0 ? 'Free' : `${env.points_required} Tym`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}