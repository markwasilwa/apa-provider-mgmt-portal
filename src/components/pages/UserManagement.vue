<template>
  <div class="user-management">
    <div class="page-header">
      <h1 class="page-title">User Management</h1>
      <p class="page-description">Manage user accounts across the system</p>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <div class="search-controls">
        <div class="search-group">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search users by name or email..."
            class="search-input"
            @input="handleSearch"
          >
          <button @click="loadUsers" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
        
        <div class="filter-group">
          <select v-model="selectedRole" @change="filterUsers" class="filter-select">
            <option value="">All Roles</option>
            <option value="ROLE_PROVIDER">Providers</option>
            <option value="ROLE_BACK_OFFICE">Back Office</option>
            <option value="ROLE_ADMIN">Administrators</option>
          </select>
          
          <select v-model="selectedStatus" @change="filterUsers" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Email Verified</option>
            <option value="unverified">Email Unverified</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.providers }}</div>
          <div class="stat-label">Providers</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.backOffice }}</div>
          <div class="stat-label">Back Office</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.admins }}</div>
          <div class="stat-label">Administrators</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.verified }}</div>
          <div class="stat-label">Email Verified</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.active }}</div>
          <div class="stat-label">Active Users</div>
        </div>
      </div>
    </div>

    <!-- User List -->
    <div class="users-section">
      <div class="section-header">
        <h3>Users ({{ filteredUsers.length }})</h3>
        <div class="header-actions">
          <button @click="showInviteModal = true" class="btn btn-primary">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Invite User
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && users.length === 0" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading users...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0" class="empty-state">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h4>No users found</h4>
        <p>{{ searchTerm || selectedRole || selectedStatus ? 'Try adjusting your search criteria' : 'No users have been registered yet' }}</p>
      </div>

      <!-- User Table -->
      <div v-else class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verification</th>
              <th>API Key</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in filteredUsers" 
              :key="user.id"
              class="user-row"
            >
              <td class="user-info">
                <div class="user-avatar">
                  {{ getInitials(user.firstName, user.lastName) }}
                </div>
                <div class="user-details">
                  <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="user-id">ID: {{ user.id }}</div>
                </div>
              </td>
              
              <td class="user-email">
                <a :href="`mailto:${user.email}`" class="email-link">{{ user.email }}</a>
              </td>
              
              <td class="user-phone">
                {{ user.phone || 'Not provided' }}
              </td>
              
              <td class="user-role">
                <span class="role-badge" :class="getRoleClass(user.role)">
                  {{ formatRole(user.role) }}
                </span>
              </td>
              
              <td class="user-status">
                <span class="status-badge" :class="user.isActive ? 'status-active' : 'status-inactive'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              
              <td class="user-verification">
                <span class="verification-badge" :class="user.emailVerified ? 'verified' : 'unverified'">
                  {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                </span>
              </td>
              
              <td class="user-api-key">
                <button 
                  @click="showApiKey(user)"
                  class="btn btn-outline btn-sm"
                  title="Show API Key"
                >
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                </button>
              </td>
              
              <td class="user-actions">
                <div class="action-buttons">
                  <button 
                    @click="viewUser(user)"
                    class="btn btn-outline btn-sm"
                    title="View Details"
                  >
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  
                  <button 
                    v-if="user.id !== authStore.user?.id"
                    @click="confirmDeleteUser(user)"
                    class="btn btn-danger btn-sm"
                    title="Delete User"
                  >
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- API Key Modal -->
    <div v-if="showApiKeyModal" class="modal-overlay" @click="closeApiKeyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>API Key for {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}</h3>
          <button @click="closeApiKeyModal" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="api-key-display">
            <label class="api-key-label">API Key:</label>
            <div class="api-key-value">
              <code>{{ selectedUser?.apiKey }}</code>
              <button @click="copyToClipboard(selectedUser?.apiKey)" class="copy-btn" title="Copy to clipboard">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
          <p class="api-key-note">
            This API key can be used for authentication without email verification.
          </p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete User</h3>
          <button @click="closeDeleteModal" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn btn-outline">Cancel</button>
          <button @click="deleteUser" class="btn btn-danger" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            Delete User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/services/auth'

const authStore = useAuthStore()

const users = ref([])
const loading = ref(false)
const searchTerm = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Modal state
const showApiKeyModal = ref(false)
const showDeleteModal = ref(false)
const showInviteModal = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)

