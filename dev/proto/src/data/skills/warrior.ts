import type { Skill } from '../../types';
import { BALANCE_VALUES as BV } from './balance-values';

// 워리어 기본 스킬 정의
export const WARRIOR_SKILL_DEFINITIONS: Record<string, Omit<Skill, 'id'>> = {
  // ===== 시작 스킬 (3개) - 무조건 효율 =====

  strike: {
    skillKey: 'strike',
    name: '강타',
    icon: '⚔️',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,  // 무제한
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: BV.cost1.max, target: 'enemy' },
    ],
    description: `앞면 1로 ${BV.cost1.max} 데미지.`,
  },

  defend: {
    skillKey: 'defend',
    name: '방어',
    icon: '🛡️',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,  // 무제한
    targetType: 'self',
    effects: [
      { type: 'block', value: BV.cost1.min, target: 'self' },
    ],
    description: `앞면 1로 ${BV.cost1.min} 방어.`,
  },

  bash: {
    skillKey: 'bash',
    name: '강타',
    icon: '💥',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 2,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: BV.cost2.min, target: 'enemy' },
    ],
    description: `앞면 2로 ${BV.cost2.min} 데미지.`,
  },

  // ===== 보상 스킬 (10개) - 상황별 특화 =====

  power_strike: {
    skillKey: 'power_strike',
    name: '파워 스트라이크',
    icon: '🔥',
    headsCost: 3,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: BV.cost3.max, target: 'enemy' },
    ],
    description: `앞면 3으로 ${BV.cost3.max} 데미지.`,
  },

  iron_wall: {
    skillKey: 'iron_wall',
    name: '철벽',
    icon: '🏰',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 2,
    targetType: 'self',
    effects: [
      { type: 'block', value: 12, target: 'self' },
    ],
    description: '앞면 2로 12 방어.',
  },

  reckless_charge: {
    skillKey: 'reckless_charge',
    name: '무모한 돌진',
    icon: '🐂',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 14, target: 'enemy' },
      { type: 'damage', value: 3, target: 'self' },  // 자해
    ],
    description: '앞면 2로 14 데미지. 자신에게 3 데미지.',
  },

  battle_cry: {
    skillKey: 'battle_cry',
    name: '전투 함성',
    icon: '📢',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 1,
    cooldown: 2,
    targetType: 'self',
    effects: [
      { type: 'apply_buff', value: 2, buffId: 'strength', target: 'self' },
    ],
    description: '앞면 1로 힘 +2. 2턴 쿨다운.',
  },

  counter_attack: {
    skillKey: 'counter_attack',
    name: '반격',
    icon: '↩️',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'self',
    effects: [
      { type: 'block', value: 6, target: 'self' },
      { type: 'damage', value: 6, target: 'enemy' },
    ],
    description: '앞면 2로 6 방어, 6 데미지.',
  },

  // ===== 신규 스킬 (5개) =====

  execute: {
    skillKey: 'execute',
    name: '처형',
    icon: '🪓',
    headsCost: 3,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 12, target: 'enemy' },
    ],
    conditionalEffects: [
      {
        condition: 'enemy_hp_below',
        conditionValue: 50,  // 적 HP 50% 미만
        effect: { type: 'damage', value: 13, target: 'enemy' },  // 총 25 데미지
      },
    ],
    description: '앞면 3으로 12 데미지. 적 HP 50% 미만 시 25 데미지.',
  },

  last_stand: {
    skillKey: 'last_stand',
    name: '최후의 저항',
    icon: '⚡',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 8, target: 'enemy' },
    ],
    conditionalEffects: [
      {
        condition: 'hp_below',
        conditionValue: 40,  // HP 40% 미만
        effect: { type: 'damage', value: 8, target: 'enemy' },  // 총 16 데미지
      },
    ],
    description: '앞면 2로 8 데미지. HP 40% 미만 시 16 데미지.',
  },

  shield_bash: {
    skillKey: 'shield_bash',
    name: '방패 강타',
    icon: '🛡️⚔️',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 2,
    targetType: 'self',
    effects: [
      { type: 'damage', value: 8, target: 'enemy' },
      { type: 'block', value: 4, target: 'self' },
    ],
    description: '앞면 2로 8 데미지, 4 방어.',
  },

  war_banner: {
    skillKey: 'war_banner',
    name: '전쟁 깃발',
    icon: '🚩',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 1,
    cooldown: 3,
    targetType: 'self',
    effects: [
      { type: 'apply_buff', value: 3, buffId: 'strength_long', target: 'self' },
    ],
    description: '앞면 2로 전쟁 함성 +3 (3턴 지속). 3턴 쿨다운.',
  },

  coin_salvage: {
    skillKey: 'coin_salvage',
    name: '코인 회수',
    icon: '💰',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 1,
    cooldown: 2,
    targetType: 'self',
    effects: [
      { type: 'block', value: 4, target: 'self' },
      { type: 'coin_gain', value: 1, target: 'self' },
    ],
    description: '앞면 1로 4 방어, 코인 1 획득. 2턴 쿨다운.',
  },
};

// 워리어 시작 스킬 키 목록
export const WARRIOR_STARTING_SKILLS = ['strike', 'defend', 'bash'];

// 워리어 보상 스킬 풀 (보상으로 획득 가능)
export const WARRIOR_REWARD_SKILL_POOL = [
  // 기존 스킬
  'power_strike',
  'iron_wall',
  'reckless_charge',
  'battle_cry',
  'counter_attack',
  // 신규 스킬
  'execute',
  'last_stand',
  'shield_bash',
  'war_banner',
  'coin_salvage',
];
