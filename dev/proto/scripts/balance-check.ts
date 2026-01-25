/**
 * 스킬 밸런스 검증 스크립트
 *
 * 실행: npm run balance-check
 *
 * 모든 스킬의 밸류를 계산하고 기준 범위와 비교하여
 * 밸런스 이슈를 자동으로 탐지합니다.
 */

import { SKILL_DEFINITIONS } from '../src/data/skills';
import { BALANCE_VALUES, SkillBalanceUtils } from '../src/data/skills/balance-values';

// 결과 타입
type BalanceResult = 'OK' | 'WARNING' | 'FAIL';

interface SkillAnalysis {
  skillKey: string;
  name: string;
  cost: number;
  baseValue: number;
  constraintBonus: number;
  totalValue: number;
  expectedRange: { min: number; max: number };
  result: BalanceResult;
  notes: string[];
}

// 코스트별 기준 범위 가져오기
function getCostRange(cost: number): { min: number; max: number } {
  switch (cost) {
    case 1:
      return BALANCE_VALUES.cost1;
    case 2:
      return BALANCE_VALUES.cost2;
    case 3:
      return BALANCE_VALUES.cost3;
    default:
      // 4코인 이상은 3코인 기준의 비례 계산
      const base = BALANCE_VALUES.cost3;
      const ratio = cost / 3;
      return {
        min: Math.round(base.min * ratio),
        max: Math.round(base.max * ratio),
      };
  }
}

// 밸런스 판정
function judgeBalance(value: number, range: { min: number; max: number }): BalanceResult {
  const warningThreshold = range.max * 1.2; // +20%

  if (value >= range.min && value <= range.max) {
    return 'OK';
  } else if (value < range.min) {
    return 'WARNING'; // 약함
  } else if (value <= warningThreshold) {
    return 'WARNING'; // 약간 강함
  } else {
    return 'FAIL'; // 너무 강함
  }
}

// 스킬 분석
function analyzeSkill(skillKey: string): SkillAnalysis {
  const skill = SKILL_DEFINITIONS[skillKey];
  const notes: string[] = [];

  if (!skill) {
    return {
      skillKey,
      name: 'UNKNOWN',
      cost: 0,
      baseValue: 0,
      constraintBonus: 0,
      totalValue: 0,
      expectedRange: { min: 0, max: 0 },
      result: 'FAIL',
      notes: ['스킬을 찾을 수 없음'],
    };
  }

  // 기본 효과 밸류 계산
  const baseValue = SkillBalanceUtils.calculateBaseValue(skill.effects || []);

  // 제약 조건 보정
  const constraintBonus = SkillBalanceUtils.calculateConstraintBonus(
    skill.maxUsePerTurn || undefined,
    skill.cooldown
  );

  // 조건부 효과 계산 (기대 밸류)
  let conditionalValue = 0;
  if (skill.conditionalEffects) {
    for (const cond of skill.conditionalEffects) {
      // 조건 유형에 따른 발동 확률과 증폭 계산
      let probability = 0.5; // 기본 50%
      let amplifier = 1.0;

      switch (cond.condition) {
        case 'hp_below':
          probability = 0.3; // HP 조건 발동 확률 30%
          amplifier = BALANCE_VALUES.conditional_hp;
          notes.push(`HP 조건: ${cond.conditionValue}% 미만`);
          break;
        case 'enemy_hp_below':
          probability = 0.4; // 적 HP 조건 발동 확률 40%
          amplifier = BALANCE_VALUES.conditional_enemy;
          notes.push(`적 HP 조건: ${cond.conditionValue}% 미만`);
          break;
        case 'has_buff':
          probability = 0.6; // 버프 조건 발동 확률 60%
          amplifier = BALANCE_VALUES.conditional_buff;
          notes.push(`버프 조건`);
          break;
        case 'coin_result':
          probability = 0.5; // 코인 조건 발동 확률 50%
          amplifier = BALANCE_VALUES.conditional_coin;
          notes.push(`코인 조건`);
          break;
      }

      // 조건부 효과 밸류 (기대값)
      if (cond.effect) {
        const effectValue = SkillBalanceUtils.calculateBaseValue([cond.effect]);
        conditionalValue += effectValue * probability * amplifier;
      }
    }
  }

  // 총 밸류 계산
  const totalValue = (baseValue + conditionalValue) * constraintBonus;

  // 기준 범위
  const expectedRange = getCostRange(skill.coinCost);

  // 판정
  const result = judgeBalance(totalValue, expectedRange);

  // 제약 조건 메모
  if (skill.maxUsePerTurn === 1) {
    notes.push('턴당 1회');
  } else if (skill.maxUsePerTurn === 2) {
    notes.push('턴당 2회');
  }
  if (skill.cooldown) {
    notes.push(`쿨다운 ${skill.cooldown}턴`);
  }

  return {
    skillKey,
    name: skill.name,
    cost: skill.coinCost,
    baseValue: Math.round(baseValue * 100) / 100,
    constraintBonus: Math.round(constraintBonus * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
    expectedRange,
    result,
    notes,
  };
}

// 결과 출력
function printResults(analyses: SkillAnalysis[]): void {
  console.log('\n========================================');
  console.log('     스킬 밸런스 검증 결과');
  console.log('========================================\n');

  // 코스트별 그룹화
  const byCost: Record<number, SkillAnalysis[]> = {};
  for (const analysis of analyses) {
    if (!byCost[analysis.cost]) {
      byCost[analysis.cost] = [];
    }
    byCost[analysis.cost].push(analysis);
  }

  let okCount = 0;
  let warningCount = 0;
  let failCount = 0;

  for (const cost of Object.keys(byCost).sort((a, b) => Number(a) - Number(b))) {
    const group = byCost[Number(cost)];
    console.log(`\n--- ${cost}코인 스킬 (기준: ${getCostRange(Number(cost)).min}~${getCostRange(Number(cost)).max}) ---\n`);

    for (const analysis of group) {
      let icon = '';
      switch (analysis.result) {
        case 'OK':
          icon = '\x1b[32m✅\x1b[0m';
          okCount++;
          break;
        case 'WARNING':
          icon = '\x1b[33m⚠️\x1b[0m';
          warningCount++;
          break;
        case 'FAIL':
          icon = '\x1b[31m❌\x1b[0m';
          failCount++;
          break;
      }

      const valueStr = analysis.totalValue.toFixed(1).padStart(5);
      const rangeStr = `${analysis.expectedRange.min}~${analysis.expectedRange.max}`;
      const notesStr = analysis.notes.length > 0 ? ` (${analysis.notes.join(', ')})` : '';

      console.log(
        `${icon} ${analysis.name.padEnd(12)} [${analysis.skillKey.padEnd(15)}]: ` +
          `밸류 ${valueStr} [${analysis.result.padEnd(7)} 기준 ${rangeStr}]${notesStr}`
      );
    }
  }

  // 요약
  console.log('\n========================================');
  console.log('             요약');
  console.log('========================================');
  console.log(`총 스킬 수: ${analyses.length}`);
  console.log(`\x1b[32m✅ OK:      ${okCount}\x1b[0m`);
  console.log(`\x1b[33m⚠️ WARNING: ${warningCount}\x1b[0m`);
  console.log(`\x1b[31m❌ FAIL:    ${failCount}\x1b[0m`);
  console.log('========================================\n');

  // 종료 코드 설정
  if (failCount > 0) {
    process.exit(1);
  }
}

// 메인 실행
function main(): void {
  const skillKeys = Object.keys(SKILL_DEFINITIONS);
  const analyses = skillKeys.map(analyzeSkill);
  printResults(analyses);
}

main();
