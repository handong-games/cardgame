# 실전 프롬프트 예시 종합 가이드

**목적**: 모든 게임 에셋의 복사-붙여넣기 가능한 실전 프롬프트 레퍼런스  
**스타일**: v6.0 "라벤더 안개" (Lavender Mist)  
**총 에셋**: 프레임 9 + 캐릭터 3 + 동료 3 + NPC 1 + 숲 몬스터 8 + 던전 몬스터 3 + 성 몬스터 2 + 배경 4 + UI + 스킬 아이콘  
**데이터 원천**: `src/data/promptExamples.ts` (Source of Truth)  
**기획 원천**: `projects/gameplan` (게임 기획서)  
**디자인 DNA**: `docs/비주얼-디자인-DNA-v6.md`

> 이 문서는 운영용 프롬프트 레퍼런스다. 실제 생성에 사용되는 최종 문자열은 항상 `src/data/promptExamples.ts`를 우선한다.

---

## 목차

1. [마스터 스타일 베이스](#1-마스터-스타일-베이스)
2. [카드 프레임 프롬프트 (9종)](#2-카드-프레임-프롬프트-9종)
3. [캐릭터 프롬프트 (3종)](#3-캐릭터-프롬프트-3종)
4. [동료 프롬프트 (3종)](#4-동료-프롬프트-3종)
5. [숲 몬스터 프롬프트 (8종)](#5-숲-몬스터-프롬프트-8종)
6. [던전 몬스터 프롬프트 (3종)](#6-던전-몬스터-프롬프트-3종)
7. [성 몬스터 프롬프트 (2종)](#7-성-몬스터-프롬프트-2종)
8. [배경 프롬프트 (4종)](#8-배경-프롬프트-4종)
9. [NPC 프롬프트 (1종)](#9-npc-프롬프트-1종)
10. [UI 프롬프트](#10-ui-프롬프트)
11. [네거티브 프롬프트 (6종)](#11-네거티브-프롬프트-6종)
12. [검증 체크리스트](#12-검증-체크리스트)

---

## 1. 마스터 스타일 베이스

### 운영 원칙

- 엔티티별 상세 프롬프트 변경은 항상 `src/data/promptExamples.ts`에서 먼저 수행한다.
- 이 문서는 `promptExamples.ts`의 구조와 핵심 예시를 설명하는 운영 문서다.
- 스타일 원칙은 `docs/비주얼-디자인-DNA-v6.md`, 본질적 판단 기준은 `docs/디자인-에센스-v6.md`를 함께 따른다.

> v6.0 "라벤더 안개" — 캐릭터와 몬스터가 **같은 bust portrait 플랫 컬러 일러스트 기조**를 공유합니다.

### 캐릭터/동료/NPC 마스터 스타일

```
simple flat color illustration with clean solid fills and no gradients,
bust portrait from mid-chest upward,
centered composition with moderate headroom above the head,
character fills most of the frame,
card game character portrait for cozy fantasy card game,
super-deformed chibi proportions around 2 to 2.5 head body ratio,
flat coloring with only 3 to 5 colors per character and no shading or tonal layering,
single color uniform weight outline in warm dark tone,
muted warm pastel colors strictly 40 to 55 percent saturation,
silhouette-driven character design recognizable from shape alone,
only 1 to 2 iconic props maximum,
tiny simplified eyes with no visible pupils or irises, paired with short simple line eyebrows and no nose detail,
body facing right at three-quarter angle looking toward right side,
solid cream parchment background #F0E8D8,
no border no frame,
vertical portrait 2:3 aspect ratio,
strictly flat color fills with hard boundaries between each color region,
each color region is a single solid tone with no internal variation,
zero gradients zero shading zero tonal layering within any shape
```

### 몬스터 마스터 스타일

> 캐릭터와 같은 플랫 컬러 일러스트 결을 유지하면서, 몬스터는 지역별 컬러 아웃라인 언더톤과 좌측 방향으로 구분합니다.
> 운영 예외: 실제 생성본은 누끼 작업 효율을 위해 **pure solid white background**를 사용합니다. 최상위 컨셉 문서의 크림 양피지 배경 규칙은 인게임 표현 기준으로 유지합니다.

```
simple flat color illustration with clean solid fills and no gradients,
bust portrait of fantasy creature or monster from mid-chest upward,
centered composition with moderate headroom above the head,
creature fills most of the frame,
card game monster portrait for cozy fantasy card game,
super-deformed chibi proportions around 2 to 2.5 head body ratio,
flat coloring with only 3 to 5 colors per creature and no shading or tonal layering,
single color uniform weight outline with [region undertone: mint-green/sky-blue/rose],
muted warm pastel colors strictly 40 to 55 percent saturation,
silhouette-driven monster design recognizable from shape alone,
tiny simplified eyes with no visible pupils or irises, paired with short simple line eyebrows,
cute and charming monster design that is not scary or threatening,
body facing left at three-quarter angle opposing the hero,
isolated on pure solid white background for easy background removal and cutout workflow,
no border no frame,
vertical portrait 2:3 aspect ratio,
strictly flat color fills with hard boundaries between each color region,
each color region is a single solid tone with no internal variation,
zero gradients zero shading zero tonal layering within any shape
```

### 배경 마스터 스타일

```
hand-painted storybook watercolor illustration background,
dreamy muted pastel environment with soft visible brushwork,
warm natural color tones without any color tint or cast,
gentle blur effect 60 to 70 percent for depth of field,
atmospheric fantasy landscape,
no characters no creatures no cards,
soft warm diffused lighting,
wide landscape 16:9 aspect ratio,
cozy fairy tale mood with gentle storybook atmosphere,
center area intentionally kept open for cards and UI
```

### 방향 규칙

| 에셋 타입 | 방향 | 비율 | 구도 | 배경 |
|-----------|------|------|------|------|
| 캐릭터 | 우측 → (3/4) | 2:3 세로형 | bust portrait (mid-chest upward) | cream parchment `#F0E8D8` |
| 동료 | 우측 → (3/4) | 1:1 정사각 (원형 프레임) | bust/얼굴 클로즈업 | cream parchment `#F0E8D8` |
| NPC | 정면 또는 3/4 | 2:3 세로형 | bust portrait (mid-chest upward) | cream parchment `#F0E8D8` |
| 몬스터 | 좌측 ← (3/4) | 2:3 세로형 | bust portrait (mid-chest upward) | cream parchment `#F0E8D8` |
| 배경 | — | 16:9 가로형 | 환경만 (생물 금지) | — |

### 색상 시스템 요약

| 역할 | HEX | 용도 |
|------|-----|------|
| 주조색 (라벤더) | `#D8C8E8` | 게임 전체 기조 |
| 보조색 (연핑크) | `#E8D0D8` | 보조 배경 |
| 크림 (양피지) | `#F0E8D8` | 카드 배경, 프레임 |
| 골드 악센트 | `#C9A86C` | 강조, 코인, UI |
| 텍스트 주요 | `#3A3040` | 다크 라벤더 |
| 텍스트 보조 | `#6A6070` | 뮤트드 그레이 |

---

## 2. 카드 프레임 프롬프트 (9종)

> 전체 프롬프트는 `src/data/promptExamples.ts`의 `frame` 섹션 참조

### 캐릭터/몬스터 프레임 (5종)

| ID | 이름 | 테두리 HEX | 용도 | 비율 |
|----|------|-----------|------|------|
| `frame-player` | 플레이어 프레임 | 로즈쿼츠 `#E8B4B8` | 플레이어 캐릭터 | 2:3 세로 |
| `frame-t1` | T1 프레임 (일반) | 뮤트드 실버 `#B8B8C8` | 일반 몬스터 | 2:3 세로 |
| `frame-t2` | T2 프레임 (정예) | 뮤트드 골드 `#C8B888` | 정예 몬스터 | 2:3 세로 |
| `frame-t3` | T3 프레임 (보스) | 뮤트드 로즈 `#C89098` | 보스 몬스터 | 2:3 세로 |
| `frame-companion` | 동료 프레임 | 골드 `#C9A86C` | 동료 크리처 | 1:1 원형 |

### 스킬 카드 프레임 (4종)

| ID | 이름 | 테두리 HEX | 용도 | 비율 |
|----|------|-----------|------|------|
| `skill-frame-attack` | 공격 스킬 프레임 | 파스텔 로즈 `#D4A0A0` | 공격 스킬 카드 | 1:1 정사각 |
| `skill-frame-defense` | 방어 스킬 프레임 | 파스텔 스카이 `#A0B8D4` | 방어 스킬 카드 | 1:1 정사각 |
| `skill-frame-buff` | 버프 스킬 프레임 | 파스텔 세이지 `#A0C8A0` | 버프 스킬 카드 | 1:1 정사각 |
| `skill-frame-utility` | 유틸 스킬 프레임 | 파스텔 라벤더 `#B8A0D4` | 유틸리티 스킬 카드 | 1:1 정사각 |

**캐릭터/몬스터 프레임 핵심**: 분홍 띠(내부 밴드)가 카드 전체 2:3 비율을 정확히 따라가야 하며, 아래쪽 외곽 폭도 좌우와 동일해야 한다. 프레임 안쪽은 추가 박스 없이 자연스럽게 비워 두고, 네임플레이트는 이전보다 조금 더 아래에 두되 리본 중단 뒤로 분홍 띠가 살짝 보이는 오버레이 리본으로 본다.

`frame-t1`, `frame-t2`는 `frame-player`와 **동일한 프레임 형태**를 유지하고, 내부 띠 색만 Tier 색으로 변경한다.

`frame-t3`는 같은 기본 형태를 유지하되, **보스용 절제된 장식**(작은 상단 크레스트나 은은한 코너 인셋)만 추가한다.

**스킬 프레임 핵심**: 큰 바깥 프레임 내부에 장식 패널을 만들지 않고, 중앙의 단일 작은 정사각 프레임만 읽히도록 유지한다. 중앙 프레임 안도 추가 상자 없이 자연스럽게 비워 두며, 흰색 독립 사각형 패널은 허용하지 않는다.

위 기준은 `skill-frame-attack`, `skill-frame-defense`, `skill-frame-buff`, `skill-frame-utility`에 공통 적용한다.

**공통 구조**: 양피지 크림 배경 `#F0E8D8` + 둥근 모서리(10~12px) + 미니멀 색상 테두리 + 양피지 질감 오버레이 + solid white 외곽

**스킬 카드 생성 규격**: `512x512` 정사각형 생성 후, 게임 내 `140x140` 스킬 슬롯에 맞춰 축소

---

## 3. 캐릭터 프롬프트 (3종)

> gameplan `클래스-명세서.md` 기반 (`docs/specific/`)

| ID | gameplan ID | 이름 | 설계 상태 | 보석톤 |
|----|------------|------|-----------|--------|
| `warrior` | CLS_W | 전사 | ✅ 확정 | 로즈쿼츠 `#E8B4B8` |
| `mage` | CLS_M | 마법사 | ⬜ 미설계 | 아메시스트 `#B8A0D0` |
| `rogue` | CLS_R | 도적 | ⬜ 미설계 | 에메랄드 `#A0C8B0` |

> 전체 프롬프트는 `promptExamples.ts`의 `character` 섹션 참조. 마법사/도적은 gameplan 미확정 상태이므로 placeholder입니다.

---

## 4. 동료 프롬프트 (3종)

| ID | 이름 |
|----|------|
| `moss-fairy` | 이끼 요정 |
| `wild-wolf` | 야생 늑대 |
| `forest-owl` | 숲 올빼미 |

> 전체 프롬프트는 `promptExamples.ts`의 `companion` 섹션 참조

---

## 5. 숲 몬스터 프롬프트 (8종)

> gameplan `몬스터-명세서.md` 기반 (`docs/specific/`) — **핵심 에셋**  
> 외곽선 언더톤: mint-green  
> 지역 팔레트: 민트+라벤더 (`#C8D8C8` ~ `#D0C8E0`)

| ID | gameplan ID | 이름 | Tier | 설계 상태 |
|----|------------|------|------|-----------|
| `goblin` | MON_F01 | 고블린 | T1 | ✅ 확정 |
| `poison-spider` | MON_F02 | 독거미 | T1 | ✅ 확정 |
| `spore-parasite` | MON_F03 | 버섯 기생체 | T1 | ✅ 확정 |
| `thorn-vine` | MON_F04 | 가시 덩굴 | T2 | ✅ 확정 |
| `golem` | MON_F05 | 골렘 | T2 | ✅ 확정 |
| `wolf` | MON_F06 | 늑대 | T2 | 📝 초안 |
| `rotten-tree` | MON_F07 | 썩은 나무 | T2 | ✅ 확정 |
| `ancient-grove-lord-p1`, `ancient-grove-lord-p2` | BOSS_F01 | 고대 수목군주 (Phase 1/2) | T3 | 📝 초안 |

> 모든 몬스터 상세 프롬프트는 `promptExamples.ts`의 `forest` 섹션 참조

---

## 6. 던전 몬스터 프롬프트 (3종)

> ⚠️ 향후 gameplan 기획 예정 (`designStatus: 'concept'`)  
> 외곽선 언더톤: sky-blue  
> 지역 팔레트: 스카이+라벤더 (`#C0C8D8` ~ `#C8C0D8`)

| ID | 이름 | Tier |
|----|------|------|
| `tiny-skeleton` | 꼬마 해골 | T1 |
| `golden-golem` | 황금 골렘 | T2 |
| `ancient-dungeon-king` | 던전의 고대왕 | T3 |

> 전체 프롬프트는 `promptExamples.ts`의 `dungeon` 섹션 참조

---

## 7. 성 몬스터 프롬프트 (2종)

> ⚠️ 향후 gameplan 기획 예정 (`designStatus: 'concept'`)  
> 외곽선 언더톤: rose  
> 지역 팔레트: 로즈+라벤더 (`#D8C0C8` ~ `#D0C0D8`)

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

## 9. NPC 프롬프트 (1종)

> 비전투 캐릭터 — 캐릭터와 동일한 bust portrait 플랫 컬러 일러스트 기조 사용

| ID | 이름 | 용도 | 설계 상태 |
|----|------|------|-----------|
| `merchant` | 떠돌이 상인 | 상점 | ⬜ 미설계 |

> 전체 프롬프트는 `promptExamples.ts`의 `npc` 섹션 참조

---

## 10. UI 프롬프트

### 코인 (해/달 보석 코인)

| 면 | 심볼 | 색상 | HEX |
|----|------|------|-----|
| 앞면 (Heads) | 해 문양 + 짧은 광선 | 선 골드 | `#C9A86C` |
| 뒷면 (Tails) | 초승달 + 작은 별 2개 | 문 퍼플 | `#6A5080` |

### 코인 주머니

- 양피지-가죽 혼합 질감의 작은 드로우스트링 주머니
- 웜 크림 + 뮤트드 골드 `#C8B888` 바탕, 라벤더 안감 포인트
- 코인 없이 비어 있는 주머니 상태로 생성

### 버튼

- 양피지 재질, 크림 `#F0E8D8` + 골드 `#C9A86C` 텍스트

### 맵 노드 (5종)

| 노드 | 아이콘 |
|------|--------|
| 전투 | 검 (파스텔 로즈) |
| 이벤트 | 느낌표 (파스텔 라벤더) |
| 상점 | 코인 (골드) |
| 보스 | 왕관 (뮤트드 로즈) |
| 휴식 | 모닥불 (파스텔 세이지) |

### 스킬 아이콘 (14종)

> 전체 프롬프트는 `promptExamples.ts`의 `skillIcon` 섹션 참조

- 단일 심볼만 사용하고, 배경 배지·원형 링·보조 오브젝트는 넣지 않는다.
- 아이콘마다 **단색에 가까운 단조로운 1색 계열**만 사용한다.
- 모션 라인, 파티클, 광휘, 에너지 오라 대신 **굵고 단순한 실루엣**으로 의미를 구분한다.
- 모든 스킬 아이콘은 같은 단순도와 같은 시각 언어를 유지한다.

---

## 11. 네거티브 프롬프트 (6종)

### FRAME_NEGATIVE

```
character illustration, person, creature, monster,
coin edge pattern, ridged border, gear teeth,
sun emblem, moon symbol, celestial decorations,
bright vibrant colors, neon glow, saturated colors,
chrome metal, glossy plastic, photorealistic 3D render,
complex ornate decorations, baroque style, royal filigree overload,
modern minimalist flat vector, sci-fi HUD, cyberpunk UI,
anime style, cartoon style,
watercolor bleeding, paint splatters,
text, letters, numbers, words,
multiple frames, tilted angle, perspective distortion
```

### CHARACTER_NEGATIVE (v6.0)

```
realistic, photorealistic, 3D render, CGI,
anime manga style,
extreme chibi 1 to 2 head ratio, baby proportions,
pure black, pure white background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, dark atmosphere,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
detailed eyes with highlights and reflections, large expressive eyes,
complex accessories, ornate decoration, detailed armor, intricate patterns,
lavender tint, purple ambient light, blue color cast, cool color cast on skin,
complex detailed background, white background,
facing left, looking left, back view,
full body, legs, feet, shoes, ground, floor,
ornate heavy armor, giant oversized weapons, complex weapon designs,
oval crop, elliptical crop, rounded bottom edge, vignette fade at bottom,
blurry low quality,
watercolor, watercolor wash, watercolor blending, soft color transitions,
color bleeding between regions, gradient fills within shapes,
painted texture, artistic rendering, impressionist style,
multiple tonal values per region, ambient occlusion shading,
soft diffused edges between color zones
```

### MONSTER_NEGATIVE (v6.0)

```
realistic, photorealistic, 3D render, CGI,
anime manga style,
pure black, pure white background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, dark atmosphere,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
detailed eyes with highlights and reflections, large expressive eyes,
complex accessories, ornate decoration, intricate patterns,
lavender tint, purple ambient light, cool color cast on skin,
complex detailed background, white background,
facing right, looking right,
full body, legs, feet, ground, floor,
cute mascot comedy tone, slapstick expression,
oval crop, elliptical crop, rounded bottom edge, vignette fade at bottom,
blurry low quality,
watercolor, watercolor wash, watercolor blending, soft color transitions,
color bleeding between regions, gradient fills within shapes,
painted texture, artistic rendering, impressionist style,
multiple tonal values per region, ambient occlusion shading,
soft diffused edges between color zones
```

### BG_NEGATIVE (v6.0)

```
characters, people, figures, creatures,
realistic, photorealistic, 3D render, CGI,
anime manga style, cartoon style,
pure black, pure white, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary,
sharp hard edges, harsh lighting, dark atmosphere,
complex cluttered composition,
text, letters, numbers, watermark,
blurry low quality
```

### NPC_NEGATIVE (v6.0)

```
realistic, photorealistic, 3D render, CGI,
anime manga style,
extreme chibi 1 to 2 head ratio, baby proportions,
pure black, pure white background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, dark atmosphere,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
detailed eyes with highlights and reflections, large expressive eyes,
complex accessories, ornate decoration, detailed armor, intricate patterns,
lavender tint, purple ambient light, cool color cast on skin,
complex detailed background, white background,
facing left, looking left, back view,
full body, legs, feet, shoes, ground, floor,
royal throne pose, combat-ready aggression,
blurry low quality
```

### UI_NEGATIVE (v6.0)

```
character illustration, person, creature, monster, animal,
3D render, photorealistic, hyper detailed, CGI,
anime style, cartoon style, manga,
watercolor bleeding, paint splatters, heavy texture,
complex ornate decorations, baroque style,
dark horror scary gothic,
blurry low quality, noisy, grainy,
multiple objects, cluttered composition,
neon glow, overly bright, saturated neon colors,
text, letters, numbers, watermark
```

---

## 12. 검증 체크리스트

### 프롬프트 생성 시 필수 확인

- [ ] **bust portrait**: 상반신 bust (mid-chest upward)인지 확인 — 전신(full-body) 금지
- [ ] **아웃라인**: `single color uniform weight outline in warm dark tone` 포함 여부 — 블랙 아웃라인, 볼드 아웃라인 금지
- [ ] **파스텔 톤**: `muted warm pastel colors strictly 40 to 55 percent saturation` 포함 여부
- [ ] **양피지 프레임**: 프레임에 `parchment cream #F0E8D8` 사용 — 다크 차콜 금지
- [ ] **방향**: 캐릭터/NPC/동료 → 우측 → / 몬스터 → 좌측 ←
- [ ] **비율**: 캐릭터/몬스터/NPC 2:3 / 동료 1:1 정사각 (원형 프레임) / 스킬 카드 1:1 정사각 / 배경 16:9
- [ ] **배경**: 캐릭터/몬스터/NPC → `solid cream parchment background #F0E8D8`
- [ ] **구도**: `centered composition with moderate headroom above the head` + `character/creature fills most of the frame`
- [ ] **톤**: 아늑한 파스텔 분위기 — 고어/그로테스크/공포 금지
- [ ] **플랫 컬러**: `strictly flat color fills with hard boundaries` 포함 여부 — 수채화/그라디언트 결과 나오면 네거티브 강화
- [ ] **네거티브 안티-수채화**: CHARACTER/MONSTER 네거티브에 `watercolor, watercolor wash, watercolor blending` 포함 여부
- [ ] **네거티브**: 에셋 타입에 맞는 네거티브 프롬프트 적용 (6종 중 선택)
- [ ] **구 스타일 잔재 확인**: `clean digital illustration`, `cel-shading`, `solid white background`, `lavender and lilac undertone`, `near-black outlines #1A1A1E`, `full-body`, `amber #D4A574`, `dark charcoal #1E1E24`, `paper grain overlay 5-8%`, `gouache`, `hand-painted` (배경 제외), `brushwork`, `tonal layering` (네거티브 제외) 가 남아 있지 않은지 확인
- [ ] **gameplan 정합성**: gameplanId와 designStatus 일치 확인
- [ ] **gameplan Tier 1 참조**: 엔티티 데이터는 `docs/specific/` 명세서 기준

### 데이터 원천 확인

- [ ] `promptExamples.ts`가 이 문서보다 우선 (코드 = Source of Truth)
- [ ] gameplan 명세서가 게임 설계의 최상위 원천
- [ ] 이 문서 ↔ ts 파일 불일치 시 ts 파일 기준으로 수정

---

*작성일: 2026-03-16 | 스타일: v6.0 "라벤더 안개" | Source of Truth: `src/data/promptExamples.ts`*
