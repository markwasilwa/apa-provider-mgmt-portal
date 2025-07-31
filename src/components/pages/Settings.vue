<template>
  <div class="settings-page">

    <div class="content-section">
      <!-- Settings Navigation -->
      <div class="settings-nav">
        <nav class="settings-menu">
          <ul class="menu-list">
            <li v-if="authStore.isAdmin" class="menu-item">
              <button 
                @click="activeTab = 'profiles'"
                class="menu-button"
                :class="{ 'active': activeTab === 'profiles' }"
              >
                <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                User Management
              </button>
            </li>
            <li v-if="!authStore.isProvider" class="menu-item">
              <button 
                @click="activeTab = 'categories'"
                class="menu-button"
                :class="{ 'active': activeTab === 'categories' }"
              >
                <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 017-4z"></path>
                </svg>
                Categories & Countries
              </button>
            </li>
            <li v-if="authStore.isAdmin" class="menu-item">
              <button 
                @click="activeTab = 'system'"
                class="menu-button"
                :class="{ 'active': activeTab === 'system' }"
              >
                <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
                System Configuration
              </button>
            </li>
            <li class="menu-item">
              <button 
                @click="activeTab = 'preferences'"
                class="menu-button"
                :class="{ 'active': activeTab === 'preferences' }"
              >
                <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                User Preferences
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="settings-content">
        <!-- Categories & Countries Tab -->
        <div v-if="activeTab === 'categories'" class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Categories & Countries</h2>
            <p class="section-description">Manage provider categories and supported countries</p>
          </div>

          <div class="content-card responsive-content">
            <ProviderCategory />
          </div>
        </div>

        <!-- User Management Tab -->
        <div v-if="activeTab === 'profiles' && authStore.isAdmin" class="settings-section">
          <div class="section-header">
            <div class="header-content">
              <div class="title-group">
                <h2 class="section-title">
                  <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  User Management
                </h2>
                <p class="section-description">Manage user accounts across the system</p>
              </div>
              <div class="header-actions">
                <button class="action-button">
                  <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add User
                </button>
              </div>
            </div>
          </div>

          <div class="content-card responsive-content">
            <UserManagement :showHeader="false" />
          </div>
        </div>

        <!-- System Configuration Tab -->
        <div v-if="activeTab === 'system' && authStore.isAdmin" class="settings-section">
          <div class="section-header">
            <h2 class="section-title">System Configuration</h2>
            <p class="section-description">Configure system-wide settings and parameters</p>
          </div>

          <div class="content-grid">
            <!-- API Settings -->
            <div class="config-card">
              <div class="card-header">
                <h3 class="card-title">API Configuration</h3>
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="card-content">
                <div class="setting-item">
                  <label class="setting-label">API Base URL</label>
                  <input 
                    type="url" 
                    class="setting-input" 
                    value="http://localhost:8080"
                    readonly
                  >
                </div>
                <div class="setting-item">
                  <label class="setting-label">Request Timeout (ms)</label>
                  <input 
                    type="number" 
                    class="setting-input" 
                    value="30000"
                    min="1000"
                    max="120000"
                  >
                </div>
                <div class="setting-item">
                  <label class="setting-label">Rate Limiting</label>
                  <select class="setting-input">
                    <option value="100">100 requests/minute</option>
                    <option value="500" selected>500 requests/minute</option>
                    <option value="1000">1000 requests/minute</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Security Settings -->
            <div class="config-card">
              <div class="card-header">
                <h3 class="card-title">Security Settings</h3>
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div class="card-content">
                <div class="setting-item">
                  <label class="setting-label">Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    class="setting-input" 
                    value="60"
                    min="15"
                    max="480"
                  >
                </div>
                <div class="setting-item">
                  <label class="setting-label">Password Policy</label>
                  <select class="setting-input">
                    <option value="basic">Basic (8+ characters)</option>
                    <option value="medium" selected>Medium (8+ chars, numbers)</option>
                    <option value="strong">Strong (8+ chars, numbers, symbols)</option>
                  </select>
                </div>
                <div class="setting-item">
                  <label class="setting-label">Two-Factor Authentication</label>
                  <div class="toggle-switch">
                    <input type="checkbox" id="2fa-toggle" class="toggle-input">
                    <label for="2fa-toggle" class="toggle-label">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Email Settings -->
            <div class="config-card">
              <div class="card-header">
                <h3 class="card-title">Email Configuration</h3>
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="card-content">
                <div class="setting-item">
                  <label class="setting-label">SMTP Server</label>
                  <input 
                    type="text" 
                    class="setting-input" 
                    placeholder="smtp.gmail.com"
                  >
                </div>
                <div class="setting-item">
                  <label class="setting-label">SMTP Port</label>
                  <input 
                    type="number" 
                    class="setting-input" 
                    value="587"
                  >
                </div>
                <div class="setting-item">
                  <label class="setting-label">Email Notifications</label>
                  <div class="toggle-switch">
                    <input type="checkbox" id="email-toggle" class="toggle-input" checked>
                    <label for="email-toggle" class="toggle-label">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Database Settings -->
            <div class="config-card">
              <div class="card-header">
                <h3 class="card-title">Database Configuration</h3>
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                </svg>
              </div>
              <div class="card-content">
                <div class="setting-item">
                  <label class="setting-label">Connection Pool Size</label>
                  <input 
                    type="number" 
                    class="setting-input" 
                    value="20"
                    min="5"
                    max="100"
                  >
                </div>
                <div class="setting-item">
                  <label class="setting-label">Query Timeout (seconds)</label>
                  <input 
                    type="number" 
                    class="setting-input" 
                    value="30"
                    min="5"
                    max="300"
                  >
                </div>
                <div class="setting-item">
                  <label class="setting-label">Auto Backup</label>
                  <select class="setting-input">
                    <option value="daily" selected>Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="settings-actions">
            <button class="btn btn-outline">Reset to Defaults</button>
            <button class="btn btn-primary">Save Configuration</button>
          </div>
        </div>

        <!-- User Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="settings-section">
          <div class="section-header">
            <h2 class="section-title">User Preferences</h2>
            <p class="section-description">Customize your personal settings and preferences</p>
          </div>

          <div class="content-grid">
            <!-- Display Preferences -->
            <div class="config-card">
              <div class="card-header">
                <h3 class="card-title">Display Settings</h3>
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="card-content">
                <div class="setting-item">
                  <label class="setting-label">Theme</label>
                  <select class="setting-input">
                    <option value="light" selected>Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div class="setting-item">
                  <label class="setting-label">Language</label>
                  <select class="setting-input">
                    <option value="en" selected>English</option>
                    <option value="sw">Swahili</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div class="setting-item">
                  <label class="setting-label">Items per page</label>
                  <select class="setting-input">
                    <option value="10">10</option>
                    <option value="20" selected>20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Notification Preferences -->
            <div class="config-card">
              <div class="card-header">
                <h3 class="card-title">Notifications</h3>
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM7 7h10v10H7V7zm10-5H7a2 2 0 00-2 2v.586l.414.414L7 7h10V4a2 2 0 00-2-2z"></path>
                </svg>
              </div>
              <div class="card-content">
                <div class="setting-item">
                  <label class="setting-label">Email Notifications</label>
                  <div class="toggle-switch">
                    <input type="checkbox" id="email-notif-toggle" class="toggle-input" checked>
                    <label for="email-notif-toggle" class="toggle-label">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">Browser Notifications</label>
                  <div class="toggle-switch">
                    <input type="checkbox" id="browser-notif-toggle" class="toggle-input">
                    <label for="browser-notif-toggle" class="toggle-label">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">Sound Notifications</label>
                  <div class="toggle-switch">
                    <input type="checkbox" id="sound-notif-toggle" class="toggle-input" checked>
                    <label for="sound-notif-toggle" class="toggle-label">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="settings-actions">
            <button class="btn btn-outline">Reset Preferences</button>
            <button class="btn btn-primary">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ProviderCategory from '@/components/pages/ProviderCategory.vue'
