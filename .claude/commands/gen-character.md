# /gen-character 명령어

v4.0 Dark Frame Edition 스타일에 맞는 캐릭터 에셋 프롬프트를 생성합니다.

---

## 사용법

```
/gen-character [클래스명 또는 gameplan ID] [옵션]

예시:
/gen-character warrior
/gen-character CLS_W
/gen-character mage --expression wise
/gen-character rogue --pose agile
```

---

## 워크플로우

```
/gen-character [클래스명]
     ↓
[Phase 1] 엔티티 식별
  - promptExamples.ts에서 ID/이름 매칭
  - gameplan Tier 1 명세서 참조 (클래스-명세서.md)
  - designStatus 확인 (confirmed/draft/undesigned)
     ↓
[Phase 2] 프롬프트 레이어 조합
  - Layer 1~4 순서대로 조합
     ↓
[Phase 3] 프롬프트 + 네거티브 프롬프트 출력
     ↓
[Phase 4] 검증 체크리스트 대조
     ↓
완료
```

---

## 데이터 원천

| 우선순위 | 원천 | 경로 |
|----------|------|------|
| 1순위 | gameplan Tier 1 | `projects/gameplan/docs/specific/클래스-명세서.md` |
| 2순위 | 프롬프트 코드 | `projects/gamedesign/src/data/promptExamples.ts` |
| 3순위 | 프롬프트 문서 | `projects/gamedesign/PROMPT-EXAMPLES.md` |

---

## 클래스별 설정 (3종)

### 전사 (Warrior) — CLS_W ✅ 확정
| 요소 | v4.0 스펙 |
|------|-----------|
| gameplan ID | CLS_W |
| HP / 코인 / 슬롯 | 70 / 3→10 / 4 |
| 주색 | Muted Burgundy #8B4049 |
| 보조색 | Weathered Steel #5A5F6B |
| 악센트 | Worn Leather #6B4423 |
| 특징 | 낡은 버건디 갑옷, 풍화된 강철, 과대한 낡은 검 |
| 표정 | 자신감 넘치는 결의 (confident, determined smile) |

### 마법사 (Mage) — CLS_M ⬜ 미설계
| 요소 | v4.0 스펙 |
|------|-----------|
| gameplan ID | CLS_M |
| HP / 코인 / 슬롯 | 미정 |
| 주색 | Deep Navy #2A3A5C |
| 보조색 | Mystic Purple #6B4B8C |
| 악센트 | Arcane Gold #C9A227 |
| 특징 | 네이비 로브, 보라 악센트, 빛나는 수정 지팡이 |
| 표정 | 신비로운 미소 (wise, mysterious smile) |

### 도적 (Rogue) — CLS_R ⬜ 미설계
| 요소 | v4.0 스펙 |
|------|-----------|
| gameplan ID | CLS_R |
| HP / 코인 / 슬롯 | 미정 |
| 주색 | Shadow Gray #3A3A40 |
| 보조색 | Worn Leather #5C4033 |
| 악센트 | Emerald #2D5A3D |
| 특징 | 후드 달린 회색 망토, 가죽 갑옷, 쌍 단검 |
| 표정 | 장난기 있는 자신감 (sly, mischievous smirk) |

---

## 프롬프트 레이어 시스템

### Layer 1: 캐릭터 마스터 스타일 (필수)
```
flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black (#1A1A1E),
muted desaturated dark fantasy color palette,
solid white background for clean extraction,
no border no frame,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face
```

### Layer 2: 캐릭터 에셋 공통 (필수)
```
vertical portrait 2:3 aspect ratio,
stylized semi-chibi proportions,
2.5 to 3 head body ratio,
full body composition showing head to feet,
character fits entirely within frame with small margin at bottom,
large expressive eyes with highlights,

subtle rosy blush on cheeks,
small circular pink blush marks,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

white background,
single character illustration only
```

### Layer 3: 클래스별 레이어

