# 버튼 AI 생성 가이드 v3.0

**목적**: 게임 UI 버튼 이미지 생성  
**스타일**: Warm Storybook Adventure (따뜻한 동화책 모험)

---

## 핵심 스타일 (모든 버튼 공통)

```
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,
warm nostalgic fairy tale atmosphere,
muted desaturated warm color palette
```

---

## 버튼 디자인 원칙

### 형태
- **모서리**: 둥근 직사각형 (12-16px radius)
- **비율**: 3:1 ~ 4:1 (가로:세로)
- **그림자**: 따뜻한 갈색 드롭 섀도우
- **테두리**: 연필 질감 외곽선 2-3px

### 상태별 변화

| 상태 | 밝기 | 포화도 | 효과 |
|------|------|--------|------|
| Normal | 100% | 100% | 기본 |
| Hover | 110% | 110% | 약간 밝아짐, 글로우 추가 |
| Active/Pressed | 90% | 100% | 눌린 느낌, 그림자 축소 |
| Disabled | 60% | 50% | 회색빛, 반투명 |

---

## 1. Primary 버튼 (주 액션)

### 디자인 컨셉
- **용도**: 확인, 시작, 주요 행동
- **느낌**: 따뜻하고 친근한, 클릭 유도

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 배경 | Warm Gold | `#FFD700` | 버튼 배경 |
| 테두리 | Dark Gold | `#B8860B` | 외곽선 |
| 그림자 | Deep Brown | `#5C3317` | 드롭 섀도우 |
| 하이라이트 | Light Gold | `#FFF8DC` | 상단 반사 |

### 프롬프트

```
[PRIMARY BUTTON PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,

cute rounded rectangle button,
warm gold color #FFD700 background,
dark brown pencil sketch outline,
rounded corners 12px radius,
soft drop shadow warm brown,

watercolor paper texture,
friendly welcoming design,
simple clean button shape,

isolated on transparent background,
horizontal format 200x50px

--negative
photorealistic, 3D render, glossy,
modern UI flat design,
cold colors, dark scary,
complex decorations,
text words letters
```

---

## 2. Secondary 버튼 (보조 액션)

### 디자인 컨셉
- **용도**: 취소, 뒤로, 보조 행동
- **느낌**: 차분하고 안정적

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 배경 | Warm Parchment | `#FFF5E6` | 버튼 배경 |
| 테두리 | Soft Graphite | `#4A4A55` | 외곽선 |
| 그림자 | Warm Gray | `#A9A9A9` | 드롭 섀도우 |

### 프롬프트

```
[SECONDARY BUTTON PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

cute rounded rectangle button,
warm parchment cream color #FFF5E6 background,
soft graphite pencil outline,
rounded corners 12px radius,
subtle drop shadow,

watercolor paper texture,
simple clean design,

isolated on transparent background,
horizontal format 200x50px

--negative
photorealistic, 3D render,
modern UI, cold colors,
text words letters
```

---

## 3. 코인 던지기 버튼 (Coin Flip Button)

### 디자인 컨셉
- **용도**: 핵심 메커니즘 - 코인 뒤집기 트리거
- **느낌**: 운명적, 드라마틱, 기대감
- **특징**: 코인 아이콘 내장, 금색 글로우

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 배경 | Royal Gold | `#FFD700` | 버튼 배경 |
| 글로우 | Bright Gold | `#FFF8DC` | 외부 발광 |
| 코인 심볼 | Sun Orange | `#FF8C00` | 태양 아이콘 |
| 테두리 | Dark Charcoal | `#1E1E24` | 외곽선 |

### 프롬프트

```
[COIN FLIP BUTTON PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,
warm nostalgic fairy tale atmosphere,

special coin flip action button,
rounded rectangle with golden glow,
warm gold #FFD700 gradient background,
small cute coin icon in center,
sun and moon symbols tiny,

glowing golden aura around button,
magical feeling warm sparkles,
dark charcoal outline #1E1E24,
rounded corners 16px radius,

watercolor paper texture,
exciting dramatic design,
destiny moment feeling,

isolated on transparent background,
horizontal format 180x60px

--negative
photorealistic, 3D render, glossy,
modern UI, cold colors,
dark scary, realistic coin,
text words letters
```

