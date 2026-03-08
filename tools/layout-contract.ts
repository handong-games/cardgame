/**
 * 배틀 레이아웃 동기화 계약 (Contract)
 *
 * gamedesign BattleLayout.tsx의 COMPONENTS 배열에서 추출한 검증 기준.
 * proto-design 구현과 비교하여 레이아웃 드리프트를 감지한다.
 *
 * 기준 해상도: 1920×1080
 */

export interface ZoneContract {
  id: 'A' | 'B' | 'C'
  name: string
  heightPx: number | null    // 고정 높이 (null = 가변)
  position: 'top' | 'middle' | 'bottom'
  zIndex: number
  cssPattern: string          // proto-design에서 검색할 CSS 패턴
}

export interface LayoutElement {
  id: string                  // 설계서 ID (a1, b3-1a 등)
  label: string               // 한국어 라벨 (A-1 장신구 등)
  zone: 'A' | 'B' | 'C'
  protoFile: string           // proto-design 내 상대 경로
  protoComponent?: string     // export 컴포넌트명
  protoSearchPattern?: string // 파일 내 검색할 텍스트 패턴
  spec: {
    x: number
    y: number
    w: number
    h: number
  }
  dimensionChecks?: {
    key: string               // 검색할 CSS 속성 (h-[60px], w-[400px] 등)
    specValue: number          // 설계서 값
    tolerance?: number         // 허용 오차 (px)
  }[]
  notes?: string              // 알려진 차이 메모
}

export const ZONE_CONTRACTS: ZoneContract[] = [
  {
    id: 'A',
    name: '상단 HUD',
    heightPx: 72,
    position: 'top',
    zIndex: 20,
    cssPattern: 'h-[72px]',
  },
  {
    id: 'B',
    name: '전투 무대',
    heightPx: null,
    position: 'middle',
    zIndex: 10,
    cssPattern: "bottom: '160px'",
  },
  {
    id: 'C',
    name: '액션 바',
    heightPx: 160,
    position: 'bottom',
    zIndex: 20,
    cssPattern: 'h-[160px]',
  },
]

