<template>
  <div class="provider-requests-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <ClipboardDocumentListIcon class="icon" />
            Provider Registration Requests
          </h1>
          <p class="subtitle">Review and process new healthcare provider registration applications and licensing requests</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalRequests }}</div>
            <div class="stat-label">Total Requests</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ pendingRequests }}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ approvedRequests }}</div>
            <div class="stat-label">Approved</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ rejectedRequests }}</div>
            <div class="stat-label">Rejected</div>
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
              placeholder="Search requests by ID, provider name, or email..." 
              class="search-input"
            >
          </div>
        </div>
        <div class="filter-section">
          <div class="select-wrapper">
            <select v-model="statusFilter" class="modern-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <span class="select-icon">⌄</span>
          </div>
          <div class="select-wrapper">
            <select v-model="categoryFilter" class="modern-select">
              <option value="all">All Categories</option>
              <option value="Hospital">Hospital</option>
              <option value="Clinic">Clinic</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Dental">Dental</option>
            </select>
            <span class="select-icon">⌄</span>
          </div>
        </div>
      </div>

      <!-- Requests Table -->
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">
            <DocumentTextIcon class="table-icon" />
            Registration Requests
          </h2>
          <span class="request-count">{{ filteredRequests.length }} requests</span>
        </div>

        <div class="table-wrapper">
          <table class="requests-table">
            <thead>
              <tr>
                <th class="th-id">Request ID</th>
                <th class="th-provider">Provider Details</th>
                <th class="th-category">Category</th>
                <th class="th-location">Location</th>
                <th class="th-license">License Info</th>
                <th class="th-dates">Timeline</th>
                <th class="th-status">Status</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="request in filteredRequests" :key="request.id">
                <tr class="request-row" :class="{ 'selected': expandedRequestIds.includes(request.id) }">
                  <td class="td-id">
                    <div class="id-cell">
                      <span class="request-id">{{ request.id }}</span>
                    </div>
                  </td>
                  <td class="td-provider">
                    <div class="provider-cell">
                      <h4 class="provider-name">{{ request.providerName }}</h4>
                      <div class="contact-info">
                        <span class="contact-item">
                          <EnvelopeIcon class="contact-icon" />
                          {{ request.contactEmail }}
                        </span>
                        <span class="contact-item">
                          <PhoneIcon class="contact-icon" />
                          {{ request.phone }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="td-category">
                    <span class="category-badge">{{ request.category }}</span>
                  </td>
                  <td class="td-location">
                    <div class="location-cell">
                      <MapPinIcon class="location-icon" />
                      <span class="location-text">{{ request.location }}</span>
                    </div>
                  </td>
                  <td class="td-license">
                    <div class="license-cell">
                      <span class="license-number">{{ request.licenseNumber }}</span>
                      <span class="license-expiry">Expires: {{ formatDate(request.licenseExpiry) }}</span>
                    </div>
                  </td>
                  <td class="td-dates">
                    <div class="dates-cell">
                      <span class="date-submitted">Submitted: {{ formatDate(request.dateSubmitted) }}</span>
                      <span class="date-updated">Updated: {{ formatDate(request.lastUpdated) }}</span>
                    </div>
                  </td>
                  <td class="td-status">
                    <span class="status-badge modern" :class="getStatusClass(request.status)">
                      {{ request.status }}
                    </span>
                  </td>
                  <td class="td-actions">
                    <div class="action-buttons">
                      <button class="action-btn view" @click="viewRequest(request)" title="View Details">
                        <EyeIcon class="action-icon" />
                      </button>
                      <button class="action-btn approve" @click="approveRequest(request.id)" title="Approve Request" v-if="request.status === 'Pending'">
                        <CheckIcon class="action-icon" />
                      </button>
                      <button class="action-btn reject" @click="rejectRequest(request.id)" title="Reject Request" v-if="request.status === 'Pending'">
                        <XMarkIcon class="action-icon" />
                      </button>
                      <button class="action-btn review" @click="setUnderReview(request.id)" title="Set Under Review" v-if="request.status === 'Pending'">
                        <MagnifyingGlassIcon class="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="expandedRequestIds.includes(request.id)" class="details-row">
                  <td colspan="8">
                    <div class="inline-details">
                      <div class="inline-details-header">
                        <h4 class="inline-details-title">Provider Request Details</h4>
                        <button class="close-details" @click="expandedRequestIds = expandedRequestIds.filter(id => id !== request.id)">×</button>
                      </div>
                      <div class="inline-details-content">
                        <div class="detail-grid">
                          <div class="detail-section">
                            <h4 class="section-title">Provider Information</h4>
                            <div class="detail-item">
                              <label class="detail-label">Provider Name</label>
                              <span class="detail-value">{{ request.providerName }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Category</label>
                              <span class="category-badge">{{ request.category }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Location</label>
                              <span class="detail-value">{{ request.location }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Contact Email</label>
                              <a :href="`mailto:${request.contactEmail}`" class="detail-link">{{ request.contactEmail }}</a>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Phone Number</label>
                              <a :href="`tel:${request.phone}`" class="detail-link">{{ request.phone }}</a>
                            </div>
                          </div>

                          <div class="detail-section">
                            <h4 class="section-title">License Information</h4>
                            <div class="detail-item">
                              <label class="detail-label">License Number</label>
                              <span class="detail-value highlight">{{ request.licenseNumber }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">License Expiry</label>
                              <span class="detail-value" :class="{ 'text-danger': isLicenseExpiringSoon(request.licenseExpiry) }">
                                {{ formatDate(request.licenseExpiry) }}
                              </span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">License Status</label>
                              <span class="detail-value" :class="isLicenseValid(request.licenseExpiry) ? 'text-success' : 'text-danger'">
                                {{ isLicenseValid(request.licenseExpiry) ? 'Valid' : 'Expired' }}
                              </span>
                            </div>
                          </div>

                          <div class="detail-section">
                            <h4 class="section-title">Request Timeline</h4>
                            <div class="detail-item">
                              <label class="detail-label">Request Status</label>
                              <span class="status-badge modern" :class="getStatusClass(request.status)">
                                {{ request.status }}
                              </span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Date Submitted</label>
                              <span class="detail-value">{{ formatDate(request.dateSubmitted) }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Last Updated</label>
                              <span class="detail-value">{{ formatDate(request.lastUpdated) }}</span>
                            </div>
                            <div class="detail-item">
                              <label class="detail-label">Processing Time</label>
                              <span class="detail-value">{{ getProcessingTime(request.dateSubmitted) }} days</span>
                            </div>
                          </div>
                        </div>

                        <div class="inline-actions" v-if="request.status === 'Pending'">
                          <button @click="approveRequest(request.id)" class="btn-success">
                            <CheckIcon class="btn-icon" />
                            Approve Request
                          </button>
                          <button @click="setUnderReview(request.id)" class="btn-info">
                            <MagnifyingGlassIcon class="btn-icon" />
                            Set Under Review
                          </button>
                          <button @click="rejectRequest(request.id)" class="btn-danger">
                            <XMarkIcon class="btn-icon" />
                            Reject Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="toast success-toast">
      <CheckCircleIcon class="toast-icon" />
      <div class="toast-content">
        <h4>Success!</h4>
        <p>{{ toastMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EyeIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, DocumentTextIcon, ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

// Form states
const searchTerm = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const selectedRequest = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const expandedRequestIds = ref([])

// Requests data
const requests = ref([
  {
    id: 'REQ-2024-001',
    providerName: 'Nairobi General Hospital',
    category: 'Hospital',
    location: 'Nairobi, Kenya',
    contactEmail: 'admin@nairobigeneral.co.ke',
    phone: '+254-700-123456',
    licenseNumber: 'LIC-NGH-2024-001',
    licenseExpiry: '2026-12-31',
    dateSubmitted: '2024-01-15',
    lastUpdated: '2024-01-16',
    status: 'Pending'
  },
  {
    id: 'REQ-2024-002',
    providerName: 'Mombasa Medical Clinic',
    category: 'Clinic',
    location: 'Mombasa, Kenya',
    contactEmail: 'info@mombasamedical.co.ke',
    phone: '+254-700-789012',
    licenseNumber: 'LIC-MMC-2024-002',
    licenseExpiry: '2025-06-30',
    dateSubmitted: '2024-01-14',
    lastUpdated: '2024-01-20',
    status: 'Under Review'
  },
  {
    id: 'REQ-2024-003',
    providerName: 'Kisumu Pharmacy Plus',
    category: 'Pharmacy',
    location: 'Kisumu, Kenya',
    contactEmail: 'orders@kisumupharmacy.co.ke',
    phone: '+254-700-345678',
    licenseNumber: 'LIC-KPP-2024-003',
    licenseExpiry: '2025-12-31',
    dateSubmitted: '2024-01-13',
    lastUpdated: '2024-01-21',
    status: 'Approved'
  },
  {
    id: 'REQ-2024-004',
    providerName: 'Eldoret Diagnostic Center',
    category: 'Diagnostic',
    location: 'Eldoret, Kenya',
    contactEmail: 'lab@eldoretdiagnostic.co.ke',
    phone: '+254-700-901234',
    licenseNumber: 'LIC-EDC-2024-004',
    licenseExpiry: '2026-03-31',
    dateSubmitted: '2024-01-12',
    lastUpdated: '2024-01-18',
    status: 'Rejected'
  },
  {
    id: 'REQ-2024-005',
    providerName: 'Nakuru Dental Care',
    category: 'Dental',
    location: 'Nakuru, Kenya',
    contactEmail: 'appointments@nakurudental.co.ke',
    phone: '+254-700-567890',
    licenseNumber: 'LIC-NDC-2024-005',
    licenseExpiry: '2025-09-30',
    dateSubmitted: '2024-01-11',
    lastUpdated: '2024-01-17',
    status: 'Under Review'
  },
  {
    id: 'REQ-2024-006',
    providerName: 'Thika Mental Health Center',
    category: 'Mental Health',
    location: 'Thika, Kenya',
    contactEmail: 'care@thikamental.co.ke',
    phone: '+254-700-555666',
    licenseNumber: 'LIC-TMH-2024-006',
    licenseExpiry: '2024-12-31',
    dateSubmitted: '2024-01-10',
    lastUpdated: '2024-01-19',
    status: 'Pending'
  },
  {
    id: 'REQ-2024-007',
    providerName: 'Karen Medical Centre',
    category: 'Hospital',
    location: 'Karen, Nairobi',
    contactEmail: 'reception@karenmedical.co.ke',
    phone: '+254-700-999000',
    licenseNumber: 'LIC-KMC-2024-007',
    licenseExpiry: '2025-03-15',
    dateSubmitted: '2024-01-09',
    lastUpdated: '2024-01-22',
    status: 'Approved'
  }
])

// Computed properties
const totalRequests = computed(() => requests.value.length)

const pendingRequests = computed(() => {
  return requests.value.filter(r => r.status === 'Pending').length
})

const approvedRequests = computed(() => {
  return requests.value.filter(r => r.status === 'Approved').length
})

const rejectedRequests = computed(() => {
  return requests.value.filter(r => r.status === 'Rejected').length
})

const filteredRequests = computed(() => {
  let filtered = requests.value

  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(request => 
      request.id.toLowerCase().includes(search) ||
      request.providerName.toLowerCase().includes(search) ||
      request.contactEmail.toLowerCase().includes(search) ||
      request.licenseNumber.toLowerCase().includes(search)
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(request => 
      request.status.toLowerCase().replace(' ', '-') === statusFilter.value
    )
  }

  // Apply category filter
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(request => request.category === categoryFilter.value)
  }

  return filtered
})

// Methods
const viewRequest = (request) => {
  const index = expandedRequestIds.value.indexOf(request.id)
  if (index === -1) {
    expandedRequestIds.value = [request.id]
  } else {
    expandedRequestIds.value.splice(index, 1)
  }
}

const approveRequest = (requestId) => {
  const request = requests.value.find(r => r.id === requestId)
  if (request) {
    request.status = 'Approved'
    request.lastUpdated = new Date().toISOString().split('T')[0]
    showToastMessage(`Request ${requestId} has been approved`)
  }
}

const rejectRequest = (requestId) => {
  if (confirm('Are you sure you want to reject this request? This action cannot be undone.')) {
    const request = requests.value.find(r => r.id === requestId)
    if (request) {
      request.status = 'Rejected'
      request.lastUpdated = new Date().toISOString().split('T')[0]
      showToastMessage(`Request ${requestId} has been rejected`)
    }
  }
}

const setUnderReview = (requestId) => {
  const request = requests.value.find(r => r.id === requestId)
  if (request) {
    request.status = 'Under Review'
    request.lastUpdated = new Date().toISOString().split('T')[0]
    showToastMessage(`Request ${requestId} is now under review`)
  }
}

// This function is no longer needed since we're showing details inline
// Keeping it for reference in case we need to revert
/*
const processRequest = (action) => {
  if (selectedRequest.value) {
    if (action === 'approve') {
      approveRequest(selectedRequest.value.id)
    } else if (action === 'reject') {
      rejectRequest(selectedRequest.value.id)
    } else if (action === 'review') {
      setUnderReview(selectedRequest.value.id)
    }
    selectedRequest.value = null
  }
}
*/

const getStatusClass = (status) => {
  const statusMap = {
    'Pending': 'pending',
    'Under Review': 'under-review',
    'Approved': 'approved',
    'Rejected': 'rejected'
  }
  return statusMap[status] || 'default'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const isLicenseValid = (expiryDate) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  return expiry > today
}

const isLicenseExpiringSoon = (expiryDate) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry <= 90 && daysUntilExpiry > 0
}

const getProcessingTime = (submittedDate) => {
  const today = new Date()
  const submitted = new Date(submittedDate)
  const diffTime = Math.abs(today - submitted)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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
.provider-requests-container {
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
  font-size: 1.5rem;
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

.request-count {
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

.requests-table {
  width: 100%;
  border-collapse: collapse;
}

.requests-table th,
.requests-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.requests-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.request-row {
  transition: all 0.2s ease;
}

.request-row:hover {
  background: #f8fafc;
}

.request-row.selected {
  background-color: #f0f9ff;
}

/* Table Column Widths */
.th-id {
  width: 120px;
}

.th-provider {
  width: 280px;
}

.th-category {
  width: 120px;
}

.th-location {
  width: 150px;
}

.th-license {
  width: 180px;
}

.th-dates {
  width: 160px;
}

.th-status {
  width: 120px;
}

.th-actions {
  width: 140px;
  text-align: center;
}

/* Table Cell Content */
.id-cell {
  display: flex;
  align-items: center;
}

.request-id {
  font-family: monospace;
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
  background: #eff6ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.provider-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.provider-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.contact-icon {
  width: 16px;
  text-align: center;
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

.license-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.license-number {
  font-family: monospace;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.license-expiry {
  font-size: 0.75rem;
  color: #6b7280;
}

.dates-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-submitted,
.date-updated {
  font-size: 0.75rem;
  color: #6b7280;
}

.date-submitted {
  font-weight: 500;
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

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.status-badge.under-review {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.status-badge.approved {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #991b1b;
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

.action-btn.approve:hover {
  background: rgba(16, 185, 129, 0.1);
}

.action-btn.reject:hover {
  background: rgba(239, 68, 68, 0.1);
}

.action-btn.review:hover {
  background: rgba(245, 158, 11, 0.1);
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
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
}

.detail-value.highlight {
  font-size: 1.125rem;
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

.text-success {
  color: #059669 !important;
}

.text-danger {
  color: #dc2626 !important;
}

.panel-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-success,
.btn-info,
.btn-danger {
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

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.btn-icon {
  font-size: 1rem;
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

/* Inline Details Styles */
.details-row {
  background-color: #f8fafc;
}

.details-row td {
  padding: 0;
}

.inline-details {
  padding: 0;
  margin: 0.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.inline-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.inline-details-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-details {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.close-details:hover {
  background: #f3f4f6;
  color: #374151;
}

.inline-details-content {
  padding: 1rem;
}

.inline-details .detail-grid {
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.inline-details .section-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.inline-details .detail-value {
  font-size: 0.85rem;
}

.inline-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.action-icon {
  width: 18px;
  height: 18px;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.search-icon, .location-icon, .contact-icon, .table-icon, .panel-icon, .toast-icon {
  width: 18px;
  height: 18px;
}

.icon {
  width: 24px;
  height: 24px;
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

  .detail-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .provider-requests-container {
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

  .requests-table {
    min-width: 1000px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .header-stats {
    gap: 1rem;
  }

  .filter-section {
    flex-direction: column;
  }

  .panel-actions {
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
    gap: 1.5rem;
  }
}
</style>
