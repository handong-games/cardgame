const API_BASE = '/api'

// 스킬 API
export interface SkillInfo {
  name: string
  filename: string
  size: number
  modified: string
}

export interface SkillContent {
  name: string
  content: string
}

export async function fetchSkills(): Promise<SkillInfo[]> {
  const res = await fetch(`${API_BASE}/skills`)
  if (!res.ok) throw new Error('스킬 목록을 불러올 수 없습니다')
  return res.json()
}

export async function fetchSkill(name: string): Promise<SkillContent> {
  const res = await fetch(`${API_BASE}/skills/${name}`)
  if (!res.ok) throw new Error('스킬 파일을 불러올 수 없습니다')
  return res.json()
}

export async function saveSkill(name: string, content: string): Promise<void> {
  const res = await fetch(`${API_BASE}/skills/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error('스킬 파일을 저장할 수 없습니다')
}

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
export interface AssetInfo {
  name: string
  category: string
  path: string
  url: string
  size: number
  modified: string
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
