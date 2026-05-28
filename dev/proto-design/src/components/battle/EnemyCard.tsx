import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Enemy } from '../../types';
import { HPBar } from '../common/HPBar';
import {
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
import monsterWolf from '@assets/monsters/MON_F06_wolf.png';
import monsterRottenTree from '@assets/monsters/MON_F07_rotten-tree.png';
import bossAncientGroveLord from '@assets/monsters/BOSS_F01_ancient-grove-lord.png';
import cardNameplate from '@assets/frames/card-nameplate.png';
import monsterFrameT1 from '@assets/frames/frame-t1.png';
import monsterFrameT2 from '@assets/frames/frame-t2.png';
import monsterFrameT3 from '@assets/frames/frame-t3.png';
import intentAttackIcon from '@assets/icons/intent-attack.png';
import intentDefenseIcon from '@assets/icons/intent-defense.png';
import intentBuffIcon from '@assets/icons/intent-buff.png';
import intentBadgeAttackImg from '@assets/icons/intent-badge-attack.svg';
import intentBadgeDefenseImg from '@assets/icons/intent-badge-defense.svg';
import intentBadgeBuffImg from '@assets/icons/intent-badge-buff.svg';
import intentBadgeDebuffImg from '@assets/icons/intent-badge-debuff.svg';
import shieldIcon from '@assets/icons/shield-icon.png';
import badgePoison from '@assets/badges/badge-poison.png';
import badgeSpore from '@assets/badges/badge-spore.png';
import badgeThorns from '@assets/badges/badge-thorns.png';
import badgeHardening from '@assets/badges/badge-hardening.png';
import badgeEvasion from '@assets/badges/badge-evasion.png';
import badgeVulnerable from '@assets/badges/badge-vulnerable.png';
import badgeWeak from '@assets/badges/badge-weak.png';
import badgeStrength from '@assets/badges/badge-strength.png';
import badgeRootBind from '@assets/badges/badge-root-bind.png';

// gameplan 8체 매핑 (MON_F01~F07 + BOSS_F01)
// 프레임 티어: R1~3 T1(기본), R4~5 T2(정예), R6~7 T3(후반), R8 T3(보스)
const MONSTER_IMAGES: Record<string, { src: string; frame?: string }> = {
  '고블린': { src: monsterGoblin },                                                  // MON_F01 R1 T1
  '독거미': { src: monsterPoisonSpider },                                            // MON_F02 R2-3 T1
  '버섯 기생체': { src: monsterSporeParasite },                                       // MON_F03 R2-3 T1
  '가시 덩굴': { src: monsterThornVine, frame: monsterFrameT2 },                     // MON_F04 R4-5 T2
  '골렘': { src: monsterGolem, frame: monsterFrameT2 },                              // MON_F05 R4-5 T2
  '늑대': { src: monsterWolf, frame: monsterFrameT2 },                               // MON_F06 R6-7 T2
  '썩은 나무': { src: monsterRottenTree, frame: monsterFrameT3 },                    // MON_F07 R6-7 T3
  '고대 수목군주': { src: bossAncientGroveLord, frame: monsterFrameT3 },              // BOSS_F01 R8 T3
};

function EnemyAttackEffect() {
  return (
    <motion.div
      className="pointer-events-none absolute -left-16 top-[31%] z-30 h-24 w-36"
      initial={{ opacity: 0, x: 28, scale: 0.86 }}
      animate={{ opacity: [0, 1, 0], x: [28, -18, -54], scale: [0.86, 1.08, 0.96] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.34, ease: 'easeOut', times: [0, 0.48, 1] }}
    >
      {[0, 1, 2].map((line) => (
        <motion.div
          key={line}
          className="absolute right-1/2 h-3 rounded-full"
          initial={{ scaleX: 0.4 }}
          animate={{ scaleX: [0.4, 1, 0.72] }}
          transition={{ duration: 0.3, delay: line * 0.025, ease: 'easeOut' }}
          style={{
            top: `${22 + line * 18}%`,
            width: `${86 - line * 10}%`,
            rotate: '13deg',
            background: 'linear-gradient(270deg, rgba(255,255,255,0), rgba(240,232,216,0.9), rgba(196,85,85,0.68), rgba(255,255,255,0))',
            boxShadow: '0 0 12px rgba(240,232,216,0.48), 0 0 18px rgba(196,85,85,0.26)',
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </motion.div>
  );
}

function EnemyHitEffect({ delay }: { delay: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[inherit]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ delay, duration: 0.36, ease: 'easeOut', times: [0, 0.35, 1] }}
    >
      <div className="absolute inset-0 bg-red-500/24" />
      <motion.div
        className="absolute left-[-24%] top-[44%] h-5 w-[154%] rounded-full"
        initial={{ x: 46, scaleX: 0.55 }}
        animate={{ x: -42, scaleX: [0.55, 1, 0.75] }}
        transition={{ delay, duration: 0.34, ease: 'easeOut' }}
        style={{
          rotate: '18deg',
          background: 'linear-gradient(270deg, rgba(255,255,255,0), rgba(255,238,220,0.9), rgba(201,168,108,0.74), rgba(255,255,255,0))',
          boxShadow: '0 0 14px rgba(255,238,220,0.45)',
          mixBlendMode: 'screen',
        }}
      />
      <motion.div
        className="absolute left-[18%] top-[22%] h-[56%] w-[64%] rounded-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.44, 0], scale: [0.5, 1.08, 1.26] }}
        transition={{ delay: delay + 0.04, duration: 0.32, ease: 'easeOut' }}
        style={{ background: 'radial-gradient(circle, rgba(255,238,220,0.55), rgba(201,168,108,0.18) 42%, transparent 72%)' }}
      />
    </motion.div>
  );
}

interface EnemyCardProps {
  enemy: Enemy;
  isAttacking?: boolean;
  isHit?: boolean;
  previewDamage?: number;
  isTargeted?: boolean;
  isBoss?: boolean;
}

interface MonsterCardFaceProps {
  enemyName: string;
  isElite?: boolean;
  isBoss?: boolean;
  className?: string;
  nameClassName?: string;
}

export function MonsterCardFace({
  enemyName,
  isElite = false,
  isBoss = false,
  className = '',
  nameClassName = '',
}: MonsterCardFaceProps) {
  const [imageError, setImageError] = useState(false);
  const baseName = enemyName.replace(/ \(엘리트\)$/, '');
  const monsterData = MONSTER_IMAGES[baseName] ?? MONSTER_IMAGES[enemyName];
  const monsterImage = monsterData?.src;
  const monsterFrame = monsterData?.frame ?? monsterFrameT1;

  return (
    <div className={`enemy-card relative h-full w-full transition-shadow duration-200 ${className}`} style={{ filter: 'drop-shadow(0 4px 8px rgba(58,48,64,0.3))', marginTop: '-2px' }}>
      <img
        src={monsterFrame}
        alt={monsterData?.frame ? '정예 프레임' : '몬스터 프레임'}
        className="absolute inset-0 h-full w-full object-cover rounded-[inherit]"
      />
      <div className="absolute bottom-[-2.8%] left-1/2 z-10 w-[88%] -translate-x-1/2 pointer-events-none">
        <img src={cardNameplate} alt="이름판" className="w-full h-auto object-contain" />
      </div>
      {(isBoss || isElite) && (
        <div className="absolute top-[13%] right-[6%] z-20">
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
            alt={enemyName}
            className="h-[58%] w-[72%] object-contain -translate-y-[2%]"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="card-emoji">👾</span>
        )}
      </div>
      <div className={`absolute bottom-[-0.9%] left-1/2 z-20 flex h-[10%] w-[56%] -translate-x-1/2 items-center justify-center pointer-events-none px-[6%] ${nameClassName}`}>
        <span className="block max-w-full truncate text-center text-[16px] font-semibold tracking-[0.04em]" style={{ color: '#6B4E3D', fontFamily: 'Georgia, "Times New Roman", serif' }}>{baseName}</span>
      </div>
    </div>
  );
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
  const [isCardHovered, setIsCardHovered] = useState(false);

  const isElite = enemy.name.includes('(엘리트)');
  const baseName = enemy.name.replace(/ \(엘리트\)$/, '');
  const hitEffectDelay = (() => {
    const t = getScaledCombatTiming();
    return t.PEEK_DURATION + t.HIT_DURATION;
  })();

  const intentConfig: Record<string, { icon: string; iconImg?: string; badgeImg: string; label: string; text: string }> = {
    attack: { icon: '⚔️', iconImg: intentAttackIcon, badgeImg: intentBadgeAttackImg, label: '공격', text: 'text-red-200' },
    defend: { icon: '🛡️', iconImg: intentDefenseIcon, badgeImg: intentBadgeDefenseImg, label: '방어', text: 'text-sky-100' },
    buff: { icon: '✨', iconImg: intentBuffIcon, badgeImg: intentBadgeBuffImg, label: '강화', text: 'text-amber-100' },
    debuff: { icon: '💢', iconImg: intentBuffIcon, badgeImg: intentBadgeDebuffImg, label: '디버프', text: 'text-fuchsia-100' },
  };

  const currentIntent = intentConfig[enemy.intent.type] ?? intentConfig.attack;

  const debuffIconImages: Record<string, string> = {
    bind: badgeRootBind,
    evasion: badgeEvasion,
    hardening: badgeHardening,
    poison: badgePoison,
    root_bind: badgeRootBind,
    spore: badgeSpore,
    strength: badgeStrength,
    thorns: badgeThorns,
    vulnerable: badgeVulnerable,
    weak: badgeWeak,
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
      <AnimatePresence>
        {isAttacking && <EnemyAttackEffect />}
      </AnimatePresence>
      <motion.div
        className="relative z-20 -mb-1 inline-flex h-12 min-w-[152px] items-center self-center justify-center whitespace-nowrap px-4 text-sm"
        style={{
          width: 'auto',
          backgroundImage: `url(${currentIntent.badgeImg})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          boxShadow: '0 10px 22px rgba(58,48,64,0.24), 0 0 16px rgba(212,165,116,0.12)',
        }}
        animate={enemy.intent.type === 'attack' ? {
          scale: [1, 1.05, 1],
          boxShadow: ['0 10px 22px rgba(58,48,64,0.24)', '0 10px 26px rgba(196,85,85,0.45)', '0 10px 22px rgba(58,48,64,0.24)'],
        } : {}}
        transition={enemy.intent.type === 'attack' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {currentIntent.iconImg ? (
          <img src={currentIntent.iconImg} alt={currentIntent.label} className="mr-1.5 inline-block h-5 w-5 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
        ) : (
          <span className="mr-1">{currentIntent.icon}</span>
        )}
        <span className={`font-bold tracking-[0.04em] ${currentIntent.text}`}>{currentIntent.label}</span>
        <span className={`ml-1.5 text-base font-black ${currentIntent.text}`}>{enemy.intent.value}</span>
      </motion.div>

      <div className="mb-0.5 px-1" style={{ width: 'var(--enemy-card-width)' }}>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border" style={{ background: 'linear-gradient(to bottom, rgba(240,232,216,0.94), rgba(232,220,210,0.82))', borderColor: 'rgba(106,80,128,0.16)', boxShadow: '0 8px 16px rgba(58,48,64,0.14)' }}>
          <motion.div
            className="relative flex-shrink-0"
            animate={shieldControls}
          >
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-coin"
              style={{
                backgroundColor: enemy.block > 0 ? '#A0B8D4' : '#F0E8D8',
                borderColor: enemy.block > 0 ? '#A0B8D4' : '#D8C8E8',
                color: enemy.block > 0 ? '#FFFFFF' : '#3A3040',
              }}
            >
              {enemy.block > 0 ? (
                <motion.span animate={blockNumberControls}>{enemy.block}</motion.span>
              ) : (
                <img src={shieldIcon} alt="방어" className="w-3.5 h-3.5 object-contain" />
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
        <MonsterCardFace enemyName={enemy.name} isElite={isElite} isBoss={isBoss} />
        <AnimatePresence>
          {isHit && (
            <EnemyHitEffect delay={hitEffectDelay} />
          )}
        </AnimatePresence>
      </motion.div>

      {enemy.activeDebuffs && enemy.activeDebuffs.length > 0 && (
        <div className="mt-1 flex w-[var(--enemy-card-width)] flex-wrap justify-start gap-1.5">
          {enemy.activeDebuffs.map((debuff, index) => {
            const debuffDef = getBuffDefinition(debuff.debuffId);
            const debuffName = debuffDef?.name ?? debuff.debuffId;
            const badgeImage = debuffIconImages[debuff.debuffId];

            return (
              <div
                key={`${debuff.debuffId}-${index}`}
                className="relative"
                onMouseEnter={() => setHoveredDebuff(debuff.debuffId)}
                onMouseLeave={() => setHoveredDebuff(null)}
              >
                <div className="flex h-7 w-7 cursor-help items-center justify-center overflow-hidden rounded-[4px]">
                  {badgeImage ? (
                    <img src={badgeImage} alt={debuffName} className="h-full w-full object-contain" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#181320] text-xs font-bold text-[#D8B84C]">
                      {debuffName.charAt(0)}
                    </span>
                  )}
                </div>

                {debuff.stacks > 1 && (
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#3A3040] text-[10px] font-bold text-[#F0E8D8]">
                    {debuff.stacks}
                  </div>
                )}

                {typeof debuff.remainingDuration === 'number' && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#181320] text-[10px] font-bold text-[#D8B84C]">
                    {debuff.remainingDuration}
                  </div>
                )}

                {hoveredDebuff === debuff.debuffId && (
                  <div className="absolute bottom-full left-1/2 z-10 mb-2 w-52 -translate-x-1/2 rounded-lg px-3 py-2 text-xs shadow-lg" style={{ backgroundColor: 'rgba(58,48,64,0.95)', border: '1px solid rgba(246,231,214,0.18)', color: '#FFF5E6' }}>
                    <div className="mb-1 font-bold text-[#C9A86C]">{debuffName}</div>
                    <div className="whitespace-normal text-[#E8DCD2]">{debuffDef?.description ?? '현재 전투 상태 변화입니다.'}</div>
                    {debuff.stacks > 1 && (
                      <div className="mt-1 text-[#D8B84C]">스택: {debuff.stacks}</div>
                    )}
                    {typeof debuff.remainingDuration === 'number' && (
                      <div className="text-[#B9AFB5]">남은 턴: {debuff.remainingDuration}</div>
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
