// app/cards/[id]/edit/page.tsx

import { createClient } from '@/lib/supabase/server';
import CardEditor from '@/components/card/CardEditor';

interface PageProps {
  params: { id: string };
}

export default async function EditCardPage({ params }: PageProps) {
  const supabase = createClient();

  // 1️⃣ Lấy card + join dữ liệu liên quan
  const { data: card, error } = await supabase
    .from('cards')
    .select(`
      id,
      message,
      signature,
      template:card_templates (
        id,
        name,
        animation_url
      ),
      music:music_tracks (
        id,
        name,
        audio_url
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !card) {
    return <div className="p-10">Không tìm thấy thiệp</div>;
  }

  // 2️⃣ Lấy danh sách template & music để chọn
  const { data: templates } = await supabase
    .from('card_templates')
    .select('id, name, animation_url')
    .eq('is_active', true);

  const { data: musics } = await supabase
    .from('music_tracks')
    .select('id, name, audio_url')
    .eq('is_active', true);

  return (
    <CardEditor
      cardId={card.id}
      initialCard={card}
      templates={templates || []}
      musics={musics || []}
    />
  );
}
