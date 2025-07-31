<template>
  <div class="registration-form">
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="modal-body">
        <div class="form-grid">
          <!-- First Name -->
          <div class="form-group">
            <label for="firstName" class="form-label">
              First Name <span class="required">*</span>
            </label>
            <input
              v-model="form.firstName"
              type="text"
              id="firstName"
              name="firstName"
              class="form-input"
              :class="{ 'error': errors.firstName }"
              placeholder="Enter first name"
              required
            >
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label for="lastName" class="form-label">
              Last Name <span class="required">*</span>
            </label>
            <input
              v-model="form.lastName"
              type="text"
              id="lastName"
              name="lastName"
              class="form-input"
              :class="{ 'error': errors.lastName }"
              placeholder="Enter last name"
              required
            >
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>

          <!-- Email -->
          <div class="form-group full-width">
            <label for="email" class="form-label">
              Email Address <span class="required">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              name="email"
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="Enter email address"
              required
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- Phone -->
          <div class="form-group full-width">
            <label for="phone" class="form-label">
              Phone Number
            </label>
            <input
              v-model="form.phone"
              type="tel"
              id="phone"
              name="phone"
              class="form-input"
              :class="{ 'error': errors.phone }"
              placeholder="Enter phone number (e.g., +254700000000)"
            >
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">
              Password <span class="required">*</span>
            </label>
            <div class="password-input">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                class="form-input"
                :class="{ 'error': errors.password }"
                placeholder="Enter password"
                required
              >
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="password-toggle"
                :title="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            <div class="password-requirements">
              <small class="password-hint">
                Password must be at least 8 characters long
              </small>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">
              Confirm Password <span class="required">*</span>
            </label>
            <div class="password-input">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                name="confirmPassword"
                class="form-input"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="Confirm password"
                required
              >
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="password-toggle"
                :title="showConfirmPassword ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showConfirmPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <!-- Role -->
          <div class="form-group full-width">
            <label for="role" class="form-label">
              User Role <span class="required">*</span>
            </label>
            <select
              v-model="form.role"
              id="role"
              name="role"
              class="form-select"
              :class="{ 'error': errors.role }"
              required
            >
              <option value="">Select a role</option>
              <option value="ROLE_PROVIDER">Provider</option>
              <option value="ROLE_BACK_OFFICE">Back Office</option>
              <option value="ROLE_ADMIN">Administrator</option>
            </select>
            <span v-if="errors.role" class="error-message">{{ errors.role }}</span>
            <div class="role-description">
              <small v-if="form.role === 'ROLE_PROVIDER'" class="role-hint">
                Healthcare providers (doctors, hospitals, clinics)
              </small>
              <small v-else-if="form.role === 'ROLE_BACK_OFFICE'" class="role-hint">
                Administrative staff with limited access
              </small>
              <small v-else-if="form.role === 'ROLE_ADMIN'" class="role-hint">
                Full system access and user management
              </small>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="notification-section">
          <h4 class="section-title">Email Notifications</h4>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="form.sendWelcomeEmail"
                type="checkbox"
                class="checkbox-input"
              >
              <span class="checkbox-custom"></span>
              Send welcome email to new user
            </label>
          </div>
        </div>

        <!-- Form Messages -->
        <div v-if="generalError" class="alert alert-error">
          <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ generalError }}
        </div>

        <div v-if="successMessage" class="alert alert-success">
          <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ successMessage }}
        </div>
      </div>

      <!-- Form Actions -->
      <div class="modal-actions">
        <button
          type="button"
          @click="$emit('close')"
          class="btn btn-outline"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <svg v-else class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          {{ loading ? 'Creating User...' : 'Create User' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineEmits } from 'vue'
import AuthService from '@/services/auth'

const emit = defineEmits(['close', 'success'])

// Form state
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const generalError = ref('')
const successMessage = ref('')

// Form data
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: '',
  sendWelcomeEmail: true
})

// Form validation errors
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: ''
})

// Computed properties
const isFormValid = computed(() => {
  return form.firstName.trim() &&
         form.lastName.trim() &&
         form.email.trim() &&
         form.password.trim() &&
         form.confirmPassword.trim() &&
         form.role &&
         !Object.values(errors).some(error => error)
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validate first name
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
    isValid = false
  }

  // Validate last name
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
    isValid = false
  }

  // Validate email
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Validate phone (optional)
  if (form.phone.trim() && !/^\+?[1-9]\d{1,14}$/.test(form.phone.trim())) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }

  // Validate password
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
    isValid = false
  }

  // Validate confirm password
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Validate role
  if (!form.role) {
    errors.role = 'Please select a role'
    isValid = false
  }

  return isValid
}

const resetForm = () => {
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  form.confirmPassword = ''
  form.role = ''
  form.sendWelcomeEmail = true
  
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  generalError.value = ''
  successMessage.value = ''
}

const handleSubmit = async () => {
  generalError.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const userData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      password: form.password,
      role: form.role
    }

    const newUser = await AuthService.registerUser(userData)
    
    successMessage.value = `User "${newUser.firstName} ${newUser.lastName}" has been created successfully!`
    
    // Wait a moment to show success message, then emit success event
    setTimeout(() => {
      emit('success', newUser)
      resetForm()
    }, 1500)

  } catch (error) {
    generalError.value = error.message || 'Failed to create user. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.registration-form {
  max-height: 100%;
  overflow: auto;
}

.form-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.password-toggle:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.password-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.password-requirements,
.role-description {
  margin-top: 0.25rem;
}

.password-hint,
.role-hint {
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.4;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
}

.notification-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  position: relative;
  transition: all 0.2s;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #1e40af;
  border-color: #1e40af;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.375rem;
  height: 0.625rem;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: translate(-50%, -60%) rotate(45deg);
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.alert-success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
  min-width: 120px;
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

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: 1;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>