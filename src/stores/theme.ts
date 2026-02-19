import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'blog-theme'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(
    (() => {
      if (typeof localStorage === 'undefined') return false
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved !== null) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    })()
  )

  watch(
    isDark,
    (v) => {
      if (typeof document === 'undefined') return
      document.documentElement.classList.toggle('dark', v)
      localStorage.setItem(STORAGE_KEY, v ? 'dark' : 'light')
    },
    { immediate: true }
  )

  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
})
