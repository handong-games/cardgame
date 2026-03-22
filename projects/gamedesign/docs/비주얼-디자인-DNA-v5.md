# 비주얼 디자인 DNA v5.0 — "황혼의 경계"

> **이 문서는 게임의 모든 시각적 요소에 대한 최상위 디자인 원칙(Source of Truth)입니다.**
> 캐릭터, 몬스터, 배경, 카드, UI, 이펙트 등 모든 에셋 제작 시 이 문서를 기준으로 합니다.

| 항목 | 값 |
|------|-----|
| 버전 | v5.0 |
| 코드명 | 황혼의 경계 (Twilight Threshold) |
| 이전 버전 | v4.0 "Dark Frame Edition" |
| 레퍼런스 이미지 | `assets/backgrounds/sunny-forest-day.png` |
| 작성일 | 2026-03-09 |

---

## 1. 비전 & 코어 아이덴티티

### 비전 (한 줄)

> **"황혼의 경계에서 펼쳐지는 동화적 모험"**

### 비전 해설

"황혼"은 특정 색상이 아닌 **분위기**를 의미한다:
- 빛과 어둠의 경계
- 안전과 위험의 사이
- 현실과 환상이 만나는 지점

모든 리전(숲, 던전, 성)에서 이 경계의 감각이 유지되어야 한다.
숲에서는 석양과 밤의 경계, 던전에서는 빛과 심연의 경계, 성에서는 삶과 위협의 경계.

### 코어 에센스 (4요소)

| 에센스 | 정의 | 적용 범위 |
|--------|------|----------|
| **동화적 분위기** | 어둡지만 무섭지 않은, 지브리/Ori급 아름다운 어둠 | 게임 전체 톤 |
| **레이어드 깊이감** | 투명도 레이어로 전경↔배경 분리, 깊이 연출 | 배경, 화면 구성 |
| **종이 질감** | 수제 종이공예 느낌, 종이결이 은은히 비침 | 캐릭터, 몬스터, 배경 |
| **전신 명암 감쇠** | 상체 디테일 집중 + 하체 완만한 음영 감쇠 + 전신 가독성 유지 | 캐릭터, 몬스터 (통일) |

### 톤 & 연령 가이드라인

| 속성 | 기준 |
|------|------|
| 타겟 연령 | 10대~성인 |
| 레퍼런스 톤 | 지브리(센과 치히로), Ori and the Blind Forest |
| 허용 | 약간의 어둠, 긴장감, 미스터리, 아름다운 우울 |
| 불허 | 피/고어, 그로테스크, 공포, 과잉 폭력, 성적 묘사 |

---

## 2. 유니버설 테크닉 (전 리전 공통)

이 섹션의 규칙은 **리전에 관계없이 모든 에셋에 적용**된다.

### 2-1. 전신 명암 감쇠 렌더링

```
[머리/얼굴] ─── 색상 100% (표정, 눈, 핵심 특징 인식)
[상체/장비] ─── 색상 80~60% (핵심 장비, 클래스/몬스터 아이덴티티)
[하반신]   ─── 색상 60~40% (완만한 음영 감쇠, 형태 유지)
[발/접지면] ─── 부드러운 접지 그림자 (배경과 분리 유지)
```

- 상체(얼굴+핵심장비)에 디테일이 집중되지만, 하반신도 끝까지 읽히도록 형태와 채색을 유지
- 캐릭터와 몬스터가 **동일한 기법** 사용 (세계관 일관성 최우선)
- 전투 시 캐릭터는 배경 위에 자연스럽게 서 있되, 상체에서 정체성을 읽을 수 있어야 함

### 2-2. 외곽선

- **두께**: 얇은 니어블랙 라인 (강조하지 않는 은은한 외곽)
- **색상**: 니어블랙 `#1A1A1E` 기본
- **캐릭터 외곽**: `#1A1A1E` (일관)
- **몬스터 외곽**: 리전별 미세 틴트
  - 숲: `#1A2A1A` (올리브 틴트)
  - 던전: `#1A1A2A` (블루 틴트)
  - 성: `#2A1A1A` (레드 틴트)
- **의도**: 캐릭터-몬스터가 겹칠 때 미묘하게 구분 가능

### 2-3. 텍스처

