// components/create/PageManager.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, BookOpen, Heart, FileText, Image as ImageIcon, GripVertical } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import Modal from '@/components/ui/Modal';

export type PageType = 'text' | 'image'; // Sau này có thể thêm 'mixed'

interface PageManagerProps {
  pages: string[];
  activePage: number;
  onPageChange: (index: number) => void;
  onAddPage: (type?: PageType) => void;
  onRemovePage: (index: number) => void;
  onReorderPages?: (newOrder: string[]) => void; // ✅ Callback để reorder với page contents
  canAddPage: boolean;
  addPageCost: number;
  userTym: number;
}

// ✅ Draggable Page Item Component
function DraggablePageItem({
  index,
  pageNumber,
  isActive,
  isFree,
  onPageChange,
  onRemovePage,
  canRemove,
  onMove,
}: {
  index: number;
  pageNumber: number; // ✅ Số thứ tự ban đầu (giữ nguyên)
  isActive: boolean;
  isFree: boolean;
  onPageChange: (index: number) => void;
  onRemovePage: (index: number) => void;
  canRemove: boolean;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'page-item',
    item: () => ({ index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'page-item',
    hover: (item: { index: number }, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = useCallback((node: HTMLDivElement | null) => {
    drop(drag(node));
  }, [drag, drop]);

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: isDragging ? 'grabbing' : 'grab' }}
      className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm ${
        isActive
          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg scale-105'
          : isOver
          ? 'bg-amber-100 border-2 border-amber-400'
          : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200 hover:border-amber-300'
      }`}
    >
      {/* Drag Handle Icon */}
      <div className="pointer-events-none">
        <GripVertical className={`w-4 h-4 ${isActive ? 'text-white/70' : 'text-amber-600/50'}`} />
      </div>
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPageChange(index);
        }}
        className="flex items-center gap-2 flex-1"
      >
        <span>Trang {pageNumber}</span>
        {!isFree && (
          <span className="text-xs opacity-75">💜</span>
        )}
      </button>
      
      {canRemove && (
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
    </div>
  );
}

export default function PageManager({
  pages,
  activePage,
  onPageChange,
  onAddPage,
  onRemovePage,
  onReorderPages,
  canAddPage,
  addPageCost,
  userTym,
}: PageManagerProps) {
  const [showPageTypeModal, setShowPageTypeModal] = useState(false);
  
  // ✅ Lưu số thứ tự ban đầu của mỗi trang (giữ nguyên khi reorder)
  const [pageNumbers, setPageNumbers] = useState<number[]>(() => 
    pages.map((_, i) => i + 1)
  );
  
  const prevPagesLengthRef = useRef(pages.length);
  
  // ✅ Sync pageNumbers khi số lượng pages thay đổi (thêm/xóa trang)
  useEffect(() => {
    const currentLength = pages.length;
    const prevLength = prevPagesLengthRef.current;
    
    if (currentLength > prevLength) {
      // Thêm trang mới - thêm số thứ tự mới
      setPageNumbers(prev => [...prev, currentLength]);
    } else if (currentLength < prevLength) {
      // Xóa trang - xóa số thứ tự tương ứng
      setPageNumbers(prev => prev.slice(0, currentLength));
    }
    
    prevPagesLengthRef.current = currentLength;
  }, [pages.length]);

  // ✅ Handle page type selection
  const handleAddPageWithType = (type: PageType) => {
    setShowPageTypeModal(false);
    onAddPage(type);
  };

  // ✅ Handle drag move - giữ nguyên số thứ tự ban đầu
  const handleMove = useCallback((dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex || !onReorderPages) return;
    
    // Reorder pages array
    const reorderedPages = [...pages];
    const [draggedItem] = reorderedPages.splice(dragIndex, 1);
    reorderedPages.splice(hoverIndex, 0, draggedItem);
    
    // ✅ Reorder pageNumbers để giữ số thứ tự ban đầu đi theo content
    const reorderedPageNumbers = [...pageNumbers];
    const [draggedPageNumber] = reorderedPageNumbers.splice(dragIndex, 1);
    reorderedPageNumbers.splice(hoverIndex, 0, draggedPageNumber);
    setPageNumbers(reorderedPageNumbers);
    
    // Call callback with reordered pages
    onReorderPages(reorderedPages);
  }, [pages, pageNumbers, onReorderPages]);

  return (
    <>
      <div className="bg-gradient-to-br from-amber-50/80 to-white rounded-2xl p-5 border border-amber-200/50 shadow-lg">
          <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">Quản lý trang</h3>
              <p className="text-xs text-amber-700/60">Tối đa 2 trang miễn phí</p>
            </div>
          </div>
        </div>

        {/* Page Tabs với Drag & Drop */}
        <div className="flex flex-wrap gap-3 mb-4">
          {pages.map((_, index) => {
            const isActive = index === activePage;
            const isFree = index < 2;
            const pageNumber = pageNumbers[index] || (index + 1); // ✅ Dùng số thứ tự ban đầu
            return (
              <DraggablePageItem
                key={index}
                index={index}
                pageNumber={pageNumber}
                isActive={isActive}
                isFree={isFree}
                onPageChange={onPageChange}
                onRemovePage={onRemovePage}
                canRemove={pages.length > 1}
                onMove={handleMove}
              />
            );
          })}

          {/* Add Page Button */}
          <motion.button
            type="button"
            onClick={() => setShowPageTypeModal(true)}
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
            <span>Tạo trang</span>
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

      {/* ✅ Modal chọn loại trang */}
      <Modal
        isOpen={showPageTypeModal}
        onClose={() => setShowPageTypeModal(false)}
        title="Chọn loại trang"
        subtitle="Bạn muốn tạo trang văn bản hay trang ảnh?"
        size="md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Trang văn bản */}
          <motion.button
            onClick={() => handleAddPageWithType('text')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Trang văn bản</h3>
                <p className="text-sm text-gray-600 mt-1">Viết lời nhắn yêu thương</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Soạn thảo nội dung với nhiều tùy chọn định dạng, màu sắc và họa tiết
            </p>
          </motion.button>

          {/* Trang ảnh */}
          <motion.button
            onClick={() => handleAddPageWithType('image')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white hover:border-rose-400 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Trang ảnh</h3>
                <p className="text-sm text-gray-600 mt-1">Thêm ảnh kỷ niệm</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Tải lên và chỉnh sửa ảnh với khung ảnh đẹp mắt
            </p>
          </motion.button>
        </div>
      </Modal>
    </>
  );
}
