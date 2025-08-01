import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Dashboard from '@/components/pages/Dashboard.vue'
import ProviderCategory from '@/components/pages/ProviderCategory.vue'
import ProviderVisits from '@/components/pages/ProviderVisits.vue'
import ProviderListings from '@/components/pages/ProviderListings.vue'
import ProviderRequests from '@/components/pages/ProviderRequests.vue'
import UploadRates from '@/components/pages/UploadRates.vue'
import ChangePassword from '@/components/pages/ChangePassword.vue'
import UserProfile from '@/components/pages/UserProfile.vue'
import Settings from '@/components/pages/Settings.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard' // Will be handled by navigation guard
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register', 
      component: RegisterForm,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordForm,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordForm,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, requiresNonProvider: true }
    },
    {
      path: '/provider-visits',
      name: 'provider-visits',
      component: ProviderVisits,
      meta: { requiresAuth: true }
    },
    {
      path: '/provider-listings',
      name: 'provider-listings',
      component: ProviderListings,
      meta: { requiresAuth: true, requiresNonProvider: true }
    },
    {
      path: '/provider-category',
      name: 'provider-category',
      component: ProviderCategory,
      meta: { requiresAuth: true, requiresNonProvider: true }
    },
    {
      path: '/upload-rates',
      name: 'upload-rates',
      component: UploadRates,
      meta: { requiresAuth: true, requiresNonProvider: true }
    },
    {
      path: '/provider-requests',
      name: 'provider-requests',
      component: ProviderRequests,
      meta: { requiresAuth: true }
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth initialization if it's still in progress
  if (authStore.initializing) {
    // Wait for initialization to complete
    const checkInitialization = () => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!authStore.initializing) {
            clearInterval(interval)
            resolve()
          }
        }, 50)
      })
    }
    await checkInitialization()
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect authenticated users based on role
    next(authStore.isProvider ? '/provider-requests' : '/dashboard')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next(authStore.isProvider ? '/provider-requests' : '/dashboard')
  } else if (to.meta.requiresNonProvider && authStore.isProvider) {
    next('/provider-requests') // Redirect providers to their requests page
  } else if (to.path === '/dashboard' && authStore.isProvider) {
    next('/provider-requests') // Redirect providers away from dashboard
  } else {
    next()
  }
})

export default router
