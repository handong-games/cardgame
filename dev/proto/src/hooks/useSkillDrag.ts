import { useState, useCallback, useEffect } from 'react';
import type { Skill } from '../types';

interface SkillDragState {
  isDragging: boolean;
  skill: Skill | null;
  startPosition: { x: number; y: number };
  position: { x: number; y: number };
  isOverEnemy: boolean;
  slotRect: DOMRect | null;
}

interface UseSkillDragReturn {
  dragState: SkillDragState;
  startDrag: (skill: Skill, e: React.MouseEvent, slotRect?: DOMRect) => void;
  cancelDrag: () => void;
  registerEnemyZone: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

const initialDragState: SkillDragState = {
  isDragging: false,
  skill: null,
  startPosition: { x: 0, y: 0 },
  position: { x: 0, y: 0 },
  isOverEnemy: false,
  slotRect: null,
};

export function useSkillDrag(
  onDropOnEnemy: (skill: Skill) => void
): UseSkillDragReturn {
  const [dragState, setDragState] = useState<SkillDragState>(initialDragState);
  const [enemyZoneRef, setEnemyZoneRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null);

  // 드래그 시작
  const startDrag = useCallback((skill: Skill, e: React.MouseEvent, slotRect?: DOMRect) => {
    // enemy 타겟 스킬만 드래그 가능
    if (skill.targetType !== 'enemy') return;

    e.preventDefault();

    // 시작 위치는 슬롯 중앙 상단
    const startX = slotRect ? slotRect.left + slotRect.width / 2 : e.clientX;
    const startY = slotRect ? slotRect.top : e.clientY;

    setDragState({
      isDragging: true,
      skill,
      startPosition: { x: startX, y: startY },
      position: { x: e.clientX, y: e.clientY },
      isOverEnemy: false,
      slotRect: slotRect || null,
    });
  }, []);

  // 드래그 취소
  const cancelDrag = useCallback(() => {
    setDragState(initialDragState);
  }, []);

  // 적 영역 등록
  const registerEnemyZone = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    setEnemyZoneRef(ref);
  }, []);

  // 적 영역 충돌 감지
  const isOverEnemyZone = useCallback((x: number, y: number): boolean => {
    if (!enemyZoneRef?.current) return false;

    const rect = enemyZoneRef.current.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }, [enemyZoneRef]);

  // 마우스 이벤트 리스너
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const overEnemy = isOverEnemyZone(e.clientX, e.clientY);
      setDragState(prev => ({
        ...prev,
        position: { x: e.clientX, y: e.clientY },
        isOverEnemy: overEnemy,
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      const overEnemy = isOverEnemyZone(e.clientX, e.clientY);

      // 적 영역 위에서 드롭 시 스킬 사용
      if (dragState.skill && overEnemy) {
        onDropOnEnemy(dragState.skill);
      }

      setDragState(initialDragState);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, dragState.skill, isOverEnemyZone, onDropOnEnemy]);

  return {
    dragState,
    startDrag,
    cancelDrag,
    registerEnemyZone,
  };
}
