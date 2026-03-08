import { useState, useMemo } from 'react'

// --- 타입 정의 ---

interface LayoutComponent {
  id: string
  name: string
  zone: 'A' | 'B' | 'C' | 'modal'
  x: number
  y: number
  w: number
  h: number
  description: string
  color: string
  details?: Record<string, string>
}

// --- 레이아웃 데이터 (1920x1080 절대좌표) ---

const ZONES = [
  { id: 'A', name: '상단 HUD', y: 0, h: 72, color: '#D4A574', description: 'TopBar: 상점 이름, 소울, 설정 (6.7%)' },
  { id: 'B', name: '상인 + 상품 진열', y: 72, h: 848, color: '#4A90C0', description: '좌측 1/6 상인 사이드바 + 우측 5/6 상품 영역 (78.5%)' },
  { id: 'C', name: '장착 스킬 바', y: 920, h: 160, color: '#C05050', description: '장착 스킬 슬롯 + 나가기 버튼 (14.8%)' },
] as const

const COMPONENTS: LayoutComponent[] = [
  // Zone A: 상단 HUD
  { id: 'a1-title', name: 'A-1 상점 이름', zone: 'A', x: 600, y: 19, w: 200, h: 34, description: '"떠돌이 상점" + 🛒 아이콘', color: '#D4A574', details: { '폰트': '18px Medium', '색상': '#FFF5E6', '아이콘': '🛒' } },
  { id: 'a2-souls', name: 'A-2 소울 카운터', zone: 'A', x: 1740, y: 24, w: 100, h: 24, description: '소울 재화 표시', color: '#D4A574', details: { '폰트': '20px Bold', '포맷': '"◆ 42"' } },
  { id: 'a3-menu', name: 'A-3 메뉴 버튼', zone: 'A', x: 1868, y: 15, w: 42, h: 42, description: '설정 메뉴 열기', color: '#FFF5E6', details: { '크기': '36x36px (터치 48x48)', '아이콘': '톱니바퀴' } },

  // Zone B 좌측: 상인 사이드바 (w-1/6 = 320px)
  { id: 'b1-sidebar', name: 'B-1 상인 사이드바', zone: 'B', x: 0, y: 72, w: 320, h: 848, description: '좌측 1/6, 말풍선+상인 세로 중앙 배치', color: '#D4A574', details: { '너비': 'w-1/6 (min 160px)', '배경': '#16161C/40', '테두리': '우측 #4A4A55/30', '레이아웃': 'flex-col center gap-16' } },
  { id: 'b1-bubble', name: 'B-1 말풍선', zone: 'B', x: 16, y: 376, w: 288, h: 80, description: '상인 대사 (세로 중앙 그룹 상단)', color: '#2A2218', details: { '배경': '#2A2218→#1E1E24', '테두리': '#D4A574/40 1px', '폰트': '14px italic #FFF5E6/80', '포인터': '하단 중앙 삼각형' } },
  { id: 'b1-merchant', name: 'B-1 상인 이미지', zone: 'B', x: 104, y: 472, w: 112, h: 144, description: 'npc_wandering-merchant.png (세로 중앙 그룹 하단)', color: '#D4A574', details: { '크기': '112×144px (w-28 h-36)', '에셋': 'npc_wandering-merchant.png', '글로우': 'box-shadow 0 0 24px rgba(212,165,116,0.3)', '호버': 'rotate -2°→2°→0° (0.5s)' } },

  // Zone B 우측: 스킬 상품 영역 (x=320~1920, 수직·수평 중앙)
  { id: 'b2-area', name: 'B-2 스킬 상품 영역', zone: 'B', x: 344, y: 230, w: 1552, h: 250, description: '스킬 5장 수평·수직 중앙 배치', color: '#4A90C0', details: { '섹션 라벨': '"⚔️ 스킬" 14px Bold #D4A574', '카드': 'w-44 (176px), gap-4 (16px)', '정렬': 'flex-wrap justify-center' } },
  { id: 'b2-card1', name: '스킬 카드 1', zone: 'B', x: 688, y: 270, w: 160, h: 200, description: '스킬 상품 (◆12)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆12', '이미지': 'SKILL_IMAGES fallback' } },
  { id: 'b2-card2', name: '스킬 카드 2', zone: 'B', x: 864, y: 270, w: 160, h: 200, description: '스킬 상품 (◆15)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆15' } },
  { id: 'b2-card3', name: '스킬 카드 3', zone: 'B', x: 1040, y: 270, w: 160, h: 200, description: '스킬 상품 (◆10)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆10' } },
  { id: 'b2-card4', name: '스킬 카드 4', zone: 'B', x: 1216, y: 270, w: 160, h: 200, description: '스킬 상품 (◆18)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆18' } },
  { id: 'b2-card5', name: '스킬 카드 5', zone: 'B', x: 1392, y: 270, w: 160, h: 200, description: '스킬 상품 (◆8)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆8' } },

  // Zone B 우측: 전리품 + 슬롯 확장 영역 (스킬 섹션 하단)
  { id: 'b3-area', name: 'B-3 전리품 & 기타', zone: 'B', x: 344, y: 504, w: 1552, h: 260, description: '전리품 3장 + 슬롯 확장 1장, 수평 중앙 배치', color: '#6B4B8C', details: { '섹션 라벨': '"🎒 전리품 & 기타" 14px Bold', '카드': 'w-44 (176px) / 슬롯 200px, gap-4' } },
  { id: 'b3-card1', name: '전리품 카드 1', zone: 'B', x: 756, y: 544, w: 160, h: 220, description: '전리품 (◆8, 일반)', color: '#6B4B8C', details: { '등급': '일반', '테두리': '#4A4A55 2px', '가격': '◆8' } },
  { id: 'b3-card2', name: '전리품 카드 2', zone: 'B', x: 932, y: 544, w: 160, h: 220, description: '전리품 (◆6, 일반)', color: '#6B4B8C', details: { '등급': '일반', '가격': '◆6' } },
  { id: 'b3-card3', name: '전리품 카드 3', zone: 'B', x: 1108, y: 544, w: 160, h: 220, description: '전리품 (◆14, 희귀)', color: '#6B4B8C', details: { '등급': '희귀', '테두리': '#6B4B8C 2px + 글로우', '가격': '◆14' } },
  { id: 'b4-card', name: '슬롯 확장 카드', zone: 'B', x: 1284, y: 544, w: 200, h: 220, description: '스킬 슬롯 +1 (◆30)', color: '#D4A574', details: { '가격': '◆25~35', '테두리': '#D4A574 2px 점선', '상태': '현재 4 → 5' } },

  // Zone C: 장착 스킬 + 나가기
  { id: 'c1-slot1', name: 'C-1 스킬 슬롯 1', zone: 'C', x: 782, y: 932, w: 80, h: 96, description: '기본 공격 (장착) — 스킬 이미지 + 프레임', color: '#D4A574', details: { '크기': '80×96px', '프레임': '#2A2A32', '테두리': '#4A4A55 1px' } },
  { id: 'c1-slot2', name: 'C-1 스킬 슬롯 2', zone: 'C', x: 874, y: 932, w: 80, h: 96, description: '기본 방어 (장착) — 스킬 이미지 + 프레임', color: '#D4A574', details: { '크기': '80×96px' } },
  { id: 'c1-slot3', name: 'C-1 스킬 슬롯 3', zone: 'C', x: 966, y: 932, w: 80, h: 96, description: '투지 (장착) — 스킬 이미지 + 프레임', color: '#D4A574', details: { '크기': '80×96px' } },
  { id: 'c1-slot4', name: 'C-1 스킬 슬롯 4', zone: 'C', x: 1058, y: 932, w: 80, h: 96, description: '빈 슬롯 (점선)', color: '#4A4A55', details: { '크기': '80×96px', '테두리': '#4A4A55 1px 점선' } },
  { id: 'c2-exit', name: 'C-2 나가기 버튼', zone: 'C', x: 1560, y: 952, w: 200, h: 56, description: '상점 나가기 (우측 고정)', color: '#5A5F6B', details: { '배경': '#2A2A32', '테두리': '#4A4A55 1px', '텍스트': '"나가기 →" 18px Bold #FFF5E6', 'border-radius': '12px' } },

  // 확인 팝업 (모달)
  { id: 'confirm', name: '구매 확인 팝업', zone: 'modal', x: 760, y: 452, w: 400, h: 200, description: '구매/교체 확인 다이얼로그', color: '#D4A574', details: { 'z-index': '13', '배경': '#16161C 98%', '테두리': '#4A4A55 2px', '버튼': '[구매] #D4A574 + [취소] #2A2A32' } },
]

