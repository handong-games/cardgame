import type { Skill } from '../../types';

// 팔라딘 기본 스킬 정의
export const PALADIN_SKILL_DEFINITIONS: Record<string, Omit<Skill, 'id'>> = {
  // 기본 스킬 (시작 시 보유)
  holy_strike: {
    skillKey: 'holy_strike',
    name: '성스러운 일격',
    icon: '✨',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,  // 무제한
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 5, target: 'enemy' },
    ],
    description: '5 데미지.',
  },

  divine_shield: {
    skillKey: 'divine_shield',
    name: '신성한 방패',
    icon: '🛡️',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,  // 무제한
    targetType: 'self',
    effects: [
      { type: 'block', value: 6, target: 'self' },
    ],
    description: '6 방어.',
  },

  heal: {
    skillKey: 'heal',
    name: '치유',
    icon: '💚',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'self',
    effects: [
      { type: 'heal', value: 5, target: 'self' },
    ],
    description: '앞면 2로 HP 5 회복.',
  },

  // 획득 가능 스킬 (보상/상점)
  smite: {
    skillKey: 'smite',
    name: '천벌',
    icon: '⚡',
    headsCost: 3,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 15, target: 'enemy' },
    ],
    description: '앞면 3으로 15 데미지.',
  },

  blessing: {
    skillKey: 'blessing',
    name: '축복',
    icon: '🙏',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 1,
    cooldown: 2,
    targetType: 'self',
    effects: [
      { type: 'block', value: 8, target: 'self' },
      { type: 'heal', value: 3, target: 'self' },
    ],
    description: '앞면 2로 8 방어, HP 3 회복. 2턴 쿨다운.',
  },

  consecrate: {
    skillKey: 'consecrate',
    name: '봉헌',
    icon: '☀️',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 2,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 8, target: 'enemy' },
    ],
    description: '앞면 2로 8 데미지.',
  },

  guardian_spirit: {
    skillKey: 'guardian_spirit',
    name: '수호 정령',
    icon: '👼',
    headsCost: 3,
    tailsCost: 0,
    maxUsePerTurn: 1,
    cooldown: 3,
    targetType: 'self',
    effects: [
      { type: 'block', value: 15, target: 'self' },
    ],
    description: '앞면 3으로 15 방어. 3턴 쿨다운.',
  },

  holy_vengeance: {
    skillKey: 'holy_vengeance',
    name: '신성한 복수',
    icon: '🔱',
    headsCost: 2,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 10, target: 'enemy' },
      { type: 'heal', value: 3, target: 'self' },
    ],
    description: '앞면 2로 10 데미지, HP 3 회복.',
  },
};

// 팔라딘 시작 스킬 키 목록
export const PALADIN_STARTING_SKILLS = ['holy_strike', 'divine_shield', 'heal'];

// 팔라딘 보상 스킬 풀 (보상으로 획득 가능)
export const PALADIN_REWARD_SKILL_POOL = [
  'smite',
  'blessing',
  'consecrate',
  'guardian_spirit',
  'holy_vengeance',
];
