import type { AssetInfo } from '../../lib/api'

interface ImageCardProps {
  asset: AssetInfo
  onClick: () => void
}

export default function ImageCard({ asset, onClick }: ImageCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-900/20"
    >
      <div className="aspect-video bg-slate-900 relative overflow-hidden">
        <img
          src={asset.url}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate" title={asset.name}>
          {asset.name}
        </p>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
          <span className="px-2 py-0.5 bg-slate-700 rounded">
            {asset.category}
          </span>
          <span>{formatSize(asset.size)}</span>
        </div>
      </div>
    </div>
  )
}
