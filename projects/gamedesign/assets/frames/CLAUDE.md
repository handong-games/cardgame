# UI 프레임 AI 생성 가이드 v3.0

**목적**: 캐릭터/스킬 카드 프레임 이미지 생성  
**스타일**: Warm Storybook Adventure (따뜻한 동화책 모험)  
**참조**: `docs/04. design/06. ai-generation/06. card-frame-prompt-master.md`

---

## 핵심 스타일 (모든 프레임 공통)

```
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,
warm nostalgic fairy tale atmosphere,
dark charcoal frame #1E1E24,
soft graphite pencil texture border
```

---

## 프레임 베이스 색상

| 색상명 | HEX | RGB | 용도 |
|--------|-----|-----|------|
| Dark Charcoal | `#1E1E24` | 30, 30, 36 | 프레임 메인 배경 |
| Deep Gray | `#2A2A32` | 42, 42, 50 | 프레임 내부 영역 |
| Soft Graphite | `#4A4A55` | 74, 74, 85 | 연필 질감 테두리 |
| Near Black | `#0F0F14` | 15, 15, 20 | 내부 비네팅 |
| Warm Parchment | `#FFF5E6` | 255, 245, 230 | 카드 내부 배경 |

---

## 1. 캐릭터 카드 프레임

### 디자인 컨셉
- **용도**: 플레이어 캐릭터 카드
- **비율**: 2:3 (180x240 px)
- **특징**: 어두운 프레임 + 티어별 글로우 악센트

### 티어별 글로우 색상

| 티어 | 용도 | 글로우 색상 | HEX |
|------|------|------------|-----|
| **Player** | 플레이어 캐릭터 | Gold | `#FFD700` |
| **Tier 1** | 일반 몬스터 | Silver | `#C0C0C0` |
| **Tier 2** | 정예 몬스터 | Purple | `#6B4B8C` |
| **Tier 3** | 보스/전설 | Crimson | `#8B0000` |
| **Companion** | 동료 (원형) | Cyan | `#00BCD4` |

### 캐릭터 프레임 구조 (2:3 직사각형)

```
┌─────────────────────────────┐
│ ╔═══════════════════════╗   │ ← Dark Charcoal 프레임 #1E1E24
│ ║                       ║   │
│ ║   양피지 배경          ║   │ ← Warm Parchment 내부 #FFF5E6
│ ║   + 캐릭터 일러스트     ║   │
│ ║                       ║   │
│ ╚═══════════════════════╝   │
└─────────────────────────────┘
     ↑ 티어별 글로우 악센트 (4-6px)
```

### 동료 프레임 구조 (1:1 원형)

- **용도**: 동료(Companion) 크리처
- **비율**: 1:1 정사각 (96x96 px)
- **형태**: 완벽한 원형 (rounded-full)
- **구도**: 상반신/얼굴 클로즈업 (원형 크롭에 최적화)
- **악센트**: 시안 #00BCD4

```
        ╭───────────╮
      ╭─┤           ├─╮
     │  │  동료      │  │ ← Dark Charcoal 배경 #1E1E24
     │  │  클로즈업  │  │
      ╰─┤           ├─╯
        ╰───────────╯
     ↑ 시안 글로우 악센트 #00BCD4 (2px)
```

### 프롬프트 (Player 티어)

```
[CHARACTER CARD FRAME - PLAYER PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,

character card frame design,
dark charcoal color #1E1E24 frame,
soft graphite pencil texture border,
warm parchment inner background #FFF5E6,

subtle golden glow accent #FFD700,
glow around frame edges 4-6px,
rounded corners 12px,
2:3 aspect ratio portrait,

warm nostalgic fairy tale atmosphere,
children's picture book quality,

isolated on transparent background,
portrait format 180x240px

--negative
photorealistic, 3D render, glossy,
modern UI flat design,
cold colors, dark scary gothic,
complex ornate decorations,
text words letters
```

### 프롬프트 (Tier 1 일반)

```
[CHARACTER CARD FRAME - TIER1 PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

character card frame design,
dark charcoal color #1E1E24 frame,
soft graphite pencil texture border,
warm parchment inner background #FFF5E6,

subtle silver glow accent #C0C0C0,
glow around frame edges 4px,
rounded corners 12px,
2:3 aspect ratio portrait,

isolated on transparent background,
portrait format 180x240px

--negative
photorealistic, 3D render, cold colors, dark scary
```

### 프롬프트 (Tier 2 정예)

```
[CHARACTER CARD FRAME - TIER2 PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

character card frame design,
dark charcoal color #1E1E24 frame,
soft graphite pencil texture border,
warm parchment inner background #FFF5E6,

subtle purple glow accent #6B4B8C,
mystical glow around frame edges 5px,
rounded corners 12px,
2:3 aspect ratio portrait,

isolated on transparent background,
portrait format 180x240px

--negative
photorealistic, 3D render, cold colors, dark horror
```

### 프롬프트 (Tier 3 보스)

```
[CHARACTER CARD FRAME - TIER3 PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

character card frame design,
dark charcoal color #1E1E24 frame,
soft graphite pencil texture border,
warm parchment inner background #FFF5E6,

subtle crimson glow accent #8B0000,
dramatic glow around frame edges 6px,
rounded corners 12px,
2:3 aspect ratio portrait,

dark fairytale atmosphere,
still warm undertones,

isolated on transparent background,
portrait format 180x240px

--negative
photorealistic, 3D render, cold blue colors, horror
```

