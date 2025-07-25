<template>
  <div class="provider-listings-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <span class="icon">🏥</span>
            Provider Listings Directory
          </h1>
          <p class="subtitle">Comprehensive directory of all registered healthcare providers in the APA Insurance network</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalProviders }}</div>
            <div class="stat-label">Total Providers</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ activeProviders }}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ suspendedProviders }}</div>
            <div class="stat-label">Suspended</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-section">
      <div class="content-header">
        <div class="search-section">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              v-model="searchTerm" 
              placeholder="Search providers, locations, categories..." 
              class="search-input"
            >
          </div>
        </div>
        <div class="filter-section">
          <div class="select-wrapper">
            <select v-model="categoryFilter" class="modern-select">
              <option value="all">All Categories</option>
              <option value="Hospital">Hospital</option>
              <option value="Clinic">Clinic</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Dental">Dental</option>
              <option value="Mental Health">Mental Health</option>
            </select>
            <span class="select-icon">⌄</span>
          </div>
          <div class="select-wrapper">
            <select v-model="statusFilter" class="modern-select">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <span class="select-icon">⌄</span>
          </div>
        </div>
      </div>

      <!-- Providers Table -->
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">
            <span class="table-icon">📋</span>
            Healthcare Providers
          </h2>
          <span class="provider-count">{{ filteredProviders.length }} providers</span>
        </div>
        
        <div class="table-wrapper">
          <table class="providers-table">
            <thead>
              <tr>
                <th class="th-icon"></th>
                <th class="th-name">Provider Name</th>
                <th class="th-category">Category</th>
                <th class="th-location">Location</th>
                <th class="th-contact">Contact Info</th>
                <th class="th-rating">Rating</th>
                <th class="th-stats">Statistics</th>
                <th class="th-status">Status</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="provider in filteredProviders" :key="provider.id" class="provider-row">
                <td class="td-icon">
                  <div class="provider-icon-wrapper">
                    <span class="provider-icon">{{ provider.icon }}</span>
                  </div>
                </td>
                <td class="td-name">
                  <div class="name-cell">
                    <h4 class="provider-name">{{ provider.name }}</h4>
                    <p class="provider-license">{{ provider.licenseNumber }}</p>
                  </div>
                </td>
                <td class="td-category">
                  <span class="category-badge">{{ provider.category }}</span>
                </td>
                <td class="td-location">
                  <div class="location-cell">
                    <span class="location-icon">📍</span>
                    <span class="location-text">{{ provider.location }}</span>
                  </div>
                </td>
                <td class="td-contact">
                  <div class="contact-cell">
                    <div class="contact-item">
                      <span class="contact-icon">📞</span>
                      <span class="contact-text">{{ provider.phone }}</span>
                    </div>
                    <div class="contact-item">
                      <span class="contact-icon">📧</span>
                      <span class="contact-text">{{ provider.email }}</span>
                    </div>
                  </div>
                </td>
                <td class="td-rating">
                  <div class="rating-cell">
                    <div class="rating-stars">
                      <span class="star">⭐</span>
                      <span class="rating-value">{{ provider.rating }}</span>
                    </div>
                  </div>
                </td>
                <td class="td-stats">
                  <div class="stats-cell">
                    <div class="stat-item">
                      <span class="stat-number">{{ provider.patientsServed }}</span>
                      <span class="stat-label">patients</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-number">{{ provider.yearsActive }}y</span>
                      <span class="stat-label">active</span>
                    </div>
                  </div>
                </td>
                <td class="td-status">
                  <span class="status-badge modern" :class="getStatusClass(provider.status)">
                    {{ provider.status }}
                  </span>
                </td>
                <td class="td-actions">
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewDetails(provider)" title="View Details">
                      <span class="action-icon">👁️</span>
                    </button>
                    <button class="action-btn edit" @click="editProvider(provider)" title="Edit Provider">
                      <span class="action-icon">✏️</span>
                    </button>
                    <button class="action-btn contact" @click="contactProvider(provider)" title="Contact Provider">
                      <span class="action-icon">📞</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Provider Details Panel -->
      <div class="details-panel" v-if="selectedProvider">
        <div class="panel-header">
          <h3 class="panel-title">
            <span class="panel-icon">{{ selectedProvider.icon }}</span>
            {{ selectedProvider.name }}
          </h3>
          <button class="close-panel" @click="selectedProvider = null">×</button>
        </div>
        <div class="panel-content">
          <div class="detail-grid">
            <div class="detail-item">
              <label class="detail-label">License Number</label>
              <span class="detail-value">{{ selectedProvider.licenseNumber }}</span>
            </div>
            <div class="detail-item">
              <label class="detail-label">Category</label>
              <span class="category-badge">{{ selectedProvider.category }}</span>
            </div>
            <div class="detail-item">
              <label class="detail-label">Location</label>
              <span class="detail-value">{{ selectedProvider.location }}</span>
            </div>
            <div class="detail-item">
              <label class="detail-label">Rating</label>
              <div class="rating-display">
                <span class="star">⭐</span>
                <span class="rating-value">{{ selectedProvider.rating }}</span>
              </div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Phone</label>
              <a :href="`tel:${selectedProvider.phone}`" class="detail-link">{{ selectedProvider.phone }}</a>
            </div>
            <div class="detail-item">
              <label class="detail-label">Email</label>
              <a :href="`mailto:${selectedProvider.email}`" class="detail-link">{{ selectedProvider.email }}</a>
            </div>
            <div class="detail-item">
              <label class="detail-label">Patients Served</label>
              <span class="detail-value highlight">{{ selectedProvider.patientsServed }}</span>
            </div>
            <div class="detail-item">
              <label class="detail-label">Years Active</label>
              <span class="detail-value highlight">{{ selectedProvider.yearsActive }} years</span>
            </div>
            <div class="detail-item full-width">
              <label class="detail-label">Status</label>
              <span class="status-badge modern" :class="getStatusClass(selectedProvider.status)">
                {{ selectedProvider.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="toast success-toast">
      <div class="toast-icon">✅</div>
      <div class="toast-content">
        <h4>Success!</h4>
        <p>{{ toastMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Form states
const searchTerm = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const selectedProvider = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

// Providers data
const providers = ref([
  {
    id: 1,
    name: 'Nairobi General Hospital',
    category: 'Hospital',
    location: 'Nairobi, Kenya',
    phone: '+254-700-123456',
    email: 'admin@nairobigeneral.co.ke',
    licenseNumber: 'LIC-NGH-2024-001',
    status: 'Active',
    rating: 4.8,
    icon: '🏥',
    patientsServed: '50K+',
    yearsActive: 15
  },
  {
    id: 2,
    name: 'Mombasa Medical Clinic',
    category: 'Clinic',
    location: 'Mombasa, Kenya',
    phone: '+254-700-789012',
    email: 'info@mombasamedical.co.ke',
    licenseNumber: 'LIC-MMC-2024-002',
    status: 'Active',
    rating: 4.6,
    icon: '🏪',
    patientsServed: '25K+',
    yearsActive: 8
  },
  {
    id: 3,
    name: 'Kisumu Pharmacy Plus',
    category: 'Pharmacy',
    location: 'Kisumu, Kenya',
    phone: '+254-700-345678',
    email: 'orders@kisumupharmacy.co.ke',
    licenseNumber: 'LIC-KPP-2024-003',
    status: 'Active',
    rating: 4.4,
    icon: '💊',
    patientsServed: '15K+',
    yearsActive: 5
  },
  {
    id: 4,
    name: 'Eldoret Diagnostic Center',
    category: 'Diagnostic',
    location: 'Eldoret, Kenya',
    phone: '+254-700-901234',
    email: 'lab@eldoretdiagnostic.co.ke',
    licenseNumber: 'LIC-EDC-2024-004',
    status: 'Suspended',
    rating: 3.9,
    icon: '🔬',
    patientsServed: '12K+',
    yearsActive: 7
  },
  {
    id: 5,
    name: 'Nakuru Dental Care',
    category: 'Dental',
    location: 'Nakuru, Kenya',
    phone: '+254-700-567890',
    email: 'appointments@nakurudental.co.ke',
    licenseNumber: 'LIC-NDC-2024-005',
    status: 'Active',
    rating: 4.7,
    icon: '🦷',
    patientsServed: '8K+',
    yearsActive: 3
  },
  {
    id: 6,
    name: 'Aga Khan Hospital',
    category: 'Hospital',
    location: 'Nairobi, Kenya',
    phone: '+254-700-111222',
    email: 'info@agakhan.co.ke',
    licenseNumber: 'LIC-AKH-2024-006',
    status: 'Active',
    rating: 4.9,
    icon: '🏥',
    patientsServed: '75K+',
    yearsActive: 25
  },
  {
    id: 7,
    name: 'Kenyatta National Hospital',
    category: 'Hospital',
    location: 'Nairobi, Kenya',
    phone: '+254-700-333444',
    email: 'admin@knh.co.ke',
    licenseNumber: 'LIC-KNH-2024-007',
    status: 'Active',
    rating: 4.5,
    icon: '🏥',
    patientsServed: '100K+',
    yearsActive: 50
  },
  {
    id: 8,
    name: 'Thika Mental Health Center',
    category: 'Mental Health',
    location: 'Thika, Kenya',
    phone: '+254-700-555666',
    email: 'care@thikamental.co.ke',
    licenseNumber: 'LIC-TMH-2024-008',
    status: 'Active',
    rating: 4.3,
    icon: '🧠',
    patientsServed: '3K+',
    yearsActive: 2
  },
  {
    id: 9,
    name: 'Mombasa Eye Clinic',
    category: 'Clinic',
    location: 'Mombasa, Kenya',
    phone: '+254-700-777888',
    email: 'info@mombasaeye.co.ke',
    licenseNumber: 'LIC-MEC-2024-009',
    status: 'Active',
    rating: 4.2,
    icon: '👁️',
    patientsServed: '6K+',
    yearsActive: 4
  },
  {
    id: 10,
    name: 'Karen Medical Centre',
    category: 'Hospital',
    location: 'Karen, Nairobi',
    phone: '+254-700-999000',
    email: 'reception@karenmedical.co.ke',
    licenseNumber: 'LIC-KMC-2024-010',
    status: 'Suspended',
    rating: 3.8,
    icon: '🏥',
    patientsServed: '18K+',
    yearsActive: 6
  }
])

// Computed properties
const totalProviders = computed(() => providers.value.length)

const activeProviders = computed(() => {
  return providers.value.filter(p => p.status === 'Active').length
})

const suspendedProviders = computed(() => {
  return providers.value.filter(p => p.status === 'Suspended').length
})

const filteredProviders = computed(() => {
  let filtered = providers.value

  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(provider => 
      provider.name.toLowerCase().includes(search) ||
      provider.location.toLowerCase().includes(search) ||
      provider.category.toLowerCase().includes(search) ||
      provider.email.toLowerCase().includes(search) ||
      provider.licenseNumber.toLowerCase().includes(search)
    )
  }

  // Apply category filter
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(provider => provider.category === categoryFilter.value)
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(provider => provider.status === statusFilter.value)
  }

  return filtered
})

// Methods
const viewDetails = (provider) => {
  selectedProvider.value = provider
}

const editProvider = (provider) => {
  showToastMessage(`Editing ${provider.name}`)
}

const contactProvider = (provider) => {
  showToastMessage(`Contacting ${provider.name}`)
}

const getStatusClass = (status) => {
  const statusMap = {
    'Active': 'active',
    'Suspended': 'suspended',
    'Inactive': 'inactive'
  }
  return statusMap[status] || 'default'
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
/* Container and Layout */
.provider-listings-container {
  min-height: 100vh;
  background: white;
  padding: 0;
}

/* Header Section */
.header-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  flex: 1;
}

.main-title {
  color: #1e293b;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 2rem;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

/* Content Section */
.content-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-section {
  display: flex;
  gap: 1rem;
}

.select-wrapper {
  position: relative;
}

.modern-select {
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  min-width: 140px;
}

.modern-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 1.25rem;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
}

.table-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-icon {
  font-size: 1.125rem;
}

.provider-count {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Table Styles */
.table-wrapper {
  overflow-x: auto;
}

.providers-table {
  width: 100%;
  border-collapse: collapse;
}

.providers-table th,
.providers-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.providers-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.provider-row {
  transition: all 0.2s ease;
}

.provider-row:hover {
  background: #f8fafc;
}

/* Table Column Widths */
.th-icon {
  width: 60px;
}

.th-name {
  width: 220px;
}

.th-category {
  width: 120px;
}

.th-location {
  width: 150px;
}

.th-contact {
  width: 200px;
}

.th-rating {
  width: 80px;
  text-align: center;
}

.th-stats {
  width: 120px;
  text-align: center;
}

.th-status {
  width: 100px;
}

.th-actions {
  width: 120px;
  text-align: center;
}

/* Table Cell Content */
.provider-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 0.5rem;
}

.provider-icon {
  font-size: 1.5rem;
}

.name-cell {
  display: flex;
  flex-direction: column;
}

.provider-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.provider-license {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  font-family: monospace;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.category-badge {
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.location-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon {
  color: #6b7280;
}

.location-text {
  color: #4b5563;
  font-size: 0.875rem;
}

.contact-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-icon {
  font-size: 0.75rem;
  color: #6b7280;
  width: 16px;
}

.contact-text {
  font-size: 0.75rem;
  color: #4b5563;
}

.rating-cell {
  display: flex;
  justify-content: center;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star {
  color: #fbbf24;
}

.rating-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.stats-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.625rem;
  color: #6b7280;
}

/* Status Badges */
.status-badge.modern {
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.status-badge.suspended {
  background: rgba(239, 68, 68, 0.1);
  color: #991b1b;
}

.status-badge.inactive {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.action-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.action-btn.view:hover {
  background: rgba(59, 130, 246, 0.1);
}

.action-btn.edit:hover {
  background: rgba(245, 158, 11, 0.1);
}

.action-btn.contact:hover {
  background: rgba(16, 185, 129, 0.1);
}

.action-icon {
  font-size: 0.875rem;
}

/* Details Panel */
.details-panel {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
}

.panel-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-icon {
  font-size: 1.5rem;
}

.close-panel {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.close-panel:hover {
  background: #f3f4f6;
  color: #374151;
}

.panel-content {
  padding: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.full-width {
  grid-column: span 3;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
}

.detail-value.highlight {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}

.detail-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.detail-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-icon {
  font-size: 1.5rem;
}

.toast-content h4 {
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  font-size: 0.875rem;
}

.toast-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.75rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-section {
    max-width: none;
  }
  
  .filter-section {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .provider-listings-container {
    padding: 0;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .table-wrapper {
    overflow-x: scroll;
  }
  
  .providers-table {
    min-width: 900px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .detail-item.full-width {
    grid-column: span 2;
  }
  
  .header-stats {
    gap: 1rem;
  }
  
  .filter-section {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .table-header {
    padding: 1rem;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item.full-width {
    grid-column: span 1;
  }
}
</style>