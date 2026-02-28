import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'

const router = Router()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict'

const ENTITY_OUTPUT_MAP: Record<string, { dir: string; prefix: string }> = {
  character: { dir: 'characters', prefix: 'character_' },
  monster: { dir: 'monsters', prefix: 'monster_' },
  companion: { dir: 'companions', prefix: 'companion_' },
  frame: { dir: 'frames', prefix: 'frame_' },
  background: { dir: 'backgrounds', prefix: 'bg_' },
}

function getAspectRatio(entityType: string, _entityId: string): string {
  if (entityType === 'background') return '16:9'
  return '3:4' // character, monster, companion, frame (card)
}

interface GeminiRequest {
  instances: Array<{ prompt: string }>
  parameters: {
    sampleCount: number
    aspectRatio: string
    imageSize: string
    personGeneration: string
    negativePrompt?: string
    outputOptions?: {
      mimeType: string
    }
  }
}

interface GeminiResponse {
  generatedImages?: Array<{
    image: {
      imageBytes: string
      mimeType: string
    }
    raiFilteredReason?: string
  }>
}

// POST /api/generate — Gemini Imagen API 직접 호출로 이미지 생성
router.post('/', async (req, res) => {
  const { entity_type, entity_id, prompt_override, negative_override, options } = req.body

  // 필수 필드 검증
  if (!entity_type || !entity_id) {
    return res.status(400).json({
      status: 'error',
      error: 'entity_type과 entity_id는 필수입니다',
    })
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      status: 'error',
      error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다',
    })
  }

  if (!prompt_override) {
    return res.status(400).json({
      status: 'error',
      error: '프롬프트(prompt_override)가 필요합니다',
    })
  }

  const outputInfo = ENTITY_OUTPUT_MAP[entity_type]
  if (!outputInfo) {
    return res.status(400).json({
      status: 'error',
      error: `지원하지 않는 entity_type: ${entity_type}`,
    })
  }

  const aspectRatio = getAspectRatio(entity_type, entity_id)
  const imageSize = options?.image_size || '1K'

  // dry_run 모드: API 호출 없이 요청 정보만 반환
  if (options?.dry_run) {
    return res.json({
      status: 'success',
      entity_type,
      entity_id,
      prompt_used: prompt_override,
      files_saved: [{ path: `${outputInfo.dir}/${outputInfo.prefix}${entity_id}.png` }],
      generation_time_ms: 0,
      timestamp: new Date().toISOString(),
    })
  }

  const startTime = Date.now()

  const geminiRequest: GeminiRequest = {
    instances: [{ prompt: prompt_override }],
    parameters: {
      sampleCount: options?.sample_count || 1,
      aspectRatio,
      imageSize,
      personGeneration: 'allow_adult',
      outputOptions: {
        mimeType: 'image/png',
      },
    },
  }

  if (negative_override) {
    geminiRequest.parameters.negativePrompt = negative_override
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000) // 120초 타임아웃

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(geminiRequest),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({
        status: 'error',
        error: `Gemini API 오류 (${response.status}): ${errorText}`,
      })
    }

    const result = (await response.json()) as GeminiResponse

    if (!result.generatedImages?.length) {
      return res.status(422).json({
        status: 'error',
        error: '이미지 생성 실패: 응답에 이미지가 없습니다 (안전 필터에 의해 차단되었을 수 있습니다)',
      })
    }

    const { imageBytes } = result.generatedImages[0].image
    const imageBuffer = Buffer.from(imageBytes, 'base64')

    const assetsDir = path.resolve(process.cwd(), '../../assets')
    const categoryDir = path.join(assetsDir, outputInfo.dir)
    const filename = `${outputInfo.prefix}${entity_id}.png`
    const imagePath = path.join(categoryDir, filename)
    const metaPath = imagePath.replace(/\.png$/, '.meta.json')

    await fs.mkdir(categoryDir, { recursive: true })

    await fs.writeFile(imagePath, imageBuffer)

    const metadata = {
      prompt: prompt_override,
      negative: negative_override || '',
      model: 'gemini-imagen-4.0',
      generatedAt: new Date().toISOString(),
      parameters: {
        aspectRatio,
        imageSize,
        entityType: entity_type,
        entityId: entity_id,
        sampleCount: options?.sample_count || 1,
      },
    }

    try {
      await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2), 'utf-8')
    } catch {
      // 메타데이터 저장 실패는 무시 (이미지 생성 성공이 더 중요)
    }

    const generationTime = Date.now() - startTime
    const stat = await fs.stat(imagePath)

    res.json({
      status: 'success',
      entity_type,
      entity_id,
      files_saved: [
        {
          path: `${outputInfo.dir}/${filename}`,
          size_bytes: stat.size,
        },
      ],
      prompt_used: prompt_override,
      generation_time_ms: generationTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({
        status: 'error',
        error: 'Gemini API 요청 타임아웃 (120초 초과)',
      })
    }

    res.status(502).json({
      status: 'error',
      error: `Gemini API 연결 실패: ${error instanceof Error ? error.message : String(error)}`,
    })
  }
})

export default router
