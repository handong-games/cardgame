import type { CharacterClass } from '../types';

// 전직 정의
export interface AdvancementDefinition {
  id: CharacterClass;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredCardIds: string[];  // 전직에 필요한 카드 ID 목록 (모두 획득해야 전직)
  auraId?: string;            // 전직 시 획득하는 오라 버프 ID
  auraDescription: string;
}

// 전직 정의 목록
export const ADVANCEMENT_DEFINITIONS: Record<CharacterClass, AdvancementDefinition> = {
  warrior: {
    id: 'warrior',
    name: '전사',
    description: '기본 클래스',
    icon: '🧑‍⚔️',
    color: '#888888',
    requiredCardIds: [],
    auraDescription: '',
  },
  paladin: {
    id: 'paladin',
    name: '팔라딘',
    description: '수호자 - 공방 밸런스, 오라',
    icon: '⚔️',
    color: '#FFD700',
    requiredCardIds: ['battlefield_will', 'iron_will', 'counter', 'holy_focus'],
    auraId: 'aura_of_devotion',
    auraDescription: '턴 시작 시 +2 방어, 공격 시 +1 데미지',
  },
  berserker: {
    id: 'berserker',
    name: '버서커',
    description: '파괴자 - 리스크 공격, HP 소모',
    icon: '🔥',
    color: '#FF4444',
    requiredCardIds: ['battlefield_will', 'iron_will', 'flash_slash', 'blood_price'],
    auraId: 'berserker_rage',
    auraDescription: 'HP 50% 이하 시 데미지 +50%',
  },
  swordmaster: {
    id: 'swordmaster',
    name: '검사',
    description: '통제된 폭력, 숙련된 기술',
    icon: '⚔️',
    color: '#4488FF',
    requiredCardIds: ['battlefield_will', 'flash_slash', 'counter', 'chain_slash'],
    auraId: 'blade_mastery',
    auraDescription: '카드 사용 3회마다 카드 1장 드로우',
  },
  rogue: {
    id: 'rogue',
    name: '도적',
    description: '(미구현)',
    icon: '🗡️',
    color: '#888888',
    requiredCardIds: [],
    auraDescription: '',
  },
  mage: {
    id: 'mage',
    name: '마법사',
    description: '(미구현)',
    icon: '🔮',
    color: '#888888',
    requiredCardIds: [],
    auraDescription: '',
  },
};

// 전직 가능 여부 확인 (기본 클래스에서만 전직 가능)
export function canAdvanceFrom(currentClass: CharacterClass): boolean {
  return currentClass === 'warrior';
}

// 사용 가능한 전직 목록 (전사에서 전직 가능한 클래스들)
export const AVAILABLE_ADVANCEMENTS: CharacterClass[] = ['paladin', 'berserker', 'swordmaster'];

// 전직별 고유 카드 키 (전직 보상으로 제공)
export const ADVANCEMENT_EXCLUSIVE_CARDS: Record<CharacterClass, string[]> = {
  warrior: [],
  paladin: ['aura_of_devotion', 'holy_strike', 'shield_of_purification'],
  berserker: [], // TODO: 버서커 고유 카드 추가
  swordmaster: [], // TODO: 검사 고유 카드 추가
  rogue: [], // TODO: 도적 고유 카드 추가
  mage: [], // TODO: 마법사 고유 카드 추가
};
