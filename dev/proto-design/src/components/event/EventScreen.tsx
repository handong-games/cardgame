import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameButton } from '../ui/GameButton';
import { useAnimSpeed } from '../../hooks/useAnimSpeed';
import type { EventChoice, EventCategory } from '../../types';
import soulIcon from '@assets/icons/icon-soul.png';

const CATEGORY_COLORS: Record<EventCategory, { accent: string; border: string; bg: string; label: string }> = {
  A: { accent: 'text-[#6B9E78]', border: 'border-[#6B9E78]', bg: 'bg-[#6B9E78]/10', label: '관대한 이벤트' },
  B: { accent: 'text-[#8B7BB5]', border: 'border-[#8B7BB5]', bg: 'bg-[#8B7BB5]/10', label: '의외의 선물' },
  C: { accent: 'text-[#D4985A]', border: 'border-[#D4985A]', bg: 'bg-[#D4985A]/10', label: '유혹' },
  D: { accent: 'text-[#C45555]', border: 'border-[#C45555]', bg: 'bg-[#C45555]/10', label: '시련' },
};

function CoinFlipAnimation({ onComplete, speedMultiplier }: { onComplete: () => void; speedMultiplier: number }) {
  const [flipping, setFlipping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipping(false);
      onComplete();
    }, 1500 * speedMultiplier);
    return () => clearTimeout(timer);
  }, [onComplete, speedMultiplier]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        className="text-6xl"
        animate={flipping ? {
          rotateY: [0, 180, 360, 540, 720],
          scale: [1, 1.2, 1, 1.2, 1],
        } : {}}
        transition={{ duration: 1.5 * speedMultiplier, ease: 'easeInOut' }}
      >
        🪙
      </motion.span>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 * speedMultiplier }}
        className="text-gray-400 text-sm mt-4"
      >
        운명의 동전이 돌아간다...
      </motion.p>
    </motion.div>
  );
}

function ChoiceCard({
  choice,
  index,
  playerSouls,
  onSelect,
  disabled,
}: {
  choice: EventChoice;
  index: number;
  playerSouls: number;
  onSelect: () => void;
  disabled: boolean;
}) {
  const hasSoulCost = choice.outcomes.some(o =>
    o.effects.some(e => e.type === 'soul_cost')
  );
  const soulCostAmount = choice.outcomes
    .flatMap(o => o.effects)
    .find(e => e.type === 'soul_cost')?.value ?? 0;
  const canAfford = !hasSoulCost || playerSouls >= soulCostAmount;

  const hasProbability = choice.outcomes.length > 1;
  const successChance = hasProbability
    ? Math.round(choice.outcomes[0].chance * 100)
    : null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
      whileHover={!disabled && canAfford ? { scale: 1.02, x: 4 } : undefined}
      whileTap={!disabled && canAfford ? { scale: 0.98 } : undefined}
      onClick={!disabled && canAfford ? onSelect : undefined}
      disabled={disabled || !canAfford}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
        disabled || !canAfford
          ? 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed'
          : 'border-[#4A4A55] bg-[#2A2A32] hover:border-[#D4A574] hover:bg-[#2A2A32]/80 cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#FFF5E6] font-medium">{choice.label}</span>
        <div className="flex items-center gap-3">
          {hasProbability && successChance !== null && (
            <span className="text-xs text-[#D4A574] bg-[#D4A574]/10 px-2 py-0.5 rounded-full">
              {successChance}% 성공
            </span>
          )}
          {choice.costDescription && (
            <span className={`text-sm ${canAfford ? 'text-purple-400' : 'text-red-400'}`}>
              {choice.costDescription}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function EffectDisplay({ effects }: { effects: Array<{ type: string; value: number }> }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {effects.map((effect, i) => {
        let icon = '';
        let iconImg: string | null = null;
        let text = '';
        let color = '';

        switch (effect.type) {
          case 'heal':
            icon = '💚';
            text = `HP +${effect.value}`;
            color = 'text-green-400 bg-green-400/10';
            break;
          case 'damage':
            icon = '💔';
            text = `HP -${effect.value}`;
            color = 'text-red-400 bg-red-400/10';
            break;
          case 'soul_gain':
            iconImg = soulIcon;
            text = `소울 +${effect.value}`;
            color = 'text-purple-400 bg-purple-400/10';
            break;
          case 'soul_cost':
            iconImg = soulIcon;
            text = `소울 -${effect.value}`;
            color = 'text-red-400 bg-red-400/10';
            break;
          case 'info':
            icon = '📖';
            text = '정보 획득';
            color = 'text-blue-400 bg-blue-400/10';
            break;
          default:
            return null;
        }

        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}
          >
            {iconImg ? <img src={iconImg} alt="소울" className="w-4 h-4 object-contain" /> : icon} {text}
          </motion.span>
        );
      })}
    </div>
  );
}

