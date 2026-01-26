import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import SkillsEditor from './pages/SkillsEditor'
import DocsEditor from './pages/DocsEditor'
import AssetGallery from './pages/AssetGallery'
import Guide from './pages/Guide'

export default function App() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/skills" element={<SkillsEditor />} />
            <Route path="/skills/:name" element={<SkillsEditor />} />
            <Route path="/docs" element={<DocsEditor />} />
            <Route path="/docs/*" element={<DocsEditor />} />
            <Route path="/assets" element={<AssetGallery />} />
            <Route path="/assets/:category" element={<AssetGallery />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
