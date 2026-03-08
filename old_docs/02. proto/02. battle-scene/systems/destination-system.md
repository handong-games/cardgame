# 행선지 시스템 (Destination System)

> 전투 보상 선택 후 다음 행선지를 선택하는 로그라이크 스타일 시스템

---

## 개요

| 항목 | 설명 |
|------|------|
| 트리거 | 전투 보상 선택 완료 후 |
| 표시 위치 | 적 사망 영역 (인라인 표시) |
| 선택지 개수 | 기본 2개, 라운드 3/5에서 3개, 보스 라운드 1개 |
| 총 라운드 | 7라운드 (지역당) |

> 지역 시스템에 대한 자세한 내용은 [지역 시스템 문서](./region-system.md)를 참조하세요.

---

## 행선지 타입

| 타입 | 이모지 | 라벨 | 색상 | 설명 |
|------|:------:|------|------|------|
| `normal` | 👹 | 몬스터 | 회색 | 일반 전투 |
| `elite` | 💀 | 엘리트 | 노란색 | 강화된 적, 높은 보상 |
| `rest` | 🏕️ | 휴식 | 초록색 | HP 30% 회복 |
| `shop` | 🛒 | 상점 | 파란색 | 카드/아이템 구매 (미구현) |
| `event` | ❓ | 이벤트 | 보라색 | 랜덤 이벤트 (미구현) |

---

## 타입 정의

**파일**: `types/index.ts`

```typescript
export type DestinationType = 'normal' | 'elite' | 'rest' | 'shop' | 'event';

export interface DestinationOption {
  id: string;
  type: DestinationType;
  enemyKey?: string;      // 몬스터 행선지일 경우
  healPercent?: number;   // 휴식 행선지일 경우
}
```

---

## 행선지 생성 로직

**파일**: `data/destinations.ts`

### 확률 설정

```typescript
const DESTINATION_CONFIG = {
  eliteChance: 0.25,     // 엘리트 등장 확률 25%
  restChance: 0.20,      // 휴식 등장 확률 20%
  shopChance: 0.15,      // 상점 등장 확률 15%
  eventChance: 0.15,     // 이벤트 등장 확률 15%
  eliteMinRound: 2,      // 엘리트 최소 등장 라운드
  shopMinRound: 2,       // 상점 최소 등장 라운드
  restHealPercent: 30,   // 휴식 시 회복량 (최대 HP의 %)
};
```

### 선택지 개수 규칙

```typescript
export function getDestinationCount(round: number, totalRounds: number = 7): number {
  if (round >= totalRounds) return 1;  // 보스: 1개 고정
  if (round === 3 || round === 5) return 3;  // 라운드 3, 5: 3개
  return 2;                             // 나머지: 2개
}
```

### 생성 알고리즘

1. 첫 번째 행선지는 항상 일반 몬스터 (필수)
2. 나머지 행선지는 확률 기반 선택
3. 같은 타입 중복 방지 (각 타입 최대 1개)
4. 마지막 라운드(7)는 지역 보스 고정

---

## 게임 스토어 로직

**파일**: `stores/gameStore.ts`

### 상태

```typescript
interface RunState {
  regionId: string;        // 현재 지역 ID
  round: number;           // 현재 라운드 (1-7)
  totalRounds: number;     // 총 라운드 수
  isComplete: boolean;     // 런 클리어 여부
  selectedDestinationType?: DestinationType;
}

interface GameState {
  run: RunState;
  destinationOptions: DestinationOption[];  // 행선지 선택지 목록
  // ...
}
```

### showDestinationSelection

행선지 선택 화면을 표시합니다.

```typescript
showDestinationSelection: () => {
  const { run, battle } = get();
  const region = getRegion(run.regionId);
  const nextRound = run.round + 1;

  // 마지막 라운드였으면 런 완료
  if (nextRound > run.totalRounds) {
    set({ run: { ...run, isComplete: true }, battle: { ...battle, phase: 'victory' } });
    return;
  }

  // 행선지 선택지 생성 (지역 정보 활용)
  const destinations = generateDestinationOptions(nextRound, run.totalRounds, region.bossKey);
  set({ battle: { ...battle, phase: 'destination_selection' }, destinationOptions: destinations });
}
```

### selectDestination

행선지를 선택하고 해당 액션을 실행합니다.

