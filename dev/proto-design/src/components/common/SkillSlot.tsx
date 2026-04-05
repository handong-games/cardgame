import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Skill, SkillState, PreviewEffects, CoinTossResult } from '../../types';
import { SkillTooltip } from './SkillTooltip';
import { getSkillCosts } from '../../utils/skillSystem';
import { calculateCoinValues } from '../../utils/coinToss';
import frameSkillsImg from '@assets/frames/skill-frame.png';
import attackFrameImg from '@assets/frames/skill-frame-attack.png';
import defenseFrameImg from '@assets/frames/skill-frame-defense.png';
import buffFrameImg from '@assets/frames/skill-frame-buff.png';
import { SKILL_IMAGES } from '../../data/skillImages';

function getSkillFrameImage(skill: Skill): string {
  const allEffects = [
    ...skill.effects,
    ...(skill.conditionalEffects?.map((entry) => entry.effect) ?? []),
  ];

  const hasDamage = allEffects.some((effect) => effect.type === 'damage');
  const hasBlock = allEffects.some((effect) => effect.type === 'block');
  const hasBuffLikeEffect = allEffects.some((effect) => ['heal', 'draw', 'buff', 'debuff', 'coin_control'].includes(effect.type));

  if (hasDamage) return attackFrameImg;
  if (hasBlock) return defenseFrameImg;
  if (hasBuffLikeEffect) return buffFrameImg;
  return frameSkillsImg;
}

interface SkillSlotProps {
  skill: Skill;
  skillState?: SkillState;
  lastTossResults: CoinTossResult[];
  isPlayerTurn: boolean;
  previewEffects?: PreviewEffects;
  onUse: (skillId: string) => void;
  onHover?: (skill: Skill | null) => void;
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

  const costs = getSkillCosts(skill);
  const available = calculateCoinValues(lastTossResults);

  const hasTossed = lastTossResults.length > 0;
  const canAffordHeads = available.heads >= costs.heads;
  const canAffordTails = available.tails >= costs.tails;
  const canAfford = hasTossed && canAffordHeads && canAffordTails;
  const isOnCooldown = skillState && skillState.cooldownRemaining > 0;
  const isMaxUsed = skill.maxUsePerTurn > 0 && skillState && skillState.usedThisTurn >= skill.maxUsePerTurn;
  const canUse = isPlayerTurn && canAfford && !isOnCooldown && !isMaxUsed;

  const usageText = skill.maxUsePerTurn > 0
    ? `${skillState?.usedThisTurn ?? 0}/${skill.maxUsePerTurn}`
    : null;

  const isEnemyTarget = skill.targetType === 'enemy';
  const hasImage = !!SKILL_IMAGES[skill.skillKey];
  const skillFrameImg = getSkillFrameImage(skill);

  const handleClick = () => {
    if (isEnemyTarget) return;
    if (canUse) {
      onUse(skill.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEnemyTarget || !canUse || !onDragStart) return;

    const rect = slotRef.current?.getBoundingClientRect();
    if (rect) {
      onDragStart(skill, e, rect);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
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
          w-28 h-32 rounded-xl
          transition-all duration-150
          ${hasImage
            ? `border-0 bg-transparent ${canUse ? (isEnemyTarget ? 'cursor-grab' : 'cursor-pointer') : 'cursor-not-allowed opacity-60'}`
            : `border-2 ${canUse
                ? `skill-slot-coin ${isEnemyTarget ? 'cursor-grab' : 'cursor-pointer'}`
                : 'bg-dark-deep/50 border-dark-graphite/50 cursor-not-allowed opacity-60'
              }`
          }
          ${isDragging ? 'opacity-50 ring-2 ring-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : ''}
        `}
        animate={{
          scale: isHovered && canUse && !isDragging ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        whileTap={canUse && !isEnemyTarget ? { scale: 0.95 } : {}}
      >
        {hasImage ? (
          <div className="relative w-full h-full">
            <img
              src={skillFrameImg}
              alt="skill frame"
              className="absolute inset-0 w-full h-full object-contain rounded-xl"
            />
            <img
              src={SKILL_IMAGES[skill.skillKey]}
              alt={skill.name}
              className="absolute inset-0 w-3/4 h-3/4 m-auto object-contain"
            />
          </div>
         ) : (
          <>
            <span className="text-4xl">{skill.icon}</span>
          </>
        )}

        {(costs.heads > 0 || costs.tails > 0) && (
          <div className="absolute -top-2 -right-2 flex flex-col gap-0.5 items-end z-10">
            {costs.heads > 0 && (
              <div className={`
                flex items-center gap-0.5
                pl-1 pr-1.5 py-0.5 rounded-full
                text-xs font-extrabold border-2
                shadow-coin leading-none
                ${canAffordHeads
                  ? 'bg-gradient-to-br from-sun-gold to-sun-orange text-ink-brown border-sun-bright'
                  : 'bg-effect-attack text-white border-red-300'}
              `}>
                <span className="text-sm">☀</span>
                <span>{costs.heads}</span>
              </div>
            )}
            {costs.tails > 0 && (
              <div className={`
                flex items-center gap-0.5
                pl-1 pr-1.5 py-0.5 rounded-full
                text-xs font-extrabold border-2
                shadow-coin leading-none
                ${canAffordTails
                  ? 'bg-gradient-to-br from-moon-silver to-moon-twilight text-white border-moon-light'
                  : 'bg-effect-attack text-white border-red-300'}
              `}>
                <span className="text-sm">🌙</span>
                <span>{costs.tails}</span>
              </div>
            )}
          </div>
        )}

        {isOnCooldown && (
          <div className="absolute inset-0 rounded-lg flex flex-col items-center justify-center gap-0.5" style={{ backgroundColor: 'rgba(240,232,216,0.9)' }}>
            <span className="text-lg">🕐</span>
            <span className="text-sm font-bold" style={{ color: '#3A3040' }}>
              {skillState!.cooldownRemaining}턴
            </span>
          </div>
        )}

        {isMaxUsed && !isOnCooldown && (
          <div className="absolute inset-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(240,232,216,0.85)' }}>
            <span className="text-xs font-bold" style={{ color: '#6A6070' }}>사용 완료</span>
          </div>
        )}

        {usageText && !isOnCooldown && !isMaxUsed && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-bold border"
            style={{ backgroundColor: 'rgba(58,48,64,0.8)', color: '#F0E8D8', borderColor: 'rgba(58,48,64,0.5)' }}
          >
            {usageText}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isHovered && (
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
