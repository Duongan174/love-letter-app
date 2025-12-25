// app/cards/[id]/edit/page.tsx

import { createClient } from '@/lib/supabase/server';
import CardEditor from '@/components/card/CardEditor';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCardPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  // 1️⃣ Lấy card + join dữ liệu liên quan
  const { data: card, error } = await supabase
    .from('cards')
    .select(`
      id,
      content,
      sender_name,
      recipient_name,
      font_style,
      text_align
    `)
    .eq('id', id)
    .single();

  if (error || !card) {
    return <div className="p-10">Không tìm thấy thiệp</div>;
  }

  // Transform card data to match CardEditor's draft interface
  const draft = {
    id: card.id,
    content: card.content || '',
    sender_name: card.sender_name || '',
    recipient_name: card.recipient_name || '',
    font_style: card.font_style || 'font-dancing',
    text_align: card.text_align || 'left',
  };

  return <CardEditor draft={draft} />;
}
