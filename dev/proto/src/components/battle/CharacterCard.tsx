import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { HPBar } from '../common/HPBar';
import {
  playerAttackAnimation,
  hitReactAnimation,
  shieldShakeAnimation,
  blockNumberAnimation,
  COMBAT_TIMING,
} from '../../animations';

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
  previewBlock?: number;      // 프리뷰 방어력
  previewHeal?: number;       // 프리뷰 힐
  previewSelfDamage?: number; // 프리뷰 자해 데미지
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

  // 공격 애니메이션
  useEffect(() => {
    if (isAttacking) {
      cardControls.start(playerAttackAnimation);
    }
  }, [isAttacking, cardControls]);

  // 피격 애니메이션 (공격자가 도달하는 시점에 시작)
  useEffect(() => {
    if (isHit) {
      const hitDelay = (COMBAT_TIMING.PEEK_DURATION + COMBAT_TIMING.HIT_DURATION) * 1000;
      const timer = setTimeout(() => {
        cardControls.start(hitReactAnimation);
      }, hitDelay);
      return () => clearTimeout(timer);
    }
  }, [isHit, cardControls]);

  // 방패 흔들림 애니메이션 (공격자가 도달하는 시점에 시작)
  useEffect(() => {
    if (isShieldHit && prevBlock.current > 0) {
      const hitDelay = (COMBAT_TIMING.PEEK_DURATION + COMBAT_TIMING.HIT_DURATION) * 1000;
      const timer = setTimeout(() => {
        shieldControls.start(shieldShakeAnimation);
        blockNumberControls.start(blockNumberAnimation);
      }, hitDelay);
      prevBlock.current = block;
      return () => clearTimeout(timer);
    }
    prevBlock.current = block;
  }, [isShieldHit, block, shieldControls, blockNumberControls]);

  return (
    <motion.div
      className="w-48 flex flex-col"
      animate={cardControls}
    >
      {/* 상단: 방패 + HP 바 */}
      <div className="flex items-center gap-2 mb-1">
        {/* 방패 아이콘 + 방어력 수치 */}
        <motion.div
          className="relative flex-shrink-0"
          animate={shieldControls}
        >
          {/* 프리뷰 시 +X 표시 */}
          <AnimatePresence>
            {previewBlock > 0 && (
              <motion.div
                key="preview-block"
                initial={{ opacity: 0, y: 5, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-cyan-400 font-bold text-sm whitespace-nowrap"
              >
                +{previewBlock}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            animate={{
              backgroundColor: previewBlock > 0 ? '#0891b2' : block > 0 ? '#2563eb' : '#374151',
              borderColor: previewBlock > 0 ? '#22d3ee' : block > 0 ? '#60a5fa' : '#4b5563',
            }}
            transition={{ duration: 0.15 }}
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold text-white"
          >
            {block > 0 || previewBlock > 0 ? (
              <motion.span animate={blockNumberControls}>
                {previewBlock > 0 ? block + previewBlock : block}
              </motion.span>
            ) : (
              <span className="text-xl text-gray-400">🛡️</span>
            )}
          </motion.div>
          {/* 방어력이 있을 때 방패 아이콘 오버레이 */}
          {(block > 0 || previewBlock > 0) && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-xs">
              🛡️
            </div>
          )}
        </motion.div>

        {/* HP 바 */}
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

      {/* 카드 본체 */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 overflow-hidden">
        {/* 카드 이름 */}
        <div className="py-2 text-center text-white font-bold border-b border-gray-700 bg-gray-750">
          {name}
        </div>

        {/* 캐릭터 이미지 영역 */}
        <div className="flex items-center justify-center py-10 text-6xl bg-gray-850">
          {emoji}
        </div>
      </div>
    </motion.div>
  );
}
