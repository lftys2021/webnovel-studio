# 📚 웹소설 집필 스튜디오 (Novel Writing Studio)

> 웹소설 작가들을 위한 스마트 멀티뷰 에디터 및 소설/표지 관리 대시보드 애플리케이션입니다.  
> 화면 분할, 설정집/회차 트리 구조 관리, 커스텀 표지 라이브러리 및 실시간 글자 수 측정 기능을 제공합니다.

---

## 🚀 주요 기능 (Features)

### 1. 📂 소설 서재 대시보드 (`Dashboard`)
- **소설 카드 관리**: 보유 중인 웹소설 목록 조회, 상세 정보(장르, 연재 일정, 목표 글자 수 등) 확인.
- **소설 생성 및 수정**: 새 소설 등록 및 기존 소설의 메타데이터 편집 모달 제공.
- **표지 라이브러리 연동**: 기본 제공 및 커스텀 업로드 표지 관리(`CoverManagerModal`).

### 2. 🗂️ 카테고리 & 문서 트리 사이드바 (`Sidebar`)
- **계층형 문서 관리**: 세계관 설정집, 회차 등을 카테고리(`category`) 단위로 구분하여 관리.
- **다이렉트 CRUD**: 사이드바 내에서 카테고리 및 문서의 추가, 수정, 삭제, 토글(열기/접기) 기능.
- **스마트 창 연동**: 현재 포커스된 분할 창(Primary/Secondary)에 따라 클릭한 문서가 원하는 에디터 창에 즉시 로드.

### 3. ✍️ 멀티뷰 분할 에디터 (`Editor`)
- **2분할 뷰 지원 (Primary / Secondary)**: 설정집과 회차 본문을 한 화면에 동시에 띄워두고 참고하며 작성 가능.
- **포커스 스위칭**: 현재 작업 중인 에디터 Pane을 선택하여 사이드바 문서 연결 변경.
- **실시간 제목 & 본문 동기화**: 머릿글(제목) 및 본문 수정 내용이 중앙 데이터(`novels`)에 실시간 반영.
- **스마트 멘션 기능**: 인물, 세계관 태그(`@`) 입력 시 자동완성/멘션 연결 기능 지원.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React (Vite / CRA)
- **State Management**: React State (`useState`)
- **Icons**: Lucide React (`lucide-react`)
- **Styling**: Pure CSS (`App.css`, `Sidebar.css`, `Editor.css` 등)

---

## 📁 프로젝트 구조 (Directory Structure)

WEBNOVEL-STUDIO/
├── node_modules/
├── public/
├── src/                          # ⚛️ 프론트엔드 (React)
│   ├── components/
│   │   ├── Sidebar.jsx           # 소설 카테고리 및 문서 트리 사이드바
│   │   ├── Editor.jsx            # 분할 화면 지원 에디터 메인 컴포넌트
│   │   ├── NovelFormModal.jsx    # 소설 추가/수정 모달
│   │   └── CoverSelectModal.jsx  # 표지 이미지 선택 라이브러리 모달
│   │   └── CoverManagerModal.jsx # 표지 라이브러리 관리 모달
│   ├── css/
│   │   ├── App.css                <-- [분리] 대시보드 서재, 소설 카드, 레이아웃 기본 스타일
│   │   ├── Sidebar.css            <-- [분리] 좌측 목차 트리가 들어가는 사이드바 스타일
│   │   ├── Editor.css             <-- [유지] 메인 에디터, 툴바, 본문 삽화 전용 스타일
│   │   ├── CoverManagerModal.css  <-- [분리] 표지/삽화 파일 업로드 & 모달 스타일
│   │   └── NovelFormModal.css     <-- [분리] 새 소설 생성/수정 모달 전용 스타일
│   ├── data/
│   │   └── covers.js             # 초기 표지 데이터 셋
│   │   ├── tags.js               # 태그 목록
│   │   └── genres.js             # 장르 목록
│   ├── App.jsx                   # 최상위 데이터 제어 및 뷰 상태 관리
│   └── main.jsx                  # React 엔트리 포인트
├── server/                # 🐍 백엔드 (FastAPI) 👈 [추가!]
│   ├── main.py            # 👈 여기에 위치!
│   ├── requirements.txt   # (선택) 파이썬 패키지 목록
│   └── venv/              # (선택) 파이썬 가상환경
├── .gitignore
├── package.json
└── vite.config.js

## python 관련 설치 명령어
pip install fastapi uvicorn 
pip install sqlalchemy 
pip install passlib "bcrypt==4.0.1" 
pip install python-jose 
npm install react-router-dom

# 1. 현 폴더를 Git 저장소로 초기화
git init

# 2. 업로드할 파일들을 대기열(Staging Area)에 추가
git add .

# 3. 변경 사항 저장 메시지(커밋) 작성
git commit -m "Day5"

# 4. 기본 브랜치 이름을 main으로 변경
git branch -M main

# 5. 내 GitHub 원격 저장소와 연결 (복사한 주소 붙여넣기)
git remote add origin https://github.com/lftys2021/webnovel-studio.git

# 6. GitHub로 업로드
git push -u origin main


# 1. GitHub에서 프로젝트 전체 내려받기
git clone https://github.com/lftys2021/webnovel-studio.git

# 6. GitHub로 다운로드
git pull origin main

# 2. 내려받은 프로젝트 폴더로 이동
cd javascript

# 3. node_modules 패키지들 일괄 설치 (깃허브에는 node_modules가 안 올라가므로 필수!)
npm install

# 4. 실행 테스트
npm run dev