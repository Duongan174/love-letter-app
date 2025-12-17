'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Card {
  id: string;
  recipient_name: string;
  sender_name: string;
  content: string;
  view_count: number;
  status: string;
  created_at: string;
  user_id: string;
}

export default function AdminCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const { data } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });
    setCards(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thiệp này?')) {
      await supabase.from('cards').delete().eq('id', id);
      fetchCards();
    }
  };

  const filteredCards = cards.filter(c =>
    c.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sender_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalViews = cards.reduce((sum, c) => sum + (c.view_count || 0), 0);
  const todayCount = cards.filter(c => 
    new Date(c.created_at).toDateString() === new Date().toDateString()
  ).length;

  const openCard = (id: string) => {
    window.open('/card/' + id, '_blank');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Thiệp đã tạo</h1>
        <p className="text-gray-500">Xem tất cả thiệp trong hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Tổng thiệp</p>
          <p className="text-2xl font-bold text-gray-800">{cards.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Tổng lượt xem</p>
          <p className="text-2xl font-bold text-gray-800">{totalViews}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Hôm nay</p>
          <p className="text-2xl font-bold text-gray-800">{todayCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Người gửi</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Người nhận</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Lượt xem</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Ngày tạo</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{card.sender_name}</td>
                <td className="px-6 py-4 text-gray-600">{card.recipient_name}</td>
                <td className="px-6 py-4 text-gray-600">{card.view_count || 0}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(card.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openCard(card.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      title="Xem thiệp"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedCard(card)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      title="Chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Xóa"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chi tiết thiệp</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Người gửi</p>
                <p className="font-medium text-gray-800">{selectedCard.sender_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Người nhận</p>
                <p className="font-medium text-gray-800">{selectedCard.recipient_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nội dung</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedCard.content || 'Không có nội dung'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Lượt xem</p>
                  <p className="font-medium">{selectedCard.view_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{new Date(selectedCard.created_at).toLocaleString('vi-VN')}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedCard(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Đóng
              </button>
              <button
                onClick={() => openCard(selectedCard.id)}
                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
              >
                Xem thiệp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}