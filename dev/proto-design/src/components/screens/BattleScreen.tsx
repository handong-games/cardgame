import { useEffect, useRef, useCallback, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { CharacterCard } from '../battle/CharacterCard';
import { EnemyCard } from '../battle/EnemyCard';
import { PlayerBuffs } from '../battle/PlayerBuffs';
import { SkillPanel } from '../battle/SkillPanel';
import { DragOverlay } from '../battle/DragOverlay';
import { RewardScreen } from './RewardScreen';
import { ShopScreen } from '../shop/ShopScreen';
import { EventScreen } from '../event/EventScreen';
import { TopBar } from '../ui/TopBar';
import { GameButton } from '../ui/GameButton';
import { useSettingsStore } from '../../stores/settingsStore';
import { CoinPouch } from '../ui/CoinPouch';
import { SoulDrop } from '../effects/SoulDrop';
import { CoinTossAnimation } from '../effects/CoinTossAnimation';
import { DEATH_ANIMATION_DURATION, getCurrentSpeedMultiplier } from '../../animations';
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
import { useAudio } from '../../hooks/useAudio';
import forestBg from '@assets/backgrounds/sunny-forest-day.png';
import nodeShopIcon from '@assets/icons/node-shop.png';
import nodeEliteIcon from '@assets/icons/node-elite.png';
import nodeEventIcon from '@assets/icons/node-event.png';
import nodeRestIcon from '@assets/icons/node-rest.png';
import companionFrameImg from '@assets/frames/frame-companion.png';
import type { BgTheme } from '../../types';

// 현재 숲 배경만 존재 — 성/던전 배경은 gamedesign에서 생성 후 추가 예정
const BG_IMAGES: Record<BgTheme, string> = {
  forest: forestBg,
  castle: forestBg,   // TODO: 성 배경 에셋 추가 시 교체
  dungeon: forestBg,  // TODO: 던전 배경 에셋 추가 시 교체
};
import companionFairyImg from '@assets/companions/moss-fairy.png';
import companionOwlImg from '@assets/companions/forest-owl.png';

const COMPANION_IMAGES: Record<string, string> = {
  moss_fairy: companionFairyImg,
  forest_owl: companionOwlImg,
};

const COMPANION_FRAME: string | null = companionFrameImg;

// 행선지 타입별 정보
const DESTINATION_INFO: Record<DestinationType, { emoji: string; iconImg?: string; label: string; color: string; border: string }> = {
  normal: { emoji: '👹', label: '몬스터', color: 'text-gray-300', border: 'border-gray-500' },
  elite: { emoji: '💀', iconImg: nodeEliteIcon, label: '엘리트', color: 'text-yellow-400', border: 'border-yellow-500' },
  rest: { emoji: '🏕️', iconImg: nodeRestIcon, label: '휴식', color: 'text-green-400', border: 'border-green-500' },
  shop: { emoji: '🛒', iconImg: nodeShopIcon, label: '상점', color: 'text-blue-400', border: 'border-blue-500' },
  event: { emoji: '❓', iconImg: nodeEventIcon, label: '이벤트', color: 'text-purple-400', border: 'border-purple-500' },
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
      {/* 이미지/이모지 영역 (캐릭터 카드 이미지 영역과 동일) */}
      <div className="flex items-center justify-center py-10 bg-gray-850">
        {info.iconImg ? (
          <img src={info.iconImg} alt={info.label} className="w-16 h-16 object-contain" />
        ) : (
          <span className="text-6xl">{info.emoji}</span>
        )}
      </div>
    </motion.div>
  );
}

