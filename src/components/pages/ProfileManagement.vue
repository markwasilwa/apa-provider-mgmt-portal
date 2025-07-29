<template>
  <div class="profile-management">
    <div class="page-header">
      <h1 class="page-title">Profile Management</h1>
      <p class="page-description">Manage user profiles across the system</p>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <div class="search-controls">
        <div class="search-group">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search profiles..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch" class="btn btn-primary" :disabled="profileStore.searchLoading">
            <span v-if="profileStore.searchLoading" class="loading-spinner"></span>
            Search
          </button>
        </div>
        
        <div class="filter-group">
          <select v-model="selectedRole" class="filter-select">
            <option value="">All Roles</option>
            <option value="ROLE_PROVIDER">Providers</option>
            <option value="ROLE_BACK_OFFICE">Back Office</option>
            <option value="ROLE_ADMIN">Administrators</option>
          </select>
          
          <button @click="clearSearch" class="btn btn-outline">
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div v-if="profileStats" class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ profileStats.totalProfiles || 0 }}</div>
          <div class="stat-label">Total Profiles</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profileStats.totalProviders || 0 }}</div>
          <div class="stat-label">Providers</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profileStats.totalBackOffice || 0 }}</div>
          <div class="stat-label">Back Office</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profileStats.totalAdmins || 0 }}</div>
          <div class="stat-label">Administrators</div>
        </div>
      </div>
    </div>

    <!-- Profile List -->
    <div class="profiles-section">
      <div class="section-header">
        <h3>User Profiles</h3>
        <button @click="loadAllProfiles" class="btn btn-outline" :disabled="profileStore.loading">
          <span v-if="profileStore.loading" class="loading-spinner"></span>
          Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="profileStore.loading && profiles.length === 0" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading profiles...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="profiles.length === 0" class="empty-state">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <h4>No profiles found</h4>
        <p>{{ searchTerm ? 'Try adjusting your search criteria' : 'No user profiles have been created yet' }}</p>
      </div>

      <!-- Profile Cards -->
      <div v-else class="profiles-grid">
        <div 
          v-for="profile in profiles" 
          :key="profile.id"
          class="profile-card"
        >
          <div class="profile-header">
            <div class="profile-avatar">
              {{ getInitials(profile.firstName, profile.lastName) }}
            </div>
            <div class="profile-info">
              <h4 class="profile-name">{{ profile.firstName }} {{ profile.lastName }}</h4>
              <p class="profile-email">{{ profile.email }}</p>
              <span class="role-badge" :class="getRoleClass(profile.role)">
                {{ formatRole(profile.role) }}
              </span>
            </div>
          </div>
          
          <div class="profile-details">
            <div class="detail-item">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ profile.phoneNumber || 'Not provided' }}</span>
            </div>
            
            <div v-if="profile.role === 'ROLE_PROVIDER'" class="detail-item">
              <span class="detail-label">Specialization:</span>
              <span class="detail-value">{{ profile.specialization || 'Not provided' }}</span>
            </div>
            
            <div v-if="profile.role === 'ROLE_PROVIDER'" class="detail-item">
              <span class="detail-label">Hospital:</span>
              <span class="detail-value">{{ profile.hospital || 'Not provided' }}</span>
            </div>
            
            <div v-if="profile.role === 'ROLE_BACK_OFFICE'" class="detail-item">
              <span class="detail-label">Department:</span>
              <span class="detail-value">{{ profile.department || 'Not provided' }}</span>
            </div>
            
            <div v-if="profile.role === 'ROLE_ADMIN'" class="detail-item">
              <span class="detail-label">Admin Level:</span>
              <span class="detail-value">{{ profile.adminLevel || 'Not provided' }}</span>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="viewProfile(profile)" class="btn btn-outline btn-sm">
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="profileStore.pagination.totalPages > 1" class="pagination">
        <button 
          @click="changePage(profileStore.pagination.number - 1)"
          :disabled="profileStore.pagination.number === 0"
          class="btn btn-outline"
        >
          Previous
        </button>
        
        <span class="pagination-info">
          Page {{ profileStore.pagination.number + 1 }} of {{ profileStore.pagination.totalPages }}
          ({{ profileStore.pagination.totalElements }} total)
        </span>
        
        <button 
          @click="changePage(profileStore.pagination.number + 1)"
          :disabled="profileStore.pagination.number >= profileStore.pagination.totalPages - 1"
          class="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'

