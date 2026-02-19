# 카드 프리뷰 시스템

> 카드 드래그 시 효과를 미리 보여주는 시스템

---

## 키워드 인덱스

| 키워드 | 한글 | 설명 | 섹션 |
|--------|------|------|------|
| `damage-preview` | 데미지프리뷰 | 공격 카드 드래그 시 HP 감소 미리보기 | [데미지 프리뷰](#데미지-프리뷰-damage-preview) |
| `block-preview` | 블록프리뷰 | 방어 카드 드래그 시 방어력 증가 미리보기 | [블록 프리뷰](#블록-프리뷰-block-preview) |
| `drop-zone-highlight` | 드롭존하이라이트 | 유효한 드롭 대상 영역 테두리 표시 | [드롭 존 하이라이트](#드롭-존-하이라이트-drop-zone-highlight) |
| `card-boundary-detection` | 카드경계감지 | 카드 영역 내/외부 판별하여 프리뷰 트리거 | [카드 경계 감지](#카드-경계-감지-card-boundary-detection) |
| `preview-exit-animation` | 프리뷰해제애니메이션 | 프리뷰 해제 시 역재생 효과 | [프리뷰 해제 애니메이션](#프리뷰-해제-애니메이션-preview-exit-animation) |

---

## 데미지 프리뷰 (damage-preview)

### 개요

| 항목 | 설명 |
|------|------|
| 활성화 조건 | 공격 카드 드래그 + 적 영역 호버 |
| HP 바 프리뷰 | 예상 감소량을 주황색 영역으로 표시 (투명도 40%) |
| HP 텍스트 | 예상 HP로 변경 (색상 유지) |
| 데미지 숫자 | HP 바 위에 "-8" 형태로 표시 |
| 데미지 계산 | 적 방어력 고려한 실제 HP 데미지 |

---

## 구현 상세

### 1. 프리뷰 데미지 계산

**파일**: `BattleScreen.tsx:48-67`

```typescript
// 프리뷰 데미지 계산 (공격 카드 + 적 영역 호버 시)
const previewDamage = useMemo(() => {
  if (
    !dragState.isDragging ||
    !dragState.card ||
    dragState.card.type !== 'attack' ||
    dragState.currentZone !== 'enemy' ||
    !enemy
  ) {
    return 0;
  }

  // 카드 효과 계산
  const effects = getCardEffects(dragState.card, player);

  // 적 방어력을 고려한 실제 HP 데미지
  const actualDamage = Math.max(0, effects.damageToEnemy - enemy.block);

  return actualDamage;
}, [dragState.isDragging, dragState.card, dragState.currentZone, enemy, player]);
```

**데미지 공식**:
```
actualDamage = max(0, cardDamage - enemy.block)
```

---

### 2. 드래그 상태 관리

**파일**: `useDrag.ts`

```typescript
interface DragState {
  isDragging: boolean;
  card: Card | null;
  cardIndex: number;
  position: { x: number; y: number };
  currentZone: DropZone;  // 현재 호버 중인 드롭 존
}
```

- `currentZone`: 마우스가 현재 위치한 드롭 영역
- 실시간 영역 감지로 프리뷰 활성화/비활성화

---

### 3. HP 바 프리뷰 UI

**파일**: `HPBar.tsx`

#### Props
```typescript
interface HPBarProps {
  current: number;
  max: number;
  showText?: boolean;
  color?: 'red' | 'green';
  previewDamage?: number;  // 예상 데미지 (프리뷰용)
}
```

#### 프리뷰 계산
```typescript
// 프리뷰 후 남을 HP 계산
const afterDamageHp = Math.max(0, current - previewDamage);
const afterDamagePercentage = (afterDamageHp / max) * 100;

// 프리뷰 데미지 영역 (깎일 부분)
const previewPercentage = hpPercentage - afterDamagePercentage;
```

#### UI 구성

| 요소 | 설명 |
|------|------|
| 프리뷰 영역 | 주황색 (`bg-orange-500 opacity-40`) |
| HP 텍스트 | 예상 HP 표시 (흰색 유지) |
| 데미지 숫자 | HP 바 위에 "-N" 표시 (`text-orange-400`) |

#### 프리뷰 영역
```tsx
{/* 프리뷰 데미지 영역 (주황색) */}
{previewDamage > 0 && (
  <div
    className="absolute h-full bg-orange-500 opacity-40"
    style={{
      left: `${afterDamagePercentage}%`,
      width: `${previewPercentage}%`,
    }}
  />
)}
```

#### HP 텍스트 프리뷰
```tsx
{/* 프리뷰 시 예상 HP, 색상은 흰색 유지 */}
{previewDamage > 0 ? afterDamageHp : current} / {max}
```

#### 데미지 숫자 애니메이션
```typescript
// 데미지 숫자 등장
initial={{ opacity: 0, y: 5 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 5 }}
```

---

### 4. EnemyCard 연동

**파일**: `EnemyCard.tsx`

```typescript
interface EnemyCardProps {
  enemy: Enemy;
  isAttacking?: boolean;
  isHit?: boolean;
  previewDamage?: number;  // 예상 데미지 (프리뷰용)
}
```

`previewDamage` prop을 HPBar 컴포넌트에 전달:
```tsx
<HPBar
  current={enemy.hp}
  max={enemy.maxHp}
  color="red"
  previewDamage={previewDamage}
/>
```

---

## 블록 프리뷰 (block-preview)

> 방어 카드 드래그 시 플레이어 방어력 증가를 미리 보여주는 기능

### 개요

| 항목 | 설명 |
|------|------|
| 활성화 조건 | 방어 카드 드래그 + 카드 영역 외부 |
| 방패 원 색상 | cyan (`#0891b2` / `#22d3ee`) |
| +X 표시 | 방패 원 위에 증가량 표시 |
| 방패 숫자 | 현재 방어력 + 프리뷰 합계 표시 |

### 구현 상세

#### 1. 프리뷰 블록 계산

**파일**: `BattleScreen.tsx:672-694`

```typescript
// 프리뷰 방어력 계산 (방어 카드 드래그 + 카드 외부 시에만 표시)
const previewBlock = useMemo(() => {
  if (
    !dragState.isDragging ||
    !dragState.card ||
    dragState.card.type === 'attack'
  ) {
    return 0;
  }

  // 마우스가 카드 영역 내부인지 확인
  if (dragState.cardRect) {
    const { left, right, top, bottom } = dragState.cardRect;
    const { x, y } = dragState.position;
    const isInsideCard = x >= left && x <= right && y >= top && y <= bottom;
    if (isInsideCard) {
      return 0;  // 카드 내부면 프리뷰 없음
    }
  }

  const effects = getCardEffects(dragState.card, player);
  return effects.blockToPlayer;
}, [dragState.isDragging, dragState.card, dragState.position, dragState.cardRect, player]);
```

#### 2. CharacterCard 연동

**파일**: `CharacterCard.tsx`

```typescript
interface CharacterCardProps {
  // ...기존 props
  previewBlock?: number;  // 프리뷰 방어력
}
```

#### 3. 방패 원 UI

**파일**: `CharacterCard.tsx:102-117`

```tsx
<motion.div
  animate={{
    backgroundColor: previewBlock > 0 ? '#0891b2' : block > 0 ? '#2563eb' : '#374151',
    borderColor: previewBlock > 0 ? '#22d3ee' : block > 0 ? '#60a5fa' : '#4b5563',
  }}
  transition={{ duration: 0.15 }}
  className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
>
  {previewBlock > 0 ? block + previewBlock : block}
</motion.div>
```

---

## 드롭 존 하이라이트 (drop-zone-highlight)

> 드래그 중 유효한 드롭 대상 영역에 테두리 표시

### 개요

| 카드 타입 | 유효 드롭 존 | 하이라이트 |
|-----------|--------------|------------|
| 공격 카드 (`targetType: 'enemy'`) | 적 영역 | `ring-4 ring-green-500/50` |
| 방어 카드 (`targetType: 'self'`) | 플레이어 영역 | `ring-4 ring-green-500/50` |

### 구현 상세

**파일**: `BattleScreen.tsx:824-838`

```typescript
const getDropZoneHighlight = (zone: 'enemy' | 'player') => {
  if (!dragState.isDragging || !dragState.card) return '';

  const effectiveTargetType = dragState.card.targetType
    || (dragState.card.type === 'attack' ? 'enemy' : 'self');

  const isValidTarget =
    (effectiveTargetType === 'enemy' && zone === 'enemy') ||
    (effectiveTargetType === 'self' && zone === 'player');

  if (!isValidTarget) return '';

  return 'ring-4 ring-green-500/50';
};
```

### 적용 위치

```tsx
{/* 플레이어 영역 */}
<div ref={playerZoneRef} className={getDropZoneHighlight('player')}>
  <CharacterCard ... />
</div>

{/* 적 영역 */}
<div ref={enemyZoneRef} className={getDropZoneHighlight('enemy')}>
  <EnemyCard ... />
</div>
```

---

## 카드 경계 감지 (card-boundary-detection)

> 카드 영역 내/외부를 판별하여 프리뷰 트리거 조건으로 사용

### 개요

| 상태 | 프리뷰 |
|------|--------|
| 카드 클릭 + 홀드 (카드 내부) | 없음 |
| 카드 외부로 드래그 | 표시 |
| 다시 카드 내부로 이동 | 해제 |

### 구현 상세

#### 1. DragState에 cardRect 추가

**파일**: `useDrag.ts:4-12`

```typescript
interface DragState {
  isDragging: boolean;
  card: Card | null;
  cardIndex: number;
  startPosition: { x: number; y: number };
  position: { x: number; y: number };
  currentZone: DropZone;
  cardRect: DOMRect | null;  // 드래그 시작한 카드의 영역
}
```

#### 2. startDrag에서 cardRect 저장

**파일**: `useDrag.ts:43-58`

```typescript
const startDrag = useCallback((card: Card, index: number, e: React.MouseEvent, cardRect?: DOMRect) => {
  setDragState({
    isDragging: true,
    card,
    cardIndex: index,
    startPosition: { x: startX, y: startY },
    position: { x: e.clientX, y: e.clientY },
    currentZone: null,
    cardRect: cardRect || null,  // 카드 영역 저장
  });
}, []);
```

#### 3. 카드 외부 판별

**파일**: `BattleScreen.tsx:682-690`

```typescript
if (dragState.cardRect) {
  const { left, right, top, bottom } = dragState.cardRect;
  const { x, y } = dragState.position;
  const isInsideCard = x >= left && x <= right && y >= top && y <= bottom;
  if (isInsideCard) {
    return 0;  // 카드 내부면 프리뷰 없음
  }
}
```

---

## 프리뷰 해제 애니메이션 (preview-exit-animation)

> 프리뷰 해제 시 역재생되는 듯한 부드러운 애니메이션

### 개요

| 요소 | 나타날 때 | 사라질 때 |
|------|-----------|-----------|
| +X 표시 | opacity 0→1, y 5→0, scale 0.8→1 | opacity 1→0, y 0→-5, scale 1→0.8 |
| 방패 원 | cyan으로 전환 (0.15s) | blue/gray로 복귀 (0.15s) |

### 구현 상세

#### 1. AnimatePresence 적용

**파일**: `CharacterCard.tsx:88-101`

```tsx
<AnimatePresence>
  {previewBlock > 0 && (
    <motion.div
      key="preview-block"
      initial={{ opacity: 0, y: 5, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className="absolute -top-5 left-1/2 -translate-x-1/2 text-cyan-400 font-bold text-sm"
    >
      +{previewBlock}
    </motion.div>
  )}
</AnimatePresence>
```

#### 2. 방패 원 색상 애니메이션

**파일**: `CharacterCard.tsx:102-108`

```tsx
<motion.div
  animate={{
    backgroundColor: previewBlock > 0 ? '#0891b2' : block > 0 ? '#2563eb' : '#374151',
    borderColor: previewBlock > 0 ? '#22d3ee' : block > 0 ? '#60a5fa' : '#4b5563',
  }}
  transition={{ duration: 0.15 }}
  ...
>
```

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `dev/proto/src/components/screens/BattleScreen.tsx` | 프리뷰 계산 (데미지/블록), 드롭 존 하이라이트 |
| `dev/proto/src/hooks/useDrag.ts` | 드래그 상태, cardRect 관리 |
| `dev/proto/src/components/common/HPBar.tsx` | 데미지 프리뷰 UI |
| `dev/proto/src/components/battle/EnemyCard.tsx` | previewDamage prop 전달 |
| `dev/proto/src/components/battle/CharacterCard.tsx` | 블록 프리뷰 UI, 해제 애니메이션 |

---

## 다음 작업 제안

- [ ] 버프/디버프 프리뷰
- [ ] 카드 효과 툴팁
