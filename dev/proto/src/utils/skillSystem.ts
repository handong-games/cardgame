import type { Player, Enemy, Skill, SkillState, SkillEffect, ActiveBuff, PreviewEffects, CoinTossResult } from '../types';
import { GREED_CONSTANTS } from '../data/buffs/common';
import { calculateCoinValues, spendCoins } from './coinToss';

/**
 * 스킬의 실제 앞면/뒷면 비용 반환
 * 레거시 coinCost가 있으면 앞면 비용으로 간주
 */
export function getSkillCosts(skill: Skill): { heads: number; tails: number } {
  // 새 형식이 정의되어 있으면 사용
  if (skill.headsCost !== undefined || skill.tailsCost !== undefined) {
    return {
      heads: skill.headsCost ?? 0,
      tails: skill.tailsCost ?? 0,
    };
  }

  // 레거시: coinCost를 앞면 비용으로 처리
  return {
    heads: skill.coinCost ?? 0,
    tails: 0,
  };
}

// 스킬 사용 가능 여부 확인
export function canUseSkill(
  lastTossResults: CoinTossResult[],
  skill: Skill,
  skillState: SkillState | undefined
): { canUse: boolean; reason?: string } {
  // 앞면/뒷면 비용 추출
  const costs = getSkillCosts(skill);

  // 보유 코인 계산
  const available = calculateCoinValues(lastTossResults);

  // 앞면 코인 체크
  if (available.heads < costs.heads) {
    return {
      canUse: false,
      reason: `앞면 코인 부족 (필요: ${costs.heads}, 보유: ${available.heads})`,
    };
  }

  // 뒷면 코인 체크
  if (available.tails < costs.tails) {
    return {
      canUse: false,
      reason: `뒷면 코인 부족 (필요: ${costs.tails}, 보유: ${available.tails})`,
    };
  }

  // 쿨다운 체크
  if (skillState && skillState.cooldownRemaining > 0) {
    return { canUse: false, reason: `쿨다운 중 (${skillState.cooldownRemaining}턴)` };
  }

  // 턴당 사용 횟수 체크
  // ❌ 제거: 코인만 충분하면 무제한 사용 가능
  // if (skill.maxUsePerTurn > 0 && skillState && skillState.usedThisTurn >= skill.maxUsePerTurn) {
  //   return { canUse: false, reason: `턴당 ${skill.maxUsePerTurn}회 제한` };
  // }

  return { canUse: true };
}

// 스킬 효과 적용 결과 계산
export interface SkillEffectResult {
  damageDealt: number;       // 적에게 가한 데미지
  blockGained: number;       // 획득한 방어력
  healAmount: number;        // 회복량
  selfDamage: number;        // 자해 데미지
  coinsGained: number;       // 획득 코인
  buffsApplied: { buffId: string; stacks: number }[];
}

// 스킬 효과 계산 (상태 변경 없이 결과만 반환)
export function calculateSkillEffects(
  player: Player,
  skill: Skill,
  enemy?: Enemy | null
): SkillEffectResult {
  const result: SkillEffectResult = {
    damageDealt: 0,
    blockGained: 0,
    healAmount: 0,
    selfDamage: 0,
    coinsGained: 0,
    buffsApplied: [],
  };

  // 기본 효과 처리
  for (const effect of skill.effects) {
    applyEffect(effect, result);
  }

  // 조건부 효과 처리
  if (skill.conditionalEffects) {
    for (const conditional of skill.conditionalEffects) {
      if (checkCondition(player, conditional.condition, conditional.conditionValue, enemy)) {
        applyEffect(conditional.effect, result);
      }
    }
  }

  return result;
}

// 개별 효과 적용
function applyEffect(effect: SkillEffect, result: SkillEffectResult): void {
  switch (effect.type) {
    case 'damage':
      if (effect.target === 'self') {
        result.selfDamage += effect.value;
      } else {
        result.damageDealt += effect.value;
      }
      break;
    case 'block':
      result.blockGained += effect.value;
      break;
    case 'heal':
      result.healAmount += effect.value;
      break;
    case 'coin_gain':
      result.coinsGained += effect.value;
      break;
    case 'apply_buff':
      if (effect.buffId) {
        result.buffsApplied.push({ buffId: effect.buffId, stacks: effect.value });
      }
      break;
  }
}

// 조건 체크
function checkCondition(
  player: Player,
  condition: string,
  value: string | number,
  enemy?: Enemy | null
): boolean {
  switch (condition) {
    case 'coins_above':
      // TODO: lastTossResults 기반으로 계산 필요
      return false;  // 임시로 비활성화
    case 'hp_below':
      // HP를 퍼센트로 체크
      const hpPercent = (player.hp / player.maxHp) * 100;
      return hpPercent < (value as number);
    case 'buff_active':
      return player.activeBuffs.some(b => b.buffId === value);
    case 'enemy_hp_below':
      // 적 HP 퍼센트 체크
      if (!enemy) return false;
      const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;
      return enemyHpPercent < (value as number);
    default:
      return false;
  }
}

// 스킬 상태 초기화 (런 시작 또는 새 스킬 획득 시)
export function createSkillState(skillId: string): SkillState {
  return {
    skillId,
    usedThisTurn: 0,
    cooldownRemaining: 0,
  };
}

// 스킬 상태 배열 초기화
export function createSkillStates(skills: Skill[]): SkillState[] {
  return skills.map(skill => createSkillState(skill.id));
}

// 턴 시작 시 스킬 상태 리셋
export function resetSkillStatesForNewTurn(skillStates: SkillState[]): SkillState[] {
  return skillStates.map(state => ({
    ...state,
    usedThisTurn: 0,
    cooldownRemaining: Math.max(0, state.cooldownRemaining - 1),
  }));
}

