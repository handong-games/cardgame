# /gen-background 명령어

게임 스타일에 맞는 배경 이미지를 생성합니다.

---

## 사용법

```
/gen-background [지역] [옵션]

예시:
/gen-background forest
/gen-background dungeon --subregion treasure-room
/gen-background castle --time dusk --mood peaceful
```

---

## 워크플로우

```
/gen-background [지역]
     ↓
[Phase 1] 지역 정보 파싱
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

## 지역 시스템

### 1. 숲 지역 (Forest)

#### 하위 지역
| 하위 지역 | 설명 |
|-----------|------|
| sunny-forest | 햇살 가득한 밝은 숲 |
| mushroom-forest | 알록달록 버섯 숲 |
| flower-forest | 꽃이 만발한 화원 숲 |

#### 색상 팔레트
| 요소 | 색상 | HEX |
|------|------|-----|
| 하늘 | Soft Blue | #87CEEB |
| 나무 | Warm Green | #90EE90 |
| 땅 | Warm Brown | #DEB887 |
| 햇살 | Golden | #FFD700 |

### 2. 던전 지역 (Dungeon)

#### 하위 지역
| 하위 지역 | 설명 |
|-----------|------|
| adventure-cave | 신나는 모험 동굴 |
| treasure-room | 보물이 가득한 방 |
| crystal-cave | 반짝이는 수정 동굴 |

#### 색상 팔레트
| 요소 | 색상 | HEX |
|------|------|-----|
| 벽 | Warm Stone | #A9A9A9 |
| 횃불 | Warm Orange | #FFA500 |
| 보물 | Soft Gold | #FFD700 |
| 바닥 | Cream | #FFFDD0 |

### 3. 성 지역 (Castle)

#### 하위 지역
| 하위 지역 | 설명 |
|-----------|------|
| castle-garden | 아름다운 성 정원 |
| throne-room | 화려한 왕좌의 방 |
| cozy-hall | 따뜻한 연회장 |

#### 색상 팔레트
| 요소 | 색상 | HEX |
|------|------|-----|
| 벽 | Warm Red | #CD5C5C |
| 장식 | Soft Gold | #FFD700 |
| 천 | Soft Purple | #DDA0DD |
| 바닥 | Cream | #FFFDD0 |

---

## 시간대 설정

| 시간대 | 색온도 | 분위기 키워드 |
|--------|--------|---------------|
| dawn | 부드러운 핑크 | 설렘, 시작 |
| day | 따뜻한 황색 | 평화, 밝음 |
| dusk | 따뜻한 오렌지 | 포근함, 휴식 |
| night | 따뜻한 보라/파랑 | 신비, 고요 |

---

## 프롬프트 레이어 시스템

### Layer 1: 마스터 스타일 베이스 (필수)
```
hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
warm cozy fairy tale atmosphere,
soft warm color palette,
warm parchment texture,
children's picture book illustration quality
```

### Layer 2: 배경 에셋 레이어 (필수)
```
cozy fairy tale environment scene,
warm inviting atmosphere,
layered depth composition,
soft warm lighting from top-left,
central area empty for characters,
wide landscape 16:9 ratio,
no characters no people
```

### Layer 3: 지역별 레이어

#### Forest
```
sunny bright forest clearing,
golden sunbeams filtering through trees,
soft green and brown colors,
cute mushrooms and flowers,
friendly welcoming woodland,
warm dappled light
```

#### Dungeon
```
friendly adventure dungeon,
warm orange torchlight glow,
stone walls with warm brown tones,
treasure chests and sparkling gems,
exciting exploration atmosphere,
cozy cave feeling
```

#### Castle
```
warm cozy castle interior,
elegant but welcoming design,
warm candlelight and stained glass,
soft red and gold decorations,
royal but friendly atmosphere,
comfortable homey feeling
```

### Layer 4: 시간대 수정자

#### Dawn
```
soft pink and orange sunrise,
gentle morning light,
fresh new day feeling,
early mist clearing
```

#### Day (기본)
```
bright golden sunlight,
warm cheerful atmosphere,
clear visibility,
active lively feeling
```

#### Dusk
```
warm orange sunset glow,
cozy evening atmosphere,
soft long shadows,
peaceful winding down feeling
```

#### Night
```
warm purple and blue tones,
soft moonlight with warm touch,
twinkling stars,
peaceful mysterious feeling
```

### Layer 5: 분위기 수정자

#### Peaceful
```
calm serene atmosphere,
soft gentle lighting,
quiet contemplative mood,
safe comfortable environment
```

#### Adventure
```
exciting discovery atmosphere,
bright curious lighting,
sense of wonder,
inviting exploration
```

#### Battle
```
slightly brighter lighting,
determined heroic atmosphere,
dynamic energy,
still warm and welcoming
```

### Layer 6: 네거티브 프롬프트 (필수)
```
dark scary atmosphere,
horror creepy elements,
cold blue dominant colors,
harsh dramatic lighting,
dangerous threatening environment,
realistic 3D render CGI,
characters people figures,
gloomy depressing scene,
complex cluttered composition
```

---

## 옵션 파라미터

| 옵션 | 설명 | 예시 |
|------|------|------|
| --subregion | 하위 지역 | sunny-forest, treasure-room |
| --time | 시간대 | dawn, day, dusk, night |
| --mood | 분위기 | peaceful, adventure, battle |
| --weather | 날씨 | clear, cloudy, light-rain |

---

## 이미지 생성 실행

### mcp__imggen__generate_image 호출
```
도구: mcp__imggen__generate_image
파라미터:
  - prompt: [Layer 1] + [Layer 2] + [Layer 3 지역] + [Layer 4 시간] + [Layer 5 분위기] + "--negative" + [Layer 6]
  - aspectRatio: "16:9" (가로형 배경)
  - style: "game-bg-fantasy" 또는 "none"
```

---

## 검증 체크리스트

| 항목 | 확인 |
|------|------|
| 16:9 비율? | □ |
| 캐릭터 배치 영역 비어있음? | □ |
| 손그림 스토리북 느낌? | □ |
| 따뜻하고 포근한 분위기? | □ |
| 좌상단 따뜻한 광원? | □ |
| 해당 지역 테마 일치? | □ |
| 레이어 깊이감 표현? | □ |
| 무섭거나 어둡지 않음? | □ |

---

## 예시 프롬프트 (성공 사례)

### 따뜻한 숲 배경
```
hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
warm cozy fairy tale forest,

sunny bright forest clearing,
golden sunbeams filtering through trees,
soft green and brown colors,
cute mushrooms and flowers,
friendly welcoming atmosphere,

warm parchment texture,
layered depth composition,
central area empty for characters,
wide landscape 16:9 ratio,
no characters no people

--negative
dark scary forest,
cold blue colors,
horror atmosphere,
3D render realistic,
characters people
```

---

## 참조
- `docs/04. design/05. backgrounds/01. background-guide.md`
- `docs/04. design/05. backgrounds/02. region-themes.md`
- `docs/04. design/06. ai-generation/01. gemini-master-guide.md`
