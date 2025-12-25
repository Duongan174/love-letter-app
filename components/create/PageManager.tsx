// components/create/PageManager.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, BookOpen, Eye, Edit, Heart } from 'lucide-react';

interface PageManagerProps {
  pages: string[];
  activePage: number;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onRemovePage: (index: number) => void;
  canAddPage: boolean;
  addPageCost: number;
  userTym: number;
}

export default function PageManager({
  pages,
  activePage,
  onPageChange,
  onAddPage,
  onRemovePage,
  canAddPage,
  addPageCost,
  userTym,
}: PageManagerProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="bg-gradient-to-br from-amber-50/80 to-white rounded-2xl p-5 border border-amber-200/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">Quản lý trang</h3>
            <p className="text-xs text-amber-700/60">Tối đa 2 trang miễn phí</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`p-2.5 rounded-lg transition-all shadow-sm ${
              viewMode === 'edit' 
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md' 
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`p-2.5 rounded-lg transition-all shadow-sm ${
              viewMode === 'preview' 
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md' 
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
            title="Xem trước"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-3 mb-4">
        {pages.map((_, index) => {
          const isActive = index === activePage;
          const isFree = index < 2;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm ${
                isActive
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg scale-105'
                  : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200 hover:border-amber-300'
              }`}
            >
              <button
                type="button"
                onClick={() => onPageChange(index)}
                className="flex items-center gap-2"
              >
                <span>Trang {index + 1}</span>
                {!isFree && (
                  <span className="text-xs opacity-75">💜</span>
                )}
              </button>
              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePage(index);
                  }}
                  className={`ml-1 p-1 rounded-full transition ${
                    isActive 
                      ? 'hover:bg-white/20' 
                      : 'hover:bg-amber-100'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          );
        })}

        {/* Add Page Button */}
        <motion.button
          type="button"
          onClick={onAddPage}
          disabled={!canAddPage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            canAddPage
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-2 border-dashed border-amber-300 hover:border-amber-400'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed border-gray-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm trang</span>
          {pages.length >= 2 && (
            <span className="text-xs px-2 py-0.5 bg-amber-500 text-white rounded-full">
              💜 {addPageCost}
            </span>
          )}
        </motion.button>
      </div>

      {/* Cost Warning */}
      {pages.length >= 2 && !canAddPage && (
        <div className="mt-3 p-4 bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <Heart className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-sm text-amber-800">
            Bạn cần <span className="font-semibold">{addPageCost} Tym</span> để thêm trang mới. 
            Hiện tại bạn có <span className="font-semibold">{userTym} Tym</span>.
          </p>
        </div>
      )}
    </div>
  );
}

