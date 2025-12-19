'use client';

import { useState } from 'react';
import CardRenderer from './CardRenderer';

interface CardDraft {
  id: string;
  content: string;
  sender_name: string;
  recipient_name: string;
  font_style: string;
  text_align: string;
}

interface Props {
  draft: CardDraft;
}

export default function CardEditor({ draft }: Props) {
  const [content, setContent] = useState(draft.content || '');
  const [senderName, setSenderName] = useState(draft.sender_name || '');

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* LEFT: FORM */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Soạn nội dung</h2>

        <textarea
          className="w-full border rounded p-2"
          rows={6}
          placeholder="Nhập lời nhắn…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Tên người gửi"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
        />
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <div>
        <CardRenderer
          content={content}
          senderName={senderName}
          fontStyle={draft.font_style}
          textAlign={draft.text_align}
        />
      </div>
    </div>
  );
}
