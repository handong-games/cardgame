# /update-doc 명령어

현재 세션의 작업 내용을 분석하여 관련 문서를 자동으로 업데이트합니다.

---

## 워크플로우

```
/update-doc
     ↓
[Phase 1] 변경 파일 감지 (git status)
     ↓
[Phase 2] 관련 문서 매핑
     ↓
[Phase 3] 변경 내용 요약 (git diff --stat)
     ↓
[Phase 4] 문서 업데이트
     ↓
[Phase 5] gameplan 동기화 확인
     ↓
완료
```

---

## Phase 1: 변경 파일 감지

```bash
git status --short
```

| 기호 | 의미 |
|------|------|
| `M` | 수정됨 |
| `A` | 추가됨 |
| `D` | 삭제됨 |

---

## Phase 2: 관련 문서 매핑

### gamedesign 관련 문서 매핑

| 변경 파일 | 관련 문서 |
|-----------|----------|
| `src/data/promptExamples.ts` | `PROMPT-EXAMPLES.md`, `CLAUDE.md` |
| `src/pages/PromptLibrary.tsx` | `README.md` |
| `src/pages/Guide.tsx` | `README.md` |
| `assets/**/*` | `CLAUDE.md` §에셋 현황 |
| `.claude/commands/gen-*.md` | `CONTEXT.md` §Claude 커맨드 |

### proto-design ↔ gamedesign 레이아웃 동기화

| 변경 파일 | 동기화 대상 |
|-----------|------------|
| `dev/proto-design/src/components/screens/BattleScreen.tsx` | `tools/layout-contract.ts` 계약 검증 → 설계서 부록C 갱신 |
| `dev/proto-design/src/components/battle/*.tsx` | 검증 스크립트 재실행: `npx tsx tools/validate-layout.ts --update-doc` |
| `dev/proto-design/src/components/ui/TopBar.tsx` | Zone A 요소 동기화 확인 |
| `dev/proto-design/src/components/ui/CoinPouch.tsx` | B-3-1a 코인 주머니 동기화 확인 |
| `projects/gamedesign/src/pages/BattleLayout.tsx` | `tools/layout-contract.ts` 계약 업데이트 필요 |

proto-design 또는 gamedesign 레이아웃 변경 감지 시:
1. `npx tsx tools/validate-layout.ts` 실행하여 드리프트 확인
2. 불일치 발견 시 `--update-doc` 플래그로 설계서 부록C 자동 갱신
3. `tools/layout-contract.ts`의 계약 데이터도 필요 시 업데이트

### gameplan 변경 시 gamedesign 동기화

| gameplan 변경 | gamedesign 영향 |
|--------------|----------------|
| `docs/specific/몬스터-명세서.md` | promptExamples.ts 숲 몬스터 섹션, CLAUDE.md 엔티티 매핑 |
| `docs/specific/클래스-명세서.md` | promptExamples.ts 캐릭터 섹션, CLAUDE.md 캐릭터 매핑 |
| `docs/specific/스킬-명세서.md` | CLAUDE.md 전사 스킬 매핑 |
| `docs/specific/월드-지역-라운드-풀-정의서.md` | CLAUDE.md 월드/지역 구조 |
| `docs/specific/mindmap.md` | CLAUDE.md 핵심 수치, CONTEXT.md 수치 |

---

## Phase 3: 변경 내용 요약

```bash
git diff --stat
```

- 전체 diff 대신 통계만 확인
- 토큰 절약

---

## Phase 4: 문서 업데이트

### 문서 파일 직접 변경된 경우
- 추가 작업 없음

### 코드 파일 변경된 경우
1. Phase 2의 매핑 테이블에서 관련 문서 찾기
2. 해당 섹션 수정
3. 저장

### 프롬프트 데이터 변경된 경우
1. `promptExamples.ts` 변경 확인
2. `PROMPT-EXAMPLES.md` 동기화
3. `CLAUDE.md` 엔티티 매핑 섹션 갱신

---

## Phase 5: gameplan 동기화 확인

### gameplan 서브모듈 업데이트 감지

```bash
git submodule status projects/gameplan
```

### 동기화 체크리스트
- [ ] Tier 1 명세서 변경 여부 확인
- [ ] promptExamples.ts의 gameplanId/designStatus 정합성
- [ ] 새 엔티티 추가 시 프롬프트 데이터 생성 필요 여부
- [ ] 기존 엔티티 스펙 변경 시 프롬프트 수정 필요 여부
- [ ] CONTEXT.md 핵심 수치 갱신 필요 여부

### 동기화 메시지 예시
```
[gameplan 동기화]
⚠ 몬스터-명세서.md 변경 감지
  → MON_F06 (늑대) designStatus: draft → confirmed 변경
  → promptExamples.ts 갱신 필요
  → PROMPT-EXAMPLES.md 동기화 필요
```

---

## 작업 기록 문서 갱신

Phase 4 완료 후, 다음 문서들도 필요 시 갱신:

| 문서 | 갱신 조건 |
|------|----------|
| `TODO.md` | 작업 완료 시 체크 표시 |
| `PLAN.md` | Phase 진행 상황 변경 시 |
| `CONTEXT.md` | 제약 조건/환경 변경 시 |

---

## 참조
- `projects/gamedesign/CONTEXT.md` — 작업 맥락 및 제약 사항
- `projects/gamedesign/PLAN.md` — 작업 로드맵
- `projects/gamedesign/TODO.md` — 작업 체크리스트
- `projects/gamedesign/CLAUDE.md` — 게임 디자인 종합 컨텍스트
- `projects/gamedesign/PROMPT-EXAMPLES.md` — 프롬프트 종합 가이드
- `tools/layout-contract.ts` — 배틀 레이아웃 동기화 계약 정의
- `tools/validate-layout.ts` — 레이아웃 동기화 검증 스크립트
