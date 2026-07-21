// src/App.jsx
import { useState } from 'react';
import Editor from './Editor';

export default function App() {
  // 예시 설정집 및 원고 데이터
  const [documents, setDocuments] = useState([
    { id: 1, title: '📜 세계관: 마법 체계', content: '<h3>마법 체계</h3><p>이 세계관의 마법은 마나의 순환에 기반한다.</p>' },
    { id: 2, title: '👤 인물: 김광현 (주인공)', content: '<h3>강이현</h3><p>나이: 19세 / 특기: 검술 및 아티팩트 해독</p>' },
    { id: 3, title: '✍️ 원고: 1화 초안', content: '<h3>1화. 시작되는 무대</h3><p>바람이 서늘하게 불어오는 봉은사 앞마당에서...</p>' },
  ]);

  const [activeDocId, setActiveDocId] = useState(1);

  const activeDoc = documents.find(doc => doc.id === activeDocId);

  const handleContentChange = (newContent) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === activeDocId ? { ...doc, content: newContent } : doc))
    );
  };

  return (
    <div className="studio-layout">
      {/* 사이드바 */}
      <aside className="sidebar">
        <h2>📚 '전생했더니, 세상이 망했다.' 설정집</h2>
        <ul className="doc-list">
          {documents.map(doc => (
            <li
              key={doc.id}
              className={`doc-item ${doc.id === activeDocId ? 'active' : ''}`}
              onClick={() => setActiveDocId(doc.id)}
            >
              {doc.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* 메인 에디터 영역 */}
      <main className="main-content">
        <Editor key={activeDocId} content={activeDoc?.content} onChange={handleContentChange} />
      </main>
    </div>
  );
}