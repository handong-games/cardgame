# 코인 AI 생성 가이드 v3.0

**목적**: 코인 시스템(앞면/뒷면/측면) 및 코인주머니 이미지 생성  
**스타일**: Warm Storybook Adventure (따뜻한 동화책 모험)

---

## 핵심 스타일 (모든 코인 공통)

```
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,
warm nostalgic fairy tale atmosphere,
muted desaturated warm color palette
```

---

## 1. 코인 앞면 (Heads) - 태양

### 디자인 컨셉
- **테마**: 태양, 희망, 황금
- **감정**: 유리한 결과, 성공, 기회
- **심볼**: 귀여운 태양 (중앙 40%, 광선 8개)

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 기본면 | Royal Gold | `#FFD700` | 메인 황금색 |
| 하이라이트 | Bright Gold | `#FFF8DC` | 빛 반사 영역 |
| 그림자 | Deep Gold | `#B8860B` | 입체감 |
| 테두리 | Dark Gold | `#8B7500` | 가장자리 |
| 심볼 | Sun Orange | `#FF8C00` | 태양 문양 |

### 프롬프트

```
[COIN HEADS PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,

cute golden coin heads side,
warm gold color #FFD700 with soft shine,
simple cute sun symbol in center,
8 friendly hand-drawn sun rays,
rosy warm glow effect,

coin viewed from front,
circular coin shape,
watercolor paper texture,
pencil sketch outlines warm brown,

isolated on transparent background,
1:1 square format 256x256px

--negative
photorealistic, 3D render, CGI,
modern coin design, realistic coin,
cold colors, dark scary gothic,
anime style, pixel art,
text words letters,
blurry low quality
```

---

## 2. 코인 뒷면 (Tails) - 달

### 디자인 컨셉
- **테마**: 달, 도전, 따뜻한 은빛
- **감정**: 불리한 결과, 역경, 신비
- **심볼**: 귀여운 초승달 + 별 2-3개

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 기본면 | Warm Silver | `#C0C0C0` | 메인 은회색 |
| 하이라이트 | Light Silver | `#D3D3D3` | 부드러운 반사 |
| 그림자 | Warm Gray | `#A9A9A9` | 따뜻한 그림자 |
| 테두리 | Soft Gray | `#808080` | 가장자리 |
| 심볼 | Soft Blue | `#87CEEB` | 달 문양 |

### 프롬프트

```
[COIN TAILS PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,

cute silver coin tails side,
soft warm silver gray color #C0C0C0,
simple cute crescent moon symbol,
2-3 tiny cute stars around moon,
mystical warm glow effect,

coin viewed from front,
circular coin shape,
watercolor paper texture,
pencil sketch outlines warm brown,

isolated on transparent background,
1:1 square format 256x256px

--negative
photorealistic, 3D render, CGI,
modern coin design, realistic coin,
cold blue harsh, dark scary gothic,
anime style, pixel art,
text words letters,
blurry low quality
```

---

## 3. 코인 측면 (Edge)

### 디자인 컨셉
- **용도**: 회전 애니메이션 중 보이는 두께
- **두께**: 직경의 8-10%
- **질감**: 동전 테두리 톱니 무늬

### 색상
- 금색/은색 중간 톤 그라데이션
- 따뜻한 금속 광택

### 프롬프트

```
[COIN EDGE PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,

coin edge side view,
simple ridged pattern on edge,
warm gold and silver gradient colors,
metallic sheen warm tones,
thickness 8-10% of diameter,

watercolor paper texture,
pencil sketch quality,

isolated on transparent background,
horizontal strip format 256x32px

--negative
photorealistic, 3D render,
modern coin, cold colors,
complex detailed patterns
```

---

## 4. 코인주머니 (Coin Pouch)

### 디자인 컨셉
- **테마**: 보상, 풍요, 모험의 전리품
- **스타일**: 낡은 가죽 주머니에서 금화가 쏟아지는 모습
- **분위기**: 따뜻하고 동화적인 보물 느낌

### 색상 팔레트

| 요소 | 색상명 | HEX | 용도 |
|------|--------|-----|------|
| 가죽 메인 | Warm Brown | `#8B4513` | 주머니 본체 |
| 가죽 하이라이트 | Light Tan | `#D2B48C` | 마모된 부분 |
| 가죽 그림자 | Dark Brown | `#5C3317` | 주름/접힘 |
| 끈 | Rope Beige | `#C19A6B` | 묶는 끈 |
| 코인 | Warm Gold | `#FFD700` | 쏟아지는 금화 |

### 프롬프트

```
[COIN POUCH PROMPT v3.0]
stylized storybook illustration,
hand-drawn outlines with soft watercolor texture,
flat color base with subtle warm gradients,
warm nostalgic fairy tale atmosphere,

cute leather coin pouch bag,
warm brown leather color #8B4513,
worn aged leather texture hand-drawn,
simple rope drawstring on top,

golden coins spilling out,
3-5 cute gold coins #FFD700 falling,
coins with sun symbol visible,
treasure reward feeling,

rosy warm glow around coins,
friendly welcoming design,
watercolor paper texture,
pencil sketch outlines warm brown,

isolated on transparent background,
1:1 square format 256x256px

--negative
photorealistic, 3D render, CGI,
modern wallet purse,
cold colors, dark scary,
realistic leather texture,
anime style, pixel art,
text words letters,
blurry low quality
```

---

## 크기 가이드

| 상태 | 크기 | 용도 |
|------|------|------|
| 기본 (UI) | 48x48 px | 인터페이스 표시 |
| 뒤집기 시작 | 64x64 px | 확대 시작 |
| 회전 중 | 96x96 px | 화면 중앙 |
| 결과 표시 | 128x128 px | 최대 확대 |
| 생성 원본 | 256x256 px | AI 생성 해상도 |

---

## 검증 체크리스트

| 항목 | 확인 사항 | Pass/Fail |
|------|-----------|-----------|
| 스타일 | 손그림 스토리북 느낌? | □ |
| 색상 | 따뜻한 팔레트 준수? | □ |
| 심볼 | 귀여운 태양/달? | □ |
| 질감 | 수채화 종이 텍스처? | □ |
| 분위기 | 따뜻하고 친근한? | □ |
| 대비 | 앞면/뒷면 구분 명확? | □ |

---

## 관련 문서

- [03. coin-visual.md](../../../../../docs/04.%20design/04.%20ui-visual/03.%20coin-visual.md) - 코인 시스템 비주얼 상세
- [08. visual-essence-master.md](../../../../../docs/04.%20design/06.%20ai-generation/08.%20visual-essence-master.md) - 비주얼 에센스 마스터 가이드
- [09. prompt-keyword-dictionary.md](../../../../../docs/04.%20design/06.%20ai-generation/09.%20prompt-keyword-dictionary.md) - 프롬프트 키워드 사전

---

*작성일: 2026-02-06*  
*버전: v3.0 (Warm Storybook Adventure)*
