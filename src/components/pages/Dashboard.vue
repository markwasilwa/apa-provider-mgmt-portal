<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Overview of system metrics and key performance indicators</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-title">{{ stat.title }}</p>
          <span class="stat-change" :class="stat.changeType">{{ stat.change }}</span>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <h3 class="chart-title">Provider Registration Trends</h3>
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

      <div class="chart-card">
        <h3 class="chart-title">Recent Activity</h3>
        <div class="activity-list">
          <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  {
    title: 'Total Providers',
    value: '1,245',
    icon: '🏥',
    change: '+12%',
    changeType: 'positive'
  },
  {
    title: 'Active Requests',
    value: '87',
    icon: '📋',
    change: '-5%',
    changeType: 'negative'
  },
  {
    title: 'Completed Visits',
    value: '456',
    icon: '✅',
    change: '+23%',
    changeType: 'positive'
  },
  {
    title: 'Pending Approvals',
    value: '23',
    icon: '⏳',
    change: '+8%',
    changeType: 'positive'
  }
])

const recentActivities = ref([
  {
    id: 1,
    icon: '🏥',
    text: 'New provider "Nairobi General Hospital" registered',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: '✅',
    text: 'Provider visit completed at Aga Khan Hospital',
    time: '4 hours ago'
  },
  {
    id: 3,
    icon: '📋',
    text: 'Provider request approved for Kenyatta Hospital',
    time: '6 hours ago'
  },
  {
    id: 4,
    icon: '📊',
    text: 'Monthly report generated successfully',
    time: '1 day ago'
  }
])
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-title {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

.stat-change.positive {
  color: #059669;
  background: #d1fae5;
}

.stat-change.negative {
  color: #dc2626;
  background: #fee2e2;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-bars {
  display: flex;
  align-items: end;
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
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 3px solid #3b82f6;
}

.activity-icon {
  font-size: 1.25rem;
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

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .page-container {
    padding: 1rem;
  }
}
</style>