import { useState, useCallback, useEffect } from 'react';
import type { Card, DropZone } from '../types';

interface DragState {
  isDragging: boolean;
  card: Card | null;
  cardIndex: number;
  startPosition: { x: number; y: number };  // 드래그 시작 위치
  position: { x: number; y: number };
  currentZone: DropZone;  // 현재 호버 중인 드롭 존
  cardRect: DOMRect | null;  // 드래그 시작한 카드의 영역
}

interface DropZoneRefs {
  enemy: React.RefObject<HTMLDivElement | null>;
  battlefield: React.RefObject<HTMLDivElement | null>;
  hand: React.RefObject<HTMLDivElement | null>;
  player: React.RefObject<HTMLDivElement | null>;
}

interface UseDragReturn {
  dragState: DragState;
  startDrag: (card: Card, index: number, e: React.MouseEvent, cardRect?: DOMRect) => void;
  cancelDrag: () => void;
  registerDropZones: (refs: DropZoneRefs) => void;
}

const initialDragState: DragState = {
  isDragging: false,
  card: null,
  cardIndex: -1,
  startPosition: { x: 0, y: 0 },
  position: { x: 0, y: 0 },
  currentZone: null,
  cardRect: null,
};

export function useDrag(onDrop: (card: Card, zone: DropZone) => void): UseDragReturn {
  const [dragState, setDragState] = useState<DragState>(initialDragState);
  const [dropZoneRefs, setDropZoneRefs] = useState<DropZoneRefs | null>(null);

  // 드래그 시작
  const startDrag = useCallback((card: Card, index: number, e: React.MouseEvent, cardRect?: DOMRect) => {
    e.preventDefault();
    // 카드 상단 중앙 위치 계산 (cardRect가 있으면 사용, 없으면 마우스 위치)
    const startX = cardRect ? cardRect.left + cardRect.width / 2 : e.clientX;
    const startY = cardRect ? cardRect.top : e.clientY;

    setDragState({
      isDragging: true,
      card,
      cardIndex: index,
      startPosition: { x: startX, y: startY },
      position: { x: e.clientX, y: e.clientY },
      currentZone: null,
      cardRect: cardRect || null,
    });
  }, []);

  // 드래그 취소
  const cancelDrag = useCallback(() => {
    setDragState(initialDragState);
  }, []);

  // 드롭 존 등록
  const registerDropZones = useCallback((refs: DropZoneRefs) => {
    setDropZoneRefs(refs);
  }, []);

  // 드롭 존 감지
  const detectDropZone = useCallback((x: number, y: number): DropZone => {
    if (!dropZoneRefs) return null;

    const enemyRect = dropZoneRefs.enemy.current?.getBoundingClientRect();
    const playerRect = dropZoneRefs.player.current?.getBoundingClientRect();
    const battleRect = dropZoneRefs.battlefield.current?.getBoundingClientRect();
    const handRect = dropZoneRefs.hand.current?.getBoundingClientRect();

    const isInRect = (rect?: DOMRect) => {
      if (!rect) return false;
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    if (isInRect(enemyRect)) return 'enemy';
    if (isInRect(playerRect)) return 'player';
    if (isInRect(handRect)) return 'hand';
    if (isInRect(battleRect)) return 'battlefield';
    return null;
  }, [dropZoneRefs]);

  // 마우스 이벤트 리스너
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const zone = detectDropZone(e.clientX, e.clientY);
      setDragState(prev => ({
        ...prev,
        position: { x: e.clientX, y: e.clientY },
        currentZone: zone,
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      const zone = detectDropZone(e.clientX, e.clientY);

      // [DEBUG] 드롭 디버깅
      console.log('[useDrag] mouseUp:', {
        zone,
        card: dragState.card?.name,
        dropZoneRefs: !!dropZoneRefs,
        enemyRef: !!dropZoneRefs?.enemy.current,
        battlefieldRef: !!dropZoneRefs?.battlefield.current,
      });

      if (dragState.card && zone && zone !== 'hand') {
        onDrop(dragState.card, zone);
      }

      setDragState(initialDragState);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, dragState.card, detectDropZone, onDrop]);

  return {
    dragState,
    startDrag,
    cancelDrag,
    registerDropZones,
  };
}
