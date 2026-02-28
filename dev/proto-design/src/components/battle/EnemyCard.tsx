import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Enemy } from '../../types';
import { HPBar } from '../common/HPBar';
import {
  enemyAttackAnimation,
  hitReactAnimation,
  shieldShakeAnimation,
  blockNumberAnimation,
  COMBAT_TIMING,
} from '../../animations';
import { getBuffDefinition } from '../../utils/buffSystem';
import monsterGoblin from '@assets/monsters/MON_F01_goblin.png';
import monsterWolfPack from '@assets/monsters/MON_F06_wolf-pack.png';
import monsterSporeParasite from '@assets/monsters/MON_F03_spore-parasite.png';
import monsterFrameT1 from '@assets/frames/frame-t1.png';
import monsterFrameT2 from '@assets/frames/frame-t2.png';

const MONSTER_IMAGES: Record<string, { src: string; frame?: string }> = {
  '고블린': { src: monsterGoblin },
  '늑대': { src: monsterWolfPack, frame: monsterFrameT2 },
  '오크 전사': { src: monsterGoblin },
  '석상 골렘': { src: monsterGoblin },
  '광전사 고블린': { src: monsterGoblin },
  '가시 덩쿨': { src: monsterSporeParasite },
  '이끼 늑대': { src: monsterWolfPack, frame: monsterFrameT2 },
  '버섯 기생체': { src: monsterSporeParasite },
  '안개 족제비': { src: monsterWolfPack, frame: monsterFrameT2 },
  '썩은 나무령': { src: monsterSporeParasite },
  '오크 주술사': { src: monsterGoblin, frame: monsterFrameT2 },
  '독 거미': { src: monsterSporeParasite, frame: monsterFrameT2 },
  '암살자': { src: monsterWolfPack, frame: monsterFrameT2 },
  '수호병': { src: monsterGoblin, frame: monsterFrameT2 },
  '광기의 마법사': { src: monsterSporeParasite, frame: monsterFrameT2 },
  '흑요 정령': { src: monsterGoblin, frame: monsterFrameT2 },
  '고목 수호자': { src: monsterSporeParasite, frame: monsterFrameT2 },
  '밤그늘 사슴': { src: monsterWolfPack, frame: monsterFrameT2 },
  '종자 수확자': { src: monsterSporeParasite, frame: monsterFrameT2 },
};

interface EnemyCardProps {
  enemy: Enemy;
  isAttacking?: boolean;
  isHit?: boolean;
  previewDamage?: number;
}

export function EnemyCard({
  enemy,
  isAttacking = false,
  isHit = false,
  previewDamage = 0,
}: EnemyCardProps) {
  const cardControls = useAnimationControls();
  const shieldControls = useAnimationControls();
  const blockNumberControls = useAnimationControls();
  const prevBlock = useRef(enemy.block);
  const [hoveredDebuff, setHoveredDebuff] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const monsterData = MONSTER_IMAGES[enemy.name];
  const monsterImage = monsterData?.src;
  const monsterFrame = monsterData?.frame ?? monsterFrameT1;

  const intentConfig: Record<string, { icon: string; label: string; bg: string; border: string; text: string }> = {
    attack: { icon: '⚔️', label: '공격', bg: 'bg-red-900/60', border: 'border-red-500/50', text: 'text-red-400' },
    defend: { icon: '🛡️', label: '방어', bg: 'bg-blue-900/60', border: 'border-blue-500/50', text: 'text-blue-400' },
    buff: { icon: '✨', label: '강화', bg: 'bg-amber-900/60', border: 'border-amber-500/50', text: 'text-amber-400' },
    debuff: { icon: '💢', label: '디버프', bg: 'bg-purple-900/60', border: 'border-purple-500/50', text: 'text-purple-400' },
  };

  const currentIntent = intentConfig[enemy.intent.type] ?? intentConfig.attack;

  const debuffIcons: Record<string, string> = {
    weak: '💢',
    vulnerable: '🎯',
  };

  useEffect(() => {
    if (isAttacking) {
      cardControls.start(enemyAttackAnimation);
    }
  }, [isAttacking, cardControls]);

  useEffect(() => {
    if (isHit) {
      const hitDelay = (COMBAT_TIMING.PEEK_DURATION + COMBAT_TIMING.HIT_DURATION) * 1000;
      const timer = setTimeout(() => {
        cardControls.start(hitReactAnimation);
      }, hitDelay);
      return () => clearTimeout(timer);
    }
  }, [isHit, cardControls]);

  useEffect(() => {
    if (prevBlock.current > 0 && enemy.block < prevBlock.current) {
      const hitDelay = (COMBAT_TIMING.PEEK_DURATION + COMBAT_TIMING.HIT_DURATION) * 1000;
      const timer = setTimeout(() => {
        shieldControls.start(shieldShakeAnimation);
        blockNumberControls.start(blockNumberAnimation);
      }, hitDelay);
      prevBlock.current = enemy.block;
      return () => clearTimeout(timer);
    }
    prevBlock.current = enemy.block;
  }, [enemy.block, shieldControls, blockNumberControls]);

  return (
    <motion.div
      className="flex flex-col items-center"
      animate={cardControls}
    >
      <motion.div
        className={`mb-2 px-3 py-1.5 rounded-lg text-xs border ${currentIntent.bg} ${currentIntent.border}`}
        animate={enemy.intent.type === 'attack' ? {
          scale: [1, 1.05, 1],
          boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 8px rgba(239,68,68,0.4)', '0 0 0px rgba(239,68,68,0)'],
        } : {}}
        transition={enemy.intent.type === 'attack' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        <span className="mr-1">{currentIntent.icon}</span>
        <span className={currentIntent.text}>{currentIntent.label}</span>
        <span className={`ml-1 font-bold ${currentIntent.text}`}>{enemy.intent.value}</span>
      </motion.div>

      <div className="enemy-card relative">
        <img
          src={monsterFrame}
          alt={monsterData?.frame ? '정예 프레임' : '몬스터 프레임'}
          className="absolute inset-0 w-full h-full object-cover rounded-[inherit]"
        />
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
      </div>

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
                  <span className="text-lg">{debuffIcons[debuff.debuffId] || '💀'}</span>
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
