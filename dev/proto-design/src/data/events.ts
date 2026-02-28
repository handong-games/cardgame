import type { EventDefinition } from '../types';

// 전역 이벤트 (모든 지역에서 등장)
const GLOBAL_EVENTS: EventDefinition[] = [
  {
    id: 'merchant',
    name: '떠돌이 행상인',
    emoji: '🧳',
    category: 'A',
    pool: 'global',
    narration: '등에 커다란 보따리를 멘 행상인이 손을 흔든다.',
    canAbandon: true,
    choices: [
      {
        id: 'merchant_potion',
        label: '물약 구매',
        costDescription: '소울 8',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [
            { type: 'soul_cost', value: 8 },
            { type: 'heal', value: 8, maxValue: 12 },
          ],
          description: '물약을 마셔 HP를 회복했다.',
        }],
      },
      {
        id: 'merchant_info',
        label: '정보 구매',
        costDescription: '소울 5',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [
            { type: 'soul_cost', value: 5 },
            { type: 'info', value: 1 },
          ],
          description: '다음 라운드의 몬스터 정보를 얻었다.',
        }],
      },
      {
        id: 'merchant_leave',
        label: '그냥 지나간다',
        outcomes: [{
          chance: 1,
          label: '포기',
          effects: [],
          description: '행상인에게 손을 흔들며 지나쳤다.',
        }],
      },
    ],
  },
  {
    id: 'fortune_coin',
    name: '운명의 동전',
    emoji: '🪙',
    category: 'C',
    pool: 'global',
    narration: '바닥에 기묘하게 빛나는 동전이 놓여 있다.',
    canAbandon: true,
    choices: [
      {
        id: 'fortune_flip',
        label: '동전을 주워 던진다',
        outcomes: [
          {
            chance: 0.7,
            label: '앞면',
            effects: [{ type: 'soul_gain', value: 20 }],
            description: '동전이 빛나며 소울이 쏟아진다!',
          },
          {
            chance: 0.3,
            label: '뒷면',
            effects: [{ type: 'soul_cost', value: 10 }],
            description: '동전이 먼지가 되어 사라지며 소울을 빨아들인다...',
          },
        ],
      },
      {
        id: 'fortune_kick',
        label: '동전을 차버린다',
        outcomes: [{
          chance: 1,
          label: '포기',
          effects: [],
          description: '동전을 발로 차 버렸다. 아무 일도 일어나지 않았다.',
        }],
      },
    ],
  },
  {
    id: 'dark_altar',
    name: '수상한 제단',
    emoji: '🗿',
    category: 'D',
    pool: 'global',
    narration: '제단의 빛이 당신을 감싸고, 돌아갈 수 없다.',
    canAbandon: false,
    choices: [
      {
        id: 'altar_upgrade',
        label: 'HP를 바쳐 힘을 얻는다',
        costDescription: 'HP 8',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [
            { type: 'damage', value: 8 },
            { type: 'soul_gain', value: 15 },
          ],
          description: '제단이 당신의 피를 받아들이고, 영혼의 힘을 내려준다.',
        }],
      },
      {
        id: 'altar_coin',
        label: 'HP를 바쳐 행운을 빈다',
        costDescription: 'HP 5',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [
            { type: 'damage', value: 5 },
            { type: 'soul_gain', value: 10 },
          ],
          description: '제단이 미약한 빛을 발하며 행운을 약속한다.',
        }],
      },
    ],
  },
];

// 잊혀진 숲 전용 이벤트
const FOREST_EVENTS: EventDefinition[] = [
  {
    id: 'forest_spring',
    name: '수상한 샘',
    emoji: '💧',
    category: 'A',
    pool: 'forest',
    narration: '맑은 물이 솟아오르는 작은 샘이 보인다.',
    canAbandon: true,
    choices: [
      {
        id: 'spring_drink',
        label: '조심스럽게 한 모금 마신다',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [{ type: 'heal', value: 3, maxValue: 8 }],
          description: '맑은 물이 몸에 생기를 불어넣는다.',
        }],
      },
      {
        id: 'spring_bottle',
        label: '물통에 담아간다',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [{ type: 'heal', value: 5 }],
          description: '물을 물통에 담았다. 시원한 기운이 감돈다.',
        }],
      },
      {
        id: 'spring_leave',
        label: '그냥 지나간다',
        outcomes: [{
          chance: 1,
          label: '포기',
          effects: [],
          description: '샘을 뒤로 하고 길을 이어간다.',
        }],
      },
    ],
  },
  {
    id: 'mushroom_grove',
    name: '거대 버섯 군락',
    emoji: '🍄',
    category: 'B',
    pool: 'forest',
    narration: '거대한 버섯들 사이에서 포자가 빛나고 있다.',
    canAbandon: false,
    choices: [
      {
        id: 'mushroom_spore',
        label: '포자를 흡입한다',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [{ type: 'soul_gain', value: 8 }],
          description: '포자의 에너지가 몸을 감싸며, 신비로운 힘을 느낀다.',
        }],
      },
      {
        id: 'mushroom_harvest',
        label: '버섯을 채집한다',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [{ type: 'soul_gain', value: 8, maxValue: 12 }],
          description: '빛나는 버섯에서 소울 에너지를 추출했다.',
        }],
      },
    ],
  },
  {
    id: 'shadow_trap',
    name: '어둠의 덫',
    emoji: '📦',
    category: 'C',
    pool: 'forest',
    narration: '덫에 걸린 보물 상자가 보인다. 함정이 있을 수도...',
    canAbandon: true,
    choices: [
      {
        id: 'trap_careful',
        label: '조심히 해제한다',
        outcomes: [
          {
            chance: 0.7,
            label: '성공',
            effects: [{ type: 'soul_gain', value: 15 }],
            description: '덫을 무사히 해제하고 보물을 손에 넣었다!',
          },
          {
            chance: 0.3,
            label: '실패',
            effects: [{ type: 'damage', value: 5, maxValue: 10 }],
            description: '덫이 발동하며 날카로운 가시가 튀어나온다!',
          },
        ],
      },
      {
        id: 'trap_force',
        label: '힘으로 부순다',
        outcomes: [{
          chance: 1,
          label: '성공',
          effects: [
            { type: 'soul_gain', value: 5, maxValue: 10 },
            { type: 'damage', value: 3 },
          ],
          description: '상자를 부수며 파편에 약간 다쳤지만, 소울을 얻었다.',
        }],
      },
      {
        id: 'trap_leave',
        label: '무시하고 지나간다',
        outcomes: [{
          chance: 1,
          label: '포기',
          effects: [],
          description: '수상한 상자를 남겨두고 길을 이어간다.',
        }],
      },
    ],
  },
];

const ALL_EVENTS: EventDefinition[] = [...GLOBAL_EVENTS, ...FOREST_EVENTS];

export function getEventById(eventId: string): EventDefinition | undefined {
  return ALL_EVENTS.find(e => e.id === eventId);
}

export function getRandomEvent(regionPool: 'forest' = 'forest'): EventDefinition {
  const pool = ALL_EVENTS.filter(e => e.pool === 'global' || e.pool === regionPool);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomEventId(regionPool: 'forest' = 'forest'): string {
  return getRandomEvent(regionPool).id;
}
