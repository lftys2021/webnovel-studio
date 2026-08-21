// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './api/authApi';
import NovelEditor from './components/NovelEditor';
import './css/App.css';

export default function App() {
  const navigate = useNavigate();

  // 목업 데이터: 소설 및 회차
  const [episodes, setEpisodes] = useState([
    {
      id: 'ep-1',
      episodeNum: 1,
      title: '1화. 회귀했더니 쪼렙이다',
      content: '<p>마왕과의 최종전. 내 칼이 그의 심장을 뚫었지만, 그 역시 내 목을 노렸다.</p><p>"다시 시작된다..."</p>',
      wordCount: 52,
    },
    {
      id: 'ep-2',
      episodeNum: 2,
      title: '2화. 상태창이 미쳤다',
      content: '<p>눈을 떴을 때 내 앞에 나타난 것은 푸르스름한 상태창이었다.</p>',
      wordCount: 30,
    },
  ]);

  const [selectedEpisode, setSelectedEpisode] = useState(episodes[0]);

  // 회차 추가
  const handleAddEpisode = () => {
    const newEpNum = episodes.length + 1;
    const newEpisode = {
      id: `ep-${Date.now()}`,
      episodeNum: newEpNum,
      title: `${newEpNum}화. 제목 없음`,
      content: '<p>새로운 회차의 본문을 작성해 보세요.</p>',
      wordCount: 0,
    };
    setEpisodes([...episodes, newEpisode]);
    setSelectedEpisode(newEpisode);
  };

  // 회차 저장
  const handleSaveEpisode = (updatedEpisode) => {
    setEpisodes(episodes.map((ep) => (ep.id === updatedEpisode.id ? updatedEpisode : ep)));
    setSelectedEpisode(updatedEpisode);
  };

  // 회차 삭제
  const handleDeleteEpisode = (id, e) => {
    e.stopPropagation();
    if (window.confirm('해당 회차를 삭제하시겠습니까?')) {
      const filtered = episodes.filter((ep) => ep.id !== id);
      setEpisodes(filtered);
      if (selectedEpisode?.id === id && filtered.length > 0) {
        setSelectedEpisode(filtered[0]);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f1f3f5' }}>
      {/* 1. 좌측 메뉴: 회차 목록 */}
      <aside style={{ width: '280px', background: '#1e293b', color: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
            📚 회차 목록
          </h2>
          <button
            onClick={handleAddEpisode}
            style={{ width: '100%', padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '16px' }}
          >
            + 새 회차 쓰기
          </button>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
            {episodes.map((ep) => (
              <li
                key={ep.id}
                onClick={() => setSelectedEpisode(ep)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedEpisode?.id === ep.id ? '#334155' : 'transparent',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{ep.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                    {ep.wordCount ? ep.wordCount.toLocaleString() : 0}자
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteEpisode(ep.id, e)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', padding: '2px 6px' }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button
            onClick={() => navigate('/profile')}
            style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            👤 마이페이지
          </button>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', backgroundColor: '#f43f5e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 2. 우측 중앙: 웹소설 본문 에디터 */}
      <main style={{ flex: 1, padding: '20px', overflowY: 'hidden' }}>
        {selectedEpisode ? (
          <NovelEditor episode={selectedEpisode} onSave={handleSaveEpisode} />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8d99ae' }}>
            작성할 회차를 선택하거나 [새 회차 쓰기] 버튼을 눌러주세요.
          </div>
        )}
      </main>
    </div>
  );
}