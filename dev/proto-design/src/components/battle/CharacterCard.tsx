import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { HPBar } from '../common/HPBar';
import {
  COMBAT_TIMING,
  getScaledPlayerAttack,
  getScaledHitReact,
  getScaledShieldShake,
  getScaledBlockNumber,
  getScaledCombatTiming,
} from '../../animations';
import characterFrame from '@assets/frames/frame-player.png';
import warriorCharacter from '@assets/characters/CLS_W_warrior.png';

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
  isPlayer?: boolean;
  isAttacking?: boolean;
  isHit?: boolean;
  isShieldHit?: boolean;
  previewBlock?: number;
  previewHeal?: number;
  previewSelfDamage?: number;
}

export function CharacterCard({
  name,
  hp,
  maxHp,
  block,
  emoji,
  isPlayer = false,
  isAttacking = false,
  isHit = false,
  isShieldHit = false,
  previewBlock = 0,
  previewHeal = 0,
  previewSelfDamage = 0,
}: CharacterCardProps) {
  const cardControls = useAnimationControls();
  const shieldControls = useAnimationControls();
  const blockNumberControls = useAnimationControls();
  const prevBlock = useRef(block);
  const [imageError, setImageError] = useState(false);

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
      className="flex flex-col items-center"
      animate={cardControls}
    >
      <div className="character-card relative">
        <img
          src={characterFrame}
          alt="카드 프레임"
          className="absolute inset-0 w-full h-full object-cover rounded-[inherit]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {characterImage && !imageError ? (
            <img
              src={characterImage}
              alt={name}
              className="w-3/4 h-auto object-contain"
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
      </div>

      <div className="w-full px-1">
         <div className="flex items-center gap-2">
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
                backgroundColor: previewBlock > 0 ? '#87CEEB' : block > 0 ? '#6B7B8C' : '#2A2A32',
                borderColor: previewBlock > 0 ? '#87CEEB' : block > 0 ? '#C0C0C0' : '#4A4A55',
              }}
              transition={{ duration: 0.15 }}
              className="card-shield rounded-full border-2 flex items-center justify-center font-bold text-white shadow-coin"
            >
              {block > 0 || previewBlock > 0 ? (
                <motion.span animate={blockNumberControls}>
                  {previewBlock > 0 ? block + previewBlock : block}
                </motion.span>
              ) : (
                <span>🛡️</span>
              )}
            </motion.div>
          </motion.div>

          <div className="flex-1">
            <HPBar
              current={hp}
              max={maxHp}
              color={isPlayer ? 'green' : 'red'}
              previewHeal={previewHeal}
              previewSelfDamage={previewSelfDamage}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
