import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PROMPT_EXAMPLES, type ExampleCategory, type PromptExample } from '../data/promptExamples'
import { useGenerateStore, type PromptSelection } from '../store/useGenerateStore'

type TabType = 'library' | 'generate'

/** 카테고리 한국어 라벨 */
const CATEGORY_LABELS: Record<ExampleCategory, string> = {
  frame: '프레임',
  character: '캐릭터',
  companion: '동료',
  forest: '숲 몬스터',
  dungeon: '던전 몬스터',
  castle: '성 몬스터',
  background: '배경',
  ui: 'UI 에셋',
}

export default function PromptLibrary() {
  const [activeTab, setActiveTab] = useState<TabType>('library')

  const tabs = [
    { id: 'library' as TabType, label: '프롬프트 라이브러리', icon: '📚' },
    { id: 'generate' as TabType, label: '이미지 생성', icon: '🚀' },
  ]

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-emerald-400">프롬프트 라이브러리</h1>
        <p className="text-slate-400 text-sm mt-1">
          게임 에셋 이미지 생성을 위한 프롬프트를 관리하고, n8n 워크플로우를 통해 이미지를 생성합니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-slate-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'library' && <PromptExamples />}
      {activeTab === 'generate' && <ImageGenerator />}
    </div>
  )
}

