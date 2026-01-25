import type { Skill } from '../../types';

/**
 * 공용 스킬 정의
 *
 * 모든 클래스가 사용할 수 있는 공통 스킬
 */
export const COMMON_SKILL_DEFINITIONS: Record<string, Omit<Skill, 'id'>> = {
  // ===== 탐욕 스킬 =====

  seed_of_greed: {
    skillKey: 'seed_of_greed',
    name: '탐욕의 씨앗',
    icon: '🌱',
    headsCost: 0,
    tailsCost: 1,
    maxUsePerTurn: 1, // 턴당 1회
    targetType: 'self',
    effects: [
      { type: 'apply_buff', value: 1, buffId: 'greed_stack', target: 'self' },
    ],
    description:
      '뒷면 1로 탐욕 스택 1 획득. 3스택 도달 시 추가 코인 토스 발동 (앞면 = 코인 소모, 뒷면 = 무료).',
  },
};

// 공용 스킬 키 목록
export const COMMON_SKILL_KEYS = Object.keys(COMMON_SKILL_DEFINITIONS);

// 보상 풀에 포함될 공용 스킬
export const COMMON_REWARD_SKILL_POOL = [
  'seed_of_greed',
];
