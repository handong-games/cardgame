import { useEffect, useRef, useState } from 'react';
import { SkillSlot } from '../common/SkillSlot';
import type { Skill, SkillState, Player, Enemy, PreviewEffects, CoinTossResult, LootItem, BattleState } from '../../types';
import { calculatePreviewEffects } from '../../utils/skillSystem';

interface SkillPanelProps {
  skills: Skill[];
  skillStates: SkillState[];
  lastTossResults: CoinTossResult[];  // coins 대체
  isPlayerTurn: boolean;
  player: Player;
  enemy?: Enemy | null;
  hoveredSkill: Skill | null;
  loots?: LootItem[];
  battleState?: BattleState;
  onUseSkill: (skillId: string) => void;
  onSkillHover: (skill: Skill | null) => void;
  // 드래그 관련 props
  onSkillDragStart?: (skill: Skill, e: React.MouseEvent, rect: DOMRect) => void;
  draggingSkillId?: string | null;
  onReorderSkill?: (sourceSkillId: string, targetSkillId: string) => void;
}

export function SkillPanel({
  skills,
  skillStates,
  lastTossResults,
  isPlayerTurn,
  player,
  enemy,
  hoveredSkill,
  loots = [],
  battleState,
  onUseSkill,
  onSkillHover,
  onSkillDragStart,
  draggingSkillId,
  onReorderSkill,
}: SkillPanelProps) {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderDragId, setReorderDragId] = useState<string | null>(null);
  const longPressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const beginReorderPress = (skillId: string) => {
    if (!onReorderSkill || skills.length < 2 || !isReorderMode) return;
    clearLongPressTimer();

    longPressTimerRef.current = window.setTimeout(() => {
      setReorderDragId(skillId);
      longPressTimerRef.current = null;
    }, 450);
  };

  const finishReorderPress = () => {
    clearLongPressTimer();
    setReorderDragId(null);
  };

  const moveReorderTarget = (targetSkillId: string) => {
    if (!onReorderSkill || !reorderDragId || reorderDragId === targetSkillId) return;
    onReorderSkill(reorderDragId, targetSkillId);
  };

  // 호버된 스킬의 프리뷰 효과 계산
  const getPreviewEffects = (skill: Skill): PreviewEffects | undefined => {
    if (hoveredSkill?.id !== skill.id) return undefined;
    return calculatePreviewEffects(player, skill, enemy, battleState);
  };

  return (
    <div className="relative flex flex-col items-center gap-2 px-4">
      {skills.length > 1 && onReorderSkill && (
        <button
          type="button"
          title={isReorderMode ? '스킬 배치 편집 종료' : '스킬 배치 편집'}
          onClick={() => {
            clearLongPressTimer();
            setReorderDragId(null);
            setIsReorderMode(value => !value);
          }}
          className={`absolute -right-4 -top-8 z-40 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-black transition-colors ${isReorderMode ? 'border-[#F0E8D8]/70 bg-[#D8C8E8]/35 text-[#F0E8D8] shadow-[0_0_16px_rgba(216,200,232,0.35)]' : 'border-[#F0E8D8]/30 bg-[#16161C]/80 text-[#F0E8D8]/80 hover:border-[#D8C8E8]/70 hover:text-[#F0E8D8]'}`}
        >
          {isReorderMode ? '✓' : '✎'}
        </button>
      )}
      <div className="flex items-center justify-center gap-3">
      {skills.map((skill) => {
        const skillState = skillStates.find(s => s.skillId === skill.id);
        const isHovered = hoveredSkill?.id === skill.id;
        const costReduction = loots.some((loot) => loot.lootKey === 'swift_boots') && (skillState?.usedThisTurn ?? 0) === 0 ? 1 : 0;

        return (
          <div
            key={skill.id}
            className={`transition-all duration-150 ${isReorderMode ? 'touch-none' : ''}`}
            style={{
              zIndex: isHovered ? 30 : 1,
            }}
            onPointerDown={() => beginReorderPress(skill.id)}
            onPointerEnter={() => moveReorderTarget(skill.id)}
            onPointerUp={finishReorderPress}
            onPointerCancel={finishReorderPress}
            onPointerLeave={clearLongPressTimer}
          >
            <SkillSlot
              skill={skill}
              skillState={skillState}
              lastTossResults={lastTossResults}
              isPlayerTurn={isPlayerTurn}
              previewEffects={getPreviewEffects(skill)}
              onUse={onUseSkill}
              onHover={onSkillHover}
              onDragStart={onSkillDragStart}
              isDragging={draggingSkillId === skill.id}
              costReduction={costReduction}
              isReorderMode={isReorderMode}
              isReorderDragging={reorderDragId === skill.id}
            />
          </div>
        );
      })}

      {skills.length === 0 && (
        <div className="text-slate-500 text-sm py-4">
          스킬이 없습니다
        </div>
      )}
      </div>
    </div>
  );
}
