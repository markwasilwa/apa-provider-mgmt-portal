import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Dashboard from '@/components/pages/Dashboard.vue'
import ProviderCategory from '@/components/pages/ProviderCategory.vue'
import ProviderVisits from '@/components/pages/ProviderVisits.vue'
import ProviderListings from '@/components/pages/ProviderListings.vue'
import ProviderRequests from '@/components/pages/ProviderRequests.vue'
import ChangePassword from '@/components/pages/ChangePassword.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
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
      meta: { requiresAuth: true }
    },
    {
      path: '/provider-category',
      name: 'provider-category',
      component: ProviderCategory,
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true }
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
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