const Z_INDEX_LAYERS = [
  { z: 13, name: '구매 확인 팝업', content: '모달 다이얼로그 (구매/교체)' },
  { z: 12, name: '상품 호버', content: '카드 프리뷰, 호버 효과' },
  { z: 10, name: 'Zone B 레이아웃', content: '좌측 사이드바(상인+말풍선) + 우측 상품 영역 (flex)' },
  { z: 9, name: '툴팁', content: '스킬 프리뷰, 상세 정보' },
  { z: 4, name: 'Zone A / Zone C', content: '상단 HUD, 장착 스킬 바' },
  { z: 0, name: '배경', content: '배경 이미지 (전투 배경과 동일)' },
]

const COLOR_PALETTE = [
  { name: 'Panel BG', hex: '#16161C', token: '--shop-panel-bg' },
  { name: 'Card BG Start', hex: '#1E1E24', token: '--bg-dark' },
  { name: 'Card BG End', hex: '#2A2A32', token: '--bg-medium' },
  { name: 'Card Border', hex: '#4A4A55', token: '--border' },
  { name: 'Price', hex: '#D4A574', token: '--shop-price' },
  { name: 'Price Insufficient', hex: '#FF4444', token: '--shop-price-insufficient' },
  { name: 'Price Insuf BG', hex: '#3A2020', token: '--shop-price-insufficient-bg' },
  { name: 'SOLD', hex: '#FF4444', token: '--shop-sold (60%)' },
  { name: 'Loot Rare', hex: '#6B4B8C', token: '--shop-loot-rare' },
  { name: 'Slot Border', hex: '#D4A574', token: '--shop-slot-border (dashed)' },
  { name: 'Confirm Btn', hex: '#D4A574', token: '--shop-confirm-btn' },
  { name: 'Confirm Btn Text', hex: '#16161C', token: '--shop-confirm-btn-text' },
  { name: 'Text Primary', hex: '#FFF5E6', token: '--text-primary' },
]

