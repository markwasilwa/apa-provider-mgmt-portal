<template>
  <div class="provider-categories-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <ClipboardDocumentListIcon class="icon" />
            Master: Category & Country
          </h1>
          <p class="subtitle">Manage and organize different healthcare provider types and their associated facilities</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalActiveProviders }}</div>
            <div class="stat-label">Active Providers</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ categories.length }}</div>
            <div class="stat-label">Categories</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalRegistered }}</div>
            <div class="stat-label">Total Registered</div>
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
              placeholder="Search categories..." 
              class="search-input"
            >
          </div>
        </div>
        <div class="action-section">
          <button class="filter-btn" @click="toggleFilter">
            <FunnelIcon class="btn-icon" />
            Filter
          </button>
          <button class="add-btn thin-btn" @click="showAddModal = true">
            <PlusIcon class="btn-icon" />
            Add Category
          </button>
        </div>
      </div>

      <!-- Countries Section -->
      <div class="table-container countries-section">
        <div class="table-header">
          <h2 class="table-title">
            <FlagIcon class="table-icon" />
            Provider Countries
          </h2>
          <span class="country-count">{{ countries.length }} countries</span>
        </div>

        <div class="table-wrapper">
          <!-- Loading State -->
          <div v-if="loading && countries.length === 0" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading countries...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error && countries.length === 0" class="error-state">
            <ExclamationTriangleIcon class="error-icon" />
            <h3>Error Loading Countries</h3>
            <p>{{ error }}</p>
            <button @click="loadCountries" class="retry-btn">Retry</button>
          </div>

          <!-- Countries Grid -->
          <div v-else class="countries-grid">
            <div v-for="country in countries" :key="country.id" class="country-card">
              <div class="country-flag"><FlagIcon class="country-flag-icon" /></div>
              <div class="country-name">{{ country.country }}</div>
              <div class="country-meta">
                <span class="country-id">ID: {{ country.id }}</span>
                <span class="country-date">Added: {{ formatDate(country.creationDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && !error && countries.length === 0" class="empty-state">
            <FlagIcon class="empty-icon" />
            <h3>No Countries Found</h3>
            <p>No countries have been added to the system yet.</p>
          </div>
        </div>
      </div>

      <!-- Categories Table -->
      <div class="table-container categories-section">
        <div class="table-header">
          <h2 class="table-title">
            <ChartBarIcon class="table-icon" />
            Provider Categories
          </h2>
          <span class="category-count">{{ filteredCategories.length }} categories</span>
        </div>

        <div class="table-wrapper">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <ExclamationTriangleIcon class="error-icon" />
            <h3>Error Loading Categories</h3>
            <p>{{ error }}</p>
            <button @click="loadCategories" class="retry-btn">Retry</button>
          </div>

          <!-- Table View -->
          <table v-else class="categories-table">
            <thead>
              <tr>
                <th class="th-icon"></th>
                <th class="th-name">Category Name</th>
                <th class="th-description">Description</th>
                <th class="th-active">Active</th>
                <th class="th-total">Total</th>
                <th class="th-status">Status</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="category in filteredCategories" :key="category.id">
                <tr class="category-row">
                  <td class="td-icon">
                    <div class="category-icon-wrapper">
                      <span class="category-icon">{{ category.icon }}</span>
                    </div>
                  </td>
                  <td class="td-name">
                    <div class="name-cell">
                      <h4 class="category-name">{{ category.name }}</h4>
                      <p class="category-code">{{ category.code }}</p>
                    </div>
                  </td>
                  <td class="td-description">
                    <p class="description-text">{{ category.description }}</p>
                  </td>
                  <td class="td-active">
                    <div class="stat-display">
                      <span class="stat-number">{{ category.activeProviders }}</span>
                      <span class="stat-label">providers</span>
                    </div>
                  </td>
                  <td class="td-total">
                    <div class="stat-display">
                      <span class="stat-number">{{ category.totalRegistered }}</span>
                      <span class="stat-label">registered</span>
                    </div>
                  </td>
                  <td class="td-status">
                    <span class="status-badge modern" :class="getStatusClass(category.status)">
                      {{ category.status }}
                    </span>
                  </td>
                  <td class="td-actions">
                    <div class="action-buttons">
                      <button class="action-btn view" @click="viewCategory(category)" title="View Details">
                        <EyeIcon class="action-icon" />
                      </button>
                      <button class="action-btn edit" @click="editCategory(category)" title="Edit Category">
                        <PencilIcon class="action-icon" />
                      </button>
                      <button class="action-btn delete" @click="deleteCategory(category.id)" title="Delete Category">
                        <TrashIcon class="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
                <!-- Inline Details Row -->
                <tr v-if="selectedCategory && selectedCategory.id === category.id" class="details-row">
                <td colspan="7" class="details-cell">
                  <div class="inline-details">
                    <div class="inline-details-header">
                      <h4 class="inline-details-title">
                        <span class="panel-icon">{{ selectedCategory.icon }}</span>
                        {{ selectedCategory.name }} Details
                      </h4>
                      <button class="close-details" @click="selectedCategory = null">×</button>
                    </div>
                    <div class="inline-details-content">
                      <!-- View Mode -->
                      <div v-if="!isInlineEditing" class="detail-grid">
                        <div class="detail-section">
                          <h4 class="section-title">Basic Information</h4>
                          <div class="detail-item">
                            <label class="detail-label">Category Code</label>
                            <span class="detail-value">{{ selectedCategory.code }}</span>
                          </div>
                          <div class="detail-item">
                            <label class="detail-label">Status</label>
                            <span class="status-badge modern" :class="getStatusClass(selectedCategory.status)">
                              {{ selectedCategory.status }}
                            </span>
                          </div>
                        </div>
                        <div class="detail-section">
                          <h4 class="section-title">Statistics</h4>
                          <div class="detail-item">
                            <label class="detail-label">Active Providers</label>
                            <span class="detail-value highlight">{{ selectedCategory.activeProviders }}</span>
                          </div>
                          <div class="detail-item">
                            <label class="detail-label">Total Registered</label>
                            <span class="detail-value highlight">{{ selectedCategory.totalRegistered }}</span>
                          </div>
                          <div class="detail-item">
                            <label class="detail-label">Registration Rate</label>
                            <span class="detail-value">{{ Math.round((selectedCategory.activeProviders / selectedCategory.totalRegistered) * 100) }}%</span>
                          </div>
                        </div>
                        <div class="detail-section">
                          <h4 class="section-title">Description</h4>
                          <div class="detail-item">
                            <span class="detail-description">{{ selectedCategory.description }}</span>
                          </div>
                          <div class="inline-actions">
                            <button @click="editCategory(selectedCategory)" class="btn-compact btn-edit">
                              <PencilIcon class="btn-icon-sm" />
                              Edit
                            </button>
                            <button @click="deleteCategory(selectedCategory.id)" class="btn-compact btn-delete">
                              <TrashIcon class="btn-icon-sm" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Edit Mode -->
                      <div v-else class="inline-edit-form">
                        <form @submit.prevent="saveCategory" class="compact-form">
                          <div class="form-grid compact">
                            <div class="input-group">
                              <label class="input-label">Category Name</label>
                              <input 
                                type="text" 
                                v-model="categoryForm.name" 
                                required 
                                class="modern-input"
                                placeholder="Enter category name"
                              >
                            </div>
                            <div class="input-group">
                              <label class="input-label">Category Code</label>
                              <input 
                                type="text" 
                                v-model="categoryForm.code" 
                                required 
                                class="modern-input"
                                placeholder="e.g., HOSP, INDV"
                              >
                            </div>
                            <div class="input-group">
                              <label class="input-label">Icon (Emoji)</label>
                              <input 
                                type="text" 
                                v-model="categoryForm.icon" 
                                class="modern-input"
                                placeholder="Icon emoji"
                                maxlength="2"
                              >
                            </div>
                            <div class="input-group">
                              <label class="input-label">Status</label>
                              <div class="select-wrapper">
                                <select v-model="categoryForm.status" class="modern-select">
                                  <option value="Active">Active</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                                <span class="select-icon">⌄</span>
                              </div>
                            </div>
                            <div class="input-group full-width">
                              <label class="input-label">Description</label>
                              <textarea 
                                v-model="categoryForm.description" 
                                rows="2" 
                                class="modern-textarea"
                                placeholder="Enter category description"
                              ></textarea>
                            </div>
                          </div>
                          <div class="form-actions">
                            <button type="button" @click="closeModal" class="btn-compact btn-secondary">
                              Cancel
                            </button>
                            <button type="submit" class="btn-compact btn-primary">
                              <span class="btn-icon-sm">💾</span>
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </template>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="!loading && !error && categories.length === 0" class="empty-state">
            <DocumentIcon class="empty-icon" />
            <h3>No Categories Found</h3>
            <p>No categories match your current search criteria.</p>
            <button @click="resetSearch" class="primary-btn">Reset Search</button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && totalPages > 1" class="pagination-section">
          <div class="pagination-info">
            <span>Page {{ currentPage + 1 }} of {{ totalPages }} ({{ totalElements }} total categories)</span>
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

    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal modern" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <PlusIcon class="modal-icon" />
            Add New Category
          </h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="saveCategory" class="modal-form">
          <div class="form-grid">
            <div class="input-group">
              <label class="input-label">Category Name</label>
              <input 
                type="text" 
                v-model="categoryForm.name" 
                required 
                class="modern-input"
                placeholder="Enter category name"
              >
            </div>
            <div class="input-group">
              <label class="input-label">Category Code</label>
              <input 
                type="text" 
                v-model="categoryForm.code" 
                required 
                class="modern-input"
                placeholder="e.g., HOSP, INDV"
              >
            </div>
            <div class="input-group full-width">
              <label class="input-label">Description</label>
              <textarea 
                v-model="categoryForm.description" 
                rows="3" 
                class="modern-textarea"
                placeholder="Enter category description"
              ></textarea>
            </div>
            <div class="input-group">
              <label class="input-label">Icon (Emoji)</label>
              <input 
                type="text" 
                v-model="categoryForm.icon" 
                class="modern-input"
                placeholder="Icon emoji"
                maxlength="2"
              >
            </div>
            <div class="input-group">
              <label class="input-label">Status</label>
              <div class="select-wrapper">
                <select v-model="categoryForm.status" class="modern-select">
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <span class="select-icon">⌄</span>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-compact btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-compact btn-primary">
              <span class="btn-icon-sm">💾</span>
              Create Category
            </button>
          </div>
        </form>
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
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
  ChartBarIcon,
  BuildingOffice2Icon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  FunnelIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'
import { ProviderAPIService } from '@/services/api'

// Form states
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)
const selectedCategory = ref(null)
const isInlineEditing = ref(false)
const searchTerm = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const loading = ref(false)
const error = ref(null)

// Pagination
const currentPage = ref(0)
const pageSize = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)

// Categories data
const categories = ref([])
const countries = ref([])

// Load categories from API
const loadCategories = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await ProviderAPIService.getProviderCategories({
      page: currentPage.value,
      size: pageSize.value,
      search: searchTerm.value
    })

    categories.value = response.content.map(category => ({
      id: category.id,
      name: category.categoryName,
      code: `CAT-${category.id}`,
      description: category.categoryName,
      icon: getCategoryIcon(category.categoryName),
      activeProviders: Math.floor(Math.random() * 500) + 100, // Placeholder data
      totalRegistered: Math.floor(Math.random() * 1000) + 200, // Placeholder data
      status: category.status === 1 ? 'Active' : 'Inactive'
    }))

    totalPages.value = response.totalPages
    totalElements.value = response.totalElements
  } catch (err) {
    console.error('Failed to load categories:', err)
    error.value = 'Failed to load categories. Please try again.'
  } finally {
    loading.value = false
  }
}

