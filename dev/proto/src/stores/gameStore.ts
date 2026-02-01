import { create } from 'zustand';
import type { GameState, CharacterClass, Player, RunState, CoinTossResult, Skill } from '../types';
import { createEnemy, createEliteEnemy, getNextIntent, ENEMY_DEFINITIONS, ROUND_ENEMIES } from '../data/enemies';
import { generateDestinationOptions } from '../data/destinations';
import { getRegion } from '../data/regions';
import { getAccessoryById } from '../data/accessories';
import { getCompanionById } from '../data/companions';
import { getBloodAltarRewards } from '../data/facilities';
import { INITIAL_COIN_INVENTORY } from '../data/coins';
import { createStartingSkills, generateRewardSkills, resetSkillIdCounter } from '../data/skills';
import { spendCoins as spendCoinResults, calculateCoinValues } from '../utils/coinToss';
import { TOTAL_ATTACK_DURATION } from '../animations';
import {
  collectTurnStartBuffEffects,
  processBuffDurations,
  getBuffDefinition,
  getBuffEventEffects,
} from '../utils/buffSystem';
import { tossAllCoins } from '../utils/coinToss';
import {
  canUseSkill,
  getSkillCosts,
  calculateSkillEffects,
  createSkillStates,
  resetSkillStatesForNewTurn,
  updateSkillStateAfterUse,
  getSkillState,
  applyBuffsToPlayer,
  processGreedStack,
} from '../utils/skillSystem';

// 초기 플레이어 상태 생성
function createInitialPlayer(characterClass: CharacterClass = 'warrior'): Player {
  // 스킬 ID 카운터 리셋
  resetSkillIdCounter();
  const startingSkills = createStartingSkills(characterClass);

  return {
    hp: 50,
    maxHp: 50,
    block: 0,
    // coins 제거됨 - battle.lastTossResults에서 계산
    coinInventory: [...INITIAL_COIN_INVENTORY],
    souls: 0,
    characterClass,
    activeBuffs: [],
    skills: startingSkills,
    skillStates: createSkillStates(startingSkills),
  };
}

// 기본 전투 애니메이션 상태
const defaultCombatAnimation = {
  playerAttacking: false,
  enemyAttacking: false,
  playerHit: false,
  enemyHit: false,
  shieldHit: false,
};

// 초기 런 상태
const createInitialRun = (): RunState => ({
  regionId: 'forgotten_dungeon',  // 기본 지역: 잊혀진 숲
  round: 1,
  totalRounds: 7,  // 지역당 7라운드
  isComplete: false,
  // 마을 시스템
  accessories: [],
  companions: [],
  // 피의 제단 시스템
  bloodAltarActivated: false,
  monsterBuffPercent: 0,  // 레거시
  monsterHpBuffPercent: 0,     // HP 강화 비율
  monsterAttackBuffPercent: 0, // 공격력 강화 비율
});

// 초기 상태
const initialState: GameState = {
  player: createInitialPlayer(),
  enemy: null,
  battle: {
    phase: 'player_turn',
    combatAnimation: { ...defaultCombatAnimation },
    turn: 1,
    hasTossedThisTurn: false,
    lastTossResults: [],
  },
  reward: null,
  run: createInitialRun(),
  destinationOptions: [],  // 행선지 선택지
};

