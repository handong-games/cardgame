import type { Companion } from '../types';

// 선술집에서 선택 가능한 동료 (3명 중 1명 선택)
export const TAVERN_COMPANIONS: Companion[] = [
  {
    id: 'moss_fairy',
    name: '이끼 요정',
    description: 'HP 2 회복',
    emoji: '🧚',
    turnEffect: {
      type: 'heal',
      value: 2,
      target: 'player',
      trigger: 'turn_start',
    },
    linkedCardId: 'natures_blessing',  // 자연의 축복 카드
  },
  {
    id: 'wild_wolf',
    name: '야생 늑대',
    description: '적에게 3 데미지',
    emoji: '🐺',
    turnEffect: {
      type: 'damage',
      value: 3,
      target: 'enemy',
      trigger: 'turn_end',
    },
    linkedCardId: 'double_slash',  // 연속 베기 카드
  },
  {
    id: 'forest_owl',
    name: '숲 올빼미',
    description: '카드 1장 드로우',
    emoji: '🦉',
    turnEffect: {
      type: 'draw',
      value: 1,
      target: 'player',
      trigger: 'turn_start',
    },
    linkedCardId: 'lucky_dice',  // 행운의 주사위 카드
  },
];

// 동료 ID로 조회
export function getCompanionById(id: string): Companion | undefined {
  return TAVERN_COMPANIONS.find(c => c.id === id);
}

// 선술집 동료 목록 조회
export function getTavernCompanions(): Companion[] {
  return TAVERN_COMPANIONS;
}
