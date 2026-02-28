# PLAN.md — 게임 디자인 작업 로드맵

> 이 문서는 gamedesign 프로젝트의 전체 작업 전략과 단계별 실행 계획을 정의합니다.
> **최종 수정일**: 2026-02-23

---

## 전체 로드맵

```
Phase 0: 인프라 정비          ← 현재 위치
   ↓
Phase 1: 확정 에셋 생성 (confirmed)
   ↓
Phase 2: 초안 에셋 생성 (draft)
   ↓
Phase 3: 미설계 에셋 기획 (undesigned)
   ↓
Phase 4: 컨셉 에셋 기획 (concept)
   ↓
(반복) gameplan 업데이트 시 동기화
```

---

## Phase 0: 인프라 정비 ⬅ 현재

> **목표**: v4.0 Dark Frame Edition 기준으로 모든 도구와 커맨드를 현대화하여, 이후 에셋 생성 시 일관된 품질을 보장한다.

### 0-1. Claude 커맨드 v4.0 현대화

**현황**: 4개 커맨드 모두 v5.0 storybook 기반 → v4.0 Dark Frame Edition으로 전면 개편 필요

| 커맨드 | 작업 내용 | 우선순위 |
|--------|----------|----------|
| `/gen-monster` | ink illustration 스타일, 흰배경, Tier 시스템 반영, 속성 표현 가이드 추가 | ★★★ |
| `/gen-character` | flat color illustration, 3클래스(전사/마법사/도적) 기반, 팔라딘 제거 | ★★★ |
| `/gen-background` | layered silhouette, dark muted palette, 지역별 팔레트 현행화 | ★★☆ |
| `/update-doc` | 경로 현행화 (`projects/gamedesign/` 기준), gameplan 동기화 로직 추가 | ★☆☆ |

**각 커맨드의 공통 개편 방향**:
1. 프롬프트 레이어를 `promptExamples.ts`의 실제 데이터와 동기화
2. 검증 체크리스트를 docs/PROMPT-EXAMPLES.md §10과 통합
3. gameplan Tier 1 명세서 참조 링크 추가
4. `mcp__imggen__generate_image` 호출 예시를 실제 파라미터로 갱신

### 0-2. 기존 v5.0 에셋 정리

```
assets/
├── _archive/v5/          ← v5.0 에셋 이동 (신규 디렉토리)
│   ├── characters/       ← warrior v1/v2, paladin
│   ├── monsters/         ← slime, foxwolf
│   └── backgrounds/      ← forest, dungeon, castle
├── characters/           ← v4.0 에셋만 남김
├── monsters/
└── backgrounds/
```

- `.meta.json`에 `version`, `styleVersion` 필드 추가 검토
- v5.0 에셋은 삭제하지 않고 아카이브 (참고용)

---

## Phase 1: 확정 에셋 생성 (confirmed)

> **목표**: gameplan에서 설계가 확정된 엔티티의 v4.0 에셋을 우선 생성한다.

### 생성 우선순위

| 순서 | 카테고리 | 엔티티 | gameplan ID | 이유 |
|------|----------|--------|-------------|------|
| 1 | 카드 프레임 | 5종 전체 | — | 모든 에셋의 기반이 되는 프레임 |
| 2 | 캐릭터 | 전사 | CLS_W | 유일한 확정 캐릭터 |
| 3 | 숲 몬스터 T1 | 고블린, 독거미, 버섯 기생체 | MON_F01~03 | 튜토리얼 + 초반 몬스터 |
| 4 | 숲 몬스터 T2 | 가시덩굴, 골렘, 썩은나무 | MON_F04~05,07 | 중반~후반 확정 몬스터 |
| 5 | 동료 | 이끼요정, 야생늑대, 숲올빼미 | — | 캐릭터와 함께 사용 |
| 6 | 배경 | 4종 전체 | — | 전투/탐험 장면 배경 |

### 에셋 생성 워크플로우 (단일 에셋)

