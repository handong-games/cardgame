# 지역 시스템 (Region System)

> 월드를 구성하는 지역 단위 시스템. 각 지역은 고유한 몬스터, 보스, 희귀 카드를 가진다.

---

## 개요

| 항목 | 설명 |
|------|------|
| 구조 | 월드 > 지역 > 라운드 |
| 지역당 라운드 | 7라운드 |
| 특수 라운드 | 라운드 4 (마을), 라운드 7 (보스) |

---

## 타입 정의

**파일**: `types/index.ts`

```typescript
export interface Region {
  id: string;
  name: string;
  description: string;
  totalRounds: number;     // 해당 지역의 라운드 수
  bossKey: string;         // 보스 적 키
}
```

---

## 현재 지역

**파일**: `data/regions.ts`

| 지역 ID | 이름 | 설명 | 라운드 | 보스 |
|---------|------|------|:------:|------|
| `forgotten_dungeon` | 잊혀진 숲 | 어둠에 잠긴 고대의 지하 감옥 | 7 | 암흑 기사 |

### 코드

```typescript
export const REGIONS: Record<string, Region> = {
  forgotten_dungeon: {
    id: 'forgotten_dungeon',
    name: '잊혀진 숲',
    description: '어둠에 잠긴 고대의 지하 감옥. 슬라임과 고블린이 서식한다.',
    totalRounds: 7,
    bossKey: 'dark_knight',
  },
};

export const DEFAULT_REGION_ID = 'forgotten_dungeon';
```

---

## 라운드 구조

```
라운드 1   ○   일반 전투
          |
라운드 2   ○   일반 전투
          |
라운드 3   ○   일반 전투 (선택지 3개)
          |
라운드 4  🏘️  마을 (중간 지점)
          |
라운드 5   ○   일반 전투 (선택지 3개)
          |
라운드 6   ○   일반 전투
          |
라운드 7  ☠️   보스 전투
```

---

## 지역별 요소 (확장 계획)

각 지역은 다음 요소들을 독립적으로 정의할 수 있습니다:

| 요소 | 설명 | 상태 |
|------|------|:----:|
| 몬스터 풀 | 지역 전용 일반/엘리트 몬스터 | 미구현 |
| 희귀 카드 | 지역에서만 획득 가능한 카드 | 미구현 |
| 보스 | 지역 최종 보스 | 구현됨 |
| 배경/테마 | 시각적 테마 | 미구현 |
| BGM | 지역 전용 음악 | 미구현 |
| 이벤트 | 지역 전용 랜덤 이벤트 | 미구현 |

---

## 확장 지역 (예시)

| 지역 ID | 이름 | 테마 | 예상 몬스터 |
|---------|------|------|-------------|
| `cursed_forest` | 저주받은 숲 | 독/자연 | 거대 거미, 독버섯, 숲의 망령 |
| `volcanic_cave` | 화산 동굴 | 화염 | 용암 골렘, 화염 정령, 용의 새끼 |
| `frozen_peak` | 얼어붙은 봉우리 | 빙결 | 서리 늑대, 얼음 마녀, 프로스트 자이언트 |

---

## 런 상태 연동

**파일**: `stores/gameStore.ts`

```typescript
interface RunState {
  regionId: string;        // 현재 지역 ID
  round: number;           // 현재 라운드 (1-7)
  totalRounds: number;     // 총 라운드 수
  isComplete: boolean;     // 런 클리어 여부
}
```

### 초기화

```typescript
const createInitialRun = (): RunState => ({
  regionId: 'forgotten_dungeon',  // 기본 지역
  round: 1,
  totalRounds: 7,
  isComplete: false,
});
```

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `dev/proto/src/types/index.ts` | Region 타입 정의 |
| `dev/proto/src/data/regions.ts` | 지역 데이터 정의 |
| `dev/proto/src/stores/gameStore.ts` | 런 상태에서 지역 참조 |
| `dev/proto/src/data/destinations.ts` | 행선지 생성 시 지역 보스 활용 |

---

## 관련 문서

- [행선지 시스템](./destination-system.md) - 지역 내 라운드 진행
