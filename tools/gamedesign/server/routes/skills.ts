import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'

const router = Router()

// 프로젝트 루트에서 .claude/commands 경로
const COMMANDS_DIR = path.resolve(process.cwd(), '../../.claude/commands')

// 허용된 스킬 파일 목록
const ALLOWED_SKILLS = ['gen-character.md', 'gen-monster.md', 'gen-background.md']

// 스킬 파일 목록 조회
router.get('/', async (_req, res) => {
  try {
    const skills = await Promise.all(
      ALLOWED_SKILLS.map(async (filename) => {
        const filePath = path.join(COMMANDS_DIR, filename)
        try {
          const stat = await fs.stat(filePath)
          return {
            name: filename.replace('.md', ''),
            filename,
            size: stat.size,
            modified: stat.mtime,
          }
        } catch {
          return null
        }
      })
    )
    res.json(skills.filter(Boolean))
  } catch (error) {
    res.status(500).json({ error: '스킬 목록을 불러올 수 없습니다' })
  }
})

// 특정 스킬 파일 조회
router.get('/:name', async (req, res) => {
  const { name } = req.params
  const filename = `${name}.md`

  if (!ALLOWED_SKILLS.includes(filename)) {
    return res.status(403).json({ error: '허용되지 않은 파일입니다' })
  }

  try {
    const filePath = path.join(COMMANDS_DIR, filename)
    const content = await fs.readFile(filePath, 'utf-8')
    res.json({ name, content })
  } catch {
    res.status(404).json({ error: '파일을 찾을 수 없습니다' })
  }
})

// 스킬 파일 저장
router.put('/:name', async (req, res) => {
  const { name } = req.params
  const { content } = req.body
  const filename = `${name}.md`

  if (!ALLOWED_SKILLS.includes(filename)) {
    return res.status(403).json({ error: '허용되지 않은 파일입니다' })
  }

  if (typeof content !== 'string') {
    return res.status(400).json({ error: '유효하지 않은 콘텐츠입니다' })
  }

  try {
    const filePath = path.join(COMMANDS_DIR, filename)
    await fs.writeFile(filePath, content, 'utf-8')
    res.json({ success: true, message: '저장되었습니다' })
  } catch {
    res.status(500).json({ error: '파일 저장에 실패했습니다' })
  }
})

export default router
