<template>
  <div class="upload-rates-page">
    <div class="page-header">
      <h1 class="page-title">Master Rates Management</h1>
      <p class="page-description">Upload Excel templates and manage master rates</p>
    </div>

    <!-- Compact Upload Section -->
    <div class="upload-section">
      <div class="upload-card">
        <div class="compact-upload" :class="{ 'drag-over': isDragOver }" 
             @drop="handleDrop" 
             @dragover.prevent="isDragOver = true" 
             @dragleave="isDragOver = false" 
             @dragenter.prevent>
          
          <div class="upload-content">
            <div class="upload-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="upload-svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
            </div>
            
            <div class="upload-info">
              <h3 class="upload-title">Upload Rate Template</h3>
              <p class="upload-text">Select Excel file (.xlsx, .xls) to upload</p>
            </div>

            <div class="upload-controls">
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileSelect" 
                accept=".xlsx,.xls,.csv"
                class="file-input"
                :disabled="isUploading"
              >
              
              <div v-if="selectedFile" class="selected-file">
                <div class="file-info">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="file-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="file-name">{{ selectedFile.name }}</span>
                  <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
                </div>
                <button @click="removeFile" class="remove-btn" :disabled="isUploading">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div class="upload-actions">
                <button 
                  @click="$refs.fileInput.click()" 
                  class="browse-btn"
                  :disabled="isUploading"
                  v-if="!selectedFile"
                >
                  Browse Files
                </button>
                
                <button 
                  @click="uploadFile" 
                  :disabled="!selectedFile || isUploading"
                  class="upload-btn"
                  v-if="selectedFile"
                >
                  <span v-if="isUploading" class="loading-spinner"></span>
                  {{ isUploading ? 'Uploading...' : 'Upload' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Status -->
        <div v-if="uploads.length > 0" class="upload-status">
          <div v-for="upload in uploads.slice(0, 1)" :key="upload.id" class="status-item" :class="upload.status">
            <svg v-if="upload.status === 'success'" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="status-icon success">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg v-else-if="upload.status === 'error'" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="status-icon error">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span v-else class="loading-spinner"></span>
            <span class="status-message">{{ upload.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Master Rates Table -->
    <div class="rates-section">
      <div class="rates-header">
        <h2 class="rates-title">Master Rates</h2>
        <div class="rates-controls">
          <div class="search-box">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="search-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search rates..." 
              v-model="searchQuery"
              @input="debouncedSearch"
              class="search-input"
            >
          </div>
          <button @click="refreshRates" class="refresh-btn" :disabled="loadingRates">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="refresh-icon" :class="{ 'spinning': loadingRates }">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div class="rates-table-container">
        <div v-if="loadingRates" class="loading-state">
          <div class="loading-spinner large"></div>
          <p>Loading master rates...</p>
        </div>

        <div v-else-if="rates.length === 0" class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="empty-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>No master rates found</p>
        </div>

        <table v-else class="rates-table">
          <thead>
            <tr>
              <th @click="sortBy('itemCode')" class="sortable">
                Item Code
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="sort-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </th>
              <th @click="sortBy('description')" class="sortable">
                Description
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="sort-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </th>
              <th @click="sortBy('price')" class="sortable">
                Price
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="sort-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rate in rates" :key="rate.id || rate.itemCode">
              <td class="item-code">{{ rate.itemCode }}</td>
              <td class="description">{{ rate.description }}</td>
              <td class="price">{{ formatCurrency(rate.price) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="pagination">
          <button 
            @click="changePage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 0"
            class="page-btn"
          >
            Previous
          </button>
          
          <span class="page-info">
            Page {{ pagination.currentPage + 1 }} of {{ pagination.totalPages }}
            ({{ pagination.totalElements }} total)
          </span>
          
          <button 
            @click="changePage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage >= pagination.totalPages - 1"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ProviderAPIService } from '@/services/api'

// Upload related state
const fileInput = ref(null)
const selectedFile = ref(null)
const isUploading = ref(false)
const isDragOver = ref(false)
const message = ref('')
const messageType = ref('success')
const uploads = reactive([])

// Master rates related state
const rates = ref([])
const loadingRates = ref(false)
const searchQuery = ref('')
const currentSort = ref({ field: 'itemCode', direction: 'asc' })
const pagination = ref({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 20
})

// Search debounce timer
let searchTimeout = null

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    validateAndSetFile(files[0])
  }
}

const validateAndSetFile = (file) => {
  // Check file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv' // .csv
  ]
  
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
    showMessage('Please select an Excel file (.xlsx, .xls) or CSV file', 'error')
    return
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showMessage('File size must be less than 10MB', 'error')
    return
  }

  selectedFile.value = file
  clearMessage()
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  const uploadId = Date.now()
  
  // Add upload to history
  uploads.unshift({
    id: uploadId,
    filename: selectedFile.value.name,
    status: 'uploading',
    message: 'Uploading file...',
    timestamp: new Date()
  })

  try {
    const result = await ProviderAPIService.uploadRateTemplate(selectedFile.value)
    
    // Update upload status
    const upload = uploads.find(u => u.id === uploadId)
    if (upload) {
      upload.status = 'success'
      upload.message = result.message || 'File uploaded successfully'
    }

    showMessage('Rate template uploaded and processed successfully!', 'success')
    
    // Clear selected file
    removeFile()
    
    // Refresh rates table after successful upload
    await fetchMasterRates()
    
  } catch (error) {
    console.error('Upload failed:', error)
    
    // Update upload status
    const upload = uploads.find(u => u.id === uploadId)
    if (upload) {
      upload.status = 'error'
      upload.message = error.response?.data?.message || error.message || 'Upload failed'
    }

    showMessage(error.response?.data?.message || 'Upload failed. Please try again.', 'error')
  } finally {
    isUploading.value = false
  }
}

// Master rates functions
const fetchMasterRates = async (params = {}) => {
  loadingRates.value = true
  try {
    const response = await ProviderAPIService.getMasterRates({
      page: pagination.value.currentPage,
      size: pagination.value.size,
      sortBy: currentSort.value.field,
      sortDir: currentSort.value.direction,
      search: searchQuery.value,
      ...params
    })
    
    rates.value = response.content || []
    if (response.page) {
      pagination.value = {
        currentPage: response.page.number || 0,
        totalPages: response.page.totalPages || 0,
        totalElements: response.page.totalElements || 0,
        size: response.page.size || 20
      }
    }
  } catch (error) {
    console.error('Failed to fetch master rates:', error)
    showMessage('Failed to load master rates. Please try again.', 'error')
    rates.value = []
  } finally {
    loadingRates.value = false
  }
}

const refreshRates = () => {
  fetchMasterRates()
}

const sortBy = (field) => {
  if (currentSort.value.field === field) {
    currentSort.value.direction = currentSort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort.value.field = field
    currentSort.value.direction = 'asc'
  }
  fetchMasterRates()
}

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < pagination.value.totalPages) {
    pagination.value.currentPage = newPage
    fetchMasterRates()
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.currentPage = 0 // Reset to first page on search
    fetchMasterRates()
  }, 500)
}

