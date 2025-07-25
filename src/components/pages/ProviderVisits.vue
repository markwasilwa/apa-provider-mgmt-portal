<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Provider Visits</h1>
        <p class="page-subtitle">Track and manage provider facility visits and inspections</p>
      </div>
      <button class="schedule-btn" @click="showScheduleModal = true">📅 Schedule Visit</button>
    </div>

    <div class="visits-grid">
      <div class="visit-card" v-for="visit in visits" :key="visit.id">
        <div class="visit-header">
          <div class="visit-status" :class="visit.status.toLowerCase().replace(' ', '-')">
            {{ visit.status }}
          </div>
          <div class="visit-date">{{ visit.date }}</div>
        </div>
        
        <h3 class="provider-name">{{ visit.providerName }}</h3>
        <p class="visit-type">{{ visit.type }} - {{ visit.category }}</p>
        
        <div class="visit-details">
          <div class="detail-item">
            <span class="detail-label">Inspector:</span>
            <span class="detail-value">{{ visit.inspector }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location:</span>
            <span class="detail-value">{{ visit.location }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">{{ visit.duration }}</span>
          </div>
        </div>

        <div class="visit-score" v-if="visit.score">
          <div class="score-label">Compliance Score</div>
          <div class="score-value" :class="getScoreClass(visit.score)">{{ visit.score }}%</div>
        </div>

        <div class="visit-actions">
          <button class="action-btn" @click="viewReport(visit)">📋 View Report</button>
          <button class="action-btn" v-if="visit.status === 'Scheduled'" @click="startVisit(visit.id)">🚀 Start Visit</button>
        </div>
      </div>
    </div>

    <!-- Schedule Visit Modal -->
    <div v-if="showScheduleModal" class="modal-overlay" @click="showScheduleModal = false">
      <div class="modal" @click.stop>
        <h3>Schedule New Visit</h3>
        <p>This would be a form to schedule a new provider visit.</p>
        <div class="modal-actions">
          <button @click="showScheduleModal = false" class="btn-secondary">Cancel</button>
          <button @click="showScheduleModal = false" class="btn-primary">Schedule Visit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showScheduleModal = ref(false)

const visits = ref([
  {
    id: 1,
    providerName: 'Nairobi General Hospital',
    type: 'Compliance Inspection',
    category: 'Hospital',
    inspector: 'Dr. Sarah Wanjiku',
    location: 'Nairobi, Kenya',
    date: '2024-02-15',
    duration: '4 hours',
    status: 'Completed',
    score: 92
  },
  {
    id: 2,
    providerName: 'Mombasa Medical Clinic',
    type: 'Routine Check',
    category: 'Clinic',
    inspector: 'Dr. James Mwangi',
    location: 'Mombasa, Kenya',
    date: '2024-02-18',
    duration: '2 hours',
    status: 'Scheduled',
    score: null
  },
  {
    id: 3,
    providerName: 'Kisumu Pharmacy Plus',
    type: 'License Renewal',
    category: 'Pharmacy',
    inspector: 'Ms. Grace Achieng',
    location: 'Kisumu, Kenya',
    date: '2024-02-12',
    duration: '1.5 hours',
    status: 'Completed',
    score: 88
  },
  {
    id: 4,
    providerName: 'Eldoret Diagnostic Center',
    type: 'Equipment Audit',
    category: 'Diagnostic',
    inspector: 'Dr. Michael Kiprop',
    location: 'Eldoret, Kenya',
    date: '2024-02-20',
    duration: '3 hours',
    status: 'In Progress',
    score: null
  },
  {
    id: 5,
    providerName: 'Nakuru Dental Care',
    type: 'Compliance Inspection',
    category: 'Dental',
    inspector: 'Dr. Mary Njeri',
    location: 'Nakuru, Kenya',
    date: '2024-02-10',
    duration: '2.5 hours',
    status: 'Completed',
    score: 95
  },
  {
    id: 6,
    providerName: 'Thika Mental Health Center',
    type: 'Facility Review',
    category: 'Mental Health',
    inspector: 'Dr. Peter Kamau',
    location: 'Thika, Kenya',
    date: '2024-02-22',
    duration: '3.5 hours',
    status: 'Scheduled',
    score: null
  }
])

const getScoreClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'poor'
}

const viewReport = (visit) => {
  console.log('Viewing report for:', visit.providerName)
}

const startVisit = (visitId) => {
  const visit = visits.value.find(v => v.id === visitId)
  if (visit) {
    visit.status = 'In Progress'
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

.schedule-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.schedule-btn:hover {
  background: #2563eb;
}

.visits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.visit-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.visit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.visit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.visit-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.visit-status.scheduled {
  background: #dbeafe;
  color: #1d4ed8;
}

.visit-status.in-progress {
  background: #fef3c7;
  color: #d97706;
}

.visit-status.completed {
  background: #d1fae5;
  color: #059669;
}

.visit-date {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.provider-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.visit-type {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.visit-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.detail-value {
  color: #1e293b;
  font-size: 0.875rem;
}

.visit-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.score-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.score-value.excellent {
  color: #059669;
}

.score-value.good {
  color: #0369a1;
}

.score-value.average {
  color: #d97706;
}

.score-value.poor {
  color: #dc2626;
}

.visit-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #e2e8f0;
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
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-bottom: 1rem;
  color: #1e293b;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-primary {
  background: #3b82f6;
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
  
  .visits-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>