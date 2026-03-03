import { useSettingsStore, getSpeedMultiplier } from '../stores/settingsStore';

export function useAnimSpeed(): number {
  const speed = useSettingsStore(s => s.animationSpeed);
  return getSpeedMultiplier(speed);
}
