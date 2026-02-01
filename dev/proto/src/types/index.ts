// 카드 타입 정의

export type CardType = 'attack' | 'skill' | 'power' | 'curse';

// ===== 코인 토스 시스템 =====

// 동전 정의
export interface Coin {
  id: string;
  denomination: number;  // 1, 5, 10 등
  emoji: string;
  name: string;
}

// 토스 결과
export interface CoinTossResult {
  coinId: string;
  denomination: number;
  isHeads: boolean;
}

// 동전 보유 현황
export interface CoinInventory {
  coinId: string;
  count: number;
}

// ===== 스킬 시스템 =====

// 스킬 효과 타입
export interface SkillEffect {
  type: 'damage' | 'block' | 'heal' | 'apply_buff' | 'apply_debuff' | 'coin_gain'
    | 'dot'          // 지속 데미지 (독, 화상)
    | 'lifesteal'    // 흡혈
    | 'evasion'      // 회피
    | 'reflection'   // 피해 반사
    | 'combo_stack'  // 콤보 스택 추가
    | 'charge_stack';// 충전 스택 추가
  value: number;
  target?: 'self' | 'enemy';
  buffId?: string;  // apply_buff일 때 사용
  dotTurns?: number;  // DoT 지속 턴 수
  debuffId?: string;  // 디버프 ID (독, 화상 등)
  duration?: number;  // 디버프 지속 시간 (턴)
}

// 조건부 스킬 효과
export interface ConditionalSkillEffect {
  condition: ConditionType;
  conditionValue: string | number;
  effect: SkillEffect;
}

// 스킬 정의
export interface Skill {
  id: string;
  skillKey: string;           // 스킬 정의 키 (예: 'strike', 'defend')
  name: string;
  icon: string;               // 이모지 아이콘

  // 레거시 필드 (하위 호환성, 점진적 제거 예정)
  coinCost?: number;          // 코인 비용

  // 새 필드 (앞면/뒷면 분리)
  headsCost?: number;         // 앞면 코인 비용
  tailsCost?: number;         // 뒷면 코인 비용

  maxUsePerTurn: number;      // 턴당 최대 사용 횟수 (0 = 무제한)
  cooldown?: number;          // 쿨다운 턴 수 (옵션)
  targetType: TargetType;     // 타겟 타입
  effects: SkillEffect[];
  conditionalEffects?: ConditionalSkillEffect[];
  description: string;
  classRequired?: CharacterClass;  // 클래스 전용 스킬
}

// 스킬 상태 (런타임)
export interface SkillState {
  skillId: string;
  usedThisTurn: number;       // 이번 턴 사용 횟수
  cooldownRemaining: number;  // 남은 쿨다운 턴
}
export type TargetType = 'enemy' | 'self' | 'none' | 'all_enemies';  // 타겟 지정 타입
export type CharacterClass = 'warrior' | 'paladin' | 'berserker' | 'swordmaster' | 'rogue' | 'mage';
export type CardRarity = 'basic' | 'common' | 'rare' | 'special' | 'curse';

// 카드 효과 타입
export interface CardEffect {
  type: 'damage' | 'block' | 'draw' | 'energy' | 'apply_buff';
  value: number;
  target?: 'self' | 'enemy';
  buffId?: string;  // apply_buff일 때 사용
}

// 조건부 효과
export type ConditionType = 'buff_active' | 'hp_below' | 'coins_above'
  | 'combo_above'       // 콤보 N 이상
  | 'charge_above'      // 충전 N 이상
  | 'enemy_has_debuff'  // 적 디버프 보유
  | 'enemy_hp_below'    // 적 HP N% 미만
  | 'on_hit'            // 적중 시
  | 'on_kill'           // 처치 시
  | 'last_attacked_target'  // 연속 베기용 (직전 공격 대상)
  | 'all_tails';        // 절망의 일격용 (모든 코인이 뒷면)

export interface ConditionalEffect {
  condition: ConditionType;
  conditionValue: string | number;  // 버프 ID 또는 수치
  effect: CardEffect;
}

// 패시브 효과 (저주 카드 등)
export interface PassiveCardEffect {
  trigger: 'turn_start' | 'turn_end' | 'draw' | 'in_hand';
  type: 'damage' | 'heal' | 'coins';
  value: number;
  target: 'self' | 'enemy';
}