// --- 영역 색상 맵 ---
const ZONE_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  A: { border: 'border-amber-500/60', bg: 'bg-amber-500/5', text: 'text-amber-400' },
  B: { border: 'border-blue-500/60', bg: 'bg-blue-500/5', text: 'text-blue-400' },
  C: { border: 'border-red-500/60', bg: 'bg-red-500/5', text: 'text-red-400' },
  modal: { border: 'border-amber-500/60', bg: 'bg-amber-500/5', text: 'text-amber-400' },
}

// --- 컴포넌트 ---

function WireframePreview({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  const toPercent = (val: number, base: number) => `${(val / base) * 100}%`

  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#16161C' }}>

        {ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`absolute border ${ZONE_COLORS[zone.id].border} ${ZONE_COLORS[zone.id].bg}`}
            style={{
              left: 0,
              top: toPercent(zone.y, 1080),
              width: '100%',
              height: toPercent(zone.h, 1080),
            }}
          >
            <span className={`absolute top-1 left-2 text-[10px] font-bold opacity-60 ${ZONE_COLORS[zone.id].text}`}>
              Zone {zone.id}
            </span>
          </div>
        ))}

        <div className="absolute w-full h-px" style={{ top: toPercent(72, 1080), backgroundColor: '#4A4A55' }} />
        <div className="absolute w-full h-px" style={{ top: toPercent(920, 1080), backgroundColor: '#4A4A55' }} />

        {COMPONENTS.map((comp) => {
          const isHovered = hovered === comp.id
          const isSelected = selected === comp.id
          const isHighlighted = isHovered || isSelected

          return (
            <div
              key={comp.id}
              className={`absolute cursor-pointer transition-all duration-150 border rounded-sm flex items-center justify-center ${
                isHighlighted
                  ? 'border-amber-400 z-20 shadow-lg shadow-amber-400/20'
                  : 'border-slate-600/50 hover:border-slate-400/70 z-10'
              }`}
              style={{
                left: toPercent(comp.x, 1920),
                top: toPercent(comp.y, 1080),
                width: toPercent(comp.w, 1920),
                height: toPercent(comp.h, 1080),
                backgroundColor: isHighlighted
                  ? `${comp.color}30`
                  : `${comp.color}15`,
              }}
              onMouseEnter={() => setHovered(comp.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(isSelected ? null : comp.id)}
            >
              <span
                className="text-[8px] leading-tight text-center font-medium truncate px-0.5 select-none pointer-events-none"
                style={{ color: isHighlighted ? '#FFF5E6' : `${comp.color}CC` }}
              >
                {comp.name.replace(/^[A-C]-\d+\s*/, '')}
              </span>

              {isHovered && !isSelected && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-[9px] whitespace-nowrap pointer-events-none z-30"
                  style={{ backgroundColor: '#16161CE8', border: '1px solid #4A4A55', color: '#FFF5E6' }}
                >
                  <div className="font-bold">{comp.name}</div>
                  <div className="opacity-70">{comp.x}, {comp.y} | {comp.w}x{comp.h}</div>
                </div>
              )}
            </div>
          )
        })}

        <div
          className="absolute text-[8px] font-medium pointer-events-none select-none"
          style={{ left: toPercent(640, 1920), top: toPercent(22, 1080), color: '#FFF5E6' }}
        >
          🛒 떠돌이 상점
        </div>

        <div
          className="absolute w-px pointer-events-none"
          style={{
            left: toPercent(320, 1920),
            top: toPercent(72, 1080),
            height: toPercent(848, 1080),
            backgroundColor: '#4A4A55',
          }}
        />

        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: toPercent(130, 1920),
            top: toPercent(496, 1080),
            width: toPercent(60, 1920),
            height: toPercent(60, 1080),
            backgroundColor: '#2A2A32',
            border: '2px solid #D4A574',
          }}
        />

        <div
          className="absolute text-[7px] font-medium pointer-events-none select-none"
          style={{ left: toPercent(40, 1920), top: toPercent(396, 1080), color: '#FFF5E6' }}
        >
          "오늘은 좋은 물건이 왔다네."
        </div>

        {[
          { x: 692, y: 276, text: '◆12' },
          { x: 868, y: 276, text: '◆15' },
          { x: 1044, y: 276, text: '◆10' },
          { x: 1220, y: 276, text: '◆18' },
          { x: 1396, y: 276, text: '◆8' },
        ].map((badge) => (
          <div
            key={badge.text + badge.x}
            className="absolute text-[6px] font-bold pointer-events-none select-none"
            style={{
              left: toPercent(badge.x, 1920),
              top: toPercent(badge.y, 1080),
              color: '#D4A574',
            }}
          >
            {badge.text}
          </div>
        ))}

        <div
          className="absolute text-[8px] font-bold pointer-events-none select-none"
          style={{ left: toPercent(1344, 1920), top: toPercent(640, 1080), color: '#D4A574' }}
        >
          +1
        </div>

        <div
          className="absolute text-[7px] font-bold pointer-events-none select-none"
          style={{ left: toPercent(1620, 1920), top: toPercent(972, 1080), color: '#FFF5E6' }}
        >
          나가기 →
        </div>
      </div>
    </div>
  )
}