| 행선지 타입 | 동작 |
|-------------|------|
| `rest` | HP 30% 회복 → 다음 행선지 선택 |
| `shop` | (미구현) 다음 행선지 선택으로 이동 |
| `event` | (미구현) 다음 행선지 선택으로 이동 |
| `normal` | 일반 적 생성 → 전투 시작 |
| `elite` | 강화 적 생성 (HP 1.5배, 공격력 1.3배) → 전투 시작 |

---

## UI 컴포넌트

**파일**: `components/screens/BattleScreen.tsx`

### 행선지 카드 (DestinationCard)

```typescript
const DESTINATION_INFO: Record<DestinationType, { emoji: string; label: string; color: string; border: string }> = {
  normal: { emoji: '👹', label: '몬스터', color: 'text-gray-300', border: 'border-gray-500' },
  elite: { emoji: '💀', label: '엘리트', color: 'text-yellow-400', border: 'border-yellow-500' },
  rest: { emoji: '🏕️', label: '휴식', color: 'text-green-400', border: 'border-green-500' },
  shop: { emoji: '🛒', label: '상점', color: 'text-blue-400', border: 'border-blue-500' },
  event: { emoji: '❓', label: '이벤트', color: 'text-purple-400', border: 'border-purple-500' },
};
```

#### Props

```typescript
interface DestinationCardProps {
  destination: DestinationOption;
  index: number;
  onSelect: () => void;
}
```

#### 애니메이션

| 효과 | 설정 |
|------|------|
| 등장 | `opacity: 0→1`, `y: 20→0`, `scale: 0.9→1` |
| 순차 지연 | `delay: index * 0.1` |
| 호버 | `scale: 1.05`, `duration: 0.05` |

#### 레이아웃

- 캐릭터 카드와 동일한 높이
- 상단: 라벨 (타입명)
- 하단: 이모지 (타입 아이콘)

---

### 라운드 진행 UI (RoundProgress)

화면 우측에 수직으로 표시되는 라운드 진행 상태 표시기

#### Props

```typescript
interface RoundProgressProps {
  currentRound: number;
  totalRounds: number;
  regionName: string;
}
```

#### 상태별 스타일

| 상태 | 크기 | 스타일 |
|------|------|--------|
| passed (지나간) | `w-3 h-3` | 채워진 흰색 원 |
| current (현재) | `w-5 h-5` | 선홍색 테두리 + 내부 점 |
| locked (잠긴) | `w-3 h-3` | 회색 빈 원 |

#### 트랙 연결선

| 상태 | 스타일 |
|------|--------|
| passed | 흰색 (`bg-white`) |
| current | 그라데이션 (`from-rose-500 to-gray-600`) |
| locked | 회색 (`bg-gray-600`) |

#### 하단 표시

```
[현재 라운드] / [최대 라운드]
[지역 이름]
```

예시:
```
3 / 7
잊혀진 숲
```

---

## 게임 흐름

```
전투 승리
    ↓
보상 선택 (카드 선택)
    ↓
phase: 'destination_selection'
    ↓
┌─────────────────────────────────┐
│   다음 행선지 선택               │
│                                 │
│  [👹 몬스터]  [🏕️ 휴식]  [💀 엘리트] │
└─────────────────────────────────┘
    ↓
행선지 선택
    ↓
├── 휴식 → HP 회복 → 다음 행선지 선택
├── 상점/이벤트 → (미구현) → 다음 행선지 선택
└── 전투 → 적 생성 → 전투 시작
```

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `dev/proto/src/types/index.ts` | DestinationType, DestinationOption, Region 타입 정의 |
| `dev/proto/src/data/regions.ts` | 지역 데이터 정의 |
| `dev/proto/src/data/destinations.ts` | 행선지 생성 로직 |
| `dev/proto/src/stores/gameStore.ts` | 상태 관리 및 행선지 선택 액션 |
| `dev/proto/src/components/screens/BattleScreen.tsx` | UI 컴포넌트 (DestinationCard, RoundProgress) |

---

## 미구현 기능

- [ ] 상점 행선지 기능 (카드/아이템 구매)
- [ ] 이벤트 행선지 기능 (랜덤 이벤트)
- [ ] 마을 행선지 기능 (회복, 강화 등)
- [ ] 행선지 맵 시각화 (Slay the Spire 스타일)
- [ ] 행선지 미리보기 (몬스터 정보 표시)

---

## 관련 문서

- [지역 시스템](./region-system.md) - 지역 구조 및 확장 계획
