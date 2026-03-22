import { useMemo, useState } from 'react'

interface LayoutComponent {
  id: string
  name: string
  zone: 'player' | 'monster' | 'overlay'
  x: number
  y: number
  w: number
  h: number
  color: string
  description: string
  details?: Record<string, string>
}

type InfoTab = 'spec' | 'palette' | 'state' | 'checklist'

type InternalSpec = {
  title: string
  tone: 'rose' | 'amber' | 'violet' | 'sky'
  size: string
  ratio: string
  placement: string
  note: string
}

const COMPONENTS: LayoutComponent[] = [
  {
    id: 'player-top',
    name: '플레이어 상단 지표',
    zone: 'player',
    x: 184,
    y: 164,
    w: 188,
    h: 36,
    color: '#E8B4B8',
    description: 'HP와 방어도를 카드 상단 외곽 좌측에 배치',
    details: {
      위치: '카드 상단 외곽 좌측',
      내용: '♥ 70, 🛡 5',
      규칙: '캐릭터 카드는 인텐트 없이 생존 정보만 표시',
    },
  },
  {
    id: 'player-card',
    name: '플레이어 카드 프레임',
    zone: 'player',
    x: 180,
    y: 206,
    w: 240,
    h: 360,
    color: '#E8B4B8',
    description: '2:3 세로형 메인 카드. 클래스 보석톤 프레임을 CSS로 렌더링',
    details: {
      표시크기: '240x360',
      비율: '2:3 세로형',
      프레임: '3~5px, 10px radius',
      그림자: 'rgba(58,48,64,0.3) blur 8px offset-y 4px',
    },
  },
  {
    id: 'player-portrait',
    name: '플레이어 초상화 영역',
    zone: 'player',
    x: 194,
    y: 222,
    w: 212,
    h: 260,
    color: '#F0E8D8',
    description: '가슴 중앙 크롭, 정중앙 배치, headroom 10~15%',
    details: {
      점유율: '카드 면적의 85~90%',
      크롭: 'mid-chest upward',
      방향: '우측 3/4 각도',
      배경: '#F0E8D8',
    },
  },
  {
    id: 'player-ribbon',
    name: '플레이어 리본 네임플레이트',
    zone: 'player',
    x: 204,
    y: 500,
    w: 192,
    h: 48,
    color: '#F0E8D8',
    description: '카드 위 유일한 ON-card UI. 이름만 표시하는 양피지 리본',
    details: {
      높이: '카드 높이의 13~15%',
      텍스트: '전사',
      텍스트색: '#3A3040',
      규칙: '이름 외 정보는 카드 밖으로 분리',
    },
  },
  {
    id: 'player-status',
    name: '플레이어 상태이상 행',
    zone: 'player',
    x: 194,
    y: 580,
    w: 220,
    h: 34,
    color: '#A0C8B0',
    description: '카드 하단 외부에 상태이상 아이콘과 스택 수를 배치',
    details: {
      위치: '카드 하단 외부',
      형태: '원형 아이콘 + 스택 수',
      예시: '독2, 경화1',
    },
  },
  {
    id: 'monster-top',
    name: '몬스터 상단 지표',
    zone: 'monster',
    x: 1448,
    y: 164,
    w: 188,
    h: 36,
    color: '#C8B888',
    description: '몬스터는 인텐트와 HP를 카드 상단 외곽에 배치',
    details: {
      위치: '카드 상단 외곽 좌측',
      내용: '⚔ 6, ♥ 18',
      규칙: '행동 예고가 캐릭터보다 우선',
    },
  },
  {
    id: 'monster-main-card',
    name: '몬스터 메인 카드',
    zone: 'monster',
    x: 1340,
    y: 206,
    w: 240,
    h: 360,
    color: '#C8B888',
    description: '최고 Tier 몬스터를 메인 카드로 표시',
    details: {
      표시크기: '240x360',
      티어색: 'T2 예시 #C8B888',
      프레임외곽선: '3~5px / 10px radius / Tier 색상',
      내부몬스터: '약 92x118, 좌측 3/4 각도, 중앙 정렬',
      규칙: '메인 몬스터 1체는 항상 풀사이즈',
    },
  },
  {
    id: 'monster-ribbon',
    name: '몬스터 리본 네임플레이트',
    zone: 'monster',
    x: 1350,
    y: 500,
    w: 192,
    h: 48,
    color: '#F0E8D8',
    description: '몬스터 이름을 카드 하단 리본으로 표시',
    details: {
      텍스트: '골렘',
      규격: '200x44',
      배경: '#F0E8D8',
      규칙: '상세 능력은 툴팁으로 이동',
    },
  },
  {
    id: 'monster-status',
    name: '몬스터 상태이상 행',
    zone: 'monster',
    x: 1348,
    y: 580,
    w: 220,
    h: 34,
    color: '#B8A0D0',
    description: '하단 외부에 속성 아이콘과 스택 표시',
    details: {
      위치: '카드 하단 외부',
      예시: '가시2, 포자1',
      규칙: '좌우 일렬, 카드 바깥 유지',
    },
  },
  {
    id: 'monster-sub-card',
    name: '몬스터 서브 카드',
    zone: 'monster',
    x: 1602,
    y: 296,
    w: 180,
    h: 270,
    color: '#B8B8C8',
    description: '멀티 몬스터 시 75% 축소된 서브 카드',
    details: {
      표시크기: '180x270',
      비율: '메인의 75%',
      정렬: '메인 카드 하단선 기준',
      내부몬스터: '약 72x90',
      네임플레이트: '142x36 축소형 리본',
    },
  },
  {
    id: 'tooltip',
    name: '사이드 툴팁',
    zone: 'overlay',
    x: 1090,
    y: 260,
    w: 220,
    h: 180,
    color: '#F0E8D8',
    description: '호버 시 클래스/속성/패턴을 보여주는 양피지 툴팁',
    details: {
      트리거: '카드 호버',
      위치: '캐릭터 카드 우측 / 몬스터 카드 좌측',
      내용: '클래스명, 속성 태그, 스킬/패턴 요약',
    },
  },
]