function ComponentDetail({ component }: { component: LayoutComponent }) {
  const zoneInfo = ZONES.find((z) => z.id === component.zone)
  const zoneStyle = ZONE_COLORS[component.zone] ?? ZONE_COLORS['modal']

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: component.color }} />
        <h4 className="text-lg font-bold text-slate-100">{component.name}</h4>
        {zoneInfo && (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${zoneStyle.border} ${zoneStyle.text}`}>
            Zone {component.zone}: {zoneInfo.name}
          </span>
        )}
      </div>

      <p className="text-slate-300 text-sm mb-4">{component.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <h5 className="text-xs font-bold text-slate-400 mb-2">위치 / 크기</h5>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">X</span>
              <span className="text-slate-200 font-mono">{component.x}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Y</span>
              <span className="text-slate-200 font-mono">{component.y}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">W</span>
              <span className="text-slate-200 font-mono">{component.w}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">H</span>
              <span className="text-slate-200 font-mono">{component.h}px</span>
            </div>
          </div>
        </div>

        {component.details && (
          <div className="bg-slate-900/50 rounded-lg p-3">
            <h5 className="text-xs font-bold text-slate-400 mb-2">상세 속성</h5>
            <div className="space-y-1 text-sm">
              {Object.entries(component.details).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-2">
                  <span className="text-slate-400 shrink-0">{key}</span>
                  <span className="text-slate-200 text-right truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type InfoTab = 'zindex' | 'palette' | 'products'

export default function ShopLayout() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [infoTab, setInfoTab] = useState<InfoTab>('zindex')

  const selectedData = useMemo(
    () => COMPONENTS.find((c) => c.id === selectedComponent) ?? null,
    [selectedComponent],
  )

  const componentsByZone = useMemo(() => {
    const grouped: Record<string, LayoutComponent[]> = { A: [], B: [], C: [], modal: [] }
    for (const comp of COMPONENTS) {
      const key = comp.zone
      if (key in grouped) {
        grouped[key].push(comp)
      }
    }
    return grouped
  }, [])

  const infoTabs = [
    { id: 'zindex' as InfoTab, label: 'Z-Index 레이어', icon: '📐' },
    { id: 'palette' as InfoTab, label: '색상 팔레트', icon: '🎨' },
    { id: 'products' as InfoTab, label: '상품 타입별 정보', icon: '🛒' },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-amber-900/40 to-slate-800 p-6 rounded-xl border border-amber-700/40">
        <h2 className="text-2xl font-bold text-emerald-400 mb-1">상점 화면 UI 레이아웃</h2>
        <p className="text-slate-300 text-sm">
          1920 x 1080 기준 | Zone A·B·C 3분할 | v4.0 Dark Frame Edition |{' '}
          <span className="text-slate-400">컴포넌트를 클릭하면 상세 정보를 확인할 수 있습니다</span>
        </p>
      </div>

      {/* 영역 범례 */}
      <div className="flex flex-wrap gap-4">
        {ZONES.map((zone) => {
          const style = ZONE_COLORS[zone.id] ?? ZONE_COLORS['overlay']
          return (
            <div
              key={zone.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${style.border} bg-slate-800/50`}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
              <span className={`text-sm font-medium ${style.text}`}>Zone {zone.id}</span>
              <span className="text-xs text-slate-400">{zone.name}</span>
              <span className="text-xs text-slate-500">{zone.description}</span>
            </div>
          )
        })}
      </div>

      {/* 메인 영역: 와이어프레임 + 컴포넌트 목록 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 와이어프레임 (3/4) */}
        <div className="xl:col-span-3">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <WireframePreview selected={selectedComponent} onSelect={setSelectedComponent} />
          </div>

          {/* 선택된 컴포넌트 상세 */}
          {selectedData && (
            <div className="mt-4">
              <ComponentDetail component={selectedData} />
            </div>
          )}
        </div>

        {/* 컴포넌트 목록 (1/4) */}
        <div className="xl:col-span-1">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 max-h-[600px] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-300 mb-3">
              컴포넌트 목록 ({COMPONENTS.length}개)
            </h3>
            {Object.entries(componentsByZone).map(([zone, comps]) => {
              if (comps.length === 0) return null
              const style = ZONE_COLORS[zone] ?? ZONE_COLORS['modal']
              const zoneInfo = ZONES.find((z) => z.id === zone)
              return (
                <div key={zone} className="mb-4">
                  <div className={`text-xs font-bold mb-1.5 ${style.text}`}>
                    Zone {zone} — {zoneInfo?.name ?? '모달'}
                  </div>
                  <div className="space-y-1">
                    {comps.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => setSelectedComponent(selectedComponent === comp.id ? null : comp.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                          selectedComponent === comp.id
                            ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                            : 'text-slate-300 hover:bg-slate-700/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: comp.color }} />
                          <span className="truncate">{comp.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 정보 탭 */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="flex gap-1 border-b border-slate-700 px-4 pt-3">
          {infoTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setInfoTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                infoTab === tab.id
                  ? 'bg-slate-700 text-emerald-400 border-t border-x border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {infoTab === 'zindex' && <ZIndexTable />}
          {infoTab === 'palette' && <PaletteGrid />}
          {infoTab === 'products' && <ProductTable />}
        </div>
      </div>
    </div>
  )
}

function ZIndexTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-3 text-slate-400 font-medium w-20">z-index</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium w-40">레이어</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">내용</th>
          </tr>
        </thead>
        <tbody>
          {Z_INDEX_LAYERS.map((layer) => (
            <tr key={layer.z} className="border-b border-slate-700/50 hover:bg-slate-700/20">
              <td className="py-2 px-3 font-mono text-emerald-400">{layer.z}</td>
              <td className="py-2 px-3 text-slate-200 font-medium">{layer.name}</td>
              <td className="py-2 px-3 text-slate-400">{layer.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PaletteGrid() {
  return (
    <div>
      <h4 className="text-sm font-bold text-slate-300 mb-3">상점 색상 시스템</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {COLOR_PALETTE.map((c) => (
          <div key={c.token} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <div className="w-full h-8 rounded mb-2 border border-slate-600/30" style={{ backgroundColor: c.hex }} />
            <div className="text-xs text-slate-200 font-medium truncate">{c.name}</div>
            <div className="text-xs text-slate-400 font-mono">{c.hex}</div>
            <div className="text-[10px] text-slate-500">{c.token}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductTable() {
  const products = [
    {
      type: '스킬 상품',
      icon: '⚔',
      count: '5장',
      cardSize: '140×140px',
      priceRange: '◆8~20',
      composition: '클래스 전용 3 + 범용 2',
      special: '배틀씬 스킬 카드 프레임 재사용, 좌상단 가격 뱃지 추가',
    },
    {
      type: '전리품',
      icon: '🎒',
      count: '3장',
      cardSize: '140×160px',
      priceRange: '◆6~18',
      composition: '일반 2 + 희귀 1 (70:30)',
      special: '즉시 적용 패시브, 희귀 등급 글로우 효과',
    },
    {
      type: '슬롯 확장',
      icon: '➕',
      count: '1장',
      cardSize: '200×160px',
      priceRange: '◆25~35',
      composition: '스킬 슬롯 +1',
      special: '점선 테두리, 최대 6슬롯 제한',
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-3 text-slate-400 font-medium">상품 타입</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">수량</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">카드 크기</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">가격 범위</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">구성</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">특이사항</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.type} className="border-b border-slate-700/50 hover:bg-slate-700/20">
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{p.icon}</span>
                  <span className="text-slate-200 font-medium">{p.type}</span>
                </div>
              </td>
              <td className="py-2 px-3 text-slate-400">{p.count}</td>
              <td className="py-2 px-3 text-slate-400 font-mono">{p.cardSize}</td>
              <td className="py-2 px-3 font-mono" style={{ color: '#D4A574' }}>{p.priceRange}</td>
              <td className="py-2 px-3 text-slate-400">{p.composition}</td>
              <td className="py-2 px-3 text-slate-400">{p.special}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
