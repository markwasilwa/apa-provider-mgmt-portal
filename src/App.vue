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
    <AppLayout v-if="shouldShowLayout">
      <router-view />
    </AppLayout>
    <div v-else class="guest-layout">
      <router-view />
    </div>
    <Footer v-if="!shouldShowLayout" />
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
</style>