// 스토어 액션 타입
interface GameActions {
  // 런 시작
  startRun: () => void;
  // 전투 시작 (enemyKey 선택적 - 없으면 현재 라운드 적 사용)
  startBattle: (enemyKey?: string) => void;
  // 다음 라운드 시작
  startNextRound: () => void;
  // 코인 토스 시스템
  tossCoins: () => CoinTossResult[];
  addCoinResults: (results: CoinTossResult[]) => void;  // incrementCoins 대체
  addCoins: (coinId: string, count: number) => void;
  spendGold: (amount: number) => boolean;  // spendCoins → spendGold로 명확화
  // 스킬 시스템
  useSkill: (skillId: string) => { success: boolean; reason?: string };
  addSkill: (skill: Skill) => void;
  canUseSkill: (skillId: string) => { canUse: boolean; reason?: string };
  // 턴 종료
  endTurn: () => void;
  // 적 턴 실행
  executeEnemyTurn: () => void;
  // 게임 리셋
  resetGame: () => void;
  // 보상 시스템
  showReward: () => void;
  selectRewardSkill: (skillId: string) => void;
  skipReward: () => void;
  // 전직 시스템
  checkAdvancement: () => void;
  selectAdvancement: (targetClass: CharacterClass) => void;  // 다중 전직 시 선택
  confirmAdvancement: (cardId: string) => void;
  // 다음 전투로 이동
  proceedToNextBattle: () => void;
  // 행선지 선택 시스템
  showDestinationSelection: () => void;
  selectDestination: (destinationId: string) => void;
  // 마을 시스템
  proceedToVillageAccessory: () => void;
  selectAccessory: (accessoryId: string) => void;
  selectFacility: (facilityId: string) => void;
  selectCompanion: (companionId: string) => void;
  goBackToFacilitySelection: () => void;
  // 피의 제단 시스템
  selectBloodAltarRewards: (rewardIds: string[]) => void;
  skipBloodAltar: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  // 새로운 런 시작
  startRun: () => {
    const enemyKey = ROUND_ENEMIES[0]; // 라운드 1 적
    const enemy = createEnemy(enemyKey);

    set({
      player: createInitialPlayer('warrior'),
      enemy,
      battle: {
        phase: 'player_turn',
        combatAnimation: { ...defaultCombatAnimation },
        turn: 1,
        hasTossedThisTurn: false,
        lastTossResults: [],
      },
      reward: null,
      run: createInitialRun(),
    });
  },

  // 다음 라운드 시작 (HP 유지)
  startNextRound: () => {
    const { player, battle, run } = get();
    const nextRound = run.round + 1;

    // 마지막 라운드였으면 런 완료
    if (nextRound > run.totalRounds) {
      set({
        run: { ...run, isComplete: true },
        battle: { ...battle, phase: 'victory' },
      });
      return;
    }

    // 다음 라운드 적 생성
    const enemyKey = ROUND_ENEMIES[nextRound - 1];
    const enemy = createEnemy(enemyKey);

    set({
      player: {
        ...player,
        block: 0,           // 방어력 초기화
        activeBuffs: [],    // 버프 초기화
        // HP, coinInventory는 유지
      },
      enemy,
      battle: {
        phase: 'player_turn',
        combatAnimation: { ...defaultCombatAnimation },
        turn: 1,
        hasTossedThisTurn: false,
        lastTossResults: [],
      },
      reward: null,
      run: {
        ...run,
        round: nextRound,
      },
    });
  },

  // 전투 시작
  startBattle: (enemyKey?: string) => {
    // enemyKey가 없으면 startRun 호출
    if (!enemyKey) {
      get().startRun();
      return;
    }

    const enemy = createEnemy(enemyKey);

    set({
      player: createInitialPlayer('warrior'),
      enemy,
      battle: {
        phase: 'player_turn',
        combatAnimation: { ...defaultCombatAnimation },
        turn: 1,
        hasTossedThisTurn: false,
        lastTossResults: [],
      },
      run: createInitialRun(),
    });
  },

  // 코인 토스 실행
  tossCoins: () => {
    const { player, battle } = get();

    // 이미 토스했으면 무시
    if (battle.hasTossedThisTurn) {
      return [];
    }

    // 모든 동전 토스 (coins는 즉시 증가하지 않음)
    const results = tossAllCoins(player.coinInventory);

    set({
      battle: {
        ...battle,
        hasTossedThisTurn: true,
        lastTossResults: results,
      },
    });

    return results;
  },

  // 코인 증가 (애니메이션 착지 시 호출)
  // 코인 결과 추가 (incrementCoins 대체)
  addCoinResults: (results: CoinTossResult[]) => {
    const { battle } = get();
    set({
      battle: {
        ...battle,
        lastTossResults: [...battle.lastTossResults, ...results],
      },
    });
  },