export const LAYOUT_ELEMENTS: LayoutElement[] = [
  // ===== Zone A =====
  {
    id: 'a2',
    label: 'A-2 지역명',
    zone: 'A',
    protoFile: 'src/components/ui/TopBar.tsx',
    protoSearchPattern: 'regionName',
    spec: { x: 830, y: 19, w: 260, h: 34 },
  },
  {
    id: 'a3',
    label: 'A-3 소울 카운터',
    zone: 'A',
    protoFile: 'src/components/ui/TopBar.tsx',
    protoSearchPattern: 'souls',
    spec: { x: 1740, y: 20, w: 100, h: 20 },
  },
  {
    id: 'a4',
    label: 'A-4 메뉴 버튼',
    zone: 'A',
    protoFile: 'src/components/ui/TopBar.tsx',
    protoSearchPattern: 'AudioControl',
    spec: { x: 1868, y: 12, w: 36, h: 36 },
    notes: '설정 메뉴 미구현 — 오디오 컨트롤만 존재',
  },

  // ===== Zone B: 장신구 (플레이어 하단) =====
  {
    id: 'b1-acc',
    label: 'B-1 장신구',
    zone: 'B',
    protoFile: 'src/components/screens/BattleScreen.tsx',
    protoSearchPattern: 'run.accessories',
    spec: { x: 270, y: 690, w: 200, h: 40 },
    notes: '장신구가 Zone A에서 Zone B 플레이어 하단으로 이동',
  },

  // ===== Zone B: 플레이어 =====
  {
    id: 'b1-sprite',
    label: 'B-1 플레이어',
    zone: 'B',
    protoFile: 'src/components/battle/CharacterCard.tsx',
    protoComponent: 'CharacterCard',
    spec: { x: 340, y: 272, w: 220, h: 330 },
  },
  {
    id: 'b1-hp',
    label: 'B-1 HP 바',
    zone: 'B',
    protoFile: 'src/components/battle/CharacterCard.tsx',
    protoSearchPattern: 'hp',
    spec: { x: 340, y: 620, w: 220, h: 18 },
  },
  {
    id: 'b1-def',
    label: 'B-1 방어도',
    zone: 'B',
    protoFile: 'src/components/battle/CharacterCard.tsx',
    protoSearchPattern: 'block',
    spec: { x: 316, y: 608, w: 40, h: 40 },
  },
  {
    id: 'b1-status',
    label: 'B-1 상태이상',
    zone: 'B',
    protoFile: 'src/components/battle/PlayerBuffs.tsx',
    protoComponent: 'PlayerBuffs',
    spec: { x: 340, y: 646, w: 264, h: 32 },
  },

  // ===== Zone B: 몬스터 =====
  {
    id: 'b2-name',
    label: 'B-2 몬스터명',
    zone: 'B',
    protoFile: 'src/components/battle/EnemyCard.tsx',
    protoSearchPattern: 'enemyName',
    spec: { x: 1380, y: 190, w: 200, h: 24 },
    notes: '적 이름이 Zone A에서 Zone B 몬스터카드 위로 이동',
  },
  {
    id: 'b2-intent',
    label: 'B-2 행동 예고',
    zone: 'B',
    protoFile: 'src/components/battle/EnemyCard.tsx',
    protoSearchPattern: 'intent',
    spec: { x: 1400, y: 218, w: 160, h: 40 },
  },
  {
    id: 'b2-monster',
    label: 'B-2 몬스터',
    zone: 'B',
    protoFile: 'src/components/battle/EnemyCard.tsx',
    protoComponent: 'EnemyCard',
    spec: { x: 1360, y: 262, w: 240, h: 360 },
    notes: '1체만 지원 (설계: 1~3체)',
  },
  {
    id: 'b2-hp',
    label: 'B-2 몬스터 HP',
    zone: 'B',
    protoFile: 'src/components/battle/EnemyCard.tsx',
    protoSearchPattern: 'hp',
    spec: { x: 1370, y: 634, w: 220, h: 14 },
  },

  // ===== Zone B: 전투 중앙 =====
  {
    id: 'b3',
    label: 'B-3 전투 중앙',
    zone: 'B',
    protoFile: 'src/components/screens/BattleScreen.tsx',
    protoSearchPattern: 'w-[400px]',
    spec: { x: 600, y: 72, w: 720, h: 796 },
    dimensionChecks: [
      { key: 'w-[', specValue: 720, tolerance: 320 },
    ],
    notes: 'proto: w-[400px] vs 설계: 720px',
  },
  {
    id: 'b4',
    label: 'B-4 코인 플립',
    zone: 'B',
    protoFile: 'src/components/effects/CoinTossAnimation.tsx',
    protoComponent: 'CoinTossAnimation',
    spec: { x: 660, y: 472, w: 600, h: 300 },
  },

  // ===== Zone B: 코인 조작 패널 =====
  {
    id: 'b3-1a',
    label: 'B-3-1a 코인 주머니',
    zone: 'B',
    protoFile: 'src/components/ui/CoinPouch.tsx',
    protoComponent: 'CoinPouch',
    spec: { x: 904, y: 612, w: 112, h: 112 },
  },
  {
    id: 'b3-1b',
    label: 'B-3-1b 코인 현황',
    zone: 'B',
    protoFile: 'src/components/screens/BattleScreen.tsx',
    protoSearchPattern: 'sunCount',
    spec: { x: 860, y: 732, w: 200, h: 30 },
  },
  {
    id: 'b3-1c',
    label: 'B-3-1c 턴 종료',
    zone: 'B',
    protoFile: 'src/components/screens/BattleScreen.tsx',
    protoSearchPattern: 'endTurn',
    spec: { x: 880, y: 772, w: 160, h: 44 },
  },
  {
    id: 'b6',
    label: 'B-6 라운드 진행바',
    zone: 'B',
    protoFile: 'src/components/screens/BattleScreen.tsx',
    protoSearchPattern: 'run.round',
    spec: { x: 600, y: 77, w: 720, h: 8 },
  },

  // ===== Zone C =====
  {
    id: 'c1',
    label: 'C-1 스킬 슬롯',
    zone: 'C',
    protoFile: 'src/components/battle/SkillPanel.tsx',
    protoComponent: 'SkillPanel',
    spec: { x: 650, y: 920, w: 140, h: 140 },
    dimensionChecks: [
      { key: 'h-[', specValue: 224, tolerance: 80 },
    ],
    notes: 'Zone C 높이 차이: proto 160px vs 설계 224px',
  },
]
