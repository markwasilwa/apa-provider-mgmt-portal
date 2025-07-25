<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Provider Visits</h1>
        <p class="page-subtitle">Track and manage provider facility visits and inspections</p>
      </div>
    </div>

    <!-- Schedule Visit Form -->
    <div class="form-section">
      <h2 class="section-title">Schedule Visit</h2>
      <form @submit.prevent="scheduleVisit" class="visit-form">
        <div class="form-group">
          <label for="provider_id">Select Provider:</label>
          <select v-model="scheduleForm.providerId" id="provider_id" required>
            <option value="">--Select Provider--</option>
            <option v-for="provider in providers" :key="provider.id" :value="provider.id">
              {{ provider.name }}
            </option>
          </select>
        </div>

        <!-- Conflict of Interest Agreement -->
        <div class="conflict-of-interest">
          <p><strong>Conflict of Interest Agreement:</strong></p>
          <p>By selecting "Agree", you acknowledge that you have read and understood the conflict of interest policy and have no existing conflicts with the provider. If you have any concerns, please discuss them with the provider before proceeding with your visit.</p>
        </div>

        <!-- Consent Radio Buttons -->
        <div class="consent-radio-buttons">
          <label class="radio-label">
            <input type="radio" v-model="scheduleForm.consent" value="agree" required>
            I Agree to the Conflict of Interest Terms
          </label>
          <label class="radio-label">
            <input type="radio" v-model="scheduleForm.consent" value="disagree" required>
            I Disagree to the Conflict of Interest Terms
          </label>
        </div>

        <!-- Meeting Date -->
        <div class="form-group">
          <label for="meeting_date">Visit Date:</label>
          <input type="date" v-model="scheduleForm.meetingDate" id="meeting_date" required>
        </div>

        <button type="submit" class="submit-btn" :disabled="scheduleForm.consent !== 'agree'">
          Schedule Visit
        </button>
      </form>
    </div>

    <!-- Scheduled Visits Table -->
    <div class="table-section">
      <h3 class="section-title">Scheduled Visits</h3>
      <div class="table-container">
        <table class="visits-table">
          <thead>
            <tr>
              <th>Provider Name</th>
              <th>Meeting Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="visit in scheduledVisits" :key="visit.id">
              <td>{{ visit.providerName }}</td>
              <td>{{ visit.meetingDate || 'Not Set' }}</td>
              <td>
                <span class="status-badge" :class="visit.status.toLowerCase().replace(' ', '-')">
                  {{ visit.status }}
                </span>
              </td>
              <td>
                <button class="action-btn small" @click="editVisit(visit)">✏️ Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Update Visit Details Form -->
    <div class="form-section">
      <h2 class="section-title">Update Visit Details</h2>
      <form @submit.prevent="updateVisit" class="visit-form">
        <div class="form-group">
          <label for="provider_id_update">Select Provider:</label>
          <select v-model="updateForm.providerId" id="provider_id_update" @change="loadProviderMeetingDate" required>
            <option value="">--Select Provider--</option>
            <option v-for="provider in providers" :key="provider.id" :value="provider.id">
              {{ provider.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="meeting_date_update">Meeting Date:</label>
          <input type="date" v-model="updateForm.meetingDate" id="meeting_date_update" required>
        </div>

        <div class="form-group">
          <label for="comments">Visit Comments:</label>
          <textarea v-model="updateForm.comments" id="comments" rows="4" placeholder="Enter visit comments..."></textarea>
        </div>

        <div class="form-group">
          <label for="visit_report">Visit Report:</label>
          <input type="file" @change="handleFileUpload($event, 'visitReport')" id="visit_report" accept=".pdf,.doc,.docx">
          <small class="file-info">Upload PDF or Word document</small>
        </div>

        <div class="form-group">
          <label for="provider_image">Provider Image:</label>
          <input type="file" @change="handleFileUpload($event, 'providerImage')" id="provider_image" accept="image/*">
          <small class="file-info">Upload image file</small>
        </div>

        <button type="submit" class="submit-btn">Update Visit</button>
      </form>
    </div>

    <!-- Success Message -->
    <div v-if="updateSuccess" class="success-message">
      Visit details updated successfully!
    </div>

    <!-- All Visits Table -->
    <div class="table-section">
      <h3 class="section-title">All Visits</h3>
      <div class="table-container">
        <table class="visits-table detailed">
          <thead>
            <tr>
              <th>Provider Name</th>
              <th>Meeting Date</th>
              <th>Comments</th>
              <th>Visit Report</th>
              <th>Provider Image</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="visit in allVisits" :key="visit.id">
              <td>{{ visit.providerName }}</td>
              <td>{{ visit.meetingDate }}</td>
              <td>{{ visit.comments || 'No comments' }}</td>
              <td>
                <a v-if="visit.visitReport" :href="visit.visitReport" class="file-link" target="_blank">
                  📄 View Report
                </a>
                <span v-else class="no-file">No report</span>
              </td>
              <td>
                <img v-if="visit.providerImage" :src="visit.providerImage" alt="Provider Image" class="provider-image">
                <span v-else class="no-image">No image</span>
              </td>
              <td>
                <span class="status-badge" :class="visit.status.toLowerCase().replace(' ', '-')">
                  {{ visit.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d87f0;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.form-section {
  margin-bottom: 3rem;
}

.section-title {
  color: #2d87f0;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.visit-form {
  width: 50%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
}

.file-info {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Conflict of Interest Agreement */
.conflict-of-interest {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.conflict-of-interest p {
  margin-bottom: 10px;
}

.conflict-of-interest strong {
  color: #007bff;
}

/* Consent Radio Buttons */
.consent-radio-buttons {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.radio-label {
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  margin-right: 10px;
  width: auto;
}

/* Submit Button */
.submit-btn {
  width: auto;
  background-color: #2d87f0;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  margin: 0 auto;
  display: block;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1a5b9b;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

/* Table Sections */
.table-section {
  margin-bottom: 3rem;
}

.table-container {
  display: flex;
  justify-content: center;
}

.visits-table {
  width: 50%;
  margin: 30px auto;
  border-collapse: collapse;
  text-align: center;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.visits-table.detailed {
  width: 80%;
}

.visits-table th,
.visits-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.visits-table th {
  background-color: #2d87f0;
  color: white;
  font-weight: 600;
}

.visits-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.visits-table tbody tr:hover {
  background-color: #f1f5f9;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.scheduled {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.not-scheduled {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.in-progress {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.completed {
  background: #d1fae5;
  color: #059669;
}

.status-badge.updated {
  background: #e0f2fe;
  color: #0369a1;
}

/* Action Buttons */
.action-btn {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #e2e8f0;
}

.action-btn.small {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Provider Images and Files */
.provider-image {
  max-width: 100px;
  height: auto;
  border-radius: 5px;
}

.file-link {
  color: #2d87f0;
  text-decoration: none;
  font-size: 0.875rem;
}

.file-link:hover {
  text-decoration: underline;
}

.no-file,
.no-image {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.875rem;
}

/* Success Message */
.success-message {
  color: #059669;
  text-align: center;
  font-size: 18px;
  background: #d1fae5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem auto;
  max-width: 600px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .visit-form {
    width: 90%;
  }
  
  .visits-table {
    width: 95%;
  }
  
  .visits-table.detailed {
    width: 100%;
  }
  
  .consent-radio-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .submit-btn {
    font-size: 18px;
  }
}
</style>