- **기본**: 종이 질감 — 수제 종이공예 느낌
- **적용**: 캐릭터, 몬스터, 배경 모두 (통일)
- **강도**: 은은하게 (종이결이 5~8% opacity로 비치는 정도)
- **리전별 틴팅** (선택적):
  - 숲: 따뜻한 크래프트지 `#F5E6D0` @ 5~8%
  - 던전: 차가운 회색 양피지 `#E8E8EC` @ 5~8%
  - 성: 붉은 빛 바랜 고문서 `#F0E0E0` @ 5~8%

### 2-4. 캔버스 비율

| 에셋 타입 | 비율 | 예시 해상도 |
|----------|------|------------|
| 캐릭터/몬스터 | 2:3 세로형 | 512x768, 1024x1536 |
| 동료 | 1:1 정사각 (원형 프레임) | 512x512 |
| 배경 | 16:9 가로형 | 1920x1080 |
| 아이콘 | 1:1 정사각 | 128x128, 256x256 |

---

## 3. 배경 시스템 (2-Tier)

배경은 두 가지 Tier로 분류한다. 두 Tier 모두 같은 세계에 속하되, 디테일 수준이 다르다.

### Tier 1 — 내비게이션/맵/이벤트/상점

> 레이어드 실루엣

| 속성 | 규칙 |
|------|------|
| 기법 | 3~5개 실루엣 레이어, 투명도로 깊이 표현 |
| 광원 | 중앙 그라데이션 발광 (리전별 색상) |
| 비네트 | 강한 어두운 가장자리 |
| 디테일 | 극도로 미니멀, 순수 형태(shape)만 |
| 용도 | 월드맵, 경로 선택, 상점, 이벤트, 휴식 |

**현존 에셋:**
| 파일 | 리전 | 색 온도 | 용도 |
|------|------|--------|------|
| `sunny-forest-day.png` | 숲 | 따뜻한 앰버/오렌지 | 숲 기본 (탐험/상점/이벤트) |
| `forest-silhouette.png` | 숲 | 차가운 틸/다크그린 | 숲 야간/위기 (엘리트/보스 조우) |
| `dungeon-silhouette.png` | 던전 | 차가운 블루그레이 | 던전 기본 |
| `castle-silhouette.png` | 성 | 다크 크림슨/버건디 | 성 기본 |

### Tier 2 — 전투(Battle)

> 실루엣 프레임 + 스토리북 중경

| 속성 | 규칙 |
|------|------|
| 전경 좌우 | 실루엣 프레임 (Tier 1과의 시각적 연결고리) |
| 중경 | 디테일한 수채화/스토리북 일러스트 |
| 종이 질감 오버레이 | 필수 (Tier 1과의 통일감) |
| 색상 | 해당 리전 팔레트 준수 |
| 용도 | 전투 화면 배경 |

**의도**: Tier 1에서 Tier 2로의 전환은 "같은 세계의 줌인" 느낌.
실루엣 세계의 넓은 풍경에서, 전투가 시작되면 그 세계 안으로 들어가 디테일이 보이는 것.

**현존 에셋:**
| 파일 | 리전 | 비고 |
|------|------|------|
| `sunny-forest-battle.jpg` | 숲 | 전투 배경 (Tier 2 기준으로 리워크 검토 필요) |

### 리전별 시간대/분위기 변형

각 리전은 최소 2개의 분위기 변형을 가질 수 있다:

| 리전 | 기본 | 변형 (위기) | 색상 시프트 |
|------|------|------------|-----------|
| 숲 | 앰버/오렌지 (석양) | 틸/다크그린 (야간) | 따뜻함 → 차가움 |
| 던전 | 블루그레이 (기본 동굴) | 딥 퍼플 (심연) | 차가움 → 더 깊은 차가움 |
| 성 | 크림슨/버건디 (기본) | 다크그레이+번개 (폭풍전야) | 붉음 → 무채색 |

---

## 4. 캐릭터 렌더링

### 공통 규칙

- **전신 완전 렌더링** — 머리부터 발끝까지 읽히는 스토리북 일러스트 스타일
- **전신 명암 감쇠 적용** — 상체 디테일 집중, 하체는 완만한 음영 감쇠로 정리
- 얇은 니어블랙 외곽선 `#1A1A1E` (섹션 2-2)
- 종이 질감 (섹션 2-3)
- 부드러운 수채화풍 색상 블렌딩, 하드엣지 셀 셰이딩 금지
- 왼쪽 위에서 따뜻한 키 라이트 → 자연스러운 그림자 깊이감
- 색상: **클래스별 고유색** (리전에 독립적, 어떤 배경에서든 동일)

