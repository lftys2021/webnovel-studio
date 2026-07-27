// src/components/CoverManagerModal.jsx
import { useState, useRef } from 'react';
import { X, Plus, Trash2, Check, Upload, Link as LinkIcon } from 'lucide-react';
import '../css/CoverManagerModal.css';

export default function CoverManagerModal({
  isOpen,
  onClose,
  covers,
  onAddCover,
  onDeleteCover,
  selectedUrl,
  onSelectCover,
}) {
  const [uploadTab, setUploadTab] = useState('file'); // 'file' | 'url'
  const [newCoverName, setNewCoverName] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // 📁 로컬 파일 선택 시 미리보기 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result); // Base64 Data URL 저장
      };
      reader.readAsDataURL(file);
      if (!newCoverName) {
        setNewCoverName(file.name.replace(/\.[^/.]+$/, '')); // 파일명을 기본 이미지 이름으로 사용
      }
    }
  };

  // 폼 제출 (등록)
  const handleAddSubmit = (e) => {
    e.preventDefault();

    const finalUrl = uploadTab === 'file' ? filePreview : newCoverUrl.trim();

    if (!finalUrl) {
      alert(uploadTab === 'file' ? '이미지 파일을 선택해 주세요.' : '이미지 URL을 입력해 주세요.');
      return;
    }

    onAddCover({
      id: `cover-${Date.now()}`,
      name: newCoverName.trim() || `표지 ${covers.length + 1}`,
      url: finalUrl,
    });

    // 상태 초기화
    setNewCoverUrl('');
    setNewCoverName('');
    setFilePreview(null);
    setIsAdding(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🖼️ 표지 이미지 라이브러리 관리</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 상단 툴바 */}
        <div className="cover-manager-toolbar">
          <p className="description">
            작품 표지로 사용할 이미지를 선택하거나, 로컬 컴퓨터에서 새 이미지를 업로드하세요.
          </p>
          {!isAdding && (
            <button className="btn-primary" onClick={() => setIsAdding(true)}>
              <Plus size={16} /> 새 표지 등록
            </button>
          )}
        </div>

        {/* 📥 이미지 등록 영역 (파일 업로드 & URL 입력 지원) */}
        {isAdding && (
          <form className="add-cover-form" onSubmit={handleAddSubmit}>
            <div className="upload-tab-buttons">
              <button
                type="button"
                className={`tab-btn ${uploadTab === 'file' ? 'active' : ''}`}
                onClick={() => setUploadTab('file')}
              >
                <Upload size={14} /> 로컬 파일 업로드
              </button>
              <button
                type="button"
                className={`tab-btn ${uploadTab === 'url' ? 'active' : ''}`}
                onClick={() => setUploadTab('url')}
              >
                <LinkIcon size={14} /> 웹 URL 입력
              </button>
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="표지 이름 (예: 주인공 마법사 표지)"
                value={newCoverName}
                onChange={(e) => setNewCoverName(e.target.value)}
              />
            </div>

            {uploadTab === 'file' ? (
              <div className="file-upload-box" onClick={() => fileInputRef.current?.click()}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {filePreview ? (
                  <div className="upload-preview">
                    <img src={filePreview} alt="업로드 미리보기" />
                    <span>클릭하여 다른 이미지 선택</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={32} />
                    <p>클릭하여 컴퓨터에서 이미지 파일 선택</p>
                    <span className="sub-text">PNG, JPG, WEBP 지원</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="form-group">
                <input
                  type="url"
                  className="form-input"
                  placeholder="이미지 URL 입력 (https://...)"
                  value={newCoverUrl}
                  onChange={(e) => setNewCoverUrl(e.target.value)}
                />
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsAdding(false);
                  setFilePreview(null);
                }}
              >
                취소
              </button>
              <button type="submit" className="btn-primary">
                등록하기
              </button>
            </div>
          </form>
        )}

        {/* 🖼️ 표지 라이브러리 목록 */}
        <div className="cover-grid">
          {covers.map((cover) => {
            const isSelected = selectedUrl === cover.url;
            return (
              <div
                key={cover.id}
                className={`cover-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (onSelectCover) {
                    onSelectCover(cover.url);
                    onClose();
                  }
                }}
              >
                <div className="cover-img-wrapper">
                  <img src={cover.url} alt={cover.name} />
                  {isSelected && (
                    <div className="check-badge">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                <div className="cover-item-footer">
                  <span className="cover-name">{cover.name}</span>
                  <button
                    type="button"
                    className="icon-btn danger"
                    title="표지 삭제"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`'${cover.name}' 표지를 삭제하시겠습니까?`)) {
                        onDeleteCover(cover.id);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}