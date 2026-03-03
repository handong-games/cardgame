import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Skill, SkillState, PreviewEffects, CoinTossResult } from '../../types';
import { SkillTooltip } from './SkillTooltip';
import { getSkillCosts } from '../../utils/skillSystem';
import { calculateCoinValues } from '../../utils/coinToss';
import skillAttackImg from '@assets/skills/W_BAS_01_basic-attack.png';
import skillAttack2Img from '@assets/skills/W_ATK_01_heavy-attack.png';
import skillDefenseImg from '@assets/skills/W_BAS_02_basic-defense.png';
import skillDefense2Img from '@assets/skills/W_DEF_01_defense-up.png';
import skillFightingSpiritImg from '@assets/skills/W_BAS_03_fighting-spirit.png';
import skillDesperateStrikeImg from '@assets/skills/W_ATK_02_desperate-strike.png';
import frameSkillsImg from '@assets/frames/skill-frame.png';

const SKILL_IMAGES: Record<string, string> = {
  basic_strike: skillAttackImg,
  fighting_spirit: skillFightingSpiritImg,
  combo_strike: skillAttack2Img,
  cleave: skillAttack2Img,
  weakening_strike: skillAttack2Img,
  weakening_blow: skillAttack2Img,
  charge_attack: skillAttack2Img,
  vulnerable_strike: skillAttack2Img,
  desperate_strike: skillDesperateStrikeImg,
  focus: skillAttack2Img,
  defense: skillDefenseImg,
  regenerative_defense: skillDefense2Img,
  weakening_defense: skillDefense2Img,
  desperate_shield: skillDefense2Img,
};

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
              src={frameSkillsImg}
              alt="skill frame"
              className="absolute inset-0 w-full h-full object-contain rounded-xl"
            />
            <img
              src={SKILL_IMAGES[skill.skillKey]}
              alt={skill.name}
              className="absolute inset-0 w-3/4 h-3/4 m-auto object-contain"
            />
            {/* 이미지 스킬 이름 라벨 */}
            <div className="absolute bottom-1 left-0 right-0 text-center">
              <span className="text-[10px] text-gray-200 bg-dark-surface/80 px-1.5 py-0.5 rounded font-medium truncate inline-block max-w-full">
                {skill.name}
              </span>
            </div>
          </div>
        ) : (
          <>
            <span className="text-4xl">{skill.icon}</span>
            <span className="text-sm text-gray-200 mt-1 truncate max-w-full px-1 font-medium">
              {skill.name}
            </span>
          </>
        )}

        {costs.heads > 0 && costs.tails === 0 && (
          <div className={`
            absolute -top-2.5 -right-2.5
            w-9 h-9 rounded-full
            flex items-center justify-center
            text-sm font-extrabold border-2
            shadow-coin
            ${canAffordHeads 
              ? 'bg-gradient-to-br from-sun-gold to-sun-orange text-ink-brown border-sun-bright' 
              : 'bg-effect-attack text-white border-red-300'}
          `}>
            ☀{costs.heads}
          </div>
        )}

        {costs.tails > 0 && costs.heads === 0 && (
          <div className={`
            absolute -top-2.5 -left-2.5
            w-9 h-9 rounded-full
            flex items-center justify-center
            text-sm font-extrabold border-2
            shadow-coin
            ${canAffordTails 
              ? 'bg-gradient-to-br from-moon-silver to-moon-twilight text-white border-moon-light' 
              : 'bg-effect-attack text-white border-red-300'}
          `}>
            🌙{costs.tails}
          </div>
        )}

        {costs.heads > 0 && costs.tails > 0 && (
          <div className={`
            absolute -top-2.5 left-1/2 -translate-x-1/2
            px-2.5 py-1 rounded-full
            text-sm font-bold border
            flex items-center gap-1.5
            ${canAfford 
              ? 'bg-gradient-to-r from-sun-gold via-coin-gold to-moon-silver text-ink-brown border-coin-gold' 
              : 'bg-effect-attack text-white border-red-300'}
          `}>
            <span>☀{costs.heads}</span>
            <span>🌙{costs.tails}</span>
          </div>
        )}

        {isOnCooldown && (
          <div className="absolute inset-0 bg-dark-surface/85 rounded-lg flex flex-col items-center justify-center gap-0.5">
            <span className="text-lg">🕐</span>
            <span className="text-gray-300 text-sm font-bold">
              {skillState!.cooldownRemaining}턴
            </span>
          </div>
        )}

        {isMaxUsed && !isOnCooldown && (
          <div className="absolute inset-0 bg-dark-surface/80 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs font-bold">사용 완료</span>
          </div>
        )}

        {usageText && !isOnCooldown && !isMaxUsed && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-bold bg-dark-graphite/90 text-gray-200 border border-dark-graphite">
            {usageText}
          </div>
        )}
      </motion.button>

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
