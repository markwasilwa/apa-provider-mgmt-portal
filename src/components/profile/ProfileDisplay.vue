<template>
  <div class="profile-display">
    <div class="profile-sections">
      <!-- Basic Information -->
      <div class="profile-section">
        <h4 class="section-title">Basic Information</h4>
        <div class="profile-grid">
          <div class="profile-field">
            <label class="field-label">First Name</label>
            <p class="field-value">{{ profile?.firstName || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Last Name</label>
            <p class="field-value">{{ profile?.lastName || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Email</label>
            <p class="field-value">{{ profile?.email || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Phone Number</label>
            <p class="field-value">{{ profile?.phoneNumber || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Date of Birth</label>
            <p class="field-value">{{ formatDate(profile?.dateOfBirth) || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Role</label>
            <p class="field-value">
              <span class="role-badge" :class="getRoleClass(profile?.role)">
                {{ formatRole(profile?.role) }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="profile-section">
        <h4 class="section-title">Address Information</h4>
        <div class="profile-grid">
          <div class="profile-field">
            <label class="field-label">Address</label>
            <p class="field-value">{{ profile?.address || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">City</label>
            <p class="field-value">{{ profile?.city || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Country</label>
            <p class="field-value">{{ profile?.country || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Postal Code</label>
            <p class="field-value">{{ profile?.postalCode || 'Not provided' }}</p>
          </div>
        </div>
      </div>

      <!-- Provider-specific Information -->
      <div v-if="profile?.role === 'ROLE_PROVIDER'" class="profile-section">
        <h4 class="section-title">Provider Information</h4>
        <div class="profile-grid">
          <div class="profile-field">
            <label class="field-label">Specialization</label>
            <p class="field-value">{{ profile?.specialization || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Hospital</label>
            <p class="field-value">{{ profile?.hospital || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">License Number</label>
            <p class="field-value">{{ profile?.licenseNumber || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Years of Experience</label>
            <p class="field-value">{{ profile?.yearsOfExperience || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Consultation Fee</label>
            <p class="field-value">
              {{ profile?.consultationFee ? `$${profile.consultationFee}` : 'Not provided' }}
            </p>
          </div>
          <div class="profile-field">
            <label class="field-label">Available Hours</label>
            <p class="field-value">{{ profile?.availableHours || 'Not provided' }}</p>
          </div>
        </div>
      </div>

      <!-- Back Office-specific Information -->
      <div v-if="profile?.role === 'ROLE_BACK_OFFICE'" class="profile-section">
        <h4 class="section-title">Back Office Information</h4>
        <div class="profile-grid">
          <div class="profile-field">
            <label class="field-label">Department</label>
            <p class="field-value">{{ profile?.department || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Position</label>
            <p class="field-value">{{ profile?.position || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Manager ID</label>
            <p class="field-value">{{ profile?.managerId || 'Not provided' }}</p>
          </div>
        </div>
      </div>

      <!-- Admin-specific Information -->
      <div v-if="profile?.role === 'ROLE_ADMIN'" class="profile-section">
        <h4 class="section-title">Admin Information</h4>
        <div class="profile-grid">
          <div class="profile-field">
            <label class="field-label">Admin Level</label>
            <p class="field-value">{{ profile?.adminLevel || 'Not provided' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Permissions</label>
            <p class="field-value">
              <span v-if="profile?.permissions && profile.permissions.length > 0" class="permissions-list">
                <span 
                  v-for="permission in profile.permissions" 
                  :key="permission"
                  class="permission-tag"
                >
                  {{ permission }}
                </span>
              </span>
              <span v-else>Not provided</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Timestamps -->
      <div class="profile-section">
        <h4 class="section-title">Profile Information</h4>
        <div class="profile-grid">
          <div class="profile-field">
            <label class="field-label">Profile Created</label>
            <p class="field-value">{{ formatDateTime(profile?.createdAt) || 'Not available' }}</p>
          </div>
          <div class="profile-field">
            <label class="field-label">Last Updated</label>
            <p class="field-value">{{ formatDateTime(profile?.updatedAt) || 'Not available' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  profile: {
    type: Object,
    default: null
  }
})

const formatRole = (role) => {
  if (!role) return ''
  
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

const formatDate = (dateString) => {
  if (!dateString) return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return null
  try {
    return new Date(dateString).toLocaleString()
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.profile-display {
  padding: 0;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 2rem;
}

.profile-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.profile-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.field-value {
  font-size: 0.875rem;
  color: #1e293b;
  margin: 0;
  word-wrap: break-word;
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

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.permission-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9;
  color: #64748b;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .profile-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .profile-sections {
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
}
</style>