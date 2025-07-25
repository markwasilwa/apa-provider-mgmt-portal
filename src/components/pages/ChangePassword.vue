<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Change Password</h1>
      <p class="page-subtitle">Update your account password and security settings</p>
    </div>

    <div class="password-form-container">
      <form @submit.prevent="changePassword" class="password-form">
        <div class="form-section">
          <h3 class="section-title">Current Password</h3>
          <div class="form-group">
            <label for="current-password">Enter Current Password</label>
            <div class="password-input-group">
              <input 
                :type="showCurrentPassword ? 'text' : 'password'"
                id="current-password"
                v-model="currentPassword"
                placeholder="Enter your current password"
                required
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                {{ showCurrentPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">New Password</h3>
          <div class="form-group">
            <label for="new-password">Enter New Password</label>
            <div class="password-input-group">
              <input 
                :type="showNewPassword ? 'text' : 'password'"
                id="new-password"
                v-model="newPassword"
                placeholder="Enter your new password"
                required
                @input="validatePassword"
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showNewPassword = !showNewPassword"
              >
                {{ showNewPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm New Password</label>
            <div class="password-input-group">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password"
                v-model="confirmPassword"
                placeholder="Confirm your new password"
                required
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="confirmPassword && newPassword !== confirmPassword" class="error-message">
              Passwords do not match
            </div>
          </div>
        </div>

        <div class="password-requirements">
          <h4>Password Requirements:</h4>
          <ul class="requirements-list">
            <li :class="{ valid: hasMinLength }">
              <span class="requirement-icon">{{ hasMinLength ? '✅' : '❌' }}</span>
              At least 8 characters long
            </li>
            <li :class="{ valid: hasUppercase }">
              <span class="requirement-icon">{{ hasUppercase ? '✅' : '❌' }}</span>
              At least one uppercase letter
            </li>
            <li :class="{ valid: hasLowercase }">
              <span class="requirement-icon">{{ hasLowercase ? '✅' : '❌' }}</span>
              At least one lowercase letter
            </li>
            <li :class="{ valid: hasNumber }">
              <span class="requirement-icon">{{ hasNumber ? '✅' : '❌' }}</span>
              At least one number
            </li>
            <li :class="{ valid: hasSpecialChar }">
              <span class="requirement-icon">{{ hasSpecialChar ? '✅' : '❌' }}</span>
              At least one special character (!@#$%^&*)
            </li>
          </ul>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="resetForm">Cancel</button>
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="!canSubmit"
          >
            Change Password
          </button>
        </div>
      </form>

      <div class="security-tips">
        <h3>Security Tips</h3>
        <div class="tips-list">
          <div class="tip-item">
            <span class="tip-icon">🔒</span>
            <div class="tip-content">
              <strong>Use a unique password</strong>
              <p>Don't reuse passwords from other accounts</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🔄</span>
            <div class="tip-content">
              <strong>Change regularly</strong>
              <p>Update your password every 3-6 months</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">📱</span>
            <div class="tip-content">
              <strong>Enable 2FA</strong>
              <p>Add an extra layer of security to your account</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🚫</span>
            <div class="tip-content">
              <strong>Avoid personal info</strong>
              <p>Don't use names, birthdays, or common words</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const hasMinLength = computed(() => newPassword.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value))
const hasLowercase = computed(() => /[a-z]/.test(newPassword.value))
const hasNumber = computed(() => /\d/.test(newPassword.value))
const hasSpecialChar = computed(() => /[!@#$%^&*]/.test(newPassword.value))

const passwordStrength = computed(() => {
  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]
    .filter(Boolean).length

  if (score === 0) return { text: '', width: '0%', class: '' }
  if (score <= 2) return { text: 'Weak', width: '25%', class: 'weak' }
  if (score <= 3) return { text: 'Fair', width: '50%', class: 'fair' }
  if (score <= 4) return { text: 'Good', width: '75%', class: 'good' }
  return { text: 'Strong', width: '100%', class: 'strong' }
})

const canSubmit = computed(() => {
  return currentPassword.value && 
         newPassword.value && 
         confirmPassword.value &&
         newPassword.value === confirmPassword.value &&
         hasMinLength.value &&
         hasUppercase.value &&
         hasLowercase.value &&
         hasNumber.value &&
         hasSpecialChar.value
})

const validatePassword = () => {
  // Password validation is handled by computed properties
}

const changePassword = () => {
  if (canSubmit.value) {
    // Simulate password change
    alert('Password changed successfully!')
    resetForm()
  }
}

const resetForm = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.password-form-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: start;
}

.password-form {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-group input {
  flex: 1;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.password-input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  z-index: 1;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: #f59e0b; }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #10b981; }

.strength-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-requirements {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.password-requirements h4 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.requirements-list li.valid {
  color: #059669;
}

.requirement-icon {
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.security-tips {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.security-tips h3 {
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tip-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.tip-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.tip-content strong {
  display: block;
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.tip-content p {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .password-form-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .password-form,
  .security-tips {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>