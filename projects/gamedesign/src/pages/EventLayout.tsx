import { useState, useMemo } from 'react'

// --- 타입 정의 ---

interface LayoutComponent {
  id: string
  name: string
  zone: 'overlay' | 'E-1' | 'E-2' | 'E-3' | 'E-4' | 'E-5' | 'modal' | 'effect'
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
  { id: 'overlay', name: '이벤트 오버레이', y: 0, h: 1080, color: '#5A5F6B', description: '전체 화면 어둡기 + 패널 (z:10~11)' },
  { id: 'E-1', name: '이벤트 헤더', y: 162, h: 120, color: '#D4A574', description: '일러스트 + 이름 + 유형 뱃지' },
  { id: 'E-2', name: '나레이션', y: 298, h: 140, color: '#1E1E24', description: '타이핑 텍스트 (3자/프레임)' },
  { id: 'E-3', name: '선택지', y: 454, h: 264, color: '#2A2A32', description: '선택지 카드 2~3장 수직 배치' },
  { id: 'E-4', name: '포기/계속', y: 866, h: 52, color: '#5A5F6B', description: '포기 버튼 (A/C만) / 계속 버튼' },
] as const

const COMPONENTS: LayoutComponent[] = [
  // 오버레이 구조
  { id: 'dim', name: '어둡기 오버레이', zone: 'overlay', x: 0, y: 0, w: 1920, h: 1080, description: '전체 화면 어둡기 (#000000 50%)', color: '#5A5F6B', details: { 'z-index': '10', '배경': '#000000 50%', '등장': '0.3s 페이드인', '클릭': '동작 없음 (상점과 다름)' } },
  { id: 'panel', name: '이벤트 패널', zone: 'overlay', x: 480, y: 130, w: 960, h: 820, description: '메인 이벤트 패널 (화면 중앙)', color: '#4A4A55', details: { 'z-index': '11', '배경': '#16161C 95%', '테두리': '#4A4A55 2px (D유형: #C45555)', 'border-radius': '16px', '패딩': '32px' } },

  // E-1: 이벤트 헤더
  { id: 'e1-area', name: 'E-1 전체 영역', zone: 'E-1', x: 512, y: 162, w: 896, h: 120, description: '이벤트 일러스트 + 이름 + 유형 뱃지', color: '#D4A574', details: { '구성': '좌측: 일러스트 120×120, 우측: 이름 + 뱃지', '등장': '0.4s 스케일인 + 페이드인' } },
  { id: 'e1-illust', name: '이벤트 일러스트', zone: 'E-1', x: 512, y: 162, w: 120, h: 120, description: '라운드 사각형 클리핑, 유형별 테두리 색상', color: '#D4A574', details: { 'border-radius': '12px', '테두리': '유형별 악센트 2px', '폴백': '#2A2A32 배경', '등장': '0.4s 스케일 0.8→1.0' } },
  { id: 'e1-name', name: '이벤트 이름', zone: 'E-1', x: 648, y: 170, w: 400, h: 28, description: '이벤트 이름 텍스트', color: '#FFF5E6', details: { '폰트': '22px Bold', '색상': '#FFF5E6' } },
  { id: 'e1-badge', name: '유형 뱃지', zone: 'E-1', x: 648, y: 206, w: 120, h: 28, description: '이벤트 유형 표시 뱃지 (pill)', color: '#6B9E78', details: { '배경': '악센트 20%', '테두리': '악센트 40% 1px', 'border-radius': '14px', 'A': '#6B9E78 / B: #8B7BB5 / C: #D4985A / D: #C45555' } },

  // E-2: 나레이션 텍스트
  { id: 'e2-area', name: 'E-2 전체 영역', zone: 'E-2', x: 512, y: 298, w: 896, h: 140, description: '나레이션 텍스트 (타이핑 애니메이션)', color: '#1E1E24', details: { '배경': '#1E1E24', '테두리': '#4A4A55 1px', 'border-radius': '10px', '패딩': '좌우24 상하20px' } },
  { id: 'e2-text', name: '텍스트 영역', zone: 'E-2', x: 536, y: 318, w: 848, h: 100, description: '실제 텍스트 (패딩 제외)', color: '#FFF5E6', details: { '폰트': '16px, #FFF5E6 90%', '행간': '1.6 (26px)', '최대': '4줄', '따옴표': '" 32px #D4A574 30%' } },

  // E-3: 선택지 카드
  { id: 'e3-area', name: 'E-3 전체 영역', zone: 'E-3', x: 512, y: 454, w: 896, h: 264, description: '선택지 카드 2~3장 수직 배치', color: '#2A2A32', details: { '카드': '800×80px 가로형', '간격': '12px', '수평 오프셋': '48px' } },
  { id: 'e3-card1', name: '선택지 카드 1', zone: 'E-3', x: 560, y: 454, w: 800, h: 80, description: '선택지 1 (악센트바 + 아이콘 + 텍스트 + 코스트)', color: '#6B9E78', details: { '악센트바': '4×80px 좌측', '아이콘': '48×48px (x:20 y:16)', '텍스트': '16px Bold #FFF5E6', '배경': '#2A2A32' } },
  { id: 'e3-card2', name: '선택지 카드 2', zone: 'E-3', x: 560, y: 546, w: 800, h: 80, description: '선택지 2', color: '#6B9E78', details: { '악센트바': '4×80px 좌측', '아이콘': '48×48px', '텍스트': '16px Bold #FFF5E6' } },
  { id: 'e3-card3', name: '선택지 카드 3', zone: 'E-3', x: 560, y: 638, w: 800, h: 80, description: '선택지 3 (3장 이벤트 시)', color: '#6B9E78', details: { '악센트바': '4×80px 좌측', '아이콘': '48×48px', '조건': '2~3장 (이벤트에 따라)' } },

  // E-4: 포기/계속 버튼
  { id: 'e4-abandon', name: '포기하기 버튼', zone: 'E-4', x: 860, y: 866, w: 200, h: 52, description: '포기 버튼 (A/C 유형만 표시)', color: '#5A5F6B', details: { '배경': '#5A5F6B 40%', '테두리': '#5A5F6B 1px', '텍스트': '"포기하기" 16px Bold #FFF5E6 70%', '조건': 'A/C만 표시, B/D 미표시' } },
  { id: 'e4-continue', name: '계속 버튼', zone: 'E-4', x: 860, y: 866, w: 200, h: 52, description: '결과 화면의 계속 버튼 (포기 자리 대체)', color: '#D4A574', details: { '배경': '#D4A574', '텍스트': '"계속" 16px Bold #16161C', '호버': '#E4B584', '조건': '결과 화면에서만 표시' } },

  // E-5: 결과 화면 (크로스페이드 후 E-2+E-3 대체)
  { id: 'e5-result', name: '결과 화면 영역', zone: 'E-5', x: 512, y: 298, w: 896, h: 420, description: '크로스페이드 후 보상/손실 표시', color: '#6B9E78', details: { '전환': '0.45s 크로스페이드', '나레이션': '결과 텍스트', '보상': '#6B9E78 / 손실: #C45555' } },
  { id: 'e5-narration', name: '결과 나레이션', zone: 'E-5', x: 536, y: 318, w: 848, h: 80, description: '결과 상황 설명 텍스트', color: '#FFF5E6', details: { '폰트': '16px, #FFF5E6 90%', '예시': '"행상인이 보따리에서 붉은 물약을 꺼내 건넨다."' } },
  { id: 'e5-rewards', name: '보상/손실 항목', zone: 'E-5', x: 560, y: 418, w: 800, h: 200, description: '보상 및 손실 목록', color: '#6B9E78', details: { 'HP 회복': '#6B9E78 🧪', '소울 획득': '#D4A574 ◆', 'HP 손실': '#C45555 💔', '소울 소비': '#C45555 70% ◆' } },

  // 확률 연출 영역
  { id: 'coin-flip', name: '코인 플립 연출', zone: 'effect', x: 912, y: 420, w: 96, h: 96, description: '운명의 동전 이벤트 전용 (Y축 3바퀴)', color: '#FFD700', details: { 'z-index': '14', '크기': '96×96px', '회전': 'Y축 3바퀴 1.0s', '성공': '#FFD700 글로우', '실패': '#C45555 글로우' } },
  { id: 'gauge', name: '확률 게이지', zone: 'effect', x: 810, y: 420, w: 300, h: 20, description: '어둠의 덫 이벤트 전용 (게이지 스위핑)', color: '#D4A574', details: { 'z-index': '14', '성공': '#6B9E78 채움 (좌측)', '실패': '#C45555 채움 (우측)', '포인터': '3회 왕복 0.8s → 정지' } },

  // 확인 팝업 (모달)
  { id: 'confirm', name: '리스크 확인 팝업', zone: 'modal', x: 760, y: 440, w: 400, h: 220, description: '유형 C 리스크 선택지 확인', color: '#D4985A', details: { 'z-index': '13', '배경': '#16161C 98%', '테두리': '#4A4A55 2px', '버튼': '[진행] #D4985A + [취소] #2A2A32' } },
]