const profileStore = useProfileStore()
const authStore = useAuthStore()

const searchTerm = ref('')
const selectedRole = ref('')
const profileStats = ref(null)

const profiles = computed(() => {
  return searchTerm.value ? profileStore.searchResults : profileStore.profiles
})

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    await loadAllProfiles()
    return
  }

  try {
    await profileStore.searchProfiles(searchTerm.value, selectedRole.value || null)
  } catch (error) {
    console.error('Search failed:', error)
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  selectedRole.value = ''
  profileStore.clearSearchResults()
  loadAllProfiles()
}

const loadAllProfiles = async () => {
  try {
    if (selectedRole.value) {
      await profileStore.getProfilesByRole(selectedRole.value)
    } else {
      // Load all profiles by role and combine
      const [providers, backOffice, admins] = await Promise.all([
        profileStore.getProfilesByRole('ROLE_PROVIDER').catch(() => ({ content: [] })),
        profileStore.getProfilesByRole('ROLE_BACK_OFFICE').catch(() => ({ content: [] })),
        profileStore.getProfilesByRole('ROLE_ADMIN').catch(() => ({ content: [] }))
      ])
      
      const allProfiles = [
        ...(providers.content || providers || []),
        ...(backOffice.content || backOffice || []),
        ...(admins.content || admins || [])
      ]
      
      profileStore.profiles = allProfiles
    }
  } catch (error) {
    console.error('Failed to load profiles:', error)
  }
}

const loadStats = async () => {
  try {
    profileStats.value = await profileStore.getAllProfileStats()
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const changePage = async (page) => {
  const params = { page }
  
  if (searchTerm.value) {
    await profileStore.searchProfiles(searchTerm.value, selectedRole.value || null, params)
  } else if (selectedRole.value) {
    await profileStore.getProfilesByRole(selectedRole.value, params)
  } else {
    await loadAllProfiles()
  }
}

const viewProfile = (profile) => {
  // For now, just log the profile
  console.log('View profile:', profile)
  // TODO: Implement modal or navigation to detailed view
}

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) || ''
  const last = lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
}

const formatRole = (role) => {
  const roleMap = {
    'ROLE_ADMIN': 'Administrator',
    'ROLE_PROVIDER': 'Provider',
    'ROLE_BACK_OFFICE': 'Back Office'
  }
  
  return roleMap[role] || role.replace('ROLE_', '').replace('_', ' ')
}

const getRoleClass = (role) => {
  const classMap = {
    'ROLE_ADMIN': 'role-admin',
    'ROLE_PROVIDER': 'role-provider',
    'ROLE_BACK_OFFICE': 'role-back-office'
  }
  
  return classMap[role] || 'role-default'
}

onMounted(() => {
  if (authStore.isAdmin) {
    loadStats()
  }
  loadAllProfiles()
})
</script>

<style scoped>
.profile-management {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.page-description {
  color: #64748b;
  margin: 0;
}

.search-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.search-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-group {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  min-width: 300px;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
}

.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.profiles-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #1e40af;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.loading-spinner:only-child {
  margin-right: 0;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem auto;
  color: #9ca3af;
}

.empty-state h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.profile-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: #f9fafb;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 3rem;
  height: 3rem;
  background-color: #1e40af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.profile-info {
  flex: 1;
}

.profile-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.profile-email {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #64748b;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.role-admin {
  background-color: #fef3c7;
  color: #92400e;
}

.role-provider {
  background-color: #dbeafe;
  color: #1e40af;
}

.role-back-office {
  background-color: #d1fae5;
  color: #065f46;
}

.role-default {
  background-color: #f1f5f9;
  color: #64748b;
}

.profile-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.detail-label {
  font-weight: 500;
  color: #64748b;
}

.detail-value {
  color: #1e293b;
  text-align: right;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.pagination-info {
  font-size: 0.875rem;
  color: #64748b;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1e40af;
  color: white;
  border-color: #1e40af;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-outline {
  background-color: transparent;
  color: #64748b;
  border-color: #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f8fafc;
  color: #1e40af;
  border-color: #1e40af;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    min-width: auto;
  }
  
  .profiles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>