# TODO.md — 게임 디자인 작업 체크리스트

> 완료 시 `[ ]` → `[x]`로 변경. 각 항목은 독립 실행 가능한 최소 단위.
> **최종 수정일**: 2026-02-23

---

## Phase 0: 인프라 정비

### 0-1. Claude 커맨드 v4.0 현대화

- [x] `/gen-monster` 커맨드 v4.0 개편
  - [x] Layer 1 마스터 스타일 → ink illustration + gouache + muted earthy palette
  - [x] Layer 2 에셋 레이어 → 좌측 ↖ 방향, NO blush, 2:3 세로형, 흰배경
  - [x] Layer 3 Tier별 수정자 → 등신 비율(2/2.5/3), 존재감 키워드
  - [x] Layer 4 지역별 수정자 → 숲(earthy green/brown), 던전(stone/bone), 성(burgundy/gold)
  - [x] Layer 5 네거티브 → MONSTER_NEGATIVE와 동기화
  - [x] gameplan Tier 1 참조 추가 (몬스터-명세서, 속성 시스템)
  - [x] 검증 체크리스트 → docs/PROMPT-EXAMPLES.md §10과 통합
  - [x] 성공 사례 프롬프트 → promptExamples.ts 고블린 기준으로 교체

- [x] `/gen-character` 커맨드 v4.0 개편
  - [x] Layer 1 마스터 스타일 → flat color illustration + cel shading
  - [x] Layer 2 에셋 레이어 → 우측 ↗ 방향, rosy blush, 2:3 세로형, 흰배경
  - [x] Layer 3 클래스별 레이어 → 전사/마법사/도적 3종 (팔라딘 제거)
  - [x] 전사 레이어 → promptExamples.ts 데이터와 동기화 (burgundy #8B4049, steel #5A5F6B)
  - [x] Layer 4 네거티브 → CHARACTER_NEGATIVE와 동기화
  - [x] gameplan Tier 1 참조 추가 (클래스-명세서)
  - [x] 검증 체크리스트 현행화

- [x] `/gen-background` 커맨드 v4.0 개편
  - [x] Layer 1 마스터 스타일 → layered silhouette + dark muted palette + vignette
  - [x] Layer 2 에셋 레이어 → 16:9 가로형, no characters
  - [x] Layer 3 지역별 레이어 → v4.0 색상 팔레트로 교체
  - [x] Layer 4 네거티브 → BG_NEGATIVE와 동기화
  - [x] 검증 체크리스트 현행화

- [x] `/update-doc` 커맨드 경로 현행화
  - [x] 문서 인덱스 경로를 현재 프로젝트 구조에 맞게 수정
  - [x] gameplan 동기화 로직 추가

### 0-2. 기존 v5.0 에셋 아카이브

- [x] `assets/_archive/v5/` 디렉토리 생성
- [x] v5.0 캐릭터 에셋 이동 (warrior v1/v2, paladin)
- [x] v5.0 몬스터 에셋 이동 (slime, foxwolf)
- [x] v5.0 배경 에셋 이동 (forest, dungeon, castle)
- [x] 원본 디렉토리에서 v5.0 에셋 제거 (CLAUDE.md는 유지)

---

## Phase 0.5: 배틀씬 UI 설계

- [x] 전투 시스템 기획서 4종 완독 (전투 종합, 몬스터 행동, 스킬 프리뷰, 라운드 진행바)
- [x] 기존 UI 에셋 가이드 분석 (icons, buttons, coins, frames CLAUDE.md)
- [x] Slay the Spire / 덱빌더 UI 레이아웃 리서치
- [x] 배틀씬 UI 레이아웃 설계서 작성
  - [x] Zone A 상단 HUD (지역명, 진행바, 라운드, 소울, 메뉴)
  - [x] Zone B 전투 무대 (플레이어, 몬스터 1~3체, 코인 플립, 데미지 팝업)
  - [x] Zone C 액션 바 (턴 상태, 코인 현황, 스킬 슬롯 ×4, 턴 종료)
  - [x] 오버레이 레이어 (스킬 프리뷰 3단계, 타겟 모드, 올인)
  - [x] 동적 크기 조절 (CSS scale, 레터박스, 리사이즈)
  - [x] 타이포그래피 + 색상 시스템 + Z-index 정의
  - [x] 전체 좌표 요약표 (절대 px 좌표)

### 0.5-2. UI 프롬프트 작성 + 웹앱 동기화

- [x] UI 스타일 베이스 4종 정의 (UI_ICON_STYLE, UI_COIN_STYLE, UI_BUTTON_STYLE, UI_NODE_STYLE)
- [x] UI_NEGATIVE 상수 추가
- [x] 스킬 프레임 4종 frame 카테고리에 추가 (attack, defense, buff, utility)
- [x] ui 카테고리 37종 엔트리 추가
  - [x] 코인 4종 (heads, tails, edge, pouch)
  - [x] 버튼 5종 (end-turn, all-in, cancel, confirm, skill-use)
  - [x] 상태 아이콘 7종 (poison, spore, thorns, hardening, evasion, vulnerable, strength)
  - [x] 리소스 아이콘 4종 (hp-heart, defense-shield, soul-gem, coin-counter)
  - [x] 몬스터 의도 5종 (attack, defense, buff, debuff, unknown)
  - [x] 턴 페이즈 4종 (start, coin-flip, player, monster)
  - [x] 라운드 노드 5종 (monster, elite, shop, event, boss)
  - [x] 기타 3종 (settings, target-cursor, defense-badge)
- [x] ExampleCategory 타입에 'ui' 추가
- [x] PromptLibrary.tsx — CATEGORY_LABELS, categories 배열, stats, 통계 문자열 동기화
- [x] TypeScript 타입 체크 통과 (tsc --noEmit EXIT_CODE:0)
- [x] 프롬프트 품질 스팟 체크 (영어 only, HEX 코드 포함, 해상도 명시)

---

## Phase 1: 확정 에셋 생성 (confirmed)

### 1-1. 카드 프레임 (9종)

- [ ] 플레이어 프레임 (골든 #FFD700)
- [ ] T1 프레임 — 일반 (실버 #C0C0C0)
- [ ] T2 프레임 — 정예 (퍼플 #6B4B8C)
- [ ] T3 프레임 — 보스 (크림슨 #8B0000)
- [ ] 동료 프레임 (시안 #00BCD4)
- [ ] 스킬 프레임 — 공격 (레드 #C05050)
- [ ] 스킬 프레임 — 방어 (블루 #4A90C0)
- [ ] 스킬 프레임 — 버프 (골드 #D4A574)
- [ ] 스킬 프레임 — 유틸리티 (그린 #4A8C6B)

### 1-2. 캐릭터 (1종)

- [ ] 전사 (CLS_W) — v4.0 재생성
  - [ ] 프롬프트 검증 (promptExamples.ts 대조)
  - [ ] 이미지 생성
  - [ ] QA 체크리스트 통과
  - [ ] .meta.json 생성

### 1-3. 숲 몬스터 T1 (3종)

- [ ] 고블린 (MON_F01) — HP 18, 속성 없음, 튜토리얼
  - [ ] 이미지 생성 + QA + meta
- [ ] 독거미 (MON_F02) — HP 18, 독+회피, 보라색 독 마킹
  - [ ] 이미지 생성 + QA + meta
- [ ] 버섯 기생체 (MON_F03) — HP 18, 포자, 균사 오버그로스
  - [ ] 이미지 생성 + QA + meta

### 1-4. 숲 몬스터 T2 (3종)

- [ ] 가시 덩굴 (MON_F04) — HP 18, 가시, 초록 덩굴
  - [ ] 이미지 생성 + QA + meta
- [ ] 골렘 (MON_F05) — HP 18, 경화, 이끼 돌
  - [ ] 이미지 생성 + QA + meta
- [ ] 썩은 나무 (MON_F07) — HP 24, 집중+지속방어, 부패 나무
  - [ ] 이미지 생성 + QA + meta

### 1-5. 동료 (3종)

- [ ] 이끼 요정 — 힐링 그린 아우라
  - [ ] 이미지 생성 + QA + meta
- [ ] 야생 늑대 — 충성스런 전투 동반자
  - [ ] 이미지 생성 + QA + meta
- [ ] 숲 올빼미 — 현자형 지식 동반자
  - [ ] 이미지 생성 + QA + meta

### 1-6. 배경 (4종)

- [ ] 햇살 숲 - 낮 (숲 전투 배경)
  - [ ] 이미지 생성 + QA + meta
- [ ] 햇살 숲 - 황혼 (숲 이벤트 배경)
  - [ ] 이미지 생성 + QA + meta
- [ ] 보물 창고 (던전 보상 배경)
  - [ ] 이미지 생성 + QA + meta
- [ ] 성 정원 (성 탐험 배경)
  - [ ] 이미지 생성 + QA + meta

---

## Phase 2: 초안 에셋 생성 (draft)

### 2-1. 숲 몬스터

- [ ] 늑대 알파+베타 (MON_F06) — HP TBD, 하울링, 2체 구성
  - [ ] gameplan 확정 대기 또는 초안 기반 시험 생성
  - [ ] 이미지 생성 + QA + meta

---

## Phase 3: 미설계 에셋 기획 (undesigned)

### 3-1. 캐릭터

- [ ] 마법사 (CLS_M) — gameplan 확정 후 프롬프트 재설계
- [ ] 도적 (CLS_R) — gameplan 확정 후 프롬프트 재설계

### 3-2. 숲 보스

- [ ] 고대 수목군주 (BOSS_F01) — 2페이즈 메커닉 확정 후 디자인

---

## Phase 4: 컨셉 에셋 기획 (concept)

### 4-1. 던전 몬스터

- [ ] 꼬마 해골 — gameplan 기획 대기
- [ ] 황금 골렘 — gameplan 기획 대기
- [ ] 던전의 고대왕 — gameplan 기획 대기

### 4-2. 성 몬스터

- [ ] 집사 갑옷 — gameplan 기획 대기
- [ ] 뱀파이어 백작 — gameplan 기획 대기

---

## 진행 상황 요약

| Phase | 전체 | 완료 | 진행률 |
|-------|------|------|--------|
| Phase 0 | 24 | 24 | 100% ✅ |
| Phase 0.5 (UI 설계) | 11 | 11 | 100% ✅ |
| Phase 0.5 (UI 프롬프트) | 14 | 14 | 100% ✅ |
| Phase 1 | 24 | 0 | 0% |
| Phase 2 | 2 | 0 | 0% |
| Phase 3 | 3 | 0 | 0% |
| Phase 4 | 5 | 0 | 0% |
| **합계** | **83** | **49** | **59%** |

---

*이 문서는 작업 완료 시마다 업데이트됩니다.*
