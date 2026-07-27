// src/components/Editor.jsx
import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  ImageIcon, Columns, Rows, Square, Upload, Link as LinkIcon, X
} from 'lucide-react';
import '../css/Editor.css';

export default function Editor({
  activeDoc,            // 현재 주 창의 문서 객체 ({ id, title, content })
  secondaryDoc,         // 보조 창의 문서 객체
  activePane,           // 'primary' | 'secondary' (현재 선택된/포커스된 창)
  onSelectPane,         // 창 클릭 시 포커스 변경 핸들러
  onChangeContent,      // 내용 변경 핸들러 (docId, content)
  onChangeTitle,        // 제목 변경 핸들러 (docId, title)
}) {
  const primaryEditorRef = useRef(null);
  const secondaryEditorRef = useRef(null);

  // 뷰 분할 상태 ('none' | 'vertical' | 'horizontal')
  const [splitMode, setSplitMode] = useState('none');

  // 글자 수 상태 (활성화된 창 기준)
  const [charCountWithSpace, setCharCountWithSpace] = useState(0);
  const [charCountNoSpace, setCharCountNoSpace] = useState(0);

  // 삽화 모달 상태
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // 현재 포커스된 창의 문서 정보
  const currentFocusedDoc = activePane === 'secondary' && secondaryDoc ? secondaryDoc : activeDoc;

  // 📝 순수 텍스트 글자 수 계산
  const updateCharCount = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent || '';
    const rawText = tempDiv.textContent || tempDiv.innerText || '';
    const cleanedText = rawText.replace(/\r?\n|\r/g, '');

    setCharCountWithSpace(cleanedText.length);
    setCharCountNoSpace(cleanedText.replace(/\s+/g, '').length);
  };
  
  // 포커스된 문서나 내용이 바뀔 때 글자 수 업데이트
  useEffect(() => {
    if (currentFocusedDoc) {
      updateCharCount(currentFocusedDoc.content);
    }
  }, [currentFocusedDoc]);

  // 서식 명령 실행 (현재 활성화된 창 대상)
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    const targetRef = activePane === 'secondary' ? secondaryEditorRef : primaryEditorRef;
    if (targetRef.current && currentFocusedDoc) {
      const newHtml = targetRef.current.innerHTML;
      onChangeContent(currentFocusedDoc.id, newHtml);
      updateCharCount(newHtml);
    }
  };

  // 🖼️ 삽화 삽입
  const insertImageToEditor = (src, caption) => {
    const targetRef = activePane === 'secondary' ? secondaryEditorRef : primaryEditorRef;
    if (!targetRef.current || !currentFocusedDoc) return;

    const captionHtml = caption
      ? `<figcaption class="illustration-caption">${caption}</figcaption>`
      : '';
    const imgHtml = `<figure class="illustration-container" contenteditable="false"><img src="${src}" alt="${caption || '삽화'}" class="story-illustration"/>${captionHtml}</figure><p><br></p>`;

    targetRef.current.focus();
    document.execCommand('insertHTML', false, imgHtml);
    const newHtml = targetRef.current.innerHTML;
    onChangeContent(currentFocusedDoc.id, newHtml);
    updateCharCount(newHtml);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImage = (e) => {
    e.preventDefault();
    const finalSrc = uploadTab === 'file' ? filePreview : imageUrl.trim();
    if (!finalSrc) return;

    insertImageToEditor(finalSrc, imageCaption.trim());
    setImageUrl('');
    setImageCaption('');
    setFilePreview(null);
    setIsImageModalOpen(false);
  };

  if (!activeDoc) {
    return <div className="no-doc-selected">선택된 문서가 없습니다.</div>;
  }

  return (
    <div className="editor-wrapper">
      {/* 📌 1. 머릿글 영역 (포커스된 문서 제목 및 글자수 표시) */}
      <div className="editor-header">
        <input
          type="text"
          className="header-title-input"
          placeholder="문서 제목을 입력하세요"
          value={currentFocusedDoc?.title || ''}
          onChange={(e) => {
            if (currentFocusedDoc) {
              onChangeTitle(currentFocusedDoc.id, e.target.value);
            }
          }}
        />

        <div className="char-count-badge">
          <span>공백 포함 <strong>{charCountWithSpace.toLocaleString()}</strong>자</span>
          <span className="divider-dot">•</span>
          <span>공백 제외 <strong>{charCountNoSpace.toLocaleString()}</strong>자</span>
        </div>
      </div>

      {/* 🛠️ 1줄 고정 툴바 */}
      <div className="editor-toolbar">
        <div className="toolbar-row">
          <div className="toolbar-group">
            <button type="button" className="tb-btn" onClick={() => executeCommand('bold')} title="굵게"><Bold size={15} /></button>
            <button type="button" className="tb-btn" onClick={() => executeCommand('italic')} title="기울임"><Italic size={15} /></button>
            <button type="button" className="tb-btn" onClick={() => executeCommand('underline')} title="밑줄"><Underline size={15} /></button>
            <button type="button" className="tb-btn" onClick={() => executeCommand('strikeThrough')} title="취소선"><Strikethrough size={15} /></button>
          </div>

          <div className="tb-divider" />

          <div className="toolbar-group">
            <button type="button" className="tb-btn" onClick={() => executeCommand('justifyLeft')} title="왼쪽 정렬"><AlignLeft size={15} /></button>
            <button type="button" className="tb-btn" onClick={() => executeCommand('justifyCenter')} title="가운데 정렬"><AlignCenter size={15} /></button>
            <button type="button" className="tb-btn" onClick={() => executeCommand('justifyRight')} title="오른쪽 정렬"><AlignRight size={15} /></button>
          </div>

          <div className="tb-divider" />

          <div className="toolbar-group">
            <button type="button" className="tb-btn feature-btn" onClick={() => setIsImageModalOpen(true)}>
              <ImageIcon size={15} /> <span>삽화 첨부</span>
            </button>
          </div>

          <div className="tb-divider" />

          {/* 🔀 분할 버튼 */}
          <div className="toolbar-group split-controls">
            <button
              type="button"
              className={`tb-btn ${splitMode === 'none' ? 'active' : ''}`}
              onClick={() => { setSplitMode('none'); onSelectPane('primary'); }}
              title="단일 뷰"
            >
              <Square size={15} />
            </button>
            <button
              type="button"
              className={`tb-btn ${splitMode === 'vertical' ? 'active' : ''}`}
              onClick={() => setSplitMode('vertical')}
              title="좌우 세로 분할"
            >
              <Columns size={15} /> <span>세로 분할</span>
            </button>
            <button
              type="button"
              className={`tb-btn ${splitMode === 'horizontal' ? 'active' : ''}`}
              onClick={() => setSplitMode('horizontal')}
              title="상하 가로 분할"
            >
              <Rows size={15} /> <span>가로 분할</span>
            </button>
          </div>
        </div>
      </div>

      {/* ✍️ 2. 분할 화면 영역 */}
      <div className={`editor-container split-${splitMode}`}>
        {/* 주 화면 (Primary Pane) */}
        <div
          className={`pane primary-pane ${activePane === 'primary' ? 'focused' : ''}`}
          onClick={() => onSelectPane('primary')}
        >
          {splitMode !== 'none' && (
            <div className="pane-header">
              <span>{activeDoc.title || '문서 1'}</span>
              {activePane === 'primary' && <span className="active-tag">편집 중</span>}
            </div>
          )}
          <div
            ref={primaryEditorRef}
            className="editor-content"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onChangeContent(activeDoc.id, e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: activeDoc.content }}
          />
        </div>

        {/* 보조 화면 (Secondary Pane) */}
        {splitMode !== 'none' && (
          <div
            className={`pane secondary-pane ${activePane === 'secondary' ? 'focused' : ''}`}
            onClick={() => onSelectPane('secondary')}
          >
            <div className="pane-header">
              <span>{secondaryDoc?.title || activeDoc.title}</span>
              {activePane === 'secondary' && <span className="active-tag">편집 중</span>}
            </div>
            <div
              ref={secondaryEditorRef}
              className="editor-content"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const targetId = secondaryDoc ? secondaryDoc.id : activeDoc.id;
                onChangeContent(targetId, e.currentTarget.innerHTML);
              }}
              dangerouslySetInnerHTML={{ __html: secondaryDoc ? secondaryDoc.content : activeDoc.content }}
            />
          </div>
        )}
      </div>

      {/* 삽화 추가 모달 */}
      {isImageModalOpen && (
        <div className="modal-overlay" onClick={() => setIsImageModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎨 본문 삽화 추가</h3>
              <button className="icon-btn" onClick={() => setIsImageModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleInsertImage} className="illustration-form">
              <div className="upload-tab-buttons">
                <button type="button" className={`tab-btn ${uploadTab === 'file' ? 'active' : ''}`} onClick={() => setUploadTab('file')}>
                  <Upload size={14} /> 파일 업로드
                </button>
                <button type="button" className={`tab-btn ${uploadTab === 'url' ? 'active' : ''}`} onClick={() => setUploadTab('url')}>
                  <LinkIcon size={14} /> 웹 URL
                </button>
              </div>

              {uploadTab === 'file' ? (
                <div className="file-upload-box" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  {filePreview ? (
                    <div className="upload-preview">
                      <img src={filePreview} alt="미리보기" />
                      <span>클릭하여 다른 이미지 선택</span>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={28} />
                      <p>클릭하여 삽화 이미지 선택</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <input type="url" className="form-input" placeholder="이미지 URL 입력" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
              )}

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">캡션 (선택)</label>
                <input type="text" className="form-input" placeholder="예: [삽화] 결전의 순간" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsImageModalOpen(false)}>취소</button>
                <button type="submit" className="btn-primary">본문에 삽입하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}