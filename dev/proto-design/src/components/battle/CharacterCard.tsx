import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { ActiveBuff } from '../../types';
import { HPBar } from '../common/HPBar';
import { getBuffDefinition } from '../../utils/buffSystem';
import {
  getScaledPlayerAttack,
  getScaledHitReact,
  getScaledShieldShake,
  getScaledBlockNumber,
  getScaledCombatTiming,
} from '../../animations';
import characterFrame from '@assets/frames/frame-player.png';
import cardNameplate from '@assets/frames/card-nameplate.png';
import warriorCharacter from '@assets/characters/CLS_W_warrior.png';
import shieldIcon from '@assets/icons/shield-icon.png';

const CHARACTER_IMAGES: Record<string, { src: string; position: 'top' | 'center' | 'bottom' }> = {
  '전사': { src: warriorCharacter, position: 'top' },
  '팔라딘': { src: warriorCharacter, position: 'top' },
};

interface CharacterCardProps {
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  attack?: number;
  emoji: string;
  isAttacking?: boolean;
  isHit?: boolean;
  isShieldHit?: boolean;
  previewBlock?: number;
  previewHeal?: number;
  previewSelfDamage?: number;
  activeBuffs?: ActiveBuff[];
}

export function CharacterCard({
  name,
  hp,
  maxHp,
  block,
  emoji,
  isAttacking = false,
  isHit = false,
  isShieldHit = false,
  previewBlock = 0,
  previewHeal = 0,
  previewSelfDamage = 0,
  activeBuffs = [],
}: CharacterCardProps) {
  const cardControls = useAnimationControls();
  const shieldControls = useAnimationControls();
  const blockNumberControls = useAnimationControls();
  const prevBlock = useRef(block);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const characterData = CHARACTER_IMAGES[name];
  const characterImage = characterData?.src;

  useEffect(() => {
    if (isAttacking) {
      cardControls.start(getScaledPlayerAttack());
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
    if (isShieldHit && prevBlock.current > 0) {
      const t = getScaledCombatTiming();
      const hitDelay = (t.PEEK_DURATION + t.HIT_DURATION) * 1000;
      const timer = setTimeout(() => {
        shieldControls.start(getScaledShieldShake());
        blockNumberControls.start(getScaledBlockNumber());
      }, hitDelay);
      prevBlock.current = block;
      return () => clearTimeout(timer);
    }
    prevBlock.current = block;
  }, [isShieldHit, block, shieldControls, blockNumberControls]);

  return (
    <motion.div
      className="flex flex-col items-center relative"
      animate={cardControls}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-full top-0 mr-3 z-30 pointer-events-none"
          >
            <div className="bg-dark-surface/95 border border-dark-graphite rounded-lg px-4 py-3 shadow-lg min-w-[160px]">
              <div className="font-bold text-moon-light text-sm mb-2">{name}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-moon-light/60">HP</span>
                  <span className="text-effect-attack font-bold">{hp} / {maxHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moon-light/60">방어도</span>
                  <span className="text-effect-defense font-bold">{block}</span>
                </div>
                {activeBuffs.length > 0 && (
                  <>
                    <div className="border-t border-dark-graphite/50 my-1.5" />
                    {activeBuffs.map((buff) => {
                      const def = getBuffDefinition(buff.buffId);
                      return (
                        <div key={buff.buffId} className="flex justify-between">
                          <span className="text-sun-gold">{def?.name ?? buff.buffId}</span>
                          <span className="text-moon-light font-bold">
                            {buff.stacks > 1 ? `×${buff.stacks}` : ''}
                            {typeof buff.remainingDuration === 'number' ? ` (${buff.remainingDuration}턴)` : ''}
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
      <div className="mb-0.5 px-1" style={{ width: 'var(--character-card-width)' }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl border" style={{ background: 'linear-gradient(to bottom, rgba(240,232,216,0.94), rgba(232,220,210,0.82))', borderColor: 'rgba(106,80,128,0.16)', boxShadow: '0 8px 16px rgba(58,48,64,0.14)' }}>
          <motion.div
            className="relative flex-shrink-0"
            animate={shieldControls}
          >
            <AnimatePresence>
              {previewBlock > 0 && (
                <motion.div
                  key="preview-block"
                  initial={{ opacity: 0, y: 5, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-effect-defense font-bold text-xs whitespace-nowrap"
                >
                  +{previewBlock}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              animate={{
                backgroundColor: previewBlock > 0 ? '#A0B8D4' : block > 0 ? '#A0B8D4' : '#F0E8D8',
                borderColor: previewBlock > 0 ? '#A0B8D4' : block > 0 ? '#A0B8D4' : '#D8C8E8',
              }}
              transition={{ duration: 0.15 }}
              className="card-shield rounded-full border-2 flex items-center justify-center font-bold shadow-coin"
              style={{ color: block > 0 || previewBlock > 0 ? '#FFFFFF' : '#3A3040' }}
            >
              {block > 0 || previewBlock > 0 ? (
                <motion.span animate={blockNumberControls}>
                  {previewBlock > 0 ? block + previewBlock : block}
                </motion.span>
              ) : (
                <img src={shieldIcon} alt="방어" className="w-3.5 h-3.5 object-contain" />
              )}
            </motion.div>
          </motion.div>

          <div className="flex-1">
            <HPBar
              current={hp}
              max={maxHp}
              color="red"
              previewHeal={previewHeal}
              previewSelfDamage={previewSelfDamage}
            />
          </div>
        </div>
      </div>
      <div className="character-card relative" style={{ filter: 'drop-shadow(0 4px 8px rgba(58,48,64,0.3))', marginTop: '-2px' }}>
        <img
          src={characterFrame}
          alt="카드 프레임"
          className="absolute inset-0 w-full h-full object-cover rounded-[inherit]"
        />
        <div className="absolute bottom-[3.6%] left-1/2 z-10 w-[88%] -translate-x-1/2 pointer-events-none">
          <img src={cardNameplate} alt="이름판" className="w-full h-auto object-contain drop-shadow-[0_3px_6px_rgba(88,64,52,0.2)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {characterImage && !imageError ? (
            <img
              src={characterImage}
              alt={name}
              className="w-[72%] h-[58%] object-contain -translate-y-[2%]"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="card-emoji">{emoji}</span>
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
          {previewBlock > 0 && (
            <motion.div
              className="absolute inset-0 bg-blue-400/15 rounded-[inherit] pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
          {previewHeal > 0 && (
            <motion.div
              className="absolute inset-0 bg-emerald-400/15 rounded-[inherit] pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <div className="absolute bottom-[5.5%] left-1/2 flex h-[10%] w-[56%] -translate-x-1/2 items-center justify-center pointer-events-none z-20 px-[6%]">
          <span className="block max-w-full truncate text-center text-[12px] font-semibold tracking-[0.04em]" style={{ color: '#6B4E3D', fontFamily: 'Georgia, "Times New Roman", serif' }}>{name}</span>
        </div>
      </div>
    </motion.div>
  );
}
