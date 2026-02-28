import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'

const router = Router()

// 에셋 디렉토리 (여러 경로 지원)
const ASSETS_DIRS = [
  path.resolve(process.cwd(), '../../assets'),       // 프로젝트 루트 assets/
  path.resolve(process.cwd(), 'assets'),              // projects/gamedesign/assets/
]

// 허용된 카테고리
const ALLOWED_CATEGORIES = [
  'backgrounds',
  'characters',
  'companions',
  'monsters',
  'frames',
  'coins',
  'icons',
  'buttons',
  'skills',
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

async function getAssetsInCategory(category: string): Promise<AssetInfo[]> {
  const assetMap = new Map<string, AssetInfo>()

  for (const baseDir of ASSETS_DIRS) {
    const categoryPath = path.join(baseDir, category)

    try {
      const entries = await fs.readdir(categoryPath, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isFile() && isImageFile(entry.name) && !assetMap.has(entry.name)) {
          const filePath = path.join(categoryPath, entry.name)
          const stat = await fs.stat(filePath)
          const metadata = await readMetadata(filePath)

          assetMap.set(entry.name, {
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
    } catch {
      // 디렉토리가 없으면 무시
    }
  }

  return [...assetMap.values()].sort((a, b) => b.modified.getTime() - a.modified.getTime())
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

// 하위 호환: 중첩 카테고리 요청 시 단일 카테고리로 리다이렉트
router.get('/category/:category/:subcategory', async (req, res) => {
  const { subcategory } = req.params
  await getCategoryAssets(subcategory, res)
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

router.get('/file/:category/:filename', async (req, res) => {
  const { category, filename } = req.params
  await serveImageFile(category, filename, res)
})

router.get('/file/:category/:subcategory/:filename', async (req, res) => {
  const { subcategory, filename } = req.params
  await serveImageFile(subcategory, filename, res)
})

async function findImageFile(category: string, filename: string): Promise<string | null> {
  for (const baseDir of ASSETS_DIRS) {
    const filePath = path.join(baseDir, category, filename)
    try {
      const stat = await fs.stat(filePath)
      if (stat.isFile()) return filePath
    } catch {
      continue
    }
  }
  return null
}

async function serveImageFile(category: string, filename: string, res: import('express').Response) {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(403).json({ error: '허용되지 않은 카테고리입니다' })
  }

  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: '유효하지 않은 파일명입니다' })
  }

  if (!isImageFile(filename)) {
    return res.status(400).json({ error: '이미지 파일만 조회할 수 있습니다' })
  }

  const filePath = await findImageFile(category, filename)
  if (!filePath) {
    return res.status(404).json({ error: '파일을 찾을 수 없습니다' })
  }

  try {
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
