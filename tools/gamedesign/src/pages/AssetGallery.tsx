import { useEffect } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useAssetStore } from '../store/useAssetStore'

const categoryLabels: Record<string, string> = {
  backgrounds: '배경',
  characters: '캐릭터',
  monsters: '몬스터',
  'ui/frames': 'UI/프레임',
  'ui/coins': 'UI/코인',
  'ui/icons': 'UI/아이콘',
  'ui/buttons': 'UI/버튼',
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
              <PhotoView key={asset.path} src={asset.url}>
                <div className="group cursor-pointer bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-900/20">
                  <div className="aspect-video bg-slate-900 relative overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
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
                  </div>
                </div>
              </PhotoView>
            ))}
          </div>
        )}
      </div>
    </PhotoProvider>
  )
}
