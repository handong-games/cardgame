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
| 색상 | 어두운 자연색 |
| 디테일 | 단순하지만 날카로운 특징 |
| 표정 | 야생적, 악의적 (feral, malicious) |

### Tier 2: 정예 몬스터 (Elite)
| 요소 | 특징 |
|------|------|
| 크기 | 캐릭터보다 약간 큼 (100-120%) |
| 색상 | 더 진하고 어두운 색조 |
| 디테일 | 위협적인 장식 요소 |
| 표정 | 교활하고 계산적 (calculating, cunning) |

### Tier 3: 보스 몬스터 (Boss)
| 요소 | 특징 |
|------|------|
| 크기 | 캐릭터보다 큼 (120-150%) |
| 색상 | 강렬하고 어두운 색상 |
| 디테일 | 위압적인 장식, 왕관/뿔 등 |
| 표정 | 압도적, 지배적 (dominating, overwhelming) |

---

## 지역별 색상 팔레트

### 숲 (Forest)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Dark Forest Green | #228B22 |
| 보조색 | Murky Brown | #5C4033 |
| 눈 악센트 | Glowing Yellow | #FFD700 |
| 위협 악센트 | Poison Green | #7CFC00 |

**대표 몬스터:** 사악한 고블린, 독슬라임, 광폭한 늑대

### 던전 (Dungeon)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Cold Stone Gray | #696969 |
| 보조색 | Bone White | #E8E4D9 |
| 눈 악센트 | Ghostly Blue | #00CED1 |
| 위협 악센트 | Eerie Green | #00FF7F |

**대표 몬스터:** 해골 병사, 파괴 골렘, 원한의 유령

### 성 (Castle)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Blood Red | #8B0000 |
| 보조색 | Tarnished Gold | #B8860B |
| 눈 악센트 | Crimson Glow | #DC143C |
| 위협 악센트 | Dark Purple | #4B0082 |

**대표 몬스터:** 암흑 기사, 저주받은 하인, 흡혈귀

---

## 프롬프트 레이어 시스템

### Layer 1: 마스터 스타일 베이스 (필수)
```
hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
dark fairytale medieval fantasy atmosphere,
muted dark color palette,
vintage aged parchment card border with vine leaf decorations,
dark brown border with green nature accents,
rounded rectangle card shape,
worn torn vintage paper corners,
slightly darker beige paper background,
watercolor paper grain texture,
old paper with subtle stains forest feel,
vertical portrait card 3:4 ratio,
dark fairytale illustration quality,
dramatic lighting from top-left
```

### Layer 2: 몬스터 에셋 레이어 (필수)
```
menacing monster creature portrait,
exaggerated threatening proportions,
glowing piercing intense eyes,
sharp teeth fangs visible,
villainous antagonistic expression,
body facing left diagonal direction,
three-quarter view angled to left,
creature looking toward front-left,
angular sharp body shapes,
vertical portrait 2:3 ratio
```

### Layer 3: 티어별 수정자

#### Tier 1 (Normal)
```
small feral creature,
simple but threatening design,
wild feral malicious expression,
dangerous enemy appearance
```

#### Tier 2 (Elite)
```
larger dangerous creature,
cunning calculating expression,
threatening decorative elements,
intimidating elite enemy pose
```

#### Tier 3 (Boss)
```
imposing impressive creature,
dominating overwhelming presence,
menacing crown or horns,
tyrannical dignified expression,
dark royal accents
```

### Layer 4: 지역별 수정자

#### Forest
```
wild primal forest creature,
moss vine root decorations,
dark green and murky brown colors,
savage predator lurking feeling
```

#### Dungeon
```
undead stone dungeon creature,
bone chain ghostly glow,
cold gray and blue colors,
relentless guardian feeling
```

#### Castle
```
corrupted fallen noble creature,
torn cape bloody crown,
blood red and tarnished gold colors,
tyrannical ruler appearance
```

### Layer 5: 네거티브 프롬프트 (필수)
```
cute friendly adorable kawaii,
chibi SD proportions,
rosy blushing cheeks,
playful innocent expression,
round soft body shapes,
realistic 3D render CGI,
overly grotesque excessive gore,
anime manga style sharp lines,
modern sci-fi elements,
complex cluttered design,
wooden frame,
gold trim gold decorations,
facing right,
looking right,
back view
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
| 위협적 비율 (과장된 특징)? | □ |
| 빛나는/날카로운 눈? | □ |
| 적대적/악당스러운 표정? | □ |
| 몸이 좌측 대각선을 향함? | □ |
| 해당 지역 테마와 일치? | □ |
| 어두운/위협적 색상 팔레트? | □ |
| 스토리북 느낌 유지? | □ |
| 낡은 양피지 테두리? | □ |
| 둥근 사각형 형태? | □ |
| 빈티지 닳은 모서리? | □ |
| 질감 있는 베이지 배경? | □ |
| 악당답고 위협적인 디자인? | □ |
| 볼 홍조 없음? | □ |

---

## 예시 프롬프트 (성공 사례)

### 사악한 숲 고블린
```
hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
dark fairytale medieval fantasy atmosphere,

menacing forest goblin creature,
exaggerated threatening proportions,
glowing yellow piercing eyes,
sharp teeth visible in wicked grin,
feral malicious wild expression,

sickly green rough skin, pointed sharp ears,
ragged dirty cloth clothing,
jagged wooden club weapon,
angular sharp body shapes,

vintage aged parchment border,
rounded rectangle card shape,
worn torn vintage paper corners,
textured beige paper background,
dark forest colors murky green brown,
vertical portrait 2:3 ratio

--negative
cute friendly adorable kawaii,
chibi SD proportions,
rosy blushing cheeks,
playful innocent expression,
wooden frame, gold trim
```

---

## 참조
- `docs/04. design/03. monsters/01. monster-design-guide.md`
- `docs/04. design/03. monsters/02. prompt-templates.md`
- `docs/04. design/06. ai-generation/02. prompt-library.md`
