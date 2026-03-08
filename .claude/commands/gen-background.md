# /gen-background 명령어

v4.0 Dark Frame Edition 스타일에 맞는 배경 에셋 프롬프트를 생성합니다.

---

## 사용법

```
/gen-background [지역 또는 배경 ID] [옵션]

예시:
/gen-background forest
/gen-background sunny-forest-day
/gen-background dungeon --subregion treasure-room
/gen-background castle --subregion garden --time dusk
```

---

## 워크플로우

```
/gen-background [지역]
     ↓
[Phase 1] 엔티티 식별
  - promptExamples.ts에서 ID/이름 매칭
  - gameplan 월드 정의서 참조 (지역/라운드 구조)
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
| 1순위 | gameplan Tier 1 | `projects/gameplan/docs/specific/월드-지역-라운드-풀-정의서.md` |
| 2순위 | 프롬프트 코드 | `projects/gamedesign/src/data/promptExamples.ts` |
| 3순위 | 프롬프트 문서 | `projects/gamedesign/PROMPT-EXAMPLES.md` |

---

## 지역 시스템

### 1. 숲 — 잊혀진 숲 (Forest)

| ID | 이름 | 용도 |
|----|------|------|
| sunny-forest-day | 햇살 숲 - 낮 | 전투 배경 (기본) |
| sunny-forest-dusk | 햇살 숲 - 황혼 | 이벤트/휴식 배경 |

#### 색상 팔레트
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Muted Forest Green | #2D5A3D |
| 보조색 | Warm Brown | #6B4423 |
| 햇살/악센트 | Warm Gold | #D4A574 |
| 비네트 | Dark Edge | (자동 vignette) |

### 2. 던전 지역 (Dungeon)

| ID | 이름 | 용도 |
|----|------|------|
| treasure-room | 보물 창고 | 보상/탐험 배경 |

#### 색상 팔레트
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Stone Brown | #6B4423 |
| 보조색 | Warm Amber | #D4A574 |
| 벽 | Warm Stone | (muted tone) |

### 3. 성 지역 (Castle)

| ID | 이름 | 용도 |
|----|------|------|
| castle-garden | 성 정원 | 탐험/이벤트 배경 |

#### 색상 팔레트
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Burgundy | #8B4049 |
| 보조색 | Tarnished Gold | #B8860B |
| 분위기 | Royal Muted | (low saturation) |

---

## 프롬프트 레이어 시스템

### Layer 1: 배경 마스터 스타일 (필수)
```
layered silhouette background style,
dark muted color palette with low saturation,
strong vignette effect with darker edges,
minimal atmospheric scene design,
wide landscape 16:9 aspect ratio,
no characters no creatures
```

### Layer 2: 배경 에셋 공통 (필수)
```
layered depth composition,
central area empty for characters,
no characters no people
```

### Layer 3: 지역별 레이어

#### Forest — 낮
```
sunny forest clearing,
warm golden sunbeams filtering through trees,
muted forest green (#2D5A3D) and warm brown (#6B4423),
small mushrooms and wildflowers,
cozy welcoming woodland,
warm dappled light,
peaceful atmosphere
```

#### Forest — 황혼
```
forest clearing at dusk,
muted forest green and warm brown,
small mushrooms and wildflowers,
warm orange sunset glow (#D4A574),
cozy evening atmosphere,
soft long shadows,
peaceful feeling
```

#### Dungeon — 보물 창고
```
cozy dungeon treasure room,
warm amber torchlight glow (#D4A574),
stone walls with warm brown tones (#6B4423),
treasure chests and coins,
adventure atmosphere,
warm inviting lighting,
sense of discovery
```

#### Castle — 정원
```
cozy castle garden,
elegant hedges and flower beds,
warm sunlight,
muted burgundy (#8B4049) and gold (#B8860B) accents,
royal but welcoming atmosphere,
calm serene lighting,
peaceful mood
```

### 네거티브 프롬프트 (필수)
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

## 시간대 수정자 (선택)

| 시간대 | 키워드 |
|--------|--------|
| dawn | soft pink morning light, gentle sunrise glow, early mist |
| day (기본) | warm golden sunlight, clear visibility |
| dusk | warm orange sunset glow (#D4A574), soft long shadows |
| night | cool moonlight, subtle warm touches, twinkling stars |

---

## 분위기 수정자 (선택)

| 분위기 | 키워드 |
|--------|--------|
| peaceful | calm serene, soft gentle lighting, quiet contemplative |
| adventure | exciting discovery, sense of wonder, inviting exploration |
| battle | dynamic energy, determined atmosphere, focused lighting |

---

## 옵션 파라미터

| 옵션 | 설명 | 예시 |
|------|------|------|
| --subregion | 하위 지역 | sunny-forest, treasure-room, garden |
| --time | 시간대 | dawn, day, dusk, night |
| --mood | 분위기 | peaceful, adventure, battle |

---

## 검증 체크리스트

| 항목 | 확인 |
|------|------|
| **비율**: 16:9 가로형 (wide landscape)? | □ |
| **마스터 스타일**: layered silhouette + dark muted + vignette? | □ |
| **캐릭터 없음**: 사람/크리처 배치 없음? | □ |
| **중앙 비움**: 캐릭터 배치 영역이 비어있음? | □ |
| **색상**: low saturation, 네온/밝은 색 없음? | □ |
| **비네트**: 가장자리가 어두워지는 효과? | □ |
| **레이어 깊이감**: 전경-중경-배경 분리 표현? | □ |
| **지역 테마**: 해당 지역 팔레트/분위기 일치? | □ |
| **네거티브**: BG_NEGATIVE 적용됨? | □ |

---

## 배경 참조 (promptExamples.ts 기준)

| ID | 이름 | 지역 |
|----|------|------|
| sunny-forest-day | 햇살 숲 - 낮 | 숲 |
| sunny-forest-dusk | 햇살 숲 - 황혼 | 숲 |
| treasure-room | 보물 창고 | 던전 |
| castle-garden | 성 정원 | 성 |

---

## 참조
- `projects/gameplan/docs/specific/월드-지역-라운드-풀-정의서.md` — 지역/라운드 구조 (Tier 1)
- `projects/gamedesign/src/data/promptExamples.ts` — 프롬프트 코드 (Source of Truth)
- `projects/gamedesign/PROMPT-EXAMPLES.md` — 프롬프트 종합 가이드
- `projects/gamedesign/CONTEXT.md` — 작업 맥락 및 비주얼 규칙
