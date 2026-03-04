import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Enemy } from '../../types';
import { HPBar } from '../common/HPBar';
import {
  COMBAT_TIMING,
  getScaledEnemyAttack,
  getScaledHitReact,
  getScaledShieldShake,
  getScaledBlockNumber,
  getScaledCombatTiming,
} from '../../animations';
import { getBuffDefinition } from '../../utils/buffSystem';
import monsterGoblin from '@assets/monsters/MON_F01_goblin.png';
import monsterPoisonSpider from '@assets/monsters/MON_F02_poison-spider.png';
import monsterSporeParasite from '@assets/monsters/MON_F03_spore-parasite.png';
import monsterThornVine from '@assets/monsters/MON_F04_thorn-vine.png';
import monsterGolem from '@assets/monsters/MON_F05_golem.png';
import monsterWolfPack from '@assets/monsters/MON_F06_wolf-pack.png';
import monsterRottenTree from '@assets/monsters/MON_F07_rotten-tree.png';
import bossAncientGroveLord from '@assets/monsters/BOSS_F01_ancient-grove-lord.png';
import monsterFrameT1 from '@assets/frames/frame-t1.png';
import monsterFrameT2 from '@assets/frames/frame-t2.png';
import monsterFrameT3 from '@assets/frames/frame-t3.png';
import intentAttackIcon from '@assets/icons/intent-attack.png';
import intentDefenseIcon from '@assets/icons/intent-defense.png';
import intentBuffIcon from '@assets/icons/intent-buff.png';
import statusVulnerableIcon from '@assets/icons/status-vulnerable.png';
import statusStrengthIcon from '@assets/icons/status-strength.png';

// gameplan 8체 매핑 (MON_F01~F07 + BOSS_F01)
// 프레임 티어: R1~3 T1(기본), R4~5 T2(정예), R6~7 T3(후반), R8 T3(보스)
const MONSTER_IMAGES: Record<string, { src: string; frame?: string }> = {
  '고블린': { src: monsterGoblin },                                                  // MON_F01 R1 T1
  '독거미': { src: monsterPoisonSpider },                                            // MON_F02 R2-3 T1
  '버섯 기생체': { src: monsterSporeParasite },                                       // MON_F03 R2-3 T1
  '가시 덩굴': { src: monsterThornVine, frame: monsterFrameT2 },                     // MON_F04 R4-5 T2
  '골렘': { src: monsterGolem, frame: monsterFrameT2 },                              // MON_F05 R4-5 T2
  '늑대': { src: monsterWolfPack, frame: monsterFrameT3 },                           // MON_F06 R6-7 T3
  '썩은 나무': { src: monsterRottenTree, frame: monsterFrameT3 },                      // MON_F07 R6-7 T3
  '고대 수목군주': { src: bossAncientGroveLord, frame: monsterFrameT3 },              // BOSS_F01 R8 T3
};

interface EnemyCardProps {
  enemy: Enemy;
  isAttacking?: boolean;
  isHit?: boolean;
  previewDamage?: number;
  isTargeted?: boolean;
  isBoss?: boolean;
}

