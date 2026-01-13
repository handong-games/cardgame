import type { CardType, TargetType } from '../../types';

interface DragOverlayProps {
  startPosition: { x: number; y: number };
  position: { x: number; y: number };
  isDragging: boolean;
  cardType?: CardType;
  targetType?: TargetType;
  hasDamageEffect?: boolean;  // 데미지 효과 있는 카드 (플래그 기반)
}

export function DragOverlay({ startPosition, position, isDragging, cardType, targetType, hasDamageEffect }: DragOverlayProps) {
  // 화살표 표시 조건: 데미지 효과가 있거나, 공격 카드이거나, targetType이 enemy
  const showArrow = hasDamageEffect || cardType === 'attack' || targetType === 'enemy';

  if (!isDragging || !showArrow) return null;

  // 곡선 화살표를 위한 제어점 계산
  const midX = (startPosition.x + position.x) / 2;
  const midY = (startPosition.y + position.y) / 2;

  // 곡선의 휨 정도 (위쪽으로 휘도록)
  const distance = Math.sqrt(
    Math.pow(position.x - startPosition.x, 2) +
    Math.pow(position.y - startPosition.y, 2)
  );
  const curveOffset = Math.min(distance * 0.3, 100);

  // 제어점 (위쪽으로 휨)
  const controlX = midX;
  const controlY = midY - curveOffset;

  // 화살표 각도 계산 (끝점 방향)
  const angle = Math.atan2(position.y - controlY, position.x - controlX) * (180 / Math.PI);

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-40"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        {/* 화살표 머리 마커 */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 L 3 5 Z"
            fill="#fbbf24"
          />
        </marker>
        {/* 그라디언트 */}
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* 곡선 화살표 */}
      <path
        d={`M ${startPosition.x} ${startPosition.y} Q ${controlX} ${controlY} ${position.x} ${position.y}`}
        stroke="url(#arrowGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
      />

      {/* 시작점 원 */}
      <circle
        cx={startPosition.x}
        cy={startPosition.y}
        r="8"
        fill="#fbbf24"
        opacity="0.7"
      />

      {/* 끝점 원 (타겟 표시) */}
      <circle
        cx={position.x}
        cy={position.y}
        r="12"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle
        cx={position.x}
        cy={position.y}
        r="4"
        fill="#fbbf24"
        opacity="0.8"
      />
    </svg>
  );
}