#### Warrior (CLS_W)
```
earthy tones with burgundy ochre navy accents,
stylized character illustration,
confident charismatic expression,
slight smirk or determined smile,

warrior class character,
short spiky reddish-brown messy hair,
muted burgundy worn armor (#8B4049),
weathered steel metal pieces (#5A5F6B),
scratched battle-worn armor details,
NO gold decorations beginner adventurer,
simple worn leather belt (#6B4423),
naturally holding oversized old sword in hand,
brave determined expression
```

#### Mage (CLS_M)
```
earthy tones with navy purple gold accents,
stylized character illustration,
wise knowing expression,
mysterious slight smile,

mage wizard class character,
long flowing navy or violet-tinted hair,
deep navy robes with mystic purple accents (#2A3A5C, #6B4B8C),
arcane gold trim and symbols (#C9A227),
naturally holding tall magic staff with glowing crystal,
small magical sparkles floating around staff,
pointed wizard hat optional,
scholarly mystical appearance
```

#### Rogue (CLS_R)
```
earthy tones with gray brown emerald accents,
stylized character illustration,
sly mischievous expression,
playful confident smirk,

rogue thief class character,
messy dark hair peeking from under hood,
shadow gray hooded cloak (#3A3A40),
worn leather armor (#5C4033),
emerald green accents (#2D5A3D),
casually holding twin daggers in hands,
nimble agile pose,
mysterious but friendly appearance
```

### 네거티브 프롬프트 (필수)
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

---

## 옵션 파라미터

| 옵션 | 설명 | 예시 |
|------|------|------|
| --expression | 표정 지정 | brave, gentle, determined, wise, sly |
| --pose | 포즈 지정 | standing, fighting, victory, agile |
| --hair | 머리색 지정 | brown, black, red, navy |
| --weapon | 무기 변경 | sword, staff, daggers |

---

## 검증 체크리스트

| 항목 | 확인 |
|------|------|
| **마스터 스타일**: flat color + cel shading + near-black outlines? | □ |
| **방향**: 몸이 우측 대각선 ↗ 을 향함? | □ |
| **볼 홍조**: 있음 (rosy blush on cheeks)? | □ |
| **비율**: 2:3 세로형, 2.5~3 등신? | □ |
| **배경**: solid white background? | □ |
| **전신**: 머리부터 발끝까지 완전히 보임? | □ |
| **색상**: muted desaturated, 네온/차가운 색 없음? | □ |
| **무기**: 클래스에 맞는 무기 소지? | □ |
| **프레임/보더**: 없음 (no border no frame)? | □ |
| **gameplan 정합성**: gameplanId와 designStatus 일치? | □ |
| **네거티브**: CHARACTER_NEGATIVE 적용됨? | □ |

---

## 문제 해결

### 비율이 사실적인 경우
- "2.5 to 3 head body ratio" 강조 추가
- "stylized semi-chibi proportions" 반복

### 볼 홍조가 없는 경우
- "subtle rosy blush on cheeks, small circular pink blush marks" 프롬프트에 추가
- 네거티브에서 "no blush on cheeks" 확인

### 보더/프레임이 생기는 경우
- "no border no frame" 강조
- 네거티브에 "hand-drawn border frame, card frame, decorative border" 추가

### 방향이 잘못된 경우 (좌측을 향함)
- "body facing right at three-quarter angle" 강조
- 네거티브에 "facing left, looking left" 확인

---

## 캐릭터 참조 (promptExamples.ts 기준)

| ID | gameplan ID | 이름 | 설계 상태 | 악센트 색상 |
|----|------------|------|-----------|------------|
| warrior | CLS_W | 전사 | confirmed | #8B4049, #5A5F6B |
| mage | CLS_M | 마법사 | undesigned | #2A3A5C, #6B4B8C |
| rogue | CLS_R | 도적 | undesigned | #3A3A40, #2D5A3D |

---

## 참조
- `projects/gameplan/docs/specific/클래스-명세서.md` — 클래스 데이터 구조 (Tier 1)
- `projects/gamedesign/src/data/promptExamples.ts` — 프롬프트 코드 (Source of Truth)
- `projects/gamedesign/PROMPT-EXAMPLES.md` — 프롬프트 종합 가이드
- `projects/gamedesign/CONTEXT.md` — 작업 맥락 및 비주얼 규칙
