import { create } from 'zustand'
import { fetchDocTree, fetchDoc, saveDoc, type DocTreeNode, type DocContent } from '../lib/api'

interface DocStore {
  tree: DocTreeNode[]
  currentDoc: DocContent | null
  isLoading: boolean
  error: string | null
  isDirty: boolean
  editedContent: string
  expandedPaths: Set<string>

  loadTree: () => Promise<void>
  loadDoc: (path: string) => Promise<void>
  setEditedContent: (content: string) => void
  save: () => Promise<void>
  resetChanges: () => void
  toggleExpanded: (path: string) => void
}

export const useDocStore = create<DocStore>((set, get) => ({
  tree: [],
  currentDoc: null,
  isLoading: false,
  error: null,
  isDirty: false,
  editedContent: '',
  expandedPaths: new Set(),

  loadTree: async () => {
    set({ isLoading: true, error: null })
    try {
      const tree = await fetchDocTree()
      set({ tree, isLoading: false })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  loadDoc: async (path: string) => {
    set({ isLoading: true, error: null })
    try {
      const doc = await fetchDoc(path)
      set({
        currentDoc: doc,
        editedContent: doc.content,
        isLoading: false,
        isDirty: false,
      })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  setEditedContent: (content: string) => {
    const { currentDoc } = get()
    set({
      editedContent: content,
      isDirty: currentDoc ? content !== currentDoc.content : false,
    })
  },

  save: async () => {
    const { currentDoc, editedContent } = get()
    if (!currentDoc) return

    set({ isLoading: true, error: null })
    try {
      await saveDoc(currentDoc.path, editedContent)
      set({
        currentDoc: { ...currentDoc, content: editedContent },
        isLoading: false,
        isDirty: false,
      })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  resetChanges: () => {
    const { currentDoc } = get()
    if (currentDoc) {
      set({ editedContent: currentDoc.content, isDirty: false })
    }
  },

  toggleExpanded: (path: string) => {
    const { expandedPaths } = get()
    const newSet = new Set(expandedPaths)
    if (newSet.has(path)) {
      newSet.delete(path)
    } else {
      newSet.add(path)
    }
    set({ expandedPaths: newSet })
  },
}))
