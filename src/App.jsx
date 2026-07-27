// src/App.jsx
import { useState } from 'react';
import './css/App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import NovelFormModal from './components/NovelFormModal';
import CoverManagerModal from './components/CoverManagerModal';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { INITIAL_COVERS } from './data/covers';

export default function App() {
  const [viewMode, setViewMode] = useState('dashboard');
  const [activeNovelId, setActiveNovelId] = useState('novel-1');
  
  // 🔀 분할 화면 관련 상태
  const [activeDocId, setActiveDocId] = useState('doc-1');         // 주 창 문서 ID
  const [secondaryDocId, setSecondaryDocId] = useState(null);      // 보조 창 문서 ID
  const [activePane, setActivePane] = useState('primary');          // 선택된 창 ('primary' | 'secondary')

  const [isNovelModalOpen, setIsNovelModalOpen] = useState(false);
  const [isCoverManagerOpen, setIsCoverManagerOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState(null);
  const [covers, setCovers] = useState(INITIAL_COVERS);

  // 표지 추가/삭제
  const handleAddCover = (newCover) => {
    setCovers((prev) => [newCover, ...prev]);
  };

  const handleDeleteCover = (coverId) => {
    setCovers((prev) => prev.filter((c) => c.id !== coverId));
  };

  const [novels, setNovels] = useState([
    {
      id: 'novel-1',
      title: '전생했더니, 세상이 망했다.',
      genre: '현대판타지',
      schedule: '주 5회 (월~금)',
      charCountType: '공백 포함',
      targetCharCount: '5000',
      description: '눈을 떠보니 멸망한 세계. 아티팩트 해독 능력 하나로 살아남아야 한다!',
      tags: ['퓨전판타지', '아포칼립스', '전생'],
      coverImage: 'https://picsum.photos/seed/novel1/300/400',
      categories: [
        {
          id: 'cat-1',
          title: '📜 세계관 설정',
          isOpen: true,
          children: [
            { id: 'doc-1', title: '마법 체계', content: '<p>이 세계관의 마법은 마나의 순환에 기반한다.</p>' },
            { id: 'doc-2', title: '속성', content: '<p>4대 속성은 불, 물, 바람, 땅이다.</p>' },
          ],
        },
      ],
    },
  ]);

  // 현재 활성화된 소설 찾기
  const currentNovel = novels.find((n) => n.id === activeNovelId) || novels[0];

  // 🔍 중첩된 카테고리 구조에서 특정 ID의 문서를 찾아오는 헬퍼 함수
  const findDocById = (docId) => {
    if (!currentNovel || !docId) return null;
    for (const cat of currentNovel.categories) {
      const found = cat.children.find((doc) => doc.id === docId);
      if (found) return found;
    }
    return null;
  };

  /* --- 핸들러 함수들 --- */
  const handleOpenAddModal = () => {
    setEditingNovel(null);
    setIsNovelModalOpen(true);
  };

  const handleOpenEditModal = (novel, e) => {
    e.stopPropagation();
    setEditingNovel(novel);
    setIsNovelModalOpen(true);
  };

  const handleSaveNovel = (formData) => {
    if (editingNovel) {
      setNovels((prev) =>
        prev.map((n) => (n.id === editingNovel.id ? { ...n, ...formData } : n))
      );
    } else {
      const newNovelId = `novel-${Date.now()}`;
      const newDocId = `doc-${Date.now()}`;
      const newNovel = {
        ...formData,
        id: newNovelId,
        categories: [
          {
            id: `cat-${Date.now()}`,
            title: '📜 세계관 설정',
            isOpen: true,
            children: [{ id: newDocId, title: '개요', content: `<p>내용을 입력하세요.</p>` }],
          },
        ],
      };
      setNovels([...novels, newNovel]);
    }
  };

  // 👈 사이드바에서 문서 선택 시 (선택된 창에 맞게 적용)
  const handleSelectDocFromSidebar = (docId) => {
    if (activePane === 'secondary') {
      setSecondaryDocId(docId);
    } else {
      setActiveDocId(docId);
    }
  };

  const handleOpenNovel = (novelId) => {
    setActiveNovelId(novelId);
    const target = novels.find((n) => n.id === novelId);
    const firstDoc = target?.categories[0]?.children[0]?.id || null;
    setActiveDocId(firstDoc);
    setSecondaryDocId(null);
    setViewMode('editor');
  };

  /* --- 카테고리/문서 편집 핸들러 --- */
  const updateCurrentCategories = (updater) => {
    setNovels((prev) =>
      prev.map((n) => {
        if (n.id === activeNovelId) {
          return { ...n, categories: typeof updater === 'function' ? updater(n.categories) : updater };
        }
        return n;
      })
    );
  };

  const handleToggleCategory = (catId) => {
    updateCurrentCategories((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, isOpen: !cat.isOpen } : cat))
    );
  };

  const handleAddCategory = () => {
    const title = prompt('새 카테고리 이름을 입력하세요:', '📁 새 카테고리');
    if (!title) return;
    updateCurrentCategories((prev) => [...prev, { id: `cat-${Date.now()}`, title, isOpen: true, children: [] }]);
  };

  const handleEditCategory = (catId, currentTitle, e) => {
    e.stopPropagation();
    const newTitle = prompt('카테고리 이름을 수정하세요:', currentTitle);
    if (!newTitle) return;
    updateCurrentCategories((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, title: newTitle } : cat))
    );
  };

  const handleDeleteCategory = (catId, e) => {
    e.stopPropagation();
    if (!confirm('이 카테고리와 내부 문서가 모두 삭제됩니다.')) return;
    updateCurrentCategories((prev) => prev.filter((cat) => cat.id !== catId));
  };

  const handleAddDocument = (catId, e) => {
    e.stopPropagation();
    const title = prompt('새 문서 제목을 입력하세요:', '새 문서');
    if (!title) return;

    const newDocId = `doc-${Date.now()}`;
    const newDoc = { id: newDocId, title, content: `<p>내용을 입력하세요.</p>` };

    updateCurrentCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId ? { ...cat, isOpen: true, children: [...cat.children, newDoc] } : cat
      )
    );
    
    handleSelectDocFromSidebar(newDocId);
  };

  const handleEditDocument = (docId, currentTitle, e) => {
    e.stopPropagation();
    const newTitle = prompt('문서 제목을 수정하세요:', currentTitle);
    if (!newTitle) return;

    handleUpdateTitle(docId, newTitle);
  };

  const handleDeleteDocument = (docId, e) => {
    e.stopPropagation();
    if (!confirm('정말 삭제하시겠습니까?')) return;

    updateCurrentCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        children: cat.children.filter((doc) => doc.id !== docId),
      }))
    );
  };

  // ✍️ 에디터 내용 업데이트
  const handleUpdateContent = (targetDocId, newContent) => {
    updateCurrentCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        children: cat.children.map((doc) =>
          doc.id === targetDocId ? { ...doc, content: newContent } : doc
        ),
      }))
    );
  };

  // 📌 머릿글/문서 제목 업데이트
  const handleUpdateTitle = (targetDocId, newTitle) => {
    updateCurrentCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        children: cat.children.map((doc) =>
          doc.id === targetDocId ? { ...doc, title: newTitle } : doc
        ),
      }))
    );
  };

  const activeDoc = findDocById(activeDocId);
  const secondaryDoc = findDocById(secondaryDocId);

  return (
    <>
      {/* 🟢 1. 서재 대시보드 화면 */}
      {viewMode === 'dashboard' && (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>📚 내 웹소설 서재</h1>
            <div className="header-buttons">
              <button className="btn-secondary" onClick={() => setIsCoverManagerOpen(true)}>
                <ImageIcon size={18} /> 표지 라이브러리
              </button>
              <button className="btn-primary" onClick={handleOpenAddModal}>
                <Plus size={18} /> 새 소설 만들기
              </button>
            </div>
          </header>

          <div className="novel-grid">
            {novels.map((novel) => (
              <div key={novel.id} className="novel-card" onClick={() => handleOpenNovel(novel.id)}>
                <div className="card-cover">
                  <img src={novel.coverImage} alt={novel.title} />
                </div>
                <div className="card-content">
                  <div className="card-header-row">
                    <span className="genre-badge">{novel.genre}</span>
                    <button className="btn-edit-text" onClick={(e) => handleOpenEditModal(novel, e)}>수정</button>
                  </div>
                  <h3 className="card-title">{novel.title}</h3>
                  <p className="card-desc">{novel.description}</p>
                  <div className="card-info-meta">
                    <span>⏱️ {novel.schedule}</span>
                    <span>📝 목표 {novel.targetCharCount}자 ({novel.charCountType === '공백 포함' ? '공포' : '공미포'})</span>
                  </div>
                  <div className="card-tags">
                    {novel.tags.map((tag, idx) => (
                      <span key={idx} className="tag-chip">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔵 2. 집필 에디터 화면 */}
      {viewMode === 'editor' && (
        <div className="studio-layout">
          <Sidebar
            currentNovel={currentNovel}
            onBackToDashboard={() => setViewMode('dashboard')}
            categories={currentNovel?.categories || []}
            activeDocId={activePane === 'secondary' && secondaryDocId ? secondaryDocId : activeDocId}
            onSelectDoc={handleSelectDocFromSidebar}
            onToggleCategory={handleToggleCategory}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddDocument={handleAddDocument}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
          />

          <main className="main-content">
            {activeDoc ? (
              <Editor
                activeDoc={activeDoc}
                secondaryDoc={secondaryDoc}
                activePane={activePane}
                onSelectPane={(pane) => setActivePane(pane)}
                onChangeContent={handleUpdateContent}
                onChangeTitle={handleUpdateTitle}
              />
            ) : (
              <div className="no-doc-selected">
                <p>👈 좌측 메뉴에서 문서를 선택하거나 새 문서를 만드세요.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* 🟣 소설 등록/수정 모달 */}
      <NovelFormModal
        isOpen={isNovelModalOpen}
        onClose={() => setIsNovelModalOpen(false)}
        onSubmit={handleSaveNovel}
        initialData={editingNovel}
        covers={covers}
        onAddCover={handleAddCover}
        onDeleteCover={handleDeleteCover}
      />

      {/* 🎨 대시보드 전용 표지 라이브러리 모달 */}
      <CoverManagerModal
        isOpen={isCoverManagerOpen}
        onClose={() => setIsCoverManagerOpen(false)}
        covers={covers}
        onAddCover={handleAddCover}
        onDeleteCover={handleDeleteCover}
      />
    </>
  );
}