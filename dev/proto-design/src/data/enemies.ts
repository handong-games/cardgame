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

// ========== skill 저장소 기반 새 몬스터 ==========
export const ENEMY_DEFINITIONS: Record<string, EnemyDefinition> = {
  // ===== A풀 (일반 몬스터) - early 풀 =====

  goblin: {
    name: '고블린',
    hp: 22,
    defense: 0,
    soulReward: 70,
    intentPattern: [
      { type: 'attack', value: 3 },
      { type: 'attack', value: 3 },
      { type: 'attack', value: 3 },
    ],
  },

  wolf: {
    name: '늑대',
    hp: 26,
    defense: 1,
    soulReward: 75,
    intentPattern: [
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
      { type: 'attack', value: 5 },  // HP 50% 이하 가정
      { type: 'attack', value: 5 },
    ],
    abilities: [{
      type: 'conditional_power',
      trigger: 'hp_below',
      triggerValue: 50,
      effect: 'HP 50% 이하 시 공격력 +1',
      value: 1,
    }],
  },

  orc_warrior: {
    name: '오크 전사',
    hp: 28,
    defense: 1,
    soulReward: 80,
    intentPattern: [
      { type: 'defend', value: 2 },  // 첫 턴 방어
      { type: 'attack', value: 5 },
      { type: 'attack', value: 5 },
      { type: 'attack', value: 5 },
    ],
    abilities: [{
      type: 'periodic_defense',
      trigger: 'first_turn',
      effect: '첫 턴 방어 자세 (피해 -2)',
      value: 2,
    }],
  },

  stone_golem: {
    name: '석상 골렘',
    hp: 32,
    defense: 2,
    soulReward: 85,
    intentPattern: [
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
      { type: 'defend', value: 2 },  // 매 3턴
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
      { type: 'defend', value: 2 },
    ],
    abilities: [{
      type: 'periodic_defense',
      trigger: 'turn_count',
      triggerValue: 3,
      effect: '매 3턴마다 방어 (피해 -2)',
      value: 2,
    }],
  },

  berserker_goblin: {
    name: '광전사 고블린',
    hp: 30,
    defense: 0,
    soulReward: 85,
    intentPattern: [
      { type: 'attack', value: 6 },
      { type: 'attack', value: 6 },
      { type: 'attack', value: 6 },
    ],
    abilities: [{
      type: 'reflect',
      trigger: 'on_hit',
      effect: '피격 시 10% 확률로 반격 2뎀',
      value: 2,
    }],
  },

  thorn_vine: {
    name: '가시 덩쿨',
    hp: 36,
    defense: 0,
    soulReward: 75,
    intentPattern: [
      { type: 'attack', value: 3 },
      { type: 'buff', value: 5 },  // 자가 회복
      { type: 'attack', value: 6 },  // 공격 x2
      { type: 'attack', value: 1 },  // + 중독
    ],
    abilities: [
      {
        type: 'heal',
        trigger: 'turn_count',
        triggerValue: 2,
        effect: '2턴마다 자가 회복 5 HP',
        value: 5,
      },
      {
        type: 'poison',
        trigger: 'on_attack',
        effect: '공격 시 중독 2 (2턴, 누적)',
        value: 2,
        duration: 2,
      },
    ],
  },

  moss_wolf: {
    name: '이끼 늑대',
    hp: 32,
    defense: 2,
    soulReward: 85,
    intentPattern: [
      { type: 'buff', value: 2 },  // 공격력 버프 +2
      { type: 'attack', value: 7 },  // 버프된 공격 (5+2)
      { type: 'attack', value: 9 },  // 버프된 공격 x2 (3x2+3)
      { type: 'defend', value: 0 },  // 회피 (다음 공격 무효)
    ],
    abilities: [
      {
        type: 'buff',
        trigger: 'turn_count',
        triggerValue: 1,
        effect: '공격력 버프 +2 (2턴)',
        value: 2,
        duration: 2,
      },
      {
        type: 'evasion',
        trigger: 'turn_count',
        triggerValue: 4,
        effect: '4턴마다 회피 (다음 공격 무효)',
      },
    ],
  },

  mushroom_parasite: {
    name: '버섯 기생체',
    hp: 12,
    defense: 0,
    soulReward: 60,
    intentPattern: [
      { type: 'buff', value: 4 },  // 중독 4
      { type: 'buff', value: 2 },  // 자가 회복 2
      { type: 'debuff', value: 0 },  // 환각 (코인 변환)
      { type: 'buff', value: 2 },  // 자가 회복 2
    ],
    abilities: [
      {
        type: 'poison',
        trigger: 'always',
        effect: '중독 4 (2턴, 누적)',
        value: 4,
        duration: 2,
      },
      {
        type: 'heal',
        trigger: 'turn_count',
        effect: '회복 2',
        value: 2,
      },
      {
        type: 'debuff',
        trigger: 'turn_count',
        triggerValue: 3,
        effect: '환각: 코인 앞면→뒷면 변환',
      },
    ],
  },

  mist_weasel: {
    name: '안개 족제비',
    hp: 24,
    defense: 1,
    soulReward: 70,
    intentPattern: [
      { type: 'attack', value: 3 },
      { type: 'defend', value: 0 },  // 회피
      { type: 'attack', value: 4 },  // 공격 x2
      { type: 'buff', value: 2 },  // 공격력 버프 +2
    ],
    abilities: [
      {
        type: 'evasion',
        trigger: 'turn_count',
        triggerValue: 2,
        effect: '2턴마다 회피 (다음 공격 무효)',
      },
      {
        type: 'buff',
        trigger: 'turn_count',
        triggerValue: 4,
        effect: '공격력 버프 +2 (3턴)',
        value: 2,
        duration: 3,
      },
    ],
  },

  rotten_treant: {
    name: '썩은 나무령',
    hp: 26,
    defense: 1,
    soulReward: 70,
    intentPattern: [
      { type: 'debuff', value: 1 },  // 속박 (방어 -1)
      { type: 'attack', value: 2 },
      { type: 'buff', value: 2 },  // 자가 회복 2
      { type: 'attack', value: 2 },
    ],
    abilities: [
      {
        type: 'bind',
        trigger: 'turn_count',
        triggerValue: 1,
        effect: '속박: 플레이어 방어력 -1 (1턴)',
        value: -1,
        duration: 1,
      },
      {
        type: 'heal',
        trigger: 'turn_count',
        triggerValue: 3,
        effect: '자가 회복 2',
        value: 2,
      },
    ],
  },

  // ===== B풀 (정예 몬스터) - mid/late 풀 =====

  orc_shaman: {
    name: '오크 주술사',
    hp: 32,
    defense: 2,
    soulReward: 95,
    intentPattern: [
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
      { type: 'buff', value: 2 },  // 공격력 버프 +2
      { type: 'attack', value: 6 },  // 버프된 공격 (4+2)
      { type: 'attack', value: 6 },
    ],
    abilities: [{
      type: 'buff',
      trigger: 'turn_count',
      triggerValue: 3,
      effect: '매 3턴 공격력 +2 버프 (2턴)',
      value: 2,
      duration: 2,
    }],
  },

  poison_spider: {
    name: '독 거미',
    hp: 40,
    defense: 2,
    soulReward: 100,
    intentPattern: [
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
      { type: 'attack', value: 4 },
    ],
    abilities: [{
      type: 'debuff',
      trigger: 'on_attack',
      effect: '공격 시 약화 -1 (2턴)',
      value: -1,
      duration: 2,
    }],
  },

  assassin: {
    name: '암살자',
    hp: 36,
    defense: 3,
    soulReward: 110,
    intentPattern: [
      { type: 'attack', value: 16 },  // 첫 공격 2배
      { type: 'attack', value: 8 },
      { type: 'attack', value: 8 },
      { type: 'attack', value: 8 },
    ],
    abilities: [{
      type: 'conditional_power',
      trigger: 'hp_below',
      triggerValue: 100,
      effect: 'HP 100% 시 첫 공격 2배',
      value: 2,
    }],
  },

  guardian: {
    name: '수호병',
    hp: 48,
    defense: 4,
    soulReward: 120,
    intentPattern: [
      { type: 'attack', value: 5 },
      { type: 'attack', value: 5 },
      { type: 'attack', value: 5 },
      { type: 'defend', value: 2 },  // HP 30% 이하 방어 +2
    ],
    abilities: [{
      type: 'periodic_defense',
      trigger: 'hp_below',
      triggerValue: 30,
      effect: 'HP 30% 이하 시 방어 +2',
      value: 2,
    }],
  },

  chaos_mage: {
    name: '광기의 마법사',
    hp: 42,
    defense: 2,
    soulReward: 115,
    intentPattern: [
      { type: 'attack', value: 6 },  // 50% 일반 공격
      { type: 'buff', value: 8 },    // 30% 자힐 8
      { type: 'attack', value: 10 }, // 20% 강공격 10
    ],
    abilities: [{
      type: 'periodic_action',
      trigger: 'always',
      effect: '매턴 랜덤 행동 (50% 공격 6 / 30% 힐 8 / 20% 강공격 10)',
    }],
  },

  obsidian_spirit: {
    name: '흑요 정령',
    hp: 20,
    defense: 5,
    soulReward: 95,
    intentPattern: [
      { type: 'debuff', value: -5 },  // 공격력 디버프 -5
      { type: 'defend', value: 3 },   // 방어 +3 + 회복 3
      { type: 'attack', value: 3 },
    ],
    abilities: [
      {
        type: 'debuff',
        trigger: 'turn_count',
        triggerValue: 1,
        effect: '공격력 디버프 -5 (2턴)',
        value: -5,
        duration: 2,
      },
      {
        type: 'heal',
        trigger: 'turn_count',
        triggerValue: 2,
        effect: '회복 3',
        value: 3,
      },
    ],
  },

  ancient_guardian: {
    name: '고목 수호자',
    hp: 40,
    defense: 2,
    soulReward: 100,
    intentPattern: [
      { type: 'defend', value: 3 },
      { type: 'attack', value: 3 },
      { type: 'debuff', value: -2 },  // 속박 (방어 -2)
      { type: 'attack', value: 4 },   // 공격 x2
      { type: 'buff', value: 4 },     // 회복 4
    ],
    abilities: [
      {
        type: 'bind',
        trigger: 'turn_count',
        triggerValue: 3,
        effect: '속박: 플레이어 방어력 -2 (1턴)',
        value: -2,
        duration: 1,
      },
      {
        type: 'heal',
        trigger: 'turn_count',
        triggerValue: 5,
        effect: '자가 회복 4',
        value: 4,
      },
    ],
  },

  dusk_deer: {
    name: '밤그늘 사슴',
    hp: 30,
    defense: 4,
    soulReward: 105,
    intentPattern: [
      { type: 'buff', value: 3 },     // 공격력 버프 +3
      { type: 'attack', value: 7 },   // 버프된 공격 (4+3)
      { type: 'buff', value: 3 },     // 재생 3 (2턴)
      { type: 'attack', value: 7 },
    ],
    abilities: [
      {
        type: 'buff',
        trigger: 'turn_count',
        triggerValue: 1,
        effect: '공격력 버프 +3 (2턴)',
        value: 3,
        duration: 2,
      },
      {
        type: 'heal',
        trigger: 'turn_count',
        triggerValue: 3,
        effect: '재생 3 (2턴, 턴당 회복)',
        value: 3,
        duration: 2,
      },
    ],
  },

  seed_reaper: {
    name: '종자 수확자',
    hp: 30,
    defense: 2,
    soulReward: 95,
    intentPattern: [
      { type: 'debuff', value: 1 },   // 스킬 비용 +1
      { type: 'buff', value: 3 },     // 중독 3
      { type: 'buff', value: 4 },     // 회복 4
      { type: 'attack', value: 3 },
    ],
    abilities: [
      {
        type: 'debuff',
        trigger: 'turn_count',
        triggerValue: 1,
        effect: '스킬 비용 +1 (모든 스킬, 1턴)',
        value: 1,
        duration: 1,
      },
      {
        type: 'poison',
        trigger: 'turn_count',
        triggerValue: 2,
        effect: '중독 3 (2턴, 누적)',
        value: 3,
        duration: 2,
      },
      {
        type: 'heal',
        trigger: 'turn_count',
        triggerValue: 3,
        effect: '회복 4',
        value: 4,
      },
    ],
  },

  // ===== 보스 몬스터 =====

  dark_knight: {
    name: '암흑 기사',
    hp: 80,
    defense: 4,
    soulReward: 200,
    intentPattern: [
      { type: 'attack', value: 8 },    // 기본 공격
      { type: 'defend', value: 4 },    // 방어 자세 (+4 블록)
      { type: 'attack', value: 14 },   // 강공격
      { type: 'buff', value: 3 },      // 공격력 버프 +3
      { type: 'attack', value: 11 },   // 버프된 공격 (8+3)
      { type: 'attack', value: 11 },   // 버프된 공격
    ],
    abilities: [
      {
        type: 'buff',
        trigger: 'turn_count',
        triggerValue: 4,
        effect: '4턴마다 공격력 +3 버프 (3턴)',
        value: 3,
        duration: 3,
      },
      {
        type: 'periodic_defense',
        trigger: 'hp_below',
        triggerValue: 40,
        effect: 'HP 40% 이하 시 방어 +2',
        value: 2,
      },
    ],
  },
};

