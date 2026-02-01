import type { Buff, BuffEventEffect } from '../../../types';

// 전사 버프 정의
export const WARRIOR_BUFF_DEFINITIONS: Record<string, Buff> = {
  strength: {
    id: 'strength',
    name: '힘',
    type: 'power',
    duration: 'combat',  // 전투 종료까지
    stackable: true,
    description: '공격 카드 사용 시 데미지 +1 (스택당).',
  },

  strength_long: {
    id: 'strength_long',
    name: '전쟁 함성',
    type: 'power',
    duration: 3,  // 3턴 지속
    stackable: true,
    description: '3턴간 공격 카드 사용 시 데미지 +1 (스택당).',
  },

  charge: {
    id: 'charge',
    name: '차지',
    type: 'power',
    duration: 1,  // 1회 공격 시 소모
    stackable: false,
    description: '다음 공격 데미지 +2',
  },

  focus: {
    id: 'focus',
    name: '집중',
    type: 'power',
    duration: 2,  // 2턴 지속
    stackable: false,
    description: '2턴간 공격 데미지 +1',
  },
};

// 전사 버프 이벤트 효과
export const WARRIOR_BUFF_EVENT_EFFECTS: Record<string, BuffEventEffect[]> = {
  strength: [
    {
      event: 'on_attack',
      effect: { type: 'damage', value: 1, target: 'enemy' }
    },
  ],

  strength_long: [
    {
      event: 'on_attack',
      effect: { type: 'damage', value: 1, target: 'enemy' }
    },
  ],

  charge: [
    {
      event: 'on_attack',
      effect: { type: 'damage', value: 2, target: 'enemy' }
    },
  ],

  focus: [
    {
      event: 'on_attack',
      effect: { type: 'damage', value: 1, target: 'enemy' }
    },
  ],
};
