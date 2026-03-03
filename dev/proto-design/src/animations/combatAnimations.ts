import { getCurrentSpeedMultiplier } from '../stores/settingsStore';

export const COMBAT_TIMING = {
  PEEK_DURATION: 0.1,
  HIT_DURATION: 0.15,
  RETURN_DURATION: 0.15,
  SHAKE_DURATION: 0.3,
  SHIELD_SHAKE: 0.2,
} as const;

export function getScaledCombatTiming() {
  const m = getCurrentSpeedMultiplier();
  return {
    PEEK_DURATION: COMBAT_TIMING.PEEK_DURATION * m,
    HIT_DURATION: COMBAT_TIMING.HIT_DURATION * m,
    RETURN_DURATION: COMBAT_TIMING.RETURN_DURATION * m,
    SHAKE_DURATION: COMBAT_TIMING.SHAKE_DURATION * m,
    SHIELD_SHAKE: COMBAT_TIMING.SHIELD_SHAKE * m,
  };
}

export const playerAttackAnimation = {
  x: [0, -20, 30, 0],
  transition: {
    duration: COMBAT_TIMING.PEEK_DURATION + COMBAT_TIMING.HIT_DURATION + COMBAT_TIMING.RETURN_DURATION,
    times: [0, 0.25, 0.6, 1],
    ease: 'easeOut' as const,
  },
};

export const enemyAttackAnimation = {
  x: [0, 20, -30, 0],
  transition: {
    duration: COMBAT_TIMING.PEEK_DURATION + COMBAT_TIMING.HIT_DURATION + COMBAT_TIMING.RETURN_DURATION,
    times: [0, 0.25, 0.6, 1],
    ease: 'easeOut' as const,
  },
};

export const hitReactAnimation = {
  x: [0, -10, 10, -5, 0],
  transition: {
    duration: COMBAT_TIMING.SHAKE_DURATION,
    times: [0, 0.2, 0.5, 0.8, 1],
    ease: 'easeOut' as const,
  },
};

export const shieldShakeAnimation = {
  rotate: [0, -15, 15, -10, 0],
  scale: [1, 1.1, 1],
  transition: {
    duration: COMBAT_TIMING.SHIELD_SHAKE,
    times: [0, 0.2, 0.5, 0.8, 1],
    ease: 'easeOut' as const,
  },
};

export const blockNumberAnimation = {
  scale: [1, 1.3, 1],
  transition: {
    duration: 0.2,
    times: [0, 0.5, 1],
    ease: 'easeOut' as const,
  },
};

export const enemyDeathAnimation = {
  opacity: [1, 0],
  scale: [1, 0.5],
  y: [0, -30],
  transition: {
    duration: 0.5,
    ease: 'easeOut' as const,
  },
};

export const TOTAL_ATTACK_DURATION =
  COMBAT_TIMING.PEEK_DURATION +
  COMBAT_TIMING.HIT_DURATION +
  COMBAT_TIMING.RETURN_DURATION;

export const DEATH_ANIMATION_DURATION = 0.5;

export function getScaledAttackDuration(): number {
  return TOTAL_ATTACK_DURATION * getCurrentSpeedMultiplier();
}

export function getScaledDeathDuration(): number {
  return DEATH_ANIMATION_DURATION * getCurrentSpeedMultiplier();
}

export function getScaledPlayerAttack() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...playerAttackAnimation,
    transition: { ...playerAttackAnimation.transition, duration: playerAttackAnimation.transition.duration * m },
  };
}

export function getScaledEnemyAttack() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...enemyAttackAnimation,
    transition: { ...enemyAttackAnimation.transition, duration: enemyAttackAnimation.transition.duration * m },
  };
}

export function getScaledHitReact() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...hitReactAnimation,
    transition: { ...hitReactAnimation.transition, duration: hitReactAnimation.transition.duration * m },
  };
}

export function getScaledShieldShake() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...shieldShakeAnimation,
    transition: { ...shieldShakeAnimation.transition, duration: shieldShakeAnimation.transition.duration * m },
  };
}

export function getScaledBlockNumber() {
  const m = getCurrentSpeedMultiplier();
  return {
    ...blockNumberAnimation,
    transition: { ...blockNumberAnimation.transition, duration: blockNumberAnimation.transition.duration * m },
  };
}
