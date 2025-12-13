'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface TextEditorProps {
  content: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
}

/**
 * Dynamic import: ensure Tiptap only runs on client (ssr: false).
 * The inner component sets `immediatelyRender: false` to avoid SSR/hydration mismatches.
 */
const TiptapClient = dynamic(
  async () => {
    const ReactClient = await import('react');
    const { useEditor, EditorContent } = await import('@tiptap/react');
    const StarterKitModule = await import('@tiptap/starter-kit');
    const StarterKit = (StarterKitModule && (StarterKitModule as any).default) || StarterKitModule;
    const TextAlignModule = await import('@tiptap/extension-text-align');
    const TextAlign = (TextAlignModule && (TextAlignModule as any).default) || TextAlignModule;
    const UnderlineModule = await import('@tiptap/extension-underline');
    const UnderlineExtension = (UnderlineModule && (UnderlineModule as any).default) || UnderlineModule;

    const lucide = await import('lucide-react');
    const { Bold, Italic, List, ListOrdered, Strikethrough, AlignLeft, AlignCenter, AlignRight, Underline } = lucide as any;

    const MenuBar = ({ editor }: { editor: any }) => {
      const { useCallback } = ReactClient;
      const setAlignment = useCallback(
        (alignment: string) => {
          if (editor) {
            editor.chain().focus().setTextAlign(alignment).run();
          }
        },
        [editor]
      );

      if (!editor) return null;

      return (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-300 rounded-t-lg">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1 rounded-md transition ${editor.isActive('bold') ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <Bold size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1 rounded-md transition ${editor.isActive('italic') ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <Italic size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-1 rounded-md transition ${editor.isActive('strike') ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <Strikethrough size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded-md transition ${editor.isActive('underline') ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <Underline size={18} />
          </button>

          <div className="mx-2 border-l border-gray-300" />

          <button
            onClick={() => setAlignment('left')}
            className={`p-1 rounded-md transition ${editor.isActive({ textAlign: 'left' }) ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <AlignLeft size={18} />
          </button>

          <button
            onClick={() => setAlignment('center')}
            className={`p-1 rounded-md transition ${editor.isActive({ textAlign: 'center' }) ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <AlignCenter size={18} />
          </button>

          <button
            onClick={() => setAlignment('right')}
            className={`p-1 rounded-md transition ${editor.isActive({ textAlign: 'right' }) ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <AlignRight size={18} />
          </button>

          <div className="mx-2 border-l border-gray-300" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded-md transition ${editor.isActive('bulletList') ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <List size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded-md transition ${editor.isActive('orderedList') ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            type="button"
          >
            <ListOrdered size={18} />
          </button>
        </div>
      );
    };

    return function TiptapInner({ content, onChange, placeholder }: any) {
      const { useEffect } = ReactClient;

      // IMPORTANT: immediatelyRender: false để tránh SSR/hydration mismatch (Next.js).
      const editor = (useEditor as any)({
        immediatelyRender: false,
        // (tuỳ chọn thêm) shouldRerenderOnTransaction: false, // uncomment nếu muốn ngăn re-render trên mọi transaction
        extensions: [
          StarterKit,
          (TextAlign as any).configure ? (TextAlign as any).configure({ types: ['heading', 'paragraph'] }) : TextAlign,
          UnderlineExtension,
        ],
        content: content || '',
        onUpdate: ({ editor }: any) => {
          if (typeof onChange === 'function') {
            onChange(editor.getHTML());
          }
        },
        editorProps: {
          attributes: {
            class: 'prose max-w-none focus:outline-none p-4 min-h-[150px] bg-yellow-50/50 font-serif',
            style: 'font-family: var(--font-handwriting);',
          },
        },
      });

      useEffect(() => {
        return () => {
          if (editor && typeof editor.destroy === 'function') {
            editor.destroy();
          }
        };
      }, [editor]);

      return (
        <div className="border border-gray-300 rounded-lg shadow-inner flex flex-col h-full">
          <MenuBar editor={editor} />
          <div className="flex-1 overflow-y-auto">
            {editor ? <EditorContent editor={editor} /> : <div className="p-4 text-gray-500">{placeholder || 'Đang tải trình soạn thảo...'}</div>}
          </div>
        </div>
      );
    };
  },
  { ssr: false, loading: () => <div className="p-4 text-gray-500">Đang tải trình soạn thảo...</div> }
);

export default function TextEditor(props: TextEditorProps) {
  return <TiptapClient {...props} />;
}
