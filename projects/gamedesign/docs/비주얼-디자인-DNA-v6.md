# 비주얼 디자인 DNA v6.0 — "라벤더 안개" (Lavender Mist)

> **이 문서는 게임의 모든 시각적 요소에 대한 최상위 디자인 원칙(Source of Truth)입니다.**
> 캐릭터, 몬스터, 배경, 카드, UI, 이펙트 등 모든 에셋 제작 시 이 문서를 기준으로 합니다.
> v5.0 "황혼의 경계"를 완전히 대체합니다.

| 항목 | 값 |
|------|-----|
| 버전 | v6.0 |
| 코드명 | 라벤더 안개 (Lavender Mist) |
| 이전 버전 | v5.0 "황혼의 경계 (Twilight Threshold)" |
| 벤치마크 | Dice & Fold (Tinymice Entertainment) |
| 작성일 | 2026-03-16 |

---

## 1. 비전 & 코어 아이덴티티

### 비전 (한 줄)

> **"라벤더빛 몽환 파스텔 세계에서 펼쳐지는 아늑한 카드 모험"**

### 비전 해설

뮤트드 파스텔 색상의 부드러운 판타지 세계.
모든 존재(캐릭터, 몬스터, 동료)는 **카드** 형태로 표현된다.
기본 분위기는 아늑하고 편안하지만, 라운드가 진행될수록 색상이 점진적으로 진해지며 긴장감을 형성한다.

### 코어 에센스 (4요소)

| 에센스 | 정의 | 적용 범위 |
|--------|------|----------|
| **뮤트드 파스텔** | 라벤더/라일락 기조의 부드러운 파스텔 색상 체계 | 게임 전체 톤 |
| **카드 세계** | 모든 개체가 양피지 카드 안에 존재하는 세계관 | 캐릭터, 몬스터, 동료, 스킬 |
| **보석 톤** | 클래스·상태·UI를 보석 이름의 뮤트드 컬러로 구분 | 클래스색, 상태이상, 코인 |
| **아늑한 긴장감** | 기본은 Cozy, 위기 시 채도/명도 시프트로 긴장 연출 | 배경, 분위기 전환 |

### 톤 & 감정 가이드라인

| 속성 | 기준 |
|------|------|
| 기본 분위기 | 아늑함(Cozy), 편안함, 몽환적 |
| 긴장 표현 | 색상 채도/명도의 점진적 시프트 (파스텔 → 진한 톤) |
| 허용 | 약간의 긴장감, 설렘, 신비로움, 모험 |
| 불허 | 피/고어, 그로테스크, 공포, 과잉 폭력, 성적 묘사 |
| 참고 톤 | Dice & Fold (아늑함), 젤다 풍의 탄바람 (긴장감) |

### 톤 스펙트럼 위치

```
어두움 ◯━━━━●━━━━◯ 밝음          (밝은 쪽)
진지함 ◯━━━●━━━━━◯ 경쾌함        (경쾌한 쪽)
복잡함 ◯━━●━━━━━━◯ 단순함        (단순한 쪽)
현실적 ◯━━━●━━━━━◯ 카툰          (카툰 쪽)
```

---

## 2. 유니버설 테크닉 (전 에셋 공통)

이 섹션의 규칙은 **모든 에셋에 적용**된다.

### 2-1. 렌더링 스타일

- **플랫 컬러 일러스트**: 3~5색의 깨끗한 솔리드 컬러, 그라디언트/텍스처/셰이딩 없음
- 붓 터치·종이 질감·구아슈 텍스처 **일절 없음**
- **실루엣만으로 캐릭터를 정의**하는 극단적 단순화
- **라벤더/쿨톤 색조 조명 금지** → 자연스러운 따뜻한 조명만 사용
- 디자인은 **최대한 간결하게** — 실루엣 + 소품 1~2개로만 표현
- 얼굴은 **눈동자가 보이지 않는 작은 단순 눈**(tiny simplified eyes without visible pupils/irises), 코 생략, 최소 표현

### 2-2. 외곽선

- **두께**: **단일 색상, 균일 굵기** (single color uniform weight)
- **색상**: 따뜻한 다크 톤 단색 (warm dark tone) — 순수 검정 아님
- **의도**: 플랫 컬러와 조화되는 깔끔한 단일 아웃라인

