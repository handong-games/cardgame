import type { Skill } from '../../types';

// 워리어 스킬 정의
export const WARRIOR_SKILL_DEFINITIONS: Record<string, Omit<Skill, 'id'>> = {
  // ===== 시작 스킬 (1개) =====

  basic_strike: {
    skillKey: 'basic_strike',
    name: '기본 공격',
    icon: '⚔️',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,  // 무제한
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 4, target: 'enemy' },
    ],
    description: '앞면 1로 4 데미지.',
  },

  // ===== 보상 스킬 (8개) =====

  combo_strike: {
    skillKey: 'combo_strike',
    name: '연속 베기',
    icon: '🗡️',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 2, target: 'enemy' },
    ],
    conditionalEffects: [
      {
        condition: 'last_attacked_target',
        conditionValue: 1,  // 조건 충족 여부만 체크 (값 자체는 사용 안 함)
        effect: { type: 'damage', value: 3, target: 'enemy' },
      },
    ],
    description: '앞면 1로 2 데미지. 직전 공격 대상이면 +3 데미지 (총 5).',
  },

  cleave: {
    skillKey: 'cleave',
    name: '분산 공격',
    icon: '⚡',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', value: 2, target: 'enemy' },
    ],
    description: '앞면 1로 모든 적에게 2 데미지.',
  },

  weakening_strike: {
    skillKey: 'weakening_strike',
    name: '약화 공격',
    icon: '💢',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 2, target: 'enemy' },
      { type: 'apply_debuff', value: 1, debuffId: 'weak', duration: 2 },
    ],
    description: '앞면 1로 2 데미지 + 약화 2턴 (적 공격력 -1).',
  },

  weakening_blow: {
    skillKey: 'weakening_blow',
    name: '약화의 일격',
    icon: '💥',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', value: 1, target: 'enemy' },
      { type: 'apply_debuff', value: 1, debuffId: 'weak', duration: 1 },
    ],
    description: '앞면 1로 모든 적에게 1 데미지 + 약화 1턴.',
  },

  charge_attack: {
    skillKey: 'charge_attack',
    name: '차지',
    icon: '⚡',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 1, target: 'enemy' },
      { type: 'apply_buff', value: 1, buffId: 'charge', target: 'self' },
    ],
    description: '앞면 1로 1 데미지 + 차지 버프 (다음 공격 +2).',
  },

  vulnerable_strike: {
    skillKey: 'vulnerable_strike',
    name: '취약 공격',
    icon: '🎯',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'enemy',
    effects: [
      { type: 'damage', value: 2, target: 'enemy' },
      { type: 'apply_debuff', value: 1, debuffId: 'vulnerable', duration: 2 },
    ],
    description: '앞면 1로 2 데미지 + 취약 2턴 (받는 데미지 +1).',
  },

  desperate_strike: {
    skillKey: 'desperate_strike',
    name: '절망의 일격',
    icon: '💀',
    headsCost: 0,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'enemy',
    effects: [],
    conditionalEffects: [
      {
        condition: 'all_tails',
        conditionValue: 1,  // 조건 충족 여부만 체크 (값 자체는 사용 안 함)
        effect: { type: 'damage', value: 8, target: 'enemy' },
      },
    ],
    description: '앞면이 하나도 없을 때 8 데미지.',
  },

  focus: {
    skillKey: 'focus',
    name: '집중',
    icon: '🎯',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'self',
    effects: [
      { type: 'apply_buff', value: 1, buffId: 'focus', target: 'self' },
    ],
    description: '앞면 1로 집중 버프 (2턴간 공격 +1).',
  },

  // ===== 방어 스킬 (Phase 1: 4개) =====

  defense: {
    skillKey: 'defense',
    name: '방어',
    icon: '🛡️',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'self',
    effects: [
      { type: 'block', value: 4 },
    ],
    description: '앞면 1로 이번 턴 받는 피해를 4 감소.',
  },

  regenerative_defense: {
    skillKey: 'regenerative_defense',
    name: '재생 방어',
    icon: '💚',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'self',
    effects: [
      { type: 'block', value: 2 },
      { type: 'heal', value: 1 },
    ],
    description: '앞면 1로 피해 2 감소 + 체력 1 회복.',
  },

  weakening_defense: {
    skillKey: 'weakening_defense',
    name: '약화 방어',
    icon: '💨',
    headsCost: 1,
    tailsCost: 0,
    maxUsePerTurn: 0,
    targetType: 'enemy',
    effects: [
      { type: 'block', value: 2, target: 'self' },
      { type: 'apply_debuff', value: 1, debuffId: 'weak', duration: 1 },
    ],
    description: '앞면 1로 피해 2 감소 + 적에게 약화 1턴 (공격력 -1).',
  },

  desperate_shield: {
    skillKey: 'desperate_shield',
    name: '절망의 방패',
    icon: '💀',
    headsCost: 0,
    tailsCost: 0,
    maxUsePerTurn: 1,
    targetType: 'self',
    effects: [],
    conditionalEffects: [
      {
        condition: 'all_tails',
        conditionValue: 1,
        effect: { type: 'block', value: 8 },
      },
    ],
    description: '앞면이 하나도 없을 때 피해 8 감소.',
  },
};

// 워리어 시작 스킬 키 목록
export const WARRIOR_STARTING_SKILLS = ['basic_strike', 'defense'];

// 워리어 보상 스킬 풀 (보상으로 획득 가능)
export const WARRIOR_REWARD_SKILL_POOL = [
  'combo_strike',
  'cleave',
  'weakening_strike',
  'weakening_blow',
  'charge_attack',
  'vulnerable_strike',
  'desperate_strike',
  'focus',
  // Phase 1: 기본 방어 스킬 4개
  'defense',
  'regenerative_defense',
  'weakening_defense',
  'desperate_shield',
];
