import type { Monster, MonsterAction } from "../data/monsters";
import type { Skill } from "../data/skills";

export type CoinScenario = "max" | "min";
export type StrategyWeight = number;

const stageWeights = [
  0,
  1.0,
  1.3,
  1.7,
  2.2,
  3.0,
  4.0,
  5.3,
  7.0,
  9.0,
  12.0,
];

const damageReducePct = (stage: number) => {
  if (stage <= 0) return 0;
  return Math.min(0.45, stage * 0.03);
};

const stageValue = (stage: number) => {
  const clamped = Math.max(1, Math.min(10, stage));
  return stageWeights[clamped];
};

const summarizeCombo = (skills: Skill[]) =>
  skills.map((skill) => skill.name).join(" + ");

const isSkillAvailable = (skill: Skill, scenario: CoinScenario) => {
  const condition = skill.conditions?.[0];
  if (!condition || condition.type === "none") return true;
  if (condition.type === "coin_heads" || condition.type === "coin_tails") {
    return scenario === "max";
  }
  return true;
};

const evalSkillDamage = (
  skill: Skill,
  attackStageShift: number,
  scenario: CoinScenario,
) => {
  if (!isSkillAvailable(skill, scenario)) {
    return { damage: 0, hits: 0 };
  }
  return skill.effects.reduce(
    (acc, effect) => {
      if (effect.type !== "damage") return acc;
      const hits = effect.hits ?? 1;
      const stage = Math.max(1, effect.magnitude + attackStageShift);
      acc.damage += stageValue(stage) * hits;
      acc.hits += hits;
      return acc;
    },
    { damage: 0, hits: 0 },
  );
};

const evalSkillBlock = (skill: Skill, scenario: CoinScenario) => {
  if (!isSkillAvailable(skill, scenario)) {
    return { block: 0 };
  }
  return skill.effects.reduce(
    (acc, effect) => {
      if (effect.type !== "block") return acc;
      const hits = effect.hits ?? 1;
      const stage = Math.max(1, effect.magnitude);
      acc.block += stageValue(stage) * hits;
      return acc;
    },
    { block: 0 },
  );
};

const getSkillCost = (skill: Skill) => skill.cost;

const combos = (skills: Skill[]) => {
  const results: Skill[][] = [];
  const total = 1 << skills.length;
  for (let mask = 1; mask < total; mask += 1) {
    const picked: Skill[] = [];
    for (let i = 0; i < skills.length; i += 1) {
      if (mask & (1 << i)) picked.push(skills[i]);
    }
    results.push(picked);
  }
  return results;
};

const bestComboForTurn = (
  skills: Skill[],
  coinBudget: number,
  attackStageShift: number,
  scenario: CoinScenario,
  costPenalty: number,
  incomingAttackDamage: number,
  poisonDamage: number,
  preferenceWeight: StrategyWeight,
) => {
  const allCombos = combos(skills);
  let bestDamage = 0;
  let bestHits = 0;
  let bestBlock = 0;
  let bestScore = Number.NEGATIVE_INFINITY;
  let best: Skill[] = [];
  allCombos.forEach((combo) => {
    const cost = combo.reduce(
      (sum, skill) => sum + getSkillCost(skill) + costPenalty,
      0,
    );
    if (cost > coinBudget) return;
    const { damage, hits } = combo.reduce(
      (acc, skill) => {
        const result = evalSkillDamage(skill, attackStageShift, scenario);
        acc.damage += result.damage;
        acc.hits += result.hits;
        return acc;
      },
      { damage: 0, hits: 0 },
    );
    const { block } = combo.reduce(
      (acc, skill) => {
        const result = evalSkillBlock(skill, scenario);
        acc.block += result.block;
        return acc;
      },
      { block: 0 },
    );
    const mitigated = Math.max(0, incomingAttackDamage - block);
    const totalPlayerDamage = poisonDamage + mitigated;
    const weight = Math.max(0, Math.min(1, preferenceWeight));
    const score = weight * damage - (1 - weight) * totalPlayerDamage;
    if (
      score > bestScore ||
      (score === bestScore && damage > bestDamage) ||
      (score === bestScore && damage === bestDamage && block > bestBlock)
    ) {
      bestScore = score;
      bestDamage = damage;
      bestHits = hits;
      bestBlock = block;
      best = combo;
    }
  });
  return { damage: bestDamage, hits: bestHits, block: bestBlock, combo: best };
};

