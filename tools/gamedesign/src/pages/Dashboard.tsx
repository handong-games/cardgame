import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSkills, fetchDocTree, fetchAllAssets, type SkillInfo, type DocTreeNode } from '../lib/api'

interface Stats {
  skills: SkillInfo[]
  docCount: number
  assetCount: number
  assetCategories: Record<string, number>
}

function countDocs(nodes: DocTreeNode[]): number {
  let count = 0
  for (const node of nodes) {
    if (node.type === 'file') {
      count++
    } else if (node.children) {
      count += countDocs(node.children)
    }
  }
  return count
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const [skills, docTree, assetsData] = await Promise.all([
          fetchSkills(),
          fetchDocTree(),
          fetchAllAssets(),
        ])

        const assetCategories: Record<string, number> = {}
        for (const asset of assetsData.assets) {
          assetCategories[asset.category] = (assetCategories[asset.category] || 0) + 1
        }

        setStats({
          skills,
          docCount: countDocs(docTree),
          assetCount: assetsData.total,
          assetCategories,
        })
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        로딩 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (!stats) return null

  const categoryLabels: Record<string, string> = {
    backgrounds: '배경',
    characters: '캐릭터',
    monsters: '몬스터',
    'ui/frames': 'UI/프레임',
    'ui/coins': 'UI/코인',
    'ui/icons': 'UI/아이콘',
    'ui/buttons': 'UI/버튼',
  }

  return (
    <div className="space-y-8">
      {/* 소개 */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-slate-800 p-6 rounded-xl border border-emerald-700/50">
        <h3 className="text-xl font-bold text-emerald-400 mb-2">
          Game Design Manager
        </h3>
        <p className="text-slate-300">
          이미지 생성 스킬, 디자인 문서, 에셋을 관리하는 통합 도구입니다.
          왼쪽 메뉴에서 편집하고 싶은 항목을 선택하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 스킬 카드 */}
        <Link
          to="/skills"
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🎨</span>
            <span className="text-3xl font-bold text-emerald-400">
              {stats.skills.length}
            </span>
          </div>
          <h4 className="text-lg font-medium group-hover:text-emerald-400 transition-colors">
            이미지 생성 스킬
          </h4>
          <p className="text-sm text-slate-400 mt-1">
            AI 이미지 생성 프롬프트 템플릿
          </p>
          <div className="mt-4 space-y-1">
            {stats.skills.map((skill) => (
              <div key={skill.name} className="text-xs text-slate-500">
                • {skill.filename}
              </div>
            ))}
          </div>
        </Link>

        {/* 문서 카드 */}
        <Link
          to="/docs"
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📄</span>
            <span className="text-3xl font-bold text-emerald-400">
              {stats.docCount}
            </span>
          </div>
          <h4 className="text-lg font-medium group-hover:text-emerald-400 transition-colors">
            디자인 문서
          </h4>
          <p className="text-sm text-slate-400 mt-1">
            아트 바이블 및 스타일 가이드
          </p>
          <div className="mt-4 text-xs text-slate-500">
            docs/04. design/ 폴더의 마크다운 문서
          </div>
        </Link>

        {/* 에셋 카드 */}
        <Link
          to="/assets"
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🖼️</span>
            <span className="text-3xl font-bold text-emerald-400">
              {stats.assetCount}
            </span>
          </div>
          <h4 className="text-lg font-medium group-hover:text-emerald-400 transition-colors">
            생성된 에셋
          </h4>
          <p className="text-sm text-slate-400 mt-1">
            AI로 생성된 이미지 갤러리
          </p>
          <div className="mt-4 space-y-1">
            {Object.entries(stats.assetCategories).map(([cat, count]) => (
              <div key={cat} className="text-xs text-slate-500">
                • {categoryLabels[cat] || cat}: {count}개
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* 빠른 시작 */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h4 className="text-lg font-medium mb-4">빠른 시작 가이드</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-slate-300">
              <span className="text-emerald-400 font-medium">1. 스킬 편집:</span>{' '}
              gen-character, gen-monster, gen-background 스킬의 프롬프트를 수정합니다.
            </p>
            <p className="text-slate-300">
              <span className="text-emerald-400 font-medium">2. 문서 편집:</span>{' '}
              아트 바이블과 스타일 가이드 문서를 업데이트합니다.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-slate-300">
              <span className="text-emerald-400 font-medium">3. 에셋 확인:</span>{' '}
              생성된 이미지를 갤러리에서 확인하고 관리합니다.
            </p>
            <p className="text-slate-300">
              <span className="text-emerald-400 font-medium">4. 저장:</span>{' '}
              변경 사항은 자동으로 로컬 파일에 저장됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 경로 정보 */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-xs text-slate-500">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-slate-400">스킬 경로:</span>
            <span className="ml-2">.claude/commands/</span>
          </div>
          <div>
            <span className="text-slate-400">문서 경로:</span>
            <span className="ml-2">docs/04. design/</span>
          </div>
          <div>
            <span className="text-slate-400">에셋 경로:</span>
            <span className="ml-2">assets/</span>
          </div>
        </div>
      </div>
    </div>
  )
}
