<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header-section">
        <div class="logo-section">
          <img src="@/assets/happiness.jpeg" alt="APA Insurance" class="logo-img">
        </div>
        <h1 class="main-title">Sign in to your account</h1>
        <p class="subtitle">Access the Provider Management Portal</p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-section">
          <div class="input-group">
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="form-input input-top"
              :class="{ 'input-error': errors.email }"
              placeholder="Email address"
            >
          </div>
          <div class="input-group">
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="form-input input-bottom"
              :class="{ 'input-error': errors.password }"
              placeholder="Password"
            >
          </div>
          <div v-if="errors.email || errors.password" class="error-section">
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>
        </div>

        <div class="options-section">
          <div class="remember-section">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="checkbox-input"
            >
            <label for="remember-me" class="checkbox-label">Remember me</label>
          </div>
          <div class="forgot-section">
            <router-link to="/forgot-password" class="link-text">
              Forgot your password?
            </router-link>
          </div>
        </div>

        <div v-if="error" class="alert alert-error">
          <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ error }}
        </div>

        <div class="submit-section">
          <button
            type="submit"
            :disabled="loading"
            class="submit-btn"
            :class="{ 'btn-loading': loading }"
          >
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="signup-section">
          <span class="signup-text">
            Don't have an account?
            <router-link to="/register" class="link-text">Sign up</router-link>
          </span>
        </div>

        <div class="divider-section">
          <div class="divider-line">
            <span class="divider-text">Or login with API Key</span>
          </div>

          <div class="api-section">
            <input
              v-model="apiKey"
              type="text"
              placeholder="Enter your API Key"
              class="form-input api-input"
            >
            <button
              @click="handleApiKeyLogin"
              :disabled="!apiKey || loading"
              class="api-btn"
              :class="{ 'btn-disabled': !apiKey || loading }"
              type="button"
            >
              Login with API Key
            </button>
          </div>
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
const apiKey = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.email, form.password)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleApiKeyLogin = async () => {
  if (!apiKey.value) return

  loading.value = true
  error.value = ''

  try {
    await authStore.loginWithApiKey(apiKey.value)
    router.push('/dashboard')  
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Container & Layout */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 1.5rem;
}

.login-card {
  max-width: 28rem;
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

/* Form Sections */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.input-group {
  position: relative;
}

.form-input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 0.875rem;
  background: white;
  box-sizing: border-box;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-top {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  border-bottom: none;
}

.input-bottom {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.input-error {
  border-color: #dc2626;
}

.api-input {
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
}

.error-section {
  margin-top: 0.5rem;
}

.error-text {
  font-size: 0.875rem;
  color: #dc2626;
  margin: 0.25rem 0;
}

/* Options Section */
.options-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-section {
  display: flex;
  align-items: center;
}

.checkbox-input {
  height: 1rem;
  width: 1rem;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.checkbox-label {
  font-size: 0.875rem;
  color: #1e293b;
}

.link-text {
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.link-text:hover {
  color: #1e40af;
}

/* Alert Section */
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

/* Submit Section */
.submit-section {
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
  background-color: #3b82f6;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.submit-btn:hover:not(:disabled) {
  background-color: #1e40af;
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

/* Signup Section */
.signup-section {
  text-align: center;
}

.signup-text {
  font-size: 0.875rem;
  color: #64748b;
}

/* Divider Section */
.divider-section {
  margin-top: 1.5rem;
}

.divider-line {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.divider-line::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e2e8f0;
}

.divider-text {
  background-color: white;
  color: #64748b;
  font-size: 0.875rem;
  padding: 0 1rem;
  position: relative;
}

/* API Section */
.api-section {
  display: flex;
  flex-direction: column;
}

.api-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: #3b82f6;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
}

.api-btn:hover:not(.btn-disabled) {
  background-color: #f1f5f9;
  border-color: #3b82f6;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Responsive Styles */
@media (max-width: 640px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    padding: 1.5rem;
  }

  .options-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
