import { useState, useMemo } from 'react'

// --- 타입 정의 ---

interface LayoutComponent {
  id: string
  name: string
  zone: 'overlay' | 'S-1' | 'S-2' | 'S-3' | 'S-4' | 'S-5' | 'modal'
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
  { id: 'overlay', name: '상점 오버레이', y: 0, h: 1080, color: '#5A5F6B', description: '전체 화면 어둡기 + 패널 (z:10~11)' },
  { id: 'S-1', name: '상인 캐릭터', y: 162, h: 120, color: '#D4A574', description: '초상화 + 대사 버블' },
  { id: 'S-2', name: '스킬 상품', y: 298, h: 260, color: '#4A90C0', description: '스킬 카드 5장 수평 배치' },
  { id: 'S-3', name: '전리품 상품', y: 574, h: 200, color: '#6B4B8C', description: '전리품 카드 3장 + 슬롯 확장' },
  { id: 'S-5', name: '나가기', y: 898, h: 52, color: '#5A5F6B', description: '상점 나가기 버튼' },
] as const

const COMPONENTS: LayoutComponent[] = [
  // 오버레이 구조
  { id: 'dim', name: '어둡기 오버레이', zone: 'overlay', x: 0, y: 0, w: 1920, h: 1080, description: '전체 화면 어둡기 (#000000 50%)', color: '#5A5F6B', details: { 'z-index': '10', '배경': '#000000 50%', '등장': '0.3s 페이드인', '클릭': '패널 외부 → 즉시 닫기' } },
  { id: 'panel', name: '상점 패널', zone: 'overlay', x: 480, y: 130, w: 960, h: 820, description: '메인 상점 패널 (화면 중앙)', color: '#4A4A55', details: { 'z-index': '11', '배경': '#16161C 95%', '테두리': '#4A4A55 2px', 'border-radius': '16px', '패딩': '32px' } },

  // S-1: 상인 캐릭터 + 대사
  { id: 's1-area', name: 'S-1 전체 영역', zone: 'S-1', x: 512, y: 162, w: 896, h: 120, description: '상인 초상화 + 대사 버블', color: '#D4A574', details: { '구성': '좌측: 초상화 80×80, 우측: 대사 버블', '배경': '패널 배경 위' } },
  { id: 's1-portrait', name: '상인 초상화', zone: 'S-1', x: 512, y: 182, w: 80, h: 80, description: '원형 클리핑, 지역별 변형', color: '#D4A574', details: { '형태': '원형 클리핑', '테두리': '#D4A574 2px', '폴백': '#2A2A32 배경', '숲': '여행하는 약초상' } },
  { id: 's1-bubble', name: '대사 버블', zone: 'S-1', x: 608, y: 192, w: 780, h: 60, description: '상인 대사 텍스트 (타이핑 애니메이션)', color: '#1E1E24', details: { '배경': '#1E1E24', '테두리': '#4A4A55 1px', '폰트': '16px, #FFF5E6 90%', '타이핑': '2자/프레임' } },

  // S-2: 스킬 상품 (5장)
  { id: 's2-area', name: 'S-2 전체 영역', zone: 'S-2', x: 512, y: 298, w: 896, h: 260, description: '스킬 상품 5장 수평 배치', color: '#4A90C0', details: { '섹션 라벨': '"스킬" 14px Bold #D4A574', '카드': '140×140px, 16px 간격' } },
  { id: 's2-card1', name: '스킬 카드 1', zone: 'S-2', x: 578, y: 330, w: 140, h: 140, description: '스킬 상품 (◆12)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '테두리': '#4A4A55 2px', '가격': '좌상단 뱃지 ◆12', '호버': 'y-8px, 그림자' } },
  { id: 's2-card2', name: '스킬 카드 2', zone: 'S-2', x: 734, y: 330, w: 140, h: 140, description: '스킬 상품 (◆15)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆15' } },
  { id: 's2-card3', name: '스킬 카드 3', zone: 'S-2', x: 890, y: 330, w: 140, h: 140, description: '스킬 상품 (◆10)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆10' } },
  { id: 's2-card4', name: '스킬 카드 4', zone: 'S-2', x: 1046, y: 330, w: 140, h: 140, description: '스킬 상품 (◆18)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆18' } },
  { id: 's2-card5', name: '스킬 카드 5', zone: 'S-2', x: 1202, y: 330, w: 140, h: 140, description: '스킬 상품 (◆8)', color: '#4A90C0', details: { '프레임': '#1E1E24→#2A2A32', '가격': '◆8' } },

  // S-3: 전리품 상품 (3장)
  { id: 's3-area', name: 'S-3 전체 영역', zone: 'S-3', x: 512, y: 574, w: 520, h: 200, description: '전리품 카드 3장 수평 배치', color: '#6B4B8C', details: { '섹션 라벨': '"전리품" 14px Bold #D4A574', '카드': '140×160px, 16px 간격' } },
  { id: 's3-card1', name: '전리품 카드 1', zone: 'S-3', x: 512, y: 606, w: 140, h: 160, description: '전리품 (◆8, 일반)', color: '#6B4B8C', details: { '등급': '일반', '테두리': '#4A4A55 2px', '가격': '◆8' } },
  { id: 's3-card2', name: '전리품 카드 2', zone: 'S-3', x: 668, y: 606, w: 140, h: 160, description: '전리품 (◆6, 일반)', color: '#6B4B8C', details: { '등급': '일반', '테두리': '#4A4A55 2px', '가격': '◆6' } },
  { id: 's3-card3', name: '전리품 카드 3', zone: 'S-3', x: 824, y: 606, w: 140, h: 160, description: '전리품 (◆14, 희귀)', color: '#6B4B8C', details: { '등급': '희귀', '테두리': '#6B4B8C 2px + 글로우', '가격': '◆14' } },

  // S-4: 스킬 슬롯 확장
  { id: 's4-area', name: 'S-4 전체 영역', zone: 'S-3', x: 1064, y: 574, w: 344, h: 200, description: '스킬 슬롯 확장 영역', color: '#D4A574', details: { '섹션 라벨': '"슬롯 확장" 14px Bold #D4A574' } },
  { id: 's4-card', name: '슬롯 확장 카드', zone: 'S-3', x: 1136, y: 606, w: 200, h: 160, description: '스킬 슬롯 +1 (◆30)', color: '#D4A574', details: { '가격': '◆25~35', '테두리': '#D4A574 2px 점선', '상태': '현재 4 → 5', '최대': '6슬롯까지' } },

  // S-5: 나가기 버튼
  { id: 's5-btn', name: '나가기 버튼', zone: 'S-5', x: 860, y: 898, w: 200, h: 52, description: '상점 나가기 (pill shape)', color: '#5A5F6B', details: { '배경': '#2A2A32', '테두리': '#4A4A55 1px', '텍스트': '"상점 나가기" 18px Bold #FFF5E6', 'border-radius': '26px' } },

  // 확인 팝업 (모달)
  { id: 'confirm', name: '구매 확인 팝업', zone: 'modal', x: 760, y: 440, w: 400, h: 200, description: '구매/교체 확인 다이얼로그', color: '#D4A574', details: { 'z-index': '13', '배경': '#16161C 98%', '테두리': '#4A4A55 2px', '버튼': '[구매] #D4A574 + [취소] #2A2A32' } },
]

