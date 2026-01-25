export type MonsterActionType =
  | "attack"
  | "defend"
  | "heal"
  | "poison"
  | "hallucination"
  | "bind"
  | "evade"
  | "attackDebuff"
  | "monsterBuff"
  | "skillCostUp"
  | "reactiveShield";

export type MonsterPool = "A" | "B" | "Boss";

export interface MonsterAction {
  type: MonsterActionType;
  stage?: number;
  hits?: number;
  duration?: number;
  notes?: string;
}

export interface Monster {
  id: string;
  name: string;
  hp: number;
  damageReduceStage: number;
  pool: MonsterPool;
  pattern: MonsterAction[][];
}

export const monsters: Monster[] = [
  {
    id: "vine",
    name: "가시 덩쿨",
    hp: 36,
    damageReduceStage: 0,
    pool: "A",
    pattern: [
      [{ type: "attack", stage: 3 }],
      [{ type: "heal", stage: 5 }],
      [{ type: "attack", stage: 3, hits: 2 }],
      [
        { type: "attack", stage: 1 },
        { type: "poison", stage: 2, duration: 2, notes: "stackable" },
      ],
    ],
  },
  {
    id: "moss-wolf",
    name: "이끼 늑대",
    hp: 32,
    damageReduceStage: 2,
    pool: "A",
    pattern: [
      [{ type: "monsterBuff", stage: 2, duration: 2, notes: "attack-up" }],
      [{ type: "attack", stage: 5 }],
      [{ type: "attack", stage: 3, hits: 2 }],
      [{ type: "evade", notes: "next-hit" }],
    ],
  },
  {
    id: "obsidian-wisp",
    name: "흑요 정령",
    hp: 20,
    damageReduceStage: 5,
    pool: "B",
    pattern: [
      [{ type: "attackDebuff", stage: -5, duration: 2 }],
      [
        { type: "defend", stage: 3 },
        { type: "heal", stage: 3 },
      ],
      [{ type: "attack", stage: 3 }],
    ],
  },
  {
    id: "spore-host",
    name: "버섯 기생체",
    hp: 12,
    damageReduceStage: 0,
    pool: "A",
    pattern: [
      [{ type: "poison", stage: 4, duration: 2, notes: "stackable" }],
      [{ type: "heal", stage: 2 }],
      [
        { type: "hallucination", stage: 4, duration: 1, notes: "heads-to-tails" },
      ],
      [{ type: "heal", stage: 2 }],
    ],
  },
  {
    id: "ancient-treant",
    name: "고목 수호자",
    hp: 40,
    damageReduceStage: 2,
    pool: "B",
    pattern: [
      [{ type: "defend", stage: 3 }],
      [{ type: "attack", stage: 3 }],
      [{ type: "bind", stage: 2, duration: 1 }],
      [{ type: "attack", stage: 2, hits: 2 }],
      [{ type: "heal", stage: 4 }],
    ],
  },
  {
    id: "mist-weasel",
    name: "안개 족제비",
    hp: 24,
    damageReduceStage: 1,
    pool: "A",
    pattern: [
      [{ type: "attack", stage: 3 }],
      [{ type: "evade", notes: "next-hit" }],
      [{ type: "attack", stage: 2, hits: 2 }],
      [{ type: "monsterBuff", stage: 2, duration: 3, notes: "attack-up" }],
    ],
  },
  {
    id: "rotten-woodling",
    name: "썩은 나무령",
    hp: 26,
    damageReduceStage: 1,
    pool: "A",
    pattern: [
      [{ type: "bind", stage: 1, duration: 1, notes: "shield-down" }],
      [{ type: "attack", stage: 2 }],
      [{ type: "heal", stage: 2 }],
      [{ type: "attack", stage: 2 }],
    ],
  },
  {
    id: "night-stag",
    name: "밤그늘 사슴",
    hp: 30,
    damageReduceStage: 4,
    pool: "B",
    pattern: [
      [{ type: "monsterBuff", stage: 3, duration: 2, notes: "attack-up" }],
      [{ type: "attack", stage: 4 }],
      [{ type: "heal", stage: 3, duration: 2, notes: "regen" }],
      [{ type: "attack", stage: 4 }],
    ],
  },
  {
    id: "seed-harvester",
    name: "종자 수확자",
    hp: 30,
    damageReduceStage: 2,
    pool: "B",
    pattern: [
      [{ type: "skillCostUp", stage: 1, duration: 1, notes: "all-skills" }],
      [{ type: "poison", stage: 3, duration: 2, notes: "stackable" }],
      [{ type: "heal", stage: 4 }],
      [{ type: "attack", stage: 3 }],
    ],
  },
  {
    id: "rotted-bear",
    name: "부패한 곰",
    hp: 40,
    damageReduceStage: 5,
    pool: "B",
    pattern: [
      [{ type: "reactiveShield", stage: 2, duration: 1, notes: "on-hit-shield" }],
      [{ type: "attack", stage: 3, hits: 3 }],
      [{ type: "defend", stage: 5 }],
      [{ type: "monsterBuff", stage: 3, duration: 2, notes: "attack-up" }],
    ],
  },
  {
    id: "ancient-forest-lord",
    name: "고대 수목군주",
    hp: 90,
    damageReduceStage: 2,
    pool: "Boss",
    pattern: [
      [{ type: "defend", stage: 6 }],
      [{ type: "bind", stage: 3, duration: 1 }],
      [{ type: "attack", stage: 6 }],
      [{ type: "heal", stage: 4 }],
      [{ type: "poison", stage: 4, duration: 2, notes: "stackable" }],
    ],
  },
];
