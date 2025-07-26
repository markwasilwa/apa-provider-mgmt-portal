<template>
  <div class="provider-listings-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <BuildingOffice2Icon class="icon" />
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
            <MagnifyingGlassIcon class="search-icon" />
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
            <ChevronDownIcon class="select-icon" />
          </div>
          <div class="select-wrapper">
            <select v-model="statusFilter" class="modern-select">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDownIcon class="select-icon" />
          </div>
          <div class="view-mode-toggle">
            <button 
              @click="viewMode = 'list'" 
              :class="{ active: viewMode === 'list' }" 
              class="view-mode-btn"
              title="Compact List View"
            >
              <ListBulletIcon class="view-mode-icon" />
            </button>
            <button 
              @click="viewMode = 'cards'" 
              :class="{ active: viewMode === 'cards' }" 
              class="view-mode-btn"
              title="Compact Cards View"
            >
              <RectangleStackIcon class="view-mode-icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- Providers Container -->
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">
            <component :is="viewMode === 'list' ? ListBulletIcon : RectangleStackIcon" class="table-icon" />
            Healthcare Providers
          </h2>
          <span class="provider-count">{{ totalProviders }} providers</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading providers...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3>Error Loading Providers</h3>
          <p>{{ error }}</p>
          <button @click="loadProviders" class="retry-btn">Retry</button>
        </div>

        <!-- Table View (List) -->
        <div v-else-if="viewMode === 'list'" class="table-wrapper">
          <table class="providers-table">
            <thead>
              <tr>
                <th class="th-icon"></th>
                <th class="th-name">Provider Name</th>
                <th class="th-category">Category</th>
                <th class="th-location">Location</th>
                <th class="th-contact">Contact Info</th>
                <th class="th-status">Status</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="provider in filteredProviders" :key="provider.id" class="provider-row">
                <td class="td-icon">
                  <div class="provider-icon-wrapper">
                    <BuildingOffice2Icon class="provider-icon" />
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
                    <MapPinIcon class="location-icon" />
                    <span class="location-text">{{ provider.location }}</span>
                  </div>
                </td>
                <td class="td-contact">
                  <div class="contact-cell">
                    <div class="contact-item">
                      <PhoneIcon class="contact-icon" />
                      <span class="contact-text">{{ provider.phone }}</span>
                    </div>
                    <div class="contact-item">
                      <EnvelopeIcon class="contact-icon" />
                      <span class="contact-text">{{ provider.email }}</span>
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
                      <EyeIcon class="action-icon" />
                    </button>
                    <button class="action-btn edit" @click="editProvider(provider)" title="Edit Provider">
                      <PencilIcon class="action-icon" />
                    </button>
                    <button class="action-btn contact" @click="contactProvider(provider)" title="Contact Provider">
                      <PhoneIcon class="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards View -->
        <div v-else class="cards-wrapper">
          <div class="cards-grid">
            <div 
              v-for="provider in filteredProviders" 
              :key="provider.id" 
              class="provider-card"
              @click="viewDetails(provider)"
            >
              <div class="card-header">
                <div class="card-icon-wrapper">
                  <BuildingOffice2Icon class="card-icon" />
                </div>
                <span class="status-badge modern compact" :class="getStatusClass(provider.status)">
                  {{ provider.status }}
                </span>
              </div>
              <div class="card-body">
                <h4 class="card-title">{{ provider.name }}</h4>
                <div class="card-category">
                  <span class="category-badge compact">{{ provider.category }}</span>
                </div>
                <div class="card-location">
                  <MapPinIcon class="location-icon" />
                  <span class="location-text">{{ provider.location }}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-actions">
                  <button class="action-btn edit" @click.stop="editProvider(provider)" title="Edit Provider">
                    <PencilIcon class="action-icon" />
                  </button>
                  <button class="action-btn contact" @click.stop="contactProvider(provider)" title="Contact Provider">
                    <PhoneIcon class="action-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && totalPages > 1" class="pagination-section">
          <div class="pagination-info">
            <span>Page {{ currentPage + 1 }} of {{ totalPages }} ({{ totalProviders }} total providers)</span>
          </div>
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 0" class="pagination-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div class="page-numbers">
              <button 
                v-for="page in Math.min(5, totalPages)" 
                :key="page - 1"
                @click="goToPage(page - 1)"
                :class="{ active: currentPage === page - 1 }"
                class="page-number"
              >
                {{ page }}
              </button>
            </div>

            <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="pagination-btn">
              Next
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Provider Details Panel -->
      <div class="details-panel" v-if="selectedProvider">
        <div class="panel-header">
          <h3 class="panel-title">
            <BuildingOffice2Icon class="panel-icon" />
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
              <label class="detail-label">Phone</label>
              <a :href="`tel:${selectedProvider.phone}`" class="detail-link">{{ selectedProvider.phone }}</a>
            </div>
            <div class="detail-item">
              <label class="detail-label">Email</label>
              <a :href="`mailto:${selectedProvider.email}`" class="detail-link">{{ selectedProvider.email }}</a>
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
      <div class="toast-icon">
        <CheckCircleIcon class="toast-icon-svg" />
      </div>
      <div class="toast-content">
        <h4>Success!</h4>
        <p>{{ toastMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ProviderAPIService, transformProviderData } from '@/services/api'
import { 
  BuildingOffice2Icon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  ListBulletIcon,
  RectangleStackIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Form states
const searchTerm = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const selectedProvider = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const viewMode = ref('list') // 'list' or 'cards'

// API states
const providers = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(0)
const pageSize = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)

// Mock providers data (fallback)
const mockProviders = ref([
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

// Load providers from API
const loadProviders = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await ProviderAPIService.getProviderEntities({
      page: currentPage.value,
      size: pageSize.value,
      sortBy: 'companyName',
      sortDirection: 'ASC'
    })

    if (response.status === 0 && response.content) {
      const transformedProviders = response.content.content.map(transformProviderData)
      providers.value = transformedProviders
      totalPages.value = response.content.page.totalPages
      totalElements.value = response.content.page.totalElements
    } else {
      throw new Error(response.message || 'Failed to load providers')
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading providers:', err)
    // Fallback to mock data
    providers.value = mockProviders.value
    totalElements.value = mockProviders.value.length
    showToastMessage(`Using offline data - API unavailable`)
  } finally {
    loading.value = false
  }
}

// Search providers
const searchProviders = async (searchTerm) => {
  if (!searchTerm.trim()) {
    await loadProviders()
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await ProviderAPIService.searchProviders(searchTerm, {
      page: currentPage.value,
      size: pageSize.value
    })

    if (response.status === 0 && response.content) {
      const transformedProviders = response.content.content.map(transformProviderData)
      providers.value = transformedProviders
      totalPages.value = response.content.page.totalPages
      totalElements.value = response.content.page.totalElements
    } else {
      throw new Error(response.message || 'Search failed')
    }
  } catch (err) {
    error.value = err.message
    console.error('Error searching providers:', err)
    // Fallback to local search on mock data
    const search = searchTerm.toLowerCase()
    const filtered = mockProviders.value.filter(provider => 
      provider.name.toLowerCase().includes(search) ||
      provider.location.toLowerCase().includes(search) ||
      provider.category.toLowerCase().includes(search)
    )
    providers.value = filtered
    totalElements.value = filtered.length
    showToastMessage(`Search completed using offline data`)
  } finally {
    loading.value = false
  }
}

// Computed properties
const totalProviders = computed(() => totalElements.value || providers.value.length)

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

// Page navigation
const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    loadProviders()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    goToPage(currentPage.value - 1)
  }
}

