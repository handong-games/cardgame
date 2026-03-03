import type { Enemy, EnemyIntent } from '../types';

// 특수 능력 메타데이터
export interface EnemyAbility {
  type: 'conditional_power' | 'periodic_action' | 'heal' | 'debuff' |
        'reflect' | 'phase' | 'periodic_defense' | 'poison' | 'evasion' |
        'buff' | 'bind';
  trigger: 'hp_below' | 'turn_count' | 'on_attack' | 'on_hit' | 'first_turn' | 'always';
  triggerValue?: number;  // HP % 또는 턴 수
  effect: string;         // 효과 설명 (한국어)
  duration?: number;      // 지속 턴
  value?: number;         // 수치 (증가량, 감소량 등)
}

// 적 정의
export interface EnemyDefinition {
  name: string;
  hp: number;
  soulReward: number;  // 처치 시 영혼 보상
  // 의도 패턴 (순환)
  intentPattern: EnemyIntent[];
  abilities?: EnemyAbility[];  // 특수 능력 메타데이터
  defense?: number;  // 방어력 (피해 감소율 = 방어 × 3%)
}

// 영혼 보상 계산 함수
// 공식: 기본 50 + (HP × 0.5) + (공격력 × 2) + (방어 × 3), 5의 배수로 반올림
export function calculateSoulReward(hp: number, attack: number, defense: number = 0): number {
  const baseSoul = 50;
  const total = baseSoul + (hp * 0.5) + (attack * 2) + (defense * 3);
  return Math.round(total / 5) * 5;
}

/* ========== 레거시 몬스터 (백업) ==========
export const LEGACY_ENEMY_DEFINITIONS: Record<string, EnemyDefinition> = {
  // === 초반 (라운드 1~3) ===
  slime: {
    name: '슬라임',
    hp: 30,
    soulReward: 10,
    intentPattern: [
      { type: 'attack', value: 6 },
      { type: 'attack', value: 6 },
      { type: 'defend', value: 5 },
    ],
  },
  goblin: {
    name: '고블린',
    hp: 35,
    soulReward: 15,
    intentPattern: [
      { type: 'attack', value: 7 },
      { type: 'attack', value: 8 },
      { type: 'defend', value: 4 },
    ],
  },
  bat_swarm: {
    name: '박쥐 떼',
    hp: 25,
    soulReward: 12,
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
    soulReward: 20,
    intentPattern: [
      { type: 'attack', value: 10 },
      { type: 'buff', value: 2 },
      { type: 'attack', value: 12 },
    ],
  },
  skeleton: {
    name: '해골 전사',
    hp: 40,
    soulReward: 25,
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
    soulReward: 22,
    intentPattern: [
      { type: 'attack', value: 8 },
      { type: 'attack', value: 6 },  // 독 (추후 확장)
      { type: 'attack', value: 8 },
    ],
  },
  mimic: {
    name: '미믹',
    hp: 35,
    soulReward: 35,  // 높은 골드
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
    soulReward: 28,
    intentPattern: [
      { type: 'attack', value: 12 },
      { type: 'buff', value: 5 },  // 재생
      { type: 'attack', value: 12 },
    ],
  },
  specter: {
    name: '망령',
    hp: 45,
    soulReward: 32,
    intentPattern: [
      { type: 'attack', value: 10 },
      { type: 'attack', value: 10 },
      { type: 'buff', value: 3 },  // 저주
    ],
  },
  death_knight: {
    name: '데스나이트',
    hp: 65,
    soulReward: 50,
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
    soulReward: 80,
    intentPattern: [
      { type: 'attack', value: 10 },
      { type: 'defend', value: 12 },
      { type: 'attack', value: 18 },
      { type: 'buff', value: 4 },
    ],
  },
};
========== 레거시 몬스터 끝 ========== */