const Z_INDEX_LAYERS = [
  { z: 14, name: '확률 연출', content: '코인 플립 (§12.2), 게이지 스위핑 (§12.6)' },
  { z: 13, name: '확인 팝업', content: '리스크 선택지 확인 다이얼로그' },
  { z: 12, name: '선택지 호버/프리뷰', content: '선택지 카드 툴팁, 호버 프리뷰' },
  { z: 11, name: '이벤트 패널', content: '메인 이벤트 UI (960×820)' },
  { z: 10, name: '이벤트 오버레이', content: '어둡기 배경 (#000000 50%)' },
  { z: 9, name: '(기존) 툴팁', content: '스킬 프리뷰, 몬스터 상세' },
  { z: 4, name: '(기존) Zone A / Zone C', content: '상단 HUD, 액션 바 — 유지' },
  { z: 0, name: '(기존) 배경', content: '전투 배경 이미지' },
]

const EVENT_TYPE_COLORS = [
  { type: '(A) 관대', hex: '#6B9E78', accent: '안전 — 자연톤', canAbandon: '가능', hpRisk: '없음', ratio: '40~50%' },
  { type: '(B) 의외', hex: '#8B7BB5', accent: '신비 — 보라톤', canAbandon: '불가', hpRisk: '없음', ratio: '15~20%' },
  { type: '(C) 유혹', hex: '#D4985A', accent: '금빛 — 리스크', canAbandon: '가능', hpRisk: '있음', ratio: '25~30%' },
  { type: '(D) 시련', hex: '#C45555', accent: '위험 — 적색', canAbandon: '불가', hpRisk: '있음', ratio: '~10%' },
]