export function EnemyCard({
  enemy,
  isAttacking = false,
  isHit = false,
  previewDamage = 0,
  isTargeted = false,
  isBoss = false,
}: EnemyCardProps) {
  const cardControls = useAnimationControls();
  const shieldControls = useAnimationControls();
  const blockNumberControls = useAnimationControls();
  const prevBlock = useRef(enemy.block);
  const [hoveredDebuff, setHoveredDebuff] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const isElite = enemy.name.includes('(엘리트)');
  const baseName = enemy.name.replace(/ \(엘리트\)$/, '');
  const monsterData = MONSTER_IMAGES[baseName] ?? MONSTER_IMAGES[enemy.name];
  const monsterImage = monsterData?.src;
  const monsterFrame = monsterData?.frame ?? monsterFrameT1;

  const intentConfig: Record<string, { icon: string; iconImg?: string; label: string; bg: string; border: string; text: string }> = {
    attack: { icon: '⚔️', iconImg: intentAttackIcon, label: '공격', bg: 'bg-red-900/60', border: 'border-red-500/50', text: 'text-red-400' },
    defend: { icon: '🛡️', iconImg: intentDefenseIcon, label: '방어', bg: 'bg-blue-900/60', border: 'border-blue-500/50', text: 'text-blue-400' },
    buff: { icon: '✨', iconImg: intentBuffIcon, label: '강화', bg: 'bg-amber-900/60', border: 'border-amber-500/50', text: 'text-amber-400' },
    debuff: { icon: '💢', iconImg: intentBuffIcon, label: '디버프', bg: 'bg-purple-900/60', border: 'border-purple-500/50', text: 'text-purple-400' },
  };

  const currentIntent = intentConfig[enemy.intent.type] ?? intentConfig.attack;

  const debuffIcons: Record<string, string> = {
    weak: '💢',
    vulnerable: '🎯',
  };

  const debuffIconImages: Record<string, string> = {
    vulnerable: statusVulnerableIcon,
    strength: statusStrengthIcon,
  };

  useEffect(() => {
    if (isAttacking) {
      cardControls.start(getScaledEnemyAttack());
    }
  }, [isAttacking, cardControls]);

  useEffect(() => {
    if (isHit) {
      const t = getScaledCombatTiming();
      const hitDelay = (t.PEEK_DURATION + t.HIT_DURATION) * 1000;
      const timer = setTimeout(() => {
        cardControls.start(getScaledHitReact());
      }, hitDelay);
      return () => clearTimeout(timer);
    }
  }, [isHit, cardControls]);

  useEffect(() => {
    if (prevBlock.current > 0 && enemy.block < prevBlock.current) {
      const t = getScaledCombatTiming();
      const hitDelay = (t.PEEK_DURATION + t.HIT_DURATION) * 1000;
      const timer = setTimeout(() => {
        shieldControls.start(getScaledShieldShake());
        blockNumberControls.start(getScaledBlockNumber());
      }, hitDelay);
      prevBlock.current = enemy.block;
      return () => clearTimeout(timer);
    }
    prevBlock.current = enemy.block;
  }, [enemy.block, shieldControls, blockNumberControls]);

  const intentLabels: Record<string, string> = {
    attack: '공격',
    defend: '방어',
    buff: '강화',
    debuff: '디버프',
  };

  return (
    <motion.div
      className="flex flex-col items-center relative"
      animate={cardControls}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <AnimatePresence>
        {isCardHovered && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-3 z-30 pointer-events-none"
          >
            <div className="bg-dark-surface/95 border border-dark-graphite rounded-lg px-4 py-3 shadow-lg min-w-[170px]">
              <div className="font-bold text-moon-light text-sm mb-2">
                {baseName}
                {isElite && <span className="text-amber-400 ml-1 text-xs">(엘리트)</span>}
                {isBoss && <span className="text-red-400 ml-1 text-xs">(보스)</span>}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-moon-light/60">HP</span>
                  <span className="text-effect-attack font-bold">{enemy.hp} / {enemy.maxHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moon-light/60">방어도</span>
                  <span className="text-effect-defense font-bold">{enemy.block}</span>
                </div>
                <div className="border-t border-dark-graphite/50 my-1.5" />
                <div className="flex justify-between">
                  <span className="text-moon-light/60">다음 행동</span>
                  <span className={`font-bold ${currentIntent.text}`}>
                    {intentLabels[enemy.intent.type] ?? enemy.intent.type} {enemy.intent.value}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moon-light/60">소울 보상</span>
                  <span className="text-sun-gold font-bold">◆ {enemy.soulReward}</span>
                </div>
                {enemy.activeDebuffs && enemy.activeDebuffs.length > 0 && (
                  <>
                    <div className="border-t border-dark-graphite/50 my-1.5" />
                    {enemy.activeDebuffs.map((debuff) => {
                      const def = getBuffDefinition(debuff.debuffId);
                      return (
                        <div key={debuff.debuffId} className="flex justify-between">
                          <span className="text-effect-debuff">{def?.name ?? debuff.debuffId}</span>
                          <span className="text-moon-light font-bold">
                            {debuff.stacks > 1 ? `×${debuff.stacks}` : ''}
                            {typeof debuff.remainingDuration === 'number' ? ` (${debuff.remainingDuration}턴)` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className={`mb-2 px-3 py-1.5 rounded-lg text-xs border ${currentIntent.bg} ${currentIntent.border}`}
        animate={enemy.intent.type === 'attack' ? {
          scale: [1, 1.05, 1],
          boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 8px rgba(239,68,68,0.4)', '0 0 0px rgba(239,68,68,0)'],
        } : {}}
        transition={enemy.intent.type === 'attack' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {currentIntent.iconImg ? (
          <img src={currentIntent.iconImg} alt={currentIntent.label} className="inline-block w-4 h-4 mr-1 object-contain" />
        ) : (
          <span className="mr-1">{currentIntent.icon}</span>
        )}
        <span className={currentIntent.text}>{currentIntent.label}</span>
        <span className={`ml-1 font-bold ${currentIntent.text}`}>{enemy.intent.value}</span>
      </motion.div>

      <motion.div
        className="enemy-card relative transition-shadow duration-200"
        animate={{
          scale: isTargeted ? 1.05 : 1,
          boxShadow: isTargeted
            ? '0 0 20px rgba(239,68,68,0.6), 0 0 40px rgba(239,68,68,0.3)'
            : '0 0 0px rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isTargeted && (
          <div className="absolute inset-0 rounded-[inherit] border-2 border-red-400/70 z-10 pointer-events-none" />
        )}
        <img
          src={monsterFrame}
          alt={monsterData?.frame ? '정예 프레임' : '몬스터 프레임'}
          className="absolute inset-0 w-full h-full object-cover rounded-[inherit]"
        />
        {(isBoss || isElite) && (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10">
            <div
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border shadow-lg ${
                isBoss
                  ? 'bg-gradient-to-r from-red-900/90 to-red-800/90 border-red-500/70 text-red-200'
                  : 'bg-gradient-to-r from-amber-900/90 to-amber-800/90 border-amber-500/70 text-amber-200'
              }`}
            >
              {isBoss ? '보스' : '엘리트'}
            </div>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {monsterImage && !imageError ? (
            <img
              src={monsterImage}
              alt={enemy.name}
              className="w-3/4 h-auto object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="card-emoji">👾</span>
          )}
        </div>
        <AnimatePresence>
          {isHit && (
            <motion.div
              className="absolute inset-0 bg-red-500/30 rounded-[inherit] pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

       <div className="w-full px-1">
         <div className="flex items-center gap-1.5">
          <motion.div
            className="relative flex-shrink-0"
            animate={shieldControls}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-coin
                ${enemy.block > 0
                  ? 'bg-moon-twilight border-moon-silver text-white'
                  : 'bg-coin-dark-bronze border-moon-twilight text-moon-light'
                }`}
            >
              {enemy.block > 0 ? (
                <motion.span animate={blockNumberControls}>{enemy.block}</motion.span>
              ) : (
                <span className="text-xs">🛡️</span>
              )}
            </div>
          </motion.div>

          <div className="flex-1">
            <HPBar
              current={enemy.hp}
              max={enemy.maxHp}
              color="red"
              previewDamage={previewDamage}
            />
          </div>
        </div>
      </div>

      {enemy.activeDebuffs && enemy.activeDebuffs.length > 0 && (
        <div className="mt-2 flex gap-1 flex-wrap justify-center">
          {enemy.activeDebuffs.map((debuff, index) => {
            const debuffDef = getBuffDefinition(debuff.debuffId);
            if (!debuffDef) return null;

            return (
              <div
                key={`${debuff.debuffId}-${index}`}
                className="relative"
                onMouseEnter={() => setHoveredDebuff(debuff.debuffId)}
                onMouseLeave={() => setHoveredDebuff(null)}
              >
                <div className="w-10 h-10 rounded-full bg-effect-debuff/80 border-2 border-effect-debuff flex items-center justify-center cursor-help">
                  {debuffIconImages[debuff.debuffId] ? (
                    <img src={debuffIconImages[debuff.debuffId]} alt={debuffDef.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="text-lg">{debuffIcons[debuff.debuffId] || '💀'}</span>
                  )}
                </div>

                {debuff.stacks > 1 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-coin-dark-bronze border border-effect-attack rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {debuff.stacks}
                  </div>
                )}

                {typeof debuff.remainingDuration === 'number' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-coin-dark-bronze border border-sun-gold rounded-full flex items-center justify-center text-xs font-bold text-sun-gold">
                    {debuff.remainingDuration}
                  </div>
                )}

                {hoveredDebuff === debuff.debuffId && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-coin-dark-bronze border-2 border-effect-debuff rounded-lg text-sm whitespace-nowrap z-10 shadow-lg">
                    <div className="font-bold text-effect-debuff mb-1">{debuffDef.name}</div>
                    <div className="text-moon-light text-xs">{debuffDef.description}</div>
                    {debuff.stacks > 1 && (
                      <div className="text-sun-gold text-xs mt-1">스택: {debuff.stacks}</div>
                    )}
                    {typeof debuff.remainingDuration === 'number' && (
                      <div className="text-effect-defense text-xs">남은 턴: {debuff.remainingDuration}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
