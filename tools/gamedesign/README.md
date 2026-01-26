# Game Design Manager

게임 에셋 이미지 생성을 위한 디자인 문서 관리 및 프롬프트 스킬 편집 도구입니다.

---

## 빠른 시작

### Windows (PowerShell)

프로젝트 루트에서 다음 명령어를 실행합니다:

```powershell
.\tools\start-gamedesign.ps1
```

이 스크립트는 자동으로:
1. 의존성 패키지 설치 (최초 1회)
2. 프론트엔드 및 백엔드 서버 동시 시작

### 수동 실행

```bash
cd tools/gamedesign
npm install          # 최초 1회
npm run dev          # 개발 서버 시작
```

---

## 접속 주소

| 서비스 | URL | 설명 |
|--------|-----|------|
| 프론트엔드 | http://localhost:5173 | 웹 인터페이스 |
| 백엔드 API | http://localhost:3001 | REST API 서버 |

브라우저에서 `http://localhost:5173`을 열어 접속합니다.

---

## 주요 기능

### 1. 대시보드 (Dashboard)
- 에셋 통계 현황 (캐릭터, 몬스터, 배경, UI)
- 빠른 시작 가이드
- 최근 생성된 에셋 미리보기

### 2. 스킬 편집기 (Skills Editor)
- `/gen-character`, `/gen-monster`, `/gen-background` 등 이미지 생성 스킬 편집
- 프롬프트 레이어 시스템 관리
- 실시간 미리보기

### 3. 문서 편집기 (Docs Editor)
- 디자인 가이드 문서 편집
- 마크다운 에디터 지원
- 폴더 트리 탐색

### 4. 에셋 갤러리 (Asset Gallery)
- 생성된 에셋 이미지 조회
- 카테고리별 필터링 (characters, monsters, backgrounds, ui)
- 이미지 상세 보기 (라이트박스)

### 5. 가이드 (Guide)
- 스킬 사용 가이드
- 프롬프트 작성 마스터 가이드
- 이미지 생성 워크플로우

---

## 필수 요구사항

- **Node.js** 18.0 이상
- **npm** 8.0 이상

### Node.js 설치 확인

```bash
node --version   # v18.x.x 이상
npm --version    # 8.x.x 이상
```

---

## 프로젝트 구조

```
tools/gamedesign/
├── server/                 # 백엔드 서버
│   ├── index.ts           # 서버 진입점
│   └── routes/            # API 라우트
│       ├── skills.ts      # 스킬 CRUD API
│       ├── docs.ts        # 문서 CRUD API
│       └── assets.ts      # 에셋 조회 API
├── src/                    # 프론트엔드
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Dashboard.tsx
│   │   ├── SkillsEditor.tsx
│   │   ├── DocsEditor.tsx
│   │   ├── AssetGallery.tsx
│   │   └── Guide.tsx
│   ├── components/        # 공통 컴포넌트
│   └── App.tsx           # 앱 진입점
├── package.json
└── README.md
```

---

## 스크립트 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 (프론트 + 백엔드) |
| `npm run dev:client` | 프론트엔드만 시작 |
| `npm run dev:server` | 백엔드만 시작 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |

---

## API 엔드포인트

### 스킬 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/skills` | 스킬 목록 조회 |
| GET | `/api/skills/:name` | 스킬 상세 조회 |
| PUT | `/api/skills/:name` | 스킬 수정 |

### 문서 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/docs` | 문서 트리 조회 |
| GET | `/api/docs/*` | 문서 내용 조회 |
| PUT | `/api/docs/*` | 문서 수정 |

### 에셋 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/assets` | 에셋 통계 조회 |
| GET | `/api/assets/:category` | 카테고리별 에셋 조회 |

---

## 문제 해결

### 포트 충돌

다른 프로그램이 5173 또는 3001 포트를 사용 중인 경우:

```bash
# Windows - 포트 사용 프로세스 확인
netstat -ano | findstr :5173
netstat -ano | findstr :3001

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F
```

### 의존성 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

### TypeScript 오류

```bash
# 타입 체크
npx tsc --noEmit
```

---

## 관련 문서

- [캐릭터 디자인 가이드](../../docs/04.%20design/02.%20characters/01.%20character-design-guide.md)
- [몬스터 디자인 가이드](../../docs/04.%20design/03.%20monsters/01.%20monster-design-guide.md)
- [프롬프트 템플릿](../../docs/04.%20design/03.%20monsters/02.%20prompt-templates.md)

---

## 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand
- **Backend**: Express 5, TypeScript
- **Build**: Vite 7
- **Editor**: @uiw/react-md-editor

---

*작성일: 2026-01-26*