const applyAction = (action: MonsterAction, state: SimState) => {
  switch (action.type) {
    case "attackDebuff":
      if (action.stage && action.duration) {
        state.attackStageShift += action.stage;
        state.attackDebuffTurns = Math.max(state.attackDebuffTurns, action.duration);
      }
      break;
    case "hallucination":
      if (action.duration) {
        state.hallucinationTurns = Math.max(state.hallucinationTurns, action.duration);
      }
      break;
    case "evade":
      state.evadeCharges = Math.max(state.evadeCharges, 1);
      break;
    case "defend":
      state.shield += stageValue(action.stage ?? 1);
      break;
    case "heal":
      state.pendingHeal += stageValue(action.stage ?? 1);
      break;
    case "skillCostUp":
      if (action.stage && action.duration) {
        state.costPenaltyAmount = Math.max(state.costPenaltyAmount, action.stage);
        state.costPenaltyTurns = Math.max(state.costPenaltyTurns, action.duration);
      }
      break;
    case "reactiveShield":
      if (action.stage && action.duration) {
        state.reactiveShieldPerHit = Math.max(
          state.reactiveShieldPerHit,
          action.stage,
        );
        state.reactiveShieldTurns = Math.max(
          state.reactiveShieldTurns,
          action.duration,
        );
      }
      break;
    case "monsterBuff":
      if (action.stage && action.duration) {
        state.monsterAttackShift = Math.max(state.monsterAttackShift, action.stage);
        state.monsterAttackTurns = Math.max(state.monsterAttackTurns, action.duration);
      }
      break;
    case "poison":
      if (action.stage && action.duration) {
        state.poisonStacks.push({ stage: action.stage, turns: action.duration });
      }
      break;
    default:
      break;
  }
};

const describeAction = (action: MonsterAction) => {
  const stage = action.stage ?? 0;
  const hits = action.hits ?? 1;
  switch (action.type) {
    case "attack":
      return `공격 ${stage}${hits > 1 ? ` x${hits}` : ""}`;
    case "defend":
      return `방어 ${stage}`;
    case "heal":
      return `회복 ${stage}`;
    case "poison":
      return `중독 ${stage} (${action.duration ?? 0}턴)`;
    case "hallucination":
      return `환각 ${stage}`;
    case "bind":
      return `속박 ${stage}`;
    case "evade":
      return "회피";
    case "attackDebuff":
      return `공격력 ${stage}`;
    case "monsterBuff":
      return `공격력 +${stage}`;
    case "skillCostUp":
      return `스킬 비용 +${stage}`;
    case "reactiveShield":
      return `피격 시 방어 +${stage}`;
    default:
      return action.type;
  }
};

interface SimState {
  attackStageShift: number;
  attackDebuffTurns: number;
  hallucinationTurns: number;
  evadeCharges: number;
  shield: number;
  pendingHeal: number;
  costPenaltyAmount: number;
  costPenaltyTurns: number;
  reactiveShieldPerHit: number;
  reactiveShieldTurns: number;
  monsterAttackShift: number;
  monsterAttackTurns: number;
  poisonStacks: { stage: number; turns: number }[];
}

const resetTurnState = (state: SimState) => {
  state.shield = 0;
  state.pendingHeal = 0;
};

const tickStatus = (state: SimState) => {
  if (state.attackDebuffTurns > 0) {
    state.attackDebuffTurns -= 1;
    if (state.attackDebuffTurns === 0) state.attackStageShift = 0;
  }
  if (state.hallucinationTurns > 0) {
    state.hallucinationTurns -= 1;
  }
  if (state.costPenaltyTurns > 0) {
    state.costPenaltyTurns -= 1;
    if (state.costPenaltyTurns === 0) state.costPenaltyAmount = 0;
  }
  if (state.reactiveShieldTurns > 0) {
    state.reactiveShieldTurns -= 1;
    if (state.reactiveShieldTurns === 0) state.reactiveShieldPerHit = 0;
  }
  if (state.monsterAttackTurns > 0) {
    state.monsterAttackTurns -= 1;
    if (state.monsterAttackTurns === 0) state.monsterAttackShift = 0;
  }
  if (state.poisonStacks.length > 0) {
    state.poisonStacks = state.poisonStacks
      .map((stack) => ({ ...stack, turns: stack.turns - 1 }))
      .filter((stack) => stack.turns > 0);
  }
};

export interface SimulationResult {
  killTurn: number;
  comboSummary: string;
  turns: number[];
  playerTurns: number[];
  steps: {
    turn: number;
    hpAfter: number;
    playerHpAfter: number;
    playerDamage: number;
    combo: string;
    damage: number;
    actions: string[];
  }[];
}