  // 동전 추가 (보상 등)
  addCoins: (coinId: string, count: number) => {
    const { player } = get();
    const newInventory = [...player.coinInventory];
    const existing = newInventory.find(inv => inv.coinId === coinId);

    if (existing) {
      existing.count += count;
    } else {
      newInventory.push({ coinId, count });
    }

    set({
      player: {
        ...player,
        coinInventory: newInventory,
      },
    });
  },

  // 코인 소비
  // 골드 구매 (코인 소모)
  spendGold: (amount: number) => {
    const { player, battle } = get();

    const available = calculateCoinValues(battle.lastTossResults);
    if (available.total < amount) {
      return false;
    }

    // 총 코인에서 차감 (앞면 우선)
    const spendResult = spendCoinResults(battle.lastTossResults, amount, 0);
    if (!spendResult.success) {
      return false;
    }

    set({
      player: {
        ...player,
        souls: player.souls + 1,
      },
      battle: {
        ...get().battle,
        lastTossResults: spendResult.remainingResults,
      },
    });

    return true;
  },

  // 스킬 사용 가능 여부 확인
  canUseSkill: (skillId: string) => {
    const { player, battle } = get();

    // 플레이어 턴이 아니면 사용 불가
    if (battle.phase !== 'player_turn') {
      return { canUse: false, reason: '플레이어 턴이 아닙니다' };
    }

    // 스킬 찾기
    const skill = player.skills.find(s => s.id === skillId);
    if (!skill) {
      return { canUse: false, reason: '스킬을 찾을 수 없습니다' };
    }

    // 스킬 상태 찾기
    const skillState = getSkillState(player.skillStates, skillId);

    return canUseSkill(battle.lastTossResults, skill, skillState);
  },

  // 스킬 사용
  useSkill: (skillId: string) => {
    const state = get();
    const { player, enemy, battle } = state;

    // 플레이어 턴이 아니면 사용 불가
    if (battle.phase !== 'player_turn') {
      return { success: false, reason: '플레이어 턴이 아닙니다' };
    }

    // 스킬 찾기
    const skill = player.skills.find(s => s.id === skillId);
    if (!skill) {
      return { success: false, reason: '스킬을 찾을 수 없습니다' };
    }

    // 사용 가능 여부 확인
    const skillState = getSkillState(player.skillStates, skillId);
    const { canUse, reason } = canUseSkill(battle.lastTossResults, skill, skillState);
    if (!canUse) {
      return { success: false, reason };
    }

    // 코인 소모
    const costs = getSkillCosts(skill);
    const spendResult = spendCoinResults(battle.lastTossResults, costs.heads, costs.tails);

    if (!spendResult.success) {
      return { success: false, reason: spendResult.reason };
    }

    // 스킬 효과 계산 (battleState 추가)
    const effects = calculateSkillEffects(player, skill, enemy, battle);

    // 새 플레이어 상태
    let newPlayer = { ...player };
    newPlayer.block += effects.blockGained;
    newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + effects.healAmount);
    newPlayer.hp = Math.max(0, newPlayer.hp - effects.selfDamage);
    newPlayer.skillStates = updateSkillStateAfterUse(player.skillStates, skill);

    // 버프 적용
    if (effects.buffsApplied.length > 0) {
      newPlayer = applyBuffsToPlayer(newPlayer, effects.buffsApplied);
    }

    // lastTossResults 업데이트 (코인 소모 반영)
    let newLastTossResults = spendResult.remainingResults;

    // 탐욕 스택 처리 (3스택 도달 시 보너스 토스 발동)
    const greedResult = processGreedStack(newPlayer, newLastTossResults);
    if (greedResult.triggered) {
      newPlayer = greedResult.newPlayer;
      newLastTossResults = greedResult.remainingResults;
      // 탐욕 발동 로그 (나중에 UI 애니메이션으로 대체)
      console.log('[탐욕 발동]', {
        bonusToss: greedResult.bonusTossResults.map(r => r ? '앞면' : '뒷면'),
        coinsConsumed: greedResult.coinsConsumed,
      });
    }

    // 적 데미지 처리
    let newEnemy = enemy ? { ...enemy } : null;
    let newCombatAnimation = { ...battle.combatAnimation };

