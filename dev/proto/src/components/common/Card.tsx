import { useRef } from 'react';
import type { Card as CardType } from '../../types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  onDragStart?: (e: React.MouseEvent, cardRect: DOMRect) => void;
  disabled?: boolean;
  isDragging?: boolean; // 이 카드가 드래그 중인지
}

export function Card({ card, onClick, onDragStart, disabled, isDragging }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // 타입별 배경색
  const typeColors = {
    attack: 'border-red-500 bg-red-900/80',
    skill: 'border-blue-500 bg-blue-900/80',
    power: 'border-yellow-500 bg-yellow-900/80',
    curse: 'border-purple-500 bg-purple-900/80',
  };

  // 타입별 대형 아이콘 (중앙 표시용)
  const typeIcons = {
    attack: '⚔️',
    skill: '✨',
    power: '⚡',
    curse: '💀',
  };

  // 타입별 소형 아이콘 (하단 표시용)
  const typeSmallIcons = {
    attack: '🗡️',
    skill: '🔮',
    power: '💫',
    curse: '☠️',
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    if (onDragStart && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onDragStart(e, rect);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={disabled ? undefined : onClick}
      onMouseDown={handleMouseDown}
      className={`
        relative w-40 h-40 rounded-xl border-2 p-2
        flex flex-col transition-all select-none group
        ${typeColors[card.type]}
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-grab active:cursor-grabbing'
        }
        ${isDragging
          ? 'scale-110 -translate-y-4 z-20'
          : 'hover:scale-110 hover:-translate-y-4 hover:z-20'
        }
      `}
    >
      {/* 에너지 비용 (왼쪽 상단) */}
      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg shadow-lg z-10">
        {card.cost}
      </div>

      {/* 네임 플레이트 (상단 중앙) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 px-3 py-1 rounded-full shadow-lg z-10">
        <span className="text-white text-xs font-bold whitespace-nowrap">{card.name}</span>
      </div>

      {/* 중앙 카드 이미지 */}
      <div className="flex-1 flex items-center justify-center pb-8">
        <img
          src="/images/card-character.png"
          alt={card.name}
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* 하단 정보 바: 타입 아이콘 + 수치 (중앙 정렬) */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2">
        <span className="text-[22px]">{typeSmallIcons[card.type]}</span>
        {card.damage && (
          <span className="text-[22px] font-bold text-red-300">
            {card.damage}
          </span>
        )}
        {card.block && (
          <span className="text-[22px] font-bold text-blue-300">
            {card.block}
          </span>
        )}
      </div>

      {/* 호버/드래그 시 말풍선 */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 bg-gray-800 rounded-lg p-3 shadow-lg transition-opacity pointer-events-none z-50 min-w-max ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {/* 말풍선 꼬리 */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800" />
        <div className="text-white font-bold text-center text-sm mb-1">
          {card.name}
        </div>
        <div className="text-gray-300 text-xs text-center leading-relaxed max-w-48">
          {card.description}
        </div>
      </div>
    </div>
  );
}
