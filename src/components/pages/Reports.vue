<template>
  <div class="reports-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <DocumentChartBarIcon class="icon" />
            Reports & Analytics
          </h1>
          <p class="subtitle">Generate comprehensive reports and analytics for healthcare providers</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalReports }}</div>
            <div class="stat-label">Total Reports</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ completedReports }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ processingReports }}</div>
            <div class="stat-label">Processing</div>
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
              placeholder="Search reports by title, type, description..." 
              class="search-input"
            >
          </div>
        </div>
        <div class="filter-section">
          <div class="select-wrapper">
            <select v-model="selectedReportType" class="modern-select">
              <option value="all">All Report Types</option>
              <option value="provider-summary">Provider Summary</option>
              <option value="compliance">Compliance Report</option>
              <option value="financial">Financial Report</option>
              <option value="performance">Performance Report</option>
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
            Generate New Report
          </button>
        </div>
      </div>

      <div class="reports-section">
        <div class="section-header">
          <h2 class="section-title">
            <DocumentTextIcon class="table-icon" />
            Available Reports
          </h2>
          <span class="report-count">{{ filteredReports.length }} reports</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <ExclamationTriangleIcon class="error-icon" />
          <h3>Error Loading Reports</h3>
          <p>{{ error }}</p>
          <button @click="loadReports" class="retry-btn">Retry</button>
        </div>

        <!-- Reports Grid -->
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
                <button class="action-btn download" @click="downloadReport(report)" title="Download Report">
                  <ArrowDownTrayIcon class="action-icon" />
                </button>
                <button class="action-btn view" @click="viewReport(report)" title="Preview Report">
                  <EyeIcon class="action-icon" />
                </button>
                <button class="action-btn share" @click="shareReport(report)" title="Share Report">
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
    title: 'Monthly Provider Summary',
    type: 'Provider Summary',
    description: 'Comprehensive overview of all registered providers and their activities',
    generatedDate: '2024-02-01',
    recordCount: 1245,
    pageCount: 45,
    fileSize: '12.3 MB',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'Q1 Compliance Report',
    type: 'Compliance',
    description: 'Quarterly compliance assessment for all healthcare providers',
    generatedDate: '2024-01-31',
    recordCount: 567,
    pageCount: 23,
    fileSize: '8.7 MB',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Financial Analysis Report',
    type: 'Financial',
    description: 'Revenue and cost analysis for insurance claims processing',
    generatedDate: '2024-01-30',
    recordCount: 2340,
    pageCount: 67,
    fileSize: '18.9 MB',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Provider Performance Metrics',
    type: 'Performance',
    description: 'Key performance indicators and benchmarks for all providers',
    generatedDate: '2024-01-29',
    recordCount: 890,
    pageCount: 34,
    fileSize: '15.2 MB',
    status: 'Processing'
  },
  {
    id: 5,
    title: 'Weekly Visit Summary',
    type: 'Provider Summary',
    description: 'Summary of all provider visits and inspections for the week',
    generatedDate: '2024-01-28',
    recordCount: 156,
    pageCount: 12,
    fileSize: '4.5 MB',
    status: 'Completed'
  },
  {
    id: 6,
    title: 'Regulatory Compliance Audit',
    type: 'Compliance',
    description: 'Detailed audit report for regulatory compliance requirements',
    generatedDate: '2024-01-27',
    recordCount: 423,
    pageCount: 28,
    fileSize: '9.8 MB',
    status: 'Failed'
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
    // error.value = 'Failed to load reports. Server error.'
  }, 1000)
}

const generateReport = () => {
  console.log('Generating new report...')
  showToast.value = true
  toastMessage.value = 'Report generation started. You will be notified when it completes.'

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const downloadReport = (report) => {
  console.log('Downloading report:', report.title)
  showToast.value = true
  toastMessage.value = `Report "${report.title}" is being downloaded.`

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const viewReport = (report) => {
  console.log('Viewing report:', report.title)
}

const shareReport = (report) => {
  console.log('Sharing report:', report.title)
  showToast.value = true
  toastMessage.value = `Report "${report.title}" has been shared.`

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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
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
  padding: 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.report-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #e0f2fe;
  border-radius: 0.5rem;
}

.report-icon {
  width: 1.5rem;
  height: 1.5rem;
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
  padding: 1.25rem;
}

.report-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.report-type-badge {
  display: inline-block;
  background: #e0f2fe;
  color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.report-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.report-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
}

.report-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.375rem;
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
  width: 1.25rem;
  height: 1.25rem;
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
    grid-template-columns: 1fr;
  }
}
</style>
