import { useState, useMemo } from 'react'

// --- 타입 정의 ---

interface LayoutComponent {
  id: string
  name: string
  zone: 'A' | 'B' | 'C' | 'overlay'
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
  { id: 'A', name: '상단 HUD', y: 0, h: 60, color: '#D4A574', description: '진행 상황, 자원 표시 (5.6%)' },
  { id: 'B', name: '전투 무대', y: 60, h: 796, color: '#4A90C0', description: '전투 캐릭터, 코인 조작, 이펙트 (73.7%)' },
  { id: 'C', name: '액션 바', y: 856, h: 224, color: '#C05050', description: '스킬 슬롯 (20.7%)' },
] as const

const COMPONENTS: LayoutComponent[] = [
  // Zone A
  { id: 'a1', name: 'A-1 장신구', zone: 'A', x: 32, y: 16, w: 140, h: 28, description: '장신구 슬롯 표시 (최대 3개)', color: '#D4A574', details: { '크기': '28×28px 아이콘', '최대': '3개', '인터랙션': '호버 시 툴팁' } },
  { id: 'a2', name: 'A-2 적 이름', zone: 'A', x: 600, y: 16, w: 200, h: 28, description: '현재 전투 중인 적 이름', color: '#FFF5E6', details: { '폰트': '18px Medium', '색상': '#FFF5E6', '예시': '"고블린"' } },

  { id: 'a3', name: 'A-3 소울 카운터', zone: 'A', x: 1740, y: 20, w: 100, h: 20, description: '소울 재화 표시', color: '#D4A574', details: { '폰트': '20px Bold', '포맷': '"◆ 42"' } },
  { id: 'a4', name: 'A-4 메뉴 버튼', zone: 'A', x: 1868, y: 12, w: 36, h: 36, description: '설정 메뉴 열기', color: '#FFF5E6', details: { '크기': '36x36px (터치 48x48)', '아이콘': '톱니바퀴' } },

  // Zone B — 화면 중앙(x:960) 기준 대칭 배치: B-1(좌) | B-3(중앙) | B-2(우)
  { id: 'b3', name: 'B-3 전투 중앙', zone: 'B', x: 600, y: 60, w: 720, h: 796, description: '이펙트, 페이즈 배너 영역 (화면 중앙 정렬)', color: '#4A4A55', details: { '범위': 'x:600~1320', '중심': 'x:960 (화면 중앙)', '용도': '스킬 이펙트, 턴 배너' } },

  { id: 'b1-sprite', name: 'B-1 플레이어', zone: 'B', x: 340, y: 260, w: 220, h: 330, description: '플레이어 캐릭터 (B-3 좌측)', color: '#4A90C0', details: { '영역': 'x:300~600', '비율': '2:3 세로형', '방향': '우측 ↗' } },
  { id: 'b1-hp', name: 'B-1 HP 바', zone: 'B', x: 340, y: 608, w: 220, h: 18, description: '플레이어 HP 표시', color: '#C05050', details: { 'HP>50%': '#C05050', 'HP<=50%': '#CC3333', 'HP<=25%': '#FF2222 + 펄스' } },
  { id: 'b1-def', name: 'B-1 방어도', zone: 'B', x: 316, y: 596, w: 40, h: 40, description: '방어도 뱃지 (0이면 숨김)', color: '#4A90C0', details: { '배경': '#2A4A6B', '테두리': '#4A90C0 2px' } },
  { id: 'b1-status', name: 'B-1 상태이상', zone: 'B', x: 340, y: 634, w: 264, h: 32, description: '상태 아이콘 행 (최대 8개)', color: '#6B4B8C', details: { '아이콘': '32x32px, 간격 4px', '종류': '독/포자/가시/경화/회피/취약/힘' } },

  { id: 'b2-monster', name: 'B-2 몬스터 (1체)', zone: 'B', x: 1360, y: 250, w: 240, h: 360, description: '몬스터 스프라이트 (B-3 우측)', color: '#C05050', details: { '영역': 'x:1320~1640', '1체': '240x360', '2체': '200x300 x2', '3체': '170x255 x3' } },
  { id: 'b2-intent', name: 'B-2 행동 예고', zone: 'B', x: 1400, y: 208, w: 160, h: 40, description: '몬스터 의도 아이콘 + 수치', color: '#C05050', details: { '1차': '아이콘24x24 + 수치', '미공개': '❓ 회색 물음표', '호버': '확장 툴팁 250x160' } },
  { id: 'b2-hp', name: 'B-2 몬스터 HP', zone: 'B', x: 1370, y: 622, w: 220, h: 14, description: '몬스터 HP 바', color: '#C05050', details: { '채움': '#C05050', '킬 가능': 'KILL 텍스트 + 펄스' } },

  { id: 'b4', name: 'B-4 코인 플립', zone: 'B', x: 660, y: 460, w: 600, h: 300, description: '코인 플립 애니메이션 (화면 중앙)', color: '#FFD700', details: { '코인 크기': '80x80px', '최대': '10개 (2줄)', '중심': 'x:960' } },

  // Zone B — 코인 조작 패널 (B-3 하단 중앙)
  { id: 'b3-1a', name: 'B-3-1a 코인 주머니', zone: 'B', x: 904, y: 600, w: 112, h: 112, description: '코인 주머니 (탭하면 코인 플립)', color: '#FFD700', details: { '크기': '112×112px (56px × scale-2)', '상태': '흔들림 애니메이션 (플립 가능 시)' } },
  { id: 'b3-1b', name: 'B-3-1b 코인 현황', zone: 'B', x: 860, y: 720, w: 200, h: 30, description: '앞면/뒷면 코인 + 남은/전체', color: '#FFD700', details: { '앞면': '☀ #FFD700', '뒷면': '🌙 #C0C0C0', '포맷': '남은: N/전체: M' } },
  { id: 'b3-1c', name: 'B-3-1c 턴 종료', zone: 'B', x: 880, y: 760, w: 160, h: 44, description: '턴 종료 버튼', color: '#4A90C0', details: { '활성': 'gradient blue', '비활성': '"대기 중" 회색', '모양': 'rounded-xl' } },
  { id: 'b6', name: 'B-6 라운드 진행바', zone: 'B', x: 600, y: 65, w: 720, h: 8, description: '라운드 진행바 (Zone B 상단, pill shape)', color: '#D4A574', details: { '노드': '8개 (일반/보스)', '모양': 'pill, pointer-events-none', '상태': '완료/현재/미래' } },

  // Zone C (y:856, h:224) — 스킬 슬롯
  { id: 'c1-1', name: 'C-1 스킬 1', zone: 'C', x: 650, y: 920, w: 140, h: 140, description: '기본 공격 (☀×1, 데미지 3)', color: '#D4A574', details: { '크기': '140x140 (정사각형)', '코스트': '앞면 1', '횟수': '무제한' } },
  { id: 'c1-2', name: 'C-1 스킬 2', zone: 'C', x: 810, y: 920, w: 140, h: 140, description: '기본 방어 (☀×1, 방어 3)', color: '#D4A574', details: { '크기': '140x140 (정사각형)', '코스트': '앞면 1', '횟수': '3회/턴' } },
  { id: 'c1-3', name: 'C-1 스킬 3', zone: 'C', x: 970, y: 920, w: 140, h: 140, description: '투지 (🌙×3, HP 회복 4)', color: '#D4A574', details: { '크기': '140x140 (정사각형)', '코스트': '뒷면 3', '횟수': '1회/턴' } },
  { id: 'c1-4', name: 'C-1 스킬 4', zone: 'C', x: 1130, y: 920, w: 140, h: 140, description: '강공격 (초안)', color: '#D4A574', details: { '크기': '140x140 (정사각형)', '코스트': 'TBD', '상태': 'draft' } },
]