### 클래스별 고유색 (TBD)

> 클래스별 고유색은 해당 클래스의 아이덴티티 컬러로,
> 캐릭터의 상체/장비/실루엣 포인트에 우선 적용된다.
> **모든 리전 배경(숲/던전/성)과 최소 30% 이상의 색상 대비를 확보**해야 한다.

| 클래스 | 고유색 | 보조색 | 악센트 | 설계 상태 |
|--------|--------|--------|--------|----------|
| 전사 (CLS_W) | 뮤트드 버건디 `#8B4049` (망토/스카프) | 낡은 가죽 `#6B4423` (조끼/벨트) | 오프화이트 셔츠, 나무 방패 | ✅ 확정 |
| 마법사 (CLS_M) | TBD | TBD | TBD | 미설계 |
| 도적 (CLS_R) | TBD | TBD | TBD | 미설계 |

**색상 선정 시 검증 규칙:**
1. 숲 앰버 배경 위에서 읽히는가?
2. 던전 블루그레이 배경 위에서 읽히는가?
3. 성 크림슨 배경 위에서 읽히는가?
4. 3개 리전 몬스터 팔레트와 충분히 구분되는가?

### 방향 규칙

- **캐릭터**: 우측 대각선 방향 (전진, 희망)

---

## 5. 몬스터 렌더링

### 공통 규칙

- 전신 명암 감쇠 렌더링 (섹션 2-1) — **캐릭터와 동일 기법**
- 얇은 외곽선 — **리전별 미세 틴트** (섹션 2-2)
- 종이 질감 (섹션 2-3)
- 색상: **지역 팔레트 종속**

### 리전별 몬스터 팔레트

| 리전 | 주조색 톤 | 채도 범위 | 명도 범위 |
|------|----------|----------|----------|
| 잊혀진 숲 | 앰버/올리브/머스타드 | 30~50% | 20~50% |
| 던전 | 블루그레이/틸/슬레이트 | 20~40% | 15~45% |
| 성 | 크림슨/버건디/다크로즈 | 25~45% | 15~40% |

### 방향 규칙

- **몬스터**: 좌측 대각선 방향 (대립, 위협)

---

## 6. 색상 시스템

### 6-1. 유니버설 UI 팔레트 (v5.0 운영 기준)

> 이 색상들은 **전 리전 공통**으로 사용된다.

| 역할 | HEX | 변수명 | 용도 |
|------|-----|--------|------|
| 앰버 악센트 | `#D4A574` | `--accent-amber` | 하이라이트, 가격, 보상, 기본 발광 |
| 텍스트 주요 | `#FFF5E6` | `--text-primary` | 주요 텍스트 |
| 다크 BG 시작 | `#1E1E24` | `--bg-dark` | 카드/패널 배경 시작 |
| 다크 BG 끝 | `#2A2A32` | `--bg-medium` | 카드/패널 배경 끝 |
| 보더 | `#4A4A55` | `--border` | 구분선, 테두리 |
| 서피스 | `#16161C` | `--surface` | 최하위 배경, HP바 컨테이너 |
| 외곽선 | `#1A1A1E` | `--outline` | 캐릭터/몬스터 외곽선 기본 |

### 6-2. 앰버 악센트의 리전별 적용

앰버 악센트(`#D4A574`)는 전 리전에서 유지한다.

| 리전 | 배경 톤 | 앰버 대비 | 비고 |
|------|--------|----------|------|
| 숲 (앰버) | 유사색 조화 | 명도 대비 확보 | 자연스러운 조화 |
| 던전 (블루그레이) | 보색 대비 | 강한 주목도 | 횃불/반딧불 효과 |
| 성 (크림슨) | 유사색 | **명도 차이 40% 이상 확보** | 앰버가 묻히지 않도록 |

### 6-3. 금지 색상

| 금지 | 대안 |
|------|------|
| 순수 검정 `#000000` | 따뜻한 니어블랙 `#1A1A1E` |
| 순수 흰색 `#FFFFFF` | 따뜻한 오프화이트 `#FFF5E6` |
| 네온/차가운 원색 | 뮤트드 어스톤 |
| 채도 60% 이상 | 40~55% 범위 유지 |

---

## 7. 이펙트 시스템

### 스타일: 뮤트드 발광 파티클

> "실루엣 세계에서 빛이 피어나는" 느낌

