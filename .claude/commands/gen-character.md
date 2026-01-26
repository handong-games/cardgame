# /gen-character 명령어

게임 스타일에 맞는 캐릭터 카드 이미지를 생성합니다.

---

## 사용법

```
/gen-character [클래스] [옵션]

예시:
/gen-character warrior
/gen-character paladin --expression brave
/gen-character mage --pose casting --hair blonde
```

---

## 워크플로우

```
/gen-character [클래스]
     ↓
[Phase 1] 클래스 정보 파싱
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

## 클래스별 설정

### 전사 (Warrior)
| 요소 | 설명 |
|------|------|
| 주색 | Dusty Red #bb5955 |
| 보조색 | Worn Gray #6B7B8B |
| 악센트 | Leather Brown #8B6914 (금색 X) |
| 특징 | 허름하고 낡은 갑옷, 자기 키만한 낡은 검 |
| 표정 | 용감하지만 따뜻한 미소 |

### 팔라딘 (Paladin)
| 요소 | 설명 |
|------|------|
| 주색 | Warm Gold #FFD700 |
| 보조색 | Cream White #FFFDD0 |
| 악센트 | Sky Blue #87CEEB |
| 특징 | 빛나는 금색 갑옷, 검+방패 |
| 표정 | 자비롭고 따뜻한 미소 |

---

## 프롬프트 레이어 시스템

### Layer 1: 마스터 스타일 베이스 (필수)
```
hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
warm cozy fairy tale atmosphere,
soft warm color palette,
vintage aged parchment border,
rounded rectangle card shape,
worn torn vintage paper corners,
textured beige paper background,
watercolor paper grain texture,
old paper with subtle stains and aged look,
children's picture book illustration quality,
warm lighting from top-left
```

### Layer 2: 캐릭터 에셋 레이어 (필수)
```
cute chibi SD character portrait,
big head small body 2-2.5 head ratio,
large expressive round eyes,
rosy blushing cheeks on both sides,
warm friendly smile expression,
body facing right diagonal direction,
three-quarter view angled to right,
character looking toward front-right,
vertical portrait 2:3 ratio
```

### Layer 3: 클래스별 레이어
#### Warrior
```
cute chibi warrior character,
worn shabby dusty red armor,
scratched worn gray metal pieces,
patched and damaged armor details,
NO gold decorations beginner adventurer,
oversized old sword bigger than body,
simple brown leather belt,
warm peachy skin tone,
brave but adorable expression
```

#### Paladin
```
cute chibi paladin holy knight,
simple golden shining armor design,
small sword and cute shield with sun emblem,
cream white and gold color scheme,
warm gentle compassionate smile,
blonde or light hair
```

### Layer 4: 네거티브 프롬프트 (필수)
```
dark gothic horror scary,
realistic 3D render CGI,
cold colors blue purple dominant,
harsh shadows high contrast,
complex ornate decorations,
anime manga style sharp lines,
modern sci-fi futuristic,
sad depressing gloomy atmosphere,
realistic human proportions,
no blush on cheeks,
scary fierce expression,
complex detailed armor,
wooden frame,
gold trim gold decorations,
shiny new armor,
facing left,
looking left,
back view
```

---

## 옵션 파라미터

| 옵션 | 설명 | 예시 |
|------|------|------|
| --expression | 표정 지정 | brave, gentle, happy, determined |
| --pose | 포즈 지정 | standing, waving, fighting, victory |
| --hair | 머리색 지정 | blonde, brown, black, red |
| --weapon | 무기 변경 | sword, axe, mace, spear |

---

## 이미지 생성 실행

### mcp__imggen__generate_image 호출
```
도구: mcp__imggen__generate_image
파라미터:
  - prompt: [Layer 1] + [Layer 2] + [Layer 3] + "--negative" + [Layer 4]
  - aspectRatio: "3:4" (세로형 카드)
  - style: "card-fantasy" 또는 "none"
```

---

## 검증 체크리스트

생성된 이미지 확인 사항:
| 항목 | 확인 |
|------|------|
| SD 비율 (2-2.5 등신)? | □ |
| 머리가 충분히 큰가? | □ |
| 크고 동그란 눈? | □ |
| 양 볼에 홍조 있음? | □ |
| 따뜻하고 친근한 표정? | □ |
| 몸이 우측 대각선을 향함? | □ |
| 수채화 느낌 채색? | □ |
| 낡은 양피지 테두리? | □ |
| 둥근 사각형 카드 형태? | □ |
| 빈티지 닳은 모서리? | □ |
| 질감 있는 베이지 종이 배경? | □ |
| 금색 장식 없음? (전사) | □ |

---

## 문제 해결

### 비율이 사실적인 경우
- "chibi SD proportions" 강조 추가
- "big head small body 2-2.5 ratio" 반복

### 볼 홍조가 없는 경우
- "rosy blushing cheeks on both sides" 추가
- 네거티브에 "no blush on cheeks" 추가

### 너무 어두운 경우
- "warm cozy friendly" 강조
- "cute adorable charming" 추가

---

## 참조
- `docs/04. design/02. characters/01. character-design-guide.md`
- `docs/04. design/06. ai-generation/01. gemini-master-guide.md`
- `docs/04. design/01. visual-identity/01. core-style.md`
