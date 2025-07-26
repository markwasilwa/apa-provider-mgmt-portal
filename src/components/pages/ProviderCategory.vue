<template>
  <div class="provider-categories-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <ClipboardDocumentListIcon class="icon" />
            Provider Categories Management
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
          <button class="add-btn" @click="showAddModal = true">
            <PlusIcon class="btn-icon" />
            Add Category
          </button>
        </div>
      </div>

      <!-- Categories Table -->
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">
            <ChartBarIcon class="table-icon" />
            Provider Categories
          </h2>
          <span class="category-count">{{ filteredCategories.length }} categories</span>
        </div>

        <div class="table-wrapper">
          <table class="categories-table">
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
              <tr v-for="category in filteredCategories" :key="category.id" class="category-row">
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
            </tbody>
          </table>
        </div>
      </div>

      <!-- Category Details Panel -->
      <div class="details-panel" v-if="selectedCategory">
        <div class="panel-header">
          <h3 class="panel-title">
            <span class="panel-icon">{{ selectedCategory.icon }}</span>
            {{ selectedCategory.name }} Details
          </h3>
          <button class="close-panel" @click="selectedCategory = null">×</button>
        </div>
        <div class="panel-content">
          <div class="detail-grid">
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
            <div class="detail-item full-width">
              <label class="detail-label">Description</label>
              <p class="detail-description">{{ selectedCategory.description }}</p>
            </div>
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
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal modern" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <component :is="editingCategory ? PencilIcon : PlusIcon" class="modal-icon" />
            {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
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
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              <span class="btn-icon">💾</span>
              {{ editingCategory ? 'Update' : 'Create' }} Category
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
import { ref, computed } from 'vue'
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
  EyeIcon
} from '@heroicons/vue/24/outline'

// Form states
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)
const selectedCategory = ref(null)
const searchTerm = ref('')
const showToast = ref(false)
const toastMessage = ref('')

// Categories data (only Hospital and Individual as requested)
const categories = ref([
  {
    id: 1,
    name: 'Hospital',
    code: 'HOSP',
    description: 'Major medical facilities providing comprehensive healthcare services including emergency care, surgical procedures, and specialized treatments',
    icon: '🏥',
    activeProviders: 245,
    totalRegistered: 278,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Individual',
    code: 'INDV',
    description: 'Individual healthcare practitioners including doctors, specialists, nurses, and other licensed medical professionals',
    icon: '👨‍⚕️',
    activeProviders: 1834,
    totalRegistered: 2156,
    status: 'Active'
  }
])

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

const filteredCategories = computed(() => {
  if (!searchTerm.value) {
    return categories.value
  }
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    category.code.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Methods
const viewCategory = (category) => {
  selectedCategory.value = category
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = { ...category }
  showEditModal.value = true
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
  margin-right: 0.5rem;
  color: #3b82f6;
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

.categories-table {
  width: 100%;
  border-collapse: collapse;
}

.categories-table th,
.categories-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
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
  width: 60px;
}

.th-name {
  width: 200px;
}

.th-description {
  width: auto;
}

.th-active,
.th-total {
  width: 100px;
  text-align: center;
}

.th-status {
  width: 120px;
}

.th-actions {
  width: 120px;
  text-align: center;
}

/* Table Cell Content */
.category-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 0.5rem;
}

.category-icon {
  font-size: 1.5rem;
}

.name-cell {
  display: flex;
  flex-direction: column;
}

.category-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.category-code {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  font-family: monospace;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.description-text {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  max-width: 300px;
}

.stat-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.125rem;
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

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

.action-icon {
  width: 0.875rem;
  height: 0.875rem;
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
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.full-width {
  grid-column: span 2;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.detail-description {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
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
