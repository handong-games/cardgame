# 프리뷰 애니메이션

## 개요

프리뷰 나타남/사라짐 전환 애니메이션

---

## 숫자 표시 애니메이션

### 데미지/힐 숫자

| 상태 | opacity | y |
|------|---------|---|
| 초기 (나타남) | 0 | 5px |
| 활성 | 1 | 0 |
| 종료 (사라짐) | 0 | 5px |

```typescript
initial={{ opacity: 0, y: 5 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 5 }}
```

### 블록 +X 표시

| 상태 | opacity | y | scale |
|------|---------|---|-------|
| 초기 | 0 | 5px | 0.8 |
| 활성 | 1 | 0 | 1 |
| 종료 | 0 | -5px | 0.8 |

```typescript
initial={{ opacity: 0, y: 5, scale: 0.8 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -5, scale: 0.8 }}
```

---

## 색상 전환 애니메이션

### 방패 원

| 속성 | 지속 시간 |
|------|-----------|
| backgroundColor | 0.15s |
| borderColor | 0.15s |

```typescript
transition={{ duration: 0.15 }}
```

### HP바 프리뷰 영역

즉시 전환 (애니메이션 없음)

---

## 전환 타이밍

| 요소 | 나타남 | 사라짐 |
|------|--------|--------|
| 숫자 표시 | 0.15s ease-out | 0.15s ease-in |
| 방패 색상 | 0.15s | 0.15s |
| 프리뷰 영역 | 즉시 | 즉시 |

---

## AnimatePresence 사용

```tsx
<AnimatePresence>
  {previewValue > 0 && (
    <motion.div
      key="preview-indicator"
      initial={{ ... }}
      animate={{ ... }}
      exit={{ ... }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

---

## 관련 문서

- [프리뷰 시스템](./system.md) - 상태 전환 조건
- [프리뷰 UI](./ui.md) - 시각적 스타일
- [배틀씬 애니메이션](../../animation.md) - 전체 애니메이션 가이드
