# 카드 드로우 시스템 (레거시)

> **상태:** 2026년 1월 17일부로 코인 토스 시스템으로 대체됨

## 개요

배틀씬에서 자원 획득을 위해 사용되던 카드 기반 시스템입니다. 플레이어는 덱에서 카드를 드로우하여 손패를 구성하고, 에너지를 소비하여 카드를 사용했습니다.

## 핵심 구조

### Player 인터페이스 (제거됨)
```typescript
interface Player {
  energy: number;      // 현재 에너지
  maxEnergy: number;   // 최대 에너지 (3)
  // ...
}
```

### BattleState 인터페이스 (제거됨)
```typescript
interface BattleState {
  deck: Card[];        // 드로우 대기 카드
  hand: Card[];        // 손패 (최대 10장)
  discard: Card[];     // 버림패
  animationPhase: 'idle' | 'discarding' | 'drawing';
  // ...
}
```

## 시스템 동작

### 1. 드로우 시스템
- 턴 시작 시 5장 드로우
- 손패 최대 10장 제한
- 덱 소진 시 버림패 셔플하여 덱 재생성

### 2. 에너지 시스템
- 턴 시작 시 에너지 최대치(3) 회복
- 카드 사용 시 에너지 소비
- 에너지 부족 시 카드 사용 불가

### 3. 턴 종료
- 미사용 손패 버림패로 이동
- 에너지 초기화

## 관련 함수 (제거됨)

```typescript
// gameStore.ts에서 제거된 함수들
drawCards: (count: number) => void;      // 카드 드로우
playCard: (cardId: string) => void;       // 카드 사용 (일부 로직 수정됨)
```

## 애니메이션 (제거됨)

- `cardAnimations.ts`: 카드 드로우/버리기 애니메이션
- 손패 부채꼴 배열 애니메이션
- 드래그 앤 드롭 인터랙션

## 대체 시스템

코인 토스 시스템으로 대체되었습니다. 자세한 내용은 다음 문서를 참조하세요:
- `docs/02. proto/02. battle-scene/systems/coin-toss-system.md`

## 변경 사유

1. **복잡성 감소**: 덱 빌딩/관리의 복잡성 제거
2. **즉각적인 피드백**: 코인 토스의 시각적 재미
3. **운 요소 명확화**: 50% 확률 기반의 명확한 자원 획득
4. **직업별 스킬 시스템 준비**: 향후 스킬 기반 전투 시스템 도입 용이
