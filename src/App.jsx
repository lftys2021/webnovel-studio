// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import novelApi from './api/novelApi';
import logout from './api/authApi';
import './css/App.css';

export default function App() {
  const navigate = useNavigate();
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 목업 데이터 (안전한 기본 데이터 구조)
  const defaultMockNovels = [
    {
      id: 'novel-1',
      title: '전생했더니, 세상이 망했다',
      genre: '현대판타지',
      synopsis: '어느 날 눈을 떠보니 망해버린 소설 속 세상이었다.',
      categories: [
        {
          id: 'cat-1',
          title: '📜 세계관 설정',
          children: [
            { id: 'doc-1', title: '마법 체계', content: '<p>이 세계관의 마법은 마나 순환에 기반한다.</p>' },
            { id: 'doc-2', title: '세력 구도', content: '<p>3대 가문과 황실의 대립 구조.</p>' }
          ]
        },
        {
          id: 'cat-2',
          title: '👤 등장인물',
          children: [
            { id: 'doc-3', title: '주인공 (강태현)', content: '<p>24세, 전생자이자 특이능력 소유자.</p>' }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await novelApi.fetchNovels();
        if (data && Array.isArray(data) && data.length > 0) {
          setNovels(data);
          setSelectedNovel(data[0]);
        } else {
          setNovels(defaultMockNovels);
          setSelectedNovel(defaultMockNovels[0]);
        }
      } catch (error) {
        console.warn('백엔드 /api/novels 연결 실패: 목업 데이터를 사용합니다.');
        setNovels(defaultMockNovels);
        setSelectedNovel(defaultMockNovels[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* 1. 좌측 사이드바: 소설 목록 및 마이페이지 버튼 */}
      <aside style={{ width: '250px', background: '#2b2d42', color: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #4a4e69', paddingBottom: '10px' }}>
            📚 내 작품 목록
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {(novels || []).map((novel) => (
              <li
                key={novel.id}
                onClick={() => setSelectedNovel(novel)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedNovel?.id === novel.id ? '#4a4e69' : 'transparent',
                  marginBottom: '8px'
                }}
              >
                <strong>{novel.title}</strong>
                <div style={{ fontSize: '0.8rem', color: '#8d99ae' }}>{novel.genre}</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button
            onClick={() => navigate('/profile')}
            style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            👤 마이페이지
          </button>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', backgroundColor: '#e63946', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 2. 중앙 메인 에디터 및 설정 영역 */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
        {selectedNovel ? (
          <div>
            <header style={{ marginBottom: '20px', borderBottom: '2px solid #dee2e6', paddingBottom: '12px' }}>
              <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#212529' }}>{selectedNovel.title}</h1>
              <p style={{ color: '#6c757d', margin: '4px 0 0 0' }}>장르: {selectedNovel.genre}</p>
            </header>

            <section style={{ marginBottom: '24px' }}>
              <h3>📖 시놉시스</h3>
              <p style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
                {selectedNovel.synopsis || '등록된 시놉시스가 없습니다.'}
              </p>
            </section>

            {/* 안전하게 ?. 옵셔널 체이닝으로 설정 카테고리 랜더링 */}
            <section>
              <h3>📁 설정 및 문서</h3>
              {(selectedNovel.categories || []).map((cat) => (
                <div key={cat.id} style={{ marginBottom: '16px', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>{cat.title}</h4>
                  <ul style={{ listStyle: 'none', paddingLeft: '12px', margin: 0 }}>
                    {(cat.children || []).map((doc) => (
                      <li key={doc.id} style={{ padding: '6px 0', borderBottom: '1px solid #f1f3f5' }}>
                        📄 <strong>{doc.title}</strong>
                        <div
                          style={{ fontSize: '0.9rem', color: '#495057', marginTop: '4px' }}
                          dangerouslySetInnerHTML={{ __html: doc.content }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <div>선택된 소설이 없습니다.</div>
        )}
      </main>
    </div>
  );
}