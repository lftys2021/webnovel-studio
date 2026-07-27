// src/components/CoverSelectModal.jsx
import { X, Check } from 'lucide-react';

// 임시 표지 이미지 리스트 (추후 3단계에서 확장 가능)
const SAMPLE_COVERS = [
  { id: 1, url: 'https://picsum.photos/seed/cover1/300/400', name: '판타지 숲' },
  { id: 2, url: 'https://picsum.photos/seed/cover2/300/400', name: '아포칼립스 도시' },
  { id: 3, url: 'https://picsum.photos/seed/cover3/300/400', name: '마법 서재' },
  { id: 4, url: 'https://picsum.photos/seed/cover4/300/400', name: '동양 무협' },
  { id: 5, url: 'https://picsum.photos/seed/cover5/300/400', name: 'SF 우주' },
  { id: 6, url: 'https://picsum.photos/seed/cover6/300/400', name: '로맨스 정원' },
];

export default function CoverSelectModal({ isOpen, onClose, selectedUrl, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎨 표지 이미지 선택</h3>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cover-grid">
          {SAMPLE_COVERS.map((cover) => {
            const isSelected = selectedUrl === cover.url;
            return (
              <div
                key={cover.id}
                className={`cover-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelect(cover.url);
                  onClose();
                }}
              >
                <img src={cover.url} alt={cover.name} />
                <span className="cover-name">{cover.name}</span>
                {isSelected && <div className="check-badge"><Check size={16} /></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}