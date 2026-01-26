import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': '대시보드',
  '/skills': '스킬 편집기',
  '/docs': '디자인 문서 편집기',
  '/assets': '에셋 갤러리',
}

export default function Header() {
  const location = useLocation()

  const getPageTitle = () => {
    const basePath = '/' + location.pathname.split('/')[1]
    return pageTitles[basePath] || '페이지'
  }

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </span>
      </div>
    </header>
  )
}
