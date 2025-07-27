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
          <button class="add-btn" @click="showCreateModal = true">
            <PlusIcon class="btn-icon" />
            Create Request
          </button>
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

        <!-- Loading Indicator -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading provider requests...</p>
        </div>

        <div v-else class="table-wrapper">
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

        <!-- Pagination Controls -->
        <div class="pagination-container" v-if="totalPages > 0">
          <div class="pagination-info">
            Showing {{ requests.length ? (currentPage * pageSize) + 1 : 0 }} - {{ Math.min((currentPage + 1) * pageSize, totalElements) }} of {{ totalElements }} items
          </div>
          <div class="pagination-controls">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 0" 
              @click="changePage(currentPage - 1)"
              :class="{ 'disabled': currentPage === 0 }"
            >
              Previous
            </button>

            <div class="pagination-pages">
              <template v-for="page in paginationRange" :key="page">
                <button 
                  class="page-btn" 
                  :class="{ 'active': page === currentPage + 1 }"
                  @click="changePage(page - 1)"
                >
                  {{ page }}
                </button>
              </template>
            </div>

            <button 
              class="pagination-btn" 
              :disabled="currentPage >= totalPages - 1" 
              @click="changePage(currentPage + 1)"
              :class="{ 'disabled': currentPage >= totalPages - 1 }"
            >
              Next
            </button>
          </div>
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

    <!-- Create Provider Registration Request Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal modern" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <PlusIcon class="modal-icon" />
            Create Provider Registration Request
          </h3>
          <button class="modal-close" @click="closeCreateModal">×</button>
        </div>
        <form @submit.prevent="createRequest" class="modal-form">
          <!-- Provider Information Section -->
          <div class="form-section">
            <h4 class="form-section-title">Provider Information</h4>
            <div class="form-grid">
              <div class="input-group full-width">
                <label class="input-label">Provider Name</label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="requestForm.providerName" 
                    required 
                    class="modern-input"
                    placeholder="Enter provider name"
                  >
                  <BuildingOffice2Icon class="input-icon" />
                </div>
              </div>
              <div class="input-group">
                <label class="input-label">Category</label>
                <div class="input-wrapper">
                  <select v-model="requestForm.category" required class="modern-select">
                    <option value="">Select a category</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Dental">Dental</option>
                    <option value="Mental Health">Mental Health</option>
                  </select>
                  <ChevronDownIcon class="input-icon" />
                </div>
                <span class="input-help">Select the type of healthcare facility</span>
              </div>
              <div class="input-group">
                <label class="input-label">Location</label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="requestForm.location" 
                    required 
                    class="modern-input"
                    placeholder="Enter location"
                  >
                  <MapPinIcon class="input-icon" />
                </div>
                <span class="input-help">City, State or Region</span>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="form-section">
            <h4 class="form-section-title">Contact Information</h4>
            <div class="form-grid">
              <div class="input-group">
                <label class="input-label">Contact Email</label>
                <div class="input-wrapper">
                  <input 
                    type="email" 
                    v-model="requestForm.contactEmail" 
                    required 
                    class="modern-input"
                    placeholder="Enter contact email"
                  >
                  <EnvelopeIcon class="input-icon" />
                </div>
              </div>
              <div class="input-group">
                <label class="input-label">Phone Number</label>
                <div class="input-wrapper">
                  <input 
                    type="tel" 
                    v-model="requestForm.phone" 
                    required 
                    class="modern-input"
                    placeholder="Enter phone number"
                  >
                  <PhoneIcon class="input-icon" />
                </div>
                <span class="input-help">Include country code</span>
              </div>
            </div>
          </div>

          <!-- License Information Section -->
          <div class="form-section">
            <h4 class="form-section-title">License Information</h4>
            <div class="form-grid">
              <div class="input-group">
                <label class="input-label">License Number</label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="requestForm.licenseNumber" 
                    required 
                    class="modern-input"
                    placeholder="Enter license number"
                  >
                  <IdentificationIcon class="input-icon" />
                </div>
              </div>
              <div class="input-group">
                <label class="input-label">License Expiry Date</label>
                <div class="input-wrapper">
                  <input 
                    type="date" 
                    v-model="requestForm.licenseExpiry" 
                    required 
                    class="modern-input"
                  >
                  <CalendarIcon class="input-icon" />
                </div>
                <span class="input-help">License must be valid</span>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-section form-actions">
            <div class="action-buttons">
              <button type="button" @click="closeCreateModal" class="btn-secondary">
                <XMarkIcon class="btn-icon" />
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                <PlusIcon class="btn-icon" />
                Create Request
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  EyeIcon, 
  CheckIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  PlusIcon,
  BuildingOffice2Icon,
  ChevronDownIcon,
  IdentificationIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import { ProviderAPIService } from '@/services/api'

