import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameButton } from '../ui/GameButton';
import { TopBar } from '../ui/TopBar';
import { useAnimSpeed } from '../../hooks/useAnimSpeed';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAudio } from '../../hooks/useAudio';
import type { EventChoice, EventCategory, EventEffect, EventOutcome } from '../../types';
import soulIcon from '@assets/icons/icon-soul.png';
import forestBg from '@assets/backgrounds/sunny-forest-day.png';
import cardFrame from '@assets/frames/frame-player.png';
import sunCoinImg from '@assets/coins/coin-heads.png';
import skillFrameImg from '@assets/frames/skill-frame.png';
import { SKILL_IMAGES } from '../../data/skillImages';

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
      <div style={{ perspective: '600px' }}>
        <motion.img
          src={sunCoinImg}
          alt="코인"
          className="w-20 h-20 object-contain"
          animate={flipping ? {
            rotateY: [0, 180, 360, 540, 720],
            scale: [1, 1.2, 1, 1.2, 1],
          } : {}}
          transition={{ duration: 1.5 * speedMultiplier, ease: 'easeInOut' }}
          style={{ filter: flipping ? 'drop-shadow(0 0 20px rgba(255,215,0,0.5))' : 'none' }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 * speedMultiplier }}
        className="text-[#FFF5E6]/60 text-sm mt-4"
      >
        운명의 동전이 돌아간다...
      </motion.p>
    </motion.div>
  );
}

function formatEffectValue(effect: EventEffect): string {
  const valueText = effect.maxValue !== undefined && effect.maxValue !== effect.value
    ? `${effect.value}~${effect.maxValue}`
    : `${effect.value}`;

  switch (effect.type) {
    case 'heal':
      return `HP +${valueText}`;
    case 'damage':
      return `HP -${valueText}`;
    case 'soul_gain':
      return `소울 +${valueText}`;
    case 'soul_cost':
      return `소울 -${valueText}`;
    case 'info':
      return '다음 몬스터 정보';
  }
}

function getEffectTone(effect: EventEffect): { icon: string; className: string; label: string } {
  switch (effect.type) {
    case 'heal':
      return { icon: '💚', className: 'border-[#6B9E78]/30 bg-[#6B9E78]/10 text-[#8FD39C]', label: '회복' };
    case 'damage':
      return { icon: '💔', className: 'border-[#C45555]/35 bg-[#C45555]/10 text-[#E07A7A]', label: '리스크' };
    case 'soul_gain':
      return { icon: '◆', className: 'border-[#D4A574]/35 bg-[#D4A574]/10 text-[#D4A574]', label: '보상' };
    case 'soul_cost':
      return { icon: '◆', className: 'border-[#C45555]/35 bg-[#C45555]/10 text-[#E07A7A]', label: '비용' };
    case 'info':
      return { icon: '📖', className: 'border-blue-400/30 bg-blue-400/10 text-blue-300', label: '정보' };
  }
}

function OutcomeSummary({ outcome, compact = false }: { outcome: EventOutcome; compact?: boolean }) {
  return (
    <div className={`rounded-lg border border-white/10 bg-[#16161C]/45 ${compact ? 'px-2.5 py-2' : 'px-3 py-2.5'}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold text-[#FFF5E6]/80">{outcome.label}</span>
        <span className="rounded-full bg-[#D4A574]/10 px-2 py-0.5 text-[11px] font-bold text-[#D4A574]">
          {Math.round(outcome.chance * 100)}%
        </span>
      </div>
      {outcome.effects.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {outcome.effects.map((effect, effectIndex) => {
            const tone = getEffectTone(effect);
            return (
              <span key={`${effect.type}-${effectIndex}`} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone.className}`}>
                <span>{tone.icon}</span>
                {formatEffectValue(effect)}
              </span>
            );
          })}
        </div>
      ) : (
        <span className="text-[11px] text-[#FFF5E6]/45">효과 없음</span>
      )}
    </div>
  );
}

