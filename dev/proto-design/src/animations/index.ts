export {
  COMBAT_TIMING,
  TOTAL_ATTACK_DURATION,
  DEATH_ANIMATION_DURATION,
  playerAttackAnimation,
  enemyAttackAnimation,
  hitReactAnimation,
  shieldShakeAnimation,
  blockNumberAnimation,
  enemyDeathAnimation,
  getScaledCombatTiming,
  getScaledAttackDuration,
  getScaledDeathDuration,
  getScaledPlayerAttack,
  getScaledEnemyAttack,
  getScaledHitReact,
  getScaledShieldShake,
  getScaledBlockNumber,
} from './combatAnimations';

export {
  COIN_ANIMATION_TIMING,
  COIN_TOSS_PHYSICS,
  coinTossAnimation,
  headsEffect,
  tailsEffect,
  getScaledCoinPhysics,
  getScaledCoinTossAnimation,
  getScaledHeadsEffect,
  getScaledTailsEffect,
} from './coinAnimations';

export { getSpeedMultiplier, getCurrentSpeedMultiplier } from '../stores/settingsStore';