const stats = computed(() => {
  const total = users.value.length
  const providers = users.value.filter(u => u.role === 'ROLE_PROVIDER').length
  const backOffice = users.value.filter(u => u.role === 'ROLE_BACK_OFFICE').length
  const admins = users.value.filter(u => u.role === 'ROLE_ADMIN').length
  const verified = users.value.filter(u => u.emailVerified).length
  const active = users.value.filter(u => u.isActive).length
  
  return { total, providers, backOffice, admins, verified, active }
})

const filteredUsers = computed(() => {
  let filtered = users.value

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    )
  }

  // Filter by role
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  // Filter by status
  if (selectedStatus.value) {
    switch (selectedStatus.value) {
      case 'active':
        filtered = filtered.filter(user => user.isActive)
        break
      case 'inactive':
        filtered = filtered.filter(user => !user.isActive)
        break
      case 'verified':
        filtered = filtered.filter(user => user.emailVerified)
        break
      case 'unverified':
        filtered = filtered.filter(user => !user.emailVerified)
        break
    }
  }

  return filtered
})

const loadUsers = async () => {
  loading.value = true
  try {
    const allUsers = await AuthService.getAllUsers()
    users.value = allUsers || []
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Search is reactive through computed property
}

const filterUsers = () => {
  // Filters are reactive through computed property
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

const showApiKey = (user) => {
  selectedUser.value = user
  showApiKeyModal.value = true
}

const closeApiKeyModal = () => {
  showApiKeyModal.value = false
  selectedUser.value = null
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show success feedback (you can add a toast notification here)
    console.log('API key copied to clipboard')
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const viewUser = (user) => {
  // Implement user details view
  console.log('View user:', user)
}

const confirmDeleteUser = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  
  loading.value = true
  try {
    await AuthService.deleteUser(userToDelete.value.id)
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Failed to delete user:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  max-width: 1400px;
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
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-align: center;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-section {
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

.header-actions {
  display: flex;
  gap: 0.5rem;
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

.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
}

.user-row:hover {
  background-color: #f8fafc;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #1e40af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-details {
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.125rem;
}

.user-id {
  font-size: 0.75rem;
  color: #64748b;
}

.email-link {
  color: #1e40af;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.role-badge, .status-badge, .verification-badge {
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

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background-color: #fee2e2;
  color: #dc2626;
}

.verified {
  background-color: #d1fae5;
  color: #065f46;
}

.unverified {
  background-color: #fef3c7;
  color: #92400e;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
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

.btn-danger {
  background-color: #dc2626;
  color: white;
  border-color: #dc2626;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.btn .btn-icon:only-child {
  margin: 0;
}

.btn .btn-icon:not(:only-child) {
  margin-right: 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #64748b;
  border-radius: 0.375rem;
}

.modal-close:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.api-key-display {
  margin-bottom: 1rem;
}

.api-key-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.api-key-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.api-key-value code {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: #1e293b;
  word-break: break-all;
}

.copy-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #64748b;
  border-radius: 0.25rem;
}

.copy-btn:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.copy-btn svg {
  width: 1rem;
  height: 1rem;
}

.api-key-note {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.warning-text {
  color: #dc2626;
  font-weight: 500;
  margin: 0.5rem 0 0 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    min-width: auto;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.5rem 0.75rem;
  }
  
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .users-table {
    font-size: 0.75rem;
  }
  
  .user-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>