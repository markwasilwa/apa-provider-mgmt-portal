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
            <div class="stat-number">{{ scheduledVisits.filter(v => v.status === 'Scheduled').length }}</div>
            <div class="stat-label">Scheduled</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ allVisits.filter(v => v.status === 'Completed').length }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ allVisits.filter(v => v.status === 'In Progress').length }}</div>
            <div class="stat-label">In Progress</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Section -->
    <div class="menu-section">
      <div class="menu-container">
        <div class="menu-tabs">
          <button 
            v-for="tab in menuTabs" 
            :key="tab.id"
            class="menu-tab"
            :class="{ active: activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
          >
            <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.iconPath" />
            </svg>
            <span class="tab-text">{{ tab.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions View -->
    <div v-if="activeTab === 'actions'" class="quick-actions-view">
      <div class="actions-container">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <div class="action-card" @click="showScheduleForm">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3>Schedule New Visit</h3>
            <p>Schedule a new provider facility visit</p>
          </div>
          <div class="action-card" @click="showBulkSchedule">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3>Bulk Schedule</h3>
            <p>Schedule multiple visits at once</p>
          </div>
          <div class="action-card" @click="exportVisits">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3>Export Data</h3>
            <p>Export visit records to Excel/PDF</p>
          </div>
          <div class="action-card" @click="generateReport">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3>Generate Report</h3>
            <p>Create comprehensive visit reports</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scheduled Visits View -->
    <div v-else-if="activeTab === 'scheduled'" class="scheduled-visits-view">
      <div class="scheduled-container">
        <div class="section-header">
          <h2 class="section-title">Scheduled Visits</h2>
          <div class="section-actions">
            <button class="action-btn" @click="refreshScheduled">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div class="scheduled-list">
          <div class="list-header">
            <div class="header-col provider-col">Provider</div>
            <div class="header-col date-col">Scheduled Date</div>
            <div class="header-col status-col">Status</div>
            <div class="header-col actions-col">Actions</div>
          </div>
          <div v-for="visit in scheduledVisits" :key="visit.id" class="list-item" @click="editVisit(visit)">
            <div class="item-col provider-col">
              <h4 class="provider-name">{{ visit.providerName }}</h4>
            </div>
            <div class="item-col date-col">
              <span class="visit-date">{{ formatDate(visit.meetingDate) || 'Date not set' }}</span>
            </div>
            <div class="item-col status-col">
              <div class="status-badge">
                <span class="status-dot" :class="getStatusClass(visit.status)"></span>
                <span class="status-text">{{ visit.status }}</span>
              </div>
            </div>
            <div class="item-col actions-col">
              <button class="edit-btn" @click.stop="editVisit(visit)" title="Edit Visit">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="scheduledVisits.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3>No Scheduled Visits</h3>
          <p>Get started by scheduling your first provider visit.</p>
          <p>Use the Schedule & Update tab to create new visits.</p>
        </div>
      </div>
    </div>

    <!-- Schedule View -->
    <div v-else-if="activeTab === 'schedule'" class="schedule-view">
      <div class="schedule-container">
        <!-- Schedule Visit Card -->
        <div class="form-card centered">
          <div class="card-header">
            <h2 class="card-title">
              <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule New Visit
            </h2>
          </div>
          <form @submit.prevent="scheduleVisit" class="modern-form">
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

            <!-- Conflict of Interest Agreement -->
            <div class="agreement-section">
              <div class="agreement-header">
                <svg class="agreement-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                </svg>
                <h4>Conflict of Interest Agreement</h4>
              </div>
              <div class="agreement-content">
                <p>By proceeding, you acknowledge that you have read and understood the conflict of interest policy and have no existing conflicts with the selected provider.</p>
              </div>

              <div class="consent-options">
                <label class="consent-option" :class="{ active: scheduleForm.consent === 'agree' }">
                  <input type="radio" v-model="scheduleForm.consent" value="agree" required>
                  <span class="consent-check">
                    <svg v-if="scheduleForm.consent === 'agree'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="consent-text">I agree to the terms</span>
                </label>
                <label class="consent-option" :class="{ active: scheduleForm.consent === 'disagree' }">
                  <input type="radio" v-model="scheduleForm.consent" value="disagree" required>
                  <span class="consent-check">
                    <svg v-if="scheduleForm.consent === 'disagree'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="consent-text">I disagree</span>
                </label>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Visit Date</label>
              <input type="date" v-model="scheduleForm.meetingDate" required class="modern-input date-input">
            </div>

            <button type="submit" class="primary-btn" :disabled="scheduleForm.consent !== 'agree'">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Visit
            </button>
          </form>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Menu state
const activeTab = ref('actions')
const menuTabs = ref([
  {
    id: 'actions',
    name: 'Quick Actions',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 'scheduled',
    name: 'Scheduled Visits',
    iconPath: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  },
  {
    id: 'schedule',
    name: 'Schedule Visit',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  }
])

// Form states
const scheduleForm = ref({
  providerId: '',
  meetingDate: '',
  consent: ''
})

const updateForm = ref({
  providerId: '',
  meetingDate: '',
  comments: '',
  visitReport: null,
  providerImage: null
})

const updateSuccess = ref(false)

// Providers data (equivalent to PHP $providers)
const providers = ref([
  {
    id: 1,
    name: 'Nairobi General Hospital',
    meetingDate: '2024-02-15'
  },
  {
    id: 2,
    name: 'Mombasa Medical Clinic',
    meetingDate: '2024-02-18'
  },
  {
    id: 3,
    name: 'Kisumu Pharmacy Plus',
    meetingDate: '2024-02-12'
  },
  {
    id: 4,
    name: 'Eldoret Diagnostic Center',
    meetingDate: '2024-02-20'
  },
  {
    id: 5,
    name: 'Nakuru Dental Care',
    meetingDate: '2024-02-10'
  },
  {
    id: 6,
    name: 'Thika Mental Health Center',
    meetingDate: '2024-02-22'
  }
])

// All visits data (equivalent to PHP $updated_visits)
const allVisits = ref([
  {
    id: 1,
    providerName: 'Nairobi General Hospital',
    meetingDate: '2024-02-15',
    comments: 'Facility inspection completed successfully. All compliance requirements met.',
    visitReport: '#',
    providerImage: '/api/placeholder/100/100',
    status: 'Completed'
  },
  {
    id: 2,
    providerName: 'Mombasa Medical Clinic',
    meetingDate: '2024-02-18',
    comments: 'Initial assessment completed. Follow-up required for equipment upgrades.',
    visitReport: null,
    providerImage: '/api/placeholder/100/100',
    status: 'Scheduled'
  },
  {
    id: 3,
    providerName: 'Kisumu Pharmacy Plus',
    meetingDate: '2024-02-12',
    comments: 'License renewal inspection completed. Minor documentation updates needed.',
    visitReport: '#',
    providerImage: null,
    status: 'Completed'
  },
  {
    id: 4,
    providerName: 'Eldoret Diagnostic Center',
    meetingDate: '2024-02-20',
    comments: 'Equipment audit in progress. New imaging equipment validated.',
    visitReport: null,
    providerImage: '/api/placeholder/100/100',
    status: 'In Progress'
  }
])

// Computed property for scheduled visits (shows provider meeting dates)
const scheduledVisits = computed(() => {
  return providers.value.map(provider => ({
    id: provider.id,
    providerName: provider.name,
    meetingDate: provider.meetingDate,
    status: provider.meetingDate ? 'Scheduled' : 'Not Scheduled'
  }))
})

// Handle scheduling a visit (equivalent to PHP schedule_visit)
const scheduleVisit = () => {
  if (scheduleForm.value.consent === 'agree') {
    // Find and update the provider's meeting date
    const provider = providers.value.find(p => p.id == scheduleForm.value.providerId)
    if (provider) {
      provider.meetingDate = scheduleForm.value.meetingDate

      // Reset form
      scheduleForm.value = {
        providerId: '',
        meetingDate: '',
        consent: ''
      }

      alert('Visit scheduled successfully!')
    }
  } else {
    alert('You must agree to the Conflict of Interest terms to schedule a visit.')
  }
}

// Load provider meeting date when provider is selected for update
const loadProviderMeetingDate = () => {
  if (updateForm.value.providerId) {
    const provider = providers.value.find(p => p.id == updateForm.value.providerId)
    if (provider && provider.meetingDate) {
      updateForm.value.meetingDate = provider.meetingDate
    } else {
      updateForm.value.meetingDate = ''
    }
  } else {
    updateForm.value.meetingDate = ''
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

// Handle updating visit details (equivalent to PHP update_visit)
const updateVisit = () => {
  const provider = providers.value.find(p => p.id == updateForm.value.providerId)
  if (provider) {
    // Update provider meeting date
    provider.meetingDate = updateForm.value.meetingDate

    // Find existing visit or create new one
    let visit = allVisits.value.find(v => v.providerName === provider.name)
    if (!visit) {
      visit = {
        id: allVisits.value.length + 1,
        providerName: provider.name,
        meetingDate: updateForm.value.meetingDate,
        comments: updateForm.value.comments,
        visitReport: updateForm.value.visitReport,
        providerImage: updateForm.value.providerImage,
        status: 'Updated'
      }
      allVisits.value.push(visit)
    } else {
      // Update existing visit
      visit.meetingDate = updateForm.value.meetingDate
      visit.comments = updateForm.value.comments
      if (updateForm.value.visitReport) visit.visitReport = updateForm.value.visitReport
      if (updateForm.value.providerImage) visit.providerImage = updateForm.value.providerImage
      visit.status = 'Updated'
    }

    // Show success message
    updateSuccess.value = true
    setTimeout(() => {
      updateSuccess.value = false
    }, 3000)

    // Reset form
    updateForm.value = {
      providerId: '',
      meetingDate: '',
      comments: '',
      visitReport: null,
      providerImage: null
    }
  }
}

// Image modal state
const imageModal = ref({
  show: false,
  src: ''
})

// Edit visit (populate update form)
const editVisit = (visit) => {
  const provider = providers.value.find(p => p.name === visit.providerName)
  if (provider) {
    updateForm.value.providerId = provider.id
    updateForm.value.meetingDate = visit.meetingDate

    const fullVisit = allVisits.value.find(v => v.providerName === visit.providerName)
    if (fullVisit) {
      updateForm.value.comments = fullVisit.comments || ''
    }
  }
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
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

// Menu navigation
const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

// Quick actions
const showScheduleForm = () => {
  activeTab.value = 'schedule'
}

const showBulkSchedule = () => {
  alert('Bulk schedule feature coming soon!')
}

const exportVisits = () => {
  alert('Export feature coming soon!')
}

const generateReport = () => {
  alert('Report generation feature coming soon!')
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
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.125rem;
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
}

.input-group {
  margin-bottom: 1.25rem;
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

.consent-options {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.consent-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.consent-option:hover {
  border-color: #d1d5db;
  background: rgba(59, 130, 246, 0.05);
}

.consent-option.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.consent-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.consent-check {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.consent-check svg {
  width: 12px;
  height: 12px;
}

.consent-option.active .consent-check {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.consent-text {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
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

/* Image Modal */
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

/* Menu Section */
.menu-section {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
}

.menu-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.menu-tabs {
  display: flex;
  gap: 0;
}

.menu-tab {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-weight: 500;
  border-bottom: 3px solid transparent;
}

.menu-tab:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.menu-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: white;
}

.tab-icon {
  width: 1rem;
  height: 1rem;
}

.tab-text {
  font-size: 0.875rem;
}

/* Quick Actions View */
.quick-actions-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  flex: 1;
  min-width: 250px;
  max-width: 300px;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.action-icon {
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
  margin: 0 auto 1rem;
}

.action-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}


/* Scheduled Visits View */
.scheduled-visits-view {
  max-width: 1400px;
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
  grid-template-columns: 2fr 1.5fr 1fr 0.8fr;
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
  grid-template-columns: 2fr 1.5fr 1fr 0.8fr;
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

  .menu-tabs {
    flex-wrap: wrap;
  }

  .menu-tab {
    padding: 0.75rem 1rem;
  }

  .tab-text {
    font-size: 0.75rem;
  }

  .quick-actions-view {
    padding: 1.5rem 1rem;
  }

  .actions-grid {
    flex-direction: column;
    align-items: center;
  }


  .action-card {
    max-width: 100%;
    width: 100%;
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

  .action-card {
    padding: 1.5rem;
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
</style>
