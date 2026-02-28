import { useEffect, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useAssetStore } from '../store/useAssetStore'
import type { AssetInfo } from '../lib/api'

const categoryLabels: Record<string, string> = {
  backgrounds: '배경',
  characters: '캐릭터',
  monsters: '몬스터',
  frames: '프레임',
  coins: '코인',
  icons: '아이콘',
  buttons: '버튼',
}

// 메타데이터 상세 모달 컴포넌트
function MetadataModal({
  asset,
  onClose
}: {
  asset: AssetInfo
  onClose: () => void
}) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const meta = asset.metadata

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl border border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖼️</span>
            <div>
              <h3 className="font-bold text-white">{asset.name}</h3>
              <p className="text-sm text-slate-400">{asset.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl p-2"
          >
            ✕
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 이미지 미리보기 */}
          <div className="mb-6">
            <img
              src={asset.url}
              alt={asset.name}
              className="max-h-48 mx-auto rounded-lg border border-slate-600"
            />
          </div>

          {meta ? (
            <div className="space-y-4">
              {/* 모델 & 생성일 */}
              <div className="flex flex-wrap gap-4 text-sm">
                {meta.model && (
                  <div className="bg-slate-900 px-3 py-2 rounded-lg">
                    <span className="text-slate-400">모델: </span>
                    <span className="text-emerald-400">{meta.model}</span>
                  </div>
                )}
                {meta.generatedAt && (
                  <div className="bg-slate-900 px-3 py-2 rounded-lg">
                    <span className="text-slate-400">생성일: </span>
                    <span className="text-slate-200">
                      {new Date(meta.generatedAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
                {meta.parameters?.aspectRatio && (
                  <div className="bg-slate-900 px-3 py-2 rounded-lg">
                    <span className="text-slate-400">비율: </span>
                    <span className="text-slate-200">{meta.parameters.aspectRatio}</span>
                  </div>
                )}
              </div>

              {/* 프롬프트 */}
              {meta.prompt && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-emerald-400">✅ 프롬프트</h4>
                    <button
                      onClick={() => copyToClipboard(meta.prompt!, 'prompt')}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        copied === 'prompt'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {copied === 'prompt' ? '✓ 복사됨' : '📋 복사'}
                    </button>
                  </div>
                  <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto">
                    {meta.prompt}
                  </pre>
                </div>
              )}

              {/* 네거티브 프롬프트 */}
              {meta.negative && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-400">❌ 네거티브</h4>
                    <button
                      onClick={() => copyToClipboard(meta.negative!, 'negative')}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        copied === 'negative'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {copied === 'negative' ? '✓ 복사됨' : '📋 복사'}
                    </button>
                  </div>
                  <pre className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg text-sm text-red-200 whitespace-pre-wrap overflow-x-auto max-h-32 overflow-y-auto">
                    {meta.negative}
                  </pre>
                </div>
              )}

              {/* 전체 복사 버튼 */}
              {(meta.prompt || meta.negative) && (
                <button
                  onClick={() => copyToClipboard(
                    `${meta.prompt || ''}\n\n--negative\n${meta.negative || ''}`.trim(),
                    'all'
                  )}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    copied === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {copied === 'all' ? '✓ 전체 복사됨' : '📋 전체 프롬프트 복사'}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p className="text-lg mb-2">메타데이터가 없습니다</p>
              <p className="text-sm">
                이 에셋은 프롬프트 정보가 기록되지 않았습니다.
              </p>
              <p className="text-xs mt-4 text-slate-500">
                메타데이터 파일: {asset.name.replace(/\.[^.]+$/, '')}.meta.json
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AssetGallery() {
  const {
    categories,
    filteredAssets,
    selectedCategory,
    isLoading,
    error,
    searchQuery,
    loadAssets,
    setSelectedCategory,
    setSearchQuery,
  } = useAssetStore()

  const [metadataAsset, setMetadataAsset] = useState<AssetInfo | null>(null)

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <PhotoProvider>
      <div className="space-y-6">
        {/* 필터 및 검색 */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 카테고리 필터 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === null
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {/* 검색 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="이미지 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* 통계 */}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>총 {filteredAssets.length}개의 에셋</span>
          {selectedCategory && (
            <span className="text-emerald-400">
              {categoryLabels[selectedCategory]} 필터 적용 중
            </span>
          )}
          {searchQuery && (
            <span className="text-emerald-400">
              "{searchQuery}" 검색 중
            </span>
          )}
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* 로딩 */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            로딩 중...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <p className="text-lg mb-2">에셋이 없습니다</p>
              <p className="text-sm">해당 조건에 맞는 이미지가 없습니다</p>
            </div>
          </div>
        ) : (
          /* 이미지 그리드 with PhotoView */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.path}
                className="group bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-900/20"
              >
                <PhotoView src={asset.url}>
                  <div className="cursor-pointer aspect-video bg-slate-900 relative overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* 메타데이터 유무 표시 */}
                    {asset.metadata && (
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                        📝
                      </div>
                    )}
                  </div>
                </PhotoView>
                <div className="p-3">
                  <p className="text-sm font-medium truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-700 rounded">
                      {categoryLabels[asset.category] || asset.category}
                    </span>
                    <span>{formatSize(asset.size)}</span>
                  </div>
                  {/* 메타데이터 보기 버튼 */}
                  <button
                    onClick={() => setMetadataAsset(asset)}
                    className={`w-full mt-2 py-1.5 text-xs rounded transition-colors ${
                      asset.metadata
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                    }`}
                  >
                    {asset.metadata ? '📝 프롬프트 보기' : '메타데이터 없음'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 메타데이터 모달 */}
        {metadataAsset && (
          <MetadataModal
            asset={metadataAsset}
            onClose={() => setMetadataAsset(null)}
          />
        )}
      </div>
    </PhotoProvider>
  )
}
