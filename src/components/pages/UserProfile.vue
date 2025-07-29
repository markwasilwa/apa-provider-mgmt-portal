<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">My Profile</h1>
      <p class="page-description">Manage your account information and settings</p>
    </div>

    <!-- Loading State -->
    <div v-if="authStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>

    <!-- Profile Content -->
    <div v-else class="profile-content">
      <!-- User Info Card -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ authStore.userInitials }}
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ authStore.userDisplayName }}</h2>
            <p class="profile-email">{{ authStore.user?.email }}</p>
            <div class="profile-badges">
              <span class="role-badge" :class="getRoleClass(authStore.user?.role)">
                {{ formatRole(authStore.user?.role) }}
              </span>
              <span class="status-badge" :class="authStore.isActive ? 'status-active' : 'status-inactive'">
                {{ authStore.isActive ? 'Active' : 'Inactive' }}
              </span>
              <span class="verification-badge" :class="authStore.isEmailVerified ? 'verified' : 'unverified'">
                {{ authStore.isEmailVerified ? 'Email Verified' : 'Email Unverified' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Details -->
      <div class="details-section">
        <div class="section-grid">
          <!-- Personal Information -->
          <div class="detail-card">
            <div class="card-header">
              <h3 class="card-title">Personal Information</h3>
              <button @click="showEditModal = true" class="btn btn-outline btn-sm">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>
            </div>
            <div class="card-content">
              <div class="detail-item">
                <span class="detail-label">First Name:</span>
                <span class="detail-value">{{ authStore.user?.firstName || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Last Name:</span>
                <span class="detail-value">{{ authStore.user?.lastName || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ authStore.user?.email || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ authStore.user?.phone || 'Not provided' }}</span>
              </div>
            </div>
          </div>

          <!-- Account Security -->
          <div class="detail-card">
            <div class="card-header">
              <h3 class="card-title">Account Security</h3>
              <button @click="showPasswordModal = true" class="btn btn-outline btn-sm">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                Change Password
              </button>
            </div>
            <div class="card-content">
              <div class="detail-item">
                <span class="detail-label">Account ID:</span>
                <span class="detail-value">{{ authStore.user?.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email Verified:</span>
                <span class="detail-value">
                  <span :class="authStore.isEmailVerified ? 'text-success' : 'text-warning'">
                    {{ authStore.isEmailVerified ? 'Yes' : 'No' }}
                  </span>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Account Status:</span>
                <span class="detail-value">
                  <span :class="authStore.isActive ? 'text-success' : 'text-error'">
                    {{ authStore.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- API Key Management -->
          <div class="detail-card">
            <div class="card-header">
              <h3 class="card-title">API Key</h3>
              <button @click="regenerateApiKey" class="btn btn-outline btn-sm" :disabled="authStore.loading">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Regenerate
              </button>
            </div>
            <div class="card-content">
              <div class="api-key-display">
                <span class="detail-label">API Key:</span>
                <div class="api-key-value">
                  <code>{{ authStore.userApiKey || 'Not available' }}</code>
                  <button 
                    v-if="authStore.userApiKey"
                    @click="copyToClipboard(authStore.userApiKey)" 
                    class="copy-btn" 
                    title="Copy to clipboard"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p class="api-key-note">
                Use this API key for programmatic access without email verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit Profile</h3>
          <button @click="closeEditModal" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form @submit.prevent="updateProfile" class="modal-body">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input
              v-model="editForm.firstName"
              type="text"
              class="form-input"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input
              v-model="editForm.lastName"
              type="text"
              class="form-input"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input
              v-model="editForm.phone"
              type="tel"
              class="form-input"
              placeholder="+254700000000"
            >
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
              <span v-if="authStore.loading" class="loading-spinner"></span>
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Change Password</h3>
          <button @click="closePasswordModal" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form @submit.prevent="changePassword" class="modal-body">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="form-input"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="form-input"
              required
              minlength="8"
            >
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="form-input"
              required
            >
          </div>
          <div class="modal-actions">
            <button type="button" @click="closePasswordModal" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
              <span v-if="authStore.loading" class="loading-spinner"></span>
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const showEditModal = ref(false)
const showPasswordModal = ref(false)

const editForm = reactive({
  firstName: '',
  lastName: '',
  phone: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

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

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show success feedback
    console.log('API key copied to clipboard')
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  // Reset form
  editForm.firstName = authStore.user?.firstName || ''
  editForm.lastName = authStore.user?.lastName || ''
  editForm.phone = authStore.user?.phone || ''
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  // Reset form
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const openEditModal = () => {
  editForm.firstName = authStore.user?.firstName || ''
  editForm.lastName = authStore.user?.lastName || ''
  editForm.phone = authStore.user?.phone || ''
  showEditModal.value = true
}

const updateProfile = async () => {
  try {
    await authStore.updateProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone || undefined
    })
    closeEditModal()
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('New passwords do not match')
    return
  }

  try {
    await authStore.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    closePasswordModal()
  } catch (error) {
    console.error('Failed to change password:', error)
  }
}

const regenerateApiKey = async () => {
  if (confirm('Are you sure you want to regenerate your API key? The old key will stop working immediately.')) {
    try {
      await authStore.regenerateApiKey()
    } catch (error) {
      console.error('Failed to regenerate API key:', error)
    }
  }
}

// Initialize edit modal with current data when opened
showEditModal.value && openEditModal()
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
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

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 5rem;
  height: 5rem;
  background-color: #1e40af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.profile-email {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 1rem 0;
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

.details-section {
  display: flex;
  flex-direction: column;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-content {
  padding: 1.25rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 500;
  color: #64748b;
}

.detail-value {
  color: #1e293b;
  font-weight: 500;
}

.text-success {
  color: #059669;
}

.text-warning {
  color: #d97706;
}

.text-error {
  color: #dc2626;
}

.api-key-display {
  margin-bottom: 0.75rem;
}

.api-key-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
}

.api-key-value code {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
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
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
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
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .section-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .profile-badges {
    justify-content: center;
  }
}
</style>