// src/components/NovelEditor.jsx
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

export default function NovelEditor({ episode, onSave }) {
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: '여기에 웹소설 본문을 입력하세요...',
      }),
    ],
    content: episode ? episode.content : '',
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.replace(/\s/g, '').length); // 공백 제외 글자 수
    },
  });

  // 선택된 회차가 바뀌면 제목 및 에디터 내용 업데이트
  useEffect(() => {
    if (episode) {
      setTitle(episode.title || '');
      if (editor && episode.content !== undefined) {
        editor.commands.setContent(episode.content);
        const text = editor.getText();
        setWordCount(text.replace(/\s/g, '').length);
      }
    }
  }, [episode, editor]);

  if (!editor) {
    return <div>에디터 로딩 중...</div>;
  }

  const handleSave = () => {
    const htmlContent = editor.getHTML();
    onSave({
      ...episode,
      title,
      content: htmlContent,
      wordCount,
    });
    alert('회차가 성공적으로 저장되었습니다!');
  };

  // 원고지 매수 계산 (200자 기준)
  const manuscriptPages = (wordCount / 200).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      {/* 툴바 & 헤더 영역 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="회차 제목을 입력하세요 (예: 1화. 전설의 시작)"
          style={{
            width: '100%',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            padding: '8px 12px',
            marginBottom: '12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            outline: 'none',
          }}
        />

        {/* 에디터 포맷 툴바 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={{ padding: '6px 12px', fontWeight: editor.isActive('bold') ? 'bold' : 'normal', background: editor.isActive('bold') ? '#e2e8f0' : '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            <b>B</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{ padding: '6px 12px', fontStyle: 'italic', background: editor.isActive('italic') ? '#e2e8f0' : '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            <i>I</i>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            style={{ padding: '6px 12px', background: editor.isActive({ textAlign: 'left' }) ? '#e2e8f0' : '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            좌측 정렬
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            style={{ padding: '6px 12px', background: editor.isActive({ textAlign: 'center' }) ? '#e2e8f0' : '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            중앙 정렬
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              공백 제외: <strong>{wordCount.toLocaleString()}</strong> 자 | 원고지 약 <strong>{manuscriptPages}</strong> 매
            </span>
            <button
              onClick={handleSave}
              style={{ padding: '8px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>

      {/* 에디터 본문 작성 영역 */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', cursor: 'text' }} onClick={() => editor.chain().focus()}>
        <EditorContent editor={editor} style={{ minHeight: '100%', outline: 'none', fontSize: '1.1rem', lineHeight: '1.8' }} />
      </div>
    </div>
  );
}