// ========== gameplan 동기화 몬스터 (8체) ==========
export const ENEMY_DEFINITIONS: Record<string, EnemyDefinition> = {
  // ===== MON_F01 고블린 (R1 튜토리얼) =====
  goblin: {
    name: '고블린',
    hp: 18,
    defense: 0,
    soulReward: 8,
    intentPattern: [
      { type: 'attack', value: 6 },
      { type: 'defend', value: 2 },
    ],
  },

  // ===== MON_F02 독거미 (R2-3 초반) =====
  poison_spider: {
    name: '독거미',
    hp: 18,
    defense: 0,
    soulReward: 8,
    intentPattern: [
      { type: 'attack', value: 1 },
      { type: 'defend', value: 0 },
    ],
    abilities: [
      {
        type: 'poison',
        trigger: 'on_attack',
        effect: '공격 시 독 2 부여 (2턴)',
        value: 2,
        duration: 2,
      },
      {
        type: 'evasion',
        trigger: 'turn_count',
        triggerValue: 2,
        effect: '격턴 회피 (피해 무효)',
      },
    ],
  },

  // ===== MON_F03 버섯 기생체 (R2-3 초반) =====
  mushroom_parasite: {
    name: '버섯 기생체',
    hp: 18,
    defense: 0,
    soulReward: 8,
    intentPattern: [
      { type: 'debuff', value: 1 },
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
    ],
    abilities: [
      {
        type: 'debuff',
        trigger: 'turn_count',
        triggerValue: 1,
        effect: '포자 1 (디버프)',
        value: 1,
      },
      {
        type: 'debuff',
        trigger: 'turn_count',
        triggerValue: 3,
        effect: '후반 포자 1 + 공격 4 동시 (가속)',
        value: 1,
      },
    ],
  },

  // ===== MON_F04 가시 덩굴 (R4-5 중반) =====
  thorn_vine: {
    name: '가시 덩굴',
    hp: 18,
    defense: 0,
    soulReward: 8,
    intentPattern: [
      { type: 'buff', value: 2 },
      { type: 'attack', value: 4 },
    ],
    abilities: [{
      type: 'reflect',
      trigger: 'on_hit',
      effect: '가시 2 자기버프 (가시턴=쉬는턴, 피격 시 2 반사)',
      value: 2,
    }],
  },

  // ===== MON_F05 골렘 (R4-5 중반) =====
  golem: {
    name: '골렘',
    hp: 18,
    defense: 0,
    soulReward: 8,
    intentPattern: [
      { type: 'buff', value: 1 },
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
    ],
    abilities: [{
      type: 'buff',
      trigger: 'turn_count',
      triggerValue: 1,
      effect: '경화 1 (점진 경화, 공격 가속)',
      value: 1,
    }],
  },

  // ===== MON_F06 늑대 (R6-7 후반, 엘리트) =====
  wolf: {
    name: '늑대',
    hp: 18,
    defense: 0,
    soulReward: 15,
    intentPattern: [
      { type: 'buff', value: 1 },
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
      { type: 'buff', value: 1 },
      { type: 'attack', value: 4 },
    ],
    abilities: [{
      type: 'buff',
      trigger: 'turn_count',
      triggerValue: 1,
      effect: '하울링: 힘+1 (영구 버프)',
      value: 1,
    }],
  },

  // ===== MON_F07 썩은 나무 (R6-7 후반) =====
  rotten_tree: {
    name: '썩은 나무',
    hp: 24,
    defense: 0,
    soulReward: 8,
    intentPattern: [
      { type: 'buff', value: 0 },
      { type: 'buff', value: 0 },
      { type: 'attack', value: 15 },
      { type: 'defend', value: 6 },
    ],
    abilities: [
      {
        type: 'phase',
        trigger: 'turn_count',
        triggerValue: 1,
        effect: '집중 (2턴 충전 후 대공격 15, 3타 시 충전 취소)',
      },
      {
        type: 'periodic_defense',
        trigger: 'turn_count',
        triggerValue: 4,
        effect: '지속 방어 6',
        value: 6,
      },
    ],
  },

  // ===== BOSS_F01 고대 수목군주 (R8 보스) =====
  ancient_grove_lord: {
    name: '고대 수목군주',
    hp: 90,
    defense: 3,
    soulReward: 25,
    intentPattern: [
      { type: 'attack', value: 7 },
      { type: 'defend', value: 5 },
      { type: 'buff', value: 6 },
      { type: 'attack', value: 12 },
      { type: 'debuff', value: 2 },
      { type: 'attack', value: 10 },
    ],
    abilities: [
      {
        type: 'heal',
        trigger: 'turn_count',
        triggerValue: 3,
        effect: '매 3턴 자가 회복 6',
        value: 6,
      },
      {
        type: 'bind',
        trigger: 'turn_count',
        triggerValue: 5,
        effect: '5턴마다 뿌리 속박: 플레이어 방어 -2 (2턴)',
        value: -2,
        duration: 2,
      },
      {
        type: 'conditional_power',
        trigger: 'hp_below',
        triggerValue: 40,
        effect: 'HP 40% 이하 시 공격력 +2',
        value: 2,
      },
    ],
  },
};

export const ROUND_ENEMY_POOLS = {
  tutorial: ['goblin'],
  early: ['poison_spider', 'mushroom_parasite'],
  mid: ['thorn_vine', 'golem'],
  late: ['wolf', 'rotten_tree'],
  boss: ['ancient_grove_lord'],
};

export function getEnemyPoolForRound(round: number): string[] {
  if (round === 1) return ROUND_ENEMY_POOLS.tutorial;
  if (round <= 3) return ROUND_ENEMY_POOLS.early;
  if (round <= 5) return ROUND_ENEMY_POOLS.mid;
  if (round <= 7) return ROUND_ENEMY_POOLS.late;
  return ROUND_ENEMY_POOLS.boss;
}

export const ENEMY_EMOJIS: Record<string, string> = {
  goblin: '👺',
  poison_spider: '🕷️',
  mushroom_parasite: '🍄',
  thorn_vine: '🌿',
  golem: '🗿',
  wolf: '🐺',
  rotten_tree: '🌳',
  ancient_grove_lord: '🌳',
};

export const ROUND_ENEMIES: string[] = [
  'goblin',             // R1
  'poison_spider',      // R2
  'mushroom_parasite',  // R3
  'thorn_vine',         // R4
  'golem',              // R5
  'wolf',               // R6
  'rotten_tree',        // R7
  'ancient_grove_lord', // R8
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
    soulReward: definition.soulReward,
  };
}

// 엘리트 적 인스턴스 생성 (HP 1.5배, 영혼 2배)
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
    soulReward: definition.soulReward * 2,
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
