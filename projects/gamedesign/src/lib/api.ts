const API_BASE = '/api'

// 문서 API
export interface DocTreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: DocTreeNode[]
}

export interface DocContent {
  path: string
  content: string
}

export async function fetchDocTree(): Promise<DocTreeNode[]> {
  const res = await fetch(`${API_BASE}/docs/tree`)
  if (!res.ok) throw new Error('문서 트리를 불러올 수 없습니다')
  return res.json()
}

export async function fetchDoc(docPath: string): Promise<DocContent> {
  const encodedPath = docPath.split('/').map(encodeURIComponent).join('/')
  const res = await fetch(`${API_BASE}/docs/${encodedPath}`)
  if (!res.ok) throw new Error('문서를 불러올 수 없습니다')
  return res.json()
}

export async function saveDoc(docPath: string, content: string): Promise<void> {
  const encodedPath = docPath.split('/').map(encodeURIComponent).join('/')
  const res = await fetch(`${API_BASE}/docs/${encodedPath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error('문서를 저장할 수 없습니다')
}

// 에셋 API
export interface AssetMetadata {
  prompt?: string
  negative?: string
  model?: string
  generatedAt?: string
  parameters?: {
    aspectRatio?: string
    [key: string]: unknown
  }
}

export interface AssetInfo {
  name: string
  category: string
  path: string
  url: string
  size: number
  modified: string
  metadata?: AssetMetadata
}

export interface AssetsResponse {
  categories: string[]
  assets: AssetInfo[]
  total: number
}

export interface CategoryAssetsResponse {
  category: string
  assets: AssetInfo[]
  total: number
}

export async function fetchAllAssets(): Promise<AssetsResponse> {
  const res = await fetch(`${API_BASE}/assets`)
  if (!res.ok) throw new Error('에셋 목록을 불러올 수 없습니다')
  return res.json()
}

export async function fetchCategoryAssets(category: string): Promise<CategoryAssetsResponse> {
  const res = await fetch(`${API_BASE}/assets/category/${category}`)
  if (!res.ok) throw new Error('에셋 목록을 불러올 수 없습니다')
  return res.json()
}

// 이미지 생성 API
export interface GenerateRequest {
  entity_type: string
  entity_id: string
  prompt_override?: string
  negative_override?: string
  params?: Record<string, string>
  options?: {
    sample_count?: number
    remove_bg?: boolean
    image_size?: string
    dry_run?: boolean
  }
}

export interface GenerateFileSaved {
  path: string
  size_bytes?: number
  dimensions?: string
}

export interface GenerateResponse {
  status: 'success' | 'error'
  entity_type?: string
  entity_id?: string
  files_saved?: GenerateFileSaved[]
  prompt_used?: string
  generation_time_ms?: number
  error?: string
  timestamp?: string
}

export async function generateAsset(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: '이미지 생성 요청 실패' }))
    return {
      status: 'error',
      error: errorData.error || `서버 오류 (${res.status})`,
    }
  }
  return res.json()
}
