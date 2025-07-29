import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth store and wait for it to complete
const authStore = useAuthStore()

// Initialize authentication state before mounting
async function initializeApp() {
  await authStore.initialize()
  app.mount('#app')
}

initializeApp()
