import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'

const router = Router()

// 프로젝트 루트에서 assets 경로
const ASSETS_DIR = path.resolve(process.cwd(), '../../assets')

// 허용된 카테고리
const ALLOWED_CATEGORIES = [
  'backgrounds',
  'characters',
  'monsters',
  'ui/frames',
  'ui/coins',
  'ui/icons',
  'ui/buttons',
]

// 허용된 이미지 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

interface AssetMetadata {
  prompt?: string
  negative?: string
  model?: string
  generatedAt?: string
  parameters?: {
    aspectRatio?: string
    [key: string]: unknown
  }
}

interface AssetInfo {
  name: string
  category: string
  path: string
  url: string
  size: number
  modified: Date
  metadata?: AssetMetadata
}

// 이미지 파일인지 확인
function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

// 메타데이터 파일 읽기
async function readMetadata(imagePath: string): Promise<AssetMetadata | undefined> {
  // 이미지 확장자 제거하고 .meta.json 붙이기
  const baseName = imagePath.replace(/\.[^.]+$/, '')
  const metaPath = `${baseName}.meta.json`

  try {
    const content = await fs.readFile(metaPath, 'utf-8')
    return JSON.parse(content) as AssetMetadata
  } catch {
    return undefined
  }
}

// 카테고리별 에셋 조회
async function getAssetsInCategory(category: string): Promise<AssetInfo[]> {
  const categoryPath = path.join(ASSETS_DIR, category)

  try {
    const entries = await fs.readdir(categoryPath, { withFileTypes: true })
    const assets: AssetInfo[] = []

    for (const entry of entries) {
      if (entry.isFile() && isImageFile(entry.name)) {
        const filePath = path.join(categoryPath, entry.name)
        const stat = await fs.stat(filePath)

        // 메타데이터 파일 읽기 시도
        const metadata = await readMetadata(filePath)

        assets.push({
          name: entry.name,
          category,
          path: `${category}/${entry.name}`,
          url: `/api/assets/file/${category}/${entry.name}`,
          size: stat.size,
          modified: stat.mtime,
          metadata,
        })
      }
    }

    return assets.sort((a, b) => b.modified.getTime() - a.modified.getTime())
  } catch {
    return []
  }
}

// 전체 에셋 목록 조회
router.get('/', async (_req, res) => {
  try {
    const allAssets: AssetInfo[] = []

    for (const category of ALLOWED_CATEGORIES) {
      const assets = await getAssetsInCategory(category)
      allAssets.push(...assets)
    }

    res.json({
      categories: ALLOWED_CATEGORIES,
      assets: allAssets,
      total: allAssets.length,
    })
  } catch (error) {
    res.status(500).json({ error: '에셋 목록을 불러올 수 없습니다' })
  }
})

// 카테고리별 에셋 목록 조회
router.get('/category/:category', async (req, res) => {
  const { category } = req.params
  await getCategoryAssets(category, res)
})

// 중첩 카테고리 지원 (ui/frames 등)
router.get('/category/:category/:subcategory', async (req, res) => {
  const { category, subcategory } = req.params
  const fullCategory = `${category}/${subcategory}`
  await getCategoryAssets(fullCategory, res)
})

async function getCategoryAssets(category: string, res: import('express').Response) {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(403).json({ error: '허용되지 않은 카테고리입니다' })
  }

  try {
    const assets = await getAssetsInCategory(category)
    res.json({
      category,
      assets,
      total: assets.length,
    })
  } catch {
    res.status(500).json({ error: '에셋 목록을 불러올 수 없습니다' })
  }
}

// 이미지 파일 서빙 (중첩 카테고리 지원: ui/frames 등)
router.get('/file/:category/:filename', async (req, res) => {
  const { category, filename } = req.params
  await serveImageFile(category, filename, res)
})

router.get('/file/:category/:subcategory/:filename', async (req, res) => {
  const { category, subcategory, filename } = req.params
  const fullCategory = `${category}/${subcategory}`
  await serveImageFile(fullCategory, filename, res)
})

async function serveImageFile(category: string, filename: string, res: import('express').Response) {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(403).json({ error: '허용되지 않은 카테고리입니다' })
  }

  // 경로 탐색 방지
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: '유효하지 않은 파일명입니다' })
  }

  if (!isImageFile(filename)) {
    return res.status(400).json({ error: '이미지 파일만 조회할 수 있습니다' })
  }

  try {
    const filePath = path.join(ASSETS_DIR, category, filename)
    const stat = await fs.stat(filePath)

    if (!stat.isFile()) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다' })
    }

    const ext = path.extname(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }

    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=3600')

    const data = await fs.readFile(filePath)
    res.send(data)
  } catch {
    res.status(404).json({ error: '파일을 찾을 수 없습니다' })
  }
}

export default router
