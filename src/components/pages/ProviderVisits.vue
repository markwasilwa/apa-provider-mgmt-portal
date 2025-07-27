<template>
  <div class="provider-visits-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Provider Visits Management
          </h1>
          <p class="subtitle">Schedule, track, and manage healthcare provider facility visits and inspections</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ visitMeetings.filter(v => !v.visitReport).length }}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ visitMeetings.filter(v => v.visitReport).length }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ visitMeetings.length }}</div>
            <div class="stat-label">Total</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visits View -->
    <div class="visits-view">
      <div class="visits-container">
        <div class="two-column-layout">
          <!-- Simple Visits List (Left Column) -->
          <div class="visits-list-container">
            <h2 class="section-title">Scheduled Visits</h2>
            <div class="visits-list">
              <div v-for="visit in visitMeetings" :key="visit.id" class="visit-item" @click="editVisit(visit)">
                <div class="visit-content">
                  <div class="visit-main-info">
                    <div class="visit-provider">Provider ID: {{ visit.providerId }}</div>
                    <div class="visit-date-compact">{{ formatDate(visit.visitDate) }}</div>
                  </div>
                  <div class="visit-meta">
                    <span class="visit-created-compact">Created: {{ formatDateTime(visit.createdAt) }}</span>
                    <span class="status-badge" :class="visit.visitReport ? 'completed' : 'pending'">
                      {{ visit.visitReport ? 'Completed' : 'Pending' }}
                    </span>
                  </div>
                </div>
                <div class="visit-actions">
                  <button class="icon-btn edit-btn" @click.stop="editVisit(visit)" title="Edit Visit">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="visitMeetings.length === 0" class="empty-state">
              <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3>No Visits Scheduled</h3>
              <p>Get started by scheduling your first provider visit.</p>
              <p>Click the button on the right to create a new visit.</p>
            </div>
          </div>

          <!-- Create Visit Form (Right Column) -->
          <div class="form-container">
            <button v-if="!showForm" @click="toggleForm" class="create-visit-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Visit
            </button>

            <div v-if="showForm" class="form-card form-slide-in">
              <div class="card-header">
                <h2 class="card-title">
                  <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule New Visit
                </h2>
                <button class="close-form-btn" @click="toggleForm">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form @submit.prevent="scheduleVisit" class="modern-form compact-form">
                <div class="form-row">
                  <div class="input-group">
                    <label class="input-label">Provider</label>
                    <div class="select-wrapper">
                      <select v-model="scheduleForm.providerId" required class="modern-select">
                        <option value="">Choose a provider...</option>
                        <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                          {{ provider.name }}
                        </option>
                      </select>
                      <span class="select-icon">⌄</span>
                    </div>
                  </div>

                  <div class="input-group">
                    <label class="input-label">Visit Date</label>
                    <input type="date" v-model="scheduleForm.meetingDate" required class="modern-input date-input">
                  </div>
                </div>

                <!-- Conflict of Interest Agreement -->
                <div class="agreement-card">
                  <div class="agreement-header">
                    <svg class="agreement-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                    </svg>
                    <div class="agreement-title">Conflict of Interest</div>
                  </div>
                  <div class="agreement-content">
                    <p>By proceeding, you acknowledge no conflicts with the selected provider.</p>
                  </div>

                  <div class="consent-options">
                    <label class="consent-radio" :class="{ active: scheduleForm.consent === 'agree' }">
                      <input type="radio" v-model="scheduleForm.consent" value="agree" required>
                      <span class="radio-checkmark"></span>
                      <span class="consent-text">I agree</span>
                    </label>
                    <label class="consent-radio" :class="{ active: scheduleForm.consent === 'disagree' }">
                      <input type="radio" v-model="scheduleForm.consent" value="disagree" required>
                      <span class="radio-checkmark"></span>
                      <span class="consent-text">I disagree</span>
                    </label>
                  </div>
                </div>

                <button type="submit" class="primary-btn" :disabled="scheduleForm.consent !== 'agree'">
                  Schedule Visit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Success Toast -->
    <div v-if="updateSuccess" class="toast success-toast">
      <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="toast-content">
        <h4>Success!</h4>
        <p>Visit details updated successfully</p>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="imageModal.show" class="modal-overlay" @click="closeImageModal">
      <div class="image-modal" @click.stop>
        <button class="modal-close" @click="closeImageModal">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="imageModal.src" alt="Provider Image" class="modal-image">
      </div>
    </div>

    <!-- Edit Visit Modal -->
    <div v-if="editModal.show" class="modal-overlay" @click="closeEditModal">
      <div class="edit-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Edit Provider Visit</h3>
          <button class="modal-close" @click="closeEditModal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateVisit" class="modern-form">
            <div class="input-group">
              <label class="input-label">Provider</label>
              <div class="select-wrapper">
                <select v-model="updateForm.providerId" required class="modern-select">
                  <option value="">Choose a provider...</option>
                  <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                    {{ provider.name }}
                  </option>
                </select>
                <span class="select-icon">⌄</span>
              </div>
            </div>

            <div class="form-section">
              <h4 class="section-subtitle">Visit Details</h4>

              <div class="input-group">
                <label class="input-label">Visit Date</label>
                <input type="date" v-model="updateForm.visitDate" required class="modern-input date-input">
              </div>

              <div class="input-group">
                <label class="input-label">Visit Comments</label>
                <textarea v-model="updateForm.visitComments" class="modern-textarea" placeholder="Enter visit notes or comments..."></textarea>
              </div>

              <div class="file-upload-item">
                <label class="file-upload-label">
                  <svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="file-text">Upload Visit Report</span>
                  <span class="file-hint">PDF, DOC, DOCX (Max 5MB)</span>
                  <input type="file" class="file-input" @change="e => handleFileUpload(e, 'visitReport')" accept=".pdf,.doc,.docx">
                </label>
              </div>
            </div>

            <div class="form-section">
              <h4 class="section-subtitle">Meeting Details</h4>

              <div class="input-group">
                <label class="input-label">Meeting Title</label>
                <input type="text" v-model="updateForm.meetingTitle" class="modern-input" placeholder="Enter meeting title...">
              </div>

              <div class="input-group">
                <label class="input-label">Meeting Date</label>
                <input type="date" v-model="updateForm.meetingDate" class="modern-input date-input">
              </div>

              <div class="input-group">
                <label class="input-label">Meeting Comments</label>
                <textarea v-model="updateForm.meetingComments" class="modern-textarea" placeholder="Enter meeting notes or comments..."></textarea>
              </div>

              <div class="file-upload-item">
                <label class="file-upload-label">
                  <svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="file-text">Upload Meeting Minutes</span>
                  <span class="file-hint">PDF, DOC, DOCX (Max 5MB)</span>
                  <input type="file" class="file-input" @change="e => handleFileUpload(e, 'meetingMinutes')" accept=".pdf,.doc,.docx">
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="secondary-btn" @click="closeEditModal">Cancel</button>
              <button type="submit" class="primary-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ProviderAPIService } from '@/services/api'