### 2-3. 캔버스 규칙

| 에셋 타입 | 비율 | 생성 해상도 | 표시 크기 | 비고 |
|----------|------|-----------|----------|------|
| 캐릭터 카드 | 2:3 세로형 | 512×768 | 240×360 | bust portrait, 가슴 중앙 크롭 |
| 몬스터 카드 | 2:3 세로형 | 512×768 | 240×360 | bust portrait, 가슴 중앙 크롭 |
| 몬스터 서브 | 2:3 세로형 | 512×768 | 180×270 | 멀티 몬스터 시 저티어 축소 (75%) |
| 동료 카드 | 1:1 원형 | 512×512 | — | 원형 프레임 |
| 스킬 카드 | 1:1 정사각형 | 512×512 | 140×140 | 추상 아이콘, 스킬 슬롯 규격 준수 |
| 배경 | 16:9 가로형 | 1920×1080 | — | 소프트 블러 |

### 2-4. 초상화 구도 규칙 (캐릭터/몬스터 공통)

| 항목 | 값 |
|------|-----|
| 크롭 포인트 | **가슴 중앙** (얼굴 + 어깨 + 의상 상부 노출) |
| 머리 위 여백 | 카드 높이의 **10~15%** |
| 수평 위치 | **정중앙** |
| 초상화 점유율 | 카드 면적의 **85~90%** (풀 블리드) |
| 배경색 | 크림 양피지 `#F0E8D8` |

### 2-5. 방향 규칙

- **캐릭터**: 우측 → (전진, 희망, 공격 방향)
- **몬스터**: 좌측 ← (대립, 위협, 방어 방향)
- **동료**: 우측 → (캐릭터와 같은 진영)

### 2-6. 카드 프레임 규칙

> 상세: `docs/설계도/카드-UI-레이아웃-v6.md`

| 항목 | 값 |
|------|-----|
| 렌더링 방식 | **프로그래매틱 (CSS/코드)** — AI 생성이 아님 |
| 프레임 두께 | 3~5px (표시 기준) |
| 모서리 | 10px radius (소프트 라운드) |
| 네임플레이트 | 양끝 접힘형 양피지 리본, 카드 하단 13~15% |
| 그림자 | soft drop shadow `rgba(58,48,64,0.3)` blur 8px |
| 캐릭터 프레임색 | 보석톤 클래스색 (전사=`#E8B4B8`, 마법사=`#B8A0D0`, 도적=`#A0C8B0`) |
| 몬스터 프레임색 | Tier별 (T1=`#B8B8C8`, T2=`#C8B888`, T3=`#C89098`) |

---

## 3. 색상 시스템

### 3-1. 마스터 팔레트 (뮤트드 파스텔)

| 역할 | 이름 | HEX | 용도 |
|------|------|-----|------|
| **주조색** | 라벤더 | `#D8C8E8` | 게임 전체 기조, 배경 베이스 |
| **보조색 1** | 연핑크 | `#E8D0D8` | 보조 배경, 하이라이트 |
| **보조색 2** | 크림 | `#F0E8D8` | 양피지 카드 배경, 텍스트 배경 |
| **악센트** | 골드 | `#C9A86C` | 강조, 보상, 코인 발광, 중요 UI |
| **텍스트 주요** | 다크 라벤더 | `#3A3040` | 주요 텍스트 |
| **텍스트 보조** | 뮤트드 그레이 | `#6A6070` | 보조 텍스트 |

### 3-2. 클래스별 고유색 (보석 톤)

| 클래스 | 보석 이름 | HEX | 의미 |
|--------|----------|-----|------|
| 전사 (CLS_W) | 로즈쿼츠 | `#E8B4B8` | 힘, 용기, 따뜻함 |
| 마법사 (CLS_M) | 아메시스트 | `#B8A0D0` | 마법, 신비, 지혜 |
| 도적 (CLS_R) | 에메랄드 | `#A0C8B0` | 민첩, 자연, 교활 |

### 3-3. 몬스터 Tier 프레임 색상

| Tier | 이름 | HEX | 용도 |
|------|------|-----|------|
| T1 일반 | 뮤트드 실버 | `#B8B8C8` | 일반 몬스터 프레임 테두리 |
| T2 정예 | 뮤트드 골드 | `#C8B888` | 정예 몬스터 프레임 테두리 |
| T3 보스 | 뮤트드 로즈 | `#C89098` | 보스 프레임 테두리 |

