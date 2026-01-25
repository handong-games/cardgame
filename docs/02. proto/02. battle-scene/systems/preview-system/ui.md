# 프리뷰 UI

## 개요

프리뷰 효과의 시각적 표현 스펙

---

## 데미지 프리뷰

### HP바 표시

| 요소 | 스타일 |
|------|--------|
| 프리뷰 영역 | 주황색 (`bg-orange-500`) |
| 투명도 | 40% (`opacity-40`) |
| HP 텍스트 | 예상 HP로 변경 (흰색 유지) |

### 데미지 숫자

| 요소 | 스타일 |
|------|--------|
| 위치 | HP바 위 |
| 형식 | "-8" |
| 색상 | 주황색 (`text-orange-400`) |

### 프리뷰 영역 계산

```
afterDamageHp = max(0, current - previewDamage)
afterDamagePercentage = (afterDamageHp / max) * 100
previewPercentage = hpPercentage - afterDamagePercentage
```

---

## 블록 프리뷰

### 방패 원 색상

| 상태 | 배경색 | 테두리색 |
|------|--------|----------|
| 기본 (0 방어력) | `#374151` (gray-700) | `#4b5563` (gray-600) |
| 방어력 있음 | `#2563eb` (blue-600) | `#60a5fa` (blue-400) |
| 프리뷰 | `#0891b2` (cyan-600) | `#22d3ee` (cyan-400) |

### +X 표시

| 요소 | 스타일 |
|------|--------|
| 위치 | 방패 원 위 (`-top-5`) |
| 형식 | "+5" |
| 색상 | 시안 (`text-cyan-400`) |
| 정렬 | 중앙 (`left-1/2 -translate-x-1/2`) |

### 방패 숫자

```
표시값 = 현재 방어력 + 프리뷰 방어력
```

---

## 힐 프리뷰

### HP바 표시

| 요소 | 스타일 |
|------|--------|
| 프리뷰 영역 | 녹색 (`bg-green-500`) |
| 투명도 | 40% (`opacity-40`) |
| HP 텍스트 | 예상 HP로 변경 |

### +X 표시

| 요소 | 스타일 |
|------|--------|
| 위치 | HP바 위 |
| 형식 | "+10" |
| 색상 | 녹색 (`text-green-400`) |

### 프리뷰 영역 계산

```
afterHealHp = min(max, current + healAmount)
healPercentage = ((afterHealHp - current) / max) * 100
```

---

## 드롭 존 하이라이트

### 유효 드롭 대상

| 스킬/카드 타입 | 유효 영역 |
|----------------|-----------|
| 공격 (`targetType: 'enemy'`) | 적 영역 |
| 방어/힐 (`targetType: 'self'`) | 플레이어 영역 |

### 하이라이트 스타일

```
ring-4 ring-green-500/50
```

---

## 관련 문서

- [프리뷰 시스템](./system.md) - 계산 로직
- [프리뷰 애니메이션](./animation.md) - 전환 효과
