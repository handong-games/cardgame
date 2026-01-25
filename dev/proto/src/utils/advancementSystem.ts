import type { Card, CharacterClass, Player } from '../types';
import { ADVANCEMENT_DEFINITIONS, AVAILABLE_ADVANCEMENTS, canAdvanceFrom } from '../data/advancement';

// 클래스별 아이콘
export const CLASS_ICONS: Record<CharacterClass, string> = {
  warrior: '🧑‍⚔️',
  paladin: '⚔️',
  berserker: '🔥',
  swordmaster: '⚔️',
  rogue: '🗡️',
  mage: '🔮',
};

// 클래스별 색상
export const CLASS_COLORS: Record<CharacterClass, string> = {
  warrior: '#888888',
  paladin: '#FFD700',
  berserker: '#FF4444',
  swordmaster: '#4488FF',
  rogue: '#888888',
  mage: '#888888',
};

// 클래스 한글명
export const CLASS_NAMES: Record<CharacterClass, string> = {
  warrior: '전사',
  paladin: '팔라딘',
  berserker: '버서커',
  swordmaster: '검사',
  rogue: '도적',
  mage: '마법사',
};

// 전직 힌트 정보 타입
export interface AdvancementHintInfo {
  targetClass: CharacterClass;
  icon: string;
  color: string;
  className: string;
  ownedCardIds: string[];      // 보유한 필수 카드 ID 목록
  missingCardIds: string[];    // 미보유 필수 카드 ID 목록
  requiredCardIds: string[];   // 전체 필수 카드 ID 목록
  willAdvanceOnSelect: boolean;
}

// 다중 전직 힌트 (카드 하나가 여러 전직에 기여할 수 있음)
export interface MultiAdvancementHint {
  hints: AdvancementHintInfo[];
}

// 덱에서 특정 전직에 필요한 카드 중 보유한 카드 키 목록 반환
export function getOwnedRequiredCards(deck: Card[], targetClass: CharacterClass): string[] {
  const definition = ADVANCEMENT_DEFINITIONS[targetClass];
  if (!definition || definition.requiredCardIds.length === 0) return [];

  // cardKey 사용 (없으면 빈 문자열)
  const deckCardKeys = deck.map(card => card.cardKey ?? '').filter(key => key !== '');

  return definition.requiredCardIds.filter(reqId => deckCardKeys.includes(reqId));
}

// 덱에서 특정 전직에 필요한 카드 중 미보유 카드 ID 목록 반환
export function getMissingRequiredCards(deck: Card[], targetClass: CharacterClass): string[] {
  const definition = ADVANCEMENT_DEFINITIONS[targetClass];
  if (!definition || definition.requiredCardIds.length === 0) return [];

  const ownedIds = getOwnedRequiredCards(deck, targetClass);
  return definition.requiredCardIds.filter(reqId => !ownedIds.includes(reqId));
}

// 전직 조건 충족 여부 체크 (모든 필수 카드 보유 시 전직)
export function canAdvanceToClass(
  currentClass: CharacterClass,
  targetClass: CharacterClass,
  deck: Card[]
): boolean {
  // 전사만 전직 가능
  if (!canAdvanceFrom(currentClass)) return false;

  // 이미 해당 클래스면 전직 불가
  if (currentClass === targetClass) return false;

  const definition = ADVANCEMENT_DEFINITIONS[targetClass];
  if (!definition || definition.requiredCardIds.length === 0) return false;

  // 모든 필수 카드를 보유해야 전직 가능
  const missingCards = getMissingRequiredCards(deck, targetClass);
  return missingCards.length === 0;
}

// 전직 가능한 클래스 목록 반환 (다중 전직 지원)
export function getAvailableAdvancements(
  currentClass: CharacterClass,
  deck: Card[]
): CharacterClass[] {
  if (!canAdvanceFrom(currentClass)) return [];

  return AVAILABLE_ADVANCEMENTS.filter(targetClass =>
    canAdvanceToClass(currentClass, targetClass, deck)
  );
}

// 전직 처리
export function processClassAdvancement(
  player: Player,
  targetClass: CharacterClass
): Player {
  return {
    ...player,
    characterClass: targetClass,
  };
}

// 카드에서 cardKey 추출
export function getCardKey(card: Card): string {
  return card.cardKey ?? '';
}

// 전직 진행도 계산 (단일 전직)
export function getAdvancementProgress(
  deck: Card[],
  card: Card,
  playerClass: CharacterClass
): AdvancementHintInfo | null {
  // advancesTo가 없으면 null (전직에 기여 안함)
  if (!card.advancesTo || card.advancesTo.length === 0) return null;

  // 전사만 전직 가능
  if (!canAdvanceFrom(playerClass)) return null;

  // 첫 번째 전직만 반환 (단일 힌트)
  const targetClass = card.advancesTo[0];

  const definition = ADVANCEMENT_DEFINITIONS[targetClass];
  if (!definition) return null;

  const ownedCardIds = getOwnedRequiredCards(deck, targetClass);
  const missingCardIds = getMissingRequiredCards(deck, targetClass);
  const cardKey = getCardKey(card);

  // 이 카드를 선택하면 전직 가능한지 체크
  const willAdvanceOnSelect = missingCardIds.length === 1 && missingCardIds.includes(cardKey);

  return {
    targetClass,
    icon: CLASS_ICONS[targetClass],
    color: CLASS_COLORS[targetClass],
    className: CLASS_NAMES[targetClass],
    ownedCardIds,
    missingCardIds,
    requiredCardIds: definition.requiredCardIds,
    willAdvanceOnSelect,
  };
}

// 다중 전직 진행도 계산 (카드가 여러 전직에 기여하는 경우)
export function getMultiAdvancementProgress(
  deck: Card[],
  card: Card,
  playerClass: CharacterClass
): MultiAdvancementHint | null {
  // advancesTo가 없으면 null
  if (!card.advancesTo || card.advancesTo.length === 0) return null;

  // 전사만 전직 가능
  if (!canAdvanceFrom(playerClass)) return null;

  const hints: AdvancementHintInfo[] = [];
  const cardKey = getCardKey(card);

  for (const targetClass of card.advancesTo) {
    // 이미 해당 클래스면 스킵
    if (playerClass === targetClass) continue;

    const definition = ADVANCEMENT_DEFINITIONS[targetClass];
    if (!definition) continue;

    const ownedCardIds = getOwnedRequiredCards(deck, targetClass);
    const missingCardIds = getMissingRequiredCards(deck, targetClass);

    // 이미 덱에 있는 카드 종류면 더 이상 기여하지 않으므로 스킵
    if (ownedCardIds.includes(cardKey)) continue;

    // 이 카드를 선택하면 전직 가능한지 체크
    const willAdvanceOnSelect = missingCardIds.length === 1 && missingCardIds.includes(cardKey);

    hints.push({
      targetClass,
      icon: CLASS_ICONS[targetClass],
      color: CLASS_COLORS[targetClass],
      className: CLASS_NAMES[targetClass],
      ownedCardIds,
      missingCardIds,
      requiredCardIds: definition.requiredCardIds,
      willAdvanceOnSelect,
    });
  }

  if (hints.length === 0) return null;

  return { hints };
}

// 전직 정보 가져오기
export function getAdvancementDefinition(targetClass: CharacterClass) {
  return ADVANCEMENT_DEFINITIONS[targetClass];
}