function ChoiceCard({
  choice,
  index,
  playerSouls,
  accentHex,
  onSelect,
  disabled,
}: {
  choice: EventChoice;
  index: number;
  playerSouls: number;
  accentHex: string;
  onSelect: () => void;
  disabled: boolean;
}) {
  const hasSoulCost = choice.outcomes.some(o =>
    o.effects.some(e => e.type === 'soul_cost')
  );
  const soulCostAmount = Math.max(0, ...choice.outcomes
    .flatMap(o => o.effects)
    .filter(e => e.type === 'soul_cost')
    .map(e => e.maxValue ?? e.value));
  const canAfford = !hasSoulCost || playerSouls >= soulCostAmount;

  const hasProbability = choice.outcomes.length > 1;
  const primaryChance = Math.round(choice.outcomes[0].chance * 100);
  const failureChance = hasProbability ? Math.max(0, 100 - primaryChance) : 0;

  const hasRisk = choice.outcomes.some(o =>
    o.effects.some(e => e.type === 'damage')
  );
  const riskBorder = hasRisk ? 'border-l-4 border-l-[#C45555]' : 'border-l-4 border-l-[#6B9E78]';

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
      whileHover={!disabled && canAfford ? { x: 4, y: -2, boxShadow: `4px 0 18px ${accentHex}33` } : undefined}
      whileTap={!disabled && canAfford ? { scale: 0.98 } : undefined}
      onClick={!disabled && canAfford ? onSelect : undefined}
      disabled={disabled || !canAfford}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${riskBorder} ${
        disabled || !canAfford
          ? 'border-gray-700 bg-gray-800/50 opacity-40 cursor-not-allowed grayscale'
          : 'border-[#4A4A55] hover:border-[#D4A574] cursor-pointer shadow-card-dark'
      }`}
      style={!(disabled || !canAfford) ? { background: 'linear-gradient(to bottom, #1E1E24, #2A2A32)' } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[#FFF5E6] font-medium">{choice.label}</span>
          <span className="text-xs text-[#FFF5E6]/45">
            {hasProbability ? `${primaryChance}% ${choice.outcomes[0].label} / ${failureChance}% ${choice.outcomes[1]?.label ?? '실패'}` : '100% 확정 결과'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {choice.costDescription && (
            <span className={`text-sm font-medium ${canAfford ? 'text-purple-400' : 'text-red-400'}`}>
              {choice.costDescription}
            </span>
          )}
          {!canAfford && <span className="text-xs font-bold text-red-400">소울 부족</span>}
        </div>
      </div>

      {hasProbability && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#D4A574]">확률 판정</span>
            <span className="text-xs text-[#D4A574] font-bold">{primaryChance}% / {failureChance}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#16161C] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${primaryChance}%` }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-full rounded-full bg-[#6B9E78]"
            />
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {choice.outcomes.map((outcome) => (
          <OutcomeSummary key={outcome.label} outcome={outcome} compact />
        ))}
      </div>
    </motion.button>
  );
}

