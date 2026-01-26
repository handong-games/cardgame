import type { AssetInfo } from '../../lib/api'
import ImageCard from './ImageCard'

interface ImageGridProps {
  assets: AssetInfo[]
  onSelectAsset: (asset: AssetInfo) => void
}

export default function ImageGrid({ assets, onSelectAsset }: ImageGridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <p className="text-lg mb-2">에셋이 없습니다</p>
          <p className="text-sm">해당 카테고리에 이미지가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {assets.map((asset) => (
        <ImageCard
          key={asset.path}
          asset={asset}
          onClick={() => onSelectAsset(asset)}
        />
      ))}
    </div>
  )
}
