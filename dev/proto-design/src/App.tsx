import { useState } from 'react';
import { BattleScreen } from './components/screens/BattleScreen';
import { SettingsModal } from './components/ui/SettingsModal';
import { GameButton } from './components/ui/GameButton';
import { useGameStore } from './stores/gameStore';
import type { CharacterClass } from './types';
import titleBg from '@assets/backgrounds/main-title-standoff.png';
import characterSelectBg from '@assets/backgrounds/캐릭터선택화면.png';
import cardBackImg from '@assets/branding/card-back-duskfold.png';
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
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1B1620]">
      <img src={titleBg} alt="타이틀 배경" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'brightness(0.64) contrast(0.9) saturate(0.82)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B1620]/42 via-[#2A2030]/44 to-[#1B1620]/82" />
      <div className="absolute inset-0 bg-[#1B1620]/18" />
      <div className="relative flex flex-col items-center gap-8 text-center">
        <img src={cardBackImg} alt="더스크폴드 로고 마크" className="h-40 w-28 object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.42)]" />
        <div>
          <h1 className="text-6xl font-black tracking-[0.18em] text-[#F0E8D8] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">DUSKFOLD</h1>
          <p className="mt-3 text-sm font-semibold tracking-[0.34em] text-[#D8C8E8]/80">COZY DARK DECKBUILDER</p>
        </div>
        <GameButton size="lg" onClick={onStart}>시작하기</GameButton>
      </div>
    </div>
  );
}

function CharacterSelectScreen({ onSelect }: { onSelect: (characterClass: CharacterClass) => void }) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('warrior');
  const selectedCharacter = CHARACTER_OPTIONS.find(option => option.id === selectedClass) ?? CHARACTER_OPTIONS[0];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1B1620] px-8">
      <img src={characterSelectBg} alt="캐릭터 선택 배경" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'brightness(0.66) contrast(0.9) saturate(0.82)' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B1620]/82 via-[#3A3040]/66 to-[#1B1620]/90" />
      <div className="absolute inset-0 bg-[#1B1620]/28" />
      <div className="relative w-full max-w-5xl rounded-[32px] border border-[#F0E8D8]/14 bg-[#1B1620]/62 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-md">
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
                disabled={isLocked}
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
          <GameButton size="lg" onClick={() => onSelect(selectedClass)}>전투 시작</GameButton>
        </div>
      </div>
    </div>
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
      <BattleScreen />
      <SettingsModal />
      {/* [DEV] 개발자 도구 - 삭제 시 아래 1줄 제거 */}
      {SHOW_DEV_TOOLS && <DevTools />}
    </>
  );
}

export default App
