# CONTEXT.md — 게임 디자인 작업 맥락

> 이 문서는 gamedesign 프로젝트의 운영 기준 문서다.
> **활성 스타일 기준**: v5.0 "황혼의 경계" (Twilight Threshold)
> **최종 수정일**: 2026-03-15

---

## 1. Source of Truth 계층

### 데이터 권위 순서 (충돌 시 상위가 우선)

```
[1순위] projects/gameplan/docs/specific/                (Tier 1 — 게임 기획 원천)
   ↓
[2순위] projects/gameplan/docs/plan/                    (Tier 2 — 시스템 기획서)
   ↓
[3순위] projects/gamedesign/src/data/promptExamples.ts  (실행 프롬프트 원천)
   ↓
[4순위] projects/gamedesign/docs/비주얼-디자인-DNA-v5.md (스타일 원칙 원천)
   ↓
[5순위] projects/gamedesign/docs/PROMPT-EXAMPLES.md     (운영 레퍼런스 문서)
```

- **게임 설계 데이터**는 `projects/gameplan`이 최상위 원천이다.
- **실제 생성용 프롬프트 문자열**은 `projects/gamedesign/src/data/promptExamples.ts`가 단일 실행 기준이다.
- **시각 원칙과 금지 사항**은 `projects/gamedesign/docs/비주얼-디자인-DNA-v5.md`를 따른다.
- **운영 문서와 예시 문구**는 `promptExamples.ts` 변경 직후 함께 수정한다.

### 동기화 규칙

1. Tier 1 기획 변경 발생 → `promptExamples.ts` 먼저 수정
2. `promptExamples.ts` 수정 완료 → `docs/PROMPT-EXAMPLES.md`와 관련 설계 문서 동기화
3. 스타일 원칙 변경 발생 → `docs/비주얼-디자인-DNA-v5.md`와 `docs/디자인-에센스-v5.md` 먼저 수정
4. 세부 시스템 변경 발생 → 해당 설계도 문서와 TODO/PLAN 갱신

---

## 2. 활성 스타일 기준: v5.0 "황혼의 경계"

### 핵심 비전

> "황혼의 경계에서 펼쳐지는 동화적 모험"

- 빛과 어둠의 경계
- 안전과 위협의 경계
- 현실과 환상의 경계

### 코어 에센스

| 요소 | 규칙 | 적용 대상 |
|------|------|-----------|
| 동화적 분위기 | 아름답지만 긴장감 있는 모험 톤 | 전체 |
| 전신 명암 감쇠 | 상체 디테일 집중 + 하체 완만한 음영 감쇠 | 캐릭터, 몬스터 |
| 종이 질감 | 수제 종이공예 같은 은은한 텍스처 | 캐릭터, 몬스터, 배경, UI |
| 레이어드 깊이감 | 전경/중경/배경 분리로 공간감 확보 | 배경, 씬, UI |
| 뮤트드 색상 체계 | 채도 40~55% 중심, 네온 금지 | 전체 |

### 공통 시각 규칙

| 항목 | 규칙 |
|------|------|
| 외곽선 | 얇은 니어블랙 `#1A1A1E`, 몬스터는 리전별 틴트 허용 |
| 캔버스 비율 | 캐릭터/몬스터 2:3, 동료 1:1, 배경 16:9 |
| 광원 | 좌상단의 따뜻한 키 라이트 |
| 배경 | 캐릭터/몬스터/동료/NPC/프레임/UI 생성본은 흰 배경 추출 기준 |
| 금지 | 고어, 공포, 순수 네온, 과채도, 포토리얼 3D |

### 유니버설 UI 팔레트

| 역할 | HEX | 용도 |
|------|-----|------|
| 앰버 악센트 | `#D4A574` | 하이라이트, 선택, 보상, 기본 발광 |
| 텍스트 | `#FFF5E6` | 주요 텍스트 |
| 다크 BG 시작 | `#1E1E24` | 카드/패널 배경 시작 |
| 다크 BG 끝 | `#2A2A32` | 카드/패널 배경 끝 |
| 보더 | `#4A4A55` | 구분선, 프레임 테두리 |
| 서피스 | `#16161C` | 최하위 배경 |
| 외곽선 | `#1A1A1E` | 캐릭터/몬스터 외곽선 기본 |

---

## 3. 기술 환경

### 프로젝트 스택

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Zustand
- **Backend**: Express 5 + TypeScript
- **Build**: Vite 7 (Node.js 20.19+ 필요)
- **실행**: `./projects/start-gamedesign.ps1` 또는 `cd projects/gamedesign && npm run dev`

### 프롬프트 데이터 구조

```typescript
interface PromptExample {
  id: string
  name: string
  nameEn: string
  gameplanId?: string
  designStatus?: 'confirmed' | 'draft' | 'undesigned' | 'concept'
  group?: string
  prompt: string
  negative: string
}
```

### Claude 커맨드 (`/.claude/commands/`)

