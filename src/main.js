import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth store and wait for it to complete
const authStore = useAuthStore()
// Initialize theme store
const themeStore = useThemeStore()

// Initialize authentication state before mounting
async function initializeApp() {
  await authStore.initialize()
  // Apply theme before mounting to prevent flash of unstyled content
  themeStore.initTheme()
  app.mount('#app')
}

initializeApp()