### 3-4. 스킬 카드 타입 색상

| 타입 | 이름 | HEX | 아이콘 |
|------|------|-----|--------|
| 공격 | 파스텔 로즈 | `#D4A0A0` | 검 ⚔ |
| 방어 | 파스텔 스카이 | `#A0B8D4` | 방패 🛡 |
| 버프 | 파스텔 세이지 | `#A0C8A0` | 화살 ↑ |
| 유틸리티 | 파스텔 라벤더 | `#B8A0D4` | 별 ✦ |

### 3-5. 상태이상 색상 (보석 톤)

| 속성 | 이름 | HEX |
|------|------|-----|
| 독 (Poison) | 뮤트드 에메랄드 | `#7AB88A` |
| 포자 (Spore) | 뮤트드 아메시스트 | `#9A80B8` |
| 가시 (Thorns) | 뮤트드 로즈 | `#C07878` |
| 경화 (Hardening) | 뮤트드 실버 | `#9898A8` |
| 회피 (Evasion) | 뮤트드 스카이 | `#78A8C0` |
| 취약 (Vulnerable) | 뮤트드 와인 | `#B868A0` |

### 3-6. 지역별 파스텔 팔레트 변주

공통 라벤더를 유지하면서 보조색으로 지역 차이를 표현한다.

| 지역 | 주조 변주 | HEX 범위 | 보조색 |
|------|----------|---------|--------|
| 잊혀진 숲 | 민트 + 라벤더 | `#C8D8C8` ~ `#D0C8E0` | 세이지, 크림 |
| 던전 | 스카이 + 라벤더 | `#C0C8D8` ~ `#C8C0D8` | 아이스블루, 실버 |
| 성 | 로즈 + 라벤더 | `#D8C0C8` ~ `#D0C0D8` | 더스티로즈, 골드 |

### 3-7. 긴장감 채도 시프트

라운드 진행에 따른 배경 채도/명도 변화:

| 단계 | 라운드 | 변화 | 톤 |
|------|--------|------|-----|
| 평온 | R1~3 | 순수 파스텔 그대로 | 밝고 아늑한 라벤더 |
| 긴장 | R4~5 | 채도 +15%, 명도 -10% | 약간 진해진 라벤더 |
| 위기 | R6~8+보스 | 채도 +30%, 명도 -20% | 딥 퍼플/딥 로즈 톤 |

### 3-8. 금지 색상

| 금지 | 대안 |
|------|------|
| 순수 검정 `#000000` | 다크 라벤더 `#3A3040` |
| 순수 흰색 `#FFFFFF` | 크림 `#F0E8D8` |
| 네온/비비드 원색 | 뮤트드 파스텔 버전 사용 |
| 채도 60% 이상 | 40~55% 범위 유지 |

---

## 4. 캐릭터 렌더링

### 공통 규칙

| 항목 | 값 |
|------|-----|
| 표현 방식 | **상반신 bust portrait** (가슴 위) |
| 등신 | 슈퍼 디포르메 치비 **2~2.5등신** |
| 연령 | 불특정 — "귀엽고 용감한 모험가" |
| 방향 | 우측 → (3/4 각도, looking toward right side) |
| 렌더링 | 플랫 컬러 일러스트 (3~5색, 셰이딩/그라디언트 없음) |
| 외곽선 | 단일 색상 균일 굵기 아웃라인 (warm dark tone) |
| 배경 | 크림 양피지 `#F0E8D8` |
| 캔버스 | 2:3 세로형 (512×768) |
| 얼굴 | 작은 점 눈 + 간단한 선 눈썹, 코 생략, 최소 표현 |
| 헤어 | 클래스별 개성 있는 실루엣 헤어 (클래스 정체성 강화) |
| 디자인 | 실루엣이 캐릭터를 정의, 소품 1~2개 최대 |
| 감정 | 용기, 결의, 친근함, 모험심 |

### 클래스별 스펙

#### 전사 (CLS_W)