// 마을 진입 연출 컴포넌트
function VillageEntrance({ regionName, onComplete }: { regionName: string; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500 * getCurrentSpeedMultiplier());
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
  const getTriggerText = () => {
    return companion.turnEffect.trigger === 'turn_start' ? '턴 시작 시' : '턴 종료 시';
  };
  const companionImage = COMPANION_IMAGES[companion.id];

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
      <div className={`py-2 text-center font-bold border-b border-gray-700 bg-gray-750 ${isSelected ? 'text-cyan-300' : 'text-cyan-400'}`}>
        {companion.name}
      </div>
      <div className="relative flex items-center justify-center py-8 bg-gray-850">
        {companionImage ? (
          <img src={companionImage} alt={companion.name} className="w-20 h-20 object-contain relative z-0" />
        ) : (
          <span className="text-5xl relative z-0">{companion.emoji}</span>
        )}
      </div>
      <div className="px-3 py-3 text-center border-t border-gray-700 bg-gray-800">
        <p className="text-xs text-cyan-300 mb-1">{getTriggerText()}</p>
        <p className="text-sm text-gray-200">{companion.description}</p>
        <p className="text-xs text-gray-500 mt-2">+ 연계 카드 획득</p>
      </div>
    </motion.div>
  );
}

function CompanionDisplayCard({ companion }: { companion: Companion }) {
  const [isHovered, setIsHovered] = useState(false);
  const getTriggerText = () => companion.turnEffect.trigger === 'turn_start' ? '턴 시작 시' : '턴 종료 시';
  const companionImage = COMPANION_IMAGES[companion.id];

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.15 }}
        className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-help shadow-lg overflow-hidden"
      >
        {COMPANION_FRAME && (
          <img src={COMPANION_FRAME} alt="" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" />
        )}
        {companionImage ? (
          <img src={companionImage} alt={companion.name} className="relative z-10 w-16 h-16 object-contain" />
        ) : (
          <span className="relative z-10 text-4xl">{companion.emoji}</span>
        )}
      </motion.div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-dark-charcoal border border-cyan-500/40 rounded-lg text-sm whitespace-nowrap z-50 shadow-xl"
          >
            <div className="font-bold text-cyan-400 mb-0.5">{companion.name}</div>
            <div className="text-xs text-gray-400">{getTriggerText()}</div>
            <div className="text-xs text-gray-300">{companion.description}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

  const { isMuted, toggleMute, switchBgm } = useAudio();

  useEffect(() => {
    const BATTLE_PHASES = new Set(['player_turn', 'enemy_turn']);
    const TOWN_PHASES = new Set([
      'village_entrance', 'village_facility', 'village_accessory',
      'tavern_companion', 'blood_altar_reward', 'destination_selection', 'shop', 'event',
    ]);

    if (BATTLE_PHASES.has(battle.phase)) {
      switchBgm('battle');
    } else if (TOWN_PHASES.has(battle.phase)) {
      switchBgm('main');
    }
  }, [battle.phase, switchBgm]);

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
  const coinPouchRef = useRef<HTMLDivElement>(null);
  const sunCountRef = useRef<HTMLDivElement>(null);
  const moonCountRef = useRef<HTMLDivElement>(null);
  const soulCounterRef = useRef<HTMLDivElement>(null);
  const [soulDropPositions, setSoulDropPositions] = useState<{ start: { x: number; y: number }; target: { x: number; y: number } } | null>(null);
  const [coinTossState, setCoinTossState] = useState<{
    isActive: boolean;
    results: CoinTossResult[];
    pouchPosition: { x: number; y: number };
    animationAreaBounds: { left: number; top: number; width: number; height: number };
    sunCountPosition: { x: number; y: number };
    moonCountPosition: { x: number; y: number };
    pouchHidden: boolean;
  }>({
    isActive: false,
    results: [],
    pouchPosition: { x: 0, y: 0 },
    animationAreaBounds: { left: 0, top: 0, width: 0, height: 0 },
    sunCountPosition: { x: 0, y: 0 },
    moonCountPosition: { x: 0, y: 0 },
    pouchHidden: false,
  });
  // 스킬 호버 프리뷰 상태
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  // 턴 배너 상태
  const [showTurnBanner, setShowTurnBanner] = useState<'player' | 'enemy' | null>(null);

  // 스킬 드래그 (적 타겟 스킬용)
  const handleSkillDropOnEnemy = useCallback((skill: Skill) => {
    useSkill(skill.id);
  }, [useSkill]);

  const { dragState: skillDragState, startDrag: startSkillDrag, registerEnemyZone } = useSkillDrag(handleSkillDropOnEnemy);

  const { resolution, uiScale: settingsUiScale, autoEndTurn } = useSettingsStore();

  const isPlayerTurn = battle.phase === 'player_turn';
  const canAct = isPlayerTurn && !battle.combatAnimation?.playerAttacking && !battle.combatAnimation?.enemyAttacking;

  // 코인 가치 계산
  const coinValues = calculateCoinValues(battle.lastTossResults);
  const headsValue = coinValues.heads;
  const tailsValue = coinValues.tails;

  // 드롭 존 refs
  const enemyZoneRef = useRef<HTMLDivElement>(null);
  const battlefieldRef = useRef<HTMLDivElement>(null);
  const playerZoneRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleCoinToss = useCallback(() => {
    if (battle.hasTossedThisTurn || coinTossState.isActive) return;

    const invScale = 1 / scale;
    let pouchPos = { x: 0, y: 0 };
    let areaPos = { left: 0, top: 0, width: 0, height: 0 };
    let sunPos = { x: 0, y: 0 };
    let moonPos = { x: 0, y: 0 };

    if (coinPouchRef.current) {
      const rect = coinPouchRef.current.getBoundingClientRect();
      pouchPos = {
        x: (rect.left - offset.x + rect.width / 2) * invScale,
        y: (rect.top - offset.y + rect.height / 2) * invScale,
      };
    }

    if (battlefieldRef.current) {
      const rect = battlefieldRef.current.getBoundingClientRect();
      areaPos = {
        left: (rect.left - offset.x) * invScale,
        top: (rect.top - offset.y) * invScale,
        width: rect.width * invScale,
        height: rect.height * invScale,
      };
    }

    if (sunCountRef.current) {
      const rect = sunCountRef.current.getBoundingClientRect();
      sunPos = {
        x: (rect.left - offset.x + rect.width / 2) * invScale,
        y: (rect.top - offset.y + rect.height / 2) * invScale,
      };
    }

    if (moonCountRef.current) {
      const rect = moonCountRef.current.getBoundingClientRect();
      moonPos = {
        x: (rect.left - offset.x + rect.width / 2) * invScale,
        y: (rect.top - offset.y + rect.height / 2) * invScale,
      };
    }

    const results = tossCoins();

    setCoinTossState({
      isActive: true,
      results,
      pouchPosition: pouchPos,
      animationAreaBounds: areaPos,
      sunCountPosition: sunPos,
      moonCountPosition: moonPos,
      pouchHidden: true,
    });
  }, [battle.hasTossedThisTurn, coinTossState.isActive, tossCoins, scale, offset]);

  // 각 동전 착지 시 콜백
  // TODO: 코인 애니메이션과 통합 필요
  const handleCoinLand = useCallback(() => {
    // 임시: 개별 코인 착지는 더 이상 사용하지 않음
    // 코인은 토스 시점에 이미 lastTossResults에 저장됨
  }, []);

  const handleTossComplete = useCallback(() => {
    setCoinTossState(prev => ({
      ...prev,
      isActive: false,
      results: [],
    }));
  }, []);

  const handleEndTurn = useCallback(() => {
    setCoinTossState({
      isActive: false,
      results: [],
      pouchPosition: { x: 0, y: 0 },
      animationAreaBounds: { left: 0, top: 0, width: 0, height: 0 },
      sunCountPosition: { x: 0, y: 0 },
      moonCountPosition: { x: 0, y: 0 },
      pouchHidden: true,
    });
    endTurn();
  }, [endTurn]);

  // 자동 턴 종료: 코인 토스 후 사용 가능한 스킬이 없으면 자동 endTurn
  useEffect(() => {
    if (!autoEndTurn || !canAct || !battle.hasTossedThisTurn || coinTossState.isActive) return;
    const { canUseSkill: checkSkill } = useGameStore.getState();
    const hasUsableSkill = player.skills.some(skill => checkSkill(skill.id).canUse);
    if (!hasUsableSkill) {
      const timer = setTimeout(handleEndTurn, 600);
      return () => clearTimeout(timer);
    }
  }, [autoEndTurn, canAct, battle.hasTossedThisTurn, coinTossState.isActive, player.skills, player.skillStates, battle.lastTossResults, handleEndTurn]);

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

  // 턴 배너 표시
  useEffect(() => {
    const m = getCurrentSpeedMultiplier();
    if (battle.phase === 'player_turn') {
      setShowTurnBanner('player');
      const timer = setTimeout(() => setShowTurnBanner(null), 1800 * m);
      return () => clearTimeout(timer);
    } else if (battle.phase === 'enemy_turn') {
      setShowTurnBanner('enemy');
      const timer = setTimeout(() => setShowTurnBanner(null), 1500 * m);
      return () => clearTimeout(timer);
    }
  }, [battle.phase]);

  useEffect(() => {
    if (battle.phase === 'player_turn') {
      setCoinTossState(prev => ({ ...prev, pouchHidden: false }));
    } else if (!['enemy_turn'].includes(battle.phase)) {
      setCoinTossState({
        isActive: false,
        results: [],
        pouchPosition: { x: 0, y: 0 },
        animationAreaBounds: { left: 0, top: 0, width: 0, height: 0 },
        sunCountPosition: { x: 0, y: 0 },
        moonCountPosition: { x: 0, y: 0 },
        pouchHidden: false,
      });
    }
  }, [battle.phase]);

  // 소울 드롭 타이머: dyingEnemy 세팅 후 사망 애니메이션 70% 지점에서 좌표 계산 + 시작
  useEffect(() => {
    if (dyingEnemy && !showSoulDrop) {
      const invScale = 1 / scale;
      let start = { x: 1300, y: 350 };
      let target = { x: 1750, y: 25 };

      if (enemyZoneRef.current) {
        const rect = enemyZoneRef.current.getBoundingClientRect();
        start = { x: (rect.left - offset.x + rect.width / 2) * invScale, y: (rect.top - offset.y + rect.height / 2) * invScale };
      }
      if (soulCounterRef.current) {
        const rect = soulCounterRef.current.getBoundingClientRect();
        target = { x: (rect.left - offset.x + rect.width / 2) * invScale, y: (rect.top - offset.y + rect.height / 2) * invScale };
      }
      setSoulDropPositions({ start, target });

      const timer = setTimeout(() => {
        setShowSoulDrop(true);
      }, DEATH_ANIMATION_DURATION * 0.7 * 1000 * getCurrentSpeedMultiplier());
      return () => clearTimeout(timer);
    }
  }, [dyingEnemy, showSoulDrop, scale]);

  // 영혼 드롭 완료 핸들러
  const handleSoulDropComplete = useCallback(() => {
    setShowSoulDrop(false);
    setDyingEnemy(null);
    prevEnemyRef.current = null;  // 무한 반복 방지
    setSoulPulse(true);

    // 펄스 효과 종료
    setTimeout(() => setSoulPulse(false), 300 * getCurrentSpeedMultiplier());
  }, []);

  const [baseW, baseH] = (() => {
    switch (resolution) {
      case '1280x720': return [1280, 720] as const;
      case '1600x900': return [1600, 900] as const;
      default: return [1920, 1080] as const;
    }
  })();

  useEffect(() => {
    const updateScale = () => {
      const s = Math.min(window.innerWidth / baseW, window.innerHeight / baseH) * settingsUiScale;
      setScale(s);
      setOffset({
        x: Math.max(0, (window.innerWidth - baseW * s) / 2),
        y: Math.max(0, (window.innerHeight - baseH * s) / 2),
      });
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseW, baseH, settingsUiScale]);

  // 스케일링 컨테이너 래퍼 (모든 phase에 동일한 1920×1080 + 레터박스 적용)
  const wrapInScale = (content: ReactNode) => (
    <div className="w-screen h-screen overflow-hidden bg-[#16161C] relative">
      <div
        className="absolute"
        style={{
          width: `${baseW}px`,
          height: `${baseH}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          left: `${offset.x}px`,
          top: `${offset.y}px`,
        }}
      >
        {content}
      </div>
    </div>
  );

  // 적 처치 동기 감지 (React render-time setState 패턴)
  // enemy가 null이 되고 phase가 victory면 사망 연출 시작
  if (prevEnemyRef.current && !enemy && battle.phase === 'victory' && dyingEnemy === null) {
    setDyingEnemy({ ...prevEnemyRef.current, hp: 0 });
  }
  if (enemy) {
    prevEnemyRef.current = enemy;
  }

  if (battle.phase === 'shop') {
    return wrapInScale(<ShopScreen />);
  }

  if (battle.phase === 'event') {
    return wrapInScale(<EventScreen />);
  }

  if ((battle.phase === 'reward' || battle.phase === 'class_advancement') && !dyingEnemy) {
    return wrapInScale(<RewardScreen />);
  }

  if (battle.phase === 'victory' && run.isComplete && !dyingEnemy) {
    return wrapInScale(
      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">🏆 런 클리어!</h1>
        <p className="text-gray-400 mb-2">모든 라운드를 클리어했습니다!</p>
        <p className="text-green-400 mb-8">
          최종 HP: {player.hp}/{player.maxHp} | 클래스: {player.characterClass === 'paladin' ? '팔라딘' : '전사'}
        </p>
        <GameButton variant="primary" size="lg" onClick={() => startRun()}>
          새 런 시작
        </GameButton>
      </div>
    );
  }

  if (battle.phase === 'victory' && !dyingEnemy) {
    return wrapInScale(
      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">승리!</h1>
        <p className="text-gray-400 mb-8">적을 처치했습니다.</p>
        <GameButton variant="primary" onClick={() => startRun()}>
          다시 시작
        </GameButton>
      </div>
    );
  }

  if (battle.phase === 'defeat') {
    return wrapInScale(
      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">패배...</h1>
        <p className="text-gray-400 mb-2">다음에는 더 잘 할 수 있을 거예요.</p>
        <p className="text-gray-500 mb-8">
          라운드 {run.round}/{run.totalRounds}에서 쓰러졌습니다.
        </p>
        <GameButton variant="danger" onClick={() => startRun()}>
          다시 시작
        </GameButton>
      </div>
    );
  }

  // 마을 진입 연출
  if (battle.phase === 'village_entrance') {
    return wrapInScale(
      <VillageEntrance
        regionName={getRegion(run.regionId).name}
        onComplete={proceedToVillageAccessory}
      />
    );
  }

  // 장신구 선택 (팝업)
  if (battle.phase === 'village_accessory') {
    return wrapInScale(
      <AccessorySelection
        regionId={run.regionId}
        onSelect={selectAccessory}
      />
    );
  }

  // 현재 표시할 적 (실제 적 또는 사망 중인 적)
  const displayEnemy = enemy || dyingEnemy;
  const regionBg = BG_IMAGES[getRegion(run.regionId).bgTheme];

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#16161C] relative">
      <div
        className="absolute"
        style={{
          width: `${baseW}px`,
          height: `${baseH}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          left: `${offset.x}px`,
          top: `${offset.y}px`,
        }}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${regionBg})` }}>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="absolute top-0 left-0 w-full h-[60px] z-20 bg-[#16161C]/90 border-b border-[#4A4A55]">
          <TopBar
            enemyName={displayEnemy?.name}
            souls={player.souls}
            soulPulse={soulPulse}
            soulCounterRef={soulCounterRef}
            accessories={run.accessories}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onOpenSettings={useSettingsStore.getState().open}
          />
        </div>

        <div
          ref={battlefieldRef}
          className="absolute top-[60px] left-0 w-full z-10"
          style={{ bottom: '160px' }}
        >
          <div className="absolute top-3 left-0 w-full flex justify-center z-20 pointer-events-none">
            <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#16161C]/70 border border-[#4A4A55]/50 backdrop-blur-sm">
              {Array.from({ length: run.totalRounds }, (_, i) => i + 1).map((round) => {
                const middleRound = Math.ceil(run.totalRounds / 2);
                const isCurrent = round === run.round;
                const isPassed = round < run.round;
                const isVillage = round === middleRound;
                const isBoss = round === run.totalRounds;

                return (
                  <div key={round} className="flex items-center">
                    {isBoss ? (
                      <span className={`text-sm ${isCurrent ? 'drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]' : isPassed ? 'opacity-40' : 'opacity-30 grayscale'}`}>☠️</span>
                    ) : isVillage ? (
                      <span className={`text-sm ${isCurrent ? '' : isPassed ? 'opacity-40' : 'opacity-30 grayscale'}`}>🏘️</span>
                    ) : (
                      <div className={`rounded-full transition-all ${isCurrent ? 'w-3 h-3 bg-[#D4A574] shadow-[0_0_6px_rgba(212,165,116,0.6)]' : isPassed ? 'w-2 h-2 bg-[#FFF5E6]/50' : 'w-2 h-2 bg-[#4A4A55]'}`} />
                    )}
                    {round < run.totalRounds && (
                      <div className={`w-3 h-0.5 mx-0.5 rounded-full ${isPassed ? 'bg-[#FFF5E6]/30' : isCurrent ? 'bg-gradient-to-r from-[#D4A574] to-[#4A4A55]' : 'bg-[#4A4A55]/60'}`} />
                    )}
                  </div>
                );
              })}
              <span className="text-xs text-[#FFF5E6]/50 ml-2">{getRegion(run.regionId).name}</span>
            </div>
          </div>
          <div className="w-full h-full flex items-center">
            <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                {run.companions.length > 0 && (
                  <div className="absolute -left-28 top-0 flex flex-col gap-1.5 z-10">
                    {run.companions.map((companion) => (
                      <CompanionDisplayCard key={companion.id} companion={companion} />
                    ))}
                  </div>
                )}
                <div ref={playerZoneRef} className="flex flex-col items-center rounded-lg transition-all">
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
                    activeBuffs={player.activeBuffs}
                  />
                  <PlayerBuffs buffs={player.activeBuffs} />
                </div>
              </div>
            </div>
            </div>
            <div className="w-[400px] shrink-0 self-stretch flex flex-col items-center">
              <div className="flex-[5]" />
              <AnimatePresence>
                {isPlayerTurn && (
                  <motion.div
                    key="coin-actions"
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="scale-[2] mb-2">
                      <AnimatePresence>
                        {!coinTossState.pouchHidden && (
                          <motion.div ref={coinPouchRef} initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
                            <CoinPouch onToss={handleCoinToss} disabled={!canAct || battle.hasTossedThisTurn} isOpen={coinTossState.isActive} showHint={!battle.hasTossedThisTurn} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl border transition-opacity ${
                      battle.lastTossResults.length > 0
                        ? 'bg-[#1E1E24] border-[#4A4A55] opacity-100'
                        : 'opacity-0 pointer-events-none'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div ref={sunCountRef} className="flex items-center gap-1.5">
                          <span className="text-lg">☀️</span>
                          <span className="text-lg font-bold text-[#FFD700]">{headsValue}</span>
                        </div>
                        <div className="w-px h-5 bg-[#4A4A55]" />
                        <div ref={moonCountRef} className="flex items-center gap-1.5">
                          <span className="text-lg">🌙</span>
                          <span className="text-lg font-bold text-[#C0C0C0]">{tailsValue}</span>
                        </div>
                      </div>
                    </div>
                    <GameButton
                      variant="primary"
                      size="sm"
                      onClick={handleEndTurn}
                      disabled={!canAct || !battle.hasTossedThisTurn}
                    >
                      ▶ 턴 종료
                    </GameButton>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex-1" />
            </div>
            <div className="flex-1 flex items-center justify-center">
            <div
              ref={enemyZoneRef}
              className="flex flex-col items-center transition-all rounded-lg relative"
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
                    <GameButton
                      variant="primary"
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
                        }, 900 * getCurrentSpeedMultiplier());
                      }}
                    >
                      동료 선택하기
                    </GameButton>
                  )}
                </AnimatePresence>
                {/* 돌아가기 버튼 */}
                <GameButton
                  variant="secondary"
                  size="sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    setSelectedCompanion(null);
                    goBackToFacilitySelection();
                  }}
                  disabled={companionMoving}
                >
                  ← 돌아가기
                </GameButton>
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
                    <GameButton
                      variant="danger"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        if (selectedBloodAltarRewards.length > 0) {
                          if (selectedBloodAltarRewards.length === 3) {
                            setShowHiddenReward(true);
                            setTimeout(() => {
                              setShowHiddenReward(false);
                              selectBloodAltarRewards(selectedBloodAltarRewards);
                              setSelectedBloodAltarRewards([]);
                            }, 2500 * getCurrentSpeedMultiplier());
                          } else {
                            selectBloodAltarRewards(selectedBloodAltarRewards);
                            setSelectedBloodAltarRewards([]);
                          }
                        }
                      }}
                      disabled={showHiddenReward}
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
                    </GameButton>
                  )}
                </AnimatePresence>

                {/* 돌아가기 버튼 */}
                <GameButton
                  variant="secondary"
                  size="sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                  onClick={() => {
                    goBackToFacilitySelection();
                    setSelectedBloodAltarRewards([]);
                  }}
                  disabled={showHiddenReward}
                >
                  ← 돌아가기
                </GameButton>
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
                    transition={{ duration: DEATH_ANIMATION_DURATION * getCurrentSpeedMultiplier(), ease: 'easeOut' }}
                  >
                    <EnemyCard
                      enemy={displayEnemy}
                      isAttacking={battle.combatAnimation.enemyAttacking}
                      isHit={battle.combatAnimation.enemyHit}
                      previewDamage={previewEffects?.damage ?? 0}
                      isTargeted={skillDragState.isDragging && skillDragState.isOverEnemy}
                      isBoss={run.round === run.totalRounds}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

            </>
           )}
            </div>
            </div>
          </div>

          <AnimatePresence>
            {coinTossState.isActive && coinTossState.results.length > 0 && (
              <CoinTossAnimation
                results={coinTossState.results}
                pouchPosition={coinTossState.pouchPosition}
                animationAreaBounds={coinTossState.animationAreaBounds}
                sunCountPosition={coinTossState.sunCountPosition}
                moonCountPosition={coinTossState.moonCountPosition}
                onCoinLand={handleCoinLand}
                onComplete={handleTossComplete}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTurnBanner && (
               <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.8, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: 10, transition: { duration: 0.25 } }}
                transition={{ duration: 0.35, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className={`px-16 py-5 rounded-2xl backdrop-blur-md border ${showTurnBanner === 'player' ? 'bg-amber-900/60 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'bg-red-900/60 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]'}`}>
                  <span className={`text-4xl font-black tracking-wider ${showTurnBanner === 'player' ? 'text-amber-400' : 'text-red-400'}`}>
                    {showTurnBanner === 'player' ? '⚔️ 당신의 턴' : '💀 적의 턴'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


        </div>

        <div
          className={`absolute bottom-0 left-0 w-full h-[160px] z-20 border-t ${isPlayerTurn ? 'border-amber-500/40' : 'border-red-500/30'}`}
          style={{ background: 'linear-gradient(to bottom, #16161C, #1E1E24)' }}
        >
          <div className="flex items-center justify-center h-full overflow-visible">
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

        {dyingEnemy && soulDropPositions && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 60 }}>
            <SoulDrop
              amount={dyingEnemy.soulReward}
              show={showSoulDrop}
              startPosition={soulDropPositions.start}
              targetPosition={soulDropPositions.target}
              onComplete={handleSoulDropComplete}
            />
          </div>
        )}

        <DragOverlay
          isDragging={skillDragState.isDragging}
          startPosition={skillDragState.startPosition}
          position={skillDragState.position}
          targetType="enemy"
          hasDamageEffect={true}
        />
      </div>
    </div>
  );
}
