// app/admin/cards/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminCardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10; // Giới hạn 10 dòng mỗi trang

  useEffect(() => {
    fetchCards();
  }, [page]);

  const fetchCards = async () => {
    setLoading(true);
    // Tính toán range: Ví dụ trang 1 (0-9), trang 2 (10-19)
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      const { data, count, error } = await supabase
        .from('cards')
        .select('*, users(name, email)', { count: 'exact' }) // Lấy thêm count để biết tổng số trang
        .order('created_at', { ascending: false })
        .range(from, to); // Chỉ tải trong khoảng này

      if (error) throw error;

      setCards(data || []);
      if (count) setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thiệp này không?')) return;
    try {
      await supabase.from('cards').delete().eq('id', id);
      fetchCards(); // Tải lại trang hiện tại
    } catch (error) {
      console.error('Lỗi xóa:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Thiệp</h1>
          <p className="text-gray-500">Danh sách tất cả thiệp đã được tạo</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Người gửi</div>
          <div className="col-span-3">Người nhận</div>
          <div className="col-span-3">Ngày tạo</div>
          <div className="col-span-1 text-center">Lượt xem</div>
          <div className="col-span-2 text-right">Hành động</div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Đang tải dữ liệu...
          </div>
        ) : cards.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có dữ liệu.</div>
        ) : (
          // Data Rows
          <div className="divide-y divide-gray-50">
            {cards.map((card) => (
              <div key={card.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition">
                <div className="col-span-3">
                  <p className="font-medium text-gray-900">{card.sender_name}</p>
                  <p className="text-xs text-gray-400">{card.users?.email}</p>
                </div>
                <div className="col-span-3 font-medium text-gray-700">
                  {card.recipient_name}
                </div>
                <div className="col-span-3 text-sm text-gray-500">
                  {new Date(card.created_at).toLocaleDateString('vi-VN')}
                </div>
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                    {card.view_count}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Link 
                    href={`/card/${card.id}`} 
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(card.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500">
            Trang {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition"
            >
              Trước
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}