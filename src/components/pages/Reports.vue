<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="page-subtitle">Generate comprehensive reports and analytics</p>
      </div>
      <button class="generate-btn" @click="generateReport">📊 Generate New Report</button>
    </div>

    <div class="report-filters">
      <div class="filter-group">
        <label>Report Type:</label>
        <select v-model="selectedReportType">
          <option value="all">All Reports</option>
          <option value="provider-summary">Provider Summary</option>
          <option value="compliance">Compliance Report</option>
          <option value="financial">Financial Report</option>
          <option value="performance">Performance Report</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Date Range:</label>
        <select v-model="selectedDateRange">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>

    <div class="reports-grid">
      <div class="report-card" v-for="report in filteredReports" :key="report.id">
        <div class="report-header">
          <div class="report-type">{{ report.type }}</div>
          <div class="report-date">{{ report.generatedDate }}</div>
        </div>

        <h3 class="report-title">{{ report.title }}</h3>
        <p class="report-description">{{ report.description }}</p>

        <div class="report-stats">
          <div class="stat-item">
            <span class="stat-label">Records:</span>
            <span class="stat-value">{{ report.recordCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Pages:</span>
            <span class="stat-value">{{ report.pageCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Size:</span>
            <span class="stat-value">{{ report.fileSize }}</span>
          </div>
        </div>

        <div class="report-status">
          <span class="status-badge" :class="report.status.toLowerCase()">
            {{ report.status }}
          </span>
        </div>

        <div class="report-actions">
          <button class="action-btn primary" @click="downloadReport(report)">📥 Download</button>
          <button class="action-btn secondary" @click="viewReport(report)">👁️ Preview</button>
          <button class="action-btn tertiary" @click="shareReport(report)">📤 Share</button>
        </div>
      </div>
    </div>

    <div class="quick-stats">
      <h3>Quick Statistics</h3>
      <div class="stats-summary">
        <div class="summary-card">
          <div class="summary-icon">📈</div>
          <div class="summary-content">
            <div class="summary-value">1,247</div>
            <div class="summary-label">Total Reports Generated</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📊</div>
          <div class="summary-content">
            <div class="summary-value">89%</div>
            <div class="summary-label">Compliance Rate</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">⏱️</div>
          <div class="summary-content">
            <div class="summary-value">2.3s</div>
            <div class="summary-label">Avg Generation Time</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">💾</div>
          <div class="summary-content">
            <div class="summary-value">2.1GB</div>
            <div class="summary-label">Total Storage Used</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedReportType = ref('all')
const selectedDateRange = ref('month')

const reports = ref([
  {
    id: 1,
    title: 'Monthly Provider Summary',
    type: 'Provider Summary',
    description: 'Comprehensive overview of all registered providers and their activities',
    generatedDate: '2024-02-01',
    recordCount: 1245,
    pageCount: 45,
    fileSize: '12.3 MB',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'Q1 Compliance Report',
    type: 'Compliance',
    description: 'Quarterly compliance assessment for all healthcare providers',
    generatedDate: '2024-01-31',
    recordCount: 567,
    pageCount: 23,
    fileSize: '8.7 MB',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Financial Analysis Report',
    type: 'Financial',
    description: 'Revenue and cost analysis for insurance claims processing',
    generatedDate: '2024-01-30',
    recordCount: 2340,
    pageCount: 67,
    fileSize: '18.9 MB',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Provider Performance Metrics',
    type: 'Performance',
    description: 'Key performance indicators and benchmarks for all providers',
    generatedDate: '2024-01-29',
    recordCount: 890,
    pageCount: 34,
    fileSize: '15.2 MB',
    status: 'Processing'
  },
  {
    id: 5,
    title: 'Weekly Visit Summary',
    type: 'Provider Summary',
    description: 'Summary of all provider visits and inspections for the week',
    generatedDate: '2024-01-28',
    recordCount: 156,
    pageCount: 12,
    fileSize: '4.5 MB',
    status: 'Completed'
  },
  {
    id: 6,
    title: 'Regulatory Compliance Audit',
    type: 'Compliance',
    description: 'Detailed audit report for regulatory compliance requirements',
    generatedDate: '2024-01-27',
    recordCount: 423,
    pageCount: 28,
    fileSize: '9.8 MB',
    status: 'Failed'
  }
])

const filteredReports = computed(() => {
  let filtered = reports.value

  if (selectedReportType.value !== 'all') {
    filtered = filtered.filter(report => 
      report.type.toLowerCase().includes(selectedReportType.value.replace('-', ' '))
    )
  }

  return filtered
})

const generateReport = () => {
  console.log('Generating new report...')
}

const downloadReport = (report) => {
  console.log('Downloading report:', report.title)
}

const viewReport = (report) => {
  console.log('Viewing report:', report.title)
}

const shareReport = (report) => {
  console.log('Sharing report:', report.title)
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

.generate-btn {
  background: #059669;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generate-btn:hover {
  background: #047857;
}

.report-filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.report-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.report-type {
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.report-date {
  color: #64748b;
  font-size: 0.875rem;
}

.report-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.report-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.report-stats {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
}

.stat-value {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.875rem;
}

.report-status {
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.completed {
  background: #d1fae5;
  color: #059669;
}

.status-badge.processing {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.failed {
  background: #fee2e2;
  color: #dc2626;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
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

.action-btn.tertiary {
  background: #059669;
  color: white;
}

.action-btn.tertiary:hover {
  background: #047857;
}

.quick-stats {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.quick-stats h3 {
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.summary-icon {
  font-size: 2rem;
}

.summary-content {
  flex: 1;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.summary-label {
  color: #64748b;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .report-filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-summary {
    grid-template-columns: 1fr;
  }
}
</style>