<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Provider Categories</h1>
      <p class="page-subtitle">Manage different categories of healthcare providers</p>
      <button class="add-btn" @click="showAddModal = true">+ Add New Category</button>
    </div>

    <div class="categories-grid">
      <div class="category-card" v-for="category in categories" :key="category.id">
        <div class="category-header">
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-actions">
            <button class="action-btn edit" @click="editCategory(category)">✏️</button>
            <button class="action-btn delete" @click="deleteCategory(category.id)">🗑️</button>
          </div>
        </div>
        <h3 class="category-name">{{ category.name }}</h3>
        <p class="category-description">{{ category.description }}</p>
        <div class="category-stats">
          <div class="stat">
            <span class="stat-label">Active Providers</span>
            <span class="stat-value">{{ category.activeProviders }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Registered</span>
            <span class="stat-value">{{ category.totalRegistered }}</span>
          </div>
        </div>
        <div class="category-status">
          <span class="status-badge" :class="category.status.toLowerCase()">
            {{ category.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal (simplified for demo) -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal" @click.stop>
        <h3>Add New Category</h3>
        <p>This would be a form to add a new provider category.</p>
        <div class="modal-actions">
          <button @click="showAddModal = false" class="btn-secondary">Cancel</button>
          <button @click="showAddModal = false" class="btn-primary">Add Category</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showAddModal = ref(false)

const categories = ref([
  {
    id: 1,
    name: 'Hospitals',
    description: 'Major medical facilities providing comprehensive healthcare services',
    icon: '🏥',
    activeProviders: 156,
    totalRegistered: 189,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Clinics',
    description: 'Outpatient medical facilities for primary healthcare services',
    icon: '🏪',
    activeProviders: 342,
    totalRegistered: 398,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Pharmacies',
    description: 'Licensed pharmaceutical dispensing facilities',
    icon: '💊',
    activeProviders: 567,
    totalRegistered: 623,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Diagnostic Centers',
    description: 'Medical imaging and laboratory testing facilities',
    icon: '🔬',
    activeProviders: 89,
    totalRegistered: 102,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Dental Clinics',
    description: 'Specialized dental and oral healthcare providers',
    icon: '🦷',
    activeProviders: 123,
    totalRegistered: 145,
    status: 'Active'
  },
  {
    id: 6,
    name: 'Mental Health Centers',
    description: 'Specialized mental health and wellness facilities',
    icon: '🧠',
    activeProviders: 34,
    totalRegistered: 42,
    status: 'Under Review'
  },
  {
    id: 7,
    name: 'Physiotherapy Centers',
    description: 'Physical rehabilitation and therapy services',
    icon: '🏃',
    activeProviders: 78,
    totalRegistered: 87,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Emergency Services',
    description: '24/7 emergency medical response providers',
    icon: '🚑',
    activeProviders: 23,
    totalRegistered: 28,
    status: 'Active'
  }
])

const editCategory = (category) => {
  console.log('Editing category:', category.name)
}

const deleteCategory = (categoryId) => {
  if (confirm('Are you sure you want to delete this category?')) {
    console.log('Deleting category:', categoryId)
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

.add-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category-icon {
  font-size: 2.5rem;
  padding: 0.75rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
}

.category-actions {
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

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.category-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.category-status {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #059669;
}

.status-badge.under.review {
  background: #fef3c7;
  color: #d97706;
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
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>