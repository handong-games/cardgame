# Game Design Manager

Slay the Spire 스타일 덱빌더 카드 게임의 에셋 이미지 생성 및 디자인 문서 관리 도구입니다.
`projects/gameplan`의 기획서를 기반으로 캐릭터, 몬스터, 배경 등의 이미지를 생성합니다.

---

## 데이터 원천 (Source of Truth)

이 도구의 에셋 데이터는 `projects/gameplan`의 기획서에 기반합니다.

| 기획서 | 경로 | 역할 |
|---|---|---|
| 몬스터 명세서 | `projects/gameplan/docs/specific/몬스터-명세서.md` | 몬스터 데이터 구조 (v3.0 GAS) |
| 클래스 명세서 | `projects/gameplan/docs/specific/클래스-명세서.md` | 플레이어 클래스 3종 정의 |
| 스킬 명세서 | `projects/gameplan/docs/specific/스킬-명세서.md` | 스킬 데이터 구조 (v3.0 GAS) |
| 월드 정의서 | `projects/gameplan/docs/specific/월드-지역-라운드-풀-정의서.md` | 지역/라운드/풀 구조 |
| 마인드맵 | `projects/gameplan/docs/specific/mindmap.md` | 헌법급 수치 (환율, 기대값) |

프롬프트 데이터(`src/data/promptExamples.ts`)의 각 엔티티는 gameplan ID로 연동됩니다.

> **게임 시스템 요약**: 코인 플립 기반 자원 분배 로그라이크 덱빌더. 매 턴 코인 N개 플립 → 앞면/뒷면으로 스킬 코스트 지불. 환율: 앞면1 = 4딜 = 3방어. 6종 상태 태그(독, 포자, 가시, 경화, 회피, 취약)로 몬스터별 위기 유형을 구성.
> 문서 권위 계층 상세: `projects/gameplan/docs/README.md` 참조.

---

## 에셋 현황

| 카테고리 | 종수 | 상태 |
|---|---|---|
| 캐릭터 (플레이어) | 3종 | 전사 확정, 마법사/도적 미설계 |
| 숲 몬스터 | 8종 | 6종 확정, 1종 초안, 1종 미설계 |
| 던전 몬스터 | 3종 | 향후 기획 예정 (concept) |
| 성 몬스터 | 2종 | 향후 기획 예정 (concept) |
| 동료 | 3종 | - |
| 카드 프레임 | 5종 | - |
| 배경 | 4종 | - |

---

## 빠른 시작

### Windows (PowerShell)

프로젝트 루트에서 다음 명령어를 실행합니다:

```powershell
.\projects\start-gamedesign.ps1
```

이 스크립트는 자동으로:
1. 의존성 패키지 설치 (최초 1회)
2. 프론트엔드 및 백엔드 서버 동시 시작

### 수동 실행

```bash
cd projects/gamedesign
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

### 2. 문서 편집기 (Docs Editor)
- 디자인 가이드 문서 편집
- 마크다운 에디터 지원
- 폴더 트리 탐색

### 3. 에셋 갤러리 (Asset Gallery)
- 생성된 에셋 이미지 조회
- 카테고리별 필터링 (characters, monsters, backgrounds, ui)
- 이미지 상세 보기 (라이트박스)

### 4. 가이드 (Guide)
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
projects/gamedesign/
├── server/                 # 백엔드 서버
│   ├── index.ts           # 서버 진입점
│   └── routes/            # API 라우트
│       ├── docs.ts        # 문서 CRUD API
│       └── assets.ts      # 에셋 조회 API
├── src/                    # 프론트엔드
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Dashboard.tsx
│   │   ├── DocsEditor.tsx
│   │   ├── AssetGallery.tsx
│   │   ├── Guide.tsx
│   │   └── PromptLibrary.tsx
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

### gameplan Tier 1 (Source of Truth)
- [몬스터 명세서](../gameplan/docs/specific/몬스터-명세서.md) — 몬스터 데이터 구조 (v3.0 GAS)
- [클래스 명세서](../gameplan/docs/specific/클래스-명세서.md) — 클래스 정의 및 전사 스탯
- [스킬 명세서](../gameplan/docs/specific/스킬-명세서.md) — 스킬 데이터 구조 (v3.0 GAS)
- [월드 정의서](../gameplan/docs/specific/월드-지역-라운드-풀-정의서.md) — 지역/라운드/풀 구조
- [마인드맵](../gameplan/docs/specific/mindmap.md) — 헌법급 수치 마인드맵

### 에셋 디자인
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

*작성일: 2026-02-22*
