import type { Coin, CoinInventory } from '../types';

// 동전 정의
export const COIN_DEFINITIONS: Record<string, Coin> = {
  copper_coin: {
    id: 'copper_coin',
    denomination: 1,
    emoji: '🟤',
    name: '구리 동전',
  },
  silver_coin: {
    id: 'silver_coin',
    denomination: 5,
    emoji: '⚪',
    name: '은 동전',
  },
  gold_coin: {
    id: 'gold_coin',
    denomination: 10,
    emoji: '🟡',
    name: '금 동전',
  },
};

// 초기 동전 인벤토리 (런 시작 시)
export const INITIAL_COIN_INVENTORY: CoinInventory[] = [
  { coinId: 'copper_coin', count: 3 },
];

// 동전 정의 조회
export function getCoinDefinition(coinId: string): Coin | undefined {
  return COIN_DEFINITIONS[coinId];
}
