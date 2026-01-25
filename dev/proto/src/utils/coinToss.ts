import type { CoinInventory, CoinTossResult } from '../types';
import { getCoinDefinition } from '../data/coins';

/**
 * 단일 동전 토스 (50% 확률)
 */
export function tossCoin(coinId: string): CoinTossResult | null {
  const coin = getCoinDefinition(coinId);
  if (!coin) return null;

  return {
    coinId,
    denomination: coin.denomination,
    isHeads: Math.random() < 0.5,
  };
}

/**
 * 모든 보유 동전 토스
 * @param inventory 동전 인벤토리
 * @returns 각 동전의 토스 결과 배열
 */
export function tossAllCoins(inventory: CoinInventory[]): CoinTossResult[] {
  const results: CoinTossResult[] = [];

  for (const inv of inventory) {
    const coin = getCoinDefinition(inv.coinId);
    if (!coin) continue;

    // 보유 개수만큼 토스
    for (let i = 0; i < inv.count; i++) {
      const result = tossCoin(inv.coinId);
      if (result) {
        results.push(result);
      }
    }
  }

  return results;
}

/**
 * 토스 결과에서 앞면 코인 합계 계산
 * @param results 토스 결과 배열
 * @returns 앞면인 코인의 denomination 합계
 */
export function calculateCoinsFromToss(results: CoinTossResult[]): number {
  return results
    .filter(r => r.isHeads)
    .reduce((sum, r) => sum + r.denomination, 0);
}

/**
 * 토스 결과 통계 정보
 */
export interface TossStatistics {
  totalCoins: number;      // 총 동전 개수
  headsCount: number;      // 앞면 개수
  tailsCount: number;      // 뒷면 개수
  totalValue: number;      // 획득한 코인 합계
}

/**
 * 토스 결과 통계 계산
 */
export function getTossStatistics(results: CoinTossResult[]): TossStatistics {
  const headsResults = results.filter(r => r.isHeads);

  return {
    totalCoins: results.length,
    headsCount: headsResults.length,
    tailsCount: results.length - headsResults.length,
    totalValue: calculateCoinsFromToss(results),
  };
}

/**
 * 앞면/뒷면 코인 가치
 */
export interface CoinValues {
  heads: number;    // 앞면 총 가치
  tails: number;    // 뒷면 총 가치
  total: number;    // 전체 가치
}

/**
 * lastTossResults에서 앞면/뒷면 코인 가치 계산
 */
export function calculateCoinValues(results: CoinTossResult[]): CoinValues {
  const heads = results
    .filter(r => r.isHeads)
    .reduce((sum, r) => sum + r.denomination, 0);

  const tails = results
    .filter(r => !r.isHeads)
    .reduce((sum, r) => sum + r.denomination, 0);

  return { heads, tails, total: heads + tails };
}

/**
 * 코인 소모 결과
 */
export interface CoinSpendResult {
  success: boolean;
  remainingResults: CoinTossResult[];  // 남은 코인들
  consumed: {
    heads: CoinTossResult[];
    tails: CoinTossResult[];
  };
  reason?: string;
}

/**
 * 앞면/뒷면 코인을 소모하고 남은 결과 반환
 * 큰 단위 코인부터 우선 소모 (10 > 5 > 1)
 */
export function spendCoins(
  results: CoinTossResult[],
  headsNeeded: number,
  tailsNeeded: number
): CoinSpendResult {
  const current = calculateCoinValues(results);

  // 비용 검증
  if (current.heads < headsNeeded) {
    return {
      success: false,
      remainingResults: results,
      consumed: { heads: [], tails: [] },
      reason: `앞면 코인 부족 (필요: ${headsNeeded}, 보유: ${current.heads})`,
    };
  }

  if (current.tails < tailsNeeded) {
    return {
      success: false,
      remainingResults: results,
      consumed: { heads: [], tails: [] },
      reason: `뒷면 코인 부족 (필요: ${tailsNeeded}, 보유: ${current.tails})`,
    };
  }

  // 앞면 코인 소모 (큰 단위부터)
  const headsCoins = results.filter(r => r.isHeads)
    .sort((a, b) => b.denomination - a.denomination);
  const tailsCoins = results.filter(r => !r.isHeads)
    .sort((a, b) => b.denomination - a.denomination);

  const consumedHeads: CoinTossResult[] = [];
  const consumedTails: CoinTossResult[] = [];

  let headsSpent = 0;
  for (const coin of headsCoins) {
    if (headsSpent >= headsNeeded) break;
    consumedHeads.push(coin);
    headsSpent += coin.denomination;
  }

  let tailsSpent = 0;
  for (const coin of tailsCoins) {
    if (tailsSpent >= tailsNeeded) break;
    consumedTails.push(coin);
    tailsSpent += coin.denomination;
  }

  // 남은 코인들
  const consumedIds = new Set([
    ...consumedHeads.map(c => c.coinId),
    ...consumedTails.map(c => c.coinId),
  ]);

  const remaining = results.filter(r => !consumedIds.has(r.coinId));

  return {
    success: true,
    remainingResults: remaining,
    consumed: { heads: consumedHeads, tails: consumedTails },
  };
}