function EffectDisplay({ effects }: { effects: EventEffect[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 justify-center">
      {effects.map((effect, i) => {
        let icon = '';
        let iconImg: string | null = null;
        let text = '';
        let color = '';
        let glow = '';

        switch (effect.type) {
          case 'heal':
            icon = '💚';
            text = `HP +${effect.value}`;
            color = 'text-green-400 bg-green-400/10';
            glow = '0 0 10px rgba(107,158,120,0.3)';
            break;
          case 'damage':
            icon = '💔';
            text = `HP -${effect.value}`;
            color = 'text-red-400 bg-red-400/10';
            glow = '0 0 10px rgba(196,85,85,0.3)';
            break;
          case 'soul_gain':
            iconImg = soulIcon;
            text = `소울 +${effect.value}`;
            color = 'text-purple-400 bg-purple-400/10';
            glow = '0 0 10px rgba(107,158,120,0.3)';
            break;
          case 'soul_cost':
            iconImg = soulIcon;
            text = `소울 -${effect.value}`;
            color = 'text-red-400 bg-red-400/10';
            glow = '0 0 10px rgba(196,85,85,0.3)';
            break;
          case 'info':
            icon = '📖';
            text = '정보 획득';
            color = 'text-blue-400 bg-blue-400/10';
            glow = '0 0 10px rgba(96,165,250,0.3)';
            break;
          default:
            return null;
        }

        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [0.5, 1.1, 1] }}
            transition={{ delay: i * 0.15 }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${color}`}
            style={{ boxShadow: glow }}
          >
            {iconImg ? <img src={iconImg} alt="소울" className="w-5 h-5 object-contain" /> : icon} {text}
          </motion.span>
        );
      })}
    </div>
  );
}

const CATEGORY_GRADIENTS: Record<EventCategory, string> = {
  A: 'rgba(107, 158, 120, 0.15)',
  B: 'rgba(139, 123, 181, 0.15)',
  C: 'rgba(212, 152, 90, 0.20)',
  D: 'rgba(196, 85, 85, 0.20)',
};

const CATEGORY_ACCENT_HEX: Record<EventCategory, string> = {
  A: '#6B9E78',
  B: '#8B7BB5',
  C: '#D4985A',
  D: '#C45555',
};

export function EventScreen() {
  const { event: eventState, player, selectEventChoice, abandonEvent, closeEvent } = useGameStore();
  const speedM = useAnimSpeed();
  const [narrationComplete, setNarrationComplete] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const { isMuted, toggleMute } = useAudio();

  const eventDef = eventState?.event;
  const phase = eventState?.phase ?? 'narration';
  const result = eventState?.result;

  const handleCoinFlipComplete = useCallback(() => {
    const currentEvent = useGameStore.getState().event;
    if (currentEvent?.phase === 'coin_flip') {
      useGameStore.setState({
        event: { ...currentEvent, phase: 'result' },
      });
    }
  }, []);

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
  const categoryGradient = CATEGORY_GRADIENTS[eventDef.category];
  const accentHex = CATEGORY_ACCENT_HEX[eventDef.category];
  const selectedChoice = result ? eventDef.choices.find(choice => choice.id === result.choiceId) : null;
  const selectedOutcome = selectedChoice ? selectedChoice.outcomes[result?.outcomeIndex ?? 0] : null;
  const totalCoinCount = player.coinInventory.reduce((sum, coin) => sum + coin.count, 0);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* 배경 레이어 */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${forestBg})` }} />
      <div className="absolute inset-0" style={{ background: categoryGradient }} />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />

      {/* Zone A: 상단 HUD */}
      <div className="absolute top-0 left-0 w-full h-[72px] z-20">
        <TopBar
          mode="event"
          title={eventDef.name}
          subtitle={categoryStyle.label}
          titleIcon={eventDef.emoji}
          hp={player.hp}
          maxHp={player.maxHp}
          souls={player.souls}
          coinCount={totalCoinCount}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenSettings={useSettingsStore.getState().open}
        />
      </div>

      {/* Zone B: 이벤트 무대 */}
      <div
          className="absolute top-[72px] left-0 w-full z-10"
          style={{ bottom: '160px' }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center px-8 overflow-y-auto">
          <div className="w-full max-w-3xl">
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-32 h-32 mb-3"
              >
                <img src={cardFrame} alt="" className="absolute inset-0 w-full h-full object-contain" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">{eventDef.emoji}</span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ boxShadow: `0 0 25px ${accentHex}66` }}
                />
              </motion.div>

              {eventDef.category === 'C' || eventDef.category === 'D' ? (
                <motion.p
                  className="text-sm px-3 py-1 rounded-full bg-[#C45555]/20 border border-[#C45555]/40 text-[#C45555]"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⚠️ HP 리스크 있음
                </motion.p>
              ) : (
                <p className="text-sm px-3 py-1 rounded-full bg-[#6B9E78]/20 border border-[#6B9E78]/40 text-[#6B9E78]">
                  ✓ 안전
                </p>
              )}
            </div>

            <div className="relative bg-gradient-to-b from-[#2A2218] to-[#1E1E24] border border-[#D4A574]/30 rounded-xl px-8 py-6 mb-6">
              <span className="absolute top-2 left-4 text-3xl text-[#D4A574]/20 font-serif select-none">&ldquo;</span>
              <span className="absolute bottom-2 right-4 text-3xl text-[#D4A574]/20 font-serif select-none">&rdquo;</span>
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#D4A574]/30 to-transparent" />

              <motion.p
                className="text-[#FFF5E6]/90 text-lg leading-relaxed italic relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {displayedText}
                {!narrationComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-[#D4A574]"
                  >
                    ▊
                  </motion.span>
                )}
              </motion.p>
            </div>

            {phase === 'choosing' && (
              <div className="mb-3 flex items-center justify-between rounded-xl border border-[#4A4A55]/50 bg-[#16161C]/55 px-4 py-2 text-xs text-[#FFF5E6]/60">
                <span>선택 전 확률·보상·리스크를 모두 확인할 수 있습니다.</span>
                <span className="font-bold text-[#D4A574]">현재 소울 {player.souls}</span>
              </div>
            )}

            {/* 선택지 / 코인플립 / 결과 */}
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
                      accentHex={accentHex}
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
                  {result && selectedChoice && (
                    <div className="mx-auto max-w-lg rounded-xl border border-[#D4A574]/25 bg-[#16161C]/55 px-4 py-3 text-center">
                      <p className="text-sm font-bold text-[#D4A574]">{selectedChoice.label}</p>
                      <p className="mt-1 text-xs text-[#FFF5E6]/60">결과 판정 중...</p>
                    </div>
                  )}
                </motion.div>
              )}

              {phase === 'result' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  {selectedOutcome && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4 rounded-full border border-[#D4A574]/35 bg-[#D4A574]/10 px-4 py-1.5 text-sm font-bold text-[#D4A574]"
                    >
                      {selectedOutcome.label} · {Math.round(selectedOutcome.chance * 100)}%
                    </motion.div>
                  )}

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[#FFF5E6] text-lg mb-2"
                  >
                    {result.description}
                  </motion.p>

                  <EffectDisplay effects={result.effects} />
                  {result.effects.length === 0 && (
                    <p className="mt-3 text-sm text-[#FFF5E6]/45">자원 변화 없이 이벤트를 지나쳤습니다.</p>
                  )}
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
        </div>
      </div>

      {/* Zone C: 상태 정보 + 액션 바 */}
      <div className="absolute bottom-0 left-0 w-full h-[160px] z-20 bg-[#16161C]/90 backdrop-blur-sm">
        <div className="gold-divider" />
        <div className="h-full flex items-center justify-center gap-8 px-8">
          <div className="flex items-center gap-2">
            <span className="text-base">💚</span>
            <div className="w-44 h-5 hp-bar-container">
              <div
                className={`h-full rounded transition-all ${
                  (player.hp / player.maxHp) > 0.5
                    ? 'bg-green-500'
                    : (player.hp / player.maxHp) > 0.25
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-[#FFF5E6]/80">{player.hp}/{player.maxHp}</span>
          </div>

          <div className="flex items-center gap-2">
            {player.skills.map(skill => {
              const skillImg = SKILL_IMAGES[skill.skillKey];
              return (
                <div key={skill.id} className="relative w-16 h-20" title={skill.name}>
                  <img src={skillFrameImg} alt="" className="absolute inset-0 w-full h-full object-contain opacity-60" />
                  {skillImg ? (
                    <img src={skillImg} alt={skill.name} className="absolute inset-0 w-3/4 h-3/4 m-auto object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl">{skill.icon}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 text-center">
                    <span className="text-[8px] text-gray-300 bg-dark-surface/80 px-1 rounded truncate inline-block max-w-full">
                      {skill.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute right-8 flex items-center gap-3">
            {eventDef.canAbandon && phase === 'choosing' && (
              <GameButton variant="secondary" size="sm" onClick={abandonEvent}>
                포기하기
              </GameButton>
            )}
            {phase === 'result' && (
              <GameButton variant="primary" size="lg" onClick={closeEvent}>
                계속 →
              </GameButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
