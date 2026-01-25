export type SkillRole = "damage" | "block" | "heal" | "buff" | "debuff" | "utility";
export type SkillBuild =
  | "stable"
  | "burst"
  | "tails"
  | "low_hp"
  | "combo"
  | "hybrid";

export interface SkillCondition {
  type: "hp_below" | "hp_above" | "coin_heads" | "coin_tails" | "combo" | "none";
  value?: number;
  notes?: string;
}

export interface SkillEffect {
  type: "damage" | "block" | "heal" | "buff" | "debuff" | "utility";
  target: "enemy" | "self" | "both";
  magnitude: number;
  hits?: number;
  duration?: number;
  stackable?: boolean;
  notes?: string;
}

export interface Skill {
  name: string;
  class: "warrior";
  role: SkillRole;
  build: SkillBuild;
  cost: number;
  cooldown: number;
  conditions: SkillCondition[];
  effects: SkillEffect[];
}

export const baseSkills: Skill[] = [
  {
    name: "정의의 일격",
    class: "warrior",
    role: "damage",
    build: "stable",
    cost: 1,
    cooldown: 0,
    conditions: [{ type: "none" }],
    effects: [
      {
        type: "damage",
        target: "enemy",
        magnitude: 5,
      },
    ],
  },
  {
    name: "성채의 방벽",
    class: "warrior",
    role: "block",
    build: "stable",
    cost: 1,
    cooldown: 0,
    conditions: [{ type: "none" }],
    effects: [
      {
        type: "block",
        target: "self",
        magnitude: 7,
      },
    ],
  },
  {
    name: "정의의 결심",
    class: "warrior",
    role: "utility",
    build: "tails",
    cost: 0,
    cooldown: 0,
    conditions: [{ type: "coin_heads", value: 0, notes: "heads=0" }],
    effects: [
      {
        type: "block",
        target: "self",
        magnitude: 3,
      },
      {
        type: "utility",
        target: "self",
        magnitude: 2,
        notes: "guarantee-head-next-turn",
      },
    ],
  },
];

export const extraSkills: Skill[] = [
  {
    name: "정의의 돌파",
    class: "warrior",
    role: "damage",
    build: "burst",
    cost: 2,
    cooldown: 1,
    conditions: [{ type: "coin_heads", value: 2, notes: "heads>=2" }],
    effects: [
      {
        type: "damage",
        target: "enemy",
        magnitude: 6,
        hits: 2,
        notes: "double-hit",
      },
    ],
  },
  {
    name: "진격의 기세",
    class: "warrior",
    role: "buff",
    build: "burst",
    cost: 1,
    cooldown: 2,
    conditions: [{ type: "none" }],
    effects: [
      {
        type: "buff",
        target: "self",
        magnitude: 2,
        duration: 2,
        notes: "attack-up",
      },
    ],
  },
  {
    name: "피의 의지",
    class: "warrior",
    role: "damage",
    build: "low_hp",
    cost: 1,
    cooldown: 0,
    conditions: [{ type: "hp_below", value: 50 }],
    effects: [
      {
        type: "damage",
        target: "enemy",
        magnitude: 8,
        hits: 1,
      },
    ],
  },
];