// 라운드 구간별 적 풀
export const ROUND_ENEMY_POOLS = {
  // 라운드 1~3: A풀 전체 (10개)
  early: [
    'goblin', 'wolf', 'orc_warrior', 'stone_golem', 'berserker_goblin',
    'thorn_vine', 'moss_wolf', 'mushroom_parasite', 'mist_weasel', 'rotten_treant',
  ],

  // 라운드 4~6: B풀 중급 난이도 (5개)
  mid: [
    'orc_shaman', 'poison_spider', 'chaos_mage',
    'obsidian_spirit', 'seed_reaper',
  ],

  // 라운드 7~9: B풀 상급 난이도 (4개)
  late: [
    'assassin', 'guardian', 'ancient_guardian', 'dusk_deer',
  ],

  // 라운드 10: 보스 (현재 제외, 향후 추가)
  boss: [],
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
  // A풀 (일반 몬스터)
  goblin: '👺',
  wolf: '🐺',
  orc_warrior: '⚔️',
  stone_golem: '🗿',
  berserker_goblin: '😡',
  thorn_vine: '🌿',
  moss_wolf: '🍃',
  mushroom_parasite: '🍄',
  mist_weasel: '💨',
  rotten_treant: '🌳',

  // B풀 (정예 몬스터)
  orc_shaman: '🔮',
  poison_spider: '🕷️',
  assassin: '🗡️',
  guardian: '🛡️',
  chaos_mage: '✨',
  obsidian_spirit: '👻',
  ancient_guardian: '🌲',
  dusk_deer: '🦌',
  seed_reaper: '🌾',

  // 보스 몬스터
  dark_knight: '⚔️',
};

// 레거시: 라운드별 적 키 (기존 호환용, 사용 중단 예정)
export const ROUND_ENEMIES: string[] = [
  'goblin',       // 라운드 1
  'wolf',         // 라운드 2
  'orc_warrior',  // 라운드 3
  'orc_shaman',   // 라운드 4
  'guardian',     // 라운드 5
  'assassin',     // 라운드 6
  'dark_knight',  // 라운드 7 (보스)
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