    if (newEnemy) {
      // all_enemies 타입도 현재는 단일 적에게 적용
      // TODO: 다적 전투 시스템 도입 시 배열 순회로 변경
      const shouldApplyToEnemy =
        skill.targetType === 'enemy' ||
        skill.targetType === 'all_enemies';

      if (shouldApplyToEnemy) {
        // 데미지 처리
        if (effects.damageDealt > 0) {
          // 취약(vulnerable) 디버프 적용
          let finalDamage = effects.damageDealt;
          const vulnerableDebuff = newEnemy.activeDebuffs?.find(d => d.debuffId === 'vulnerable');
          if (vulnerableDebuff) {
            finalDamage += vulnerableDebuff.stacks;  // 받는 데미지 증가
          }

          // 적 방어력 고려
          const actualDamage = Math.max(0, finalDamage - newEnemy.block);
          const remainingBlock = Math.max(0, newEnemy.block - finalDamage);
          newEnemy.block = remainingBlock;
          newEnemy.hp = Math.max(0, newEnemy.hp - actualDamage);

          // 공격 애니메이션 설정
          newCombatAnimation = {
            playerAttacking: true,
            enemyAttacking: false,
            playerHit: false,
            enemyHit: true,
            shieldHit: enemy!.block > 0,
          };
        }

        // 디버프 적용
        if (effects.debuffsApplied && effects.debuffsApplied.length > 0) {
          newEnemy.activeDebuffs = newEnemy.activeDebuffs || [];
          for (const debuff of effects.debuffsApplied) {
            const existing = newEnemy.activeDebuffs.find(d => d.debuffId === debuff.debuffId);
            if (existing) {
              existing.stacks += debuff.stacks;
              existing.remainingDuration = debuff.duration;  // 갱신
            } else {
              newEnemy.activeDebuffs.push({
                debuffId: debuff.debuffId,
                stacks: debuff.stacks,
                remainingDuration: debuff.duration,
              });
            }
          }
        }
      }

      // on_attack 이벤트로 소모되는 버프 제거 (duration=1)
      if (effects.damageDealt > 0) {
        newPlayer.activeBuffs = newPlayer.activeBuffs.filter(buff => {
          const buffDef = getBuffDefinition(buff.buffId);
          if (!buffDef) return true;

          // duration이 1이고 on_attack 이벤트가 있으면 제거
          if (buffDef.duration === 1) {
            const hasOnAttackEvent = getBuffEventEffects(buff.buffId, 'on_attack').length > 0;
            if (hasOnAttackEvent) {
              return false;  // 제거
            }
          }
          return true;  // 유지
        });
      }
    }

    // 적 사망 체크
    if (newEnemy && newEnemy.hp <= 0) {
      // 영혼 보상 추가
      newPlayer.souls += newEnemy.soulReward;

      set({
        player: newPlayer,
        enemy: newEnemy,
        battle: {
          ...battle,
          phase: 'victory',
          combatAnimation: newCombatAnimation,
          lastTossResults: newLastTossResults,
        },
      });

      // 보상 화면으로 전환
      setTimeout(() => {
        get().showReward();
      }, TOTAL_ATTACK_DURATION * 1000);

      return { success: true };
    }

    // 플레이어 사망 체크
    if (newPlayer.hp <= 0) {
      set({
        player: newPlayer,
        enemy: newEnemy,
        battle: {
          ...battle,
          phase: 'defeat',
          lastTossResults: newLastTossResults,
        },
      });
      return { success: true };
    }

    // 상태 업데이트
    set({
      player: newPlayer,
      enemy: newEnemy,
      battle: {
        ...battle,
        combatAnimation: newCombatAnimation,
        lastTossResults: newLastTossResults,
        lastAttackedTargetId: enemy?.id,  // 연속 베기 추적
      },
    });

    // 애니메이션 리셋
    if (effects.damageDealt > 0) {
      setTimeout(() => {
        set((s) => ({
          battle: {
            ...s.battle,
            combatAnimation: {
              playerAttacking: false,
              enemyAttacking: false,
              playerHit: false,
              enemyHit: false,
              shieldHit: false,
            },
          },
        }));
      }, TOTAL_ATTACK_DURATION * 1000);
    }

