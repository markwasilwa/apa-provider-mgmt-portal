<template>
  <nav class="secondary-nav">
    <div class="nav-container">
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/provider-requests" class="nav-link" active-class="active">
            {{ authStore.isProvider ? 'My Requests' : 'Requests' }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/provider-visits" class="nav-link" active-class="active">
            {{ authStore.isProvider ? 'My Visits' : 'Visits' }}
          </router-link>
        </li>
        <li class="nav-item" v-if="!authStore.isProvider">
          <router-link to="/provider-listings" class="nav-link" active-class="active">
            Actisure Listing
          </router-link>
        </li>
        <li class="nav-item" v-if="!authStore.isProvider">
          <router-link to="/provider-category" class="nav-link" active-class="active">
            Category & Country
          </router-link>
        </li>
        <li class="nav-item" v-if="!authStore.isProvider">
          <router-link to="/upload-rates" class="nav-link" active-class="active">
            Upload Rates
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/change-password" class="nav-link" active-class="active">
            Settings
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.secondary-nav {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: block;
  padding: 1rem 1.5rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.nav-link:hover {
  color: #1e40af;
  background-color: #f1f5f9;
}

.nav-link.active {
  color: #1e40af;
  border-bottom-color: #1e40af;
  background-color: #f1f5f9;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
  }

  .nav-link {
    padding: 0.75rem 1rem;
  }
}
</style>