export interface Card {
  id: string;
  cardKey?: string;    // 카드 정의 키 (예: 'battlefield_will', 'strike')
  name: string;
  type: CardType;
  targetType?: TargetType;  // 타겟 지정 타입 (없으면 type으로 자동 판단)
  cost: number;        // 에너지 비용
  rarity?: CardRarity;
  classRequired?: CharacterClass;  // 클래스 전용 카드 (해당 클래스만 사용 가능)
  advancesTo?: CharacterClass[];   // 전직 기여 (이 카드가 어떤 전직에 인정되는지)
  // 레거시 필드 (기존 호환성)
  damage?: number;
  block?: number;
  // 새로운 효과 시스템
  effects?: CardEffect[];
  conditionalEffects?: ConditionalEffect[];
  // 저주 카드 관련
  exhaust?: boolean;               // 사용 시 소모 (제거)
  passiveEffect?: PassiveCardEffect;  // 패시브 효과 (손에 있을 때 발동)
  description: string;
}

// 버프 정의
export type BuffType = 'power' | 'debuff' | 'temporary';
export type BuffDuration = number | 'combat';  // 턴 수 또는 전투 종료까지

export interface Buff {
  id: string;
  name: string;
  type: BuffType;
  duration: BuffDuration;
  stackable: boolean;
  description: string;
}

// 활성 버프 인스턴스
export interface ActiveBuff {
  buffId: string;
  stacks: number;
  remainingDuration: BuffDuration;
}

// 활성 디버프 인스턴스 (적에게 적용되는 디버프)
export interface ActiveDebuff {
  debuffId: string;       // 디버프 ID (poison, burn 등)
  stacks: number;         // 스택 수
  remainingDuration: number;  // 남은 지속 시간 (턴)
}

// 버프 이벤트 효과
export type BuffEventType = 'turn_start' | 'on_attack' | 'on_defend' | 'turn_end';

export interface BuffEventEffect {
  event: BuffEventType;
  effect: CardEffect;
}

// 플레이어 상태
export interface Player {
  hp: number;
  maxHp: number;
  block: number;       // 현재 방어력 (턴 시작 시 리셋)

  // 코인은 battle.lastTossResults에서 계산됨 (Player.coins 제거됨)
  coinInventory: CoinInventory[];   // 보유 동전 목록
  souls: number;        // 보유 영혼
  characterClass: CharacterClass;
  activeBuffs: ActiveBuff[];
  // 스킬 시스템
  skills: Skill[];                  // 보유 스킬 목록
  skillStates: SkillState[];        // 스킬 런타임 상태
  // 클래스별 메커니즘
  comboCount?: number;   // 도적 콤보 카운트 (턴당 리셋)
  chargeCount?: number;  // 마법사 충전 카운트 (전투 지속)
}

// 적 상태
export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  intent: EnemyIntent;  // 다음 행동 의도
  soulReward: number;   // 처치 시 영혼 보상
  activeDebuffs?: ActiveDebuff[];  // 활성 디버프 (독, 화상 등)
}

// 적 의도 (다음 턴에 할 행동)
export interface EnemyIntent {
  type: 'attack' | 'defend' | 'buff' | 'debuff';
  value: number;
}

// 행선지 타입 (라운드 선택 시스템)
export type DestinationType = 'normal' | 'elite' | 'rest' | 'shop' | 'event' | 'village';

export interface DestinationOption {
  id: string;
  type: DestinationType;
  enemyKey?: string;      // 몬스터 행선지일 경우
  healPercent?: number;   // 휴식 행선지일 경우
}

// ===== 마을 시스템 =====

// 장신구 효과 타입
export type AccessoryEffectType =
  | 'stat_boost'      // 스탯 증가 (최대 HP 등)
  | 'on_turn_start'   // 턴 시작 시 효과
  | 'on_turn_end'     // 턴 종료 시 효과
  | 'on_card_play'    // 카드 사용 시 효과
  | 'on_kill'         // 적 처치 시 효과
  | 'passive';        // 상시 적용

export interface AccessoryEffect {
  type: AccessoryEffectType;
  stat?: 'maxHp' | 'damage' | 'block' | 'energy';
  value: number;
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  emoji: string;
  regionId: string;       // 획득 가능한 지역
  effect: AccessoryEffect;
}

// 동료 효과 타입
export interface CompanionEffect {
  type: 'damage' | 'heal' | 'block' | 'buff' | 'draw';
  value: number;
  target: 'player' | 'enemy';
  trigger: 'turn_start' | 'turn_end';
}

export interface Companion {
  id: string;
  name: string;
  description: string;
  emoji: string;
  turnEffect: CompanionEffect;
  linkedCardId: string;   // 동료 선택 시 획득하는 카드
}

// 시설 타입
export type FacilityType = 'tavern' | 'blood_altar' | 'rest' | 'shop';

export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  description: string;
  emoji: string;
  regionExclusive?: string;  // 특정 지역 전용
}

// 피의 제단 보상 타입
export type BloodAltarRewardType = 'soul' | 'maxHp' | 'accessory';

