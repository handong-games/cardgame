import type { ShopItem, LootItem, CharacterClass } from '../types';
import { generateRewardSkills } from './skills';

let shopItemIdCounter = 0;
let lootIdCounter = 0;

export function resetShopIdCounters(): void {
  shopItemIdCounter = 0;
  lootIdCounter = 0;
}

const LOOT_DEFINITIONS: Record<string, Omit<LootItem, 'id'>> = {
  poison_dagger: {
    lootKey: 'poison_dagger',
    name: '독 단검',
    description: '공격 시 독 1 부여',
    emoji: '🗡️',
    rarity: 'common',
    effectDescription: '공격 스킬 사용 시 대상에게 독 1 스택 부여',
  },
  iron_shield: {
    lootKey: 'iron_shield',
    name: '철 방패',
    description: '턴 시작 시 방어 2 획득',
    emoji: '🛡️',
    rarity: 'common',
    effectDescription: '매 턴 시작 시 방어도 2 자동 획득',
  },
  healing_herb: {
    lootKey: 'healing_herb',
    name: '치유 약초',
    description: '턴 종료 시 HP 1 회복',
    emoji: '🌿',
    rarity: 'common',
    effectDescription: '매 턴 종료 시 HP 1 회복',
  },
  lucky_coin: {
    lootKey: 'lucky_coin',
    name: '행운의 동전',
    description: '코인 플립 시 앞면 확률 +10%',
    emoji: '🪙',
    rarity: 'rare',
    effectDescription: '코인 플립 시 앞면이 나올 확률 60%로 증가',
  },
  soul_magnet: {
    lootKey: 'soul_magnet',
    name: '영혼 자석',
    description: '전투 승리 시 소울 +3',
    emoji: '💎',
    rarity: 'rare',
    effectDescription: '전투 승리 시 추가 소울 3 획득',
  },
  thorns_amulet: {
    lootKey: 'thorns_amulet',
    name: '가시 부적',
    description: '피격 시 공격자에게 1 데미지',
    emoji: '🌹',
    rarity: 'common',
    effectDescription: '피격 시 공격자에게 1 데미지 반사',
  },
  berserker_ring: {
    lootKey: 'berserker_ring',
    name: '광전사의 반지',
    description: 'HP 50% 이하 시 데미지 +2',
    emoji: '💍',
    rarity: 'rare',
    effectDescription: 'HP가 50% 이하일 때 모든 공격 데미지 +2',
  },
  swift_boots: {
    lootKey: 'swift_boots',
    name: '신속의 장화',
    description: '첫 스킬 코스트 -1',
    emoji: '👢',
    rarity: 'common',
    effectDescription: '매 턴 첫 번째 스킬 사용 시 코스트 1 감소',
  },
};

const LOOT_KEYS = Object.keys(LOOT_DEFINITIONS);
const COMMON_LOOT_KEYS = LOOT_KEYS.filter(k => LOOT_DEFINITIONS[k].rarity === 'common');
const RARE_LOOT_KEYS = LOOT_KEYS.filter(k => LOOT_DEFINITIONS[k].rarity === 'rare');

function createLootItem(lootKey: string): LootItem | null {
  const definition = LOOT_DEFINITIONS[lootKey];
  if (!definition) return null;
  return {
    id: `loot_${lootIdCounter++}`,
    ...definition,
  };
}

function randomizePrice(basePrice: number): number {
  const variation = Math.floor(basePrice * 0.15);
  const offset = Math.floor(Math.random() * (variation * 2 + 1)) - variation;
  return basePrice + offset;
}

function generateShopLoots(count: number = 3, existingLootKeys: string[] = []): ShopItem[] {
  const availableCommon = COMMON_LOOT_KEYS.filter(k => !existingLootKeys.includes(k));
  const availableRare = RARE_LOOT_KEYS.filter(k => !existingLootKeys.includes(k));

  const items: ShopItem[] = [];
  const usedKeys: string[] = [];

  const hasRare = Math.random() < 0.7;
  if (hasRare && availableRare.length > 0) {
    const rareIdx = Math.floor(Math.random() * availableRare.length);
    const rareKey = availableRare[rareIdx];
    const loot = createLootItem(rareKey);
    if (loot) {
      items.push({
        id: `shop_${shopItemIdCounter++}`,
        type: 'loot',
        price: randomizePrice(15),
        sold: false,
        loot,
      });
      usedKeys.push(rareKey);
    }
  }

  const remainingCount = count - items.length;
  const shuffledCommon = availableCommon
    .filter(k => !usedKeys.includes(k))
    .sort(() => Math.random() - 0.5);

  for (let i = 0; i < remainingCount && i < shuffledCommon.length; i++) {
    const loot = createLootItem(shuffledCommon[i]);
    if (loot) {
      items.push({
        id: `shop_${shopItemIdCounter++}`,
        type: 'loot',
        price: randomizePrice(8),
        sold: false,
        loot,
      });
    }
  }

  return items;
}

export function generateShopItems(
  characterClass: CharacterClass,
  existingSkillKeys: string[],
  existingLootKeys: string[] = [],
): ShopItem[] {
  const items: ShopItem[] = [];

  const skills = generateRewardSkills(characterClass, 8);
  const filteredSkills = skills.filter(s => !existingSkillKeys.includes(s.skillKey));
  const shopSkills = filteredSkills.slice(0, 5);

  for (const skill of shopSkills) {
    const isExpensive = (skill.headsCost ?? 0) + (skill.tailsCost ?? 0) >= 2;
    const basePrice = isExpensive ? 17 : 10;
    items.push({
      id: `shop_${shopItemIdCounter++}`,
      type: 'skill',
      price: randomizePrice(basePrice),
      sold: false,
      skill,
    });
  }

  const lootItems = generateShopLoots(3, existingLootKeys);
  items.push(...lootItems);

  items.push({
    id: `shop_${shopItemIdCounter++}`,
    type: 'slot_expansion',
    price: randomizePrice(30),
    sold: false,
  });

  return items;
}

export const MERCHANT_DIALOGUES = {
  greeting: [
    '오늘은 좋은 물건이 왔다네.',
    '어서 오게, 모험가여. 천천히 둘러보게.',
    '좋은 물건들만 골라 왔다네!',
  ],
  purchase: [
    '좋은 선택이야!',
    '그건 인기 상품이지.',
    '현명한 투자라네.',
  ],
  insufficient: [
    '소울이 부족하군...',
    '돈이 좀 모자라는군.',
    '더 벌어서 오게나.',
  ],
  farewell: [
    '다음에 또 들러.',
    '좋은 여행이 되길!',
    '살아서 돌아오게나.',
  ],
  slotMax: [
    '더 이상 확장할 수 없다네.',
  ],
} as const;

export function getRandomDialogue(category: keyof typeof MERCHANT_DIALOGUES): string {
  const dialogues = MERCHANT_DIALOGUES[category];
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

export { LOOT_DEFINITIONS };