const Z_INDEX_LAYERS = [
  { z: 10, name: '모달', content: '설정 메뉴, 일시정지 화면' },
  { z: 9, name: '툴팁', content: '스킬 프리뷰, 몬스터 상세, 상태 툴팁' },
  { z: 8, name: '타겟 오버레이', content: '대상 지정 모드 (어둡게 + 하이라이트)' },
  { z: 7, name: '데미지 팝업', content: '숫자 떠오름' },
  { z: 6, name: '코인 애니메이션', content: '코인 플립 연출' },
  { z: 5, name: '턴 배너', content: '페이즈 전환 텍스트' },
  { z: 4, name: 'Zone C', content: '액션 바 (스킬 슬롯)' },
  { z: 3, name: '캐릭터 오버레이', content: '선택/호버 이펙트' },
  { z: 2, name: '전투 UI', content: 'HP바, 방어도, 상태 아이콘, 행동 예고' },
  { z: 1, name: '캐릭터 스프라이트', content: '플레이어, 몬스터 일러스트' },
  { z: 0, name: '배경', content: '전투 배경 이미지 + 어둡기 오버레이' },
]

const COLOR_PALETTE = [
  { name: 'Card BG Start', hex: '#1E1E24', token: '--bg-dark' },
  { name: 'Card BG End', hex: '#2A2A32', token: '--bg-medium' },
  { name: 'Card Border', hex: '#4A4A55', token: '--border' },
  { name: 'Panel BG', hex: '#16161C', token: '--bg-darkest' },
  { name: 'Text Primary', hex: '#FFF5E6', token: '--text-primary' },
  { name: 'Accent', hex: '#D4A574', token: '--text-secondary' },
  { name: 'HP Red', hex: '#C05050', token: '--hp-high' },
  { name: 'Defense Blue', hex: '#4A90C0', token: '--defense' },
  { name: 'Coin Gold', hex: '#FFD700', token: '--coin-heads' },
  { name: 'Coin Silver', hex: '#C0C0C0', token: '--coin-tails' },
  { name: 'Damage', hex: '#FF4444', token: '--damage' },
  { name: 'Heal', hex: '#44CC44', token: '--heal' },
]