| 커맨드 | 현재 상태 | 비고 |
|--------|----------|------|
| `/gen-monster` | ✅ v5.0 기준 반영 | v5.0 몬스터/리전 규칙 반영 |
| `/gen-character` | ✅ v5.0 기준 반영 | v5.0 캐릭터 렌더링 규칙 반영 |
| `/gen-background` | ✅ v5.0 기준 반영 | Tier 1/Tier 2 배경 방향 반영 |
| `/update-doc` | ✅ 동기화 규칙 반영 | gameplan + prompt 문서 갱신용 |

---

## 4. 에셋 현황 (2026-03-15 기준)

### 프롬프트 정의 현황 (`promptExamples.ts`)

| 카테고리 | 종수 | confirmed | draft | undesigned | concept |
|----------|------|-----------|-------|------------|---------|
| 카드 프레임 | 9 | — | — | — | — |
| 캐릭터 | 3 | 1 | 0 | 2 | 0 |
| 동료 | 3 | — | — | — | — |
| 숲 몬스터 | 8 | 6 | 1 | 1 | 0 |
| 던전 몬스터 | 3 | 0 | 0 | 0 | 3 |
| 성 몬스터 | 2 | 0 | 0 | 0 | 2 |
| 배경 | 4 | — | — | — | — |
| UI 에셋 | 37 | — | — | — | — |
| **합계** | **69** | **7** | **1** | **3** | **5** |

### 생성된 에셋 상태

| 카테고리 | 파일 | 상태 |
|----------|------|------|
| characters | warrior v1, v2, paladin | `_archive/v5/` 보관, 현행 기준 재선정 필요 |
| monsters | slime, foxwolf | `_archive/v5/` 보관, gameplan 비연동 참고 에셋 |
| backgrounds | forest, dungeon, castle | `_archive/v5/` 보관, 현행 v5.0 DNA 기준 재검토 대상 |
| frames | — | 미생성 |

---

## 5. 운영 프로토콜

### 문서-프롬프트 동기화 운영

| 변경 유형 | 먼저 수정할 파일 | 뒤이어 수정할 파일 |
|-----------|------------------|--------------------|
| 엔티티 프롬프트 변경 | `src/data/promptExamples.ts` | `docs/PROMPT-EXAMPLES.md`, 관련 자산 가이드 |
| 스타일 원칙 변경 | `docs/비주얼-디자인-DNA-v5.md` | `CONTEXT.md`, `docs/디자인-에센스-v5.md` |
| 디자인 구조 변경 | `docs/디자인-설계도-운영-인덱스-v5.md` | `PLAN.md`, `TODO.md`, 관련 UI 설계서 |
| gameplan 변경 | Tier 1 / Tier 2 문서 검토 | `promptExamples.ts`, 운영 문서 전체 |

### 전문가 모드

| 페르소나 | 활성화 조건 | 역할 |
|----------|------------|------|
| 🎯 기획자 | 신규 에셋 기획, gameplan 동기화 | Tier 1 기반 디자인 정의 |
| 💻 수석 개발자 | 코드 수정, 문서-프롬프트 동기화 | `promptExamples.ts`, 웹앱, 명령어 관리 |
| 🔍 QA | 생성 결과 검증, 일관성 점검 | DNA/에센스/설계도 기준 대조 |

### Audit 루틴

1. 어떤 파일의 어떤 기준이 바뀌었는지 기록
2. `promptExamples.ts`와 문서 간 불일치가 없는지 확인
3. v5.0 DNA, 에센스, 설계도 기준과 어긋나지 않는지 확인
4. TODO/PLAN 반영 여부 확인

---

## 6. 에센스와 설계도 관리 체계

- **에센스 문서**: `projects/gamedesign/docs/디자인-에센스-v5.md`
  - 게임디자인의 본질적 감정, 톤, 가독성, 플레이 경험 원칙을 관리
- **설계도 운영 문서**: `projects/gamedesign/docs/디자인-설계도-운영-인덱스-v5.md`
  - 캐릭터, 몬스터, 프레임, 배경, UI, 이펙트, 씬 단위로 세분화된 관리 구조를 정의

---

## 7. 핵심 수치 (gameplan mindmap.md)

| 수치 | 값 | 디자인 영향 |
|------|-----|------------|
| 환율 | 파워1 = 해1 = 달1 | 자원 표현 일관성 |
| 데미지 환율 | 해1 = 4 딜 | 공격 이펙트 강도 |
| 방어 환율 | 해1 = 3 방어 | 방어 이펙트 강도 |
| 속성 6종 | 독/포자/가시/경화/회피/취약 | 속성별 시각 언어 필요 |
| 코인 성장 | 3 → 10개 | 진행도에 따른 UI/FX 복잡도 증가 |

---

*이 문서는 gamedesign 프로젝트의 운영 기준 문서이며, 스타일 기준은 v5.0으로 고정한다.*
