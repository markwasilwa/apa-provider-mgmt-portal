<template>
  <div class="app-layout">
    <!-- Top Navigation -->
    <header class="top-nav">
      <div class="nav-container">
        <div class="nav-left">
          <button 
            @click="toggleSidebar"
            class="sidebar-toggle mobile-only"
            type="button"
          >
            <svg class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div class="logo">
            <img src="@/assets/happiness.jpeg" alt="APA Insurance" class="logo-img">
            <span class="logo-text">APA Insurance ~ Providers Portal</span>
          </div>
        </div>
        
        <div class="auth-section">
          <div class="user-menu" v-if="authStore.isAuthenticated">
            <div class="user-info">
              <div class="user-avatar">
                {{ authStore.userInitials }}
              </div>
              <div class="user-details">
                <div class="user-name">{{ authStore.userDisplayName }}</div>
                <div class="user-role">{{ formatRole(authStore.user?.role) }}</div>
              </div>
            </div>
            <div class="user-dropdown-container">
              <button 
                @click="toggleUserMenu"
                class="user-menu-button"
                type="button"
              >
                <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                v-if="showUserMenu"
                class="user-dropdown"
              >
                <router-link to="/profile" class="dropdown-item">
                  <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Profile
                </router-link>
                <router-link to="/change-password" class="dropdown-item">
                  <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                  Change Password
                </router-link>
                <button @click="handleLogout" class="dropdown-item logout-item">
                  <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="app-content">
      <!-- Sidebar -->
      <aside 
        class="sidebar"
        :class="{ 'sidebar-open': sidebarOpen }"
      >
        <nav class="sidebar-nav">
          <ul class="nav-menu">
            <li v-if="!authStore.isProvider" class="nav-item">
              <router-link to="/dashboard" class="nav-link" active-class="active">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z"></path>
                </svg>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/provider-requests" class="nav-link" active-class="active">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Requests
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/provider-visits" class="nav-link" active-class="active">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2m-6 0V7"></path>
                </svg>
                Visits
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/provider-listings" class="nav-link" active-class="active">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0h6"></path>
                </svg>
                Actisure Listing
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/settings" class="nav-link" active-class="active">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Sidebar Overlay for mobile -->
      <div 
        v-if="sidebarOpen" 
        class="sidebar-overlay mobile-only"
        @click="closeSidebar"
      ></div>

      <!-- Main Content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const showUserMenu = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatRole = (role) => {
  if (!role) return ''
  
  const roleMap = {
    'ROLE_ADMIN': 'Administrator',
    'ROLE_PROVIDER': 'Provider',
    'ROLE_BACK_OFFICE': 'Back Office'
  }
  
  return roleMap[role] || role.replace('ROLE_', '').replace('_', ' ')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-dropdown-container')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

/* Top Navigation - matching existing TopNavigation.vue */
.top-nav {
  background-color: white;
  color: #1f2937;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #1f2937;
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: #f3f4f6;
}

.toggle-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.auth-section {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: black;
}

.user-dropdown-container {
  position: relative;
}

.user-menu-button {
  background: none;
  border: none;
  color: #1f2937;
  padding: 0.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu-button:hover {
  background-color: #f3f4f6;
}

.dropdown-icon {
  width: 1rem;
  height: 1rem;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  min-width: 180px;
  z-index: 50;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-weight: 500;
}

.dropdown-item:hover {
  color: #1e40af;
  background-color: #f1f5f9;
}

.logout-item {
  color: #dc2626;
}

.logout-item:hover {
  color: #b91c1c;
  background-color: #fee2e2;
}

.dropdown-item:first-child {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.app-content {
  display: flex;
  flex: 1;
  position: relative;
}

/* Sidebar - matching existing SecondaryNavigation.vue colors */
.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  position: fixed;
  top: 73px;
  left: 0;
  bottom: 0;
  z-index: 40;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border-right: 3px solid transparent;
}

.nav-link:hover {
  color: #1e40af;
  background-color: #f1f5f9;
}

.nav-link.active {
  color: #1e40af;
  background-color: #f1f5f9;
  border-right-color: #1e40af;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  margin-left: 0;
  transition: margin-left 0.3s ease-in-out;
}

.mobile-only {
  display: block;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .mobile-only {
    display: none;
  }
  
  .sidebar {
    position: static;
    transform: translateX(0);
    top: auto;
    bottom: auto;
  }
  
  .main-content {
    margin-left: 0;
  }
}

/* Mobile styles */
@media (max-width: 640px) {
  .user-details {
    display: none;
  }
  
  .logo-text {
    display: none;
  }

  .nav-container {
    padding: 0 0.5rem;
  }

  .logo-img {
    width: 28px;
    height: 28px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .nav-link {
    padding: 0.75rem 1rem;
  }
}
</style>