import { useEffect, useCallback, useRef } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

const TRACKS: Record<string, HTMLAudioElement> = {};

type TrackName = 'battle' | 'main';

const FADE_DURATION_MS = 500;
const FADE_INTERVAL_MS = 25;
const FADE_STEPS = FADE_DURATION_MS / FADE_INTERVAL_MS;

function fadeOut(audio: HTMLAudioElement | undefined): Promise<void> {
  return new Promise((resolve) => {
    if (!audio || audio.paused) {
      resolve();
      return;
    }
    const startVolume = audio.volume;
    const step = startVolume / FADE_STEPS;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newVolume = startVolume - step * currentStep;
      audio.volume = Math.max(0, newVolume);

      if (currentStep >= FADE_STEPS) {
        clearInterval(interval);
        audio.pause();
        audio.volume = startVolume;
        resolve();
      }
    }, FADE_INTERVAL_MS);
  });
}

function fadeIn(audio: HTMLAudioElement | undefined, targetVolume: number): void {
  if (!audio) return;
  audio.volume = 0;
  audio.play().catch(() => {});

  const step = targetVolume / FADE_STEPS;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const newVolume = step * currentStep;
    audio.volume = Math.min(targetVolume, newVolume);

    if (currentStep >= FADE_STEPS) {
      clearInterval(interval);
      audio.volume = targetVolume;
    }
      }, FADE_INTERVAL_MS);
}

let autoplayResumed = false;
let pendingTrack: TrackName | null = null;
let pendingVolume = 0.5;

function resumeAudio(): void {
  autoplayResumed = true;
  if (pendingTrack) {
    const audio = TRACKS[pendingTrack];
    if (audio) {
      audio.volume = pendingVolume;
      audio.play().catch(() => {});
    }
    pendingTrack = null;
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', resumeAudio, { once: true });
}

export function useAudio() {
  const isMuted = useSettingsStore((s) => s.isMuted);
  const volume = useSettingsStore((s) => s.masterVolume);
  const toggleMute = useSettingsStore((s) => s.toggleMute);
  const setVolume = useSettingsStore((s) => s.setMasterVolume);
  const currentTrackRef = useRef<TrackName | null>(null);

  useEffect(() => {
    const track = currentTrackRef.current;
    if (!track) return;
    const audio = TRACKS[track];
    if (audio) audio.volume = isMuted ? 0 : volume;
  }, [isMuted, volume]);

  const switchBgm = useCallback(
    (trackName: 'battle' | 'main') => {
      if (currentTrackRef.current === trackName) return;

      const prevTrack = currentTrackRef.current;
      currentTrackRef.current = trackName;

      const targetVolume = isMuted ? 0 : volume;
      const newAudio = TRACKS[trackName];

      if (prevTrack) {
        const oldAudio = TRACKS[prevTrack];
        fadeOut(oldAudio);
        if (autoplayResumed) {
          fadeIn(newAudio, targetVolume);
        } else {
          pendingTrack = trackName;
          pendingVolume = targetVolume;
        }
      } else {
        if (autoplayResumed) {
          fadeIn(newAudio, targetVolume);
        } else {
          pendingTrack = trackName;
          pendingVolume = targetVolume;
        }
      }
    },
    [isMuted, volume],
  );

  return { isMuted, volume, toggleMute, setVolume, switchBgm };
}
