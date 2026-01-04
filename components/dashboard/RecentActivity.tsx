// components/dashboard/RecentActivity.tsx
/**
 * Recent Activity Feed Component
 * Hiển thị các hoạt động gần đây của user
 */

'use client';

import { motion } from 'framer-motion';
import { Heart, Mail, Clock, Send, Eye } from 'lucide-react';
import Link from 'next/link';
// Helper function để format thời gian
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}

interface ActivityItem {
  id: string;
  type: 'card_created' | 'card_viewed' | 'draft_saved' | 'card_sent';
  title: string;
  description: string;
  timestamp: Date;
  link?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor?: string;
}

interface RecentActivityProps {
  cards: Array<{
    id: string;
    recipient_name: string;
    created_at: string;
    view_count: number;
  }>;
  drafts: Array<{
    id: string;
    updated_at: string;
    created_at?: string;
    card_templates?: { name: string };
  }>;
  limit?: number;
}

export default function RecentActivity({ cards, drafts, limit = 10 }: RecentActivityProps) {
  // Tạo activity items từ cards và drafts
  const activities: ActivityItem[] = [];

  // Thêm activities từ cards
  cards.slice(0, 5).forEach((card) => {
      activities.push({
        id: `card-${card.id}`,
        type: 'card_created',
        title: `Đã tạo thiệp cho ${card.recipient_name || 'người nhận'}`,
        description: `Thiệp đã được tạo`,
        timestamp: new Date(card.created_at),
        link: `/card/${card.id}`,
        icon: Heart,
        color: 'text-burgundy',
        bgColor: 'bg-burgundy/10',
      });

    if (card.view_count > 0) {
      activities.push({
        id: `view-${card.id}`,
        type: 'card_viewed',
        title: `Thiệp đã được xem ${card.view_count} lần`,
        description: `Thiệp cho ${card.recipient_name || 'người nhận'}`,
        timestamp: new Date(card.created_at), // Approximate
        link: `/card/${card.id}`,
        icon: Eye,
        color: 'text-forest',
        bgColor: 'bg-forest/10',
      });
    }
  });

  // Thêm activities từ drafts
  drafts.slice(0, 5).forEach((draft) => {
      activities.push({
        id: `draft-${draft.id}`,
        type: 'draft_saved',
        title: `Đã lưu nháp: ${draft.card_templates?.name || 'Thiệp chưa đặt tên'}`,
        description: 'Nháp đã được lưu tự động',
        timestamp: new Date(draft.updated_at || draft.created_at || Date.now()),
        link: `/create?draftId=${draft.id}`,
        icon: Clock,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
      });
  });

  // Sắp xếp theo timestamp (mới nhất trước)
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Giới hạn số lượng
  const displayActivities = activities.slice(0, limit);

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8 text-ink/60 dark:text-cream-light/60">
        <p className="text-sm">Chưa có hoạt động nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayActivities.map((activity, index) => {
        const Icon = activity.icon;
        const timeAgo = formatTimeAgo(activity.timestamp);

        const content = (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-start gap-3 p-3 rounded-lg
              ${activity.link ? 'hover:bg-cream-dark dark:hover:bg-ink/50 cursor-pointer transition-colors' : ''}
            `}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor || 'bg-ink/10 dark:bg-gold/20'} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink dark:text-cream-light truncate">
                {activity.title}
              </p>
              <p className="text-xs text-ink/60 dark:text-cream-light/60 mt-0.5">
                {activity.description}
              </p>
              <p className="text-xs text-ink/40 dark:text-cream-light/40 mt-1">
                {timeAgo}
              </p>
            </div>
          </motion.div>
        );

        return activity.link ? (
          <Link key={activity.id} href={activity.link}>
            {content}
          </Link>
        ) : (
          <div key={activity.id}>{content}</div>
        );
      })}
    </div>
  );
}