const ZONE_STYLES = {
  player: { label: '플레이어 레인', text: 'text-rose-300', border: 'border-rose-500/40', bg: 'bg-rose-500/5' },
  monster: { label: '몬스터 레인', text: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-500/5' },
  overlay: { label: '호버 / 보조 정보', text: 'text-violet-300', border: 'border-violet-500/40', bg: 'bg-violet-500/5' },
} as const

const FRAME_COLORS = [
  { name: 'Warrior Frame', hex: '#E8B4B8', token: '전사' },
  { name: 'Mage Frame', hex: '#B8A0D0', token: '마법사' },
  { name: 'Rogue Frame', hex: '#A0C8B0', token: '도적' },
  { name: 'Monster T1', hex: '#B8B8C8', token: '일반' },
  { name: 'Monster T2', hex: '#C8B888', token: '정예' },
  { name: 'Monster T3', hex: '#C89098', token: '보스' },
  { name: 'Parchment', hex: '#F0E8D8', token: '리본/배경' },
  { name: 'Name Text', hex: '#3A3040', token: '네임플레이트' },
]

const CARD_STATES = [
  { name: '기본', motion: '정위치', duration: '-', note: '카드 대치 상태 유지' },
  { name: '선택/활성', motion: '위로 8px 상승', duration: '150ms ease-out', note: '포커스 카드 강조' },
  { name: '피격', motion: '좌우 흔들림 + 빨간 플래시', duration: '200ms', note: '대미지 전달 우선' },
  { name: '사망', motion: '회색화 + 30도 기울기 + 페이드아웃', duration: '500ms', note: '전장 이탈 표현' },
]

const SUMMARY_CARDS = [
  {
    title: '전장 대치 구도',
    value: '좌 1 : 우 1+서브',
    tone: 'rose',
    detail: '플레이어 카드와 몬스터 카드가 배틀씬 중앙 레인을 사이에 두고 마주 본다.',
  },
  {
    title: '핵심 정보 위계',
    value: '상단 지표 / 카드 본체 / 하단 상태',
    tone: 'sky',
    detail: '전투 판단에 필요한 HP, 방어도, 인텐트, 상태이상을 카드 주변으로 분리한다.',
  },
  {
    title: '카드 본체 규격',
    value: '240x360 · 2:3',
    tone: 'amber',
    detail: '초상화 85~90%, 리본 네임플레이트 13~15% 비중으로 설계한다.',
  },
  {
    title: '멀티 몬스터 대응',
    value: '서브 180x270',
    tone: 'violet',
    detail: '최고 Tier 메인 + 75% 축소 서브 카드로 위협도를 빠르게 읽는다.',
  },
]

const BATTLE_NOTES = [
  {
    title: '플레이어 카드 레인',
    items: ['좌측 고정 배치', 'HP/방어도는 좌상단 외곽', '상태이상은 카드 하단 외부'],
  },
  {
    title: '몬스터 카드 레인',
    items: ['우측 대치 배치', '인텐트 우선 노출', 'Tier에 따라 프레임 색과 서브 카드로 위협도 구분'],
  },
  {
    title: '중앙 전장 간격',
    items: ['카드끼리 붙지 않음', '공격 이펙트가 지나갈 공간 확보', '툴팁과 서브 카드가 겹치지 않도록 안전 여백 유지'],
  },
]

const CHECKLIST_ITEMS = [
  '상단 지표만 봐도 생존/위협 정보가 즉시 읽히는가?',
  '카드 내부에는 bust portrait와 이름만 남아 정보 밀도가 안정적인가?',
  '서브 몬스터 카드가 메인보다 한 단계 뒤로 읽히는가?',
  '상태이상 아이콘이 카드 하단 외부에서 충돌 없이 유지되는가?',
  '호버 툴팁이 전장 중심부를 가리지 않고 보조 정보만 제공하는가?',
]

const INTERNAL_SPECS: InternalSpec[] = [
  {
    title: '메인 카드 초상화 창',
    tone: 'rose',
    size: '216 x 288',
    ratio: '카드 내 inset 12px',
    placement: '240x360 카드 중앙, 상단 headroom 10~15%',
    note: '프레임과 초상화 사이에 숨 쉴 여백을 남기는 기준 창',
  },
  {
    title: '플레이어 bust 규격',
    tone: 'sky',
    size: '96 x 122',
    ratio: '창 대비 약 44% x 42%',
    placement: '정중앙, 우측 3/4 각도, 가슴 중앙 크롭',
    note: '무기나 헤어 실루엣이 읽히되 네임플레이트 영역은 침범하지 않음',
  },
  {
    title: '몬스터 bust 규격',
    tone: 'amber',
    size: '92 x 118',
    ratio: '창 대비 약 43% x 41%',
    placement: '정중앙, 좌측 3/4 각도, 얼굴과 어깨 실루엣 우선',
    note: '위협 정보는 외곽 UI가 담당하고 카드 내부는 형태 인지에 집중',
  },
  {
    title: '서브 몬스터 창',
    tone: 'violet',
    size: '150 x 194',
    ratio: '170x255 카드 inset 10px',
    placement: '메인 하단선 정렬, 내부 몬스터 72x90 기준',
    note: '메인 카드보다 한 단계 뒤로 읽히도록 압축된 내부 규격 사용',
  },
]

const TEXT_LAYOUT_RULES = [
  ['상단 외곽', 'HP / 방어도 / 인텐트', '전투 중 즉시 판단해야 할 수치'],
  ['중앙 창', '초상화 실루엣', '클래스/몬스터 정체성 인지'],
  ['하단 리본', '이름 1줄', '텍스트는 중앙 정렬, 리본 높이 13~15%'],
  ['하단 외부', '상태이상 아이콘', '네임플레이트와 분리해 밀도 관리'],
]

function getToneClasses(tone: string) {
  switch (tone) {
    case 'rose':
      return 'border-rose-500/30 bg-rose-500/10 text-rose-200'
    case 'sky':
      return 'border-sky-500/30 bg-sky-500/10 text-sky-200'
    case 'amber':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-200'
    default:
      return 'border-violet-500/30 bg-violet-500/10 text-violet-200'
  }
}

function CardFramePreview({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const toPercent = (value: number, base: number) => `${(value / base) * 100}%`

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_top,#23324d_0%,#121c2f_42%,#090f1d_100%)]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-white/6 to-transparent" />
      <div className="absolute inset-x-[21%] top-[26%] h-[42%] rounded-[999px] bg-cyan-300/6 blur-3xl" />
      <div className="absolute inset-x-[26%] top-[75%] h-[20%] rounded-full bg-slate-950/45 blur-2xl" />
      <div className="absolute left-[8%] top-[16%] h-[48%] w-[17%] rounded-[40px] bg-rose-300/6 blur-2xl" />
      <div className="absolute right-[8%] top-[16%] h-[48%] w-[17%] rounded-[40px] bg-amber-200/6 blur-2xl" />

      <div className="absolute left-[4%] top-[4%] rounded-full border border-slate-500/40 bg-slate-950/35 px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-slate-300">
        BATTLE CARD FRAME PREVIEW
      </div>
      <div className="absolute right-[4%] top-[4%] flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        1920 x 1080 전투 기준
      </div>

      <div className="absolute left-[8.8%] top-[11.4%] text-xs font-semibold tracking-[0.3em] text-rose-200/80">PLAYER LANE</div>
      <div className="absolute left-[45.2%] top-[11.4%] text-xs font-semibold tracking-[0.3em] text-cyan-200/70">BATTLE GAP</div>
      <div className="absolute right-[8.6%] top-[11.4%] text-xs font-semibold tracking-[0.3em] text-amber-100/80">MONSTER LANE</div>

      <div className="absolute left-[7.6%] top-[15.5%] rounded-2xl border border-rose-500/20 bg-slate-950/20 px-3 py-2 text-[11px] text-slate-300 backdrop-blur-sm">
        좌측 카드 = 플레이어 식별 레인
      </div>
      <div className="absolute right-[7.4%] top-[15.5%] rounded-2xl border border-amber-500/20 bg-slate-950/20 px-3 py-2 text-[11px] text-slate-300 backdrop-blur-sm">
        우측 카드 = 위협 정보 레인
      </div>

      <div className="absolute left-[27%] top-[28%] h-[1px] w-[46%] bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />
      <div className="absolute left-[27%] top-[67%] h-[1px] w-[46%] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
      <div className="absolute left-[49.9%] top-[22%] h-[50%] w-[1px] bg-gradient-to-b from-transparent via-cyan-200/35 to-transparent" />

      <PlayerCardVisual />
      <MonsterCardVisual />
      <TooltipVisual />
      <BattleAnnotation />

      {COMPONENTS.map((component) => {
        const active = selected === component.id || hovered === component.id
        return (
          <button
            key={component.id}
            type="button"
            onClick={() => onSelect(selected === component.id ? null : component.id)}
            onMouseEnter={() => setHovered(component.id)}
            onMouseLeave={() => setHovered(null)}
            className="absolute rounded-lg border-2 transition-all"
            style={{
              left: toPercent(component.x, 1920),
              top: toPercent(component.y, 1080),
              width: toPercent(component.w, 1920),
              height: toPercent(component.h, 1080),
              borderColor: active ? component.color : `${component.color}80`,
              backgroundColor: active ? `${component.color}18` : 'transparent',
              boxShadow: active ? `0 0 0 1px ${component.color}, 0 0 20px ${component.color}55` : 'none',
            }}
          >
            <span className="sr-only">{component.name}</span>
          </button>
        )
      })}
    </div>
  )
}

function BattleAnnotation() {
  return (
    <>
      <div className="absolute left-[39%] top-[77%] rounded-full border border-slate-500/30 bg-slate-950/35 px-4 py-1 text-[11px] text-slate-300">
        상태이상 / 네임플레이트 / 툴팁이 전투 의사결정을 방해하지 않도록 주변부에 정리
      </div>
      <div className="absolute left-[45.5%] top-[37%] rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-[11px] text-cyan-100">
        이펙트와 시선 흐름이 지나는 중앙 전장
      </div>
    </>
  )
}

function PlayerCardVisual() {
  return (
    <>
      <div className="absolute left-[9.6%] top-[15.5%] flex items-center gap-2 text-sm font-semibold text-rose-200">
        <span>♥ 70</span>
        <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-sky-200">🛡 5</span>
      </div>
      <div className="absolute left-[9.4%] top-[19.1%] h-[33.3%] w-[12.5%] rounded-[12px] border-[4px] border-[#E8B4B8] bg-slate-950/80 shadow-[0_8px_24px_rgba(58,48,64,0.3)]">
        <div className="absolute inset-[12px] rounded-[8px] bg-[#F0E8D8]" />
        <div className="absolute left-[28%] top-[18%] h-[40%] w-[44%] rounded-full border-2 border-[#3A3040]/50 bg-[#E8B4B8]/60" />
        <div className="absolute left-[32%] top-[33%] h-[26%] w-[36%] rounded-t-[40px] bg-[#A96A72]/70" />
        <div className="absolute bottom-[18px] left-[14px] h-[28px] w-[22px] rounded-l-[10px] border border-r-0 border-[#d8cdb8] bg-[#e7dcc7] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08)]" />
        <div className="absolute bottom-[18px] right-[14px] h-[28px] w-[22px] rounded-r-[10px] border border-l-0 border-[#d8cdb8] bg-[#e7dcc7] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08)]" />
        <div className="absolute bottom-[18px] left-[20px] right-[20px] h-[48px] rounded-[10px] border border-[#d8cdb8] bg-[#F0E8D8] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08),0_-1px_0_rgba(255,255,255,0.35)]">
          <div className="flex h-full items-center justify-center text-sm font-bold text-[#3A3040]">전사</div>
        </div>
      </div>
      <div className="absolute left-[10.1%] top-[53.7%] flex gap-2 text-xs text-emerald-200">
        <span className="rounded-full bg-emerald-500/20 px-2 py-1">독 2</span>
        <span className="rounded-full bg-slate-500/20 px-2 py-1">경화 1</span>
      </div>
    </>
  )
}

function MonsterCardVisual() {
  return (
    <>
      <div className="absolute right-[14.8%] top-[15.5%] flex items-center gap-2 text-sm font-semibold text-amber-100">
        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-200">⚔ 6</span>
        <span>♥ 18</span>
      </div>
      <div className="absolute right-[17.7%] top-[19.1%] h-[33.3%] w-[12.5%] rounded-[12px] border-[4px] border-[#C8B888] bg-slate-950/80 shadow-[0_8px_24px_rgba(58,48,64,0.3)]">
        <div className="absolute inset-[12px] rounded-[8px] bg-[#F0E8D8]" />
        <div className="absolute left-[27%] top-[19%] h-[38%] w-[46%] rounded-full border-2 border-[#3A3040]/40 bg-[#8B8B78]/55" />
        <div className="absolute left-[31%] top-[33%] h-[28%] w-[38%] rounded-t-[32px] bg-[#76805F]/70" />
        <div className="absolute bottom-[18px] left-[14px] h-[28px] w-[22px] rounded-l-[10px] border border-r-0 border-[#d8cdb8] bg-[#e7dcc7] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08)]" />
        <div className="absolute bottom-[18px] right-[14px] h-[28px] w-[22px] rounded-r-[10px] border border-l-0 border-[#d8cdb8] bg-[#e7dcc7] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08)]" />
        <div className="absolute bottom-[18px] left-[20px] right-[20px] h-[48px] rounded-[10px] border border-[#d8cdb8] bg-[#F0E8D8] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08),0_-1px_0_rgba(255,255,255,0.35)]">
          <div className="flex h-full items-center justify-center text-sm font-bold text-[#3A3040]">골렘</div>
        </div>
      </div>
      <div className="absolute right-[7.2%] top-[27.4%] h-[25%] w-[9.4%] rounded-[12px] border-[3px] border-[#B8B8C8] bg-slate-950/75 shadow-[0_6px_18px_rgba(58,48,64,0.25)]">
        <div className="absolute inset-[10px] rounded-[8px] bg-[#F0E8D8]" />
        <div className="absolute left-[26%] top-[24%] h-[30%] w-[48%] rounded-full bg-[#A8A8B8]/60" />
        <div className="absolute bottom-[14px] left-[10px] h-[20px] w-[16px] rounded-l-[8px] border border-r-0 border-[#d8cdb8] bg-[#e7dcc7]" />
        <div className="absolute bottom-[14px] right-[10px] h-[20px] w-[16px] rounded-r-[8px] border border-l-0 border-[#d8cdb8] bg-[#e7dcc7]" />
        <div className="absolute bottom-[14px] left-[14px] right-[14px] h-[36px] rounded-[8px] border border-[#d8cdb8] bg-[#F0E8D8] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08)]">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#3A3040]">고블린</div>
        </div>
      </div>
      <div className="absolute right-[18.2%] top-[53.7%] flex gap-2 text-xs text-violet-200">
        <span className="rounded-full bg-violet-500/20 px-2 py-1">포자 1</span>
        <span className="rounded-full bg-emerald-500/20 px-2 py-1">가시 2</span>
      </div>
    </>
  )
}

function TooltipVisual() {
  return (
    <div className="absolute left-[56.8%] top-[24%] h-[16.7%] w-[11.5%] rounded-xl border border-amber-200/40 bg-[#F0E8D8]/95 p-3 text-left shadow-xl">
      <div className="text-xs font-bold text-[#3A3040]">호버 툴팁</div>
      <div className="mt-2 space-y-1 text-[11px] text-[#6A6070]">
        <div>클래스/속성 태그</div>
        <div>핵심 스킬 또는 행동 패턴</div>
        <div>약점 및 특수 규칙</div>
      </div>
    </div>
  )
}

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {SUMMARY_CARDS.map((card) => (
        <div key={card.title} className={`rounded-xl border p-4 ${getToneClasses(card.tone)}`}>
          <div className="text-xs font-semibold tracking-wide opacity-80">{card.title}</div>
          <div className="mt-2 text-lg font-bold text-slate-50">{card.value}</div>
          <div className="mt-2 text-sm text-slate-300">{card.detail}</div>
        </div>
      ))}
    </div>
  )
}

function InternalSpecCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {INTERNAL_SPECS.map((spec) => (
        <div key={spec.title} className={`rounded-xl border p-4 ${getToneClasses(spec.tone)}`}>
          <div className="text-xs font-semibold tracking-wide opacity-80">{spec.title}</div>
          <div className="mt-2 font-mono text-xl font-bold text-slate-50">{spec.size}</div>
          <div className="mt-1 text-xs text-slate-300">{spec.ratio}</div>
          <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/25 px-3 py-2 text-sm text-slate-200">
            {spec.placement}
          </div>
          <div className="mt-2 text-sm text-slate-300">{spec.note}</div>
        </div>
      ))}
    </div>
  )
}

function InternalWireGuide() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="lg:w-[320px]">
          <div className="text-sm font-bold text-slate-100">카드 내부 규격 가이드</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            카드 내부는 초상화 창, bust 실루엣, 하단 리본이 서로 침범하지 않도록 분리한다. 이름은 리본 1줄로 고정하고, 상단 수치 정보는 프레임 위쪽으로 올려 카드 안을 비워 둔다.
          </p>
          <div className="mt-4 rounded-lg border border-slate-700/70 bg-slate-900/40 p-3 text-sm text-slate-300">
            핵심: `216x288` 내부 창 안에서 인물/몬스터 실루엣을 읽히게 하고, `200x44` 네임플레이트는 하단에서 시선 정리 역할만 한다.
          </div>
        </div>

        <div className="flex-1 rounded-xl border border-slate-700/70 bg-slate-900/45 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-[0.24em] text-slate-400">PLAYER CARD INTERNAL GRID</div>
            <div className="text-xs font-mono text-emerald-300">240 x 360</div>
          </div>

          <div className="relative mx-auto mt-4 h-[360px] w-[240px] rounded-[14px] border border-rose-300/30 bg-[#171a23] shadow-[0_12px_28px_rgba(15,23,42,0.35)]">
            <div className="absolute inset-[12px] rounded-[10px] border border-dashed border-slate-500/60" />
            <div className="absolute left-[12px] top-[12px] h-[288px] w-[216px] rounded-[10px] border border-sky-300/60 bg-[#F0E8D8]/95">
              <div className="absolute inset-x-0 top-[8%] text-center text-[10px] font-semibold tracking-[0.16em] text-slate-500">HEADROOM 10~15%</div>
              <div className="absolute left-1/2 top-[24%] h-[122px] w-[96px] -translate-x-1/2 rounded-[46px_46px_12px_12px] border border-rose-400/40 bg-rose-300/35" />
              <div className="absolute inset-x-0 top-[57%] border-t border-dashed border-slate-400/60" />
              <div className="absolute right-[8px] top-[10px] rounded bg-slate-950/50 px-2 py-1 text-[10px] text-sky-200">초상화 창 216x288</div>
              <div className="absolute left-[10px] bottom-[10px] rounded bg-slate-950/50 px-2 py-1 text-[10px] text-rose-200">bust 96x122</div>
            </div>
            <div className="absolute left-[20px] bottom-[18px] h-[44px] w-[200px] rounded-[10px] border border-[#d8cdb8] bg-[#F0E8D8] shadow-[inset_0_-2px_0_rgba(58,48,64,0.08)]">
              <div className="flex h-full items-center justify-center text-xs font-bold text-[#3A3040]">네임플레이트 200x44</div>
            </div>
            <div className="absolute -left-[72px] top-[24px] rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 text-[10px] text-slate-300">상단 외곽: HP / 방어도</div>
            <div className="absolute left-[248px] top-[130px] rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 text-[10px] text-slate-300">중앙: bust 실루엣</div>
            <div className="absolute left-[248px] bottom-[26px] rounded-lg border border-slate-700 bg-slate-900/90 px-2 py-1 text-[10px] text-slate-300">하단: 이름 1줄</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TextLayoutTable() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-5">
      <div className="text-sm font-bold text-slate-100">텍스트와 배치 원칙</div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-3 py-2 text-left font-medium text-slate-400">영역</th>
              <th className="px-3 py-2 text-left font-medium text-slate-400">배치 요소</th>
              <th className="px-3 py-2 text-left font-medium text-slate-400">배치 이유</th>
            </tr>
          </thead>
          <tbody>
            {TEXT_LAYOUT_RULES.map(([zone, element, reason]) => (
              <tr key={zone} className="border-b border-slate-700/50 align-top">
                <td className="px-3 py-2 font-medium text-slate-200">{zone}</td>
                <td className="px-3 py-2 text-slate-300">{element}</td>
                <td className="px-3 py-2 text-slate-400">{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BattleNotes() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {BATTLE_NOTES.map((note) => (
        <div key={note.title} className="rounded-xl border border-slate-700 bg-slate-800/80 p-4">
          <div className="text-sm font-bold text-slate-100">{note.title}</div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            {note.items.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ComponentDetail({ component }: { component: LayoutComponent }) {
  const zoneStyle = ZONE_STYLES[component.zone]

  return (
    <div className={`rounded-xl border p-4 ${zoneStyle.border} ${zoneStyle.bg}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className={`text-xs font-semibold ${zoneStyle.text}`}>{zoneStyle.label}</div>
          <h3 className="mt-1 text-lg font-bold text-slate-100">{component.name}</h3>
          <p className="mt-2 text-sm text-slate-300">{component.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <div className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">좌표</div>
            <div className="mt-1 font-mono text-emerald-300">{component.x}, {component.y}</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">크기</div>
            <div className="mt-1 font-mono text-emerald-300">{component.w} x {component.h}</div>
          </div>
        </div>
      </div>

      {component.details && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(component.details).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{key}</div>
              <div className="mt-1 text-sm leading-6 text-slate-200">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SpecTable() {
  const rows = [
    ['생성 해상도', '512x768', 'AI 초상화 생성 규격'],
    ['메인 카드', '240x360', '전투 화면 표준 크기'],
    ['서브 카드', '180x270', '메인의 75%'],
    ['프레임 두께', '3~5px', 'CSS 프로그래매틱'],
    ['네임플레이트', '13~15%', '이름만 표시'],
    ['초상화 점유율', '85~90%', '풀 블리드 우선'],
    ['headroom', '10~15%', '머리 위 여백'],
    ['정보 분리', '상단/하단 외곽', '전투 정보는 카드 밖으로 배치'],
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-3 py-2 text-left font-medium text-slate-400">항목</th>
            <th className="px-3 py-2 text-left font-medium text-slate-400">값</th>
            <th className="px-3 py-2 text-left font-medium text-slate-400">설명</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value, note]) => (
            <tr key={name} className="border-b border-slate-700/50">
              <td className="px-3 py-2 text-slate-200">{name}</td>
              <td className="px-3 py-2 font-mono text-emerald-300">{value}</td>
              <td className="px-3 py-2 text-slate-400">{note}</td>
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
        <h4 className="mb-3 text-sm font-bold text-slate-300">클래스 / Tier 프레임</h4>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          {FRAME_COLORS.map((color) => (
            <div key={color.name} className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-3">
              <div className="mb-2 h-10 w-full rounded border border-slate-700/50" style={{ backgroundColor: color.hex }} />
              <div className="text-xs font-medium text-slate-200">{color.name}</div>
              <div className="text-[11px] font-mono text-slate-400">{color.hex}</div>
              <div className="text-[10px] text-slate-500">{color.token}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StateTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-3 py-2 text-left font-medium text-slate-400">상태</th>
            <th className="px-3 py-2 text-left font-medium text-slate-400">표현</th>
            <th className="px-3 py-2 text-left font-medium text-slate-400">시간</th>
            <th className="px-3 py-2 text-left font-medium text-slate-400">의도</th>
          </tr>
        </thead>
        <tbody>
          {CARD_STATES.map((state) => (
            <tr key={state.name} className="border-b border-slate-700/50">
              <td className="px-3 py-2 text-slate-200">{state.name}</td>
              <td className="px-3 py-2 text-slate-300">{state.motion}</td>
              <td className="px-3 py-2 font-mono text-emerald-300">{state.duration}</td>
              <td className="px-3 py-2 text-slate-400">{state.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChecklistPanel() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {CHECKLIST_ITEMS.map((item) => (
        <div key={item} className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-3 text-sm text-slate-300">
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
            <span>{item}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CardFrameLayout() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>('player-card')
  const [infoTab, setInfoTab] = useState<InfoTab>('spec')

  const selectedData = useMemo(
    () => COMPONENTS.find((component) => component.id === selectedComponent) ?? null,
    [selectedComponent],
  )

  const groupedComponents = useMemo(() => {
    const grouped: Record<LayoutComponent['zone'], LayoutComponent[]> = {
      player: [],
      monster: [],
      overlay: [],
    }

    for (const component of COMPONENTS) {
      grouped[component.zone].push(component)
    }

    return grouped
  }, [])

  const tabs = [
    { id: 'spec' as InfoTab, label: '치수 규격', icon: '📏' },
    { id: 'palette' as InfoTab, label: '프레임 색상', icon: '🎨' },
    { id: 'state' as InfoTab, label: '카드 상태', icon: '✨' },
    { id: 'checklist' as InfoTab, label: '전투 체크리스트', icon: '🧭' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-700/30 bg-gradient-to-r from-blue-950/40 via-slate-800 to-rose-950/30 p-6">
        <h2 className="text-2xl font-bold text-emerald-400">캐릭터/몬스터 카드 프레임 UI 레이아웃</h2>
        <p className="mt-1 text-sm text-slate-300">
          `docs/설계도/카드-UI-레이아웃-v6.md` 기준. 배틀씬 대치 구도 안에서 카드 프레임, 외곽 지표, 상태이상, 툴팁까지 한 화면에서 읽히도록 정리합니다.
        </p>
      </div>

      <SummaryCards />
      <InternalSpecCards />

      <div className="flex flex-wrap gap-3">
        {(Object.keys(ZONE_STYLES) as Array<LayoutComponent['zone']>).map((zone) => {
          const style = ZONE_STYLES[zone]
          return (
            <div key={zone} className={`rounded-lg border px-3 py-2 text-sm ${style.border} ${style.bg}`}>
              <span className={`font-semibold ${style.text}`}>{style.label}</span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-3 space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <CardFramePreview selected={selectedComponent} onSelect={setSelectedComponent} />
          </div>
          <InternalWireGuide />
          {selectedData && <ComponentDetail component={selectedData} />}
          <TextLayoutTable />
          <BattleNotes />
        </div>

        <div className="xl:col-span-1">
          <div className="max-h-[920px] space-y-4 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 p-4">
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-300">구성 요소 ({COMPONENTS.length}개)</h3>
              {(Object.keys(groupedComponents) as Array<LayoutComponent['zone']>).map((zone) => {
                const style = ZONE_STYLES[zone]
                return (
                  <div key={zone} className="mb-4">
                    <div className={`mb-1.5 text-xs font-bold ${style.text}`}>{style.label}</div>
                    <div className="space-y-1">
                      {groupedComponents[zone].map((component) => (
                        <button
                          key={component.id}
                          type="button"
                          onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
                          className={`w-full rounded border px-2.5 py-2 text-left text-xs transition-colors ${
                            selectedComponent === component.id
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                              : 'border-transparent text-slate-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: component.color }} />
                            <span className="truncate">{component.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
              <div className="text-sm font-bold text-slate-200">빠른 판독 원칙</div>
              <div className="mt-3 space-y-2 text-sm text-slate-400">
                <div>상단: 생존/위협 정보</div>
                <div>중앙: bust portrait와 프레임 정체성</div>
                <div>하단: 이름과 상태이상 정리</div>
                <div>측면: 상세 툴팁과 서브 카드</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800">
        <div className="flex gap-1 border-b border-slate-700 px-4 pt-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setInfoTab(tab.id)}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                infoTab === tab.id
                  ? 'border-x border-t border-slate-600 bg-slate-700 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {infoTab === 'spec' && <SpecTable />}
          {infoTab === 'palette' && <PaletteGrid />}
          {infoTab === 'state' && <StateTable />}
          {infoTab === 'checklist' && <ChecklistPanel />}
        </div>
      </div>
    </div>
  )
}
