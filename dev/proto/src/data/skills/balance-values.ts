/**
 * 스킬 밸런스 상수
 *
 * 모든 밸런스 수치를 한 곳에서 관리하여 수정 용이성 확보
 */

export const BALANCE_VALUES = {
  // 효과별 밸류 (1 Value = 1 단위)
  damage: 1.0,
  block: 1.0,
  heal: 1.4,        // 안정성 패널티
  buff_stack: 3.0,  // 지속 효과 가치
  self_damage_penalty: 1.5,

  // 코스트별 기준 밸류
  cost1: { min: 5, max: 6 },
  cost2: { min: 10, max: 14 },
  cost3: { min: 15, max: 18 },

  // 제약 조건 보정
  maxUse1: 1.20,  // 턴당 1회 제한 = +20% 밸류
  maxUse2: 1.10,  // 턴당 2회 제한 = +10% 밸류
  cooldown2: 1.15,  // 쿨다운 2턴 = +15% 밸류
  cooldown3: 1.25,  // 쿨다운 3턴 = +25% 밸류

  // 조건부 효과 증폭
  conditional_hp: 1.50,      // HP 조건 = +50% 밸류
  conditional_enemy: 1.40,   // 적 조건 = +40% 밸류
  conditional_buff: 1.30,    // 버프 조건 = +30% 밸류
  conditional_coin: 1.20,    // 코인 조건 = +20% 밸류
} as const;

/**
 * 스킬 밸류 계산 유틸리티
 */
export const SkillBalanceUtils = {
  /**
   * 기본 효과 밸류 계산
   */
  calculateBaseValue(effects: Array<{ type: string; value: number; target?: string }>): number {
    let total = 0;

    for (const effect of effects) {
      switch (effect.type) {
        case 'damage':
          total += effect.value * BALANCE_VALUES.damage;
          // 자해는 패널티
          if (effect.target === 'self') {
            total -= effect.value * BALANCE_VALUES.self_damage_penalty;
          }
          break;
        case 'block':
          total += effect.value * BALANCE_VALUES.block;
          break;
        case 'heal':
          total += effect.value * BALANCE_VALUES.heal;
          break;
        case 'apply_buff':
          total += effect.value * BALANCE_VALUES.buff_stack;
          break;
        case 'coin_gain':
          // 코인 획득은 간접적 가치
          total += effect.value * 1.0;
          break;
      }
    }

    return total;
  },

  /**
   * 제약 조건 보정 계산
   */
  calculateConstraintBonus(maxUsePerTurn?: number, cooldown?: number): number {
    let multiplier = 1.0;

    if (maxUsePerTurn === 1) {
      multiplier *= BALANCE_VALUES.maxUse1;
    } else if (maxUsePerTurn === 2) {
      multiplier *= BALANCE_VALUES.maxUse2;
    }

    if (cooldown === 2) {
      multiplier *= BALANCE_VALUES.cooldown2;
    } else if (cooldown === 3) {
      multiplier *= BALANCE_VALUES.cooldown3;
    }

    return multiplier;
  },

  /**
   * 스킬의 총 밸류 계산 (조건부 효과 포함)
   */
  calculateTotalValue(
    baseEffects: Array<{ type: string; value: number; target?: string }>,
    maxUsePerTurn?: number,
    cooldown?: number
  ): number {
    const baseValue = this.calculateBaseValue(baseEffects);
    const constraintMultiplier = this.calculateConstraintBonus(maxUsePerTurn, cooldown);
    return baseValue * constraintMultiplier;
  },
};