const Z_INDEX_LAYERS = [
  { z: 14, name: '상인 대사', content: '타이핑 애니메이션 버블' },
  { z: 13, name: '구매 확인 팝업', content: '모달 다이얼로그 (구매/교체)' },
  { z: 12, name: '상품 호버/드래그', content: '카드 프리뷰, 드래그 중 카드' },
  { z: 11, name: '상점 패널', content: '메인 상점 UI (960×820)' },
  { z: 10, name: '상점 오버레이', content: '어둡기 배경 (#000000 50%)' },
  { z: 9, name: '(기존) 툴팁', content: '스킬 프리뷰, 몬스터 상세' },
  { z: 4, name: '(기존) Zone A / Zone C', content: '상단 HUD, 액션 바 — 유지' },
  { z: 0, name: '(기존) 배경', content: '전투 배경 이미지' },
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
  overlay: { border: 'border-slate-500/60', bg: 'bg-slate-500/5', text: 'text-slate-400' },
  'S-1': { border: 'border-amber-500/60', bg: 'bg-amber-500/5', text: 'text-amber-400' },
  'S-2': { border: 'border-blue-500/60', bg: 'bg-blue-500/5', text: 'text-blue-400' },
  'S-3': { border: 'border-purple-500/60', bg: 'bg-purple-500/5', text: 'text-purple-400' },
  'S-4': { border: 'border-amber-500/60', bg: 'bg-amber-500/5', text: 'text-amber-400' },
  'S-5': { border: 'border-slate-500/60', bg: 'bg-slate-500/5', text: 'text-slate-400' },
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
      {/* 배경 */}
      <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#16161C' }}>

        {/* 어둡기 오버레이 영역 표시 */}
        <div
          className="absolute border border-slate-600/30"
          style={{
            left: toPercent(480, 1920),
            top: toPercent(130, 1080),
            width: toPercent(960, 1920),
            height: toPercent(820, 1080),
            backgroundColor: '#16161C',
            borderRadius: '8px',
            border: '2px solid #4A4A55',
          }}
        />

        {/* 컴포넌트 요소들 */}
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
                {comp.name.replace(/^S-\d+\s*/, '')}
              </span>

              {/* 호버 툴팁 */}
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

        {/* 장식 — 상인 대사 */}
        <div
          className="absolute text-[7px] font-medium pointer-events-none select-none"
          style={{ left: toPercent(640, 1920), top: toPercent(212, 1080), color: '#FFF5E6' }}
        >
          "오늘은 좋은 물건이 왔다네."
        </div>

        {/* 장식 — 가격 뱃지들 */}
        {[
          { x: 582, y: 336, text: '◆12' },
          { x: 738, y: 336, text: '◆15' },
          { x: 894, y: 336, text: '◆10' },
          { x: 1050, y: 336, text: '◆18' },
          { x: 1206, y: 336, text: '◆8' },
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

        {/* 장식 — 나가기 버튼 텍스트 */}
        <div
          className="absolute text-[7px] font-bold pointer-events-none select-none flex items-center justify-center"
          style={{
            left: toPercent(890, 1920),
            top: toPercent(916, 1080),
            color: '#FFF5E6',
          }}
        >
          상점 나가기
        </div>

        {/* 장식 — 상인 초상화 원형 */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: toPercent(530, 1920),
            top: toPercent(192, 1080),
            width: toPercent(50, 1920),
            height: toPercent(50, 1080),
            backgroundColor: '#2A2A32',
            border: '2px solid #D4A574',
          }}
        />

        {/* 장식 — 슬롯 확장 + 아이콘 */}
        <div
          className="absolute text-[8px] font-bold pointer-events-none select-none flex items-center justify-center"
          style={{
            left: toPercent(1200, 1920),
            top: toPercent(666, 1080),
            color: '#D4A574',
          }}
        >
          +1
        </div>
      </div>
    </div>
  )
}

function ComponentDetail({ component }: { component: LayoutComponent }) {
  const zoneInfo = ZONES.find((z) => z.id === component.zone)
  const zoneStyle = ZONE_COLORS[component.zone] ?? ZONE_COLORS['overlay']

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: component.color }} />
        <h4 className="text-lg font-bold text-slate-100">{component.name}</h4>
        {zoneInfo && (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${zoneStyle.border} ${zoneStyle.text}`}>
            {component.zone}: {zoneInfo.name}
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
    const grouped: Record<string, LayoutComponent[]> = {}
    for (const zone of ZONES) {
      grouped[zone.id] = []
    }
    grouped['modal'] = []
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
          1920 x 1080 기준 | 비파괴적 오버레이 | Zone A·C 유지 |{' '}
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
              <span className={`text-sm font-medium ${style.text}`}>{zone.id}</span>
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
              const style = ZONE_COLORS[zone] ?? ZONE_COLORS['overlay']
              const zoneInfo = ZONES.find((z) => z.id === zone)
              return (
                <div key={zone} className="mb-4">
                  <div className={`text-xs font-bold mb-1.5 ${style.text}`}>
                    {zone} — {zoneInfo?.name ?? '모달'}
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
