'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, Sparkles, Mail, Eye, EyeOff, Feather } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Envelope3D, { type SealDesign } from '@/components/create/Envelope3D';
import { ENVELOPE_PATTERNS } from '@/lib/design-presets';

// Seal designs
const SEAL_DESIGNS = [
  { id: 'heart' as SealDesign, name: 'Trái tim', color: '#c62828' },
  { id: 'star' as SealDesign, name: 'Ngôi sao', color: '#f57f17' },
  { id: 'crown' as SealDesign, name: 'Vương miện', color: '#f9a825' },
  { id: 'flower' as SealDesign, name: 'Hoa', color: '#e91e63' },
  { id: 'sparkle' as SealDesign, name: 'Lấp lánh', color: '#9c27b0' },
  { id: 'mail' as SealDesign, name: 'Thư', color: '#1976d2' },
];

type EnvelopePattern = string;
import { ElegantSpinner } from '@/components/ui/Loading';

interface Envelope {
  id: string;
  name: string;
  color: string;
  thumbnail: string;
  points_required: number;
  is_active: boolean;
  pattern?: EnvelopePattern;
  default_seal?: SealDesign;
  default_seal_color?: string;
}

// Helper function
function shade(hex: string, amt: number) {
  const c = (hex ?? '#c9a86c').replace('#', '');
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return hex;
  const num = parseInt(full, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (num & 255) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default function AdminEnvelopes() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEnvelope, setEditingEnvelope] = useState<Envelope | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewEnvelope, setPreviewEnvelope] = useState<Envelope | null>(null);

  const [form, setForm] = useState({
    name: '',
    color: '#c9a86c',
    thumbnail: '',
    points_required: 0,
    is_active: true,
    pattern: 'solid' as EnvelopePattern,
    default_seal: 'heart' as SealDesign,
    default_seal_color: '#c62828',
  });

  useEffect(() => {
    fetchEnvelopes();
  }, []);

  const fetchEnvelopes = async () => {
    const { data } = await supabase
      .from('envelopes')
      .select('*')
      .order('created_at', { ascending: false });
    setEnvelopes(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEnvelope) {
      await supabase.from('envelopes').update(form).eq('id', editingEnvelope.id);
    } else {
      await supabase.from('envelopes').insert([form]);
    }
    setShowModal(false);
    resetForm();
    fetchEnvelopes();
  };

  const resetForm = () => {
    setEditingEnvelope(null);
    setForm({ 
      name: '', 
      color: '#c9a86c', 
      thumbnail: '', 
      points_required: 0, 
      is_active: true,
      pattern: 'solid',
      default_seal: 'heart',
      default_seal_color: '#c62828',
    });
  };

  const handleEdit = (envelope: Envelope) => {
    setEditingEnvelope(envelope);
    setForm({
      name: envelope.name,
      color: envelope.color,
      thumbnail: envelope.thumbnail || '',
      points_required: envelope.points_required,
      is_active: envelope.is_active,
      pattern: envelope.pattern || 'solid',
      default_seal: envelope.default_seal || 'heart',
      default_seal_color: envelope.default_seal_color || '#c62828',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa phong bì này?')) {
      await supabase.from('envelopes').delete().eq('id', id);
      fetchEnvelopes();
    }
  };

  const filteredEnvelopes = envelopes.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-burgundy" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink">Phong bì</h1>
          </div>
          <p className="text-ink/60 font-vn pl-13">Quản lý các mẫu phong bì và tùy chỉnh</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowModal(true); resetForm(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition shadow-lg font-vn font-medium"
        >
          <Plus className="w-5 h-5" />
          Thêm phong bì
        </motion.button>
      </div>

      {/* Decorative Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <Feather className="w-4 h-4 text-gold/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Search */}
      <div className="bg-cream-light rounded-2xl p-4 mb-6 border border-gold/20 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
          <input
            type="text"
            placeholder="Tìm kiếm phong bì..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy/50 font-vn transition"
          />
        </div>
      </div>

      {/* Envelopes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <ElegantSpinner size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredEnvelopes.map((envelope, index) => (
            <motion.div 
              key={envelope.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-cream-light rounded-2xl p-4 border border-gold/20 shadow-sm hover:shadow-md transition group"
            >
              {/* Preview */}
            <div
                className="aspect-[4/3] rounded-xl mb-3 relative overflow-hidden cursor-pointer"
              style={{ backgroundColor: envelope.color }}
                onClick={() => setPreviewEnvelope(envelope)}
              >
                {/* Pattern overlay */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundImage: envelope.pattern && envelope.pattern !== 'solid' 
                      ? getPatternCSS(envelope.pattern, envelope.color, shade(envelope.color, -40))
                      : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
                  }} 
                />
                
              {!envelope.is_active && (
                  <div className="absolute inset-0 bg-ink/60 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-cream text-xs font-vn bg-ink/50 px-2 py-1 rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Đã ẩn
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-6 h-6 text-burgundy" />
                </div>

                {/* Pattern badge */}
                {envelope.pattern && envelope.pattern !== 'solid' && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-cream/90 rounded-full text-[10px] font-medium text-ink/70 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {ENVELOPE_PATTERNS.find(p => p.id === envelope.pattern)?.name}
                </div>
              )}
            </div>

              {/* Info */}
              <h3 className="font-vn font-semibold text-ink text-sm mb-1 truncate">{envelope.name}</h3>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-4 h-4 rounded-full border border-gold/30" 
                    style={{ backgroundColor: envelope.color }}
                  />
                  <span className="text-xs text-ink/50 font-mono">{envelope.color}</span>
                </div>
                <span className="font-medium text-burgundy text-sm">💜 {envelope.points_required}</span>
            </div>

              {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(envelope)}
                  className="flex-1 p-2 bg-gold/10 text-ink/70 rounded-lg hover:bg-gold/20 transition flex items-center justify-center gap-1"
              >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs font-vn">Sửa</span>
              </button>
              <button
                onClick={() => handleDelete(envelope.id)}
                  className="p-2 bg-burgundy/10 text-burgundy rounded-lg hover:bg-burgundy/20 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            </motion.div>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!loading && filteredEnvelopes.length === 0 && (
        <div className="text-center py-16">
          <Mail className="w-16 h-16 text-ink/20 mx-auto mb-4" />
          <p className="font-vn text-ink/50">Chưa có phong bì nào</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
      {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cream-light rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gold/20 shadow-vintage"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-ink">
                  {editingEnvelope ? 'Sửa phong bì' : 'Thêm phong bì mới'}
            </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gold/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-ink/50" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Live Preview */}
                <div className="flex justify-center p-4 bg-cream/50 rounded-xl border border-gold/20">
                  <div 
                    className="w-48 aspect-[4/3] rounded-lg relative overflow-hidden shadow-md"
                    style={{ backgroundColor: form.color }}
                  >
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        backgroundImage: form.pattern !== 'solid' 
                          ? getPatternCSS(form.pattern, form.color, shade(form.color, -40))
                          : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
                      }} 
                    />
                    {/* Mini seal preview */}
                    <div
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full shadow-md flex items-center justify-center"
                      style={{ 
                        background: `radial-gradient(circle at 30% 30%, ${shade(form.default_seal_color, 40)} 0%, ${form.default_seal_color} 50%, ${shade(form.default_seal_color, -40)} 100%)`,
                      }}
                    >
                      <span className="text-white text-xs">♥</span>
                    </div>
                  </div>
                </div>

                {/* Name */}
              <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Tên phong bì</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                    placeholder="VD: Kraft Paper"
                  required
                />
              </div>

                {/* Color */}
              <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Màu sắc</label>
                  <div className="flex gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-14 h-12 rounded-xl cursor-pointer border border-gold/20"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="flex-1 px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-mono"
                  />
                </div>
              </div>

                {/* Pattern */}
                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Họa tiết mặc định</label>
                  <div className="flex flex-wrap gap-2">
                    {ENVELOPE_PATTERNS.map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => setForm({ ...form, pattern: pat.id as EnvelopePattern })}
                        className={`px-3 py-2 rounded-lg text-sm font-vn transition ${
                          form.pattern === pat.id 
                            ? 'bg-burgundy text-cream' 
                            : 'bg-cream border border-gold/20 text-ink/70 hover:border-burgundy/30'
                        }`}
                      >
                        {pat.preview && <span className="mr-1">{pat.preview}</span>}
                        {pat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Seal */}
                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Con dấu mặc định</label>
                  <div className="flex flex-wrap gap-2">
                    {SEAL_DESIGNS.map((seal) => (
                      <button
                        key={seal.id}
                        type="button"
                        onClick={() => setForm({ ...form, default_seal: seal.id, default_seal_color: seal.color })}
                        className={`w-10 h-10 rounded-full transition ${
                          form.default_seal === seal.id 
                            ? 'ring-2 ring-offset-2 ring-burgundy scale-110' 
                            : 'hover:scale-105'
                        }`}
                        style={{ 
                          background: `radial-gradient(circle at 30% 30%, ${shade(seal.color, 40)} 0%, ${seal.color} 50%, ${shade(seal.color, -40)} 100%)`,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        }}
                        title={seal.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Points */}
              <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Giá (Tym)</label>
                <input
                  type="number"
                  value={form.points_required}
                  onChange={(e) => setForm({ ...form, points_required: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                  min="0"
                />
              </div>

                {/* Active */}
                <label className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-gold/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 text-burgundy rounded focus:ring-burgundy/30"
                />
                  <div>
                    <span className="font-vn font-medium text-ink">Hiển thị</span>
                    <p className="text-xs text-ink/50">Cho phép người dùng chọn phong bì này</p>
                  </div>
              </label>

                {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-cream border border-gold/20 text-ink/70 rounded-xl hover:bg-gold/10 transition font-vn font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                    className="flex-1 px-4 py-3 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition font-vn font-medium shadow-lg"
                >
                    {editingEnvelope ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewEnvelope && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewEnvelope(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cream-light rounded-2xl p-8 max-w-md w-full border border-gold/20 shadow-vintage"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold text-ink mb-6 text-center">{previewEnvelope.name}</h3>
              
              <div className="flex justify-center mb-6">
                <Envelope3D
                  color={previewEnvelope.color}
                  pattern={previewEnvelope.pattern || 'solid'}
                  sealDesign={previewEnvelope.default_seal || 'heart'}
                  sealColor={previewEnvelope.default_seal_color || '#c62828'}
                  isOpen={false}
                  isFlipped={true}
                />
          </div>

              <button
                onClick={() => setPreviewEnvelope(null)}
                className="w-full py-3 bg-burgundy text-cream rounded-xl font-vn font-medium hover:bg-burgundy-dark transition"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
