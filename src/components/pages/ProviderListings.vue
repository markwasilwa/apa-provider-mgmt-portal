<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Provider Listings</h1>
        <p class="page-subtitle">View and manage all registered healthcare providers</p>
      </div>
      <div class="header-actions">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search providers..." 
          v-model="searchTerm"
        >
        <select class="filter-select" v-model="categoryFilter">
          <option value="all">All Categories</option>
          <option value="Hospital">Hospitals</option>
          <option value="Clinic">Clinics</option>
          <option value="Pharmacy">Pharmacies</option>
          <option value="Diagnostic">Diagnostics</option>
          <option value="Dental">Dental</option>
        </select>
      </div>
    </div>

    <div class="providers-grid">
      <div class="provider-card" v-for="provider in filteredProviders" :key="provider.id">
        <div class="provider-header">
          <div class="provider-status" :class="provider.status.toLowerCase()">
            {{ provider.status }}
          </div>
          <div class="provider-rating">
            <span class="rating-stars">⭐</span>
            <span class="rating-value">{{ provider.rating }}</span>
          </div>
        </div>

        <div class="provider-logo">
          {{ provider.icon }}
        </div>

        <h3 class="provider-name">{{ provider.name }}</h3>
        <p class="provider-category">{{ provider.category }}</p>

        <div class="provider-info">
          <div class="info-item">
            <span class="info-icon">📍</span>
            <span class="info-text">{{ provider.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📞</span>
            <span class="info-text">{{ provider.phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📧</span>
            <span class="info-text">{{ provider.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📜</span>
            <span class="info-text">{{ provider.licenseNumber }}</span>
          </div>
        </div>

        <div class="provider-stats">
          <div class="stat">
            <div class="stat-value">{{ provider.patientsServed }}</div>
            <div class="stat-label">Patients Served</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ provider.yearsActive }}</div>
            <div class="stat-label">Years Active</div>
          </div>
        </div>

        <div class="provider-actions">
          <button class="action-btn primary" @click="viewDetails(provider)">View Details</button>
          <button class="action-btn secondary" @click="editProvider(provider)">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchTerm = ref('')
const categoryFilter = ref('all')

const providers = ref([
  {
    id: 1,
    name: 'Nairobi General Hospital',
    category: 'Hospital',
    location: 'Nairobi, Kenya',
    phone: '+254-700-123456',
    email: 'admin@nairobigeneral.co.ke',
    licenseNumber: 'LIC-NGH-2024-001',
    status: 'Active',
    rating: 4.8,
    icon: '🏥',
    patientsServed: '50K+',
    yearsActive: 15
  },
  {
    id: 2,
    name: 'Mombasa Medical Clinic',
    category: 'Clinic',
    location: 'Mombasa, Kenya',
    phone: '+254-700-789012',
    email: 'info@mombasamedical.co.ke',
    licenseNumber: 'LIC-MMC-2024-002',
    status: 'Active',
    rating: 4.6,
    icon: '🏪',
    patientsServed: '25K+',
    yearsActive: 8
  },
  {
    id: 3,
    name: 'Kisumu Pharmacy Plus',
    category: 'Pharmacy',
    location: 'Kisumu, Kenya',
    phone: '+254-700-345678',
    email: 'orders@kisumupharmacy.co.ke',
    licenseNumber: 'LIC-KPP-2024-003',
    status: 'Active',
    rating: 4.4,
    icon: '💊',
    patientsServed: '15K+',
    yearsActive: 5
  },
  {
    id: 4,
    name: 'Eldoret Diagnostic Center',
    category: 'Diagnostic',
    location: 'Eldoret, Kenya',
    phone: '+254-700-901234',
    email: 'lab@eldoretdiagnostic.co.ke',
    licenseNumber: 'LIC-EDC-2024-004',
    status: 'Suspended',
    rating: 3.9,
    icon: '🔬',
    patientsServed: '12K+',
    yearsActive: 7
  },
  {
    id: 5,
    name: 'Nakuru Dental Care',
    category: 'Dental',
    location: 'Nakuru, Kenya',
    phone: '+254-700-567890',
    email: 'appointments@nakurudental.co.ke',
    licenseNumber: 'LIC-NDC-2024-005',
    status: 'Active',
    rating: 4.7,
    icon: '🦷',
    patientsServed: '8K+',
    yearsActive: 3
  },
  {
    id: 6,
    name: 'Aga Khan Hospital',
    category: 'Hospital',
    location: 'Nairobi, Kenya',
    phone: '+254-700-111222',
    email: 'info@agakhan.co.ke',
    licenseNumber: 'LIC-AKH-2024-006',
    status: 'Active',
    rating: 4.9,
    icon: '🏥',
    patientsServed: '75K+',
    yearsActive: 25
  },
  {
    id: 7,
    name: 'Kenyatta National Hospital',
    category: 'Hospital',
    location: 'Nairobi, Kenya',
    phone: '+254-700-333444',
    email: 'admin@knh.co.ke',
    licenseNumber: 'LIC-KNH-2024-007',
    status: 'Active',
    rating: 4.5,
    icon: '🏥',
    patientsServed: '100K+',
    yearsActive: 50
  },
  {
    id: 8,
    name: 'Thika Mental Health Center',
    category: 'Mental Health',
    location: 'Thika, Kenya',
    phone: '+254-700-555666',
    email: 'care@thikamental.co.ke',
    licenseNumber: 'LIC-TMH-2024-008',
    status: 'Active',
    rating: 4.3,
    icon: '🧠',
    patientsServed: '3K+',
    yearsActive: 2
  }
])

const filteredProviders = computed(() => {
  let filtered = providers.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(provider => 
      provider.name.toLowerCase().includes(search) ||
      provider.location.toLowerCase().includes(search) ||
      provider.category.toLowerCase().includes(search)
    )
  }

  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(provider => provider.category === categoryFilter.value)
  }

  return filtered
})

const viewDetails = (provider) => {
  console.log('Viewing details for:', provider.name)
}

const editProvider = (provider) => {
  console.log('Editing provider:', provider.name)
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 250px;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.provider-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.provider-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.provider-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.provider-status.active {
  background: #d1fae5;
  color: #059669;
}

.provider-status.suspended {
  background: #fee2e2;
  color: #dc2626;
}

.provider-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-stars {
  color: #fbbf24;
}

.rating-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.provider-logo {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.provider-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  margin-bottom: 0.25rem;
}

.provider-category {
  color: #64748b;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
}

.provider-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 20px;
  text-align: center;
}

.info-text {
  color: #1e293b;
  font-size: 0.875rem;
  flex: 1;
}

.provider-stats {
  display: flex;
  justify-content: space-around;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.provider-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #64748b;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .providers-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>