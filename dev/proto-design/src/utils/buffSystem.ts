import type {
  Buff,
  ActiveBuff,
  BuffEventType,
  BuffEventEffect,
  CardEffect,
  Player,
} from '../types';
import { PALADIN_BUFF_DEFINITIONS, PALADIN_BUFF_EVENT_EFFECTS } from '../data/characters/paladin';
import { WARRIOR_BUFF_DEFINITIONS, WARRIOR_BUFF_EVENT_EFFECTS } from '../data/characters/warrior';

// 모든 버프 정의 통합
const COMMON_STATUS_DEFINITIONS: Record<string, Buff> = {
  weak: {
    id: 'weak',
    name: '약화',
    type: 'debuff',
    duration: 1,
    stackable: true,
    description: '공격 데미지 -1 (스택당).',
  },
  vulnerable: {
    id: 'vulnerable',
    name: '취약',
    type: 'debuff',
    duration: 2,
    stackable: true,
    description: '받는 데미지 +1 (스택당).',
  },
  poison: {
    id: 'poison',
    name: '독',
    type: 'debuff',
    duration: 2,
    stackable: true,
    description: '적 턴 시작 시 HP 피해 1 (스택당).',
  },
  spore: {
    id: 'spore',
    name: '포자',
    type: 'debuff',
    duration: 1,
    stackable: true,
    description: '코인 흐름을 방해하는 디버프.',
  },
  thorns: {
    id: 'thorns',
    name: '가시',
    type: 'power',
    duration: 'combat',
    stackable: true,
    description: '피격 시 반사 피해 1 (스택당).',
  },
  hardening: {
    id: 'hardening',
    name: '경화',
    type: 'power',
    duration: 'combat',
    stackable: true,
    description: '받는 피해 감소 1 (스택당).',
  },
  evasion: {
    id: 'evasion',
    name: '회피',
    type: 'temporary',
    duration: 1,
    stackable: true,
    description: '다음 피격 피해를 무효화합니다.',
  },
  regeneration: {
    id: 'regeneration',
    name: '재생',
    type: 'power',
    duration: 1,
    stackable: true,
    description: 'HP 회복 1 (스택당).',
  },
  bind: {
    id: 'bind',
    name: '뿌리 속박',
    type: 'debuff',
    duration: 2,
    stackable: true,
    description: '방어도 획득량 -2.',
  },
  root_bind: {
    id: 'root_bind',
    name: '뿌리 속박',
    type: 'debuff',
    duration: 2,
    stackable: true,
    description: '방어도 획득량 -2.',
  },
};

const ALL_BUFF_DEFINITIONS: Record<string, Buff> = {
  ...COMMON_STATUS_DEFINITIONS,
  ...PALADIN_BUFF_DEFINITIONS,
  ...WARRIOR_BUFF_DEFINITIONS,
};

// 모든 버프 이벤트 효과 통합
const ALL_BUFF_EVENT_EFFECTS: Record<string, BuffEventEffect[]> = {
  ...PALADIN_BUFF_EVENT_EFFECTS,
  ...WARRIOR_BUFF_EVENT_EFFECTS,
};

// 버프 정의 조회
export function getBuffDefinition(buffId: string): Buff | undefined {
  return ALL_BUFF_DEFINITIONS[buffId];
}

// 버프 이벤트 효과 조회
export function getBuffEventEffects(buffId: string, event: BuffEventType): CardEffect[] {
  const effects = ALL_BUFF_EVENT_EFFECTS[buffId];
  if (!effects) return [];

  return effects
    .filter(e => e.event === event)
    .map(e => e.effect);
}

// 버프 적용 (플레이어에게 버프 추가)
export function applyBuff(player: Player, buffId: string): Player {
  const buffDef = getBuffDefinition(buffId);
  if (!buffDef) {
    return player;
  }

  // 이미 같은 버프가 있는지 확인
  const existingIndex = player.activeBuffs.findIndex(b => b.buffId === buffId);

  if (existingIndex >= 0) {
    // 스택 가능한 버프면 스택 증가
    if (buffDef.stackable) {
      const updatedBuffs = [...player.activeBuffs];
      updatedBuffs[existingIndex] = {
        ...updatedBuffs[existingIndex],
        stacks: updatedBuffs[existingIndex].stacks + 1,
      };
      return { ...player, activeBuffs: updatedBuffs };
    }
    // 스택 불가능하면 그대로 반환
    return player;
  }

  // 새 버프 추가
  const newBuff: ActiveBuff = {
    buffId,
    stacks: 1,
    remainingDuration: buffDef.duration,
  };

  return {
    ...player,
    activeBuffs: [...player.activeBuffs, newBuff],
  };
}

// 버프 제거
export function removeBuff(player: Player, buffId: string): Player {
  return {
    ...player,
    activeBuffs: player.activeBuffs.filter(b => b.buffId !== buffId),
  };
}

// 버프 스택 감소
export function decreaseBuffStacks(player: Player, buffId: string, amount: number = 1): Player {
  const updatedBuffs = player.activeBuffs
    .map(buff => {
      if (buff.buffId !== buffId) return buff;
      const newStacks = buff.stacks - amount;
      if (newStacks <= 0) return null;
      return { ...buff, stacks: newStacks };
    })
    .filter((buff): buff is ActiveBuff => buff !== null);

  return { ...player, activeBuffs: updatedBuffs };
}

// 턴 시작 시 버프 효과 처리 결과
export interface TurnStartBuffResult {
  blockGained: number;
  damageDealt: number;
  cardsDrawn: number;
  energyGained: number;
}

// 턴 시작 시 버프 효과 수집
export function collectTurnStartBuffEffects(player: Player): TurnStartBuffResult {
  const result: TurnStartBuffResult = {
    blockGained: 0,
    damageDealt: 0,
    cardsDrawn: 0,
    energyGained: 0,
  };

  for (const buff of player.activeBuffs) {
    const effects = getBuffEventEffects(buff.buffId, 'turn_start');

    for (const effect of effects) {
      const value = effect.value * buff.stacks;

      switch (effect.type) {
        case 'block':
          result.blockGained += value;
          break;
        case 'damage':
          result.damageDealt += value;
          break;
        case 'draw':
          result.cardsDrawn += value;
          break;
        case 'energy':
          result.energyGained += value;
          break;
      }
    }
  }

  return result;
}

// 턴 종료 시 버프 지속시간 감소
export function processBuffDurations(player: Player): Player {
  const updatedBuffs = player.activeBuffs
    .map(buff => {
      // 'combat' 지속시간은 감소하지 않음
      if (buff.remainingDuration === 'combat') {
        return buff;
      }

      const newDuration = buff.remainingDuration - 1;
      if (newDuration <= 0) {
        return null; // 버프 만료
      }

      return { ...buff, remainingDuration: newDuration };
    })
    .filter((buff): buff is ActiveBuff => buff !== null);

  return { ...player, activeBuffs: updatedBuffs };
}

// 전투 종료 시 모든 버프 제거
export function clearAllBuffs(player: Player): Player {
  return { ...player, activeBuffs: [] };
}

// 특정 버프가 활성화되어 있는지 확인
export function hasActiveBuff(player: Player, buffId: string): boolean {
  return player.activeBuffs.some(b => b.buffId === buffId);
}

// 특정 버프의 스택 수 조회
export function getBuffStacks(player: Player, buffId: string): number {
  const buff = player.activeBuffs.find(b => b.buffId === buffId);
  return buff?.stacks ?? 0;
}