```
[1] 기획 검증
    - gameplan Tier 1에서 엔티티 스펙 확인
    - promptExamples.ts의 프롬프트 검토
    - designStatus === 'confirmed' 확인

[2] 프롬프트 실행
    - Claude 커맨드 (/gen-monster 등) 또는 수동 프롬프트
    - 마스터 스타일 + 개별 설명 + 네거티브 조합

[3] 검증 (QA 페르소나)
    - docs/PROMPT-EXAMPLES.md §10 체크리스트 대조
    - 방향/홍조/비율/배경색 확인
    - gameplan 정합성 (속성 표현, Tier 위협도)

[4] 저장
    - assets/{category}/ 에 이미지 저장
    - .meta.json 생성 (프롬프트, 버전, 날짜)

[5] 문서 갱신
    - TODO.md 체크
    - 필요 시 docs/PROMPT-EXAMPLES.md 업데이트
```

---

## Phase 2: 초안 에셋 생성 (draft)

> **목표**: gameplan에서 초안 상태인 엔티티의 프롬프트를 검토하고 에셋을 시험 생성한다.

| 엔티티 | gameplan ID | 상태 | 주의사항 |
|--------|-------------|------|----------|
| 늑대 (알파+베타) | MON_F06 | 초안 | HP 미확정, 2체 구성 특수 레이아웃 |

- 초안 엔티티는 gameplan 확정 시 프롬프트 재검토 필요
- 생성된 에셋에 `draft` 워터마크 또는 별도 디렉토리 관리 검토

---

## Phase 3: 미설계 에셋 기획 (undesigned)

> **목표**: gameplan에 등록은 되었으나 상세 설계가 없는 엔티티의 디자인 방향을 제안한다.

| 엔티티 | gameplan ID | 비고 |
|--------|-------------|------|
| 마법사 | CLS_M | 클래스 스탯 미설계, 프롬프트는 placeholder |
| 도적 | CLS_R | 클래스 스탯 미설계, 프롬프트는 placeholder |
| 고대 수목군주 | BOSS_F01 | 보스 메커닉 미설계, 2페이즈 전환 |

- **기획자 페르소나**로 gameplan 규칙 기반 디자인 제안서 작성
- gameplan 팀과 협의 후 designStatus 업데이트

---

## Phase 4: 컨셉 에셋 기획 (concept)

> **목표**: gameplan에 미등록인 향후 콘텐츠의 비주얼 방향을 미리 탐색한다.

| 카테고리 | 엔티티 | 비고 |
|----------|--------|------|
| 던전 몬스터 | 꼬마해골, 황금골렘, 던전고대왕 | gameplan 기획 대기 |
| 성 몬스터 | 집사갑옷, 뱀파이어백작 | gameplan 기획 대기 |

- 컨셉 아트 수준의 시험 생성만 진행
- gameplan에 피드백 제공 (디자인 가능성, 제약 사항)

---

## 반복 주기: gameplan 동기화

gameplan이 업데이트될 때마다:

```
1. git submodule update --remote projects/gameplan
2. Tier 1 문서 변경 사항 확인
3. promptExamples.ts의 gameplanId/designStatus 갱신
4. 영향받는 프롬프트 수정
5. docs/PROMPT-EXAMPLES.md 동기화
6. 필요 시 에셋 재생성
```

---

## 작업 시 페르소나 전환 규칙

| 작업 | 페르소나 | 자동 로드 매뉴얼 |
|------|----------|-----------------|
| 커맨드 개편 | 💻 수석 개발자 | CLAUDE.md 기술 스택, 기존 커맨드 구조 |
| 프롬프트 설계 | 🎯 기획자 | docs/PROMPT-EXAMPLES.md, gameplan Tier 1 |
| 에셋 생성/검증 | 🔍 QA | 검증 체크리스트, v4.0 스타일 규칙 |
| 코드 수정 | 💻 수석 개발자 | TypeScript 타입, 기존 패턴 |
| gameplan 동기화 | 🎯 기획자 + 💻 수석 개발자 | Tier 계층, 데이터 매핑 |

---

*이 문서는 Phase 진행에 따라 지속 업데이트됩니다.*