// Visit meetings data from API
const visitMeetings = ref([])
const isLoading = ref(false)
const error = ref(null)
const showForm = ref(false)

// Toggle form visibility
const toggleForm = () => {
  showForm.value = !showForm.value
}

// Form states
const scheduleForm = ref({
  providerId: '',
  visitDate: '',
  visitComments: '',
  meetingTitle: '',
  meetingDate: '',
  meetingComments: ''
})

const updateForm = ref({
  id: null,
  providerId: '',
  visitDate: '',
  visitComments: '',
  visitReport: null,
  meetingTitle: '',
  meetingDate: '',
  meetingComments: '',
  meetingMinutes: null
})

const updateSuccess = ref(false)

// Providers data (equivalent to PHP $providers)
const providers = ref([
  {
    id: 154,
    name: 'Nairobi General Hospital'
  },
  {
    id: 155,
    name: 'Mombasa Medical Clinic'
  },
  {
    id: 156,
    name: 'Kisumu Pharmacy Plus'
  },
  {
    id: 157,
    name: 'Eldoret Diagnostic Center'
  },
  {
    id: 158,
    name: 'Nakuru Dental Care'
  },
  {
    id: 159,
    name: 'Thika Mental Health Center'
  }
])

// Fetch visit meetings from API
const fetchVisitMeetings = async () => {
  isLoading.value = true
  error.value = null

  try {
    const params = {
      page: 0,
      size: 20,
      sortBy: 'visitDate',
      sortDir: 'desc'
    }

    const response = await ProviderAPIService.getVisitMeetings(params)
    visitMeetings.value = response.content

  } catch (err) {
    console.error('Error fetching visit meetings:', err)
    error.value = 'Failed to load visit meetings. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Handle scheduling a new visit
const scheduleVisit = async () => {
  try {
    const visitData = {
      providerId: parseInt(scheduleForm.value.providerId),
      visitDate: scheduleForm.value.visitDate,
      visitComments: scheduleForm.value.visitComments || null,
      meetingTitle: scheduleForm.value.meetingTitle || null,
      meetingDate: scheduleForm.value.meetingDate || null,
      meetingComments: scheduleForm.value.meetingComments || null
    }

    await ProviderAPIService.createVisitMeeting(visitData)

    // Reset form and refresh data
    scheduleForm.value = {
      providerId: '',
      visitDate: '',
      visitComments: '',
      meetingTitle: '',
      meetingDate: '',
      meetingComments: ''
    }

    // Hide form after successful submission
    showForm.value = false

    fetchVisitMeetings()

    alert('Visit scheduled successfully!')
  } catch (err) {
    console.error('Error scheduling visit:', err)
    alert('Failed to schedule visit. Please try again.')
  }
}

// Handle file uploads (equivalent to PHP file handling)
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    // In a real app, you would upload to server and get URL
    // For demo, we'll create a local URL
    const fileURL = URL.createObjectURL(file)
    updateForm.value[fieldName] = fileURL
  }
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Not set'

  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format date and time for display
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Not set'

  const date = new Date(dateTimeString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Edit visit function
const editVisit = (visit) => {
  updateForm.value = {
    id: visit.id,
    providerId: visit.providerId.toString(),
    visitDate: visit.visitDate || '',
    visitComments: visit.visitComments || '',
    visitReport: visit.visitReport,
    meetingTitle: visit.meetingTitle || '',
    meetingDate: visit.meetingDate || '',
    meetingComments: visit.meetingComments || '',
    meetingMinutes: visit.meetingMinutes
  }

  editModal.value.show = true
  editModal.value.visit = visit
}

// Update visit function
const updateVisit = async () => {
  try {
    const visitData = {
      providerId: parseInt(updateForm.value.providerId),
      visitDate: updateForm.value.visitDate,
      visitComments: updateForm.value.visitComments || null,
      visitReport: updateForm.value.visitReport,
      meetingTitle: updateForm.value.meetingTitle || null,
      meetingDate: updateForm.value.meetingDate || null,
      meetingComments: updateForm.value.meetingComments || null,
      meetingMinutes: updateForm.value.meetingMinutes
    }

    await ProviderAPIService.updateVisitMeeting(updateForm.value.id, visitData)

    closeEditModal()
    fetchVisitMeetings()

    updateSuccess.value = true
    setTimeout(() => {
      updateSuccess.value = false
    }, 3000)

  } catch (err) {
    console.error('Error updating visit:', err)
    alert('Failed to update visit. Please try again.')
  }
}

// Fetch data when component is mounted
onMounted(() => {
  fetchVisitMeetings()
})

// Modal states
const imageModal = ref({
  show: false,
  src: ''
})

const editModal = ref({
  show: false,
  visit: null
})

// Close edit modal
const closeEditModal = () => {
  editModal.value = {
    show: false,
    visit: null
  }
}

// Get status class for styling
const getStatusClass = (status) => {
  const statusMap = {
    'Scheduled': 'scheduled',
    'Not Scheduled': 'not-scheduled',
    'In Progress': 'in-progress',
    'Completed': 'completed',
    'Updated': 'updated'
  }
  return statusMap[status] || 'default'
}

// View image in modal
const viewImage = (imageSrc) => {
  imageModal.value = {
    show: true,
    src: imageSrc
  }
}

// Close image modal
const closeImageModal = () => {
  imageModal.value = {
    show: false,
    src: ''
  }
}


const refreshScheduled = () => {
  alert('Refreshing scheduled visits...')
}

const getProgressText = (status) => {
  const progressMap = {
    'Scheduled': 'Awaiting visit',
    'In Progress': 'Visit ongoing', 
    'Completed': 'Visit completed',
    'Not Scheduled': 'Needs scheduling'
  }
  return progressMap[status] || 'Unknown status'
}
</script>

<style scoped>
/* Container and Layout */
.provider-visits-container {
  min-height: 100vh;
  background: white;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Header Section */
.header-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.5rem 0;
}

.header-content {
  max-width: 1800px;
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

/* Main Content Grid */
.content-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.forms-column,
.display-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Card Styles */
.form-card,
.data-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  width: 100%;
  margin-bottom: 1.5rem;
}

.card-header {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.visit-count {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Modern Forms */
.modern-form {
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

/* Compact Form Styles */
.compact-form {
  padding: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

.agreement-card {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-left: 3px solid #3b82f6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.agreement-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-left-color: #2563eb;
}

.agreement-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.agreement-title {
  font-weight: 600;
  color: #1e40af;
  font-size: 0.9rem;
}

.agreement-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
}

.agreement-content {
  margin-bottom: 0.75rem;
  padding-left: 0.25rem;
}

.agreement-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.4;
}

.consent-options {
  display: flex;
  gap: 1.25rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #e2e8f0;
}

.input-group {
  margin-bottom: 1.25rem;
}

.form-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.section-subtitle {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.input-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.modern-input,
.modern-select,
.modern-textarea {
  width: 100%;
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
  min-height: 100px;
}

.date-input {
  font-family: inherit;
}

/* Agreement Section */
.agreement-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin: 1.25rem 0;
}

.agreement-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.agreement-header h4 {
  margin: 0;
  color: #1e293b;
  font-size: 1rem;
}

.agreement-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.agreement-content p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

/* This rule is now defined earlier in the file */

.consent-radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  user-select: none;
}

.consent-radio:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.consent-radio.active {
  background-color: rgba(59, 130, 246, 0.1);
}

.consent-radio input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-checkmark {
  position: relative;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: inline-block;
  transition: all 0.2s ease;
}

.radio-checkmark:after {
  content: "";
  position: absolute;
  display: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
}

.consent-radio:hover .radio-checkmark {
  border-color: #93c5fd;
}

.consent-radio.active .radio-checkmark {
  border-color: #3b82f6;
}

.consent-radio.active .radio-checkmark:after {
  display: block;
}

.consent-text {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
  transition: color 0.2s ease;
}

.consent-radio.active .consent-text {
  color: #1e40af;
}

/* File Upload */
.file-upload-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.25rem 0;
}

.file-upload-item {
  text-align: center;
}

.file-upload-label {
  display: block;
  padding: 1.25rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.file-upload-label:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-icon {
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.file-text {
  font-weight: 500;
  color: #374151;
}

.file-hint {
  display: block;
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
}

/* Buttons */
.primary-btn,
.secondary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
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

.primary-btn {
  background: #3b82f6;
  color: white;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  background: #2563eb;
}

.primary-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.secondary-btn {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary-btn:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #d1d5db 100%);
  transform: translateY(-1px);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Data Display */
.visits-grid {
  padding: 1.25rem;
}

.visit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem;
  margin-bottom: 0.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.visit-item:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.visit-item:last-child {
  margin-bottom: 0;
}

.visit-info h4 {
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  font-size: 1rem;
}

.visit-date {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.visit-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.scheduled {
  background: #3b82f6;
}

.status-dot.not-scheduled {
  background: #9ca3af;
}

.status-dot.in-progress {
  background: #f59e0b;
}

.status-dot.completed {
  background: #10b981;
}

.status-dot.updated {
  background: #06b6d4;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

/* Visit Records */
.visits-list {
  padding: 1.25rem;
  max-height: 400px;
  overflow-y: auto;
}

.visit-record {
  padding: 1.25rem;
  margin-bottom: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.visit-record:last-child {
  margin-bottom: 0;
}

.record-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.record-info h4 {
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  font-size: 1.125rem;
}

.record-date {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.record-comments {
  margin: 0;
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
}

.status-badge.modern {
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.scheduled {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.status-badge.in-progress {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.status-badge.updated {
  background: rgba(6, 182, 212, 0.1);
  color: #0e7490;
}

.record-attachments {
  display: flex;
  gap: 0.5rem;
}

.attachment-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.attachment-link:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.attachment-icon {
  width: 0.875rem;
  height: 0.875rem;
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

/* Image Modal */
.image-modal {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close svg {
  width: 1rem;
  height: 1rem;
}

/* Edit Modal */
.edit-modal {
  position: relative;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
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
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Section Title */
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}


/* Scheduled Visits View */
.scheduled-visits-view {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.scheduled-list {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 2rem;
}

.list-header {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 3fr 2fr 1.5fr 1fr;
  gap: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.list-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: grid;
  grid-template-columns: 3fr 2fr 1.5fr 1fr;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background: #f8fafc;
}

.provider-col {
  min-width: 0;
}

.date-col {
  min-width: 0;
}

.status-col {
  min-width: 0;
}

.actions-col {
  display: flex;
  justify-content: center;
}

.provider-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visit-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.edit-btn {
  width: 1.75rem;
  height: 1.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.edit-btn:hover {
  background: #f9fafb;
  border-color: #3b82f6;
  color: #3b82f6;
}

.edit-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}


.modal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

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
  .provider-visits-container {
    padding: 0;
  }

  .header-content {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .content-grid {
    padding: 1rem;
  }

  .modern-form {
    padding: 1.25rem;
  }

  .file-upload-group {
    grid-template-columns: 1fr;
  }

  .consent-options {
    flex-direction: column;
  }

  .header-stats {
    gap: 0.75rem;
  }


  .scheduled-list .list-header,
  .scheduled-list .list-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .list-header {
    display: none;
  }

  .list-item {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .item-col {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
  }

  .item-col::before {
    content: attr(data-label);
    font-weight: 600;
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .provider-col::before {
    content: 'Provider:';
  }

  .date-col::before {
    content: 'Date:';
  }

  .status-col::before {
    content: 'Status:';
  }

  .actions-col::before {
    content: 'Actions:';
  }

  .actions-col {
    justify-content: flex-end;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .section-actions {
    justify-content: center;
  }

}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.25rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-header {
    padding: 0.875rem 1rem;
  }

  .modern-form {
    padding: 1rem;
  }
}

/* Schedule View */
.schedule-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.schedule-container {
  display: flex;
  justify-content: center;
}

.form-card.centered {
  max-width: 600px;
  width: 100%;
}

/* Visits View */
.visits-view {
  max-width: 1800px;
  margin: 0 auto;
  padding: 2rem 2rem;
}

.visits-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.visits-layout {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.visits-layout .scheduled-container {
  flex: 1;
  min-width: 500px;
}

.visits-layout .schedule-container {
  flex: 0 0 400px;
}

.visits-layout .form-card {
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

@media (max-width: 1200px) {
  .visits-layout {
    flex-direction: column;
  }

  .visits-layout .scheduled-container,
  .visits-layout .schedule-container {
    min-width: 100%;
    width: 100%;
  }
}


/* Visits List Styles */
.visits-list-container {
  flex: 1;
  width: 100%;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  padding-left: 0.25rem;
}

.visits-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.visit-item {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.visit-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  background-color: #f8fafc;
}

.visit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.visit-main-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.visit-provider {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.visit-date-compact {
  color: #4b5563;
  font-size: 0.9rem;
}

.visit-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #6b7280;
}

.visit-created-compact {
  font-size: 0.8rem;
  color: #6b7280;
}

.visit-actions {
  display: flex;
  justify-content: flex-end;
}

/* Two Column Layout */
.two-column-layout {
  width: 100%;
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

@media (max-width: 1024px) {
  .two-column-layout {
    flex-direction: column-reverse;
  }
}

/* Form Container */
.form-container {
  flex: 0 0 450px;
  position: relative;
}

/* Create Visit Button */
.create-visit-btn {
  width: 100%;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.create-visit-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.create-visit-btn .btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Close Form Button */
.close-form-btn {
  background: transparent;
  border: none;
  color: #64748b;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-form-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.close-form-btn svg {
  width: 1rem;
  height: 1rem;
}

/* Form Animation */
.form-slide-in {
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.icon-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.icon-btn svg {
  width: 1rem;
  height: 1rem;
}


</style>