// Load countries from API
const loadCountries = async () => {
  try {
    const response = await ProviderAPIService.getProviderCountries()
    countries.value = response
  } catch (err) {
    console.error('Failed to load countries:', err)
  }
}

// Helper function to get icon based on category name
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase()

  if (name.includes('hospital')) return '🏥'
  if (name.includes('clinic')) return '🏪'
  if (name.includes('pharmacy')) return '💊'
  if (name.includes('dental')) return '🦷'
  if (name.includes('lab')) return '🔬'
  if (name.includes('mental')) return '🧠'
  if (name.includes('eye')) return '👁️'
  if (name.includes('individual')) return '👨‍⚕️'

  return '🏢' // Default icon
}

// Load data on component mount
onMounted(() => {
  loadCategories()
  loadCountries()
})

// Watch for search term changes
watch(searchTerm, () => {
  currentPage.value = 0 // Reset to first page when search changes
  loadCategories()
})

// Category form for add/edit
const categoryForm = ref({
  name: '',
  code: '',
  description: '',
  icon: '',
  status: 'Active',
  activeProviders: 0,
  totalRegistered: 0
})

// Computed properties
const totalActiveProviders = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.activeProviders, 0)
})

const totalRegistered = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.totalRegistered, 0)
})

// Since we're using the API for filtering, this just returns the categories
const filteredCategories = computed(() => {
  return categories.value
})

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    loadCategories()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    loadCategories()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  loadCategories()
}

