import type { Buff, BuffEventEffect } from '../../../types';

// 팔라딘 버프 정의
export const PALADIN_BUFF_DEFINITIONS: Record<string, Buff> = {
  aura_of_devotion: {
    id: 'aura_of_devotion',
    name: '헌신의 오라',
    type: 'power',
    duration: 3,  // 3턴 지속
    stackable: false,
    description: '3턴간 턴 시작 시 2 방어. 공격 카드 사용 시 +1 데미지.',
  },

  justice_aura: {
    id: 'justice_aura',
    name: '정의의 오라',
    type: 'power',
    duration: 3,
    stackable: false,
    description: '3턴간 공격 카드 사용 시 +2 데미지.',
  },

  guardian_aura: {
    id: 'guardian_aura',
    name: '수호의 오라',
    type: 'power',
    duration: 3,
    stackable: false,
    description: '3턴간 턴 시작 시 +4 방어.',
  },
};

// 팔라딘 버프 이벤트 효과
export const PALADIN_BUFF_EVENT_EFFECTS: Record<string, BuffEventEffect[]> = {
  aura_of_devotion: [
    {
      event: 'turn_start',
      effect: { type: 'block', value: 2, target: 'self' }
    },
    {
      event: 'on_attack',
      effect: { type: 'damage', value: 1, target: 'enemy' }
    },
  ],

  justice_aura: [
    {
      event: 'on_attack',
      effect: { type: 'damage', value: 2, target: 'enemy' }
    },
  ],

  guardian_aura: [
    {
      event: 'turn_start',
      effect: { type: 'block', value: 4, target: 'self' }
    },
  ],
};