export interface BloodAltarPenalty {
  hpCost?: number;           // 즉시 HP 손실
  soulCost?: number;         // 즉시 영혼 손실
  curseCard?: boolean;       // 저주 카드 획득
  monsterHpBuff?: number;    // 몬스터 HP 강화 비율 (0.2 = 20%)
  monsterAttackBuff?: number; // 몬스터 공격력 강화 비율
}

export interface BloodAltarReward {
  id: string;
  type: BloodAltarRewardType;
  name: string;
  description: string;
  emoji: string;
  // 보상
  soulReward?: number;       // 영혼 보상
  maxHpReward?: number;      // 최대 HP 증가
  accessoryId?: string;      // 장신구 보상
  // 패널티
  penalty: BloodAltarPenalty;
  // UI 표시용
  rewardText: string;        // 보상 설명
  penaltyText: string;       // 패널티 설명
}

// 전투 상태
export type BattlePhase =
  | 'player_turn'
  | 'enemy_turn'
  | 'victory'
  | 'defeat'
  | 'reward'           // 보상 선택
  | 'class_advancement' // 전직 이벤트
  | 'destination_selection'  // 행선지 선택
  // 마을 시스템
  | 'village_entrance'       // 마을 - 진입 연출
  | 'village_accessory'      // 마을 - 장신구 선택
  | 'village_facility'       // 마을 - 시설 선택
  | 'tavern_companion'       // 선술집 - 동료 선택
  | 'blood_altar_reward';    // 피의 제단 - 보상 선택

// 전투 애니메이션 상태
export interface CombatAnimation {
  playerAttacking: boolean;   // 플레이어가 공격 중
  enemyAttacking: boolean;    // 적이 공격 중
  playerHit: boolean;         // 플레이어가 피격됨
  enemyHit: boolean;          // 적이 피격됨
  shieldHit: boolean;         // 방패가 타격됨
}

// 스킬 프리뷰 효과 (호버 시 표시)
export interface PreviewEffects {
  damage: number;             // 적에게 줄 데미지
  block: number;              // 획득할 블록
  heal: number;               // 회복량
  selfDamage: number;         // 자해 데미지
  coinsGained: number;        // 획득할 코인
  buffs: string[];            // 적용될 버프 ID 목록
  conditionsMet: string[];    // 충족된 조건 목록
}

export interface BattleState {
  phase: BattlePhase;
  combatAnimation: CombatAnimation;  // 전투 애니메이션 상태
  turn: number;
  hasTossedThisTurn: boolean;      // 이번 턴 코인 토스 여부
  lastTossResults: CoinTossResult[];  // 마지막 토스 결과 (애니메이션용)
  lastAttackedTargetId?: string;   // 연속 베기 추적용 (직전 공격 대상 ID)
}

// 드래그 상태
export type DropZone = 'enemy' | 'battlefield' | 'hand' | 'player' | null;

export interface DragState {
  isDragging: boolean;
  draggedCard: Card | null;
  dragPosition: { x: number; y: number };
  originalCardIndex: number;
}

// 보상 상태
export interface RewardState {
  skills: Skill[];         // 선택 가능한 보상 스킬들
  isAdvancementReward: boolean;  // 전직 보상 여부
  isEliteReward?: boolean;       // 엘리트 보상 여부 (희귀 스킬 확률)
  advancementOptions?: CharacterClass[];  // 선택 가능한 전직 목록 (다중 전직 시)
  targetAdvancement?: CharacterClass;     // 선택된 전직 클래스
}

// 지역 정의 (월드의 한 구역)
export interface Region {
  id: string;
  name: string;
  description: string;
  totalRounds: number;     // 해당 지역의 라운드 수
  bossKey: string;         // 보스 적 키
}

// 런 상태
export interface RunState {
  regionId: string;        // 현재 지역 ID
  round: number;           // 현재 라운드 (1-7)
  totalRounds: number;     // 총 라운드 수
  isComplete: boolean;     // 런 클리어 여부
  selectedDestinationType?: DestinationType;  // 선택한 행선지 타입 (보상 차등용)
  // 마을 시스템
  accessories: Accessory[];       // 획득한 장신구 목록
  companions: Companion[];        // 동료 목록
  // 피의 제단 시스템
  bloodAltarActivated: boolean;   // 피의 제단 활성화 여부
  monsterBuffPercent: number;     // 몬스터 강화 비율 (레거시, 미사용)
  monsterHpBuffPercent: number;   // 몬스터 HP 강화 비율 (0.2 = 20%)
  monsterAttackBuffPercent: number; // 몬스터 공격력 강화 비율
}

// 전체 게임 상태
export interface GameState {
  player: Player;
  enemy: Enemy | null;
  battle: BattleState;
  reward: RewardState | null;  // 보상 선택 중일 때
  run: RunState;           // 런 진행 상태
  destinationOptions: DestinationOption[];  // 행선지 선택지 목록
}
