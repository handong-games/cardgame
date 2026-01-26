import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'

const router = Router()

// 프로젝트 루트에서 docs/04. design 경로
const DOCS_DIR = path.resolve(process.cwd(), '../../docs/04. design')

interface TreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: TreeNode[]
}

// 디렉토리 트리 생성
async function buildTree(dirPath: string, basePath: string = ''): Promise<TreeNode[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const nodes: TreeNode[] = []

  for (const entry of entries) {
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      const children = await buildTree(path.join(dirPath, entry.name), relativePath)
      nodes.push({
        name: entry.name,
        path: relativePath,
        type: 'directory',
        children,
      })
    } else if (entry.name.endsWith('.md')) {
      nodes.push({
        name: entry.name,
        path: relativePath,
        type: 'file',
      })
    }
  }

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name, 'ko')
  })
}

// 경로 검증 (디렉토리 탐색 방지)
function validatePath(inputPath: string): boolean {
  const normalized = path.normalize(inputPath)
  return !normalized.includes('..') && !path.isAbsolute(normalized)
}

// 문서 트리 구조 조회
router.get('/tree', async (_req, res) => {
  try {
    const tree = await buildTree(DOCS_DIR)
    res.json(tree)
  } catch (error) {
    res.status(500).json({ error: '문서 트리를 불러올 수 없습니다' })
  }
})

// URL에서 문서 경로 추출 (URL 디코딩 포함)
function extractDocPath(url: string): string {
  // /api/docs/path/to/file.md 형식에서 경로 추출
  const match = url.match(/^\/(.+)$/)
  if (!match) return ''
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

// 특정 문서 조회
router.get('/*path', async (req, res) => {
  const docPath = extractDocPath(req.path)

  if (!docPath || !validatePath(docPath)) {
    return res.status(400).json({ error: '유효하지 않은 경로입니다' })
  }

  try {
    const filePath = path.join(DOCS_DIR, docPath)
    const content = await fs.readFile(filePath, 'utf-8')
    res.json({ path: docPath, content })
  } catch {
    res.status(404).json({ error: '파일을 찾을 수 없습니다' })
  }
})

// 문서 저장
router.put('/*path', async (req, res) => {
  const docPath = extractDocPath(req.path)
  const { content } = req.body

  if (!docPath || !validatePath(docPath)) {
    return res.status(400).json({ error: '유효하지 않은 경로입니다' })
  }

  if (typeof content !== 'string') {
    return res.status(400).json({ error: '유효하지 않은 콘텐츠입니다' })
  }

  try {
    const filePath = path.join(DOCS_DIR, docPath)
    await fs.writeFile(filePath, content, 'utf-8')
    res.json({ success: true, message: '저장되었습니다' })
  } catch {
    res.status(500).json({ error: '파일 저장에 실패했습니다' })
  }
})

export default router
