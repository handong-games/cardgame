import { create } from 'zustand'
import { generateAsset, type GenerateRequest, type GenerateResponse } from '../lib/api'

export interface PromptSelection {
  id: string
  name: string
  nameEn: string
  category: string
  group?: string
  prompt: string
  negative: string
}

interface GenerateStore {
  // 상태
  isGenerating: boolean
  lastResult: GenerateResponse | null
  error: string | null
  history: Array<GenerateResponse & { requestedAt: string; entityName: string }>

  // 선택된 프롬프트
  selectedPrompt: PromptSelection | null
  editedPrompt: string
  editedNegative: string

  // 옵션
  removeBg: boolean
  dryRun: boolean

  // 액션
  selectPrompt: (prompt: PromptSelection) => void
  setEditedPrompt: (prompt: string) => void
  setEditedNegative: (negative: string) => void
  resetToOriginal: () => void
  setRemoveBg: (value: boolean) => void
  setDryRun: (value: boolean) => void
  generate: () => Promise<void>
  clearResult: () => void
}

// 카테고리 → entity_type 매핑
const CATEGORY_TO_ENTITY: Record<string, string> = {
  frame: 'frame',
  character: 'character',
  companion: 'companion',
  forest: 'monster',
  dungeon: 'monster',
  castle: 'monster',
  background: 'background',
}

// entity_type별 기본 배경 제거 설정
const DEFAULT_REMOVE_BG: Record<string, boolean> = {
  monster: true,
  character: true,
  companion: true,
  frame: false,
  background: false,
  ui: false,
}

export const useGenerateStore = create<GenerateStore>((set, get) => ({
  isGenerating: false,
  lastResult: null,
  error: null,
  history: [],

  selectedPrompt: null,
  editedPrompt: '',
  editedNegative: '',

  removeBg: true,
  dryRun: false,

  selectPrompt: (prompt) => {
    const entityType = CATEGORY_TO_ENTITY[prompt.category] || prompt.category
    set({
      selectedPrompt: prompt,
      editedPrompt: prompt.prompt,
      editedNegative: prompt.negative,
      removeBg: DEFAULT_REMOVE_BG[entityType] ?? true,
      lastResult: null,
      error: null,
    })
  },

  setEditedPrompt: (prompt) => set({ editedPrompt: prompt }),
  setEditedNegative: (negative) => set({ editedNegative: negative }),

  resetToOriginal: () => {
    const { selectedPrompt } = get()
    if (selectedPrompt) {
      set({
        editedPrompt: selectedPrompt.prompt,
        editedNegative: selectedPrompt.negative,
      })
    }
  },

  setRemoveBg: (value) => set({ removeBg: value }),
  setDryRun: (value) => set({ dryRun: value }),

  generate: async () => {
    const { selectedPrompt, editedPrompt, editedNegative, removeBg, dryRun } = get()
    if (!selectedPrompt) return

    set({ isGenerating: true, error: null, lastResult: null })

    const entityType = CATEGORY_TO_ENTITY[selectedPrompt.category] || selectedPrompt.category

    const request: GenerateRequest = {
      entity_type: entityType,
      entity_id: selectedPrompt.id,
      prompt_override: editedPrompt,
      negative_override: editedNegative,
      options: {
        remove_bg: removeBg,
        dry_run: dryRun,
        image_size: entityType === 'background' ? '2K' : '1K',
      },
    }

    try {
      const result = await generateAsset(request)
      const historyEntry = {
        ...result,
        requestedAt: new Date().toISOString(),
        entityName: selectedPrompt.name,
      }

      set((state) => ({
        isGenerating: false,
        lastResult: result,
        error: result.status === 'error' ? result.error || '알 수 없는 오류' : null,
        history: [historyEntry, ...state.history],
      }))
    } catch (e) {
      set({
        isGenerating: false,
        error: e instanceof Error ? e.message : '이미지 생성 요청 실패',
      })
    }
  },

  clearResult: () => set({ lastResult: null, error: null }),
}))
