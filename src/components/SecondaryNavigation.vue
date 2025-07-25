<template>
  <nav class="secondary-nav">
    <div class="nav-container">
      <ul class="nav-menu">
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeItem === 'dashboard' }" @click="setActive('dashboard')">
            Dashboard
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeItem === 'category' }" @click="setActive('category')">
            Provider Category
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeItem === 'requests' }" @click="setActive('requests')">
            Provider Requests
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeItem === 'visits' }" @click="setActive('visits')">
            Provider Visits
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeItem === 'listings' }" @click="setActive('listings')">
            Provider Listings
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeItem === 'reports' }" @click="setActive('reports')">
            Reports
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: activeItem === 'password' }" @click="setActive('password')">
            Change Password
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const activeItem = ref('dashboard')

const emit = defineEmits(['navigate'])

const setActive = (item) => {
  activeItem.value = item
  emit('navigate', item)
}
</script>

<style scoped>
.secondary-nav {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: block;
  padding: 1rem 1.5rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.nav-link:hover {
  color: #1e40af;
  background-color: #f1f5f9;
}

.nav-link.active {
  color: #1e40af;
  border-bottom-color: #1e40af;
  background-color: #f1f5f9;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
  }
}
</style>