import UserManagement from '@/components/pages/UserManagement.vue'

const authStore = useAuthStore()
const activeTab = ref(authStore.isProvider ? 'preferences' : 'profiles')
</script>

<style scoped>
.settings-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Section */
.header-section {
  margin-bottom: 1.5rem;
  padding: 1rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-group {
  max-width: 800px;
}

.main-title {
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
  color: #1e40af;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.content-section {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* Settings Navigation */
.settings-nav {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: sticky;
  top: 1rem;
}

.settings-menu {
  padding: 0.75rem 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  margin: 0;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.menu-button:hover {
  color: #1e40af;
  background-color: #f1f5f9;
}

.menu-button.active {
  color: #1e40af;
  background-color: #f1f5f9;
  border-left-color: #1e40af;
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Settings Content */
.settings-content {
  min-height: 500px;
}

.settings-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.section-header {
  padding: 1.25rem 1.5rem 0.75rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.section-description {
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
}

.title-group .section-description {
  padding: 0.5rem 0;
}

.section-header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #1e40af;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: #1e40af;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #1d4ed8;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.content-card {
  padding: 0;
}

.responsive-content {
  width: 100%;
  overflow-x: auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  padding: 1.25rem;
}

/* Configuration Cards */
.config-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-icon {
  width: 1rem;
  height: 1rem;
  color: #64748b;
}

.card-content {
  padding: 1rem;
}

.setting-item {
  margin-bottom: 0.875rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.setting-input {
  width: 100%;
  padding: 0.375rem 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  background-color: white;
  transition: all 0.2s;
}

.setting-input:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.1);
}

/* Toggle Switch */
.toggle-switch {
  display: flex;
  align-items: center;
}

.toggle-input {
  display: none;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 2.5rem;
  height: 1.25rem;
  background-color: #d1d5db;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-slider {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-label {
  background-color: #1e40af;
}

.toggle-input:checked + .toggle-label .toggle-slider {
  transform: translateX(1.25rem);
}

/* Settings Actions */
.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
  min-width: 100px;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .content-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .settings-nav {
    position: static;
  }

  .settings-menu {
    padding: 0.5rem;
  }

  .menu-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .menu-item {
    flex: 1 1 auto;
    min-width: 150px;
  }

  .menu-button {
    border-left: none;
    border-bottom: 2px solid transparent;
    justify-content: center;
    padding: 0.5rem;
  }

  .menu-button.active {
    border-left: none;
    border-bottom-color: #1e40af;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }

  .content-grid {
    grid-template-columns: 1fr;
    padding: 0.75rem;
  }

  .section-header {
    padding: 1rem 0.75rem 0.75rem 0.75rem;
  }

  .settings-actions {
    flex-direction: column;
    padding: 0.75rem;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .menu-list {
    flex-direction: column;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }
}
</style>