모든 전투 이펙트는 발광(glow) 파티클 형태로 표현한다.
어두운 실루엣 세계에서 빛이 퍼져나오는 것이 기본 미학.

### 이펙트 색상 매핑

| 구분 | 색상 | HEX (참고) | 발광 스타일 |
|------|------|-----------|-----------|
| 기본 공격 | 앰버/골드 | `#D4A574` | 따뜻한 섬광 |
| 기본 방어 | 앰버/골드 | `#D4A574` | 따뜻한 쉴드 |
| 회복 | 앰버/골드 | `#D4A574` | 따뜻한 파티클 상승 |
| 독 (Poison) | 뮤트드 녹색 | `#7A9A6B` | 녹색 안개/번짐 |
| 포자 (Spore) | 뮤트드 보라 | `#8B7A9A` | 보라 포자 부유 |
| 가시 (Thorns) | 뮤트드 적색 | `#9A6B6B` | 붉은 가시 반사 |
| 경화 (Hardening) | 뮤트드 회색/은색 | `#8A8A8E` | 은빛 경화 표면 |
| 회피 (Evasion) | 뮤트드 하늘색 | `#6B8A9A` | 잔상/투명화 |
| 취약 (Vulnerable) | 뮤트드 자주색 | `#9A6B8A` | 자주색 금이 감 |

### 리전별 이펙트 규칙

- 기본 이펙트(공격/방어/회복)의 앰버 톤은 **전 리전 공통 유지**
- 차가운 리전(던전)에서의 앰버 발광은 보색 대비로 오히려 강한 주목도 — 의도된 설계
- 속성별 이펙트 색상은 리전에 무관하게 고정 (속성 인지 일관성)

---

## 8. 카드 & UI

### 카드

| 속성 | 규칙 |
|------|------|
| 프레임 배경 | 어둡게 (`#1E1E24` → `#2A2A32` 그라데이션) |
| 테두리 | `#4A4A55` (기본), 등급별 색상 변화 |
| 일러스트 | 전신 스토리북 렌더링 자산 삽입 |
| 텍스트 | `#FFF5E6` 주요, `#D4A574` 강조 |
| 분위기 | 배경이 담당, 카드 자체는 깔끔하게 |

### UI

| 속성 | 규칙 |
|------|------|
| 철학 | 미니멀, 기능 우선, 방해하지 않는 |
| 배경 | `#16161C` 서피스 |
| 패널 | `#1E1E24` → `#2A2A32` |
| 테두리 | `#4A4A55` |
| 악센트 | `#D4A574` 앰버 (하이라이트, 선택 상태) |
| 텍스트 | `#FFF5E6` (기본), `#D4A574` (강조), `#4A4A55` (비활성) |

---

## 9. v4.0 → v5.0 전환 요약

### 버리는 것

| v4.0 요소 | 이유 |
|-----------|------|
| 캐릭터 flat color cel shading | → 부드러운 스토리북 렌더링으로 대체 |
| 캐릭터 bold clean outlines | → 얇은 니어블랙 외곽으로 대체 |
| 몬스터 ink wash / gouache | → 캐릭터와 같은 렌더링 결로 통일 |
| 캐릭터/몬스터 스타일 분리 | → 하나의 세계관 미학으로 통일 |
| 비전 "Dark Frame Edition" | → "황혼의 경계" |

### 유지하는 것

| v4.0 요소 | v5.0에서의 역할 |
|-----------|---------------|
| `#D4A574` 앰버 악센트 | 유니버설 악센트 유지 |
| `#1E1E24` 계열 UI 다크 팔레트 | UI 팔레트 유지 |
| `#FFF5E6` 텍스트 | 텍스트 컬러 유지 |
| 배경 layered silhouette | Tier 1 배경으로 유지 |
| 배경 vignette | 유지 |
| 뮤트드 채도 원칙 | 유지 (40~55% 범위) |
| 캔버스 비율 규칙 | 유지 |

### 진화한 것

| v4.0 요소 | v5.0 진화 |
|-----------|----------|
| 림라이트 (캐릭터 역광) | 전신 명암 감쇠 안에서 상체 중심 발광으로 진화 |
| 뮤트드 다크 판타지 톤 | 동화적 모험 톤으로 밝기 조정 (지브리/Ori급) |
| 배경만 실루엣 | 배경은 실루엣, 캐릭터/몬스터는 스토리북 렌더링으로 확장 |