| 항목 | 값 |
|------|-----|
| 고유색 | 로즈쿼츠 `#E8B4B8` |
| 무기 | 한손검 (bust 안에서 부분 노출) |
| 의상 색조 | 로즈쿼츠 톤 갑옷/망토 |
| 표정 | 점 눈 + 선 눈썹 |
| 헤어 | 짧고 거친 웜브라운 스파이키 헤어 |
| designStatus | confirmed |

#### 마법사 (CLS_M)

| 항목 | 값 |
|------|-----|
| 고유색 | 아메시스트 `#B8A0D0` |
| 무기 | 지팡이 (bust 안에서 부분 노출) |
| 의상 색조 | 아메시스트 톤 로브/모자 |
| 표정 | 점 눈 + 선 눈썹 |
| 헤어 | 긴 다크바이올렛 머리 + 뾰족한 챙넓은 모자 |
| designStatus | undesigned (gameplan 미확정) |

#### 도적 (CLS_R)

| 항목 | 값 |
|------|-----|
| 고유색 | 에메랄드 `#A0C8B0` |
| 무기 | 쌍검 (bust 안에서 부분 노출) |
| 의상 색조 | 에메랄드 톤 가죽/후드 |
| 표정 | 점 눈 + 선 눈썹 |
| 헤어 | 짧고 들쭉날쭉한 다크 헤어 + 큰 세이지그린 후드 |
| designStatus | undesigned (gameplan 미확정) |

### 동료

| 항목 | 값 |
|------|-----|
| 카드 형태 | **원형 프레임** (메달/뱃지 형태) |
| 캔버스 | 1:1 정사각 (512×512, 원형 크롭) |
| 크기 | 캐릭터/몬스터 카드보다 작음 |
| 방향 | 우측 → (캐릭터와 같은 진영) |
| 3종 정체 | 미정 |

---

## 5. 몬스터 렌더링

### 공통 규칙

| 항목 | 값 |
|------|-----|
| 표현 방식 | **카드형 bust portrait** (캐릭터와 동일 카드 형태) |
| 방향 | 좌측 ← (대립, 위협) |
| 캔버스 | 2:3 세로형 (512×768) |
| 카드 크기 | **전 Tier 동일 크기** |
| Tier 구분 | **프레임 테두리 색상으로만 구분** |
| 렌더링 | 플랫 컬러 일러스트 (캐릭터와 동일 기법) |
| 외곽선 | 단일 색상 균일 굵기 아웃라인 (캐릭터와 동일) |
| 색상 | 지역 팔레트 종속 (숲=민트계, 던전=스카이계, 성=로즈계) |
| 디자인 톤 | 위협적이지 않은 귀여운 판타지 몬스터 |

### Tier별 프레임 색상

| Tier | 프레임 색 | HEX |
|------|----------|-----|
| T1 일반 | 뮤트드 실버 | `#B8B8C8` |
| T2 정예 | 뮤트드 골드 | `#C8B888` |
| T3 보스 | 뮤트드 로즈 | `#C89098` |

### 방향 규칙

- 모든 몬스터는 **좌측 ←** 방향 (캐릭터와 대립)

---

## 6. 카드 시스템

### 6-1. 카드 재질 & 형태

| 항목 | 값 |
|------|-----|
| 재질 | 오래된 양피지/종이 (크림색 `#F0E8D8` 종이 질감) |
| 가장자리 | 약간 낡은 느낌 |
| 모서리 | 부드러운 라운드 (10~12px radius) |
| 장식 | **미니멀** — 색상 테두리만, 코너 장식 없음 |
| 그림자 | 카드가 떠있는 듯한 미묘한 드롭 섀도우 |

### 6-2. 카드 정보 레이아웃 (캐릭터/몬스터 카드)

```
  ████████░░░░         ← HP바: 프레임 상단 외곽
┌────────────┐            (로즈→회색 감소, 방어도=파란 오버레이)
│            │
│   (bust    │         ← 중앙: bust portrait 일러스트
│  portrait) │            (최대 면적 확보)
│            │
│   [이름]   │         ← 하단 내부: 캐릭터/몬스터 이름
└────────────┘
  [🍀2] [💀3]          ← 상태 아이콘: 프레임 하단 외곽
                          (아이콘 + 스택 숫자)
```

**핵심 원칙:**
- HP와 상태이상은 **카드 프레임 외곽**에 배치 → 일러스트 면적 최대화
- 카드 내부는 **bust + 이름**에만 집중
- 이름은 하단에 작고 깔끔하게

