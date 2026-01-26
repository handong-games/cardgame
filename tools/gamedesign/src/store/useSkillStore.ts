import { create } from 'zustand'
import { fetchSkills, fetchSkill, saveSkill, type SkillInfo, type SkillContent } from '../lib/api'

interface SkillStore {
  skills: SkillInfo[]
  currentSkill: SkillContent | null
  isLoading: boolean
  error: string | null
  isDirty: boolean
  editedContent: string

  loadSkills: () => Promise<void>
  loadSkill: (name: string) => Promise<void>
  setEditedContent: (content: string) => void
  save: () => Promise<void>
  resetChanges: () => void
}

export const useSkillStore = create<SkillStore>((set, get) => ({
  skills: [],
  currentSkill: null,
  isLoading: false,
  error: null,
  isDirty: false,
  editedContent: '',

  loadSkills: async () => {
    set({ isLoading: true, error: null })
    try {
      const skills = await fetchSkills()
      set({ skills, isLoading: false })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  loadSkill: async (name: string) => {
    set({ isLoading: true, error: null })
    try {
      const skill = await fetchSkill(name)
      set({
        currentSkill: skill,
        editedContent: skill.content,
        isLoading: false,
        isDirty: false,
      })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  setEditedContent: (content: string) => {
    const { currentSkill } = get()
    set({
      editedContent: content,
      isDirty: currentSkill ? content !== currentSkill.content : false,
    })
  },

  save: async () => {
    const { currentSkill, editedContent } = get()
    if (!currentSkill) return

    set({ isLoading: true, error: null })
    try {
      await saveSkill(currentSkill.name, editedContent)
      set({
        currentSkill: { ...currentSkill, content: editedContent },
        isLoading: false,
        isDirty: false,
      })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  resetChanges: () => {
    const { currentSkill } = get()
    if (currentSkill) {
      set({ editedContent: currentSkill.content, isDirty: false })
    }
  },
}))