// 스킬 사용 후 상태 업데이트
export function updateSkillStateAfterUse(
  skillStates: SkillState[],
  skill: Skill
): SkillState[] {
  return skillStates.map(state => {
    if (state.skillId !== skill.id) return state;

    return {
      ...state,
      usedThisTurn: state.usedThisTurn + 1,
      cooldownRemaining: skill.cooldown ?? 0,
    };
  });
}

// 스킬 상태 찾기
export function getSkillState(
  skillStates: SkillState[],
  skillId: string
): SkillState | undefined {
  return skillStates.find(state => state.skillId === skillId);
}

// 버프 적용 (기존 버프 시스템과 연동)
export function applyBuffsToPlayer(
  player: Player,
  buffs: { buffId: string; stacks: number }[]
): Player {
  const newBuffs: ActiveBuff[] = [...player.activeBuffs];

  for (const buff of buffs) {
    const existing = newBuffs.find(b => b.buffId === buff.buffId);
    if (existing) {
      existing.stacks += buff.stacks;
    } else {
      newBuffs.push({
        buffId: buff.buffId,
        stacks: buff.stacks,
        remainingDuration: 'combat',  // 전투 종료까지
      });
    }
  }

  return { ...player, activeBuffs: newBuffs };
}

// 프리뷰용 스킬 효과 계산 (적 방어력 고려)
export function calculatePreviewEffects(
  player: Player,
  skill: Skill,
  enemy?: Enemy | null
): PreviewEffects {
  const result: PreviewEffects = {
    damage: 0,
    block: 0,
    heal: 0,
    selfDamage: 0,
    coinsGained: 0,
    buffs: [],
    conditionsMet: [],
  };

  // 기본 효과 처리
  for (const effect of skill.effects) {
    applyPreviewEffect(effect, result);
  }

  // 조건부 효과 처리
  if (skill.conditionalEffects) {
    for (const conditional of skill.conditionalEffects) {
      if (checkCondition(player, conditional.condition, conditional.conditionValue, enemy)) {
        applyPreviewEffect(conditional.effect, result);
        result.conditionsMet.push(conditional.condition);
      }
    }
  }

  // 적 방어력 고려한 실제 데미지 계산
  if (enemy && result.damage > 0) {
    result.damage = Math.max(0, result.damage - enemy.block);
  }

  return result;
}

// 프리뷰용 효과 적용
function applyPreviewEffect(effect: SkillEffect, result: PreviewEffects): void {
  switch (effect.type) {
    case 'damage':
      if (effect.target === 'self') {
        result.selfDamage += effect.value;
      } else {
        result.damage += effect.value;
      }
      break;
    case 'block':
      result.block += effect.value;
      break;
    case 'heal':
      result.heal += effect.value;
      break;
    case 'coin_gain':
      result.coinsGained += effect.value;
      break;
    case 'apply_buff':
      if (effect.buffId) {
        result.buffs.push(effect.buffId);
      }
      break;
  }
}

// ===== 탐욕 시스템 =====

// 탐욕 스택 처리 결과
export interface GreedProcessResult {
  triggered: boolean;           // 탐욕이 발동되었는지
  bonusTossResults: boolean[];  // 보너스 토스 결과 (true = 앞면, false = 뒷면)
  coinsConsumed: number;        // 소모된 코인 수 (앞면 개수)
  newPlayer: Player;            // 업데이트된 플레이어 상태
  remainingResults: CoinTossResult[];  // 남은 코인 결과
}

// 탐욕 스택 체크 및 처리
export function processGreedStack(
  player: Player,
  lastTossResults: CoinTossResult[]
): GreedProcessResult {
  const greedBuff = player.activeBuffs.find(b => b.buffId === 'greed_stack');

  // 탐욕 스택이 없거나 임계치 미달
  if (!greedBuff || greedBuff.stacks < GREED_CONSTANTS.THRESHOLD) {
    return {
      triggered: false,
      bonusTossResults: [],
      coinsConsumed: 0,
      newPlayer: player,
      remainingResults: lastTossResults,
    };
  }

  // 탐욕 발동!
  // 스택 소모 (3 감소)
  const newBuffs = player.activeBuffs.map(b => {
    if (b.buffId === 'greed_stack') {
      const newStacks = b.stacks - GREED_CONSTANTS.THRESHOLD;
      return newStacks > 0 ? { ...b, stacks: newStacks } : null;
    }
    return b;
  }).filter((b): b is ActiveBuff => b !== null);

  // 보너스 코인 토스 실행
  const bonusTossResults: boolean[] = [];
  for (let i = 0; i < GREED_CONSTANTS.BONUS_TOSS_COUNT; i++) {
    // 50% 확률로 앞면/뒷면
    bonusTossResults.push(Math.random() < 0.5);
  }

  // 앞면 개수 = 소모될 코인 수
  const headsCount = bonusTossResults.filter(r => r).length;

  // 앞면 결과는 코인 소모
  const spendResult = spendCoins(lastTossResults, headsCount, 0);

  // 새 플레이어 상태
  const newPlayer: Player = {
    ...player,
    activeBuffs: newBuffs,
  };

  return {
    triggered: true,
    bonusTossResults,
    coinsConsumed: headsCount,
    newPlayer,
    remainingResults: spendResult.remainingResults,
  };
}

// 탐욕 스택 현재 수치 조회
export function getGreedStackCount(player: Player): number {
  const greedBuff = player.activeBuffs.find(b => b.buffId === 'greed_stack');
  return greedBuff?.stacks ?? 0;
}

// 탐욕 발동까지 남은 스택 수
export function getGreedStacksRemaining(player: Player): number {
  const current = getGreedStackCount(player);
  return Math.max(0, GREED_CONSTANTS.THRESHOLD - current);
}