### 6-3. 스킬 카드 레이아웃

```
┌────────────┐
│ ⚔ 기본공격  │         ← 상단: 타입 아이콘 + 스킬 이름
│      ☀☀   │         ← 코스트 (코인 아이콘)
├────────────┤
│            │
│   (추상    │         ← 중앙: 추상 아이콘/심볼
│   아이콘)   │            (양피지 위 파스텔 톤 아이콘)
│            │
├────────────┤
│  데미지 3   │         ← 하단: 효과 설명
│  사용 무제한 │
└────────────┘
```

### 6-4. 스킬 카드 타입 구분

| 구분 방법 | 설명 |
|----------|------|
| **테두리 색상** | 공격=로즈, 방어=스카이, 버프=세이지, 유틸=라벤더 |
| **타입 아이콘** | 카드 상단에 검/방패/화살/별 아이콘 |
| 배경 | 공통 양피지 (타입별 배경 변화 없음) |

---

## 7. 배경 시스템

### 7-1. 렌더링 스타일

| 항목 | 값 |
|------|-----|
| 기법 | **소프트 일러스트** (부드러운 수채화풍) |
| 블러 | 60~70% 블러 처리 (카드에 시선 집중) |
| 내용 | **환경만** (나무, 동굴, 성벽 등 풍경) |
| 금지 | 캐릭터, 몬스터, 생물 배치 금지 |
| 해상도 | 1920×1080 (16:9) |

### 7-2. 지역별 배경

| 지역 | 환경 요소 | 색조 | 분위기 |
|------|----------|------|--------|
| 잊혀진 숲 | 나무 실루엣, 빛줄기, 안개, 이끼 | 민트+라벤더 | 신비로운 숲 |
| 던전 | 동굴 벽, 수정, 희미한 빛 | 스카이+라벤더 | 차가운 미스터리 |
| 성 | 성벽, 커튼, 스테인드글라스 | 로즈+라벤더 | 위엄 있는 긴장 |

### 7-3. 긴장감 연출 (채도/명도 시프트)

| 단계 | 적용 시점 | 시각적 변화 |
|------|----------|-----------|
| 평온 | R1~3 | 순수 파스텔, 밝고 아늑함 |
| 긴장 | R4~5 | 파스텔이 약간 진해짐, 채도 +15%, 명도 -10% |
| 위기 | R6~8+보스 | 딥 퍼플/딥 로즈, 채도 +30%, 명도 -20% |

---

## 8. UI 시스템

### 8-1. 코인

| 항목 | 값 |
|------|-----|
| 형태 | **해/달 문양 보석 코인** (반투명 보석 재질) |
| 앞면 | 해 문양 + 선 골드 `#C9A86C` (밝은 빛, 전진, 좋은 결과 연상) |
| 뒷면 | 초승달 문양 + 문 퍼플 `#6A5080` (신비, 변수, 다른 결과 연상) |
| 플립 | 보석이 회전하며 빛이 반사되는 애니메이션 |

### 8-2. HP & 방어도

| 항목 | 값 |
|------|-----|
| HP 표시 | **바(Bar) 형태** |
| HP 위치 | **카드 프레임 상단 외곽** |
| HP 색상 | 로즈 → 회색 감소 (`#E8B4B8` → `#A0A0A8`) |
| 방어도 | HP바 위에 **파란 오버레이** (`#A0B8D4`) |

### 8-3. 버튼

| 항목 | 값 |
|------|-----|
| 재질 | **양피지** (카드와 동일 소재감) |
| 형태 | 둥근 직사각형 |
| 색상 | 크림 `#F0E8D8` 바탕 + 골드 `#C9A86C` 텍스트 |
| 호버 | 약간 밝아지며 골드 글로우 |
| 비활성 | 흐릿한 회색 처리 |

### 8-4. 상태이상 아이콘

| 항목 | 값 |
|------|-----|
| 위치 | **카드 프레임 하단 외곽** |
| 형태 | 작은 원형 아이콘 + 스택 숫자 |
| 배열 | 좌→우 일렬 배치 |
| 색상 | 보석톤 6색 (섹션 3-5 참조) |

### 8-5. 폰트

