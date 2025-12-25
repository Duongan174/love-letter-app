'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Gift, Calendar, Bell, ArrowRight, 
  Mail, Send, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/ui/Loading';

interface EventRecord {
  id: string;
  card_id: string;
  event_type: 'received' | 'sent';
  sender_name: string;
  recipient_name: string;
  event_date: string;
  gift_sent: boolean;
  gift_type?: string;
  reminder_date?: string;
  card: {
    id: string;
    content: string;
    created_at: string;
  };
}

export default function EventsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');

  useEffect(() => {
    if (!user) return;

    loadEvents();
  }, [user, filter]);

  const loadEvents = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load received cards
      const { data: receivedCards } = await supabase
        .from('cards')
        .select('*, sender:users!cards_user_id_fkey(name)')
        .eq('recipient_email', user.email)
        .order('created_at', { ascending: false });

      // Load sent cards
      const { data: sentCards } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Transform to event records
      const receivedEvents: EventRecord[] = (receivedCards || []).map(card => ({
        id: `received-${card.id}`,
        card_id: card.id,
        event_type: 'received',
        sender_name: (card.sender as any)?.name || card.sender_name || 'Người gửi',
        recipient_name: card.recipient_name || user.name || '',
        event_date: card.created_at,
        gift_sent: false, // Check from card_gifts table
        card: {
          id: card.id,
          content: card.content || '',
          created_at: card.created_at,
        },
      }));

      const sentEvents: EventRecord[] = (sentCards || []).map(card => ({
        id: `sent-${card.id}`,
        card_id: card.id,
        event_type: 'sent',
        sender_name: user.name || '',
        recipient_name: card.recipient_name || 'Người nhận',
        event_date: card.created_at,
        gift_sent: false,
        card: {
          id: card.id,
          content: card.content || '',
          created_at: card.created_at,
        },
      }));

      let allEvents = [...receivedEvents, ...sentEvents];
      
      // Filter
      if (filter === 'received') {
        allEvents = receivedEvents;
      } else if (filter === 'sent') {
        allEvents = sentEvents;
      }

      // Sort by date
      allEvents.sort((a, b) => 
        new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
      );

      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysSince = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getReminderMessage = (event: EventRecord) => {
    const days = getDaysSince(event.event_date);
    
    if (event.event_type === 'received') {
      if (days >= 365) {
        return `Đã ${Math.floor(days / 365)} năm kể từ khi nhận thiệp. Có thể gửi lại một món quà nhỏ!`;
      } else if (days >= 30) {
        return `Đã ${Math.floor(days / 30)} tháng. Nhớ gửi lại quà nhé!`;
      }
    }
    
    return null;
  };

  if (authLoading || loading) {
    return <Loading text="Đang tải sổ nợ cảm xúc..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500" />
            Sổ Nợ Cảm Xúc
          </h1>
          <p className="text-gray-600">
            Quản lý thiệp đã nhận và gửi, không bao giờ quên "có đi có lại"
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          {(['all', 'received', 'sent'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                filter === f
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' && 'Tất cả'}
              {f === 'received' && 'Đã nhận'}
              {f === 'sent' && 'Đã gửi'}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có thiệp nào</p>
            </div>
          ) : (
            events.map((event) => {
              const days = getDaysSince(event.event_date);
              const reminder = getReminderMessage(event);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {event.event_type === 'received' ? (
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Gift className="w-6 h-6 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                            <Send className="w-6 h-6 text-rose-600" />
                          </div>
                        )}
                        
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {event.event_type === 'received' 
                              ? `Nhận từ ${event.sender_name}`
                              : `Gửi cho ${event.recipient_name}`
                            }
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString('vi-VN')}
                              {' • '}
                              {days === 0 ? 'Hôm nay' : `${days} ngày trước`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reminder */}
                      {reminder && !event.gift_sent && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-amber-800">
                              Nhắc nhở thông minh
                            </p>
                            <p className="text-sm text-amber-700">{reminder}</p>
                            <button className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                              Gửi quà ngay
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Gift Status */}
                      {event.gift_sent && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Đã gửi quà</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={`/card/${event.card_id}`}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition flex items-center gap-2"
                    >
                      <span>Xem thiệp</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

