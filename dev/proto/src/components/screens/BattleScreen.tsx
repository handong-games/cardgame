import { useEffect, useRef, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { CharacterCard } from '../battle/CharacterCard';
import { EnemyCard } from '../battle/EnemyCard';
import { PlayerBuffs } from '../battle/PlayerBuffs';
import { SkillPanel } from '../battle/SkillPanel';
import { DragOverlay } from '../battle/DragOverlay';
import { RewardScreen } from './RewardScreen';
import { TopBar } from '../ui/TopBar';
import { SoulDrop } from '../effects/SoulDrop';
import { CoinTossAnimation } from '../effects/CoinTossAnimation';
import { DEATH_ANIMATION_DURATION } from '../../animations';
import { getRegion } from '../../data/regions';
import { getRegionAccessories, getAccessoryById } from '../../data/accessories';
import { getRegionFacilities, getBloodAltarRewards, BLOOD_ALTAR_HIDDEN_REWARD } from '../../data/facilities';
import { CARD_DEFINITIONS } from '../../data/cards';
import { getTavernCompanions } from '../../data/companions';
import type { BloodAltarReward, CoinTossResult, Skill } from '../../types';
import type { Enemy, DestinationOption, DestinationType, Accessory, Facility, Companion } from '../../types';
import { calculatePreviewEffects } from '../../utils/skillSystem';
import { calculateCoinValues } from '../../utils/coinToss';
import { useSkillDrag } from '../../hooks/useSkillDrag';

// 라운드 진행 UI 컴포넌트
function RoundProgress({ currentRound, totalRounds, regionName }: { currentRound: number; totalRounds: number; regionName: string }) {
  // 라운드를 역순으로 (위에서 아래로 7->1)
  const rounds = Array.from({ length: totalRounds }, (_, i) => totalRounds - i);
  const middleRound = Math.ceil(totalRounds / 2); // 중간 지점 (7라운드 기준 4)
  const bossRound = totalRounds; // 보스 라운드 (마지막)

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
      {rounds.map((round, index) => {
        const isPassed = round < currentRound;
        const isCurrent = round === currentRound;
        const isLocked = round > currentRound;
        const isLast = index === rounds.length - 1;
        const isVillage = round === middleRound;
        const isBoss = round === bossRound;

        return (
          <div key={round} className="flex flex-col items-center">
            {/* 특수 라운드: 보스 */}
            {isBoss ? (
              <div
                className={`
                  flex items-center justify-center transition-all duration-300
                  ${isCurrent ? 'text-lg' : 'text-sm'}
                  ${isPassed ? 'opacity-50' : ''}
                  ${isCurrent ? 'drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]' : ''}
                  ${isLocked ? 'opacity-40 grayscale' : ''}
                `}
              >
                ☠️
              </div>
            ) : isVillage ? (
              /* 특수 라운드: 마을 */
              <div
                className={`
                  flex items-center justify-center transition-all duration-300
                  ${isCurrent ? 'text-lg' : 'text-sm'}
                  ${isPassed ? 'opacity-50' : ''}
                  ${isCurrent ? 'drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]' : ''}
                  ${isLocked ? 'opacity-40 grayscale' : ''}
                `}
              >
                🏘️
              </div>
            ) : (
              /* 일반 라운드: 원 */
              <div
                className={`
                  rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isCurrent ? 'w-5 h-5 border-2 border-rose-500 bg-rose-500/20' : 'w-3 h-3'}
                  ${isPassed ? 'bg-white' : ''}
                  ${isLocked ? 'border border-gray-600 bg-transparent' : ''}
                `}
              >
                {isCurrent && <div className="w-2 h-2 rounded-full bg-rose-500" />}
              </div>
            )}

            {/* 트랙 (마지막 라운드 제외) */}
            {!isLast && (
              <div
                className={`
                  w-0.5 h-3
                  ${isPassed ? 'bg-white' : ''}
                  ${isCurrent ? 'bg-gradient-to-b from-rose-500 to-gray-600' : ''}
                  ${isLocked ? 'bg-gray-600' : ''}
                `}
              />
            )}
          </div>
        );
      })}

      {/* 현재/최대 라운드 및 지역 표시 */}
      <div className="mt-2 text-center">
        <div className="text-xs text-gray-400">
          <span className="text-rose-500 font-bold">{currentRound}</span>
          <span> / {totalRounds}</span>
        </div>
        <div className="text-xs text-gray-500 max-w-16 leading-tight">{regionName}</div>
      </div>
    </div>
  );
}

// 행선지 타입별 정보
const DESTINATION_INFO: Record<DestinationType, { emoji: string; label: string; color: string; border: string }> = {
  normal: { emoji: '👹', label: '몬스터', color: 'text-gray-300', border: 'border-gray-500' },
  elite: { emoji: '💀', label: '엘리트', color: 'text-yellow-400', border: 'border-yellow-500' },
  rest: { emoji: '🏕️', label: '휴식', color: 'text-green-400', border: 'border-green-500' },
  shop: { emoji: '🛒', label: '상점', color: 'text-blue-400', border: 'border-blue-500' },
  event: { emoji: '❓', label: '이벤트', color: 'text-purple-400', border: 'border-purple-500' },
  village: { emoji: '🏘️', label: '마을', color: 'text-amber-400', border: 'border-amber-500' },
};

