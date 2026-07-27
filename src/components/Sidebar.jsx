// src/components/Sidebar.jsx
import { ChevronRight, ChevronDown, FolderPlus, FilePlus, Edit2, Trash2, ArrowLeft, BookOpen } from 'lucide-react';
import '../css/Sidebar.css';

export default function Sidebar({
  currentNovel,
  onBackToDashboard,
  categories,
  activeDocId,
  onSelectDoc,
  onToggleCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
}) {
  return (
    <aside className="sidebar">
      {/* ⬅️ 상단 서재로 돌아가기 버튼 */}
      <button className="back-btn" onClick={onBackToDashboard}>
        <ArrowLeft size={16} /> 서재로 돌아가기
      </button>

      {/* 📖 현재 선택된 소설 정보 표시 */}
      <div className="current-novel-badge">
        <BookOpen size={16} />
        <span className="title">{currentNovel?.title}</span>
      </div>

      <hr className="divider" />

      {/* 📁 카테고리 헤더 */}
      <div className="sidebar-header">
        <h2>📂 폴더 및 문서</h2>
        <button className="icon-btn primary" onClick={onAddCategory} title="카테고리 추가">
          <FolderPlus size={18} />
        </button>
      </div>

      {/* 🌳 트리 메뉴 */}
      <div className="tree-container">
        {categories.map((cat) => (
          <div key={cat.id} className="category-group">
            <div className="category-header" onClick={() => onToggleCategory(cat.id)}>
              <span className="arrow">
                {cat.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
              <span className="cat-title">{cat.title}</span>

              <div className="actions">
                <button className="icon-btn" onClick={(e) => onAddDocument(cat.id, e)} title="문서 추가">
                  <FilePlus size={14} />
                </button>
                <button className="icon-btn" onClick={(e) => onEditCategory(cat.id, cat.title, e)} title="폴더 수정">
                  <Edit2 size={14} />
                </button>
                <button className="icon-btn danger" onClick={(e) => onDeleteCategory(cat.id, e)} title="폴더 삭제">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {cat.isOpen && (
              <ul className="sub-doc-list">
                {cat.children.length === 0 ? (
                  <li className="empty-doc">문서가 없습니다</li>
                ) : (
                  cat.children.map((doc) => (
                    <li
                      key={doc.id}
                      className={`doc-item ${doc.id === activeDocId ? 'active' : ''}`}
                      onClick={() => onSelectDoc(doc.id)}
                    >
                      <span className="doc-title">{doc.title}</span>
                      <div className="actions">
                        <button className="icon-btn" onClick={(e) => onEditDocument(doc.id, doc.title, e)} title="제목 수정">
                          <Edit2 size={12} />
                        </button>
                        <button className="icon-btn danger" onClick={(e) => onDeleteDocument(doc.id, e)} title="문서 삭제">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}