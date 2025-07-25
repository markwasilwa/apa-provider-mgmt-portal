<template>
  <main class="main-content">
    <!-- Landing Page -->
    <div v-if="currentPage === 'home'" class="container">
      <div class="page-header">
        <h1 class="page-title">Provider Management System</h1>
        <p class="page-subtitle">Manage healthcare providers, requests, and medical schemes for APA Insurance</p>
      </div>
      
      <div class="jumbotron">
        <div class="cards-grid">
          <div class="menu-card" v-for="menuItem in menuItems" :key="menuItem.id" @click="navigateTo(menuItem.id)">
            <div class="card-icon">
              {{ menuItem.icon }}
            </div>
            <h3 class="card-title">{{ menuItem.title }}</h3>
            <p class="card-description">{{ menuItem.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Page Content -->
    <component v-else :is="currentPageComponent" />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dashboard from './pages/Dashboard.vue'
import ProviderCategory from './pages/ProviderCategory.vue'
import ProviderRequests from './pages/ProviderRequests.vue'
import ProviderVisits from './pages/ProviderVisits.vue'
import ProviderListings from './pages/ProviderListings.vue'
import Reports from './pages/Reports.vue'
import ChangePassword from './pages/ChangePassword.vue'

const currentPage = ref('home')

const menuItems = ref([
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of system metrics and key performance indicators',
    icon: '📊'
  },
  {
    id: 'category',
    title: 'Provider Category',
    description: 'Manage different categories of healthcare providers',
    icon: '🏥'
  },
  {
    id: 'requests',
    title: 'Provider Requests',
    description: 'Handle new provider registration requests and applications',
    icon: '📋'
  },
  {
    id: 'visits',
    title: 'Provider Visits',
    description: 'Track and manage provider facility visits and inspections',
    icon: '🚶'
  },
  {
    id: 'listings',
    title: 'Provider Listings',
    description: 'View and manage all registered healthcare providers',
    icon: '📝'
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Generate comprehensive reports and analytics',
    icon: '📈'
  },
  {
    id: 'password',
    title: 'Change Password',
    description: 'Update your account password and security settings',
    icon: '🔒'
  }
])

const pageComponents = {
  'dashboard': Dashboard,
  'category': ProviderCategory,
  'requests': ProviderRequests,
  'visits': ProviderVisits,
  'listings': ProviderListings,
  'reports': Reports,
  'password': ChangePassword
}

const currentPageComponent = computed(() => {
  return pageComponents[currentPage.value] || null
})

const navigateTo = (menuId) => {
  currentPage.value = menuId
}

// Expose navigation function for use by other components
defineExpose({
  navigateTo
})
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 0.5rem 0;
  background-color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.jumbotron {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.menu-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .jumbotron {
    padding: 2rem 1rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .menu-card {
    padding: 1.5rem;
  }
}
</style>