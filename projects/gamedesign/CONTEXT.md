# CONTEXT.md — 게임 디자인 작업 맥락

> 이 문서는 모든 디자인 작업에서 참조해야 할 제약 사항, 기술 환경, 비주얼 가이드라인을 정의합니다.
> **최종 수정일**: 2026-02-23

---

## 1. Source of Truth 계층

### 데이터 권위 순서 (충돌 시 상위가 우선)

```
[1순위] projects/gameplan/docs/specific/  (Tier 1 — 최상위 명세서)
   ↓
[2순위] projects/gameplan/docs/plan/      (Tier 2 — 시스템 기획서)
   ↓
[3순위] projects/gamedesign/src/data/promptExamples.ts  (프롬프트 코드)
   ↓
[4순위] projects/gamedesign/docs/PROMPT-EXAMPLES.md  (프롬프트 문서)
```

- **Tier 1 ↔ promptExamples.ts 불일치 시**: Tier 1 기준으로 ts 파일 수정
- **ts 파일 ↔ docs/PROMPT-EXAMPLES.md 불일치 시**: ts 파일 기준으로 md 수정
- **gameplan 업데이트 시**: `git submodule update --remote projects/gameplan` 후 동기화 확인

### Tier 1 — 최상위 명세서 (`docs/specific/`)

| 문서 | 역할 | gamedesign 연동 |
|------|------|-----------------|
| `mindmap.md` | 환율, 기대값, 속성 시스템 | 몬스터 위협도 표현의 근거 |
| `몬스터-명세서.md` | 몬스터 ID, HP, 속성, 행동 패턴 | `gameplanId`, `designStatus` 매핑 |
| `클래스-명세서.md` | 클래스 ID, 능력치, 기본 스킬 | 캐릭터 프롬프트 근거 |
| `스킬-명세서.md` | 스킬 ID, 코스트, 효과 | 스킬 카드 에셋 (향후) |
| `월드-지역-라운드-풀-정의서.md` | 지역/라운드/풀 구조 | 배경 에셋 + 몬스터 등장 순서 |

### Tier 2 — 시스템 기획서 (`docs/plan/`)

| 문서 | gamedesign에서의 활용 |
|------|----------------------|
| `전투-시스템-종합-기획서.md` | 전투 장면 배경, UI 에셋 설계 근거 |
| `몬스터-행동-표시-시스템.md` | 몬스터 의도(Intent) 표시 규칙, 미공개 행동 |
| `스킬-프리뷰-시스템-기획서.md` | 스킬 프리뷰 3단계, 올인, 정보 3계층 |
| `라운드-진행바-기획서.md` | 상단바 노드, 정보 공개 규칙 |
| `마을-시스템-기획서.md` | 동료 에셋, 마을 배경 에셋 |
| `풀-밸런스-설계-기획서.md` | 몬스터 Tier별 위협 표현 강도 |

### 배틀씬 UI 설계서

- **경로**: `projects/gamedesign/docs/배틀씬-UI-레이아웃-설계서.md`
- **해상도**: 1920×1080 기준, CSS scale() 동적 스케일링
- **존 구조**: Zone A (상단 HUD 60px) + Zone B (전투 무대 740px) + Zone C (액션 바 280px)
- **핵심 컴포넌트**: 라운드 진행바, 플레이어/몬스터 상태, 코인 플립, 스킬 슬롯 ×4, 턴 종료
- **오버레이**: 스킬 프리뷰 3단계, 대상 지정 모드, 데미지 팝업, 올인 프리뷰

---

## 2. 비주얼 스타일: v4.0 Dark Frame Edition

### 핵심 비전
> "다크 실루엣 배경 위의 극적인 카드 게임 아트"

### 색상 팔레트

| 역할 | HEX | 용도 |
|------|-----|------|
| Card BG Start | `#1E1E24` | 카드 배경 그라데이션 시작 |
| Card BG End | `#2A2A32` | 카드 배경 그라데이션 끝 |
| Card Border | `#4A4A55` | 카드 테두리, 구분선 |
| HP/Panel BG | `#16161C` | HP바, 패널 배경 |
| Outline | `#1A1A1E` | 니어블랙 외곽선 (프롬프트용) |
| Gen BG | `#FFFFFF` | 생성용 흰색 배경 |
| 악센트 Primary | `#D4A574` | 하이라이트, 역광, 보상 |
| 악센트 Secondary | `#5A5F6B` | 금속, 중립 요소 |
| 악센트 Accent | `#C4867A` | 볼 홍조, 악센트 |

### 에셋 타입별 스타일 규칙

