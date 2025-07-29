<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from './components/layout/AppLayout.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()

const shouldShowLayout = computed(() => {
  const guestRoutes = ['login', 'register', 'forgot-password', 'reset-password']
  return authStore.isAuthenticated && !guestRoutes.includes(route.name)
})
</script>

<template>
  <div class="app">
    <!-- Loading state during authentication initialization -->
    <div v-if="authStore.initializing" class="loading-container">
      <div class="loading-card">
        <div class="logo-section">
          <img src="@/assets/happiness.jpeg" alt="APA Insurance" class="logo-img">
        </div>
        <h2 class="loading-title">APA Insurance</h2>
        <p class="loading-subtitle">Provider Management Portal</p>
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
    
    <!-- Main application -->
    <template v-else>
      <AppLayout v-if="shouldShowLayout">
        <router-view />
      </AppLayout>
      <div v-else class="guest-layout">
        <router-view />
      </div>
      <Footer v-if="!shouldShowLayout" />
    </template>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.guest-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Loading state styles */
.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
}

.loading-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
  margin: 1rem;
}

.logo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.loading-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.loading-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

.loading-text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