const COLOR_PALETTE = [
  { name: 'Panel BG', hex: '#16161C', token: '--event-panel-bg' },
  { name: 'Narration BG', hex: '#1E1E24', token: '--event-narration-bg' },
  { name: 'Choice BG', hex: '#2A2A32', token: '--event-choice-bg' },
  { name: 'Type A (관대)', hex: '#6B9E78', token: '--event-type-a' },
  { name: 'Type B (의외)', hex: '#8B7BB5', token: '--event-type-b' },
  { name: 'Type C (유혹)', hex: '#D4985A', token: '--event-type-c' },
  { name: 'Type D (시련)', hex: '#C45555', token: '--event-type-d' },
  { name: 'Reward', hex: '#6B9E78', token: '--event-reward' },
  { name: 'Risk', hex: '#C45555', token: '--event-risk' },
  { name: 'Probability', hex: '#D4A574', token: '--event-probability' },
  { name: 'Abandon Btn', hex: '#5A5F6B', token: '--event-abandon-btn' },
  { name: 'Text Primary', hex: '#FFF5E6', token: '--text-primary' },
]

// --- 영역 색상 맵 ---
const ZONE_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  overlay: { border: 'border-slate-500/60', bg: 'bg-slate-500/5', text: 'text-slate-400' },
  'E-1': { border: 'border-amber-500/60', bg: 'bg-amber-500/5', text: 'text-amber-400' },
  'E-2': { border: 'border-slate-400/60', bg: 'bg-slate-400/5', text: 'text-slate-300' },
  'E-3': { border: 'border-green-500/60', bg: 'bg-green-500/5', text: 'text-green-400' },
  'E-4': { border: 'border-slate-500/60', bg: 'bg-slate-500/5', text: 'text-slate-400' },
  'E-5': { border: 'border-emerald-500/60', bg: 'bg-emerald-500/5', text: 'text-emerald-400' },
  modal: { border: 'border-orange-500/60', bg: 'bg-orange-500/5', text: 'text-orange-400' },
  effect: { border: 'border-yellow-500/60', bg: 'bg-yellow-500/5', text: 'text-yellow-400' },
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

        {/* 이벤트 패널 영역 */}
        <div
          className="absolute"
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
                {comp.name.replace(/^E-\d+\s*/, '')}
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

        {/* 장식 — 이벤트 이름 */}
        <div
          className="absolute text-[8px] font-bold pointer-events-none select-none"
          style={{ left: toPercent(660, 1920), top: toPercent(178, 1080), color: '#FFF5E6' }}
        >
          떠돌이 행상인
        </div>

        {/* 장식 — 유형 뱃지 */}
        <div
          className="absolute text-[6px] font-bold pointer-events-none select-none px-1.5 py-0.5 rounded-full"
          style={{
            left: toPercent(660, 1920),
            top: toPercent(210, 1080),
            color: '#6B9E78',
            backgroundColor: '#6B9E7833',
            border: '1px solid #6B9E7866',
          }}
        >
          관대한 이벤트
        </div>

        {/* 장식 — 나레이션 따옴표 */}
        <div
          className="absolute text-[16px] font-bold pointer-events-none select-none"
          style={{ left: toPercent(520, 1920), top: toPercent(304, 1080), color: '#D4A574', opacity: 0.3 }}
        >
          "
        </div>

        {/* 장식 — 나레이션 텍스트 */}
        <div
          className="absolute text-[7px] font-medium pointer-events-none select-none"
          style={{ left: toPercent(546, 1920), top: toPercent(330, 1080), color: '#FFF5E6', opacity: 0.9 }}
        >
          등에 커다란 보따리를 멘 행상인이 손을 흔든다.
        </div>

        {/* 장식 — 선택지 악센트바 */}
        {[454, 546, 638].map((y) => (
          <div
            key={y}
            className="absolute pointer-events-none"
            style={{
              left: toPercent(560, 1920),
              top: toPercent(y, 1080),
              width: toPercent(4, 1920),
              height: toPercent(80, 1080),
              backgroundColor: '#6B9E78',
              borderRadius: '4px 0 0 4px',
            }}
          />
        ))}

        {/* 장식 — 선택지 텍스트 */}
        {[
          { y: 480, text: '소울 8 → 물약 구매', cost: '◆8' },
          { y: 572, text: '소울 5 → 정보 구매', cost: '◆5' },
          { y: 664, text: '그냥 지나간다', cost: '—' },
        ].map((choice) => (
          <div key={choice.y}>
            <div
              className="absolute text-[6px] font-medium pointer-events-none select-none"
              style={{ left: toPercent(600, 1920), top: toPercent(choice.y, 1080), color: '#FFF5E6' }}
            >
              {choice.text}
            </div>
            <div
              className="absolute text-[6px] font-bold pointer-events-none select-none"
              style={{ left: toPercent(1290, 1920), top: toPercent(choice.y, 1080), color: '#D4A574' }}
            >
              {choice.cost}
            </div>
          </div>
        ))}

        {/* 장식 — 포기 버튼 텍스트 */}
        <div
          className="absolute text-[7px] font-bold pointer-events-none select-none flex items-center justify-center"
          style={{
            left: toPercent(910, 1920),
            top: toPercent(885, 1080),
            color: '#FFF5E6',
            opacity: 0.7,
          }}
        >
          포기하기
        </div>

        {/* 장식 — 이벤트 일러스트 사각형 */}
        <div
          className="absolute rounded-lg pointer-events-none"
          style={{
            left: toPercent(516, 1920),
            top: toPercent(166, 1080),
            width: toPercent(70, 1920),
            height: toPercent(70, 1080),
            backgroundColor: '#2A2A32',
            border: '2px solid #6B9E78',
          }}
        />
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

