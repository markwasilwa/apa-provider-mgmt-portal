<template>
  <div class="login-container">
    <div class="login-card">
      <div>
        <div class="logo-section">
          <img src="@/assets/logo.svg" alt="APA Insurance" class="logo-img">
        </div>
        <h2 class="main-title">
          Forgot your password?
        </h2>
        <p class="subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.email }"
            placeholder="Enter your email address"
          >
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ success }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || success"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Sending...' : success ? 'Email Sent' : 'Send Reset Link' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const validateForm = () => {
  errors.email = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.forgotPassword(form.email)
    success.value = 'If an account with that email exists, we\'ve sent you a password reset link.'
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
  text-align: center;
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
  margin: 0 0 2rem 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}
</style>