const resetSearch = () => {
  searchTerm.value = ''
  currentPage.value = 0
  loadCategories()
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Methods
const viewCategory = (category) => {
  selectedCategory.value = category
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = { ...category }

  // Always use inline editing
  selectedCategory.value = category
  isInlineEditing.value = true
}

const deleteCategory = (categoryId) => {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    const index = categories.value.findIndex(cat => cat.id === categoryId)
    if (index !== -1) {
      categories.value.splice(index, 1)
      showToastMessage('Category deleted successfully')
    }
  }
}

const saveCategory = () => {
  if (editingCategory.value) {
    // Update existing category
    const index = categories.value.findIndex(cat => cat.id === editingCategory.value.id)
    if (index !== -1) {
      categories.value[index] = { ...categoryForm.value }
      showToastMessage('Category updated successfully')
    }
  } else {
    // Add new category
    const newCategory = {
      ...categoryForm.value,
      id: Math.max(...categories.value.map(c => c.id)) + 1
    }
    categories.value.push(newCategory)
    showToastMessage('Category created successfully')
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  isInlineEditing.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    code: '',
    description: '',
    icon: '',
    status: 'Active',
    activeProviders: 0,
    totalRegistered: 0
  }
}

const toggleFilter = () => {
  // Filter functionality placeholder
  console.log('Toggle filter')
}