// Watchers
let searchTimeout = null

watch(searchTerm, (newSearch) => {
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    if (newSearch.trim()) {
      searchProviders(newSearch)
    } else {
      loadProviders()
    }
  }, 500)
})

// Initialize
onMounted(() => {
  loadProviders()
})
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
  padding: 0.3rem 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  flex: 1;
}

.main-title {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.85rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  color: #1e293b;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
  color: #3b82f6;
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
  padding: 1.2rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  gap: 0.8rem;
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
  width: 1.25rem;
  height: 1.25rem;
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
  width: 1.25rem;
  height: 1.25rem;
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
  padding: 1rem 1.5rem;
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
  width: 1.125rem;
  height: 1.125rem;
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
  padding: 0.6rem;
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
  width: 50px;
}

.th-name {
  width: 200px;
}

.th-category {
  width: 100px;
}

.th-location {
  width: 140px;
}

.th-contact {
  width: 180px;
}

.th-status {
  width: 90px;
}

.th-actions {
  width: 110px;
  text-align: center;
}

/* Table Cell Content */
.provider-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 0.4rem;
}

.provider-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.name-cell {
  display: flex;
  flex-direction: column;
}

.provider-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.2rem 0;
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
  padding: 0.2rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.7rem;
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
  width: 1rem;
  height: 1rem;
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
  color: #6b7280;
  width: 1rem;
  height: 1rem;
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
  width: 1rem;
  height: 1rem;
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
  padding: 0.25rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.7rem;
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
  width: 1rem;
  height: 1rem;
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
  width: 1.5rem;
  height: 1.5rem;
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

/* Loading and Error States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #ef4444;
  text-align: center;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  color: #fbbf24;
}

.error-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.25rem;
}

.error-state p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #2563eb;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 1rem;
  height: 1rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  width: 2rem;
  height: 2rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.page-number.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
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

/* View Mode Toggle */
.view-mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.view-mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-mode-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.view-mode-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.view-mode-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Cards View */
.cards-wrapper {
  padding: 1rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.provider-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.provider-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 0.5rem;
}

.card-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.card-body {
  padding: 0.7rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.3rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-category {
  margin-bottom: 0.3rem;
}

.category-badge.compact {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
}

.card-location {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0;
  font-size: 0.75rem;
  color: #4b5563;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-footer {
  padding: 0.7rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.card-stats {
  display: flex;
  gap: 1rem;
}

.stat-item.compact {
  font-size: 0.8rem;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
}

.status-badge.compact {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
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
    align-items: flex-start;
  }

  .view-mode-toggle {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .card-stats {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .view-mode-toggle {
    width: 100%;
    justify-content: space-between;
  }

  .view-mode-btn {
    flex: 1;
  }
}
</style>
