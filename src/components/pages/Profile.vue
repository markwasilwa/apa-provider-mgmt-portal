<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">My Profile</h1>
      <p class="page-description">Manage your profile information and settings</p>
    </div>

    <!-- Loading State -->
    <div v-if="profileStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>

    <!-- Profile Content -->
    <div v-else class="profile-content">
      <!-- Profile Completion Card -->
      <div v-if="profileStore.hasProfile" class="completion-card">
        <div class="completion-header">
          <h3>Profile Completion</h3>
          <span class="completion-percentage">{{ profileStore.profileCompletionPercentage }}%</span>
        </div>
        <div class="completion-bar">
          <div 
            class="completion-fill" 
            :style="{ width: profileStore.profileCompletionPercentage + '%' }"
          ></div>
        </div>
        <p class="completion-text">
          <span v-if="profileStore.isProfileComplete" class="text-success">
            Your profile is complete!
          </span>
          <span v-else class="text-warning">
            Complete your profile to unlock all features
          </span>
        </p>
      </div>

      <!-- Create Profile Card (if no profile exists) -->
      <div v-if="!profileStore.hasProfile && !showProfileForm" class="empty-state-card">
        <div class="empty-state-content">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <h3>Create Your Profile</h3>
          <p>Set up your profile to get started with the provider management system.</p>
          <button @click="showProfileForm = true" class="btn btn-primary">
            Create Profile
          </button>
        </div>
      </div>

      <!-- Profile Form -->
      <div v-if="showProfileForm || profileStore.hasProfile" class="profile-form-container">
        <div class="form-header">
          <h3 v-if="profileStore.hasProfile">Edit Profile</h3>
          <h3 v-else>Create Profile</h3>
          <button 
            v-if="profileStore.hasProfile && !showProfileForm"
            @click="showProfileForm = true"
            class="btn btn-outline"
          >
            Edit Profile
          </button>
          <button 
            v-if="showProfileForm"
            @click="cancelEdit"
            class="btn btn-outline"
          >
            Cancel
          </button>
        </div>

        <!-- Profile Display (Read-only) -->
        <div v-if="profileStore.hasProfile && !showProfileForm" class="profile-display">
          <ProfileDisplay :profile="profileStore.currentProfile" />
        </div>

        <!-- Profile Form (Edit mode) -->
        <div v-if="showProfileForm">
          <ProfileForm 
            :profile="profileStore.currentProfile"
            :user-role="authStore.user?.role"
            @submit="handleProfileSubmit"
            @cancel="showProfileForm = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import ProfileDisplay from '@/components/profile/ProfileDisplay.vue'
import ProfileForm from '@/components/profile/ProfileForm.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const showProfileForm = ref(false)

const handleProfileSubmit = async (profileData) => {
  try {
    if (profileStore.hasProfile) {
      await profileStore.updateProfile(profileData)
    } else {
      await profileStore.createProfile(profileData)
    }
    showProfileForm.value = false
  } catch (error) {
    console.error('Failed to save profile:', error)
    throw error
  }
}

const cancelEdit = () => {
  showProfileForm.value = false
}

onMounted(async () => {
  try {
    await profileStore.getCurrentProfile()
  } catch (error) {
    // Profile doesn't exist yet, which is fine
    console.log('No profile found, user can create one')
  }
})
</script>

<style scoped>
.profile-page {
  max-width: 800px;
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
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #1e40af;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.completion-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.completion-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.completion-percentage {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e40af;
}

.completion-bar {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.completion-fill {
  height: 100%;
  background-color: #1e40af;
  transition: width 0.3s ease;
}

.completion-text {
  margin: 0;
  font-size: 0.875rem;
}

.text-success {
  color: #059669;
  font-weight: 500;
}

.text-warning {
  color: #d97706;
  font-weight: 500;
}

.empty-state-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-align: center;
}

.empty-state-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  color: #64748b;
  margin: 0 auto 1.5rem auto;
}

.empty-state-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.empty-state-content p {
  color: #64748b;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.profile-form-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.form-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.profile-display {
  padding: 1.5rem;
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

.btn-primary {
  background-color: #1e40af;
  color: white;
  border-color: #1e40af;
}

.btn-primary:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-outline {
  background-color: transparent;
  color: #64748b;
  border-color: #d1d5db;
}

.btn-outline:hover {
  background-color: #f8fafc;
  color: #1e40af;
  border-color: #1e40af;
}
</style>