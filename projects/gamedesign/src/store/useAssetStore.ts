import { create } from 'zustand'
import { fetchAllAssets, fetchCategoryAssets, type AssetInfo } from '../lib/api'

interface AssetStore {
  categories: string[]
  assets: AssetInfo[]
  filteredAssets: AssetInfo[]
  selectedCategory: string | null
  selectedAsset: AssetInfo | null
  isLoading: boolean
  error: string | null
  searchQuery: string

  loadAssets: () => Promise<void>
  loadCategoryAssets: (category: string) => Promise<void>
  setSelectedCategory: (category: string | null) => void
  setSelectedAsset: (asset: AssetInfo | null) => void
  setSearchQuery: (query: string) => void
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  categories: [],
  assets: [],
  filteredAssets: [],
  selectedCategory: null,
  selectedAsset: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  loadAssets: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await fetchAllAssets()
      set({
        categories: data.categories,
        assets: data.assets,
        filteredAssets: data.assets,
        isLoading: false,
        selectedCategory: null,
      })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  loadCategoryAssets: async (category: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await fetchCategoryAssets(category)
      set({
        filteredAssets: data.assets,
        isLoading: false,
        selectedCategory: category,
      })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  setSelectedCategory: (category: string | null) => {
    const { assets, searchQuery } = get()

    let filtered = assets
    if (category) {
      filtered = filtered.filter((a) => a.category === category)
    }
    if (searchQuery) {
      filtered = filtered.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    set({ selectedCategory: category, filteredAssets: filtered })
  },

  setSelectedAsset: (asset: AssetInfo | null) => {
    set({ selectedAsset: asset })
  },

  setSearchQuery: (query: string) => {
    const { assets, selectedCategory } = get()

    let filtered = assets
    if (selectedCategory) {
      filtered = filtered.filter((a) => a.category === selectedCategory)
    }
    if (query) {
      filtered = filtered.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    set({ searchQuery: query, filteredAssets: filtered })
  },
}))
