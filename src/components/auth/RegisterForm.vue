<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo-container">
          <img src="@/assets/happiness.jpeg" alt="APA Insurance" class="logo">
        </div>
        <h2 class="title">Create your account</h2>
        <p class="subtitle">Join the Provider Management Portal</p>
      </div>

      <form class="register-form" @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name</label>
            <input
              id="firstName"
              v-model="form.firstName"
              name="firstName"
              type="text"
              required
              class="form-input"
              :class="{ 'input-error': errors.firstName }"
              placeholder="First Name"
            >
            <p v-if="errors.firstName" class="error-text">{{ errors.firstName }}</p>
          </div>
          <div class="form-group">
            <label for="lastName" class="form-label">Last Name</label>
            <input
              id="lastName"
              v-model="form.lastName"
              name="lastName"
              type="text"
              required
              class="form-input"
              :class="{ 'input-error': errors.lastName }"
              placeholder="Last Name"
            >
            <p v-if="errors.lastName" class="error-text">{{ errors.lastName }}</p>
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="form-input"
            :class="{ 'input-error': errors.email }"
            placeholder="Email address"
          >
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Phone Number (Optional)</label>
          <input
            id="phone"
            v-model="form.phone"
            name="phone"
            type="tel"
            class="form-input"
            placeholder="+254700000000"
          >
        </div>

        <div class="form-group">
          <label for="role" class="form-label">Role</label>
          <select
            id="role"
            v-model="form.role"
            name="role"
            class="form-input form-select"
          >
            <option value="ROLE_PROVIDER">Provider</option>
            <option value="ROLE_BACK_OFFICE">Back Office</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            class="form-input"
            :class="{ 'input-error': errors.password }"
            placeholder="Password (minimum 8 characters)"
          >
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            class="form-input"
            :class="{ 'input-error': errors.confirmPassword }"
            placeholder="Confirm password"
          >
          <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
        </div>

        <div v-if="error" class="alert alert-error">
          <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ success }}
        </div>

        <div class="form-submit">
          <button
            type="submit"
            :disabled="loading"
            class="submit-btn"
            :class="{ 'btn-loading': loading }"
          >
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <div class="signin-link">
          <span class="signin-text">
            Already have an account?
            <router-link to="/login" class="link">Sign in</router-link>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'ROLE_PROVIDER'
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = () => {
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  let isValid = true

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const userData = {
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone || undefined,
      role: form.role
    }

    await authStore.register(userData)
    success.value = 'Account created successfully! Please check your email for verification instructions.'

    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (err) {
    error.value = err.message
    success.value = '' // Ensure success message is cleared when there's an error
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
}

.register-card {
  max-width: 32rem;
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo {
  height: 3rem;
  width: auto;
  border-radius: 50%;
}

.title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-input {
  margin-top: 0.25rem;
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  color: #111827;
  background: white;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  appearance: none;
}

.input-error {
  border-color: #ef4444;
}

.error-text {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
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

.form-submit {
  position: relative;
}

.submit-btn {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: #6366f1;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #4f46e5;
}

.submit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  position: absolute;
  left: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.signin-link {
  text-align: center;
}

.signin-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.link {
  font-weight: 500;
  color: #6366f1;
  text-decoration: none;
}

.link:hover {
  color: #4f46e5;
}

@media (max-width: 640px) {
  .register-container {
    padding: 1rem;
  }

  .register-card {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