const getStatusClass = (status) => {
  const statusMap = {
    'Active': 'active',
    'Under Review': 'under-review',
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
.provider-categories-container {
  min-height: 100vh;
  background: white;
  padding: 0;
}

/* Header Section */
.header-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.5rem 0;
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
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #1e293b;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
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
  width: 1.25rem;
  height: 1.25rem;
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

.action-section {
  display: flex;
  gap: 1rem;
}

.filter-btn,
.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.add-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
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

/* Special thin header for countries and categories sections */
.countries-section .table-header,
.categories-section .table-header {
  padding: 0.5rem 1rem;
  min-height: 40px;
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

.countries-section .table-title,
.categories-section .table-title {
  font-size: 0.95rem;
}

.table-icon {
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.5rem;
  color: #3b82f6;
}

.countries-section .table-icon,
.categories-section .table-icon {
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.25rem;
}

.category-count {
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

.countries-section .table-wrapper {
  max-height: 100px; /* Allow scrolling if many countries */
  overflow-y: auto;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;
}

.categories-table th,
.categories-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem;
}

.categories-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.category-row {
  transition: all 0.2s ease;
}

.category-row:hover {
  background: #f8fafc;
}

.th-icon {
  width: 40px;
}

.th-name {
  width: 150px;
}

.th-description {
  width: auto;
}

.th-active,
.th-total {
  width: 80px;
  text-align: center;
}

.th-status {
  width: 100px;
}

.th-actions {
  width: 100px;
  text-align: center;
}

/* Table Cell Content */
.category-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 0.375rem;
}

.category-icon {
  font-size: 1.25rem;
}

.name-cell {
  display: flex;
  flex-direction: column;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.15rem 0;
}

.category-code {
  font-size: 0.7rem;
  color: #6b7280;
  margin: 0;
  font-family: monospace;
  background: #f3f4f6;
  padding: 0.1rem 0.25rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.description-text {
  color: #4b5563;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.65rem;
  color: #6b7280;
  margin-top: 0.1rem;
}

/* Status Badges */
.status-badge.modern {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.status-badge.under-review {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
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
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0.25rem;
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

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

.action-icon {
  width: 0.75rem;
  height: 0.75rem;
}

/* Inline Details Styles */
.details-row {
  background-color: #f8fafc;
}

.details-row td {
  padding: 0;
}

.details-cell {
  width: 100% !important;
  max-width: none !important;
}

.inline-details {
  padding: 0;
  margin: 0.25rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  width: calc(100% - 0.5rem);
}

.inline-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.inline-details-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.panel-icon {
  font-size: 0.875rem;
}

.close-details {
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-details:hover {
  color: #6b7280;
  background-color: #f3f4f6;
}

.inline-details-content {
  padding: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  margin-bottom: 0.25rem;
  padding-bottom: 0.125rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 0.25rem;
}

.detail-label {
  font-size: 0.65rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.detail-value {
  font-size: 0.7rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.3;
}

.detail-value.highlight {
  font-size: 0.9rem;
  font-weight: 700;
  color: #3b82f6;
}

/* Inline Edit Form Styles */
.inline-edit-form {
  width: 100%;
}

.compact-form {
  padding: 0.5rem;
}

.form-grid.compact {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.form-grid.compact .input-group {
  margin-bottom: 0;
}

.form-grid.compact .input-group.full-width {
  grid-column: span 4;
}

.form-grid.compact .input-label {
  font-size: 0.65rem;
  margin-bottom: 0.25rem;
}

.form-grid.compact .modern-input,
.form-grid.compact .modern-select,
.form-grid.compact .modern-textarea {
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  border-width: 1px;
}

.form-grid.compact .select-icon {
  right: 0.5rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-compact.btn-secondary {
  background: #f1f5f9;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-compact.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-compact.btn-primary {
  background: #3b82f6;
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-compact.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.detail-description {
  color: #4b5563;
  font-size: 0.7rem;
  line-height: 1.4;
  margin: 0;
}

.inline-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-compact {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.btn-edit:hover {
  background: rgba(245, 158, 11, 0.2);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-icon-sm {
  width: 0.65rem;
  height: 0.65rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal.modern {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-icon {
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.5rem;
}

.modal-close {
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

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group.full-width {
  grid-column: span 2;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.modern-input,
.modern-select,
.modern-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.modern-input:focus,
.modern-select:focus,
.modern-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-wrapper {
  position: relative;
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

.modern-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary,
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.btn-secondary {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #d1d5db 100%);
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
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
  color: #10b981;
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #ef4444;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #dc2626;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #6b7280;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.primary-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn:hover {
  background: #2563eb;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: #1e293b;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.page-number.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Thin Button */
.thin-btn {
  padding: 0.5rem 1rem;
  height: 36px;
  font-size: 0.8rem;
}

/* Disabled Add Button */
.add-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.7;
}

.add-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Countries and Categories Sections */
.countries-section, .categories-section {
  margin-bottom: 1rem;
}

.table-container.countries-section {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  max-height: 140px; /* Constrain height to make it very thin */
  overflow: hidden;
}

.table-container.categories-section {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  overflow: hidden;
}

.country-count {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.countries-section .country-count,
.categories-section .category-count {
  padding: 0.15rem 0.5rem;
  font-size: 0.65rem;
  border-radius: 0.75rem;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  padding: 0.5rem;
}

.country-card {
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  height: 60px;
}

.country-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.country-flag {
  margin-bottom: 0.2rem;
  line-height: 1;
  display: flex;
  justify-content: center;
}

.country-flag-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
}

.country-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.1;
}

.country-meta {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  font-size: 0.6rem;
  color: #6b7280;
  line-height: 1;
}

.country-id {
  background: #f1f5f9;
  padding: 0.05rem 0.15rem;
  border-radius: 0.2rem;
  font-size: 0.55rem;
  display: none; /* Hide to save space */
}

.country-date {
  font-style: italic;
  font-size: 0.55rem;
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
}

@media (max-width: 768px) {
  .provider-categories-container {
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

  .categories-table {
    min-width: 700px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .input-group.full-width {
    grid-column: span 1;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-item.full-width {
    grid-column: span 1;
  }

  .header-stats {
    gap: 1rem;
  }

  .action-section {
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

  .modal-form {
    padding: 1rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
