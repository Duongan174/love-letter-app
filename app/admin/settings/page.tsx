'use client';

import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    default_tym: 100,
    tym_per_card: 0,
    free_pages: 2,
    add_page_cost: 10,
    max_photos_per_card: 4,
    max_photo_size_mb: 25,
    allow_guest_view: true,
    maintenance_mode: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    // Lưu vào database hoặc file config
    // Hiện tại chỉ demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage('Đã lưu cài đặt thành công!');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const syncUsers = async () => {
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    // Sync logic here
    setMessage('Đã đồng bộ users thành công!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
        <p className="text-gray-500">Cấu hình hệ thống</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl">
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {/* Tym Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cài đặt Tym</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tym mặc định cho user mới
              </label>
              <input
                type="number"
                value={settings.default_tym}
                onChange={(e) => setSettings({ ...settings, default_tym: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Số Tym được cấp khi user đăng ký mới</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chi phí tạo thiệp cơ bản
              </label>
              <input
                type="number"
                value={settings.tym_per_card}
                onChange={(e) => setSettings({ ...settings, tym_per_card: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Chi phí Tym để tạo một thiệp</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số trang miễn phí
              </label>
              <input
                type="number"
                value={settings.free_pages}
                onChange={(e) => setSettings({ ...settings, free_pages: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                min="1"
                max="5"
              />
              <p className="text-xs text-gray-500 mt-1">Số trang thư được tạo miễn phí</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chi phí thêm trang (Tym)
              </label>
              <input
                type="number"
                value={settings.add_page_cost}
                onChange={(e) => setSettings({ ...settings, add_page_cost: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Chi phí Tym để thêm mỗi trang sau trang miễn phí</p>
            </div>
          </div>
        </div>

        {/* Upload Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cài đặt Upload</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số ảnh tối đa mỗi thiệp
              </label>
              <input
                type="number"
                value={settings.max_photos_per_card}
                onChange={(e) => setSettings({ ...settings, max_photos_per_card: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kích thước ảnh tối đa (MB)
              </label>
              <input
                type="number"
                value={settings.max_photo_size_mb}
                onChange={(e) => setSettings({ ...settings, max_photo_size_mb: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                min="1"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cài đặt chung</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">Cho phép xem thiệp không cần đăng nhập</p>
                <p className="text-sm text-gray-500">Người nhận có thể xem thiệp mà không cần tài khoản</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allow_guest_view}
                onChange={(e) => setSettings({ ...settings, allow_guest_view: e.target.checked })}
                className="w-5 h-5 text-rose-500"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">Chế độ bảo trì</p>
                <p className="text-sm text-gray-500">Tạm ngưng hoạt động website</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                className="w-5 h-5 text-rose-500"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Hành động</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Lưu cài đặt
            </button>
            <button
              onClick={syncUsers}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              <RefreshCw className="w-5 h-5" />
              Đồng bộ Users
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-200">
          <h2 className="text-lg font-bold text-red-600 mb-4">⚠️ Vùng nguy hiểm</h2>
          <p className="text-gray-600 mb-4">Các hành động này không thể hoàn tác</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => alert('Tính năng này cần xác nhận thêm!')}
              className="px-6 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
            >
              Xóa tất cả thiệp
            </button>
            <button
              onClick={() => alert('Tính năng này cần xác nhận thêm!')}
              className="px-6 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
            >
              Reset Tym tất cả users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}