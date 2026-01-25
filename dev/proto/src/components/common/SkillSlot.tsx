import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Skill, SkillState, PreviewEffects, CoinTossResult } from '../../types';
import { SkillTooltip } from './SkillTooltip';
import { getSkillCosts } from '../../utils/skillSystem';
import { calculateCoinValues } from '../../utils/coinToss';

interface SkillSlotProps {
  skill: Skill;
  skillState?: SkillState;
  lastTossResults: CoinTossResult[];  // coins 대체
  isPlayerTurn: boolean;
  previewEffects?: PreviewEffects;
  onUse: (skillId: string) => void;
  onHover?: (skill: Skill | null) => void;
  // 드래그 관련 props
  onDragStart?: (skill: Skill, e: React.MouseEvent, rect: DOMRect) => void;
  isDragging?: boolean;
}

export function SkillSlot({
  skill,
  skillState,
  lastTossResults,
  isPlayerTurn,
  previewEffects,
  onUse,
  onHover,
  onDragStart,
  isDragging,
}: SkillSlotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const slotRef = useRef<HTMLButtonElement>(null);

  // 스킬 비용 계산
  const costs = getSkillCosts(skill);
  const available = calculateCoinValues(lastTossResults);

  // 사용 가능 여부 판단
  const canAffordHeads = available.heads >= costs.heads;
  const canAffordTails = available.tails >= costs.tails;
  const canAfford = canAffordHeads && canAffordTails;
  const isOnCooldown = skillState && skillState.cooldownRemaining > 0;
  const isMaxUsed = skill.maxUsePerTurn > 0 && skillState && skillState.usedThisTurn >= skill.maxUsePerTurn;
  const canUse = isPlayerTurn && canAfford && !isOnCooldown && !isMaxUsed;

  // 사용 횟수 표시
  const usageText = skill.maxUsePerTurn > 0
    ? `${skillState?.usedThisTurn ?? 0}/${skill.maxUsePerTurn}`
    : null;

  // enemy 타겟 스킬은 드래그로, self/none은 클릭으로 사용
  const isEnemyTarget = skill.targetType === 'enemy';

  const handleClick = () => {
    // enemy 타겟은 드래그로 사용하므로 클릭 무시
    if (isEnemyTarget) return;
    if (canUse) {
      onUse(skill.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // enemy 타겟 스킬만 드래그 시작
    if (!isEnemyTarget || !canUse || !onDragStart) return;

    const rect = slotRef.current?.getBoundingClientRect();
    if (rect) {
      onDragStart(skill, e, rect);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // 사용 가능한 스킬만 프리뷰 시스템 활성화
    if (canUse) {
      onHover?.(skill);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  return (
    <motion.div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        ref={slotRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        disabled={!canUse}
        className={`
          relative flex flex-col items-center justify-center
          w-16 h-20 rounded-lg border-2
          transition-colors duration-150
          ${canUse
            ? `bg-slate-700 border-amber-500 hover:bg-slate-600 hover:border-amber-400 ${isEnemyTarget ? 'cursor-grab' : 'cursor-pointer'}`
            : 'bg-slate-800 border-slate-600 cursor-not-allowed opacity-60'
          }
          ${isDragging ? 'opacity-50' : ''}
        `}
        animate={{
          scale: isHovered && canUse && !isDragging ? 1.2 : 1,
          y: isHovered && canUse && !isDragging ? -16 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        whileTap={canUse && !isEnemyTarget ? { scale: 0.95 } : {}}
      >
        {/* 스킬 아이콘 */}
        <span className="text-2xl">{skill.icon}</span>

        {/* 스킬 이름 */}
        <span className="text-xs text-white mt-1 truncate max-w-full px-1">
          {skill.name}
        </span>

        {/* 코인 비용 뱃지 */}
        {/* 앞면 코인 뱃지 */}
        {costs.heads > 0 && (
          <div className={`
            absolute -top-1 -right-1
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-xs font-bold
            ${canAffordHeads ? 'bg-amber-500 text-black' : 'bg-red-500 text-white'}
          `}>
            ↑{costs.heads}
          </div>
        )}

        {/* 뒷면 코인 뱃지 */}
        {costs.tails > 0 && (
          <div className={`
            absolute -top-1 -left-1
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-xs font-bold
            ${canAffordTails ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}
          `}>
            ↓{costs.tails}
          </div>
        )}

        {/* 앞면+뒷면 모두 필요한 경우 */}
        {costs.heads > 0 && costs.tails > 0 && (
          <div className="absolute -top-2 right-1/2 translate-x-1/2 bg-purple-500 text-white text-xs px-1 rounded">
            ↑{costs.heads} ↓{costs.tails}
          </div>
        )}

        {/* 쿨다운 오버레이 */}
        {isOnCooldown && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {skillState!.cooldownRemaining}
            </span>
          </div>
        )}

        {/* 사용 횟수 표시 */}
        {usageText && !isOnCooldown && (
          <div className={`
            absolute -bottom-1 left-1/2 -translate-x-1/2
            px-1 rounded text-xs
            ${isMaxUsed ? 'bg-red-500' : 'bg-slate-600'}
          `}>
            {usageText}
          </div>
        )}
      </motion.button>

      {/* 툴팁 - 사용 가능한 스킬만 표시 */}
      <AnimatePresence>
        {isHovered && canUse && (
          <SkillTooltip
            skill={skill}
            skillState={skillState}
            previewEffects={previewEffects}
            canAfford={canAfford}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
