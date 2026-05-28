import { useState } from 'react';
import { motion } from 'framer-motion';
import { BattleScreen } from './components/screens/BattleScreen';
import { SettingsModal } from './components/ui/SettingsModal';
import { GameButton } from './components/ui/GameButton';
import { useGameStore } from './stores/gameStore';
import { useSettingsStore } from './stores/settingsStore';
import type { CharacterClass } from './types';
import titleBg from '@assets/backgrounds/main-title-standoff.png';
import characterSelectBg from '@assets/backgrounds/캐릭터선택화면.png';
import duskfoldLogoImg from '@assets/branding/duskfold-logo.svg';
import warriorImg from '@assets/characters/CLS_W_warrior.png';
import lockedCharacterSilhouetteImg from '@assets/characters/locked-character-silhouette.png';

// [DEV] 개발자 도구 - 삭제 시 아래 2줄 제거
import { DevTools } from './dev/DevTools';
const SHOW_DEV_TOOLS = true;

type AppScreen = 'title' | 'character-select' | 'game';

const CHARACTER_OPTIONS: Array<{
  id: CharacterClass;
  name: string;
  description: string;
  image: string;
  locked?: boolean;
}> = [
  { id: 'warrior', name: '전사', description: '기본 공격과 방어로 안정적인 전투를 펼칩니다.', image: warriorImg },
  { id: 'mage', name: '마법사', description: '아직 잠금 해제되지 않았습니다.', image: lockedCharacterSilhouetteImg, locked: true },
  { id: 'rogue', name: '도적', description: '아직 잠금 해제되지 않았습니다.', image: lockedCharacterSilhouetteImg, locked: true },
];

