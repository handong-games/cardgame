import { useState } from 'react'
import BattleLayout from './BattleLayout'
import ShopLayout from './ShopLayout'
import EventLayout from './EventLayout'

// --- 탭 정의 ---

type LayoutTab = 'battle' | 'shop' | 'event'

const TABS: { id: LayoutTab; label: string; icon: string; description: string }[] = [
  { id: 'battle', label: '배틀씬', icon: '⚔️', description: '전투 화면 UI 레이아웃' },
  { id: 'shop', label: '상점', icon: '🛒', description: '상점 화면 UI 레이아웃' },
  { id: 'event', label: '이벤트', icon: '❓', description: '이벤트 화면 UI 레이아웃' },
]

// --- 메인 컴포넌트 ---

export default function Layouts() {
  const [activeTab, setActiveTab] = useState<LayoutTab>('battle')

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-slate-700 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-lg text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'bg-slate-800 text-emerald-400 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'battle' && <BattleLayout />}
      {activeTab === 'shop' && <ShopLayout />}
      {activeTab === 'event' && <EventLayout />}
    </div>
  )
}
