import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import DocsEditor from './pages/DocsEditor'
import AssetGallery from './pages/AssetGallery'
import Guide from './pages/Guide'
import PromptLibrary from './pages/PromptLibrary'
import SoundPrompts from './pages/SoundPrompts'
import Layouts from './pages/Layouts'

export default function App() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/docs" element={<DocsEditor />} />
            <Route path="/docs/*" element={<DocsEditor />} />
            <Route path="/assets" element={<AssetGallery />} />
            <Route path="/assets/:category" element={<AssetGallery />} />
            <Route path="/prompts" element={<PromptLibrary />} />
            <Route path="/sounds" element={<SoundPrompts />} />
            <Route path="/layouts" element={<Layouts />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
