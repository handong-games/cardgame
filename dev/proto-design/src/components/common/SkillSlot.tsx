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
import sunCoinImg from '@assets/coins/sun-coin.png';
import moonCoinImg from '@assets/coins/moon-coin.png';
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

function formatConditionBadge(skill: Skill) {
  const conditionEntry = skill.conditionalEffects?.[0];

  if (!conditionEntry) return null;

  switch (conditionEntry.condition) {
    case 'last_attacked_target':
      return '연계';
    case 'all_tails':
      return '달 전용';
    case 'coins_above':
      return `해 ${conditionEntry.conditionValue}+`;
    case 'hp_below':
      return `HP ${conditionEntry.conditionValue}%↓`;
    case 'enemy_hp_below':
      return `적 HP ${conditionEntry.conditionValue}%↓`;
    case 'buff_active':
      return '버프 필요';
    default:
      return '조건부';
  }
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
  costReduction?: number;
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
  costReduction = 0,
}: SkillSlotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const slotRef = useRef<HTMLButtonElement>(null);

  const baseCosts = getSkillCosts(skill);
  const costs = costReduction > 0
    ? {
        heads: baseCosts.heads > 0 ? Math.max(0, baseCosts.heads - costReduction) : baseCosts.heads,
        tails: baseCosts.heads > 0 ? baseCosts.tails : Math.max(0, baseCosts.tails - costReduction),
      }
    : baseCosts;
  const available = calculateCoinValues(lastTossResults);

  const hasTossed = lastTossResults.length > 0;
  const canAffordHeads = available.heads >= costs.heads;
  const canAffordTails = available.tails >= costs.tails;
  const canAfford = hasTossed && canAffordHeads && canAffordTails;
  const isOnCooldown = skillState && skillState.cooldownRemaining > 0;
  const isMaxUsed = skill.maxUsePerTurn > 0 && skillState && skillState.usedThisTurn >= skill.maxUsePerTurn;
  const canUse = isPlayerTurn && canAfford && !isOnCooldown && !isMaxUsed;
  const conditionBadge = formatConditionBadge(skill);
  const isConditionActive = !!previewEffects && previewEffects.conditionsMet.length > 0;

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
          w-32 h-36 rounded-2xl
          transition-all duration-150
          ${hasImage
            ? `border-0 bg-transparent ${canUse ? (isEnemyTarget ? 'cursor-grab' : 'cursor-pointer') : 'cursor-not-allowed opacity-60'}`
            : `border-2 ${canUse
                ? `skill-slot-coin ${isEnemyTarget ? 'cursor-grab' : 'cursor-pointer'}`
                : 'bg-dark-deep/50 border-dark-graphite/50 cursor-not-allowed opacity-60'
              }`
          }
          ${canUse ? 'drop-shadow-[0_10px_18px_rgba(240,232,216,0.16)]' : ''}
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

        {(conditionBadge || costs.heads > 0 || costs.tails > 0) && (
          <div className="absolute -top-2.5 -right-2.5 flex flex-col gap-1 items-end z-10">
            {conditionBadge && (
              <div
                className="px-2 py-[3px] rounded-full text-[10px] font-bold tracking-[0.01em] border shadow-sm leading-none"
                style={{
                  background: isConditionActive
                    ? 'linear-gradient(180deg, rgba(216,200,232,0.96), rgba(232,208,216,0.96))'
                    : 'linear-gradient(180deg, rgba(240,232,216,0.96), rgba(228,218,204,0.94))',
                  color: isConditionActive ? '#3A3040' : '#6A6070',
                  borderColor: isConditionActive ? 'rgba(184,160,208,0.9)' : 'rgba(166,150,132,0.72)',
                  boxShadow: isConditionActive
                    ? '0 4px 10px rgba(184,160,208,0.2)'
                    : '0 4px 10px rgba(58,48,64,0.12)',
                }}
              >
                {conditionBadge}
              </div>
            )}
            {costs.heads > 0 && (
              <div
                className="flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-full text-xs font-extrabold border leading-none"
                style={canAffordHeads
                  ? {
                      background: 'linear-gradient(180deg, rgba(255,246,214,0.98), rgba(243,221,156,0.94))',
                      color: '#7A5610',
                      borderColor: 'rgba(201,168,108,0.92)',
                      boxShadow: '0 4px 10px rgba(201,168,108,0.24)',
                    }
                  : {
                      background: 'linear-gradient(180deg, rgba(177,92,92,0.96), rgba(144,67,67,0.96))',
                      color: '#FFF5EE',
                      borderColor: 'rgba(255,214,214,0.56)',
                      boxShadow: '0 4px 10px rgba(120,42,42,0.2)',
                    }}
              >
                <img src={sunCoinImg} alt="해 코인" className="w-3.5 h-3.5 object-contain" />
                <span>{costs.heads}</span>
              </div>
            )}
            {costs.tails > 0 && (
              <div
                className="flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-full text-xs font-extrabold border leading-none"
                style={canAffordTails
                  ? {
                      background: 'linear-gradient(180deg, rgba(234,229,245,0.98), rgba(186,178,214,0.95))',
                      color: '#4F4369',
                      borderColor: 'rgba(106,80,128,0.48)',
                      boxShadow: '0 4px 10px rgba(106,80,128,0.18)',
                    }
                  : {
                      background: 'linear-gradient(180deg, rgba(177,92,92,0.96), rgba(144,67,67,0.96))',
                      color: '#FFF5EE',
                      borderColor: 'rgba(255,214,214,0.56)',
                      boxShadow: '0 4px 10px rgba(120,42,42,0.2)',
                    }}
              >
                <img src={moonCoinImg} alt="달 코인" className="w-3.5 h-3.5 object-contain" />
                <span>{costs.tails}</span>
              </div>
            )}
          </div>
        )}

        {!canUse && !isOnCooldown && !isMaxUsed && (
          <div className="pointer-events-none absolute inset-2 rounded-xl border border-[#6A6070]/20 bg-[#16161C]/18" />
        )}

        {isOnCooldown && (
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-0.5" style={{ backgroundColor: 'rgba(240,232,216,0.9)' }}>
            <span className="text-lg">🕐</span>
            <span className="text-sm font-bold" style={{ color: '#3A3040' }}>
              {skillState!.cooldownRemaining}턴
            </span>
          </div>
        )}

        {isMaxUsed && !isOnCooldown && (
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(240,232,216,0.85)' }}>
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