// Form states
const searchTerm = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const selectedRequest = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const expandedRequestIds = ref([])
const showCreateModal = ref(false)
const requestForm = ref({
  providerName: '',
  category: '',
  location: '',
  contactEmail: '',
  phone: '',
  licenseNumber: '',
  licenseExpiry: ''
})

// Pagination
const currentPage = ref(0)
const pageSize = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)

// Requests data
const requests = ref([])
const loading = ref(false)

// Fetch provider requests from API
const fetchProviderRequests = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      sortBy: 'id',
      sortDir: 'desc'
    }

    // Add filters if they are set
    if (statusFilter.value !== 'all') {
      params.status = statusFilter.value.toUpperCase()
    }

    if (categoryFilter.value !== 'all') {
      params.category = categoryFilter.value
    }

    if (searchTerm.value) {
      params.providerName = searchTerm.value
    }

    const response = await ProviderAPIService.getProviderRequests(params)

    // Update pagination data
    totalPages.value = response.totalPages
    totalElements.value = response.totalElements

    // Map API response to component data structure
    requests.value = response.content.map(item => ({
      id: item.id,
      providerName: item.providerName,
      category: item.category,
      location: `${item.region}, ${item.country}`,
      contactEmail: item.emailAddress,
      phone: item.contacts,
      licenseNumber: item.scheme || 'N/A',
      licenseExpiry: item.dateConcluded || new Date().toISOString().split('T')[0],
      dateSubmitted: item.dateRequested,
      lastUpdated: item.dateConcluded || item.dateRequested,
      status: item.status === 'ACCEPTED' ? 'Approved' : 
              item.status === 'DECLINED' ? 'Rejected' : 
              item.status === 'PENDING' ? 'Pending' : 'Under Review',
      query: item.query,
      requestedBy: item.requestedBy,
      hodComments: item.hodComments,
      meetingDate: item.meetingDate,
      comments: item.comments,
      visitReport: item.visitReport,
      providerImage: item.providerImage
    }))
  } catch (error) {
    console.error('Error fetching provider requests:', error)
    showToastMessage('Failed to load provider requests. Please try again.')
  } finally {
    loading.value = false
  }
}

// Load data when component mounts
onMounted(() => {
  fetchProviderRequests()
})

// Pagination methods
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchProviderRequests()
  }
}

// Computed properties
const totalRequests = computed(() => totalElements.value)

const pendingRequests = computed(() => {
  return requests.value.filter(r => r.status === 'Pending').length
})

const approvedRequests = computed(() => {
  return requests.value.filter(r => r.status === 'Approved').length
})

const rejectedRequests = computed(() => {
  return requests.value.filter(r => r.status === 'Rejected').length
})

const paginationRange = computed(() => {
  const range = []
  const maxVisiblePages = 5
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  for (let i = startPage; i <= endPage; i++) {
    range.push(i)
  }

  return range
})

const filteredRequests = computed(() => {
  // Since we're using server-side filtering, this just returns the current requests
  return requests.value
})

// Watch for filter changes to refresh data
watch([searchTerm, statusFilter, categoryFilter], () => {
  currentPage.value = 0 // Reset to first page when filters change
  fetchProviderRequests()
}, { debounce: 300 })

// Methods
const viewRequest = (request) => {
  const index = expandedRequestIds.value.indexOf(request.id)
  if (index === -1) {
    expandedRequestIds.value = [request.id]
  } else {
    expandedRequestIds.value.splice(index, 1)
  }
}

const approveRequest = async (requestId) => {
  try {
    await ProviderAPIService.approveProviderRequest(requestId, {
      actionBy: 'admin', // This should be the current user
      hodComments: 'Approved via portal'
    })

    // Refresh the data
    await fetchProviderRequests()
    showToastMessage(`Request ${requestId} has been approved`)
  } catch (error) {
    console.error('Error approving request:', error)
    showToastMessage('Failed to approve request. Please try again.')
  }
}

const rejectRequest = async (requestId) => {
  if (confirm('Are you sure you want to reject this request? This action cannot be undone.')) {
    try {
      await ProviderAPIService.declineProviderRequest(requestId, {
        actionBy: 'admin', // This should be the current user
        hodComments: 'Rejected via portal'
      })

      // Refresh the data
      await fetchProviderRequests()
      showToastMessage(`Request ${requestId} has been rejected`)
    } catch (error) {
      console.error('Error rejecting request:', error)
      showToastMessage('Failed to reject request. Please try again.')
    }
  }
}

