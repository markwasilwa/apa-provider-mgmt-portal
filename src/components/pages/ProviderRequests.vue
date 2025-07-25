<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Provider Requests</h1>
        <p class="page-subtitle">Handle new provider registration requests and applications</p>
      </div>
      <div class="header-actions">
        <select class="filter-select" v-model="statusFilter">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <div class="requests-table">
      <div class="table-header">
        <div class="header-cell">Request ID</div>
        <div class="header-cell">Provider Name</div>
        <div class="header-cell">Category</div>
        <div class="header-cell">Location</div>
        <div class="header-cell">Date Submitted</div>
        <div class="header-cell">Status</div>
        <div class="header-cell">Actions</div>
      </div>

      <div class="table-body">
        <div class="table-row" v-for="request in filteredRequests" :key="request.id">
          <div class="table-cell">
            <span class="request-id">#{{ request.id }}</span>
          </div>
          <div class="table-cell">
            <div class="provider-info">
              <strong class="provider-name">{{ request.providerName }}</strong>
              <small class="provider-contact">{{ request.contactEmail }}</small>
            </div>
          </div>
          <div class="table-cell">
            <span class="category-badge">{{ request.category }}</span>
          </div>
          <div class="table-cell">
            <span class="location">{{ request.location }}</span>
          </div>
          <div class="table-cell">
            <span class="date">{{ request.dateSubmitted }}</span>
          </div>
          <div class="table-cell">
            <span class="status-badge" :class="request.status.toLowerCase().replace(' ', '-')">
              {{ request.status }}
            </span>
          </div>
          <div class="table-cell">
            <div class="action-buttons">
              <button class="action-btn view" @click="viewRequest(request)" title="View Details">👁️</button>
              <button class="action-btn approve" @click="approveRequest(request.id)" title="Approve" v-if="request.status === 'Pending'">✅</button>
              <button class="action-btn reject" @click="rejectRequest(request.id)" title="Reject" v-if="request.status === 'Pending'">❌</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Details Modal -->
    <div v-if="selectedRequest" class="modal-overlay" @click="selectedRequest = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Request Details - #{{ selectedRequest.id }}</h3>
          <button class="close-btn" @click="selectedRequest = null">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>Provider Information</h4>
            <p><strong>Name:</strong> {{ selectedRequest.providerName }}</p>
            <p><strong>Category:</strong> {{ selectedRequest.category }}</p>
            <p><strong>Location:</strong> {{ selectedRequest.location }}</p>
            <p><strong>Contact Email:</strong> {{ selectedRequest.contactEmail }}</p>
            <p><strong>Phone:</strong> {{ selectedRequest.phone }}</p>
          </div>
          <div class="detail-section">
            <h4>License Information</h4>
            <p><strong>License Number:</strong> {{ selectedRequest.licenseNumber }}</p>
            <p><strong>License Expiry:</strong> {{ selectedRequest.licenseExpiry }}</p>
          </div>
          <div class="detail-section">
            <h4>Request Status</h4>
            <p><strong>Status:</strong> 
              <span class="status-badge" :class="selectedRequest.status.toLowerCase().replace(' ', '-')">
                {{ selectedRequest.status }}
              </span>
            </p>
            <p><strong>Submitted:</strong> {{ selectedRequest.dateSubmitted }}</p>
            <p><strong>Last Updated:</strong> {{ selectedRequest.lastUpdated }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="selectedRequest = null" class="btn-secondary">Close</button>
          <button v-if="selectedRequest.status === 'Pending'" @click="processRequest('approve')" class="btn-success">Approve</button>
          <button v-if="selectedRequest.status === 'Pending'" @click="processRequest('reject')" class="btn-danger">Reject</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const statusFilter = ref('all')
const selectedRequest = ref(null)

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
  }
])

const filteredRequests = computed(() => {
  if (statusFilter.value === 'all') {
    return requests.value
  }
  return requests.value.filter(request => 
    request.status.toLowerCase().replace(' ', '-') === statusFilter.value
  )
})

const viewRequest = (request) => {
  selectedRequest.value = request
}

const approveRequest = (requestId) => {
  const request = requests.value.find(r => r.id === requestId)
  if (request) {
    request.status = 'Approved'
    request.lastUpdated = new Date().toISOString().split('T')[0]
  }
}

const rejectRequest = (requestId) => {
  if (confirm('Are you sure you want to reject this request?')) {
    const request = requests.value.find(r => r.id === requestId)
    if (request) {
      request.status = 'Rejected'
      request.lastUpdated = new Date().toISOString().split('T')[0]
    }
  }
}

const processRequest = (action) => {
  if (selectedRequest.value) {
    if (action === 'approve') {
      approveRequest(selectedRequest.value.id)
    } else if (action === 'reject') {
      rejectRequest(selectedRequest.value.id)
    }
    selectedRequest.value = null
  }
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.requests-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 100px 1fr 120px 150px 120px 120px 120px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-cell {
  padding: 1rem 0.75rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 100px 1fr 120px 150px 120px 120px 120px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  padding: 1rem 0.75rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.request-id {
  font-family: monospace;
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.75rem;
}

.provider-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.provider-name {
  color: #1e293b;
  font-size: 0.875rem;
}

.provider-contact {
  color: #64748b;
  font-size: 0.75rem;
}

.category-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.location, .date {
  color: #64748b;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.under-review {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.approved {
  background: #d1fae5;
  color: #059669;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #f1f5f9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px rgba(0,0,0,0.1);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  color: #1e293b;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.detail-section p {
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-success {
  background: #059669;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .header-cell,
  .table-cell {
    padding: 0.5rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>