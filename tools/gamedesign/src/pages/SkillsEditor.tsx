import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSkillStore } from '../store/useSkillStore'
import MarkdownEditor from '../components/editor/MarkdownEditor'

const skillDescriptions: Record<string, string> = {
  'gen-character': '캐릭터 카드 이미지 생성을 위한 프롬프트 템플릿',
  'gen-monster': '몬스터 카드 이미지 생성을 위한 프롬프트 템플릿',
  'gen-background': '배경 이미지 생성을 위한 프롬프트 템플릿',
}

export default function SkillsEditor() {
  const { name } = useParams<{ name?: string }>()
  const {
    skills,
    currentSkill,
    isLoading,
    error,
    isDirty,
    editedContent,
    loadSkills,
    loadSkill,
    setEditedContent,
    save,
    resetChanges,
  } = useSkillStore()

  useEffect(() => {
    loadSkills()
  }, [loadSkills])

  useEffect(() => {
    if (name) {
      loadSkill(name)
    }
  }, [name, loadSkill])

  const handleSave = async () => {
    await save()
  }

  if (!name) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">이미지 생성 스킬 목록</h3>
          <p className="text-slate-400 text-sm mb-6">
            아래 스킬 파일들을 선택하여 편집할 수 있습니다. 각 스킬은 AI 이미지 생성에 사용되는 프롬프트 템플릿을 정의합니다.
          </p>
        </div>

        {isLoading && <p className="text-slate-400">로딩 중...</p>}

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {skills.map((skill) => (
            <Link
              key={skill.name}
              to={`/skills/${skill.name}`}
              className="block p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-emerald-400">
                    {skill.filename}
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    {skillDescriptions[skill.name] || '설명 없음'}
                  </p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>{(skill.size / 1024).toFixed(1)} KB</p>
                  <p>{new Date(skill.modified).toLocaleDateString('ko-KR')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            to="/skills"
            className="text-slate-400 hover:text-white transition-colors"
          >
            &larr; 목록으로
          </Link>
          <h3 className="text-lg font-medium">
            {name}.md
            {isDirty && <span className="text-amber-400 ml-2">*</span>}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <button
              onClick={resetChanges}
              className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              변경 취소
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || isLoading}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              isDirty && !isLoading
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isLoading && !currentSkill ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          로딩 중...
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <MarkdownEditor
            value={editedContent}
            onChange={setEditedContent}
            height={window.innerHeight - 220}
          />
        </div>
      )}
    </div>
  )
}