const formatCurrency = (amount) => {
  if (amount == null) return 'N/A'
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(amount)
}

// Initialize data on component mount
onMounted(() => {
  fetchMasterRates()
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const showMessage = (text, type) => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    clearMessage()
  }, 5000)
}

const clearMessage = () => {
  message.value = ''
  messageType.value = 'success'
}
</script>

<style scoped>
.upload-rates-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #64748b;
  font-size: 1rem;
}

/* Upload Section */
.upload-section {
  margin-bottom: 2rem;
}

.upload-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.compact-upload {
  border: 2px dashed #cbd5e1;
  border-radius: 6px;
  padding: 1rem;
  transition: all 0.2s;
  cursor: pointer;
}

.compact-upload:hover,
.compact-upload.drag-over {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.upload-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  flex-shrink: 0;
}

.upload-svg {
  width: 2rem;
  height: 2rem;
  color: #64748b;
}

.upload-info {
  flex: 1;
}

.upload-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.upload-text {
  font-size: 0.875rem;
  color: #64748b;
}

.upload-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.file-input {
  display: none;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f1f5f9;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-icon {
  width: 1rem;
  height: 1rem;
  color: #64748b;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.file-size {
  font-size: 0.75rem;
  color: #64748b;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.remove-btn:hover:not(:disabled) {
  background-color: #fef2f2;
}

.browse-btn, .upload-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.browse-btn {
  background-color: #3b82f6;
  color: white;
}

.browse-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.upload-btn {
  background-color: #10b981;
  color: white;
}

.upload-btn:hover:not(:disabled) {
  background-color: #059669;
}

.browse-btn:disabled, .upload-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.upload-status {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.status-icon.success {
  color: #10b981;
}

.status-icon.error {
  color: #ef4444;
}

.status-message {
  font-size: 0.875rem;
  color: #374151;
}

/* Master Rates Section */
.rates-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.rates-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;
}

.rates-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.rates-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  width: 1rem;
  height: 1rem;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

.rates-table-container {
  min-height: 400px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.large {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
  margin-bottom: 1rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.rates-table {
  width: 100%;
  border-collapse: collapse;
}

.rates-table th {
  background-color: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}

.rates-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.rates-table th.sortable:hover {
  background-color: #f1f5f9;
}

.sort-icon {
  width: 0.875rem;
  height: 0.875rem;
  margin-left: 0.5rem;
  opacity: 0.4;
}

.rates-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
}

.rates-table tbody tr:hover {
  background-color: #f8fafc;
}

.item-code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
  color: #1e293b;
}

.description {
  color: #374151;
}

.price {
  font-weight: 600;
  color: #059669;
  text-align: right;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.page-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #f9fafb;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.message.success {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.message.error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .upload-rates-page {
    padding: 1rem;
  }

  .upload-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .upload-controls {
    width: 100%;
    justify-content: flex-start;
  }

  .rates-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rates-controls {
    width: 100%;
    justify-content: flex-start;
  }

  .search-input {
    width: 200px;
  }

  .rates-table {
    font-size: 0.75rem;
  }

  .rates-table th,
  .rates-table td {
    padding: 0.5rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>