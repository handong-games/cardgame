import { getCurrentSpeedMultiplier } from '../stores/settingsStore';

export const COIN_ANIMATION_TIMING = {
  TOSS_DURATION: 0.8,
  COIN_STAGGER: 0.1,
  RESULT_DISPLAY: 1.5,
} as const;

export const COIN_TOSS_PHYSICS = {
  FLIGHT_DURATION: 0.6,
  COIN_STAGGER: 0.1,
  LANDING_DISPLAY: 0.5,
  TOTAL_DURATION: 1.1,
} as const;

export function getScaledCoinPhysics() {
  const m = getCurrentSpeedMultiplier();
  return {
    FLIGHT_DURATION: COIN_TOSS_PHYSICS.FLIGHT_DURATION * m,
    COIN_STAGGER: COIN_TOSS_PHYSICS.COIN_STAGGER * m,
    LANDING_DISPLAY: COIN_TOSS_PHYSICS.LANDING_DISPLAY * m,
    TOTAL_DURATION: COIN_TOSS_PHYSICS.TOTAL_DURATION * m,
  };
}

export const coinTossAnimation = {
  initial: {
    y: 0,
    rotateY: 0,
    scale: 0.5,
    opacity: 0,
  },
  animate: {
    y: [-50, -100, -50, 0],
    rotateY: [0, 180, 360, 540, 720],
    scale: 1,
    opacity: 1,
  },
  transition: {
    duration: COIN_ANIMATION_TIMING.TOSS_DURATION,
    ease: 'easeOut',
  },
};

export const headsEffect = {
  boxShadow: [
    '0 0 0px rgba(234, 179, 8, 0)',
    '0 0 20px rgba(234, 179, 8, 0.8)',
    '0 0 10px rgba(234, 179, 8, 0.5)',
  ],
  scale: [1, 1.1, 1],
  transition: {
    duration: 0.3,
    delay: COIN_ANIMATION_TIMING.TOSS_DURATION,
  },
};

export const tailsEffect = {
  opacity: [1, 0.5],
  scale: [1, 0.9],
  transition: {
    duration: 0.2,
    delay: COIN_ANIMATION_TIMING.TOSS_DURATION,
  },
};

export function getScaledCoinTossAnimation() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...coinTossAnimation,
    transition: { ...coinTossAnimation.transition, duration: coinTossAnimation.transition.duration * m },
  };
}

export function getScaledHeadsEffect() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...headsEffect,
    transition: { duration: headsEffect.transition.duration * m, delay: headsEffect.transition.delay * m },
  };
}

export function getScaledTailsEffect() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...tailsEffect,
    transition: { duration: tailsEffect.transition.duration * m, delay: tailsEffect.transition.delay * m },
  };
}
