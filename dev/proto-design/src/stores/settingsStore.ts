import { create } from 'zustand';

export type ResolutionPreset = '1280x720' | '1600x900' | '1920x1080';
export type AnimationSpeed = 'normal' | 'fast' | 'skip';

interface SettingsState {
  isOpen: boolean;

  resolution: ResolutionPreset;
  uiScale: number;
  fullscreen: boolean;

  masterVolume: number;
  isMuted: boolean;

  animationSpeed: AnimationSpeed;
  autoEndTurn: boolean;
}

interface SettingsActions {
  open: () => void;
  close: () => void;

  setResolution: (r: ResolutionPreset) => void;
  setUiScale: (s: number) => void;
  setFullscreen: (f: boolean) => void;
  toggleFullscreen: () => void;

  setMasterVolume: (v: number) => void;
  toggleMute: () => void;

  setAnimationSpeed: (s: AnimationSpeed) => void;
  setAutoEndTurn: (v: boolean) => void;

  resetToDefaults: () => void;
}

const STORAGE_KEY = 'gameSettings';

const DEFAULTS: Omit<SettingsState, 'isOpen'> = {
  resolution: '1920x1080',
  uiScale: 1,
  fullscreen: false,
  masterVolume: 0.5,
  isMuted: false,
  animationSpeed: 'normal',
  autoEndTurn: false,
};

function loadFromStorage(): Partial<Omit<SettingsState, 'isOpen'>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Omit<SettingsState, 'isOpen'>>;
  } catch {
    return {};
  }
}

function saveToStorage(state: Omit<SettingsState, 'isOpen'>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* localStorage unavailable */ }
}

function getPersistedState(): Omit<SettingsState, 'isOpen'> {
  return { ...DEFAULTS, ...loadFromStorage() };
}

const RESOLUTION_BASE_WIDTHS: Record<ResolutionPreset, number> = {
  '1280x720': 1280,
  '1600x900': 1600,
  '1920x1080': 1920,
};

export function getBaseWidth(resolution: ResolutionPreset): number {
  return RESOLUTION_BASE_WIDTHS[resolution];
}

const SPEED_MULTIPLIERS: Record<AnimationSpeed, number> = {
  normal: 1,
  fast: 0.5,
  skip: 0.2,
};

export function getSpeedMultiplier(speed: AnimationSpeed): number {
  return SPEED_MULTIPLIERS[speed];
}

/** 비-React 컨텍스트(gameStore 등)에서 현재 속도 배율을 직접 읽기 */
export function getCurrentSpeedMultiplier(): number {
  return SPEED_MULTIPLIERS[useSettingsStore.getState().animationSpeed];
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => {
  const persisted = getPersistedState();

  function persist() {
    const { isOpen: _, open: _o, close: _c, ...rest } = get() as SettingsState & SettingsActions;
    const state: Omit<SettingsState, 'isOpen'> = {
      resolution: rest.resolution,
      uiScale: rest.uiScale,
      fullscreen: rest.fullscreen,
      masterVolume: rest.masterVolume,
      isMuted: rest.isMuted,
      animationSpeed: rest.animationSpeed,
      autoEndTurn: rest.autoEndTurn,
    };
    saveToStorage(state);
  }

  return {
    isOpen: false,
    ...persisted,

    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),

    setResolution: (resolution) => {
      set({ resolution });
      persist();
    },
    setUiScale: (uiScale) => {
      set({ uiScale: Math.max(0.5, Math.min(2, uiScale)) });
      persist();
    },
    setFullscreen: (fullscreen) => {
      set({ fullscreen });
      if (fullscreen) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
      persist();
    },
    toggleFullscreen: () => {
      const next = !get().fullscreen;
      get().setFullscreen(next);
    },

    setMasterVolume: (v) => {
      set({ masterVolume: Math.max(0, Math.min(1, v)) });
      persist();
    },
    toggleMute: () => {
      set({ isMuted: !get().isMuted });
      persist();
    },

    setAnimationSpeed: (animationSpeed) => {
      set({ animationSpeed });
      persist();
    },
    setAutoEndTurn: (autoEndTurn) => {
      set({ autoEndTurn });
      persist();
    },

    resetToDefaults: () => {
      set({ ...DEFAULTS });
      persist();
    },
  };
});