// 행선지 카드 컴포넌트 (캐릭터 카드와 동일한 높이)
function DestinationCard({ destination, index, onSelect }: { destination: DestinationOption; index: number; onSelect: () => void }) {
  const info = DESTINATION_INFO[destination.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`
        w-32 rounded-lg border-2 cursor-pointer bg-gray-800 overflow-hidden
        ${info.border}
      `}
      onClick={onSelect}
    >
      {/* 라벨 (캐릭터 카드 이름 영역과 동일) */}
      <div className={`py-2 text-center font-bold border-b border-gray-700 bg-gray-750 ${info.color}`}>
        {info.label}
      </div>
      {/* 이모지 영역 (캐릭터 카드 이미지 영역과 동일) */}
      <div className="flex items-center justify-center py-10 text-6xl bg-gray-850">
        {info.emoji}
      </div>
    </motion.div>
  );
}

// 마을 진입 연출 컴포넌트
function VillageEntrance({ regionName, onComplete }: { regionName: string; onComplete: () => void }) {
  useEffect(() => {
    // 2.5초 후 자동으로 다음 단계로 이동
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center"
    >
      {/* 배경 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-amber-900/20"
      />

      {/* 마을 아이콘 */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-8xl mb-6 relative z-10"
      >
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🏘️
        </motion.span>
      </motion.div>

      {/* 마을 이름 */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-bold text-amber-400 mb-3 relative z-10"
      >
        숲 속 마을
      </motion.h1>

      {/* 환영 메시지 */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-lg text-gray-300 relative z-10"
      >
        마을에 도착했습니다
      </motion.p>

      {/* 지역 이름 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-sm text-gray-500 mt-2 relative z-10"
      >
        {regionName}
      </motion.p>
    </motion.div>
  );
}

// 장신구 카드 컴포넌트
function AccessoryCard({ accessory, index, onSelect }: { accessory: Accessory; index: number; onSelect: () => void }) {
  // 효과 타입에 따른 설명 생성
  const getEffectDescription = () => {
    const { effect } = accessory;
    switch (effect.type) {
      case 'stat_boost':
        if (effect.stat === 'maxHp') return `최대 HP +${effect.value}`;
        if (effect.stat === 'damage') return `공격력 +${effect.value}`;
        if (effect.stat === 'block') return `방어력 +${effect.value}`;
        if (effect.stat === 'energy') return `에너지 +${effect.value}`;
        return `${effect.stat} +${effect.value}`;
      case 'on_turn_start':
        return `턴 시작 시 ${effect.stat === 'block' ? '방어력' : effect.stat} +${effect.value}`;
      case 'passive':
        if (effect.stat === 'damage') return `모든 공격에 +${effect.value} 데미지`;
        return accessory.description;
      default:
        return accessory.description;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="w-36 rounded-lg border-2 cursor-pointer bg-gray-800 overflow-hidden border-amber-500 hover:border-amber-400"
      onClick={onSelect}
    >
      {/* 장신구 이름 */}
      <div className="py-2 text-center font-bold border-b border-gray-700 bg-gray-750 text-amber-400">
        {accessory.name}
      </div>
      {/* 이모지 영역 */}
      <div className="flex items-center justify-center py-8 text-5xl bg-gray-850">
        {accessory.emoji}
      </div>
      {/* 효과 설명 */}
      <div className="px-2 py-3 text-center text-xs text-gray-300 border-t border-gray-700 bg-gray-800">
        {getEffectDescription()}
      </div>
    </motion.div>
  );
}

// 장신구 선택 화면 컴포넌트 (팝업)
function AccessorySelection({ regionId, onSelect }: { regionId: string; onSelect: (accessoryId: string) => void }) {
  const accessories = getRegionAccessories(regionId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center"
    >
      {/* 배경 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        className="absolute inset-0 bg-amber-900/20"
      />

      {/* 제목 */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-bold text-amber-400 mb-2 relative z-10"
      >
        🌿 부족의 선물
      </motion.h2>
      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 mb-8 relative z-10"
      >
        숲의 부족이 당신에게 선물을 바칩니다
      </motion.p>

      {/* 장신구 카드들 */}
      <div className="flex gap-6 relative z-10">
        {accessories.map((accessory, index) => (
          <AccessoryCard
            key={accessory.id}
            accessory={accessory}
            index={index}
            onSelect={() => onSelect(accessory.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

// 시설 카드 컴포넌트
function FacilityCard({ facility, index, onSelect }: { facility: Facility; index: number; onSelect: () => void }) {
  // 시설 타입에 따른 색상
  const getColors = () => {
    switch (facility.type) {
      case 'tavern':
        return { border: 'border-amber-500', text: 'text-amber-400', hover: 'hover:border-amber-400' };
      case 'blood_altar':
        return { border: 'border-red-500', text: 'text-red-400', hover: 'hover:border-red-400' };
      default:
        return { border: 'border-gray-500', text: 'text-gray-400', hover: 'hover:border-gray-400' };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`w-36 rounded-lg border-2 cursor-pointer bg-gray-800 overflow-hidden ${colors.border} ${colors.hover}`}
      onClick={onSelect}
    >
      {/* 시설 이름 */}
      <div className={`py-2 text-center font-bold border-b border-gray-700 bg-gray-750 ${colors.text}`}>
        {facility.name}
      </div>
      {/* 이모지 영역 */}
      <div className="flex items-center justify-center py-8 text-5xl bg-gray-850">
        {facility.emoji}
      </div>
      {/* 설명 */}
      <div className="px-2 py-3 text-center text-xs text-gray-300 border-t border-gray-700 bg-gray-800">
        {facility.description}
      </div>
    </motion.div>
  );
}

// 동료 카드 컴포넌트
function CompanionCard({
  companion,
  index,
  isSelected,
  isMoving,
  onSelect,
}: {
  companion: Companion;
  index: number;
  isSelected?: boolean;
  isMoving?: boolean;
  onSelect: () => void;
}) {
  // 효과 트리거에 따른 설명
  const getTriggerText = () => {
    return companion.turnEffect.trigger === 'turn_start' ? '턴 시작 시' : '턴 종료 시';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isMoving ? {
        x: '-50vw',
        scale: 1,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
      } : {
        opacity: 1,
        y: 0,
        scale: 1,
        x: 0,
      }}
      whileHover={!isMoving ? { scale: 1.05, transition: { duration: 0.05 } } : {}}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`
        w-40 rounded-lg border-2 cursor-pointer bg-gray-800 overflow-hidden transition-all
        ${isSelected
          ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/30'
          : 'border-cyan-700 hover:border-cyan-500'}
      `}
      onClick={onSelect}
    >
      {/* 동료 이름 */}
      <div className={`py-2 text-center font-bold border-b border-gray-700 bg-gray-750 ${isSelected ? 'text-cyan-300' : 'text-cyan-400'}`}>
        {companion.name}
      </div>
      {/* 이모지 영역 */}
      <div className="flex items-center justify-center py-8 text-5xl bg-gray-850">
        {companion.emoji}
      </div>
      {/* 효과 설명 */}
      <div className="px-3 py-3 text-center border-t border-gray-700 bg-gray-800">
        <p className="text-xs text-cyan-300 mb-1">{getTriggerText()}</p>
        <p className="text-sm text-gray-200">{companion.description}</p>
        <p className="text-xs text-gray-500 mt-2">+ 연계 카드 획득</p>
      </div>
    </motion.div>
  );
}

// 동료 표시 카드 (캐릭터 옆에 표시, CharacterCard와 동일 크기)
function CompanionDisplayCard({ companion }: { companion: Companion }) {
  const getTriggerText = () => {
    return companion.turnEffect.trigger === 'turn_start' ? '턴 시작 시' : '턴 종료 시';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-48 flex flex-col"
    >
      {/* 상단: CharacterCard의 방패+HP바 자리 (높이 맞춤) */}
      <div className="flex items-center gap-2 mb-1 h-12">
        <span className="text-cyan-400 text-sm">{getTriggerText()}</span>
        <span className="text-gray-500 text-xs">{companion.description}</span>
      </div>

      {/* 카드 본체 */}
      <div className="rounded-lg border border-cyan-600 bg-gray-800 overflow-hidden">
        {/* 카드 이름 */}
        <div className="py-2 text-center text-cyan-400 font-bold border-b border-gray-700 bg-gray-750">
          {companion.name}
        </div>

        {/* 이모지 영역 (CharacterCard와 동일) */}
        <div className="flex items-center justify-center py-10 text-6xl bg-gray-850">
          {companion.emoji}
        </div>
      </div>
    </motion.div>
  );
}

// 피의 제단 계약 카드 컴포넌트
function BloodAltarRewardCard({
  reward,
  index,
  isSelected,
  onToggle,
}: {
  reward: BloodAltarReward;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // 획득 아이템 정보 계산
  const curseCard = reward.penalty.curseCard ? CARD_DEFINITIONS['blood_debt'] : null;
  const accessory = reward.accessoryId ? getAccessoryById(reward.accessoryId) : null;
  const hasPreview = curseCard || accessory;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        className={`
          w-44 rounded-lg border-2 cursor-pointer bg-gray-800 overflow-hidden transition-all
          ${isSelected
            ? 'border-red-400 ring-2 ring-red-400/50 shadow-lg shadow-red-500/30'
            : 'border-red-800 hover:border-red-500'}
        `}
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 선택 체크박스 */}
        <div className={`
          absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center
          ${isSelected ? 'bg-red-500 border-red-400' : 'bg-transparent border-gray-500'}
        `}>
          {isSelected && <span className="text-white text-xs">✓</span>}
        </div>

        {/* 보상 이름 */}
        <div className="py-2 text-center font-bold border-b border-gray-700 bg-gray-750 text-red-400 relative">
          {reward.name}
        </div>

        {/* 이모지 영역 */}
        <div className="flex items-center justify-center py-6 text-5xl bg-gray-850">
          {reward.emoji}
        </div>

        {/* 제단의 속삭임 */}
        <div className="px-3 py-2 text-center border-t border-gray-700 bg-gray-900/50">
          <motion.p
            className="text-xs text-red-300 italic"
            animate={(isHovered || isSelected) ? {
              opacity: [0.6, 1, 0.7, 1, 0.6],
              x: [0, -0.5, 0.5, -0.3, 0.3, -0.5, 0],
              y: [0, 0.3, -0.3, 0.2, -0.2, 0],
              textShadow: [
                '0 0 4px rgba(220, 38, 38, 0)',
                '0 0 8px rgba(220, 38, 38, 0.8)',
                '0 0 4px rgba(220, 38, 38, 0.3)',
                '0 0 10px rgba(220, 38, 38, 0.9)',
                '0 0 4px rgba(220, 38, 38, 0)',
              ],
              transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            } : { opacity: 1, x: 0, y: 0, textShadow: '0 0 0px rgba(220, 38, 38, 0)' }}
          >
            {reward.description}
          </motion.p>
        </div>

        {/* 보상/패널티 */}
        <div className="px-3 py-3 border-t border-gray-700 bg-gray-800">
          {/* 보상 */}
          <div className="flex items-center gap-1 text-green-400 text-sm mb-1">
            <span>✨</span>
            <span>{reward.rewardText}</span>
          </div>
          {/* 패널티 */}
          <div className="flex items-center gap-1 text-red-400 text-sm">
            <span>💀</span>
            <span>{reward.penaltyText}</span>
          </div>
        </div>
      </motion.div>

      {/* 호버 시 획득 아이템 미리보기 */}
      <AnimatePresence>
        {isHovered && hasPreview && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-2 z-50"
          >
            {/* 저주 카드 미리보기 */}
            {curseCard && (
              <div className="w-36 bg-gray-900 border-2 border-purple-600 rounded-lg overflow-hidden shadow-lg shadow-purple-500/20">
                <div className="px-2 py-1 bg-purple-900/50 border-b border-purple-700">
                  <span className="text-xs text-purple-300">획득 카드</span>
                </div>
                <div className="p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-purple-400">{curseCard.name}</span>
                    <span className="text-xs bg-purple-800 px-1.5 py-0.5 rounded text-purple-200">
                      {curseCard.cost}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    타입: <span className="text-purple-400">저주</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {curseCard.description}
                  </p>
                </div>
              </div>
            )}

            {/* 장신구 미리보기 */}
            {accessory && (
              <div className="w-36 bg-gray-900 border-2 border-yellow-600 rounded-lg overflow-hidden shadow-lg shadow-yellow-500/20">
                <div className="px-2 py-1 bg-yellow-900/50 border-b border-yellow-700">
                  <span className="text-xs text-yellow-300">획득 장신구</span>
                </div>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{accessory.emoji}</span>
                    <span className="text-sm font-bold text-yellow-400">{accessory.name}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {accessory.description}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BattleScreen() {
  const {
    player,
    enemy,
    battle,
    run,
    destinationOptions,
    startRun,
    endTurn,
    tossCoins,
    useSkill,
    selectDestination,
    showDestinationSelection,
    proceedToVillageAccessory,
    selectAccessory,
    selectFacility,
    selectCompanion,
    goBackToFacilitySelection,
    selectBloodAltarRewards,
  } = useGameStore();

  // 사망 애니메이션 상태
  const [dyingEnemy, setDyingEnemy] = useState<Enemy | null>(null);
  const [showSoulDrop, setShowSoulDrop] = useState(false);
  const [soulPulse, setSoulPulse] = useState(false);
  const [selectedBloodAltarRewards, setSelectedBloodAltarRewards] = useState<string[]>([]);
  const [showHiddenReward, setShowHiddenReward] = useState(false);
  // 정령의 샘 동료 선택 상태
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const [companionMoving, setCompanionMoving] = useState(false);
  const prevEnemyRef = useRef<Enemy | null>(null);
  const tossButtonRef = useRef<HTMLButtonElement>(null);
  const coinAnimationAreaRef = useRef<HTMLDivElement>(null);
  // 코인 토스 애니메이션 상태 (모든 데이터를 하나의 객체로 관리)
  const [coinTossState, setCoinTossState] = useState<{
    isActive: boolean;
    results: CoinTossResult[];
    buttonPosition: { x: number; y: number };
    animationAreaBounds: { left: number; top: number; width: number; height: number };
  }>({
    isActive: false,
    results: [],
    buttonPosition: { x: 0, y: 0 },
    animationAreaBounds: { left: 0, top: 0, width: 0, height: 0 },
  });
  // 스킬 호버 프리뷰 상태
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  // 스킬 드래그 (적 타겟 스킬용)
  const handleSkillDropOnEnemy = useCallback((skill: Skill) => {
    useSkill(skill.id);
  }, [useSkill]);

  const { dragState: skillDragState, startDrag: startSkillDrag, registerEnemyZone } = useSkillDrag(handleSkillDropOnEnemy);

  // 코인 가치 계산
  const coinValues = calculateCoinValues(battle.lastTossResults);
  const headsValue = coinValues.heads;
  const tailsValue = coinValues.tails;

  // 드롭 존 refs
  const enemyZoneRef = useRef<HTMLDivElement>(null);
  const battlefieldRef = useRef<HTMLDivElement>(null);
  const playerZoneRef = useRef<HTMLDivElement>(null);

  // 코인 토스 핸들러
  const handleCoinToss = useCallback(() => {
    if (battle.hasTossedThisTurn || coinTossState.isActive) return;

    // 애니메이션 시작 전에 위치 캡처
    let buttonPos = { x: 0, y: 0 };
    let areaPos = { left: 0, top: 0, width: 0, height: 0 };

    if (tossButtonRef.current) {
      const rect = tossButtonRef.current.getBoundingClientRect();
      buttonPos = { x: rect.left, y: rect.top };
    }

    if (coinAnimationAreaRef.current) {
      const rect = coinAnimationAreaRef.current.getBoundingClientRect();
      areaPos = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }

    // 코인 토스 실행
    const results = tossCoins();

    // 모든 데이터를 한 번에 설정 (원자적 업데이트)
    setCoinTossState({
      isActive: true,
      results,
      buttonPosition: buttonPos,
      animationAreaBounds: areaPos,
    });
  }, [battle.hasTossedThisTurn, coinTossState.isActive, tossCoins]);

  // 각 동전 착지 시 콜백
  // TODO: 코인 애니메이션과 통합 필요
  const handleCoinLand = useCallback(() => {
    // 임시: 개별 코인 착지는 더 이상 사용하지 않음
    // 코인은 토스 시점에 이미 lastTossResults에 저장됨
  }, []);

  // 애니메이션 완료 시 콜백
  const handleTossComplete = useCallback(() => {
    setCoinTossState({
      isActive: false,
      results: [],
      buttonPosition: { x: 0, y: 0 },
      animationAreaBounds: { left: 0, top: 0, width: 0, height: 0 },
    });
  }, []);

  // 턴 종료 핸들러 (애니메이션 상태 초기화 + 턴 종료)
  const handleEndTurn = useCallback(() => {
    // 진행 중인 애니메이션 상태 초기화
    setCoinTossState({
      isActive: false,
      results: [],
      buttonPosition: { x: 0, y: 0 },
      animationAreaBounds: { left: 0, top: 0, width: 0, height: 0 },
    });
    // 턴 종료
    endTurn();
  }, [endTurn]);

  // 스킬 호버 핸들러
  const handleSkillHover = useCallback((skill: Skill | null) => {
    setHoveredSkill(skill);
  }, []);

  // 프리뷰 효과 계산
  // - 공격 스킬 (enemy 타겟): 드래그 중 + 적 영역 위일 때만
  // - self/none 타겟: 기존처럼 호버 시 표시
  const previewEffects = (() => {
    // 스킬 드래그 중 + 적 영역 위
    if (skillDragState.isDragging && skillDragState.skill && skillDragState.isOverEnemy) {
      return calculatePreviewEffects(player, skillDragState.skill, enemy);
    }
    // self/none 타겟 스킬 호버 시
    if (hoveredSkill && hoveredSkill.targetType !== 'enemy') {
      return calculatePreviewEffects(player, hoveredSkill, enemy);
    }
    return null;
  })();

  // 런 시작
  useEffect(() => {
    startRun();  // 새 런 시작 (라운드 1부터)
  }, [startRun]);

  // 스킬 드래그용 적 영역 등록
  useEffect(() => {
    registerEnemyZone(enemyZoneRef);
  }, [registerEnemyZone]);

  // 화면 전환 시 코인 토스 상태 초기화
  useEffect(() => {
    const battlePhases = ['player_turn', 'enemy_turn'];
    if (!battlePhases.includes(battle.phase)) {
      setCoinTossState({
        isActive: false,
        results: [],
        buttonPosition: { x: 0, y: 0 },
        animationAreaBounds: { left: 0, top: 0, width: 0, height: 0 },
      });
    }
  }, [battle.phase]);

  // 적 처치 감지 및 애니메이션 트리거
  useEffect(() => {
    // 적이 있었는데 없어졌고 (처치됨), 보상 화면으로 전환될 때
    if (prevEnemyRef.current && !enemy && battle.phase === 'reward' && !dyingEnemy) {
      setDyingEnemy(prevEnemyRef.current);

      // 사망 애니메이션 70% 시점에 영혼 드롭 시작
      setTimeout(() => {
        setShowSoulDrop(true);
      }, DEATH_ANIMATION_DURATION * 0.7 * 1000);
    }

    // 현재 enemy 저장
    if (enemy) {
      prevEnemyRef.current = enemy;
    }
  }, [enemy, battle.phase, dyingEnemy]);

  // 영혼 드롭 완료 핸들러
  const handleSoulDropComplete = useCallback(() => {
    setShowSoulDrop(false);
    setDyingEnemy(null);
    prevEnemyRef.current = null;  // 무한 반복 방지
    setSoulPulse(true);

    // 펄스 효과 종료
    setTimeout(() => setSoulPulse(false), 300);
  }, []);

  // 보상/전직 화면 (사망 애니메이션 중에는 전투 화면 유지)
  if ((battle.phase === 'reward' || battle.phase === 'class_advancement') && !dyingEnemy) {
    return <RewardScreen />;
  }

  // 런 클리어 화면
  if (battle.phase === 'victory' && run.isComplete) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">🏆 런 클리어!</h1>
        <p className="text-gray-400 mb-2">모든 라운드를 클리어했습니다!</p>
        <p className="text-green-400 mb-8">
          최종 HP: {player.hp}/{player.maxHp} | 클래스: {player.characterClass === 'paladin' ? '팔라딘' : '전사'}
        </p>
        <button
          onClick={() => startRun()}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-lg font-bold"
        >
          새 런 시작
        </button>
      </div>
    );
  }

  // 일반 승리 화면 (라운드 진행 중 - 보통 보상 선택으로 감)
  if (battle.phase === 'victory') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">승리!</h1>
        <p className="text-gray-400 mb-8">적을 처치했습니다.</p>
        <button
          onClick={() => startRun()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          다시 시작
        </button>
      </div>
    );
  }

  if (battle.phase === 'defeat') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">패배...</h1>
        <p className="text-gray-400 mb-2">다음에는 더 잘 할 수 있을 거예요.</p>
        <p className="text-gray-500 mb-8">
          라운드 {run.round}/{run.totalRounds}에서 쓰러졌습니다.
        </p>
        <button
          onClick={() => startRun()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          다시 시작
        </button>
      </div>
    );
  }

  // 마을 진입 연출
  if (battle.phase === 'village_entrance') {
    return (
      <VillageEntrance
        regionName={getRegion(run.regionId).name}
        onComplete={proceedToVillageAccessory}
      />
    );
  }

  // 장신구 선택 (팝업)
  if (battle.phase === 'village_accessory') {
    return (
      <AccessorySelection
        regionId={run.regionId}
        onSelect={selectAccessory}
      />
    );
  }

  const isPlayerTurn = battle.phase === 'player_turn';
  const canAct = isPlayerTurn;

  // 현재 표시할 적 (실제 적 또는 사망 중인 적)
  const displayEnemy = enemy || dyingEnemy;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 상단 바 */}
      <TopBar
        enemyName={displayEnemy?.name}
        souls={player.souls}
        soulPulse={soulPulse}
        accessories={run.accessories}
      />

      {/* 전투 영역 + 스킬 패널 */}
      <div className="flex-1 flex flex-col">
        {/* 전투 영역 */}
        <div
          ref={battlefieldRef}
          className="flex-1 flex items-center justify-around p-8 transition-all relative"
        >
        {/* 라운드 진행 UI */}
        <RoundProgress currentRound={run.round} totalRounds={run.totalRounds} regionName={getRegion(run.regionId).name} />
        {/* 유저 캐릭터 + 동료 */}
        <div className="flex flex-col items-center">
          {/* 적 "다음 액션" 높이만큼 스페이서 추가 (수평 정렬용) */}
          <div className="h-8 mb-2" />
          <div className="flex items-start gap-3">
            {/* 동료 카드들 (캐릭터 왼쪽) */}
            {run.companions.map((companion) => (
              <CompanionDisplayCard key={companion.id} companion={companion} />
            ))}
            {/* 캐릭터 카드 */}
            <div
              ref={playerZoneRef}
              className="flex flex-col items-center rounded-lg transition-all"
            >
              <CharacterCard
                name={player.characterClass === 'paladin' ? '팔라딘' : '전사'}
                hp={player.hp}
                maxHp={player.maxHp}
                block={player.block}
                attack={6}
                emoji={player.characterClass === 'paladin' ? '⚔️' : '🧑‍⚔️'}
                isPlayer={true}
                isAttacking={battle.combatAnimation.playerAttacking}
                isHit={battle.combatAnimation.playerHit}
                isShieldHit={battle.combatAnimation.shieldHit}
                previewBlock={previewEffects?.block ?? 0}
                previewHeal={previewEffects?.heal ?? 0}
                previewSelfDamage={previewEffects?.selfDamage ?? 0}
              />
              {/* 활성 버프 표시 */}
              <PlayerBuffs buffs={player.activeBuffs} />
            </div>
          </div>
        </div>

        {/* 적 캐릭터 / 노드 선택 영역 */}
        <div
          ref={enemyZoneRef}
          className="transition-all rounded-lg relative"
        >
          {/* 행선지 선택 모드 */}
          {battle.phase === 'destination_selection' && destinationOptions.length > 0 ? (
            <div className="flex flex-col">
              {/* 캐릭터 카드의 스페이서와 동일 */}
              <div className="h-8 mb-2" />
              {/* 캐릭터 카드의 방패+HP바 영역과 동일한 높이 */}
              <div className="flex items-center justify-center gap-2 mb-1 h-12">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white font-bold text-lg"
                >
                  다음 행선지 선택
                </motion.span>
              </div>
              {/* 카드들 (캐릭터 카드 본체와 정렬) */}
              <div className="flex gap-4">
                {destinationOptions.map((destination, index) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    index={index}
                    onSelect={() => selectDestination(destination.id)}
                  />
                ))}
              </div>
            </div>
          ) : battle.phase === 'village_facility' ? (
            /* 시설 선택 모드 */
            <div className="flex flex-col items-center">
              <div className="h-4 mb-2" />
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-amber-400 font-bold text-xl mb-1"
              >
                🏠 {getRegion(run.regionId).name} 마을
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gray-400 mb-4"
              >
                시설을 선택하세요
              </motion.span>
              <div className="flex gap-4">
                {getRegionFacilities(run.regionId).map((facility, index) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    index={index}
                    onSelect={() => selectFacility(facility.id)}
                  />
                ))}
                {/* 마을 떠나기 카드 */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
                  transition={{ delay: getRegionFacilities(run.regionId).length * 0.1, duration: 0.3 }}
                  className="w-36 rounded-lg border-2 cursor-pointer bg-gray-800 overflow-hidden border-gray-500 hover:border-gray-400"
                  onClick={showDestinationSelection}
                >
                  <div className="py-2 text-center font-bold border-b border-gray-700 bg-gray-750 text-gray-300">
                    마을 떠나기
                  </div>
                  <div className="flex items-center justify-center py-8 text-5xl bg-gray-850">
                    🚶
                  </div>
                  <div className="px-3 py-3 text-center border-t border-gray-700 bg-gray-800">
                    <p className="text-sm text-gray-400">다음 행선지로 이동</p>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : battle.phase === 'tavern_companion' ? (
            /* 정령의 샘 - 동료 선택 모드 */
            <div className="flex flex-col items-center">
              <div className="h-8 mb-2" />
              <div className="flex items-center justify-center gap-2 mb-1 h-12">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-cyan-400 font-bold text-lg"
                >
                  🌊 유대를 맺을 정령 선택
                </motion.span>
              </div>
              <div className="flex gap-4 mb-4">
                {getTavernCompanions().map((companion, index) => (
                  <CompanionCard
                    key={companion.id}
                    companion={companion}
                    index={index}
                    isSelected={selectedCompanion === companion.id}
                    isMoving={companionMoving && selectedCompanion === companion.id}
                    onSelect={() => !companionMoving && setSelectedCompanion(companion.id)}
                  />
                ))}
              </div>
              {/* 버튼 영역 */}
              <div className="flex flex-col gap-2 items-center">
                {/* 동료 선택하기 버튼 - 선택됨 상태에서만 표시 */}
                <AnimatePresence>
                  {selectedCompanion && !companionMoving && (
                    <motion.button
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setCompanionMoving(true);
                        setTimeout(() => {
                          selectCompanion(selectedCompanion);
                          setSelectedCompanion(null);
                          setCompanionMoving(false);
                          goBackToFacilitySelection();
                        }, 900);
                      }}
                      className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
                    >
                      동료 선택하기
                    </motion.button>
                  )}
                </AnimatePresence>
                {/* 돌아가기 버튼 */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    setSelectedCompanion(null);
                    goBackToFacilitySelection();
                  }}
                  disabled={companionMoving}
                  className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                    companionMoving
                      ? 'text-gray-600 border-gray-700 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white border-gray-600 hover:border-gray-400'
                  }`}
                >
                  ← 돌아가기
                </motion.button>
              </div>
            </div>
          ) : battle.phase === 'blood_altar_reward' ? (
            /* 피의 제단 - 계약 선택 모드 */
            <div className="flex flex-col items-center">
              {/* 배경 효과 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="absolute inset-0 bg-gradient-radial from-red-900/50 to-transparent pointer-events-none"
              />

              {/* 타이틀 */}
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.4 }}
                className="text-2xl font-bold text-red-400 mb-1"
              >
                🩸 피의 제단 🩸
              </motion.span>

              {/* 부제목 */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-sm text-gray-400 italic mb-4"
              >
                "피를 바쳐라... 그 대가를 받으리라"
              </motion.span>

              {/* 계약 카드들 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="flex gap-4 mb-6 relative z-10"
              >
                {getBloodAltarRewards().map((reward, index) => (
                  <BloodAltarRewardCard
                    key={reward.id}
                    reward={reward}
                    index={index}
                    isSelected={selectedBloodAltarRewards.includes(reward.id)}
                    onToggle={() => {
                      setSelectedBloodAltarRewards(prev =>
                        prev.includes(reward.id)
                          ? prev.filter(id => id !== reward.id)
                          : [...prev, reward.id]
                      );
                    }}
                  />
                ))}
              </motion.div>

              {/* 선택 정보 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.4 }}
                className="text-gray-400 text-sm mb-4"
              >
                {selectedBloodAltarRewards.length > 0
                  ? `${selectedBloodAltarRewards.length}개 계약 선택됨`
                  : '맺을 계약을 선택하세요'}
              </motion.p>

              {/* 히든 보상 연출 */}
              <AnimatePresence>
                {showHiddenReward && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center z-50 bg-black/80"
                  >
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{
                          textShadow: [
                            '0 0 10px rgba(234, 179, 8, 0.5)',
                            '0 0 30px rgba(234, 179, 8, 0.9)',
                            '0 0 10px rgba(234, 179, 8, 0.5)',
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-3xl mb-4"
                      >
                        🔮
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-yellow-400 text-lg font-bold mb-2"
                      >
                        {BLOOD_ALTAR_HIDDEN_REWARD.message}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-yellow-300 text-sm"
                      >
                        최대 에너지 +1
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 버튼들 - 세로 배치 */}
              <div className="flex flex-col gap-3 relative z-10 items-center">
                {/* 제단에 바친다 버튼 - 1개 이상 선택 시에만 표시 */}
                <AnimatePresence>
                  {selectedBloodAltarRewards.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        if (selectedBloodAltarRewards.length > 0) {
                          // 3개 모두 선택 시 히든 보상 연출
                          if (selectedBloodAltarRewards.length === 3) {
                            setShowHiddenReward(true);
                            setTimeout(() => {
                              setShowHiddenReward(false);
                              selectBloodAltarRewards(selectedBloodAltarRewards);
                              setSelectedBloodAltarRewards([]);
                            }, 2500);
                          } else {
                            selectBloodAltarRewards(selectedBloodAltarRewards);
                            setSelectedBloodAltarRewards([]);
                          }
                        }
                      }}
                      disabled={showHiddenReward}
                      className={`
                        px-6 py-2 rounded-lg font-bold transition-all
                        ${!showHiddenReward
                          ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                      `}
                    >
                      <motion.span
                        key={selectedBloodAltarRewards.length}
                        animate={{
                          x: selectedBloodAltarRewards.length === 1
                            ? [0, -0.5, 0.5, -0.5, 0]
                            : selectedBloodAltarRewards.length === 2
                              ? [0, -1, 1, -1, 1, -0.5, 0]
                              : [0, -2, 2, -1.5, 1.5, -2, 2, -1, 0],
                        }}
                        transition={{
                          duration: selectedBloodAltarRewards.length === 3 ? 0.3 : 0.5,
                          repeat: Infinity,
                          repeatDelay: selectedBloodAltarRewards.length === 3 ? 0.1 : 0.3,
                        }}
                      >
                        제단에 바친다
                      </motion.span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* 돌아가기 버튼 */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                  onClick={() => {
                    goBackToFacilitySelection();
                    setSelectedBloodAltarRewards([]);
                  }}
                  disabled={showHiddenReward}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    showHiddenReward
                      ? 'text-gray-600 border-gray-700 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400'
                  }`}
                >
                  ← 돌아가기
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {displayEnemy && (
                  <motion.div
                    key={displayEnemy.id}
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    animate={dyingEnemy ? {
                      opacity: 0,
                      scale: 0.5,
                      y: -30,
                    } : {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    transition={{ duration: DEATH_ANIMATION_DURATION, ease: 'easeOut' }}
                  >
                    <EnemyCard
                      enemy={displayEnemy}
                      isAttacking={battle.combatAnimation.enemyAttacking}
                      isHit={battle.combatAnimation.enemyHit}
                      previewDamage={previewEffects?.damage ?? 0}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 영혼 드롭 애니메이션 (몬스터 위치) */}
              {dyingEnemy && (
                <SoulDrop
                  amount={dyingEnemy.soulReward}
                  show={showSoulDrop}
                  onComplete={handleSoulDropComplete}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* 스킬 패널 (전투 영역 하단) */}
      <div className="border-t border-gray-700 py-2 px-4">
        <SkillPanel
          skills={player.skills}
          skillStates={player.skillStates}
          lastTossResults={battle.lastTossResults}
          isPlayerTurn={isPlayerTurn}
          player={player}
          enemy={enemy}
          hoveredSkill={hoveredSkill}
          onUseSkill={useSkill}
          onSkillHover={handleSkillHover}
          onSkillDragStart={startSkillDrag}
          draggingSkillId={skillDragState.skill?.id ?? null}
        />
      </div>
    </div>

    {/* 코인 영역 */}
    <div
      className="relative flex flex-col bg-gray-800 border-t border-gray-700"
      style={{ height: 'calc((100vh - 48px) * 0.27)' }}
    >
      {/* 2-1. 상단: 코인 가치 UI (20% 높이) */}
      <div className="h-[20%] flex items-center justify-center border-b border-gray-700 bg-gray-800/50">
        {battle.lastTossResults.length > 0 ? (
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-lg">
              <span className="text-2xl">↑</span>
              <div className="flex flex-col">
                <span className="text-xs text-amber-300">앞면</span>
                <span className="text-xl font-bold text-amber-400">{headsValue}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-lg">
              <span className="text-2xl">↓</span>
              <div className="flex flex-col">
                <span className="text-xs text-blue-300">뒷면</span>
                <span className="text-xl font-bold text-blue-400">{tailsValue}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xs">코인 토스 대기 중</div>
        )}
      </div>

      {/* 2-2. 중앙: 동전 애니메이션 영역 (80% 높이) */}
      <div
        ref={coinAnimationAreaRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence>
          {battle.phase === 'player_turn' && coinTossState.isActive && coinTossState.results.length > 0 && (
            <CoinTossAnimation
              results={coinTossState.results}
              buttonPosition={coinTossState.buttonPosition}
              animationAreaBounds={coinTossState.animationAreaBounds}
              onCoinLand={handleCoinLand}
              onComplete={handleTossComplete}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 2-3. 우측: 토글 버튼 (절대 배치) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <motion.button
          ref={tossButtonRef}
          onClick={battle.hasTossedThisTurn ? handleEndTurn : handleCoinToss}
          disabled={!canAct}
          whileHover={canAct ? { scale: 1.05 } : {}}
          whileTap={canAct ? { scale: 0.95 } : {}}
          className={`
            px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2
            ${!canAct
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : battle.hasTossedThisTurn
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-yellow-600 text-white hover:bg-yellow-500'}
          `}
        >
          <span className="text-xl">
            {battle.hasTossedThisTurn ? '▶' : '🪙'}
          </span>
          <span>{battle.hasTossedThisTurn ? '턴 종료' : '코인 토스'}</span>
        </motion.button>
      </div>
    </div>

      {/* 스킬 드래그 화살표 오버레이 */}
      <DragOverlay
        isDragging={skillDragState.isDragging}
        startPosition={skillDragState.startPosition}
        position={skillDragState.position}
        targetType="enemy"
        hasDamageEffect={true}
      />
    </div>
  );
}