| 항목 | 값 |
|------|-----|
| 전체 스타일 | **둥근 산세리프** (파스텔 세계관과 조화) |
| 제목/이름 | Bold 웨이트, 골드 또는 다크 라벤더 |
| 본문/설명 | Regular 웨이트, 다크 라벤더 `#3A3040` |
| 숫자 | Bold 웨이트, 상황별 색상 (데미지=로즈, 회복=세이지 등) |

---

## 9. 이펙트 시스템

### 기본 이펙트

| 유형 | 색상 | HEX | 시각적 표현 |
|------|------|-----|-----------|
| 공격 | 골드 | `#C9A86C` | 골드빛 섬광 |
| 방어 | 스카이 | `#A0B8D4` | 파란 쉴드 발광 |
| 회복 | 세이지 | `#A0C8A0` | 녹색 파티클 상승 |

### 속성 이펙트

| 속성 | 색상 | HEX | 시각적 표현 |
|------|------|-----|-----------|
| 독 | 뮤트드 에메랄드 | `#7AB88A` | 녹색 연기/방울 |
| 포자 | 뮤트드 아메시스트 | `#9A80B8` | 보라 포자 부유 |
| 가시 | 뮤트드 로즈 | `#C07878` | 핑크 가시 반사 |
| 경화 | 뮤트드 실버 | `#9898A8` | 은빛 경화 표면 |
| 회피 | 뮤트드 스카이 | `#78A8C0` | 잔상/투명화 |
| 취약 | 뮤트드 와인 | `#B868A0` | 보라빛 균열 |

### 이펙트 원칙

- 스타일: 뮤트드 발광 파티클
- 밀도: 짧고 명확
- 채도: 파스텔 세계관 내 (40~55%)
- 우선순위: 결과 전달 > 감정 연출

---

## 10. AI 이미지 생성 프롬프트 가이드라인

### 캐릭터 마스터 키워드 (v6.0)

```
simple flat color illustration with clean solid fills and no gradients,
bust portrait from mid-chest upward,
centered composition with moderate headroom above the head,
character fills most of the frame,
card game character portrait for cozy fantasy card game,
super-deformed chibi proportions around 2 to 2.5 head body ratio,
flat coloring with only 3 to 5 colors per character and no shading or tonal layering,
single color uniform weight outline in warm dark tone,
muted warm pastel colors strictly 40 to 55 percent saturation,
silhouette-driven character design recognizable from shape alone,
only 1 to 2 iconic props maximum,
small simple dot eyes with short simple line eyebrows and minimal facial features with no nose detail,
body facing right at three-quarter angle looking toward right side,
solid cream parchment background #F0E8D8,
no border no frame,
vertical portrait 2:3 aspect ratio
```

### 캐릭터 네거티브 (v6.0)

```
realistic, photorealistic, 3D render, CGI,
anime manga style,
extreme chibi 1 to 2 head ratio, baby proportions,
pure black, pure white background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, dark atmosphere,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
detailed eyes with highlights and reflections, large expressive eyes,
complex accessories, ornate decoration, detailed armor, intricate patterns,
lavender tint, purple ambient light, blue color cast, cool color cast on skin,
complex detailed background, white background,
facing left, looking left, back view,
full body, legs, feet, shoes, ground, floor,
ornate heavy armor, giant oversized weapons, complex weapon designs,
blurry low quality
```

### 몬스터 마스터 키워드 (v6.0)

```
simple flat color illustration with clean solid fills and no gradients,
bust portrait of fantasy creature or monster from mid-chest upward,
centered composition with moderate headroom above the head,
creature fills most of the frame,
card game monster portrait for cozy fantasy card game,
super-deformed chibi proportions around 2 to 2.5 head body ratio,
flat coloring with only 3 to 5 colors per creature and no shading or tonal layering,
single color uniform weight outline with region undertone,
muted warm pastel colors strictly 40 to 55 percent saturation,
silhouette-driven monster design recognizable from shape alone,
small simple dot eyes with short simple line eyebrows,
cute and charming monster design that is not scary or threatening,
body facing left at three-quarter angle opposing the hero,
solid cream parchment background #F0E8D8,
no border no frame,
vertical portrait 2:3 aspect ratio
```

### 배경 마스터 키워드 (v6.0)