---

## 4. 턴 종료 버튼 (End Turn Button)

### 디자인 컨셉
- **용도**: 플레이어 턴 종료
- **느낌**: 확정적, 신뢰감
- **특징**: 체크마크 또는 화살표 아이콘

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 배경 | Forest Green | `#228B22` | 버튼 배경 |
| 하이라이트 | Light Green | `#90EE90` | 상단 반사 |
| 테두리 | Dark Green | `#006400` | 외곽선 |
| 아이콘 | Cream White | `#FFF5E6` | 체크마크 |

### 프롬프트

```
[END TURN BUTTON PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,

turn end action button,
warm forest green #228B22 background,
simple cute checkmark icon center,
cream white icon color,

rounded rectangle shape,
dark green pencil outline,
rounded corners 12px radius,
soft drop shadow,

watercolor paper texture,
confident reassuring design,

isolated on transparent background,
horizontal format 160x50px

--negative
photorealistic, 3D render,
modern UI, cold colors,
dark scary,
text words letters
```

---

## 5. 위험/경고 버튼 (Danger Button)

### 디자인 컨셉
- **용도**: 삭제, 포기, 위험한 행동
- **느낌**: 주의, 경고 (단 따뜻한 톤 유지)

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 배경 | Coral Red | `#FF6B6B` | 버튼 배경 |
| 테두리 | Dark Red | `#8B0000` | 외곽선 |
| 하이라이트 | Light Coral | `#FFA07A` | 상단 반사 |

### 프롬프트

```
[DANGER BUTTON PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

warning action button,
warm coral red #FF6B6B background,
dark red pencil outline,
rounded corners 12px radius,
soft drop shadow,

watercolor paper texture,
cautious but friendly design,
not scary just careful,

isolated on transparent background,
horizontal format 160x50px

--negative
photorealistic, 3D render,
modern UI, cold harsh red,
dark scary horror,
text words letters
```

---

## 버튼 상태 변형

### Normal → Hover 변화

```
Hover 상태:
├── 밝기: +10%
├── 글로우: 버튼 색상 + 투명도 30%
├── 크기: 약간 확대 (102-105%)
└── 그림자: 확대 및 소프트
```

### Normal → Active 변화

```
Active/Pressed 상태:
├── 밝기: -10%
├── 위치: 2px 아래로
├── 그림자: 축소 (눌린 느낌)
└── 내부 그림자 추가
```

### Normal → Disabled 변화

```
Disabled 상태:
├── 포화도: -50%
├── 투명도: 60%
├── 회색빛 오버레이
└── 인터랙션 불가 표시
```

---

## 크기 가이드

| 버튼 유형 | 크기 | 용도 |
|----------|------|------|
| Large | 200x60 px | 주요 액션 (코인 던지기) |
| Medium | 160x50 px | 일반 액션 (턴 종료) |
| Small | 120x40 px | 보조 액션 |
| Icon Only | 48x48 px | 아이콘 버튼 |

---

## 검증 체크리스트

| 항목 | 확인 사항 | Pass/Fail |
|------|-----------|-----------|
| 스타일 | 손그림 스토리북 느낌? | □ |
| 색상 | 따뜻한 팔레트 준수? | □ |
| 모서리 | 둥근 코너 (12-16px)? | □ |
| 질감 | 수채화 종이 텍스처? | □ |
| 그림자 | 따뜻한 갈색 그림자? | □ |
| 분위기 | 친근하고 클릭하고 싶은? | □ |

---

## 관련 문서

- [08. visual-essence-master.md](../../../../../docs/04.%20design/06.%20ai-generation/08.%20visual-essence-master.md) - 비주얼 에센스 마스터 가이드
- [09. prompt-keyword-dictionary.md](../../../../../docs/04.%20design/06.%20ai-generation/09.%20prompt-keyword-dictionary.md) - 프롬프트 키워드 사전
- [01. ui-visual-guide.md](../../../../../docs/04.%20design/04.%20ui-visual/01.%20ui-visual-guide.md) - UI 비주얼 가이드

---

*작성일: 2026-02-06*  
*버전: v3.0 (Warm Storybook Adventure)*
