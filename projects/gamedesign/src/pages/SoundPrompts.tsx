import { useState, useMemo } from 'react'
import { SOUND_PROMPT_EXAMPLES, type SoundCategory, type SoundPromptExample } from '../data/soundPromptExamples'

const CATEGORY_CONFIG: Record<SoundCategory, { label: string; icon: string; color: string; activeClass: string; textClass: string }> = {
  bgm: {
    label: 'BGM',
    icon: '🎵',
    color: 'violet',
    activeClass: 'bg-violet-600 text-white shadow-lg shadow-violet-900/50',
    textClass: 'text-violet-400',
  },
  sfx: {
    label: 'SFX',
    icon: '🔊',
    color: 'cyan',
    activeClass: 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50',
    textClass: 'text-cyan-400',
  },
  ambient: {
    label: 'Ambient',
    icon: '🌿',
    color: 'teal',
    activeClass: 'bg-teal-600 text-white shadow-lg shadow-teal-900/50',
    textClass: 'text-teal-400',
  },
}

const TOOL_BADGE: Record<string, { label: string; className: string }> = {
  suno: { label: 'Suno AI', className: 'bg-violet-900/60 text-violet-300 border border-violet-700/50' },
  udio: { label: 'Udio AI', className: 'bg-blue-900/60 text-blue-300 border border-blue-700/50' },
  elevenlabs: { label: 'ElevenLabs', className: 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50' },
  generic: { label: 'Generic', className: 'bg-slate-700 text-slate-300 border border-slate-600' },
}

export default function SoundPrompts() {
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>('bgm')
  const [selectedTool, setSelectedTool] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string>(SOUND_PROMPT_EXAMPLES.bgm[0]?.id ?? '')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCategoryChange = (cat: SoundCategory) => {
    setSelectedCategory(cat)
    setSelectedTool('all')
    const first = SOUND_PROMPT_EXAMPLES[cat][0]
    setSelectedId(first?.id ?? '')
  }

  const availableTools = useMemo(() => {
    const tools = new Set(SOUND_PROMPT_EXAMPLES[selectedCategory].map(e => e.tool))
    return Array.from(tools)
  }, [selectedCategory])

  const filteredExamples = useMemo(() => {
    let examples = SOUND_PROMPT_EXAMPLES[selectedCategory]
    if (selectedTool !== 'all') {
      examples = examples.filter(e => e.tool === selectedTool)
    }
    return examples
  }, [selectedCategory, selectedTool])

  const groupedExamples = useMemo(() => {
    const groups = new Map<string, SoundPromptExample[]>()
    filteredExamples.forEach(example => {
      const group = example.group
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group)!.push(example)
    })
    return groups
  }, [filteredExamples])

  const currentExample = useMemo(() => {
    const all = SOUND_PROMPT_EXAMPLES[selectedCategory]
    return all.find(e => e.id === selectedId) ?? filteredExamples[0] ?? null
  }, [selectedCategory, selectedId, filteredExamples])

  const stats = useMemo(() => ({
    bgm: SOUND_PROMPT_EXAMPLES.bgm.length,
    sfx: SOUND_PROMPT_EXAMPLES.sfx.length,
    ambient: SOUND_PROMPT_EXAMPLES.ambient.length,
    total: Object.values(SOUND_PROMPT_EXAMPLES).reduce((sum, arr) => sum + arr.length, 0),
  }), [])

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const copyPromptOnly = () => {
    if (!currentExample) return
    copyToClipboard(currentExample.prompt, 'prompt')
  }

  const copyWithMetadata = () => {
    if (!currentExample) return
    const lines = [
      `[${currentExample.category.toUpperCase()}] ${currentExample.name} (${currentExample.nameEn})`,
      `Tool: ${TOOL_BADGE[currentExample.tool].label}`,
      currentExample.bpm != null ? `BPM: ${currentExample.bpm}` : null,
      currentExample.duration ? `Duration: ${currentExample.duration}` : null,
      currentExample.mood ? `Mood: ${currentExample.mood}` : null,
      currentExample.reference ? `Reference: ${currentExample.reference}` : null,
      `Tags: ${currentExample.tags.join(', ')}`,
      '',
      '--- Prompt ---',
      currentExample.prompt,
    ].filter(Boolean).join('\n')
    copyToClipboard(lines, 'meta')
  }

  const catConfig = CATEGORY_CONFIG[selectedCategory]

  return (
    <div className="space-y-6">
      {/* ── 페이지 헤더 ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-violet-400">사운드 프롬프트</h1>
        <p className="text-slate-400 text-sm mt-1">
          AI 음악/효과음 생성 도구(Suno, ElevenLabs 등)에 사용할 프롬프트 라이브러리입니다.
        </p>
        <p className="text-amber-400 text-xs mt-2">
          BGM {stats.bgm}종 | SFX {stats.sfx}종 | Ambient {stats.ambient}종 = <strong>총 {stats.total}종</strong>
        </p>
      </div>

      {/* ── 카테고리 필터 ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_CONFIG) as SoundCategory[]).map(cat => {
          const cfg = CATEGORY_CONFIG[cat]
          const count = SOUND_PROMPT_EXAMPLES[cat].length
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat ? cfg.activeClass : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="mr-1.5">{cfg.icon}</span>
              {cfg.label}
              <span className="ml-1.5 text-xs opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      {/* ── 도구 필터 ───────────────────────────────────────────── */}
      {availableTools.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">도구:</span>
          <button
            onClick={() => setSelectedTool('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              selectedTool === 'all' ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            전체
          </button>
          {availableTools.map(tool => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedTool === tool ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {TOOL_BADGE[tool].label}
            </button>
          ))}
        </div>
      )}

      {/* ── 그룹별 프롬프트 선택 ────────────────────────────────── */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className={`text-lg font-semibold ${catConfig.textClass} mb-4`}>
          {catConfig.icon} {catConfig.label} 프롬프트
        </h3>

        {filteredExamples.length === 0 ? (
          <p className="text-slate-500 text-sm">해당 필터에 맞는 프롬프트가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {Array.from(groupedExamples.entries()).map(([group, examples]) => (
              <div key={group}>
                <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {examples.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedId(ex.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedId === ex.id
                          ? 'bg-slate-600 text-white ring-2 ring-slate-400'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {ex.name}
                      <span className="text-slate-500 ml-1 text-xs">({ex.nameEn})</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 선택된 프롬프트 상세 ────────────────────────────────── */}
      {currentExample && (
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className={`text-lg font-semibold ${catConfig.textClass}`}>
              {currentExample.name}
            </h3>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
              {currentExample.nameEn}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${TOOL_BADGE[currentExample.tool].className}`}>
              {TOOL_BADGE[currentExample.tool].label}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentExample.bpm != null && (
              <MetaItem label="BPM" value={String(currentExample.bpm)} />
            )}
            {currentExample.duration && (
              <MetaItem label="Duration" value={currentExample.duration} />
            )}
            {currentExample.mood && (
              <MetaItem label="Mood" value={currentExample.mood} />
            )}
            <MetaItem label="Category" value={`${catConfig.icon} ${catConfig.label}`} />
            <MetaItem label="Subcategory" value={currentExample.subcategory} />
            {currentExample.reference && (
              <MetaItem label="Reference" value={currentExample.reference} />
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {currentExample.tags.map(tag => (
              <span
                key={tag}
                className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h4 className={`font-medium ${catConfig.textClass} mb-2`}>프롬프트 (Prompt)</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto font-mono">
              {currentExample.prompt}
            </pre>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyPromptOnly}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                copiedField === 'prompt'
                  ? 'bg-green-700 text-white'
                  : 'bg-violet-700 hover:bg-violet-600 text-white'
              }`}
            >
              {copiedField === 'prompt' ? '복사됨 ✓' : '프롬프트 복사'}
            </button>
            <button
              onClick={copyWithMetadata}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                copiedField === 'meta'
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {copiedField === 'meta' ? '복사됨 ✓' : '메타데이터 포함 복사'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 rounded-lg px-3 py-2">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-sm text-slate-300">{value}</div>
    </div>
  )
}