```
hand-painted storybook watercolor illustration background,
dreamy muted pastel environment with soft visible brushwork,
warm natural color tones without any color tint or cast,
gentle blur effect 60 to 70 percent for depth of field,
atmospheric fantasy landscape,
no characters no creatures no cards,
soft warm diffused lighting,
wide landscape 16:9 aspect ratio,
cozy fairy tale mood with gentle storybook atmosphere,
center area intentionally kept open for cards and UI
```

### 네거티브 프롬프트 (공통 요소)

```
realistic, photorealistic, 3D render, CGI,
anime, manga, pixel art,
pure black, pure white background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
clean smooth airbrushed digital rendering, polished vector art,
lavender tint, purple ambient light, cool color cast,
modern, sci-fi, cyberpunk,
text, letters, numbers, watermark,
sharp hard edges, harsh lighting,
blurry low quality
```

> **중요**: 에셋 타입별 상세 네거티브는 `src/data/promptExamples.ts`의 `CHARACTER_NEGATIVE`, `MONSTER_NEGATIVE`, `NPC_NEGATIVE`, `BG_NEGATIVE`, `FRAME_NEGATIVE`, `UI_NEGATIVE`를 참조한다.

---

## 11. v5.0 → v6.0 전환 요약

### 버리는 것

| v5.0 요소 | 이유 |
|-----------|------|
| "황혼의 경계" 다크 판타지 톤 | → 뮤트드 파스텔 Cozy 톤으로 전환 |
| 전신(full-body) 렌더링 | → 상반신 bust portrait로 전환 |
| 니어블랙 `#1A1A1E` 외곽선 | → 단일 색상 균일 굵기 아웃라인으로 전환 |
| 종이 질감 5~8% 오버레이 | → 양피지 카드 재질로 대체 |
| 전신 명암 감쇠 기법 | → bust에서 불필요, 폐기 |
| 다크 UI 팔레트 `#1E1E24` 계열 | → 크림/라벤더 파스텔 UI로 전환 |
| 지역별 몬스터 외곽 틴트 | → 통일된 단일 색상 균일 아웃라인 |
| 배경 2-Tier 시스템 (실루엣+스토리북) | → 소프트 일러스트 단일 시스템 |
| 앰버 `#D4A574` 악센트 | → 골드 `#C9A86C` 악센트 |
| 프레임 다크 차콜 `#1E1E24` | → 양피지 크림 `#F0E8D8` |

### 새로 도입하는 것

| v6.0 요소 | 의미 |
|-----------|------|
| 뮤트드 파스텔 팔레트 (라벤더 기조) | 게임 전체 색 정체성 |
| 보석 톤 클래스 시스템 | 로즈쿼츠/아메시스트/에메랄드 |
| 카드형 모든 개체 | 세계관 일관성 |
| 양피지 카드 재질 | 물리적 카드 질감 + 서사적 의미 |
| 해/달 보석 코인 | 코인 플립 시각 피드백 |
| bust portrait 중심 | 실루엣·캐릭터성 집중 |
| 단일 균일 아웃라인 | 플랫 컬러와 자연스러운 조화 |
| 소프트 블러 배경 | 카드에 시선 집중 + 세계관 분위기 |
| 채도 시프트 긴장 연출 | 아늑함에서 긴장으로의 자연스러운 전환 |

---

## 부록: 에셋 인벤토리 요약

| 카테고리 | 수량 | 상태 |
|----------|------|------|
| 플레이어 캐릭터 | 3종 | 전사 확정, 마법사/도적 미설계 |
| 동료 | 3종 | 미정 |
| 숲 몬스터 | 7종+보스(2Phase) | 6종 확정, 1종 초안, 보스 초안 |
| 던전/성 몬스터 | 5종 | 향후 기획 (concept) |
| 카드 프레임 | 9종 | 캐릭터/동료/공격/방어/버프/유틸/T1/T2/T3 |
| 배경 | 3+종 | 지역별 전투 배경 |
| UI | 30+종 | 코인, 버튼, HP바, 아이콘 등 |
| 이펙트 | 9종 | 기본3+속성6 |

---

*이 문서는 게임의 모든 시각 에셋 제작의 최상위 기준이다.*
*개별 에셋 프롬프트 작성 시 반드시 이 DNA를 참조할 것.*
*이전 v5.0 문서는 더 이상 참조하지 않는다.*
