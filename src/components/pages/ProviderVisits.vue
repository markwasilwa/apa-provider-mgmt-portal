<template>
  <div class="provider-visits-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            <span class="icon">🏥</span>
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

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column: Forms -->
      <div class="forms-column">
        <!-- Schedule Visit Card -->
        <div class="form-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">📅</span>
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
                <span class="agreement-icon">⚖️</span>
                <h4>Conflict of Interest Agreement</h4>
              </div>
              <div class="agreement-content">
                <p>By proceeding, you acknowledge that you have read and understood the conflict of interest policy and have no existing conflicts with the selected provider.</p>
              </div>
              
              <div class="consent-options">
                <label class="consent-option" :class="{ active: scheduleForm.consent === 'agree' }">
                  <input type="radio" v-model="scheduleForm.consent" value="agree" required>
                  <span class="consent-check">✓</span>
                  <span class="consent-text">I agree to the terms</span>
                </label>
                <label class="consent-option" :class="{ active: scheduleForm.consent === 'disagree' }">
                  <input type="radio" v-model="scheduleForm.consent" value="disagree" required>
                  <span class="consent-check">✗</span>
                  <span class="consent-text">I disagree</span>
                </label>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Visit Date</label>
              <input type="date" v-model="scheduleForm.meetingDate" required class="modern-input date-input">
            </div>

            <button type="submit" class="primary-btn" :disabled="scheduleForm.consent !== 'agree'">
              <span class="btn-icon">📅</span>
              Schedule Visit
            </button>
          </form>
        </div>

        <!-- Update Visit Card -->
        <div class="form-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">✏️</span>
              Update Visit Details
            </h2>
          </div>
          <form @submit.prevent="updateVisit" class="modern-form">
            <div class="input-group">
              <label class="input-label">Provider</label>
              <div class="select-wrapper">
                <select v-model="updateForm.providerId" @change="loadProviderMeetingDate" required class="modern-select">
                  <option value="">Choose a provider...</option>
                  <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                    {{ provider.name }}
                  </option>
                </select>
                <span class="select-icon">⌄</span>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Meeting Date</label>
              <input type="date" v-model="updateForm.meetingDate" required class="modern-input date-input">
            </div>

            <div class="input-group">
              <label class="input-label">Visit Comments</label>
              <textarea v-model="updateForm.comments" rows="4" placeholder="Enter visit comments and observations..." class="modern-textarea"></textarea>
            </div>

            <div class="file-upload-group">
              <div class="file-upload-item">
                <label class="file-upload-label">
                  <span class="file-icon">📄</span>
                  <span class="file-text">Visit Report</span>
                  <input type="file" @change="handleFileUpload($event, 'visitReport')" accept=".pdf,.doc,.docx" class="file-input">
                </label>
                <small class="file-hint">PDF or Word document</small>
              </div>
              
              <div class="file-upload-item">
                <label class="file-upload-label">
                  <span class="file-icon">🖼️</span>
                  <span class="file-text">Provider Image</span>
                  <input type="file" @change="handleFileUpload($event, 'providerImage')" accept="image/*" class="file-input">
                </label>
                <small class="file-hint">JPG, PNG or WebP</small>
              </div>
            </div>

            <button type="submit" class="secondary-btn">
              <span class="btn-icon">💾</span>
              Update Visit
            </button>
          </form>
        </div>
      </div>

      <!-- Right Column: Data Display -->
      <div class="display-column">
        <!-- Scheduled Visits -->
        <div class="data-card">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">📋</span>
              Scheduled Visits
            </h3>
            <span class="visit-count">{{ scheduledVisits.length }} providers</span>
          </div>
          <div class="visits-grid">
            <div v-for="visit in scheduledVisits" :key="visit.id" class="visit-item" @click="editVisit(visit)">
              <div class="visit-info">
                <h4 class="visit-provider">{{ visit.providerName }}</h4>
                <p class="visit-date">{{ formatDate(visit.meetingDate) || 'Date not set' }}</p>
              </div>
              <div class="visit-status">
                <span class="status-dot" :class="getStatusClass(visit.status)"></span>
                <span class="status-text">{{ visit.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- All Visits Overview -->
        <div class="data-card">
          <div class="card-header">
            <h3 class="card-title">
              <span class="card-icon">📊</span>
              Visit History
            </h3>
            <span class="visit-count">{{ allVisits.length }} visits</span>
          </div>
          <div class="visits-list">
            <div v-for="visit in allVisits" :key="visit.id" class="visit-record">
              <div class="record-main">
                <div class="record-info">
                  <h4 class="record-provider">{{ visit.providerName }}</h4>
                  <p class="record-date">{{ formatDate(visit.meetingDate) }}</p>
                  <p v-if="visit.comments" class="record-comments">{{ visit.comments }}</p>
                </div>
                <div class="record-status">
                  <span class="status-badge modern" :class="getStatusClass(visit.status)">
                    {{ visit.status }}
                  </span>
                </div>
              </div>
              <div class="record-attachments" v-if="visit.visitReport || visit.providerImage">
                <a v-if="visit.visitReport" :href="visit.visitReport" class="attachment-link" target="_blank">
                  <span class="attachment-icon">📄</span>
                  Report
                </a>
                <button v-if="visit.providerImage" class="attachment-link" @click="viewImage(visit.providerImage)">
                  <span class="attachment-icon">🖼️</span>
                  Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="updateSuccess" class="toast success-toast">
      <div class="toast-icon">✅</div>
      <div class="toast-content">
        <h4>Success!</h4>
        <p>Visit details updated successfully</p>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="imageModal.show" class="modal-overlay" @click="closeImageModal">
      <div class="image-modal" @click.stop>
        <button class="modal-close" @click="closeImageModal">×</button>
        <img :src="imageModal.src" alt="Provider Image" class="modal-image">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
</script>

<style scoped>
/* Container and Layout */
.provider-visits-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

/* Header Section */
.header-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem 0;
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
  color: white;
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
  color: rgba(255, 255, 255, 0.8);
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

/* Main Content Grid */
.content-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.forms-column,
.display-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-icon {
  font-size: 1.125rem;
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
  padding: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
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
  padding: 1.5rem;
  margin: 1.5rem 0;
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
  font-size: 1.25rem;
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
  font-size: 0.75rem;
  transition: all 0.2s ease;
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
  margin: 1.5rem 0;
}

.file-upload-item {
  text-align: center;
}

.file-upload-label {
  display: block;
  padding: 1.5rem;
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
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
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
  font-size: 1rem;
}

/* Data Display */
.visits-grid {
  padding: 1.5rem;
}

.visit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.75rem;
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
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}

.visit-record {
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.visit-record:last-child {
  margin-bottom: 0;
}

.record-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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
  font-size: 0.875rem;
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
  font-size: 1.25rem;
  z-index: 1;
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
    gap: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
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
    font-size: 2rem;
  }
  
  .content-grid {
    padding: 1rem;
  }
  
  .modern-form {
    padding: 1.5rem;
  }
  
  .file-upload-group {
    grid-template-columns: 1fr;
  }
  
  .consent-options {
    flex-direction: column;
  }
  
  .header-stats {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .card-header {
    padding: 1rem;
  }
  
  .modern-form {
    padding: 1rem;
  }
}
</style>