---

## 2. 스킬 카드 프레임

### 디자인 컨셉
- **용도**: 공격/스킬/파워 카드
- **비율**: 1:1 (128x128 px)
- **특징**: 어두운 프레임 + 유형별 글로우

### 유형별 글로우 색상

| 유형 | 메인 | 글로우 | 그림자 |
|------|------|--------|--------|
| **Attack** | `#FF6B6B` | `#DC143C` | `#8B0000` |
| **Skill** | `#4169E1` | `#87CEEB` | `#1E3A5F` |
| **Power** | `#DAA520` | `#FFD700` | `#B8860B` |

### 프롬프트 (Attack 유형)

```
[SKILL CARD FRAME - ATTACK PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,

skill card frame design,
dark charcoal color #1E1E24 frame,
soft graphite pencil texture border,
warm parchment inner background #FFF5E6,

coral red glow accent #FF6B6B,
aggressive warm glow around edges,
rounded corners 12px,
1:1 square format,

warm nostalgic fairy tale atmosphere,
action attack feeling but friendly,

isolated on transparent background,
square format 128x128px

--negative
photorealistic, 3D render,
cold colors, dark scary horror,
complex ornate decorations,
text words letters
```

### 프롬프트 (Skill 유형)

```
[SKILL CARD FRAME - SKILL PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

skill card frame design,
dark charcoal color #1E1E24 frame,
soft graphite pencil texture border,
warm parchment inner background #FFF5E6,

royal blue glow accent #4169E1,
mystical magical glow around edges,
rounded corners 12px,
1:1 square format,

warm nostalgic fairy tale atmosphere,
magical utility feeling,

isolated on transparent background,
square format 128x128px

--negative
photorealistic, 3D render, cold harsh blue, dark scary
```

### 프롬프트 (Power 유형)

```
[SKILL CARD FRAME - POWER PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

skill card frame design,
dark charcoal color #1E1E24 frame,
soft graphite pencil texture border,
warm parchment inner background #FFF5E6,

goldenrod glow accent #DAA520,
noble powerful glow around edges,
rounded corners 12px,
1:1 square format,

warm nostalgic fairy tale atmosphere,
permanent buff powerful feeling,

isolated on transparent background,
square format 128x128px

--negative
photorealistic, 3D render, cold colors, dark scary
```

---

## 3. UI 패널 프레임

### 디자인 컨셉
- **용도**: 정보 패널, 팝업, 대화창
- **비율**: 유동적 (용도에 따라)
- **특징**: 둥근 모서리, 미니멀 장식

### 프롬프트

```
[UI PANEL FRAME PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

UI panel frame design,
dark charcoal color #1E1E24 background,
soft graphite pencil border,
warm parchment inner area #FFF5E6,

rounded corners 16px,
subtle warm shadow,
minimal clean design,

warm nostalgic fairy tale atmosphere,
cozy information panel feeling,

isolated on transparent background

--negative
photorealistic, 3D render,
modern flat UI, cold colors,
complex decorations
```

---

## 4. 미니 프레임 (아이콘용)

### 디자인 컨셉
- **용도**: 아이콘 배경, 상태표시
- **크기**: 48x48, 64x64 px
- **특징**: 원형 또는 작은 사각형

### 프롬프트 (원형)

```
[MINI FRAME CIRCLE PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

small circular frame design,
dark charcoal color #1E1E24 ring,
warm parchment inner circle #FFF5E6,
soft graphite pencil texture,

simple clean design,
warm cozy feeling,

isolated on transparent background,
1:1 square format 64x64px

--negative
photorealistic, 3D render, cold colors
```

---

## 크기 가이드

| 프레임 유형 | 크기 | 비율 |
|------------|------|------|
| 캐릭터 카드 | 180x240 px | 2:3 |
| 스킬 카드 | 128x128 px | 1:1 |
| UI 패널 (소) | 200x150 px | 4:3 |
| UI 패널 (대) | 400x300 px | 4:3 |
| 미니 프레임 | 48-64 px | 1:1 |

---

## 검증 체크리스트

| 항목 | 확인 사항 | Pass/Fail |
|------|-----------|-----------|
| 프레임 색상 | Dark Charcoal #1E1E24? | □ |
| 내부 배경 | Warm Parchment #FFF5E6? | □ |
| 글로우 | 티어/유형별 색상 정확? | □ |
| 질감 | 연필 스케치 텍스처? | □ |
| 모서리 | 둥근 코너 (12-16px)? | □ |
| 스타일 | 손그림 스토리북 느낌? | □ |
| 분위기 | 따뜻하고 친근한? | □ |

---

## 관련 문서

- [06. card-frame-prompt-master.md](../../../../../docs/04.%20design/06.%20ai-generation/06.%20card-frame-prompt-master.md) - 카드 프레임 상세
- [07. skill-card-prompt-master.md](../../../../../docs/04.%20design/06.%20ai-generation/07.%20skill-card-prompt-master.md) - 스킬 카드 상세
- [08. visual-essence-master.md](../../../../../docs/04.%20design/06.%20ai-generation/08.%20visual-essence-master.md) - 비주얼 에센스 마스터 가이드
- [09. prompt-keyword-dictionary.md](../../../../../docs/04.%20design/06.%20ai-generation/09.%20prompt-keyword-dictionary.md) - 프롬프트 키워드 사전

---

*작성일: 2026-02-06*  
*버전: v3.0 (Warm Storybook Adventure)*
