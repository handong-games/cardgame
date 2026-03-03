import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../stores/settingsStore';
import type { ResolutionPreset, AnimationSpeed } from '../../stores/settingsStore';

type Tab = 'display' | 'audio' | 'gameplay';

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'display', icon: '🖥️', label: '디스플레이' },
  { key: 'audio', icon: '🔊', label: '사운드' },
  { key: 'gameplay', icon: '🎮', label: '게임플레이' },
];

const RESOLUTIONS: { value: ResolutionPreset; label: string }[] = [
  { value: '1280x720', label: '1280 × 720' },
  { value: '1600x900', label: '1600 × 900' },
  { value: '1920x1080', label: '1920 × 1080 (권장)' },
];

const ANIM_SPEEDS: { value: AnimationSpeed; label: string }[] = [
  { value: 'normal', label: '보통' },
  { value: 'fast', label: '빠르게' },
  { value: 'skip', label: '스킵' },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors ${on ? 'bg-[#D4A574]' : 'bg-gray-600'}`}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function RadioGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
            value === opt.value
              ? 'bg-[#2A2A32] text-gray-100'
              : 'text-gray-400 hover:bg-[#2A2A32]/50 hover:text-gray-200'
          }`}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            value === opt.value ? 'border-[#D4A574]' : 'border-gray-500'
          }`}>
            {value === opt.value && (
              <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
            )}
          </div>
          <span className="text-sm">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none bg-gray-600 accent-[#D4A574] cursor-pointer"
      />
      <span className="text-sm text-[#D4A574] font-bold w-12 text-right">{display}</span>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-100">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function DisplayTab() {
  const resolution = useSettingsStore((s) => s.resolution);
  const setResolution = useSettingsStore((s) => s.setResolution);
  const uiScale = useSettingsStore((s) => s.uiScale);
  const setUiScale = useSettingsStore((s) => s.setUiScale);
  const fullscreen = useSettingsStore((s) => s.fullscreen);
  const toggleFullscreen = useSettingsStore((s) => s.toggleFullscreen);

  return (
    <div className="space-y-1">
      <div className="py-3">
        <div className="text-sm font-medium text-gray-100 mb-2">해상도</div>
        <RadioGroup value={resolution} onChange={setResolution} options={RESOLUTIONS} />
      </div>
      <div className="border-t border-[#4A4A55]/50" />
      <SettingRow label="UI 스케일" description={`${Math.round(uiScale * 100)}%`}>
        <div className="w-40">
          <Slider
            value={uiScale}
            min={0.5}
            max={2}
            step={0.1}
            onChange={setUiScale}
            display={`${Math.round(uiScale * 100)}%`}
          />
        </div>
      </SettingRow>
      <div className="border-t border-[#4A4A55]/50" />
      <SettingRow label="전체화면">
        <Toggle on={fullscreen} onToggle={toggleFullscreen} />
      </SettingRow>
    </div>
  );
}

function AudioTab() {
  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const setMasterVolume = useSettingsStore((s) => s.setMasterVolume);
  const isMuted = useSettingsStore((s) => s.isMuted);
  const toggleMute = useSettingsStore((s) => s.toggleMute);

  return (
    <div className="space-y-1">
      <SettingRow label="마스터 볼륨">
        <div className="w-40">
          <Slider
            value={masterVolume * 100}
            min={0}
            max={100}
            step={1}
            onChange={(v) => setMasterVolume(v / 100)}
            display={`${Math.round(masterVolume * 100)}%`}
          />
        </div>
      </SettingRow>
      <div className="border-t border-[#4A4A55]/50" />
      <SettingRow label="음소거">
        <Toggle on={isMuted} onToggle={toggleMute} />
      </SettingRow>
    </div>
  );
}

function GameplayTab() {
  const animationSpeed = useSettingsStore((s) => s.animationSpeed);
  const setAnimationSpeed = useSettingsStore((s) => s.setAnimationSpeed);
  const autoEndTurn = useSettingsStore((s) => s.autoEndTurn);
  const setAutoEndTurn = useSettingsStore((s) => s.setAutoEndTurn);

  return (
    <div className="space-y-1">
      <div className="py-3">
        <div className="text-sm font-medium text-gray-100 mb-2">애니메이션 속도</div>
        <RadioGroup value={animationSpeed} onChange={setAnimationSpeed} options={ANIM_SPEEDS} />
      </div>
      <div className="border-t border-[#4A4A55]/50" />
      <SettingRow label="자동 턴 종료" description="행동 불가 시 자동으로 턴을 종료합니다">
        <Toggle on={autoEndTurn} onToggle={() => setAutoEndTurn(!autoEndTurn)} />
      </SettingRow>
    </div>
  );
}

const TAB_CONTENT: Record<Tab, () => JSX.Element> = {
  display: DisplayTab,
  audio: AudioTab,
  gameplay: GameplayTab,
};

export function SettingsModal() {
  const isOpen = useSettingsStore((s) => s.isOpen);
  const close = useSettingsStore((s) => s.close);
  const resetToDefaults = useSettingsStore((s) => s.resetToDefaults);
  const [activeTab, setActiveTab] = useState<Tab>('display');

  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="bg-[#1E1E24] border border-[#4A4A55] rounded-2xl shadow-2xl w-[480px] max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#4A4A55]">
              <span className="text-lg font-bold text-gray-100">⚙️ 설정</span>
              <button
                type="button"
                onClick={close}
                className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-[#4A4A55]">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-[#2A2A32] text-[#D4A574] border-b-2 border-[#D4A574]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#2A2A32]/40'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2 min-h-[240px]">
              <ActiveContent />
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-[#4A4A55]">
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-sm text-gray-500 hover:text-red-400 transition-colors"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={close}
                className="px-5 py-1.5 rounded-lg bg-[#2A2A32] text-gray-200 hover:bg-[#3A3A42] transition-colors text-sm font-medium"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
