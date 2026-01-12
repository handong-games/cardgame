import type { Enemy, EnemyIntent } from '../types';

// 적 정의
export interface EnemyDefinition {
  name: string;
  hp: number;
  goldReward: number;  // 처치 시 골드 보상
  // 의도 패턴 (순환)
  intentPattern: EnemyIntent[];
}

export const ENEMY_DEFINITIONS: Record<string, EnemyDefinition> = {
  // === 초반 (라운드 1~3) ===
  slime: {
    name: '슬라임',
    hp: 30,
    goldReward: 10,
    intentPattern: [
      { type: 'attack', value: 6 },
      { type: 'attack', value: 6 },
      { type: 'defend', value: 5 },
    ],
  },
  goblin: {
    name: '고블린',
    hp: 35,
    goldReward: 15,
    intentPattern: [
      { type: 'attack', value: 7 },
      { type: 'attack', value: 8 },
      { type: 'defend', value: 4 },
    ],
  },
  bat_swarm: {
    name: '박쥐 떼',
    hp: 25,
    goldReward: 12,
    intentPattern: [
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
    ],
  },

  // === 중반 (라운드 4~6) ===
  orc: {
    name: '오크',
    hp: 45,
    goldReward: 20,
    intentPattern: [
      { type: 'attack', value: 10 },
      { type: 'buff', value: 2 },
      { type: 'attack', value: 12 },
    ],
  },
  skeleton: {
    name: '해골 전사',
    hp: 40,
    goldReward: 25,
    intentPattern: [
      { type: 'attack', value: 8 },
      { type: 'attack', value: 8 },
      { type: 'defend', value: 6 },
      { type: 'attack', value: 10 },
    ],
  },
  giant_spider: {
    name: '거대 거미',
    hp: 40,
    goldReward: 22,
    intentPattern: [
      { type: 'attack', value: 8 },
      { type: 'attack', value: 6 },  // 독 (추후 확장)
      { type: 'attack', value: 8 },
    ],
  },
  mimic: {
    name: '미믹',
    hp: 35,
    goldReward: 35,  // 높은 골드
    intentPattern: [
      { type: 'defend', value: 8 },
      { type: 'defend', value: 8 },
      { type: 'attack', value: 14 },  // 기습
    ],
  },

  // === 후반 (라운드 7~9) ===
  cave_troll: {
    name: '동굴 트롤',
    hp: 55,
    goldReward: 28,
    intentPattern: [
      { type: 'attack', value: 12 },
      { type: 'buff', value: 5 },  // 재생
      { type: 'attack', value: 12 },
    ],
  },
  specter: {
    name: '망령',
    hp: 45,
    goldReward: 32,
    intentPattern: [
      { type: 'attack', value: 10 },
      { type: 'attack', value: 10 },
      { type: 'buff', value: 3 },  // 저주
    ],
  },
  death_knight: {
    name: '데스나이트',
    hp: 65,
    goldReward: 50,
    intentPattern: [
      { type: 'attack', value: 12 },
      { type: 'defend', value: 10 },
      { type: 'attack', value: 15 },
      { type: 'attack', value: 12 },
    ],
  },

  // === 보스 (라운드 10) ===
  dark_knight: {
    name: '암흑 기사',
    hp: 100,  // 10라운드용으로 HP 증가
    goldReward: 80,
    intentPattern: [
      { type: 'attack', value: 10 },
      { type: 'defend', value: 12 },
      { type: 'attack', value: 18 },
      { type: 'buff', value: 4 },
    ],
  },
};

// 라운드 구간별 적 풀
export const ROUND_ENEMY_POOLS = {
  early: ['slime', 'goblin', 'bat_swarm'],       // 라운드 1~3
  mid: ['orc', 'skeleton', 'giant_spider', 'mimic'],  // 라운드 4~6
  late: ['cave_troll', 'specter', 'death_knight'],    // 라운드 7~9
  boss: ['dark_knight'],                          // 라운드 10
};

// 라운드별 적 풀 반환
export function getEnemyPoolForRound(round: number): string[] {
  if (round <= 3) return ROUND_ENEMY_POOLS.early;
  if (round <= 6) return ROUND_ENEMY_POOLS.mid;
  if (round <= 9) return ROUND_ENEMY_POOLS.late;
  return ROUND_ENEMY_POOLS.boss;
}

// 적 이모지 매핑
export const ENEMY_EMOJIS: Record<string, string> = {
  slime: '🟢',
  goblin: '👺',
  bat_swarm: '🦇',
  orc: '👹',
  skeleton: '💀',
  giant_spider: '🕷️',
  mimic: '📦',
  cave_troll: '🧌',
  specter: '👻',
  death_knight: '⚔️',
  dark_knight: '🗡️',
};

// 레거시: 라운드별 적 키 (기존 호환용)
export const ROUND_ENEMIES: string[] = [
  'slime',     // 라운드 1
  'goblin',    // 라운드 2
  'orc',       // 라운드 3
  'skeleton',  // 라운드 4
  'dark_knight', // 라운드 5 (보스)
];

// 적 인스턴스 생성
let enemyIdCounter = 0;
export function createEnemy(enemyKey: string): Enemy {
  const definition = ENEMY_DEFINITIONS[enemyKey];
  if (!definition) {
    throw new Error(`Unknown enemy: ${enemyKey}`);
  }
  return {
    id: `enemy_${enemyIdCounter++}`,
    name: definition.name,
    hp: definition.hp,
    maxHp: definition.hp,
    block: 0,
    intent: definition.intentPattern[0],
    goldReward: definition.goldReward,
  };
}

// 엘리트 적 인스턴스 생성 (HP 1.5배, 골드 2배)
export function createEliteEnemy(enemyKey: string): Enemy {
  const definition = ENEMY_DEFINITIONS[enemyKey];
  if (!definition) {
    throw new Error(`Unknown enemy: ${enemyKey}`);
  }
  const eliteHp = Math.floor(definition.hp * 1.5);
  return {
    id: `enemy_${enemyIdCounter++}`,
    name: `${definition.name} (엘리트)`,
    hp: eliteHp,
    maxHp: eliteHp,
    block: 0,
    intent: definition.intentPattern[0],
    goldReward: definition.goldReward * 2,
  };
}

// 라운드 풀에서 랜덤 적 선택
export function getRandomEnemyKey(round: number, exclude: string[] = []): string {
  const pool = getEnemyPoolForRound(round).filter(key => !exclude.includes(key));
  if (pool.length === 0) {
    // 제외 목록이 너무 많으면 전체 풀에서 선택
    const fullPool = getEnemyPoolForRound(round);
    return fullPool[Math.floor(Math.random() * fullPool.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// 적 다음 의도 가져오기
export function getNextIntent(enemyKey: string, turnIndex: number): EnemyIntent {
  const definition = ENEMY_DEFINITIONS[enemyKey];
  if (!definition) {
    return { type: 'attack', value: 5 };
  }
  const patternIndex = turnIndex % definition.intentPattern.length;
  return definition.intentPattern[patternIndex];
}
