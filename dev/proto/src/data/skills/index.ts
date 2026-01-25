import type { Skill, CharacterClass } from '../../types';
import {
  WARRIOR_SKILL_DEFINITIONS,
  WARRIOR_STARTING_SKILLS,
  WARRIOR_REWARD_SKILL_POOL,
} from './warrior';
import {
  PALADIN_SKILL_DEFINITIONS,
  PALADIN_STARTING_SKILLS,
  PALADIN_REWARD_SKILL_POOL,
} from './paladin';
import {
  COMMON_SKILL_DEFINITIONS,
  COMMON_REWARD_SKILL_POOL,
} from './common';

// 모든 스킬 정의 통합 (클래스별 + 공용)
export const SKILL_DEFINITIONS: Record<string, Omit<Skill, 'id'>> = {
  ...WARRIOR_SKILL_DEFINITIONS,
  ...PALADIN_SKILL_DEFINITIONS,
  ...COMMON_SKILL_DEFINITIONS,
};

// 클래스별 시작 스킬 매핑
const CLASS_STARTING_SKILLS: Record<CharacterClass, string[]> = {
  warrior: WARRIOR_STARTING_SKILLS,
  paladin: PALADIN_STARTING_SKILLS,
  berserker: WARRIOR_STARTING_SKILLS,  // 추후 별도 정의
  swordmaster: WARRIOR_STARTING_SKILLS,  // 추후 별도 정의
  rogue: WARRIOR_STARTING_SKILLS,  // TODO: 도적 시작 스킬
  mage: WARRIOR_STARTING_SKILLS,  // TODO: 마법사 시작 스킬
};

// 클래스별 보상 스킬 풀 매핑 (공용 스킬 포함)
const CLASS_REWARD_POOLS: Record<CharacterClass, string[]> = {
  warrior: [...WARRIOR_REWARD_SKILL_POOL, ...COMMON_REWARD_SKILL_POOL],
  paladin: [...PALADIN_REWARD_SKILL_POOL, ...COMMON_REWARD_SKILL_POOL],
  berserker: [...WARRIOR_REWARD_SKILL_POOL, ...COMMON_REWARD_SKILL_POOL],  // 추후 별도 정의
  swordmaster: [...WARRIOR_REWARD_SKILL_POOL, ...COMMON_REWARD_SKILL_POOL],  // 추후 별도 정의
  rogue: [...WARRIOR_REWARD_SKILL_POOL, ...COMMON_REWARD_SKILL_POOL],  // TODO: 도적 보상 스킬 풀
  mage: [...WARRIOR_REWARD_SKILL_POOL, ...COMMON_REWARD_SKILL_POOL],  // TODO: 마법사 보상 스킬 풀
};

// 스킬 키로 스킬 정의 가져오기
export function getSkillDefinition(skillKey: string): Omit<Skill, 'id'> | undefined {
  return SKILL_DEFINITIONS[skillKey];
}

// 스킬 인스턴스 생성 (고유 ID 부여)
let skillIdCounter = 0;
export function createSkill(skillKey: string): Skill | null {
  const definition = SKILL_DEFINITIONS[skillKey];
  if (!definition) return null;

  return {
    id: `skill_${skillIdCounter++}`,
    ...definition,
  };
}

// 클래스 시작 스킬 생성
export function createStartingSkills(characterClass: CharacterClass): Skill[] {
  const skillKeys = CLASS_STARTING_SKILLS[characterClass] || WARRIOR_STARTING_SKILLS;
  return skillKeys
    .map(key => createSkill(key))
    .filter((skill): skill is Skill => skill !== null);
}

// 보상 스킬 선택지 생성 (3개)
export function generateRewardSkills(characterClass: CharacterClass, count: number = 3): Skill[] {
  const pool = CLASS_REWARD_POOLS[characterClass] || WARRIOR_REWARD_SKILL_POOL;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected
    .map(key => createSkill(key))
    .filter((skill): skill is Skill => skill !== null);
}

// 스킬 ID 카운터 리셋 (런 시작 시)
export function resetSkillIdCounter(): void {
  skillIdCounter = 0;
}

// Re-export
export {
  WARRIOR_SKILL_DEFINITIONS,
  WARRIOR_STARTING_SKILLS,
  PALADIN_SKILL_DEFINITIONS,
  PALADIN_STARTING_SKILLS,
  COMMON_SKILL_DEFINITIONS,
  COMMON_REWARD_SKILL_POOL,
};
