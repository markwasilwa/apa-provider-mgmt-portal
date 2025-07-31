import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: localStorage.getItem('theme') || 'light', // Default to light, but use stored preference if available
  }),

  getters: {
    isDarkTheme: (state) => state.currentTheme === 'dark',
    isSystemTheme: (state) => state.currentTheme === 'system',
  },

  actions: {
    setTheme(theme) {
      // Only accept valid themes
      if (['light', 'dark', 'system'].includes(theme)) {
        this.currentTheme = theme
        localStorage.setItem('theme', theme)
        this.applyTheme()
      }
    },

    applyTheme() {
      const root = document.documentElement
      
      // Remove any existing theme classes
      root.classList.remove('theme-light', 'theme-dark')
      
      let effectiveTheme = this.currentTheme
      
      // If system preference, check the user's system preference
      if (this.currentTheme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      
      // Apply the theme class
      root.classList.add(`theme-${effectiveTheme}`)
      
      // For backward compatibility, also set a data attribute
      root.setAttribute('data-theme', effectiveTheme)
    },

    // Initialize theme on app start
    initTheme() {
      this.applyTheme()
      
      // Listen for system preference changes if using system theme
      if (this.isSystemTheme) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          this.applyTheme()
        })
      }
    }
  }
})