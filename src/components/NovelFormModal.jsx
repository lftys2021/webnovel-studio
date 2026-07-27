// src/components/NovelFormModal.jsx
import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Plus } from 'lucide-react';
import { TAG_LIST } from '../data/tags';
import { GENRE_LIST } from '../data/genres';
import CoverManagerModal from './CoverManagerModal';
import '../css/NovelFormModal.css';

export default function NovelFormModal({ 
  isOpen,
  onClose,
  onSubmit,
  initialData,
  covers,
  onAddCover,
  onDeleteCover,
}) {
  const [formData, setFormData] = useState({
    title: '',
    genre: GENRE_LIST[0],
    schedule: '주 5회 (월~금)',
    charCountType: '공백 포함',
    targetCharCount: '5000',
    description: '',
    tags: [],
    coverImage: 'https://picsum.photos/seed/default/300/400',
  });

  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        genre: GENRE_LIST[0],
        schedule: '주 5회 (월~금)',
        charCountType: '공백 포함',
        targetCharCount: '5000',
        description: '',
        tags: [],
        coverImage: 'https://picsum.photos/seed/default/300/400',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // 태그 토글 (최대 5개 제한)
  const toggleTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      if (exists) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else {
        if (prev.tags.length >= 5) {
          alert('태그는 최대 5개까지 선택 가능합니다.');
          return prev;
        }
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
        alert('소설 제목을 입력해주세요.');
        return;
    }
    onSubmit(formData);
    onClose(); // 👈 제출 후 모달 닫기
    };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content novel-form-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{initialData ? '✍️ 소설 정보 수정' : '✨ 새 소설 만들기'}</h3>
            <button className="icon-btn" onClick={onClose}><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="form-layout">
            {/* 좌측: 윗표지 선택 영역 */}
            <div className="form-left">
              <label className="form-label">작품 표지</label>
              <div className="cover-preview-box" onClick={() => setIsCoverModalOpen(true)}>
                <img src={formData.coverImage} alt="표지 미리보기" />
                <div className="cover-overlay">
                  <ImageIcon size={24} />
                  <span>표지 변경</span>
                </div>
              </div>
            </div>

            {/* 우측: 세부 정보 입력 영역 */}
            <div className="form-right">
              {/* 제목 */}
              <div className="form-group">
                <label className="form-label">작품 제목 *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 전생했더니, 세상이 망했다."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* 장르 & 연재주기 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">장르</label>
                  <select
                    className="form-select"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  >
                    {GENRE_LIST.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">연재 주기</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 주 5회 (월~금), 불정기"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  />
                </div>
              </div>

              {/* 1화당 목표 글자 수 (공미포 / 공포) */}
              <div className="form-group">
                <label className="form-label">1화당 목표 글자 수</label>
                <div className="char-count-inputs">
                  <select
                    className="form-select inline"
                    value={formData.charCountType}
                    onChange={(e) => setFormData({ ...formData, charCountType: e.target.value })}
                  >
                    <option value="공백 포함">공백 포함 (공포)</option>
                    <option value="공백 제외">공백 제외 (공미포)</option>
                  </select>
                  <input
                    type="number"
                    className="form-input inline"
                    placeholder="5000"
                    value={formData.targetCharCount}
                    onChange={(e) => setFormData({ ...formData, targetCharCount: e.target.value })}
                  />
                  <span className="unit">자</span>
                </div>
              </div>

              {/* 작품 설명 */}
              <div className="form-group">
                <label className="form-label">작품 설명</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="줄거리 및 시놉시스를 간단히 적어주세요."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* 태그 선택 (태그 리스트) */}
              <div className="form-group">
                <label className="form-label">태그 선택 (최대 5개)</label>
                <div className="tag-picker">
                  {TAG_LIST.map((tag) => {
                    const isSelected = formData.tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        className={`tag-picker-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 버튼 */}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>취소</button>
                <button type="submit" className="btn-primary">저장하기</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 기존 CoverSelectModal을 CoverManagerModal로 교체 */}
      <CoverManagerModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        covers={covers}
        onAddCover={onAddCover}
        onDeleteCover={onDeleteCover}
        selectedUrl={formData.coverImage}
        onSelectCover={(url) => setFormData({ ...formData, coverImage: url })}
      />
    </>
  );
}