export function EventScreen() {
  const { event: eventState, player, selectEventChoice, abandonEvent, closeEvent } = useGameStore();
  const speedM = useAnimSpeed();
  const [narrationComplete, setNarrationComplete] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const eventDef = eventState?.event;
  const phase = eventState?.phase ?? 'narration';
  const result = eventState?.result;

  const handleCoinFlipComplete = useCallback(() => {}, []);

  useEffect(() => {
    if (!eventDef || phase !== 'narration') return;

    setDisplayedText('');
    setNarrationComplete(false);

    const text = eventDef.narration;

    if (speedM <= 0.1) {
      setDisplayedText(text);
      setNarrationComplete(true);
      return;
    }

    let index = 0;
    const charsPerTick = speedM < 0.5 ? 8 : 3;
    const interval = setInterval(() => {
      index += charsPerTick;
      if (index >= text.length) {
        setDisplayedText(text);
        setNarrationComplete(true);
        clearInterval(interval);
      } else {
        setDisplayedText(text.slice(0, index));
      }
    }, 50 * speedM);

    return () => clearInterval(interval);
  }, [eventDef, phase, speedM]);

  useEffect(() => {
    if (narrationComplete && phase === 'narration') {
      const timer = setTimeout(() => {
        const currentEvent = useGameStore.getState().event;
        if (currentEvent?.phase === 'narration') {
          useGameStore.setState({
            event: { ...currentEvent, phase: 'choosing' },
          });
        }
      }, 800 * speedM);
      return () => clearTimeout(timer);
    }
  }, [narrationComplete, phase, speedM]);

  if (!eventState || !eventDef) return null;

  const categoryStyle = CATEGORY_COLORS[eventDef.category];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 어둡기 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-10"
      />

      {/* 이벤트 패널 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-20 mx-auto mt-16 w-full max-w-2xl bg-[#16161C]/95 border-2 border-[#4A4A55] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* E-1: 헤더 */}
        <div className={`flex items-center gap-4 px-8 py-6 border-b border-[#4A4A55]`}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`w-20 h-20 rounded-xl ${categoryStyle.bg} border-2 ${categoryStyle.border} flex items-center justify-center text-4xl shrink-0`}
          >
            {eventDef.emoji}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#FFF5E6]">{eventDef.name}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.accent} font-medium border ${categoryStyle.border}`}>
                {categoryStyle.label}
              </span>
            </div>
            {eventDef.category === 'C' || eventDef.category === 'D' ? (
              <p className="text-xs text-[#C45555] mt-1">⚠️ HP 리스크 있음</p>
            ) : (
              <p className="text-xs text-[#6B9E78] mt-1">✓ 안전</p>
            )}
          </div>
        </div>

        {/* E-2: 나레이션 */}
        <div className="px-8 py-6 border-b border-[#4A4A55]/50">
          <motion.p
            className="text-[#FFF5E6]/80 text-lg leading-relaxed italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            &ldquo;{displayedText}
            {!narrationComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                |
              </motion.span>
            )}
            {narrationComplete && '&rdquo;'}
          </motion.p>
        </div>

        {/* E-3: 선택지 또는 결과 */}
        <div className="px-8 py-6">
          <AnimatePresence mode="wait">
            {phase === 'choosing' && (
              <motion.div
                key="choices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-3"
              >
                {eventDef.choices.map((choice, index) => (
                  <ChoiceCard
                    key={choice.id}
                    choice={choice}
                    index={index}
                    playerSouls={player.souls}
                    onSelect={() => selectEventChoice(choice.id)}
                    disabled={false}
                  />
                ))}
              </motion.div>
            )}

            {phase === 'coin_flip' && (
              <motion.div
                key="coin_flip"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CoinFlipAnimation onComplete={handleCoinFlipComplete} speedMultiplier={speedM} />
              </motion.div>
            )}

            {phase === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#FFF5E6] text-lg mb-2"
                >
                  {result.description}
                </motion.p>

                <EffectDisplay effects={result.effects} />

                <GameButton
                  variant="primary"
                  size="lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={closeEvent}
                  className="mt-6"
                >
                  계속 →
                </GameButton>
              </motion.div>
            )}

            {phase === 'narration' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-center text-gray-500 text-sm py-4"
              >
                {narrationComplete ? '선택지 준비 중...' : ''}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* E-4: 포기 버튼 (A, C 유형만) */}
        {eventDef.canAbandon && phase === 'choosing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-8 py-4 border-t border-[#4A4A55]/50 flex justify-center"
          >
            <GameButton
              variant="secondary"
              size="sm"
              onClick={abandonEvent}
            >
              포기하기
            </GameButton>
          </motion.div>
        )}

        {/* 하단 정보 바 */}
        <div className="px-8 py-3 bg-[#16161C] border-t border-[#4A4A55]/30 flex items-center justify-between text-xs text-gray-500">
          <span className="inline-flex items-center gap-1"><img src={soulIcon} alt="소울" className="w-3.5 h-3.5 object-contain" /> {player.souls} 소울</span>
          <span>💚 {player.hp}/{player.maxHp} HP</span>
        </div>
      </motion.div>
    </div>
  );
}