const setUnderReview = async (requestId) => {
  try {
    // Update the request status to "Under Review"
    await ProviderAPIService.updateProviderRequest(requestId, {
      status: 'UNDER_REVIEW',
      actionBy: 'admin' // This should be the current user
    })

    // Refresh the data
    await fetchProviderRequests()
    showToastMessage(`Request ${requestId} is now under review`)
  } catch (error) {
    console.error('Error setting request under review:', error)
    showToastMessage('Failed to update request status. Please try again.')
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

// Close create modal
const closeCreateModal = () => {
  showCreateModal.value = false
  // Reset form
  requestForm.value = {
    providerName: '',
    category: '',
    location: '',
    contactEmail: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: ''
  }
}

// Create new request
const createRequest = async () => {
  try {
    // Extract location parts (assuming format: "City, Country")
    const locationParts = requestForm.value.location.split(',').map(part => part.trim())
    const region = locationParts[0] || ''
    const country = locationParts[1] || ''

    // Create request payload
    const requestPayload = {
      providerName: requestForm.value.providerName,
      category: requestForm.value.category,
      locationAddress: requestForm.value.location,
      region: region,
      country: country,
      emailAddress: requestForm.value.contactEmail,
      contacts: requestForm.value.phone,
      scheme: requestForm.value.licenseNumber,
      dateRequested: new Date().toISOString().split('T')[0],
      query: 'New provider request',
      requestedBy: 'Portal User',
      status: 'PENDING'
    }

    // Call API to create request
    const response = await ProviderAPIService.createProviderRequest(requestPayload)

    // Refresh the data
    await fetchProviderRequests()

    // Show success message
    showToastMessage(`Request has been created successfully`)

    // Close modal
    closeCreateModal()
  } catch (error) {
    console.error('Error creating request:', error)
    showToastMessage('Failed to create request. Please try again.')
  }
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
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-bottom: 0.3rem;
}

.detail-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.detail-value {
  font-size: 0.8rem;
  color: #1e293b;
  font-weight: 500;
}

.detail-value.highlight {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3b82f6;
}

.detail-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.8rem;
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
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.3rem;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;
}

.btn-success {
  background: #4b6858;
  color: #e2f1e9;
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.1);
}

.btn-success:hover {
  background: #5a7d6a;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.15);
}

.btn-info {
  background: #4a5d7c;
  color: #e2e9f4;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
}

.btn-info:hover {
  background: #5a6e8e;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15);
}

.btn-danger {
  background: #7c4a4a;
  color: #f4e2e2;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.1);
}

.btn-danger:hover {
  background: #8e5a5a;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.15);
}

.btn-icon {
  width: 14px;
  height: 14px;
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
  margin: 0.25rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.inline-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.inline-details-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-details {
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0.2rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.close-details:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.inline-details-content {
  padding: 0.5rem;
}

.inline-details .detail-grid {
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.inline-details .section-title {
  font-size: 0.75rem;
  margin-bottom: 0.3rem;
  padding-bottom: 0.15rem;
  border-bottom: 1px solid #e2e8f0;
}

.inline-details .detail-value {
  font-size: 0.75rem;
}

.inline-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
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

/* Add Button Styles */
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
  background: #4a5d7c;
  color: #e2e9f4;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15);
  margin-left: 1rem;
}

.add-btn:hover {
  background: #5a6e8e;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
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
  padding: 1.25rem;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group.full-width {
  grid-column: span 2;
}

.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
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
  gap: 0.4rem;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 0.4rem;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.btn-secondary {
  background: #e2e8f0;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #d1d5db;
  transform: translateY(-1px);
}

.btn-primary {
  background: #4a5d7c;
  color: #e2e9f4;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15);
}

.btn-primary:hover {
  background: #5a6e8e;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .modal.modern {
    width: 95%;
    max-height: 95vh;
  }

  .modal-form {
    padding: 1rem;
  }

  .form-section {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }
}

/* Enhanced Form Styles */
.form-section {
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 0.75rem 0;
  padding-left: 0.5rem;
  border-left: 3px solid #3b82f6;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 1rem;
  color: #94a3b8;
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
}

.modern-input,
.modern-select {
  padding: 0.6rem 2.5rem 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  background: #f8fafc;
  font-size: 0.9rem;
  width: 100%;
  transition: all 0.2s ease;
}

.modern-input:focus,
.modern-select:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.modern-input::placeholder {
  color: #94a3b8;
}

.input-help {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 0.25rem;
  font-style: italic;
}

.form-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  border-bottom: none;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Responsive adjustments for the form */
@media (max-width: 640px) {
  .form-section-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .modern-input,
  .modern-select {
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .input-label {
    font-size: 0.7rem;
  }

  .input-help {
    font-size: 0.65rem;
    margin-top: 0.2rem;
  }

  .form-section {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
  }

  .action-buttons {
    flex-direction: column-reverse;
    width: 100%;
    gap: 0.5rem;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 1rem;
  }
}
/* Loading Indicator */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 0.5rem 0.5rem;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(.disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(.active) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
</style>
