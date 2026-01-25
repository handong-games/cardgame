# /gen-monster 명령어

게임 스타일에 맞는 몬스터 카드 이미지를 생성합니다.

---

## 사용법

```
/gen-monster [몬스터명] [옵션]

예시:
/gen-monster goblin
/gen-monster slime --region forest --tier 1
/gen-monster dragon --region castle --tier 3
/gen-monster skeleton --region dungeon --tier 2
```

---

## 워크플로우

```
/gen-monster [몬스터명]
     ↓
[Phase 1] 몬스터 정보 파싱 (이름, 지역, 티어)
     ↓
[Phase 2] 프롬프트 레이어 조합
     ↓
[Phase 3] 이미지 생성 (mcp__imggen__generate_image)
     ↓
[Phase 4] 결과 검증 및 출력
     ↓
완료
```

---

## 티어 시스템

### Tier 1: 일반 몬스터 (Normal)
| 요소 | 특징 |
|------|------|
| 크기 | 캐릭터와 비슷하거나 작음 (80-100%) |
| 색상 | 따뜻한 자연색 |
| 디테일 | 단순하고 귀여움 |
| 표정 | 장난스럽고 귀여움 |

### Tier 2: 정예 몬스터 (Elite)
| 요소 | 특징 |
|------|------|
| 크기 | 캐릭터보다 약간 큼 (100-120%) |
| 색상 | 조금 더 진한 따뜻한 색조 |
| 디테일 | 중간, 귀여운 장식 요소 |
| 표정 | 자신감 있지만 귀여움 |

### Tier 3: 보스 몬스터 (Boss)
| 요소 | 특징 |
|------|------|
| 크기 | 캐릭터보다 큼 (120-150%) |
| 색상 | 화려하고 따뜻한 색상 |
| 디테일 | 귀여운 장식, 왕관 등 |
| 표정 | 뽐내는 듯한 귀여운 표정 |

---

## 지역별 색상 팔레트

### 숲 (Forest)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Warm Green | #90EE90 |
| 보조색 | Warm Brown | #DEB887 |
| 악센트 | Honey | #F0E68C |
| 볼 홍조 | Rosy Pink | #FFB6C1 |

**대표 몬스터:** 귀여운 고블린, 동글 슬라임, 숲 요정

### 던전 (Dungeon)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Warm Gray | #A9A9A9 |
| 보조색 | Cream | #FFFDD0 |
| 악센트 | Warm Orange | #FFA500 |
| 볼 홍조 | Rosy Pink | #FFB6C1 |

**대표 몬스터:** 귀여운 해골, 미니 골렘, 친근한 유령

### 성 (Castle)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Warm Red | #CD5C5C |
| 보조색 | Soft Gold | #FFD700 |
| 악센트 | Soft Purple | #DDA0DD |
| 볼 홍조 | Rosy Pink | #FFB6C1 |

**대표 몬스터:** 귀여운 기사, 꼬마 하인, 아기 뱀파이어

---

## 프롬프트 레이어 시스템

### Layer 1: 마스터 스타일 베이스 (필수)
```
hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
warm cozy fairy tale atmosphere,
soft warm color palette,
vintage aged parchment card border with vine leaf decorations,
dark brown border with green nature accents,
rounded rectangle card shape,
worn torn vintage paper corners,
slightly darker beige paper background,
watercolor paper grain texture,
old paper with subtle stains forest feel,
vertical portrait card 3:4 ratio,
children's picture book illustration quality,
warm lighting from top-left
```

### Layer 2: 몬스터 에셋 레이어 (필수)
```
cute monster creature portrait,
big head small body SD proportions,
large expressive round eyes,
rosy blushing cheeks on both sides,
adorable playful expression,
round soft body shapes,
vertical portrait 2:3 ratio
```

### Layer 3: 티어별 수정자

#### Tier 1 (Normal)
```
small cute creature,
simple design minimal details,
playful mischievous expression,
friendly approachable appearance
```

#### Tier 2 (Elite)
```
slightly larger creature,
confident proud expression,
simple decorative elements,
showing off cute pose
```

#### Tier 3 (Boss)
```
larger impressive creature,
majestic but still cute,
crown or royal accessories,
proud dignified expression,
warm gold accents
```

### Layer 4: 지역별 수정자

#### Forest
```
forest creature design,
leaf and nature decorations,
warm green and brown colors,
playful woodland feeling
```

#### Dungeon
```
dungeon creature design,
torch-lit warm orange glow,
stone and treasure elements,
curious adventurous feeling
```

#### Castle
```
castle creature design,
royal elegant elements,
warm red and gold colors,
noble but cute appearance
```

### Layer 5: 네거티브 프롬프트 (필수)
```
scary terrifying creepy grotesque,
realistic 3D render CGI,
dark horror nightmare,
cold colors blue dominant,
sharp teeth menacing,
realistic proportions,
truly frightening appearance,
sad depressing gloomy,
no blush on cheeks,
complex detailed design,
wooden frame,
gold trim gold decorations
```

---

## 옵션 파라미터

| 옵션 | 설명 | 예시 |
|------|------|------|
| --region | 지역 지정 | forest, dungeon, castle |
| --tier | 티어 지정 | 1, 2, 3 |
| --expression | 표정 지정 | playful, proud, mischievous |
| --color | 주색 변경 | green, purple, orange |

---

## 이미지 생성 실행

### mcp__imggen__generate_image 호출
```
도구: mcp__imggen__generate_image
파라미터:
  - prompt: [Layer 1] + [Layer 2] + [Layer 3 티어] + [Layer 4 지역] + [몬스터 설명] + "--negative" + [Layer 5]
  - aspectRatio: "3:4" (세로형 카드)
  - style: "card-fantasy" 또는 "none"
```

---

## 검증 체크리스트

| 항목 | 확인 |
|------|------|
| SD 비율 (큰 머리, 작은 몸)? | □ |
| 양 볼에 홍조 있음? | □ |
| 귀엽고 친근한 표정? | □ |
| 해당 지역 테마와 일치? | □ |
| 따뜻한 색상 팔레트? | □ |
| 스토리북 느낌 유지? | □ |
| 낡은 양피지 테두리? | □ |
| 둥근 사각형 형태? | □ |
| 빈티지 닳은 모서리? | □ |
| 질감 있는 베이지 배경? | □ |
| 무섭지 않은 디자인? | □ |

---

## 예시 프롬프트 (성공 사례)

### 귀여운 숲 고블린
```
hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
warm cozy fairy tale atmosphere,

cute chibi forest goblin character,
big head small body adorable proportions,
large round mischievous eyes,
rosy blushing cheeks,
playful cheeky grin expression,

green soft skin, pointed cute ears,
simple brown cloth clothing,
small wooden stick weapon,
round soft body shapes,

vintage aged parchment border,
rounded rectangle card shape,
worn torn vintage paper corners,
textured beige paper background,
warm forest colors green brown,
vertical portrait 2:3 ratio

--negative
scary terrifying creepy,
realistic 3D render,
sharp teeth menacing,
dark horror, cold colors,
no blush on cheeks,
wooden frame, gold trim
```

---

## 참조
- `docs/04. design/03. monsters/01. monster-design-guide.md`
- `docs/04. design/03. monsters/02. prompt-templates.md`
- `docs/04. design/06. ai-generation/02. prompt-library.md`
