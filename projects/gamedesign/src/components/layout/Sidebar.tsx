import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: '대시보드', href: '/', icon: '📊' },
  { name: '프롬프트 라이브러리', href: '/prompts', icon: '✨' },
  { name: '사운드 프롬프트', href: '/sounds', icon: '🎵' },
  { name: 'UI 레이아웃', href: '/layouts', icon: '🗺️' },
  { name: '디자인 문서', href: '/docs', icon: '📄' },
  { name: '에셋 갤러리', href: '/assets', icon: '🖼️' },
  { name: '가이드', href: '/guide', icon: '📚' },
]

export default function Sidebar() {
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-emerald-400">Game Design</h1>
        <p className="text-sm text-slate-400">이미지 생성 관리 도구</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">
          <p>경로: projects/gamedesign</p>
          <p>버전: 1.0.0</p>
        </div>
      </div>
    </aside>
  )
}