    // 코인 획득 효과 처리
    if (effects.coinsGained > 0) {
      // TODO: 앞면/뒷면 구분 필요
      // 현재는 임시로 앞면으로 처리
      const newCoins: CoinTossResult[] = [];
      for (let i = 0; i < effects.coinsGained; i++) {
        newCoins.push({
          coinId: 'coin_1',
          denomination: 1,
          isHeads: true,
        });
      }
      get().addCoinResults(newCoins);
    }

    return { success: true };
  },

  // 스킬 추가 (보상 등)
  addSkill: (skill: Skill) => {
    const { player } = get();

    // 이미 같은 스킬을 가지고 있는지 확인 (skillKey 기준)
    const hasSkill = player.skills.some(s => s.skillKey === skill.skillKey);
    if (hasSkill) return;

    const newSkills = [...player.skills, skill];
    const newSkillStates = [...player.skillStates, { skillId: skill.id, usedThisTurn: 0, cooldownRemaining: 0 }];

    set({
      player: {
        ...player,
        skills: newSkills,
        skillStates: newSkillStates,
      },
    });
  },

  // 턴 종료
  endTurn: () => {
    const { battle } = get();

    // 플레이어 턴이 아니면 무시
    if (battle.phase !== 'player_turn') return;

    // 적 턴으로 전환
    set((state) => ({
      battle: {
        ...state.battle,
        phase: 'enemy_turn',
      },
    }));

    // 적 턴 실행
    setTimeout(() => {
      get().executeEnemyTurn();
    }, 300);
  },

  executeEnemyTurn: () => {
    const state = get();
    const { player, enemy, battle } = state;

    if (!enemy || battle.phase !== 'enemy_turn') return;

    const newPlayer = { ...player };
    const newEnemy = { ...enemy };

    // 적 의도에 따른 행동
    const { intent } = enemy;

    // 적 공격 애니메이션 설정
    let newCombatAnimation = { ...defaultCombatAnimation };

    if (intent.type === 'attack') {
      const willHitShield = newPlayer.block > 0;
      newCombatAnimation = {
        ...defaultCombatAnimation,
        enemyAttacking: true,
        playerHit: true,
        shieldHit: willHitShield,
      };

      // 약화(weak) 디버프 적용
      let damage = intent.value;
      const weakDebuff = newEnemy.activeDebuffs?.find(d => d.debuffId === 'weak');
      if (weakDebuff) {
        damage = Math.max(0, damage - weakDebuff.stacks);  // 공격력 감소
      }

      // 플레이어 방어력 고려 데미지 계산
      const actualDamage = Math.max(0, damage - newPlayer.block);
      const remainingBlock = Math.max(0, newPlayer.block - damage);
      newPlayer.block = remainingBlock;
      newPlayer.hp = Math.max(0, newPlayer.hp - actualDamage);
    } else if (intent.type === 'defend') {
      newEnemy.block += intent.value;
    }

    // 플레이어 사망 체크
    if (newPlayer.hp <= 0) {
      set({
        player: newPlayer,
        enemy: newEnemy,
        battle: {
          ...battle,
          phase: 'defeat',
          combatAnimation: newCombatAnimation,
        },
      });
      return;
    }

    // 먼저 공격 애니메이션 상태 적용
    set({
      player: newPlayer,
      enemy: newEnemy,
      battle: {
        ...battle,
        combatAnimation: newCombatAnimation,
      },
    });

    // 애니메이션 완료 후 다음 턴으로 전환
    const animationDelay = intent.type === 'attack' ? TOTAL_ATTACK_DURATION * 1000 : 0;

    setTimeout(() => {
      const currentState = get();
      const currentEnemy = currentState.enemy;
      if (!currentEnemy) return;

      const nextTurn = currentState.battle.turn + 1;

      // 적 다음 의도 설정
      const enemyKey = Object.keys(ENEMY_DEFINITIONS).find(
        (key) => ENEMY_DEFINITIONS[key].name === currentEnemy.name
      ) || 'slime';
      let nextIntent = getNextIntent(enemyKey, nextTurn);

      // 피의 제단 공격력 강화 적용 (라운드 5 이상)
      const currentRun = currentState.run;
      if (currentRun.bloodAltarActivated && currentRun.round >= 5 &&
          currentRun.monsterAttackBuffPercent > 0 && nextIntent.type === 'attack') {
        const attackBuff = Math.floor(nextIntent.value * currentRun.monsterAttackBuffPercent);
        nextIntent = {
          ...nextIntent,
          value: nextIntent.value + attackBuff,
        };
      }

      // 플레이어 상태 업데이트: 방어력 리셋, 코인 리셋
      let updatedPlayer = { ...currentState.player };
      updatedPlayer.block = 0;
      // 코인은 lastTossResults에서 관리됨

      // 턴 시작 시 스킬 상태 리셋 (사용 횟수 초기화, 쿨다운 감소)
      updatedPlayer.skillStates = resetSkillStatesForNewTurn(updatedPlayer.skillStates);

      // 턴 시작 시 버프 효과 처리
      const buffEffects = collectTurnStartBuffEffects(updatedPlayer);
      updatedPlayer.block += buffEffects.blockGained;

      // 턴 종료 시 버프 지속시간 처리
      updatedPlayer = processBuffDurations(updatedPlayer);

      // 적 디버프 지속시간 처리
      let updatedEnemy = { ...currentEnemy, intent: nextIntent };
      if (updatedEnemy.activeDebuffs && updatedEnemy.activeDebuffs.length > 0) {
        updatedEnemy.activeDebuffs = updatedEnemy.activeDebuffs
          .map(debuff => ({
            ...debuff,
            remainingDuration: debuff.remainingDuration - 1,
          }))
          .filter(debuff => debuff.remainingDuration > 0);

        if (updatedEnemy.activeDebuffs.length === 0) {
          updatedEnemy.activeDebuffs = undefined;
        }
      }

      set({
        player: updatedPlayer,
        enemy: updatedEnemy,
        battle: {
          ...currentState.battle,
          phase: 'player_turn',
          turn: nextTurn,
          hasTossedThisTurn: false,
          lastTossResults: [],
          lastAttackedTargetId: undefined,  // 턴 시작 시 초기화
          combatAnimation: { ...defaultCombatAnimation },
        },
      });
    }, animationDelay);
  },

  resetGame: () => {
    set(initialState);
  },

  // 보상 화면 표시
  showReward: () => {
    const { player } = get();
    // 클래스에 맞는 보상 스킬 3개 생성
    const rewardSkills = generateRewardSkills(player.characterClass, 3);

    set({
      battle: { ...get().battle, phase: 'reward' },
      reward: { skills: rewardSkills, isAdvancementReward: false },
    });
  },

  // 보상 스킬 선택
  selectRewardSkill: (skillId: string) => {
    const { reward } = get();
    if (!reward) return;

    // 선택한 스킬 찾기
    const selectedSkill = reward.skills.find(s => s.id === skillId);
    if (selectedSkill) {
      get().addSkill(selectedSkill);
    }

    set({ reward: null });
    get().proceedToNextBattle();
  },

  // 보상 스킵
  skipReward: () => {
    const { reward } = get();
    if (!reward) return;

    set({ reward: null });
    get().proceedToNextBattle();
  },

  // 전직 조건 체크 (현재 미사용 - 추후 재설계 예정)
  checkAdvancement: () => {
    // 전직 시스템은 추후 별도 구현
    get().proceedToNextBattle();
  },

  // 다중 전직 시 클래스 선택 (현재 미사용)
  selectAdvancement: (_targetClass: CharacterClass) => {
    // 전직 시스템은 추후 별도 구현
  },

  // 전직 확정 (현재 미사용)
  confirmAdvancement: (_cardId: string) => {
    // 전직 시스템은 추후 별도 구현
    get().proceedToNextBattle();
  },

  // 다음 전투로 이동
  proceedToNextBattle: () => {
    // 행선지 선택 화면으로 이동
    get().showDestinationSelection();
  },

  // 행선지 선택 화면 표시
  showDestinationSelection: () => {
    const { run, battle } = get();
    const region = getRegion(run.regionId);
    const nextRound = run.round + 1;

    // 마지막 라운드였으면 런 완료
    if (nextRound > run.totalRounds) {
      set({
        run: { ...run, isComplete: true },
        battle: { ...battle, phase: 'victory' },
      });
      return;
    }

    // 마을 라운드 (중간 지점)인 경우 바로 마을로 진입
    const villageRound = Math.ceil(run.totalRounds / 2);  // 7라운드 기준 4
    if (nextRound === villageRound) {
      set({
        run: { ...run, round: nextRound },
        battle: { ...battle, phase: 'village_entrance' },
        destinationOptions: [],
      });
      return;
    }

    // 행선지 선택지 생성 (지역 정보 활용)
    const destinations = generateDestinationOptions(nextRound, run.totalRounds, region.bossKey);

    set({
      battle: {
        ...battle,
        phase: 'destination_selection',
        hasTossedThisTurn: false,
        lastTossResults: [],
      },
      destinationOptions: destinations,
    });
  },

  // 행선지 선택
  selectDestination: (destinationId: string) => {
    const { destinationOptions, player, run } = get();
    const selectedDestination = destinationOptions.find(d => d.id === destinationId);
    if (!selectedDestination) return;

    const nextRound = run.round + 1;

    // 휴식 행선지 선택 시
    if (selectedDestination.type === 'rest') {
      const healAmount = Math.floor(player.maxHp * (selectedDestination.healPercent ?? 30) / 100);
      const newHp = Math.min(player.maxHp, player.hp + healAmount);

      set({
        player: { ...player, hp: newHp },
        run: { ...run, round: nextRound },
        destinationOptions: [],
      });

      // 다음 행선지 선택으로
      get().showDestinationSelection();
      return;
    }

    // 상점 행선지 선택 시 (TODO: 상점 구현)
    if (selectedDestination.type === 'shop') {
      // 임시: 다음 행선지로 이동
      set({
        run: { ...run, round: nextRound },
        destinationOptions: [],
      });
      get().showDestinationSelection();
      return;
    }

    // 이벤트 행선지 선택 시 (TODO: 이벤트 구현)
    if (selectedDestination.type === 'event') {
      // 임시: 다음 행선지로 이동
      set({
        run: { ...run, round: nextRound },
        destinationOptions: [],
      });
      get().showDestinationSelection();
      return;
    }

    // 전투 행선지 선택 시 (normal, elite)
    const enemyKey = selectedDestination.enemyKey;
    if (!enemyKey) return;

    // 엘리트는 강화된 적 생성
    let enemy = selectedDestination.type === 'elite'
      ? createEliteEnemy(enemyKey)
      : createEnemy(enemyKey);

    // 피의 제단 강화 적용 (라운드 5 이상)
    if (run.bloodAltarActivated && nextRound >= 5) {
      // HP 강화
      if (run.monsterHpBuffPercent > 0) {
        const hpBuff = Math.floor(enemy.maxHp * run.monsterHpBuffPercent);
        enemy = {
          ...enemy,
          hp: enemy.hp + hpBuff,
          maxHp: enemy.maxHp + hpBuff,
        };
      }
      // 공격력 강화 (의도가 공격일 때)
      if (run.monsterAttackBuffPercent > 0 && enemy.intent.type === 'attack') {
        const attackBuff = Math.floor(enemy.intent.value * run.monsterAttackBuffPercent);
        enemy = {
          ...enemy,
          intent: {
            ...enemy.intent,
            value: enemy.intent.value + attackBuff,
          },
        };
      }
    }

    set({
      player: {
        ...player,
        block: 0,
        activeBuffs: [],
      },
      enemy,
      battle: {
        phase: 'player_turn',
        combatAnimation: { ...defaultCombatAnimation },
        turn: 1,
        hasTossedThisTurn: false,
        lastTossResults: [],
      },
      run: {
        ...run,
        round: nextRound,
        selectedDestinationType: selectedDestination.type,
      },
      destinationOptions: [],
    });
  },

  // 마을 진입 연출 후 장신구 선택 화면으로
  proceedToVillageAccessory: () => {
    const { battle } = get();
    set({
      battle: { ...battle, phase: 'village_accessory' },
    });
  },

  // 장신구 선택
  selectAccessory: (accessoryId: string) => {
    const { run, battle, player } = get();
    const accessory = getAccessoryById(accessoryId);
    if (!accessory) return;

    // 장신구 획득
    const newAccessories = [...run.accessories, accessory];

    // stat_boost 효과 즉시 적용 (예: 최대 HP 증가)
    let newPlayer = { ...player };
    if (accessory.effect.type === 'stat_boost' && accessory.effect.stat === 'maxHp') {
      newPlayer = {
        ...player,
        maxHp: player.maxHp + accessory.effect.value,
        hp: player.hp + accessory.effect.value,  // 현재 HP도 증가
      };
    }

    set({
      player: newPlayer,
      run: { ...run, accessories: newAccessories },
      battle: { ...battle, phase: 'village_facility' },
    });
  },

  // 시설 선택
  selectFacility: (facilityId: string) => {
    const { battle } = get();

    // 선술집 선택 시 동료 선택 화면으로
    if (facilityId === 'tavern') {
      set({
        battle: { ...battle, phase: 'tavern_companion' },
      });
      return;
    }

    // 피의 제단 선택 시 보상 선택 화면으로
    if (facilityId === 'blood_altar') {
      set({
        battle: { ...battle, phase: 'blood_altar_reward' },
      });
      return;
    }

    // 기타 시설 (미구현) - 바로 행선지 선택으로
    get().showDestinationSelection();
  },

  // 동료 선택 (선술집)
  selectCompanion: (companionId: string) => {
    const { run } = get();
    const companion = getCompanionById(companionId);
    if (!companion) return;

    // 동료 획득
    const newCompanions = [...run.companions, companion];

    set({
      run: { ...run, companions: newCompanions },
    });

    // 다음 행선지 선택으로
    get().showDestinationSelection();
  },

  // 시설 선택으로 돌아가기
  goBackToFacilitySelection: () => {
    const { battle } = get();
    set({
      battle: { ...battle, phase: 'village_facility' },
    });
  },

  // 피의 제단 보상 선택 (다중 선택)
  selectBloodAltarRewards: (rewardIds: string[]) => {
    const { player, run } = get();
    const rewards = getBloodAltarRewards();

    const newPlayer = { ...player };
    const newRun = { ...run, bloodAltarActivated: true };

    // 각 선택된 보상 처리
    for (const rewardId of rewardIds) {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) continue;

      // 보상 적용
      if (reward.soulReward) {
        newPlayer.souls += reward.soulReward;
      }
      if (reward.maxHpReward) {
        newPlayer.maxHp += reward.maxHpReward;
        newPlayer.hp += reward.maxHpReward;
      }
      if (reward.accessoryId) {
        const accessory = getAccessoryById(reward.accessoryId);
        if (accessory) {
          newRun.accessories = [...newRun.accessories, accessory];
        }
      }

      // 패널티 적용
      const { penalty } = reward;
      if (penalty.hpCost) {
        newPlayer.hp = Math.max(1, newPlayer.hp - penalty.hpCost);
      }
      if (penalty.soulCost) {
        newPlayer.souls = Math.max(0, newPlayer.souls - penalty.soulCost);
      }
      // 저주 카드는 이제 덱이 없으므로 스킵
      if (penalty.monsterHpBuff) {
        newRun.monsterHpBuffPercent += penalty.monsterHpBuff;
      }
      if (penalty.monsterAttackBuff) {
        newRun.monsterAttackBuffPercent += penalty.monsterAttackBuff;
      }
    }

    // 히든 보상: 3개 모두 선택 시 추가 동전 획득
    if (rewardIds.length === 3) {
      // 은 동전 1개 추가
      const silverInv = newPlayer.coinInventory.find(inv => inv.coinId === 'silver_coin');
      if (silverInv) {
        silverInv.count += 1;
      } else {
        newPlayer.coinInventory = [...newPlayer.coinInventory, { coinId: 'silver_coin', count: 1 }];
      }
    }

    set({
      player: newPlayer,
      run: newRun,
    });

    // 다음 행선지 선택으로
    get().showDestinationSelection();
  },

  // 피의 제단 스킵
  skipBloodAltar: () => {
    get().showDestinationSelection();
  },
}));