| 규칙 | 캐릭터 | 동료 | 몬스터 | 배경 |
|------|--------|------|--------|------|
| **마스터 스타일** | flat color, cel shading | flat color, cel shading | hand-drawn ink, pen&ink sketch | layered silhouette |
| **채색** | hard edge cel shading | hard edge cel shading | gouache + ink wash | dark muted palette |
| **외곽선** | bold near-black (#1A1A1E) | bold near-black (#1A1A1E) | variable line weight, organic | — |
| **방향** | 우측 ↗ (전진, 희망) | 우측 ↗ (전진, 희망) | 좌측 ↖ (대립, 위협) | — |
| **볼 홍조** | O (rosy blush) | O (rosy blush) | X (NO blush) | — |
| **캔버스 비율** | 2:3 세로형 | **1:1 정사각 (원형 프레임)** | 2:3 세로형 | 16:9 가로형 |
| **구도** | 전신 (head to feet) | 상반신/얼굴 클로즈업 | 전신 (head to feet) | — |
| **배경** | solid white | solid white | solid white | — |

### 금지 사항
- ❌ 순수 검정/흰색 → 따뜻한 어스톤 사용
- ❌ 네온/차가운 색상 → 머스타드/버건디/네이비 톤
- ❌ 과도한 채도 → 40-60% 유지
- ❌ v5.0 storybook 스타일 (양피지, 수채화, chibi SD)

### Tier별 위협 표현

| Tier | 등신 비율 | 존재감 | 프레임 악센트 |
|------|----------|--------|--------------|
| T1 (일반) | 2 등신 (tiny) | common enemy | 실버 #C0C0C0 |
| T2 (정예) | 2.5 등신 (small) | elite, notable presence | 퍼플 #6B4B8C |
| T3 (보스) | 3 등신 (medium) | legendary, aura of authority | 크림슨 #8B0000 |

---

## 3. 기술 환경

### 프로젝트 스택
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Zustand
- **Backend**: Express 5 + TypeScript
- **Build**: Vite 7 (Node.js 20.19+ 필요)
- **실행**: `.\projects\start-gamedesign.ps1` 또는 `cd projects/gamedesign && npm run dev`

### 프롬프트 데이터 구조
```typescript
interface PromptExample {
  id: string              // 프롬프트 고유 ID
  name: string            // 한국어 이름
  nameEn: string          // 영어 이름
  gameplanId?: string     // gameplan 명세서 ID (MON_F01, CLS_W 등)
  designStatus?: 'confirmed' | 'draft' | 'undesigned' | 'concept'
  group?: string          // 티어 또는 맵 구분
  prompt: string          // 이미지 생성 프롬프트
  negative: string        // 네거티브 프롬프트
}
```

### Claude 커맨드 (`/.claude/commands/`)
| 커맨드 | 현재 상태 | 비고 |
|--------|----------|------|
| `/gen-monster` | ✅ v4.0 완료 | ink illustration + gouache + muted earthy palette |
| `/gen-character` | ✅ v4.0 완료 | flat color + cel shading + 3종 클래스 |
| `/gen-background` | ✅ v4.0 완료 | layered silhouette + dark muted palette |
| `/update-doc` | ✅ 현행화 완료 | gameplan 동기화 로직 포함 |

---

## 4. 에셋 현황 (2026-02-23 기준)

### 프롬프트 정의 현황 (promptExamples.ts)

| 카테고리 | 종수 | confirmed | draft | undesigned | concept |
|----------|------|-----------|-------|------------|---------|
| 카드 프레임 | 9 | — | — | — | — |
| 캐릭터 | 3 | 1 (전사) | 0 | 2 (마법사, 도적) | 0 |
| 동료 | 3 | — | — | — | — |
| 숲 몬스터 | 8 | 6 | 1 (늑대) | 1 (수목군주) | 0 |
| 던전 몬스터 | 3 | 0 | 0 | 0 | 3 |
| 성 몬스터 | 2 | 0 | 0 | 0 | 2 |
| 배경 | 4 | — | — | — | — |
| UI 에셋 | 37 | — | — | — | — |
| **합계** | **69** | **7** | **1** | **3** | **5** |

### 생성된 에셋 (v5.0 시절, 재생성 필요)

| 카테고리 | 파일 | 상태 |
|----------|------|------|
| characters | warrior v1, v2, paladin | v5.0 → v4.0 재생성 필요 |
| monsters | slime, foxwolf | v5.0 → v4.0 재생성 필요, gameplan 미존재 엔티티 |
| backgrounds | forest, dungeon, castle | v5.0 → v4.0 재생성 필요 |
| frames | — | 미생성 |

---

## 5. 작업 프로토콜

### 전문가 모드 (자동 전환)

| 페르소나 | 활성화 조건 | 역할 |
|----------|------------|------|
| 🎯 **기획자** | 새 에셋 기획, gameplan 동기화 | Tier 1 참조 → 프롬프트 설계 |
| 💻 **수석 개발자** | 코드 수정, 커맨드 구현 | promptExamples.ts, commands 업데이트 |
| 🔍 **품질 관리자(QA)** | 생성 결과 검증, Audit | 체크리스트 대조, 스타일 준수 확인 |

### 매뉴얼 자동 호출

작업 시작 전 다음을 자동으로 상기:
1. **프롬프트 작업** → docs/PROMPT-EXAMPLES.md의 마스터 스타일 + 검증 체크리스트
2. **코드 수정** → CLAUDE.md의 기술 스택 + TypeScript 타입 안전성
3. **gameplan 동기화** → Tier 1 문서 확인 + designStatus 매핑 규칙
4. **에셋 검증** → 비주얼 스타일 v4.0 규칙 + 방향/홍조/비율 체크

### Audit 루틴 (모든 작업 완료 시 실행)

```
1. 수정 로그(Audit Log)
   - 어떤 파일의 어떤 로직이 변경되었는지 요약
   
2. 크로스 체크 (QA 페르소나)
   - 잠재적 오류 3가지 식별
   - v4.0 스타일 준수 여부
   - gameplan 정합성 여부
   
3. 셀프 체크리스트
   - TODO.md 항목 대조
   - 미진한 부분 즉시 수정 제안
```

---

## 6. 핵심 수치 (gameplan mindmap.md)

| 수치 | 값 | 디자인 영향 |
|------|-----|------------|
| 환율 | 파워1 = 앞면1 = 뒷면1 | — |
| 데미지 환율 | 앞면1 = 4 딜 | 몬스터 공격 이펙트 강도 표현 |
| 방어 환율 | 앞면1 = 3 방어 | 방어 이펙트 표현 |
| 속성 6종 | 독/포자/가시/경화/회피/취약 | 몬스터별 시각적 속성 표현 |
| 코인 성장 | 3 → 10개 | 진행도에 따른 복잡도 증가 |

---

*이 문서는 작업 진행에 따라 지속 업데이트됩니다.*