---

## 10. AI 이미지 생성 프롬프트 가이드라인

### 캐릭터 마스터 키워드 (v5.0)

```
fairy tale storybook illustration style,
handmade paper craft texture with faint paper grain overlay at 5 to 8 percent opacity,
soft watercolor-like color blending and gentle shading transitions,
muted desaturated color palette strictly 40 to 55 percent saturation,
soft warm golden key light from upper-left illuminating face and shoulders,
subtle natural shadow on right side of body for depth,
subtle thin near-black outlines (#1A1A1E) barely visible and natural,
fully rendered character from head to feet with visible detail throughout,
fairy tale storybook mood,
solid white background for clean extraction
```

### 캐릭터 전용 추가 키워드

```
facing right (forward, hopeful direction),
class-specific accent color on outfit and cloak,
warm expressive eyes with gentle expression
```

### 몬스터 마스터 키워드 (v5.0)

```
fairy tale storybook monster illustration style,
full-body storybook monster rendering with readable detail from head to feet,
upper body and face carry the clearest detail focus while the lower body stays readable,
subtle thin near-black outlines (#1A1A1E),
handmade paper craft texture with faint paper grain overlay,
muted desaturated color palette (40-55% saturation),
soft warm key light from upper-left illuminating face, shoulders, and dominant features,
subtle natural shadow falloff toward the lower body for grounded depth without dark fade,
fairy tale storybook mood,
solid white background for clean extraction
```

### 몬스터 전용 추가 키워드

```
facing left (opposing, threatening direction),
region-specific muted color palette on upper body,
mysterious and slightly ominous but not scary,
no gore no blood no grotesque elements
```

### 배경 Tier 1 마스터 키워드

```
layered silhouette background,
3-5 depth layers with varying opacity,
central gradient glow (region-specific color),
strong vignette effect with darker edges,
minimal atmospheric scene with pure shapes,
handmade paper texture overlay at low opacity,
wide 16:9 aspect ratio,
no characters no creatures,
fairy tale mood
```

### 배경 Tier 2 (전투) 마스터 키워드

```
storybook illustration battle scene,
dark silhouette framing on left and right edges (connecting to map style),
detailed watercolor-style middle ground with environmental elements,
handmade paper texture overlay (mandatory for style unity),
region-specific color palette,
warm atmospheric lighting,
wide 16:9 aspect ratio,
no characters no creatures,
fairy tale adventure mood
```

### 네거티브 프롬프트 (공통)

```
realistic, photorealistic, 3D render, anime,
pure black, pure white, neon colors, high saturation,
gore, blood, horror, grotesque, scary,
complex detailed background (for character/monster assets),
modern, sci-fi, cyberpunk
```

---

## 부록: 리전 적응 매트릭스

| 속성 | 숲 (잊혀진 숲) | 던전 | 성 |
|------|--------------|------|-----|
| **배경 Tier 1 색상** | 앰버/오렌지 (기본), 틸 (야간) | 블루그레이 (기본), 딥퍼플 (심연) | 크림슨/버건디 (기본), 다크그레이 (폭풍) |
| **몬스터 주조색** | 앰버/올리브/머스타드 | 블루그레이/틸/슬레이트 | 크림슨/버건디/다크로즈 |
| **몬스터 외곽 틴트** | `#1A2A1A` | `#1A1A2A` | `#2A1A1A` |
| **종이 질감 틴트** | 크래프트지 `#F5E6D0` | 회색 양피지 `#E8E8EC` | 바랜 고문서 `#F0E0E0` |
| **앰버 악센트 대비** | 유사색 조화 | 보색 대비 (횃불) | 명도 대비 40%+ 확보 |
| **분위기 키워드** | 따뜻한 신비 | 차가운 미스터리 | 위엄 있는 위협 |
| **캐릭터 색상** | 클래스 고유색 (리전 독립) | 동일 | 동일 |
| **UI 팔레트** | 유니버설 다크 팔레트 | 동일 | 동일 |
| **이펙트 기본색** | 앰버/골드 | 앰버/골드 (횃불 대비) | 앰버/골드 (명도 대비) |
| **이펙트 속성색** | 고정 (리전 무관) | 동일 | 동일 |

---

*이 문서는 게임의 모든 시각 에셋 제작의 최상위 기준이다.*
*개별 에셋 프롬프트 작성 시 반드시 이 DNA를 참조할 것.*
