import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/pages/Dashboard.vue'
import ProviderCategory from '@/components/pages/ProviderCategory.vue'
import ProviderVisits from '@/components/pages/ProviderVisits.vue'
import ProviderListings from '@/components/pages/ProviderListings.vue'
import ProviderRequests from '@/components/pages/ProviderRequests.vue'
import ChangePassword from '@/components/pages/ChangePassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/provider-category',
      name: 'provider-category',
      component: ProviderCategory
    },
    {
      path: '/provider-visits',
      name: 'provider-visits',
      component: ProviderVisits
    },
    {
      path: '/provider-listings',
      name: 'provider-listings',
      component: ProviderListings
    },
    {
      path: '/provider-requests',
      name: 'provider-requests',
      component: ProviderRequests
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword
    }
  ]
})

export default router
