<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">
            Providers Portal
          </h1>
          <p class="subtitle">Overview of system metrics and key performance indicators</p>
        </div>
        <div class="header-stats">
          <div v-if="loading" class="loading-stats">Loading...</div>
          <div v-else-if="error" class="error-stats">{{ error }}</div>
          <div v-else class="stat-item" v-for="(stat, index) in stats.slice(0, 4)" :key="index">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-section">
      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner">Loading dashboard data...</div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-section">
        <div class="error-message">{{ error }}</div>
        <button @click="loadDashboardStatistics" class="retry-button">Retry</button>
      </div>
      
      <!-- KPI Cards -->
      <div v-else class="kpi-section">
        <div class="kpi-card" v-for="stat in stats" :key="stat.title">
          <div class="kpi-header">
            <component :is="stat.icon" class="kpi-icon" />
            <h3 class="kpi-title">{{ stat.title }}</h3>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ stat.value }}</div>
            <div class="kpi-change" :class="stat.changeType">
              <ArrowUpIcon v-if="stat.changeType === 'positive'" class="change-icon" />
              <ArrowDownIcon v-if="stat.changeType === 'negative'" class="change-icon" />
              {{ stat.change }}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Provider Registration Trends -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">
              <ChartBarIcon class="card-icon" />
              Provider Registration Trends
            </h3>
          </div>
          <div class="card-content">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 85%"></div>
              </div>
              <div class="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">
              <ClockIcon class="card-icon" />
              Recent Activity
            </h3>
          </div>
          <div class="card-content">
            <div class="activity-list">
              <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                <div class="activity-icon">
                  <component :is="activity.icon" class="icon" />
                </div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.text }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  BuildingOffice2Icon, 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'
import { DashboardAPIService } from '@/services/api'

const stats = ref([])
const loading = ref(true)
const error = ref(null)

const loadDashboardStatistics = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await DashboardAPIService.getDashboardStatistics()
    
    // Handle direct response data (no wrapper structure)
    const data = response.data || response
    
    stats.value = [
      {
        title: 'Total Providers',
        value: data.totalProviders?.toLocaleString() || '0',
        icon: BuildingOffice2Icon,
        change: '+12%',
        changeType: 'positive'
      },
      {
        title: 'Total Requests',
        value: data.totalRequests?.toLocaleString() || '0',
        icon: ClipboardDocumentListIcon,
        change: '+5%',
        changeType: 'positive'
      },
      {
        title: 'Pending Requests',
        value: data.pendingRequests?.toLocaleString() || '0',
        icon: ClockIcon,
        change: data.pendingRequests > 20 ? '+8%' : '-2%',
        changeType: data.pendingRequests > 20 ? 'positive' : 'negative'
      },
      {
        title: 'Approved Requests',
        value: data.approvedRequests?.toLocaleString() || '0',
        icon: CheckCircleIcon,
        change: '+15%',
        changeType: 'positive'
      },
      {
        title: 'Declined Requests',
        value: data.declinedRequests?.toLocaleString() || '0',
        icon: XCircleIcon,
        change: data.declinedRequests > 5 ? '+3%' : '-1%',
        changeType: data.declinedRequests > 5 ? 'negative' : 'positive'
      }
    ]
  } catch (err) {
    error.value = 'Failed to load dashboard statistics'
    console.error('Error loading dashboard statistics:', err)
    
    // Fallback to default stats on error
    stats.value = [
      {
        title: 'Total Providers',
        value: '0',
        icon: BuildingOffice2Icon,
        change: '0%',
        changeType: 'neutral'
      },
      {
        title: 'Total Requests', 
        value: '0',
        icon: ClipboardDocumentListIcon,
        change: '0%',
        changeType: 'neutral'
      },
      {
        title: 'Pending Requests',
        value: '0',
        icon: ClockIcon,
        change: '0%',
        changeType: 'neutral'
      },
      {
        title: 'Approved Requests',
        value: '0',
        icon: CheckCircleIcon,
        change: '0%',
        changeType: 'neutral'
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardStatistics()
})

const recentActivities = ref([
  {
    id: 1,
    icon: BuildingOffice2Icon,
    text: 'New provider "Nairobi General Hospital" registered',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: CheckCircleIcon,
    text: 'Provider visit completed at Aga Khan Hospital',
    time: '4 hours ago'
  },
  {
    id: 3,
    icon: ClipboardDocumentListIcon,
    text: 'Provider request approved for Kenyatta Hospital',
    time: '6 hours ago'
  },
  {
    id: 4,
    icon: ChartBarIcon,
    text: 'Monthly report generated successfully',
    time: '1 day ago'
  }
])
</script>

<style scoped>
/* Dashboard Container */
.dashboard-container {
  width: 100%;
  background-color: #f8fafc;
  min-height: calc(100vh - 120px);
}

/* Header Section */
.header-section {
  background-color: #fff;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.title-group {
  flex: 1;
  min-width: 300px;
}

.main-title {
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.main-title .icon {
  width: 1.75rem;
  height: 1.75rem;
  margin-right: 0.75rem;
  color: #3b82f6;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  max-width: 600px;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  min-width: 100px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Content Section */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

/* KPI Section */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.kpi-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
  margin-right: 0.75rem;
}

.kpi-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

.kpi-content {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

.kpi-change {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.kpi-change.positive {
  color: #059669;
  background: #d1fae5;
}

.kpi-change.negative {
  color: #dc2626;
  background: #fee2e2;
}

.change-icon {
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.25rem;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.card-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #3b82f6;
}

.card-content {
  padding: 1.5rem;
}

/* Chart Placeholder */
.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 160px;
  gap: 0.5rem;
}

.bar {
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  width: 100%;
  border-radius: 0.25rem 0.25rem 0 0;
  transition: all 0.3s ease;
}

.bar:hover {
  background: linear-gradient(to top, #1d4ed8, #3b82f6);
  transform: scaleY(1.05);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.activity-item:hover {
  background: #f1f5f9;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.activity-icon .icon {
  width: 1rem;
  height: 1rem;
  color: #3b82f6;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #64748b;
}

/* Loading and Error States */
.loading-stats, .error-stats {
  color: #64748b;
  font-size: 0.875rem;
  padding: 1rem;
  text-align: center;
}

.error-stats {
  color: #dc2626;
}

.loading-section, .error-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  font-size: 1.125rem;
  color: #64748b;
}

.error-message {
  font-size: 1.125rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}

.kpi-change.neutral {
  color: #64748b;
  background: #f1f5f9;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-stats {
    width: 100%;
    justify-content: space-between;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .content-section {
    padding: 1rem;
  }

  .kpi-section {
    grid-template-columns: 1fr;
  }
}
</style>
