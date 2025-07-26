<template>
  <nav class="top-nav">
    <div class="nav-container">
      <div class="logo">
        <img src="@/assets/happiness.jpeg" alt="Providers Portal" class="logo-img">
        <span class="logo-text">Providers Portal</span>
      </div>
      <div class="auth-section">
        <button class="login-btn" v-if="!isLoggedIn" @click="login">Login</button>
        <button class="logout-btn" v-else @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(true) // Default to logged in for demo

const login = () => {
  isLoggedIn.value = true
}

const logout = () => {
  isLoggedIn.value = false
}
</script>

<style scoped>
.top-nav {
  background-color: #1e40af;
  color: white;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.auth-section {
  display: flex;
  align-items: center;
}

.login-btn, .logout-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.login-btn:hover, .logout-btn:hover {
  background-color: #2563eb;
}

.logout-btn {
  background-color: #ef4444;
}

.logout-btn:hover {
  background-color: #dc2626;
}
</style>