/** 프롬프트 라이브러리 — 카테고리별 프롬프트 탐색 및 복사 */
function PromptExamples() {
  const [selectedCategory, setSelectedCategory] = useState<ExampleCategory>('frame')
  const [selectedExample, setSelectedExample] = useState<string>('frame-player')

  const categories = [
    { id: 'frame' as ExampleCategory, label: '프레임', icon: '🖼️', color: 'amber' },
    { id: 'character' as ExampleCategory, label: '캐릭터', icon: '🦸', color: 'emerald' },
    { id: 'companion' as ExampleCategory, label: '동료', icon: '🐾', color: 'lime' },
    { id: 'forest' as ExampleCategory, label: '숲', icon: '🌲', color: 'green' },
    { id: 'dungeon' as ExampleCategory, label: '던전', icon: '💀', color: 'gray' },
    { id: 'castle' as ExampleCategory, label: '성', icon: '🏰', color: 'red' },
    { id: 'background' as ExampleCategory, label: '배경', icon: '🖼️', color: 'purple' },
    { id: 'ui' as ExampleCategory, label: 'UI', icon: '⚙️', color: 'blue' },
  ]

  // 그룹별로 예시를 분류
  const groupedExamples = useMemo(() => {
    const examples = PROMPT_EXAMPLES[selectedCategory]
    const groups = new Map<string, PromptExample[]>()
    
    examples.forEach(example => {
      const group = example.group || '기본'
      if (!groups.has(group)) {
        groups.set(group, [])
      }
      groups.get(group)!.push(example)
    })
    
    return groups
  }, [selectedCategory])

  const currentExamples = PROMPT_EXAMPLES[selectedCategory]
  const currentExample = currentExamples.find(e => e.id === selectedExample) || currentExamples[0]

  const handleCategoryChange = (category: ExampleCategory) => {
    setSelectedCategory(category)
    setSelectedExample(PROMPT_EXAMPLES[category][0].id)
  }

  const getCategoryColor = (category: ExampleCategory) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'slate'
  }

  // 통계 계산
  const stats = useMemo(() => {
    return {
      frame: PROMPT_EXAMPLES.frame.length,
      character: PROMPT_EXAMPLES.character.length,
      companion: PROMPT_EXAMPLES.companion.length,
      forest: PROMPT_EXAMPLES.forest.length,
      dungeon: PROMPT_EXAMPLES.dungeon.length,
      castle: PROMPT_EXAMPLES.castle.length,
      background: PROMPT_EXAMPLES.background.length,
      ui: PROMPT_EXAMPLES.ui.length,
      total: Object.values(PROMPT_EXAMPLES).reduce((sum, arr) => sum + arr.length, 0)
    }
  }, [])

  return (
    <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-emerald-400 mb-4">실전 프롬프트 라이브러리</h3>
      <p className="text-slate-300 text-sm mb-2">
        게임의 모든 에셋에 대한 복사-붙여넣기 가능한 프롬프트입니다.
      </p>
      <p className="text-amber-400 text-xs mb-6">
        프레임 {stats.frame}종 | 캐릭터 {stats.character}종 | 동료 {stats.companion}종 | 숲 {stats.forest}종 | 던전 {stats.dungeon}종 | 성 {stats.castle}종 | 배경 {stats.background}종 | UI {stats.ui}종 = <strong>총 {stats.total}종</strong>
      </p>

      {/* 카테고리 선택 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => {
          const colorMap: Record<string, string> = {
            amber: 'bg-amber-600 shadow-amber-900/50',
            emerald: 'bg-emerald-600 shadow-emerald-900/50',
            lime: 'bg-lime-600 shadow-lime-900/50',
            blue: 'bg-blue-600 shadow-blue-900/50',
            green: 'bg-green-600 shadow-green-900/50',
            gray: 'bg-gray-600 shadow-gray-900/50',
            red: 'bg-red-600 shadow-red-900/50',
            purple: 'bg-purple-600 shadow-purple-900/50',
          }
          const activeClass = colorMap[cat.color] || 'bg-blue-600 shadow-blue-900/50'
          const count = PROMPT_EXAMPLES[cat.id].length
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? `${activeClass} text-white shadow-lg`
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
              <span className="ml-1 text-xs opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {/* 그룹별 에셋 선택 */}
      <div className="mb-6 pb-4 border-b border-slate-700">
        {Array.from(groupedExamples.entries()).map(([group, examples]) => (
          <div key={group} className="mb-3">
            <div className="text-xs text-slate-500 mb-1.5">{group}</div>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => setSelectedExample(example.id)}
                  className={`px-3 py-1.5 rounded text-sm transition-all ${
                    selectedExample === example.id
                      ? 'bg-slate-600 text-white ring-2 ring-slate-400'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {example.name}
                  <span className="text-slate-500 ml-1 text-xs">({example.nameEn})</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 프롬프트 표시 */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-medium ${
              {
                amber: 'text-amber-400',
                emerald: 'text-emerald-400',
                lime: 'text-lime-400',
                blue: 'text-blue-400',
                green: 'text-green-400',
                gray: 'text-gray-400',
                red: 'text-red-400',
                purple: 'text-purple-400',
              }[getCategoryColor(selectedCategory)] || 'text-blue-400'
            }`}>
              프롬프트 (Prompt)
            </h4>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
              {currentExample.name} - {currentExample.nameEn}
              {currentExample.group && <span className="ml-1 text-amber-500">({currentExample.group})</span>}
            </span>
          </div>
          <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
            {currentExample.prompt}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-red-400 mb-2">네거티브 프롬프트 (Negative)</h4>
          <pre className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg text-sm text-red-200 overflow-x-auto whitespace-pre-wrap">
            {currentExample.negative}
          </pre>
        </div>
      </div>

      {/* 복사 버튼 */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigator.clipboard.writeText(currentExample.prompt)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
        >
          프롬프트 복사
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(currentExample.negative)}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
        >
          네거티브 복사
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(`${currentExample.prompt}\n\n--negative\n${currentExample.negative}`)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
        >
          전체 복사
        </button>
      </div>
    </section>
  )
}

/** 이미지 생성 — 프롬프트 선택 -> 편집 -> n8n 워크플로우를 통한 생성 */
function ImageGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<ExampleCategory>('character')
  const {
    selectedPrompt,
    editedPrompt,
    editedNegative,
    isGenerating,
    lastResult,
    error,
    history,
    removeBg,
    dryRun,
    selectPrompt,
    setEditedPrompt,
    setEditedNegative,
    resetToOriginal,
    setRemoveBg,
    setDryRun,
    generate,
  } = useGenerateStore()

  const examples = PROMPT_EXAMPLES[selectedCategory]

  const groups = useMemo(() => {
    const map = new Map<string, PromptExample[]>()
    for (const ex of examples) {
      const key = ex.group || '기본'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(ex)
    }
    return map
  }, [examples])

  const isPromptModified = selectedPrompt ? editedPrompt !== selectedPrompt.prompt : false
  const isNegativeModified = selectedPrompt ? editedNegative !== selectedPrompt.negative : false

  const handleSelectPrompt = (example: PromptExample) => {
    const selection: PromptSelection = {
      id: example.id,
      name: example.name,
      nameEn: example.nameEn,
      category: selectedCategory,
      group: example.group,
      prompt: example.prompt,
      negative: example.negative,
    }
    selectPrompt(selection)
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">이미지 생성 요청</h2>
        <p className="text-slate-400 text-sm">
          프롬프트 라이브러리에서 프롬프트를 선택하고, n8n 워크플로우를 통해 이미지를 생성합니다.
          배경 제거 후 에셋 갤러리에 자동 저장됩니다.
        </p>
      </section>

      {/* 카테고리 선택 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-3">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as ExampleCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {CATEGORY_LABELS[cat]}
              <span className="ml-1 text-xs opacity-60">({PROMPT_EXAMPLES[cat].length})</span>
            </button>
          ))}
        </div>
      </section>

      {/* 프롬프트 선택 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-3">프롬프트 선택</h3>
        <div className="space-y-4">
          {Array.from(groups.entries()).map(([groupName, items]) => (
            <div key={groupName}>
              <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{groupName}</h4>
              <div className="flex flex-wrap gap-2">
                {items.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectPrompt(ex)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedPrompt?.id === ex.id
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {ex.name}
                    <span className="ml-1 text-xs opacity-50">({ex.nameEn})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 프롬프트 편집 */}
      {selectedPrompt && (
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">
              프롬프트 편집 — <span className="text-emerald-400">{selectedPrompt.name}</span>
            </h3>
            <div className="flex items-center gap-3">
              {(isPromptModified || isNegativeModified) && (
                <span className="text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded">수정됨</span>
              )}
              <button
                onClick={resetToOriginal}
                disabled={!isPromptModified && !isNegativeModified}
                className="text-xs px-3 py-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                원본으로 복원
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-emerald-400 mb-1 block">
                프롬프트 {isPromptModified && <span className="text-amber-400">(수정됨 → override 전송)</span>}
              </label>
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                rows={8}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono focus:outline-none focus:border-emerald-500 resize-y"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-red-400 mb-1 block">
                네거티브 프롬프트 {isNegativeModified && <span className="text-amber-400">(수정됨)</span>}
              </label>
              <textarea
                value={editedNegative}
                onChange={(e) => setEditedNegative(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono focus:outline-none focus:border-emerald-500 resize-y"
              />
            </div>
          </div>
        </section>
      )}

      {/* 생성 옵션 + 버튼 */}
      {selectedPrompt && (
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeBg}
                  onChange={(e) => setRemoveBg(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
                배경 제거
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
                />
                Dry Run (프롬프트만 확인)
              </label>
            </div>

            <button
              onClick={generate}
              disabled={isGenerating}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isGenerating
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : dryRun
                    ? 'bg-amber-600 text-white hover:bg-amber-500'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  이미지 생성 중...
                </span>
              ) : dryRun ? (
                'Dry Run'
              ) : (
                '이미지 생성 요청'
              )}
            </button>
          </div>
        </section>
      )}

      {/* 생성 결과 */}
      {lastResult && (
        <section className={`rounded-xl p-6 border ${
          lastResult.status === 'success'
            ? 'bg-emerald-900/20 border-emerald-700/50'
            : 'bg-red-900/20 border-red-700/50'
        }`}>
          {lastResult.status === 'success' ? (
            <div className="space-y-3">
              <h3 className="text-emerald-400 font-medium flex items-center gap-2">
                이미지 생성 완료!
              </h3>
              {lastResult.files_saved?.map((file, i) => (
                <div key={i} className="bg-slate-900/50 rounded-lg p-4 text-sm">
                  <p className="text-slate-300">
                    <span className="text-slate-500">파일:</span> {file.path}
                  </p>
                  {file.size_bytes && (
                    <p className="text-slate-400 text-xs mt-1">
                      크기: {(file.size_bytes / 1024).toFixed(1)}KB
                      {file.dimensions && ` | 해상도: ${file.dimensions}`}
                    </p>
                  )}
                </div>
              ))}
              {lastResult.generation_time_ms && (
                <p className="text-slate-500 text-xs">소요시간: {(lastResult.generation_time_ms / 1000).toFixed(1)}초</p>
              )}
              <Link
                to="/assets"
                className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 mt-2"
              >
                에셋 갤러리에서 보기 →
              </Link>
            </div>
          ) : (
            <div>
              <h3 className="text-red-400 font-medium flex items-center gap-2">
                생성 실패
              </h3>
              <p className="text-red-300 text-sm mt-2">{error || lastResult.error}</p>
            </div>
          )}
        </section>
      )}

      {error && !lastResult && (
        <section className="bg-red-900/20 rounded-xl p-6 border border-red-700/50">
          <h3 className="text-red-400 font-medium flex items-center gap-2">
            오류 발생
          </h3>
          <p className="text-red-300 text-sm mt-2">{error}</p>
        </section>
      )}

      {/* 생성 이력 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-3">생성 이력 (이번 세션)</h3>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">아직 생성 이력이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-700">
                  <th className="pb-2 pr-4">이름</th>
                  <th className="pb-2 pr-4">상태</th>
                  <th className="pb-2 pr-4">소요시간</th>
                  <th className="pb-2">시각</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-2 pr-4 text-slate-300">{entry.entityName}</td>
                    <td className="py-2 pr-4">
                      {entry.status === 'success' ? (
                        <span className="text-emerald-400">성공</span>
                      ) : (
                        <span className="text-red-400">실패</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-slate-400">
                      {entry.generation_time_ms ? `${(entry.generation_time_ms / 1000).toFixed(1)}s` : '-'}
                    </td>
                    <td className="py-2 text-slate-500">
                      {new Date(entry.requestedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
