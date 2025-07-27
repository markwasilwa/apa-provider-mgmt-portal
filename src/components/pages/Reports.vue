<template>
  <div class="reports-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <DocumentChartBarIcon class="icon" />
            Provider Reports
          </h1>
          <p class="subtitle">Access key provider information and management tools</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalReports }}</div>
            <div class="stat-label">Total Tools</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ completedReports }}</div>
            <div class="stat-label">Available</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ processingReports }}</div>
            <div class="stat-label">In Progress</div>
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
              placeholder="Search tools by title, type, description..." 
              class="search-input"
            >
          </div>
        </div>
        <div class="filter-section">
          <div class="select-wrapper">
            <select v-model="selectedReportType" class="modern-select">
              <option value="all">All Report Types</option>
              <option value="documents">Supporting Documents</option>
              <option value="requests">Provider Requests</option>
              <option value="visits">Provider Visits</option>
              <option value="actisure">Actisure Providers</option>
            </select>
            <ChevronDownIcon class="select-icon" />
          </div>
          <div class="select-wrapper">
            <select v-model="selectedDateRange" class="modern-select">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDownIcon class="select-icon" />
          </div>
          <button class="generate-btn" @click="generateReport">
            <PlusIcon class="btn-icon" />
            Access Tools
          </button>
        </div>
      </div>

      <div class="reports-section">
        <div class="section-header">
          <h2 class="section-title">
            <DocumentTextIcon class="table-icon" />
            Provider Management Tools
          </h2>
          <span class="report-count">{{ filteredReports.length }} tools</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading tools...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <ExclamationTriangleIcon class="error-icon" />
          <h3>Error Loading Tools</h3>
          <p>{{ error }}</p>
          <button @click="loadReports" class="retry-btn">Retry</button>
        </div>

        <!-- Tools Grid -->
        <div v-else class="reports-grid">
          <div class="report-card" v-for="report in filteredReports" :key="report.id">
            <div class="report-header">
              <div class="report-icon-wrapper">
                <DocumentChartBarIcon class="report-icon" />
              </div>
              <span class="status-badge modern" :class="getStatusClass(report.status)">
                {{ report.status }}
              </span>
            </div>
            <div class="report-body">
              <h3 class="report-title">{{ report.title }}</h3>
              <div class="report-type-badge">{{ report.type }}</div>
              <p class="report-description">{{ report.description }}</p>
              <div class="report-meta">
                <div class="meta-item">
                  <CalendarIcon class="meta-icon" />
                  <span>{{ report.generatedDate }}</span>
                </div>
                <div class="meta-item">
                  <DocumentIcon class="meta-icon" />
                  <span>{{ report.pageCount }} pages</span>
                </div>
                <div class="meta-item">
                  <DocumentDuplicateIcon class="meta-icon" />
                  <span>{{ report.recordCount }} records</span>
                </div>
              </div>
            </div>
            <div class="report-footer">
              <div class="action-buttons">
                <button class="action-btn download" @click="downloadReport(report)" title="Download Tool">
                  <ArrowDownTrayIcon class="action-icon" />
                </button>
                <button class="action-btn view" @click="viewReport(report)" title="Access Tool">
                  <EyeIcon class="action-icon" />
                </button>
                <button class="action-btn share" @click="shareReport(report)" title="Share Tool">
                  <ShareIcon class="action-icon" />
                </button>
              </div>
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
import { ref, computed, onMounted } from 'vue'
import { 
  DocumentChartBarIcon, 
  DocumentTextIcon,
  DocumentIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ShareIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Form states
const searchTerm = ref('')
const selectedReportType = ref('all')
const selectedDateRange = ref('month')
const showToast = ref(false)
const toastMessage = ref('')

// API states
const reports = ref([
  {
    id: 1,
    title: 'Supporting Documents',
    type: 'Documents',
    description: 'Access and manage all supporting documents for healthcare providers',
    generatedDate: '2024-02-01',
    recordCount: 1245,
    pageCount: 45,
    fileSize: '12.3 MB',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'Provider Requests',
    type: 'Requests',
    description: 'View and manage all provider requests and applications',
    generatedDate: '2024-01-31',
    recordCount: 567,
    pageCount: 23,
    fileSize: '8.7 MB',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Provider Visits',
    type: 'Visits',
    description: 'Track and manage all provider visits and inspections',
    generatedDate: '2024-01-30',
    recordCount: 890,
    pageCount: 34,
    fileSize: '15.2 MB',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Actisure (Core) Providers',
    type: 'Actisure',
    description: 'Access and manage core provider information from Actisure',
    generatedDate: '2024-01-29',
    recordCount: 2340,
    pageCount: 67,
    fileSize: '18.9 MB',
    status: 'Completed'
  }
])
const loading = ref(false)
const error = ref(null)

// Computed properties
const filteredReports = computed(() => {
  let filtered = reports.value

  if (selectedReportType.value !== 'all') {
    filtered = filtered.filter(report => 
      report.type.toLowerCase().includes(selectedReportType.value.replace('-', ' '))
    )
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(report => 
      report.title.toLowerCase().includes(search) ||
      report.type.toLowerCase().includes(search) ||
      report.description.toLowerCase().includes(search)
    )
  }

  return filtered
})

const totalReports = computed(() => reports.value.length)

const completedReports = computed(() => 
  reports.value.filter(report => report.status === 'Completed').length
)

const processingReports = computed(() => 
  reports.value.filter(report => report.status === 'Processing').length
)

// Methods
const loadReports = () => {
  loading.value = true
  error.value = null

  // Simulate API call
  setTimeout(() => {
    loading.value = false
    // If you want to simulate an error, uncomment the line below
    // error.value = 'Failed to load provider tools. Server error.'
  }, 1000)
}

const generateReport = () => {
  console.log('Accessing provider tools...')
  showToast.value = true
  toastMessage.value = 'Accessing provider management tools. Please wait...'

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const downloadReport = (report) => {
  console.log('Downloading tool:', report.title)
  showToast.value = true
  toastMessage.value = `Tool "${report.title}" is being downloaded.`

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const viewReport = (report) => {
  console.log('Accessing tool:', report.title)
}

const shareReport = (report) => {
  console.log('Sharing tool:', report.title)
  showToast.value = true
  toastMessage.value = `Tool "${report.title}" has been shared.`

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'warning'
    case 'failed':
      return 'danger'
    default:
      return 'default'
  }
}

// Lifecycle hooks
onMounted(() => {
  loadReports()
})
</script>

<style scoped>
/* Container Styles */
.reports-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Section Styles */
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

.main-title .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
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
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

/* Content Section Styles */
.content-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}

.content-header {
  margin-bottom: 2rem;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1e293b;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.select-wrapper {
  position: relative;
  min-width: 200px;
}

.modern-select {
  width: 100%;
  appearance: none;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.modern-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  pointer-events: none;
}

.generate-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generate-btn:hover {
  background: #1d4ed8;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Reports Section Styles */
.reports-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.table-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #3b82f6;
}

.report-count {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
}

/* Reports Grid Styles */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.report-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.report-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #e0f2fe;
  border-radius: 0.375rem;
}

.report-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
}

.status-badge.modern {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.success {
  background: #dcfce7;
  color: #065f46;
}

.status-badge.warning {
  background: #fef9c3;
  color: #ca8a04;
}

.status-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.report-body {
  padding: 0.75rem;
}

.report-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.375rem;
}

.report-type-badge {
  display: inline-block;
  background: #e0f2fe;
  color: #3b82f6;
  padding: 0.2rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.7rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.report-description {
  color: #6b7280;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.report-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #6b7280;
}

.report-footer {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.3rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.action-btn:hover {
  background: #f1f5f9;
}

.action-btn.download {
  color: #3b82f6;
}

.action-btn.view {
  color: #8b5cf6;
}

.action-btn.share {
  color: #10b981;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 50;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #dcfce7;
  border-radius: 50%;
}

.toast-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #065f46;
}

.toast-content h4 {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.toast-content p {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .header-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .reports-container {
    padding: 0;
  }

  .header-content {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .header-stats {
    gap: 0.75rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .reports-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
}
</style>
