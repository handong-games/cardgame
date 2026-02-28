# 실전 프롬프트 예시 종합 가이드

**목적**: 모든 게임 에셋의 복사-붙여넣기 가능한 실전 프롬프트 레퍼런스  
**스타일**: v4.0 Dark Frame Edition  
**총 에셋**: 28종 (프레임 5 + 캐릭터 3 + 동료 3 + 숲 8 + 던전 3 + 성 2 + 배경 4)  
**데이터 원천**: `src/data/promptExamples.ts` (Source of Truth)  
**기획 원천**: `projects/gameplan` (게임 기획서)

---

## 목차

1. [마스터 스타일 베이스](#1-마스터-스타일-베이스)
2. [카드 프레임 프롬프트 (5종)](#2-카드-프레임-프롬프트-5종)
3. [캐릭터 프롬프트 (3종)](#3-캐릭터-프롬프트-3종)
4. [동료 프롬프트 (3종)](#4-동료-프롬프트-3종)
5. [숲 몬스터 프롬프트 (8종)](#5-숲-몬스터-프롬프트-8종)
6. [던전 몬스터 프롬프트 (3종)](#6-던전-몬스터-프롬프트-3종)
7. [성 몬스터 프롬프트 (2종)](#7-성-몬스터-프롬프트-2종)
8. [배경 프롬프트 (4종)](#8-배경-프롬프트-4종)
9. [네거티브 프롬프트 (4종)](#9-네거티브-프롬프트-4종)
10. [검증 체크리스트](#10-검증-체크리스트)

---

## 1. 마스터 스타일 베이스

### 캐릭터/동료 마스터 스타일

```
flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black (#1A1A1E),
muted desaturated dark fantasy color palette,
solid white background for clean extraction,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face
```

### 몬스터 마스터 스타일

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring with controlled color application,
muted earthy color palette (35-55% saturation),
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature silhouette edges
```

### 배경 마스터 스타일

```
layered silhouette background style,
dark muted color palette with low saturation,
strong vignette effect with darker edges,
minimal atmospheric scene design,
wide 16:9 aspect ratio,
no characters no creatures
```

### 방향 규칙

| 에셋 타입 | 방향 | 비율 | 볼 홍조 |
|-----------|------|------|---------|
| 캐릭터/동료 | 우측 대각선 ↗ | 2:3 세로형 | O |
| 몬스터 | 좌측 대각선 ↖ | 2:3 세로형 | X |
| 배경 | — | 16:9 가로형 | — |

---

## 2. 카드 프레임 프롬프트 (5종)

> 전체 프롬프트는 `src/data/promptExamples.ts`의 `frame` 섹션 참조

| ID | 이름 | 악센트 색상 | 용도 |
|----|------|------------|------|
| `frame-player` | 플레이어 프레임 | 골든 #FFD700 | 플레이어 캐릭터 |
| `frame-t1` | T1 프레임 (일반) | 실버 #C0C0C0 | 일반 몬스터 |
| `frame-t2` | T2 프레임 (정예) | 퍼플 #6B4B8C | 정예 몬스터 |
| `frame-t3` | T3 프레임 (보스) | 크림슨 #8B0000 | 보스 몬스터 |
| `frame-companion` | 동료 프레임 | 시안 #00BCD4 | 동료 크리처 |

**공통 구조**: 다크 차콜 배경 #1E1E24 → 딥 그레이 내부 #2A2A32 → 그래파이트 테두리 #4A4A55 → 비네트 #0F0F14

---

## 3. 캐릭터 프롬프트 (3종)

> gameplan `클래스-명세서.md` 기반 (`docs/specific/`)

| ID | gameplan ID | 이름 | 설계 상태 | 악센트 |
|----|------------|------|-----------|--------|
| `warrior` | CLS_W | 전사 | ✅ 확정 | 버건디 #8B4049, 스틸 #5A5F6B |
| `mage` | CLS_M | 마법사 | ⬜ 미설계 | 네이비 #2A3A5C, 퍼플 #6B4B8C |
| `rogue` | CLS_R | 도적 | ⬜ 미설계 | 그레이 #3A3A40, 에메랄드 #2D5A3D |

### 전사 (CLS_W) — 확정

```
flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black,
muted desaturated dark fantasy color palette,
earthy tones with burgundy ochre navy accents,
stylized character illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face,

vertical portrait 2:3 aspect ratio,
stylized semi-chibi proportions,
2.5 to 3 head body ratio,
full body composition showing head to feet,
character fits entirely within frame with small margin at bottom,
large expressive eyes with highlights,

subtle rosy blush on cheeks,
small circular pink blush marks,
confident charismatic expression,
slight smirk or determined smile,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

warrior class character,
short spiky reddish-brown messy hair,
muted burgundy worn armor (#8B4049),
weathered steel metal pieces (#5A5F6B),
scratched battle-worn armor details,
NO gold decorations beginner adventurer,
simple worn leather belt (#6B4423),
naturally holding oversized old sword in hand,
brave determined expression,

white background,
single character illustration only
```

> 마법사, 도적의 프롬프트는 `promptExamples.ts`의 `character` 섹션 참조. gameplan 미설계 상태이므로 placeholder입니다.

---

## 4. 동료 프롬프트 (3종)

| ID | 이름 | 악센트 |
|----|------|--------|
| `moss-fairy` | 이끼 요정 | 그린 #4A6741, 힐링 #7CFC00 |
| `wild-wolf` | 야생 늑대 | 그레이브라운 #8B7D6B, 앰버 #DAA520 |
| `forest-owl` | 숲 올빼미 | 브라운 #8B6914, 베이지 #D2B48C |

> 전체 프롬프트는 `promptExamples.ts`의 `companion` 섹션 참조

---

## 5. 숲 몬스터 프롬프트 (8종) ★

> gameplan `몬스터-명세서.md` 기반 (`docs/specific/`) — **핵심 에셋**

| ID | gameplan ID | 이름 | Tier | 설계 상태 |
|----|------------|------|------|-----------|
| `goblin` | MON_F01 | 고블린 | T1 | ✅ 확정 |
| `poison-spider` | MON_F02 | 독거미 | T1 | ✅ 확정 |
| `spore-parasite` | MON_F03 | 버섯 기생체 | T1 | ✅ 확정 |
| `thorn-vine` | MON_F04 | 가시 덩굴 | T2 | ✅ 확정 |
| `golem` | MON_F05 | 골렘 | T2 | ✅ 확정 |
| `wolf-pack` | MON_F06 | 늑대 (알파+베타) | T2 | 📝 초안 |
| `rotten-tree` | MON_F07 | 썩은 나무 | T2 | ✅ 확정 |
| `ancient-grove-lord` | BOSS_F01 | 고대 수목군주 | T3 | ⬜ 미설계 |

### T1 — 고블린 (MON_F01)

> HP 18 | 속성: 없음 (튜토리얼) | 패턴: 공격6 → 방어2 → 반복 | R1 고정 등장

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
tiny 2 head ratio,
common enemy creature,

small goblin creature,
simple crude appearance tutorial-level weak enemy,
greenish-tinted skin (#4A6741),
ragged torn cloth clothing,
holding small rusty knife,
hunched sneaky posture,
beady cunning eyes,
pointy ears and crooked nose,

enchanted forest aesthetic,
forest green and warm brown palette (#2D5A3D, #6B4423),

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

### T1 — 독거미 (MON_F02)

> HP 18 | 속성: 독(Poison) + 회피(Evasion) | 패턴: 매턴 공격1+독2, 격턴 회피 | R2~3 초반

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
tiny 2 head ratio,
common enemy creature,

eight-legged spider creature,
venom droplets dripping from fangs,
web silk strand elements,
purple-tinted venom markings on abdomen (#6B4B8C),
dark muted brown carapace (#4A3A2A),
multiple beady eyes glinting,
stealthy lurking posture,
dark and secretive atmosphere,

enchanted forest aesthetic,
dark brown and muted purple palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

### T1 — 버섯 기생체 (MON_F03)

> HP 18 | 속성: 포자(Spore) | 패턴: 포자1 → 공격4 → 포자+공격 가속 | R2~3 초반

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
tiny 2 head ratio,
common enemy creature,

parasitic mushroom-covered creature,
fungal growths overtaking host body,
spore particles floating in air around creature,
moldy fungal texture on surface (#8B668B),
disturbing organic overgrowth,
cap-like mushroom head,
shambling unnatural posture,

enchanted forest aesthetic,
muted purple and earthy brown palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

### T2 — 가시 덩굴 (MON_F04)

> HP 18 | 속성: 가시(Thorns) | 패턴: 가시2 → 공격4 → 반복 (가시 턴 = 쉬는 턴) | R4~5 중반

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

thorn-covered vine plant creature,
twisted and coiling stems (#2D5A3D),
sharp thorns protruding from body,
plant-type monster with writhing tendrils,
dark forest green vines with brown woody sections (#6B4423),
menacing coiled strike posture,

enchanted forest aesthetic,
deep forest green and warm brown palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

### T2 — 골렘 (MON_F05)

> HP 18 | 속성: 경화(Hardening) | 패턴: 경화1 → 경화1+공격4 → 공격 가속 | R4~5 중반

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

solid stone golem creature,
moss-covered rock surface (#4A6741),
cracks and crevices with faint inner glow,
heavy sturdy imposing build,
rounded boulder body warm gray (#5A5F6B),
small mushrooms and lichen on shoulders,
stoic guardian stance,

enchanted forest aesthetic,
stone gray and moss green palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

### T2 — 늑대 (MON_F06) 📝 초안

> HP TBD | 속성: 하울링(힘 버프) | 패턴: 2마리 교대 — 알파/베타 엇갈림 버프+공격 | R6~7 후반

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

two wolves as single group,
alpha wolf and beta wolf in hunting formation,
bared fangs in aggressive hunting stance,
moonlit howling atmosphere,
dark gray and brown fur (#5A5F6B, #6B4423),
fierce amber eyes (#DAA520),
pack dynamics with coordinated posture,
alpha slightly larger and forward,

enchanted forest aesthetic,
dark gray and warm brown palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background
```

### T2 — 썩은 나무 (MON_F07)

> HP 24 | 속성: 집중 + 지속방어(나무껍질) | 패턴: 집중(2턴)→대공격15→방어6, 3타로 해제 | R6~7 후반

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

massive rotting tree creature,
decaying bark and mold covering trunk (#6B4423),
fungus and moss patches (#4A6741),
glowing hollow eye sockets with eerie light,
slow but powerfully threatening presence,
gnarled twisted branches as arms,
roots partially uprooted from ground,

enchanted forest aesthetic,
dark brown and muted green palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

### T3 — 고대 수목군주 (BOSS_F01) ⬜ 미설계

> HP — | 속성: 뿌리속박 + 경화 + 회복 | 패턴: 2페이즈(50%HP 전환), 미설계 | R8 보스 고정

```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
medium 3 head ratio,
imposing presence,
legendary boss creature,
aura of authority,

colossal ancient tree boss creature,
roots and branches as weapons,
covered in moss and creeping vines (#2D5A3D, #4A6741),
ancient bark armor with deep cracks (#6B4423),
majestic forest ruler dignity,
boss aura radiating power,
crown of leaves and branches,
glowing amber eyes of ancient wisdom,

enchanted forest aesthetic,
deep green brown and golden accent palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

---

## 6. 던전 몬스터 프롬프트 (3종)

> ⚠️ 향후 gameplan 기획 예정 (`designStatus: 'concept'`)

| ID | 이름 | Tier |
|----|------|------|
| `tiny-skeleton` | 꼬마 해골 | T1 |
| `golden-golem` | 황금 골렘 | T2 |
| `ancient-dungeon-king` | 던전의 고대왕 | T3 |

> 전체 프롬프트는 `promptExamples.ts`의 `dungeon` 섹션 참조

---

## 7. 성 몬스터 프롬프트 (2종)

> ⚠️ 향후 gameplan 기획 예정 (`designStatus: 'concept'`)

| ID | 이름 | Tier |
|----|------|------|
| `butler-armor` | 집사 갑옷 | T2 |
| `vampire-count` | 뱀파이어 백작 | T3 |

> 전체 프롬프트는 `promptExamples.ts`의 `castle` 섹션 참조

---

## 8. 배경 프롬프트 (4종)

| ID | 이름 | 맵 |
|----|------|----|
| `sunny-forest-day` | 햇살 숲 - 낮 | 숲 |
| `sunny-forest-dusk` | 햇살 숲 - 황혼 | 숲 |
| `treasure-room` | 보물 창고 | 던전 |
| `castle-garden` | 성 정원 | 성 |

> 전체 프롬프트는 `promptExamples.ts`의 `background` 섹션 참조

---

## 9. 네거티브 프롬프트 (4종)

### FRAME_NEGATIVE

```
character illustration, person, creature, monster,
coin edge pattern, ridged border, gear teeth,
sun emblem, moon symbol, celestial decorations,
bright vibrant colors, neon glow, saturated colors,
3D render, photorealistic, hyper detailed,
complex ornate decorations, baroque style,
modern minimalist flat vector,
anime style, cartoon style,
watercolor bleeding, paint splatters,
text, letters, numbers, words,
multiple frames, tilted angle
```

### CHARACTER_NEGATIVE

```
dark gothic horror scary,
photorealistic 3D render CGI,
cold colors blue purple dominant,
harsh shadows high contrast,
anime manga style sharp lines,
no blush on cheeks,
scary fierce expression,
shiny metallic armor,
facing left,
looking left,
back view,
realistic human proportions,
cream background, parchment texture, complex detailed background,
hand-drawn border frame, tarot card border, card frame, decorative border,
cropped body, cut off limbs, missing legs, missing feet,
blurry low quality
```

### MONSTER_NEGATIVE

```
rosy blushing cheeks, facing right, looking right,
photorealistic, 3D render, CGI,
dark horror scary gothic,
cream paper, parchment texture, complex detailed background,
multiple characters,
creature too dark blending into shadows,
blurry low quality
```

### BG_NEGATIVE

```
characters people figures,
dark horror scary atmosphere,
cold blue dominant colors,
photorealistic 3D render CGI,
complex cluttered composition,
cream paper texture, parchment background,
bright saturated colors,
blurry low quality
```

---

## 10. 검증 체크리스트

### 프롬프트 생성 시 필수 확인

- [ ] **스타일 베이스**: 에셋 타입에 맞는 마스터 스타일 포함 여부
- [ ] **방향**: 캐릭터 → 우측 ↗ / 몬스터 → 좌측 ↖
- [ ] **볼 홍조**: 캐릭터/동료 → O / 몬스터 → X
- [ ] **비율**: 캐릭터/몬스터 2:3 / 배경 16:9
- [ ] **배경**: 모두 `solid white background`
- [ ] **네거티브**: 에셋 타입에 맞는 네거티브 프롬프트 적용
- [ ] **gameplan 정합성**: gameplanId와 designStatus 일치 확인
- [ ] **gameplan Tier 1 참조**: 엔티티 데이터는 `docs/specific/` 명세서 기준

### 데이터 원천 확인

- [ ] `promptExamples.ts`가 이 문서보다 우선 (코드 = Source of Truth)
- [ ] gameplan 명세서가 게임 설계의 최상위 원천
- [ ] 이 문서 ↔ ts 파일 불일치 시 ts 파일 기준으로 수정

---

*작성일: 2026-02-22 | Source of Truth: `src/data/promptExamples.ts`*