type InfoTab = 'zindex' | 'palette' | 'phases'

export default function EventLayout() {
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
    grouped['E-5'] = []
    grouped['modal'] = []
    grouped['effect'] = []
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
    { id: 'phases' as InfoTab, label: '이벤트 유형별 정보', icon: '❓' },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-900/40 to-slate-800 p-6 rounded-xl border border-green-700/40">
        <h2 className="text-2xl font-bold text-emerald-400 mb-1">이벤트 화면 UI 레이아웃</h2>
        <p className="text-slate-300 text-sm">
          1920 x 1080 기준 | 비파괴적 오버레이 | Zone A·C 유지 | 유형 4종 (A/B/C/D) |{' '}
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

      {/* 이벤트 유형 범례 */}
      <div className="flex flex-wrap gap-3">
        {EVENT_TYPE_COLORS.map((t) => (
          <div
            key={t.type}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50"
            style={{ border: `1px solid ${t.hex}40` }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.hex }} />
            <span className="text-sm font-medium" style={{ color: t.hex }}>{t.type}</span>
            <span className="text-xs text-slate-400">{t.accent}</span>
          </div>
        ))}
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
              const zoneName = zoneInfo?.name ?? (zone === 'modal' ? '모달' : zone === 'effect' ? '확률 연출' : '결과 화면')
              return (
                <div key={zone} className="mb-4">
                  <div className={`text-xs font-bold mb-1.5 ${style.text}`}>
                    {zone} — {zoneName}
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
          {infoTab === 'phases' && <EventTypeTable />}
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
      <h4 className="text-sm font-bold text-slate-300 mb-3">이벤트 색상 시스템 (--event-* 토큰)</h4>
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

function EventTypeTable() {
  const phases = [
    {
      phase: '이벤트 진입',
      icon: '🚪',
      color: '#4A4A55',
      timing: 'E-1 등장 (0.4s)',
      narration: '타이핑 시작 (3자/프레임)',
      choices: '숨김 (타이핑 완료 후 등장)',
      abandon: '표시 대기',
    },
    {
      phase: '선택 단계',
      icon: '🎴',
      color: '#D4A574',
      timing: '타이핑 완료 → 0.3s 후',
      narration: '완성 상태',
      choices: '슬라이드업 등장 (시차 0.1s)',
      abandon: 'A/C: 표시, B/D: 숨김',
    },
    {
      phase: '확인 (C유형)',
      icon: '⚠',
      color: '#D4985A',
      timing: '리스크 선택지 클릭 시',
      narration: '유지',
      choices: '유지 (배경)',
      abandon: '유지',
    },
    {
      phase: '확률 연출',
      icon: '🎲',
      color: '#FFD700',
      timing: '확인 팝업 [진행] 후',
      narration: '크로스페이드 아웃 중',
      choices: '크로스페이드 아웃 중',
      abandon: '숨김',
    },
    {
      phase: '결과 표시',
      icon: '🏆',
      color: '#6B9E78',
      timing: '크로스페이드 0.45s',
      narration: '결과 나레이션 교체',
      choices: '보상/손실 항목 교체',
      abandon: '"계속" 버튼으로 교체',
    },
  ]

  return (
    <div className="space-y-6">
      {/* 유형별 정보 테이블 */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">이벤트 유형 4종</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-medium">유형</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">HP 리스크</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">포기</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">출현 비율</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">색상 / 톤</th>
              </tr>
            </thead>
            <tbody>
              {EVENT_TYPE_COLORS.map((t) => (
                <tr key={t.type} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.hex }} />
                      <span className="font-medium" style={{ color: t.hex }}>{t.type}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-slate-400">{t.hpRisk}</td>
                  <td className="py-2 px-3 text-slate-400">{t.canAbandon}</td>
                  <td className="py-2 px-3 text-slate-400">{t.ratio}</td>
                  <td className="py-2 px-3">
                    <span className="text-slate-400">{t.accent}</span>
                    <span className="text-slate-500 font-mono ml-2">{t.hex}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 이벤트 진행 페이즈 */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">이벤트 진행 페이즈</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-medium">페이즈</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">타이밍</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">나레이션</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">선택지</th>
                <th className="text-left py-2 px-3 text-slate-400 font-medium">포기/계속</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase) => (
                <tr key={phase.phase} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded flex items-center justify-center text-xs"
                        style={{ backgroundColor: `${phase.color}30`, border: `1px solid ${phase.color}` }}
                      >
                        {phase.icon}
                      </span>
                      <span className="text-slate-200 font-medium">{phase.phase}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-slate-400">{phase.timing}</td>
                  <td className="py-2 px-3 text-slate-400">{phase.narration}</td>
                  <td className="py-2 px-3 text-slate-400">{phase.choices}</td>
                  <td className="py-2 px-3 text-slate-400">{phase.abandon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