function TitleScreen({ onStart }: { onStart: () => void }) {
  const openSettings = useSettingsStore(state => state.open);
  const [isEntering, setIsEntering] = useState(false);

  const handleStart = () => {
    if (isEntering) return;
    setIsEntering(true);
    window.setTimeout(onStart, 920);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1B1620]">
      <motion.img
        src={titleBg}
        alt="타이틀 배경"
        className="absolute inset-0 h-full w-full object-cover"
        initial={false}
        animate={isEntering ? { scale: 1.12, y: -18, filter: 'brightness(0.52) contrast(0.98) saturate(0.94)' } : { scale: 1, y: 0, filter: 'brightness(0.72) contrast(0.92) saturate(0.86)' }}
        transition={{ duration: 0.92, ease: [0.22, 0.61, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#1B1620]/40 via-[#2A2030]/34 to-[#1B1620]/86"
        animate={isEntering ? { opacity: 1 } : { opacity: 0.86 }}
        transition={{ duration: 0.7 }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,200,232,0.10),rgba(27,22,32,0.18)_44%,rgba(27,22,32,0.62)_100%)]"
        animate={isEntering ? { scale: 0.74, opacity: 0.2 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.92, ease: [0.22, 0.61, 0.36, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={isEntering ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.18 }}
        transition={{ duration: 0.82, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ background: 'radial-gradient(circle at 50% 46%, rgba(240,232,216,0.14) 0%, rgba(216,200,232,0.08) 18%, rgba(27,22,32,0.62) 46%, rgba(12,9,16,0.96) 100%)' }}
      />
      <motion.div
        className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center"
        initial={false}
        animate={isEntering ? { scale: 1.08, y: -20, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.78, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <img src={duskfoldLogoImg} alt="더스크폴드 로고" className="mb-7 h-auto w-[min(560px,78vw)] object-contain drop-shadow-[0_20px_34px_rgba(0,0,0,0.5)]" />
        <div className="flex w-72 flex-col items-stretch gap-3 sm:w-80">
          <GameButton size="lg" className="w-full py-3.5 text-lg tracking-[0.16em]" onClick={handleStart} disabled={isEntering}>새게임</GameButton>
          <GameButton size="lg" variant="secondary" className="w-full py-3.5 text-lg tracking-[0.16em]" onClick={() => undefined} disabled={isEntering}>이어하기</GameButton>
          <GameButton size="lg" variant="secondary" className="w-full py-3.5 text-lg tracking-[0.16em]" onClick={openSettings} disabled={isEntering}>설정</GameButton>
          <GameButton size="lg" variant="danger" className="w-full py-3.5 text-lg tracking-[0.16em]" onClick={() => undefined} disabled={isEntering}>종료</GameButton>
        </div>
      </motion.div>
      {isEntering && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[#0E0B12]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.36, duration: 0.54, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}

function CharacterSelectScreen({ onSelect }: { onSelect: (characterClass: CharacterClass) => void }) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('warrior');
  const [isStartingBattle, setIsStartingBattle] = useState(false);
  const selectedCharacter = CHARACTER_OPTIONS.find(option => option.id === selectedClass) ?? CHARACTER_OPTIONS[0];

  const handleBattleStart = () => {
    if (isStartingBattle) return;
    setIsStartingBattle(true);
    window.setTimeout(() => onSelect(selectedClass), 620);
  };

  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1B1620] px-8"
      initial={false}
      animate={isStartingBattle ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.58, ease: 'easeInOut' }}
    >
      <motion.img
        src={characterSelectBg}
        alt="캐릭터 선택 배경"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.08, filter: 'brightness(0.48) contrast(0.94) saturate(0.78)' }}
        animate={isStartingBattle
          ? { scale: 1.04, filter: 'brightness(0.38) contrast(0.94) saturate(0.76)' }
          : { scale: 1, filter: 'brightness(0.66) contrast(0.9) saturate(0.82)' }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#1B1620]/82 via-[#3A3040]/66 to-[#1B1620]/90"
        initial={{ opacity: 0.98 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55 }}
      />
      <motion.div
        className="absolute inset-0 bg-[#1B1620]/28"
        initial={{ opacity: 0.72 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#0E0B12]"
        initial={{ opacity: 0.68 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.76, ease: 'easeOut' }}
      />
      <motion.div
        className="relative w-full max-w-5xl rounded-[32px] border border-[#F0E8D8]/14 bg-[#1B1620]/62 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.92, y: 28 }}
        animate={isStartingBattle ? { opacity: 0, scale: 0.96, y: 12 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-[0.12em] text-[#F0E8D8]">캐릭터 선택</h2>
          <p className="mt-2 text-sm text-[#D8C8E8]/72">샘플 캐릭터 중 하나로 프로토타입 전투를 시작합니다.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CHARACTER_OPTIONS.map(option => {
            const isSelected = option.id === selectedClass;
            const isLocked = option.locked === true;
            return (
              <button
                key={option.id}
                type="button"
                disabled={isLocked || isStartingBattle}
                onClick={() => {
                  if (!isLocked) setSelectedClass(option.id);
                }}
                className={`relative rounded-[24px] border p-5 text-left transition-all ${
                  isLocked
                    ? 'cursor-not-allowed border-[#F0E8D8]/10 bg-[#1B1620]/58 opacity-72 grayscale'
                    : isSelected
                      ? 'border-[#D8C8E8]/80 bg-[#D8C8E8]/18 shadow-[0_0_28px_rgba(216,200,232,0.2)]'
                      : 'border-[#F0E8D8]/12 bg-[#F0E8D8]/7 hover:border-[#D8C8E8]/38'
                }`}
              >
                {isLocked && (
                  <div className="absolute right-4 top-4 rounded-full border border-[#F0E8D8]/20 bg-[#1B1620]/72 px-3 py-1 text-xs font-bold tracking-[0.12em] text-[#F0E8D8]/72">
                    잠김
                  </div>
                )}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`flex h-32 w-28 items-center justify-center rounded-2xl ${isLocked ? 'bg-[#F0E8D8]/24' : 'bg-[#F0E8D8]/88'}`}>
                    <img src={option.image} alt={option.name} className={`h-28 w-24 object-contain ${isLocked ? 'opacity-76' : ''}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#F0E8D8]">{option.name}</div>
                    <p className="mt-2 text-sm leading-6 text-[#F0E8D8]/68">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="text-sm text-[#F0E8D8]/64">선택: {selectedCharacter.name}</span>
          <GameButton size="lg" onClick={handleBattleStart} disabled={isStartingBattle}>전투 시작</GameButton>
        </div>
      </motion.div>
      {isStartingBattle && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[#0E0B12]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.82 }}
          transition={{ duration: 0.54, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}

function App() {
  const [screen, setScreen] = useState<AppScreen>('title');
  const startRun = useGameStore(state => state.startRun);

  if (screen === 'title') {
    return (
      <>
        <TitleScreen onStart={() => setScreen('character-select')} />
        <SettingsModal />
      </>
    );
  }

  if (screen === 'character-select') {
    return (
      <>
        <CharacterSelectScreen onSelect={(characterClass) => {
          startRun(characterClass);
          setScreen('game');
        }} />
        <SettingsModal />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="min-h-screen bg-[#16161C]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.62, ease: 'easeOut' }}
      >
        <BattleScreen />
      </motion.div>
      <SettingsModal />
      {/* [DEV] 개발자 도구 - 삭제 시 아래 1줄 제거 */}
      {SHOW_DEV_TOOLS && <DevTools />}
    </>
  );
}

export default App
