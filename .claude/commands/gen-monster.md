# /gen-monster 명령어

v4.0 Dark Frame Edition 스타일에 맞는 몬스터 에셋 프롬프트를 생성합니다.

---

## 사용법

```
/gen-monster [몬스터명 또는 gameplan ID] [옵션]

예시:
/gen-monster goblin
/gen-monster MON_F01
/gen-monster poison-spider --tier 1 --region forest
/gen-monster ancient-grove-lord --tier 3 --region forest
```

---

## 워크플로우

```
/gen-monster [몬스터명]
     ↓
[Phase 1] 엔티티 식별
  - promptExamples.ts에서 ID/이름 매칭
  - gameplan Tier 1 명세서 참조 (몬스터-명세서.md)
  - designStatus 확인 (confirmed/draft/undesigned/concept)
     ↓
[Phase 2] 프롬프트 레이어 조합
  - Layer 1~5 순서대로 조합
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
| 1순위 | gameplan Tier 1 | `projects/gameplan/docs/specific/몬스터-명세서.md` |
| 2순위 | 프롬프트 코드 | `projects/gamedesign/src/data/promptExamples.ts` |
| 3순위 | 프롬프트 문서 | `projects/gamedesign/PROMPT-EXAMPLES.md` |

---

## 티어 시스템

### Tier 1: 일반 몬스터 (Normal)
| 요소 | v4.0 스펙 |
|------|-----------|
| 등신 비율 | 2 등신 (tiny) |
| 존재감 | common enemy creature |
| 프레임 악센트 | 실버 #C0C0C0 |
| 디테일 수준 | 단순하지만 위협적 |

### Tier 2: 정예 몬스터 (Elite)
| 요소 | v4.0 스펙 |
|------|-----------|
| 등신 비율 | 2.5 등신 (small) |
| 존재감 | elite enemy creature, notable presence |
| 프레임 악센트 | 퍼플 #6B4B8C |
| 디테일 수준 | 위협적 + 장식 요소 |

### Tier 3: 보스 몬스터 (Boss)
| 요소 | v4.0 스펙 |
|------|-----------|
| 등신 비율 | 3 등신 (medium) |
| 존재감 | legendary boss creature, aura of authority, imposing presence |
| 프레임 악센트 | 크림슨 #8B0000 |
| 디테일 수준 | 압도적 + 왕관/뿔 등 권위 요소 |

---

## 지역별 색상 팔레트

### 숲 (Forest)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Forest Green | #2D5A3D |
| 보조색 | Warm Brown | #6B4423 |
| 이끼/식물 | Moss Green | #4A6741 |
| 독/보라 | Muted Purple | #6B4B8C |
| 균사/곰팡이 | Dusty Mauve | #8B668B |

### 던전 (Dungeon)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Bone Cream | #E8E4D9 |
| 보조색 | Warm Gold | #D4A574 |
| 눈 | Soft Teal | #6B8E9F |
| 금속 | Steel Gray | #5A5F6B |

### 성 (Castle)
| 요소 | 색상 | HEX |
|------|------|-----|
| 주색 | Burgundy | #8B4049 |
| 보조색 | Tarnished Gold | #B8860B |
| 악센트 | Dark Purple | #6B4B8C |
| 금속 | Dark Steel | #5A5F6B |

---

## 프롬프트 레이어 시스템

### Layer 1: 몬스터 마스터 스타일 (필수)
```
hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring with controlled color application,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature silhouette edges
```

### Layer 2: 몬스터 에셋 공통 (필수)
```
vertical portrait 2:3 aspect ratio,
NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only
```

### Layer 3: Tier별 수정자

#### Tier 1 (Normal)
```
tiny 2 head ratio,
common enemy creature
```

#### Tier 2 (Elite)
```
small 2.5 head ratio,
elite enemy creature,
notable presence
```

#### Tier 3 (Boss)
```
medium 3 head ratio,
imposing presence,
legendary boss creature,
aura of authority
```

### Layer 4: 지역별 수정자

#### Forest
```
enchanted forest aesthetic,
forest green and warm brown palette (#2D5A3D, #6B4423)
```

#### Dungeon
```
dungeon stone aesthetic,
warm gray and cream palette (#E8E4D9, #5A5F6B)
```

#### Castle
```
castle interior aesthetic,
burgundy gold and dark palette (#8B4049, #B8860B)
```

### Layer 5: 개별 몬스터 설명

`promptExamples.ts`의 해당 엔티티 prompt에서 Layer 1~4에 해당하지 않는 **고유 설명 부분**을 추출.

예시 (고블린 MON_F01):
```
small goblin creature,
simple crude appearance tutorial-level weak enemy,
greenish-tinted skin (#4A6741),
ragged torn cloth clothing,
holding small rusty knife,
hunched sneaky posture,
beady cunning eyes,
pointy ears and crooked nose
```

### 네거티브 프롬프트 (필수)
```
rosy blushing cheeks, facing right, looking right,
photorealistic, 3D render, CGI,
dark horror scary gothic,
cream paper, parchment texture, complex detailed background,
multiple characters,
creature too dark blending into shadows,
blurry low quality
```

---

## 속성 시스템 시각적 표현 가이드

gameplan의 6종 상태 태그를 시각적으로 표현할 때 참고:

| 속성 | 시각적 힌트 | 프롬프트 키워드 예시 |
|------|------------|---------------------|
| 독 (Poison) | 보라빛 독액, 방울 | venom droplets, purple-tinted markings (#6B4B8C) |
| 포자 (Spore) | 포자 입자, 균사 | spore particles floating, fungal growths (#8B668B) |
| 가시 (Thorns) | 날카로운 가시 돌출 | sharp thorns protruding from body |
| 경화 (Hardening) | 돌/바위 질감, 이끼 | stone surface, moss-covered rock (#4A6741) |
| 회피 (Evasion) | 은밀한 자세, 그림자 | stealthy lurking posture, dark and secretive |
| 취약 (Vulnerable) | 금이 간 표면, 빛 새어나옴 | cracks with faint inner glow |

---

## 옵션 파라미터

| 옵션 | 설명 | 예시 |
|------|------|------|
| --region | 지역 지정 | forest, dungeon, castle |
| --tier | 티어 지정 | 1, 2, 3 |
| --status | 설계 상태 필터 | confirmed, draft, undesigned, concept |

---

## 검증 체크리스트

| 항목 | 확인 |
|------|------|
| **마스터 스타일**: ink illustration + gouache + muted earthy? | □ |
| **방향**: 몸이 좌측 대각선 ↖ 을 향함? | □ |
| **볼 홍조**: 없음 (NO rosy blush)? | □ |
| **비율**: 2:3 세로형 (vertical portrait)? | □ |
| **배경**: solid white background? | □ |
| **등신**: Tier에 맞는 등신 비율 (T1=2, T2=2.5, T3=3)? | □ |
| **색상**: 어스톤 위주 (35-55% 채도)? 네온/차가운 색 없음? | □ |
| **속성 표현**: gameplan 속성 태그가 시각적으로 반영됨? | □ |
| **gameplan 정합성**: gameplanId와 designStatus 일치? | □ |
| **네거티브**: MONSTER_NEGATIVE 적용됨? | □ |

---

## 숲 몬스터 참조 (promptExamples.ts 기준)

| ID | gameplan ID | 이름 | Tier | 속성 | 설계 상태 |
|----|------------|------|------|------|-----------|
| goblin | MON_F01 | 고블린 | T1 | — | confirmed |
| poison-spider | MON_F02 | 독거미 | T1 | 독, 회피 | confirmed |
| spore-parasite | MON_F03 | 버섯 기생체 | T1 | 포자 | confirmed |
| thorn-vine | MON_F04 | 가시 덩굴 | T2 | 가시 | confirmed |
| golem | MON_F05 | 골렘 | T2 | 경화 | confirmed |
| wolf-pack | MON_F06 | 늑대 | T2 | 하울링 | draft |
| rotten-tree | MON_F07 | 썩은 나무 | T2 | 집중, 지속방어 | confirmed |
| ancient-grove-lord | BOSS_F01 | 고대 수목군주 | T3 | 뿌리속박, 경화, 회복 | undesigned |

---

## 참조
- `projects/gameplan/docs/specific/몬스터-명세서.md` — 몬스터 데이터 구조 (Tier 1)
- `projects/gamedesign/src/data/promptExamples.ts` — 프롬프트 코드 (Source of Truth)
- `projects/gamedesign/PROMPT-EXAMPLES.md` — 프롬프트 종합 가이드
- `projects/gamedesign/CONTEXT.md` — 작업 맥락 및 비주얼 규칙