const STATUS_COLORS = [
  { name: '독 (Poison)', hex: '#4A7A2E', icon: '💀' },
  { name: '포자 (Spore)', hex: '#6B4B8C', icon: '🍄' },
  { name: '가시 (Thorns)', hex: '#2E6B5A', icon: '🌿' },
  { name: '경화 (Hardening)', hex: '#5A5F6B', icon: '🪨' },
  { name: '회피 (Evasion)', hex: '#4A7AC0', icon: '💨' },
  { name: '취약 (Vulnerable)', hex: '#8B4049', icon: '🔥' },
  { name: '힘 (Strength)', hex: '#C05050', icon: '⚔' },
]

// --- 존 색상 맵 ---
const ZONE_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  A: { border: 'border-amber-500/60', bg: 'bg-amber-500/5', text: 'text-amber-400' },
  B: { border: 'border-blue-500/60', bg: 'bg-blue-500/5', text: 'text-blue-400' },
  C: { border: 'border-red-500/60', bg: 'bg-red-500/5', text: 'text-red-400' },
  overlay: { border: 'border-purple-500/60', bg: 'bg-purple-500/5', text: 'text-purple-400' },
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

        {/* 존 영역 표시 */}
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
            <span
              className={`absolute top-1 left-2 text-[10px] font-bold opacity-60 ${ZONE_COLORS[zone.id].text}`}
            >
              Zone {zone.id}
            </span>
          </div>
        ))}

        {/* 존 구분선 */}
        <div className="absolute w-full h-px" style={{ top: toPercent(60, 1080), backgroundColor: '#4A4A55' }} />
        <div className="absolute w-full h-px" style={{ top: toPercent(800, 1080), backgroundColor: '#4A4A55' }} />

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
                {comp.name.replace(/^[A-C]-\d+\s*/, '')}
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

        {/* 장식 — Zone A: 적 이름 */}
        <div
          className="absolute text-[8px] font-medium pointer-events-none select-none"
          style={{ left: toPercent(640, 1920), top: toPercent(22, 1080), color: '#FFF5E6' }}
        >
          고블린
        </div>

        {/* 장식 — 라운드 진행바 노드 (Zone B 상단) */}
        <div
          className="absolute flex items-center gap-[0.4%] pointer-events-none"
          style={{ left: toPercent(720, 1920), top: toPercent(67, 1080) }}
        >
          {['#4A4A55', '#4A4A55', '#D4A574', '#2A2A32', '#2A2A32', '#2A2A32', '#2A2A32', '#8B0000'].map(
            (fill, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === 7 ? 8 : 6,
                  height: i === 7 ? 8 : 6,
                  backgroundColor: fill,
                  border: i === 2 ? '1px solid #FFF5E6' : i === 7 ? '1px solid #8B0000' : '1px solid #4A4A5580',
                  boxShadow: i === 2 ? '0 0 4px #D4A574' : 'none',
                }}
              />
            ),
          )}
        </div>

        {/* 장식 요소 — 코인 플립 */}
        <div
          className="absolute flex items-center gap-[0.5%] pointer-events-none"
          style={{ left: toPercent(820, 1920), top: toPercent(590, 1080) }}
        >
          {['#FFD700', '#FFD700', '#FFD700', '#C0C0C0', '#C0C0C0'].map((fill, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{ width: 14, height: 14, backgroundColor: fill, border: '1px solid #00000040' }}
            />
          ))}
        </div>

        {/* 장식 — 플레이어 HP 바 채움 */}
        <div
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: toPercent(341, 1920),
            top: toPercent(609, 1080),
            width: toPercent(140, 1920),
            height: toPercent(16, 1080),
            backgroundColor: '#C05050',
          }}
        />
        <div
          className="absolute text-[7px] font-bold pointer-events-none select-none"
          style={{ left: toPercent(420, 1920), top: toPercent(608, 1080), color: '#FFF5E6' }}
        >
          45/70
        </div>

        {/* 장식 — 몬스터 HP 바 채움 */}
        <div
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: toPercent(1371, 1920),
            top: toPercent(623, 1080),
            width: toPercent(145, 1920),
            height: toPercent(12, 1080),
            backgroundColor: '#C05050',
          }}
        />
        <div
          className="absolute text-[6px] font-bold pointer-events-none select-none"
          style={{ left: toPercent(1450, 1920), top: toPercent(622, 1080), color: '#FFF5E6' }}
        >
          12/18
        </div>

        {/* 장식 — 코인 현황 (Zone B 중앙) */}
        <div
          className="absolute flex items-center justify-center gap-[0.8%] pointer-events-none"
          style={{ left: toPercent(910, 1920), top: toPercent(730, 1080) }}
        >
          <div className="flex items-center gap-1">
            <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: '#FFD700' }} />
            <span className="text-[8px] font-bold" style={{ color: '#FFD700' }}>3</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: '#C0C0C0' }} />
            <span className="text-[8px] font-bold" style={{ color: '#C0C0C0' }}>2</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentDetail({ component }: { component: LayoutComponent }) {
  const zoneInfo = ZONES.find((z) => z.id === component.zone)
  const zoneStyle = ZONE_COLORS[component.zone]

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

type InfoTab = 'zindex' | 'palette' | 'phases'

export default function BattleLayout() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [infoTab, setInfoTab] = useState<InfoTab>('zindex')

  const selectedData = useMemo(
    () => COMPONENTS.find((c) => c.id === selectedComponent) ?? null,
    [selectedComponent],
  )

  const componentsByZone = useMemo(() => {
    const grouped: Record<string, LayoutComponent[]> = { A: [], B: [], C: [] }
    for (const comp of COMPONENTS) {
      if (comp.zone in grouped) {
        grouped[comp.zone].push(comp)
      }
    }
    return grouped
  }, [])

  const infoTabs = [
    { id: 'zindex' as InfoTab, label: 'Z-Index 레이어', icon: '📐' },
    { id: 'palette' as InfoTab, label: '색상 팔레트', icon: '🎨' },
    { id: 'phases' as InfoTab, label: '턴 페이즈', icon: '🔄' },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-800 p-6 rounded-xl border border-blue-700/40">
        <h2 className="text-2xl font-bold text-emerald-400 mb-1">배틀씬 UI 레이아웃</h2>
        <p className="text-slate-300 text-sm">
          1920 x 1080 기준 | v4.0 Dark Frame Edition |{' '}
          <span className="text-slate-400">컴포넌트를 클릭하면 상세 정보를 확인할 수 있습니다</span>
        </p>
      </div>

      {/* 존 범례 */}
      <div className="flex flex-wrap gap-4">
        {ZONES.map((zone) => {
          const style = ZONE_COLORS[zone.id]
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
              const style = ZONE_COLORS[zone]
              return (
                <div key={zone} className="mb-4">
                  <div className={`text-xs font-bold mb-1.5 ${style.text}`}>
                    Zone {zone} — {ZONES.find((z) => z.id === zone)?.name}
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
          {infoTab === 'phases' && <PhaseTable />}
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
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">배경 / 프레임 / UI</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {COLOR_PALETTE.map((c) => (
            <div key={c.hex} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
              <div className="w-full h-8 rounded mb-2 border border-slate-600/30" style={{ backgroundColor: c.hex }} />
              <div className="text-xs text-slate-200 font-medium truncate">{c.name}</div>
              <div className="text-xs text-slate-400 font-mono">{c.hex}</div>
              <div className="text-[10px] text-slate-500">{c.token}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">상태 이상</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {STATUS_COLORS.map((s) => (
            <div key={s.hex} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 text-center">
              <div
                className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-lg border border-slate-600/30"
                style={{ backgroundColor: s.hex }}
              >
                {s.icon}
              </div>
              <div className="text-xs text-slate-200 truncate">{s.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">{s.hex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PhaseTable() {
  const phases = [
    {
      name: '턴 시작',
      icon: '⏳',
      color: '#4A4A55',
      skillCards: '비활성',
      endTurn: '비활성',
      coinDisplay: '포자 경고 가능',
      special: '독 데미지 처리, 상태 이상 펄스',
    },
    {
      name: '코인 플립',
      icon: '🪙',
      color: '#D4A574',
      skillCards: '비활성',
      endTurn: '비활성',
      coinDisplay: '결과 대기 → 업데이트',
      special: '코인 애니메이션 (B-4 영역)',
    },
    {
      name: '플레이어 페이즈',
      icon: '⚡',
      color: '#4A90C0',
      skillCards: '사용 가능 → 활성',
      endTurn: '활성',
      coinDisplay: '실시간 업데이트',
      special: '스킬 프리뷰 3단계, 몬스터 의도 표시',
    },
    {
      name: '몬스터 페이즈',
      icon: '💀',
      color: '#C05050',
      skillCards: '비활성 (70%)',
      endTurn: '비활성 "대기 중"',
      coinDisplay: '변화 없음',
      special: '몬스터 공격 애니메이션, 데미지 팝업',
    },
    {
      name: '턴 종료',
      icon: '🔚',
      color: '#4A4A55',
      skillCards: '리셋',
      endTurn: '비활성',
      coinDisplay: '0으로 리셋',
      special: '방어도 소멸, 턴 종료 배너',
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-3 text-slate-400 font-medium">페이즈</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">스킬 카드</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">턴 종료</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">코인 현황</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">특이사항</th>
          </tr>
        </thead>
        <tbody>
          {phases.map((phase) => (
            <tr key={phase.name} className="border-b border-slate-700/50 hover:bg-slate-700/20">
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs"
                    style={{ backgroundColor: `${phase.color}30`, border: `1px solid ${phase.color}` }}
                  >
                    {phase.icon}
                  </span>
                  <span className="text-slate-200 font-medium">{phase.name}</span>
                </div>
              </td>
              <td className="py-2 px-3 text-slate-400">{phase.skillCards}</td>
              <td className="py-2 px-3 text-slate-400">{phase.endTurn}</td>
              <td className="py-2 px-3 text-slate-400">{phase.coinDisplay}</td>
              <td className="py-2 px-3 text-slate-400">{phase.special}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