export const simulate = (
  monster: Monster,
  skills: Skill[],
  coinBudget: number,
  scenario: CoinScenario,
  turnCap = 20,
  preferenceWeight: StrategyWeight = 1,
): SimulationResult => {
  let hp = monster.hp;
  let playerHp = 50;
  let turn = 1;
  const state: SimState = {
    attackStageShift: 0,
    attackDebuffTurns: 0,
    hallucinationTurns: 0,
    evadeCharges: 0,
    shield: 0,
    pendingHeal: 0,
    costPenaltyAmount: 0,
    costPenaltyTurns: 0,
    reactiveShieldPerHit: 0,
    reactiveShieldTurns: 0,
    monsterAttackShift: 0,
    monsterAttackTurns: 0,
    poisonStacks: [],
  };
  let lastCombo = "";
  const timeline: number[] = [hp];
  const playerTimeline: number[] = [playerHp];
  const steps: SimulationResult["steps"] = [];

  while (hp > 0 && turn <= turnCap) {
    resetTurnState(state);

    const patternIndex = (turn - 1) % monster.pattern.length;
    const actions = monster.pattern[patternIndex];
    const poisonDamage = state.poisonStacks.reduce(
      (sum, stack) => sum + stageValue(stack.stage),
      0,
    );
    actions.forEach((action) => applyAction(action, state));
    const actionDescriptions = actions.map(describeAction);

    const attackDamage = actions.reduce((sum, action) => {
      if (action.type !== "attack") return sum;
      const hits = action.hits ?? 1;
      const stage = Math.max(1, (action.stage ?? 1) + state.monsterAttackShift);
      return sum + stageValue(stage) * hits;
    }, 0);
    const incomingDamage = poisonDamage + attackDamage;

    const hallucinationPenalty = state.hallucinationTurns > 0 ? 0.7 : 1;
    const effectiveCoin = Math.max(1, Math.floor(coinBudget * hallucinationPenalty));
    let damage = 0;
    let block = 0;
    let playerDamage = incomingDamage;

    if (state.evadeCharges > 0) {
      state.evadeCharges -= 1;
      damage = 0;
      lastCombo = "회피로 무효";
    } else {
      const best = bestComboForTurn(
        skills,
        effectiveCoin,
        state.attackStageShift,
        scenario,
        state.costPenaltyAmount,
        attackDamage,
        poisonDamage,
        preferenceWeight,
      );
      damage = best.damage;
      block = best.block;
      const reactiveShieldValue =
        state.reactiveShieldPerHit > 0
          ? stageValue(state.reactiveShieldPerHit) * best.hits
          : 0;
      if (reactiveShieldValue > 0) {
        damage = Math.max(0, damage - reactiveShieldValue);
      }
      lastCombo = summarizeCombo(best.combo);
    }

    if (state.shield > 0) {
      damage = Math.max(0, damage - state.shield);
    }

    const reduced = damage * (1 - damageReducePct(monster.damageReduceStage));
    hp = Math.max(0, hp - reduced);

    playerDamage = poisonDamage + Math.max(0, attackDamage - block);
    playerHp = Math.max(0, playerHp - playerDamage);

    if (state.pendingHeal > 0 && hp > 0) {
      hp += state.pendingHeal;
    }

    timeline.push(hp);
    playerTimeline.push(playerHp);
    steps.push({
      turn,
      hpAfter: hp,
      playerHpAfter: playerHp,
      playerDamage: Number(playerDamage.toFixed(2)),
      combo: lastCombo || "조합 없음",
      damage: Number(reduced.toFixed(2)),
      actions: actionDescriptions,
    });
    tickStatus(state);
    turn += 1;
  }

  return {
    killTurn: Math.min(turn - 1, turnCap),
    comboSummary: lastCombo || "조합 없음",
    turns: timeline,
    playerTurns: playerTimeline,
    steps,
  };
};

export const computeRange = (
  monster: Monster,
  skills: Skill[],
  maxCoin: number,
): {
  minTurn: number;
  maxTurn: number;
  minCombo: string;
  maxCombo: string;
} => {
  const maxScenario = simulate(monster, skills, maxCoin, "max");
  const minScenario = simulate(monster, skills, 1, "min");
  return {
    minTurn: maxScenario.killTurn,
    maxTurn: minScenario.killTurn,
    minCombo: maxScenario.comboSummary,
    maxCombo: minScenario.comboSummary,
  };
};

export const computeScenarioDetails = (
  monster: Monster,
  skills: Skill[],
  maxCoin: number,
) => {
  const minScenario = simulate(monster, skills, maxCoin, "max");
  const maxScenario = simulate(monster, skills, 1, "min");
  return {
    minScenario,
    maxScenario,
  };
};

export const computeRoundRange = (
  monsterRanges: {
    minTurn: number;
    maxTurn: number;
  }[],
  optionCount: number,
): { roundMin: number; roundMax: number } => {
  const count = Math.min(optionCount, monsterRanges.length);
  if (count <= 1) {
    const minTurn = Math.min(...monsterRanges.map((range) => range.minTurn));
    const maxTurn = Math.max(...monsterRanges.map((range) => range.maxTurn));
    return {
      roundMin: Number.isFinite(minTurn) ? minTurn : 0,
      roundMax: Number.isFinite(maxTurn) ? maxTurn : 0,
    };
  }

  const combos: number[][] = [];
  const indices = monsterRanges.map((_, index) => index);
  const build = (start: number, picked: number[]) => {
    if (picked.length === count) {
      combos.push([...picked]);
      return;
    }
    for (let i = start; i < indices.length; i += 1) {
      picked.push(indices[i]);
      build(i + 1, picked);
      picked.pop();
    }
  };
  build(0, []);

  let best = Number.POSITIVE_INFINITY;
  let worst = 0;
  combos.forEach((combo) => {
    const minTurn = Math.min(...combo.map((idx) => monsterRanges[idx].minTurn));
    const maxTurn = Math.min(...combo.map((idx) => monsterRanges[idx].maxTurn));
    best = Math.min(best, minTurn);
    worst = Math.max(worst, maxTurn);
  });

  return {
    roundMin: best === Number.POSITIVE_INFINITY ? 0 : best,
    roundMax: worst,
  };
};
