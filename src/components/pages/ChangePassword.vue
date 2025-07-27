<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Account Settings</h1>
      <p class="page-subtitle">Update your account password and manage system settings</p>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'password' }" 
          @click="activeTab = 'password'"
        >
          Change Password
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'documents' }" 
          @click="activeTab = 'documents'"
        >
          Document Requirements
        </button>
      </div>
    </div>

    <div class="password-form-container" v-if="activeTab === 'password'">
      <form @submit.prevent="changePassword" class="password-form">
        <div class="form-section">
          <h3 class="section-title">Current Password</h3>
          <div class="form-group">
            <label for="current-password">Enter Current Password</label>
            <div class="password-input-group">
              <input 
                :type="showCurrentPassword ? 'text' : 'password'"
                id="current-password"
                v-model="currentPassword"
                placeholder="Enter your current password"
                required
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                {{ showCurrentPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">New Password</h3>
          <div class="form-group">
            <label for="new-password">Enter New Password</label>
            <div class="password-input-group">
              <input 
                :type="showNewPassword ? 'text' : 'password'"
                id="new-password"
                v-model="newPassword"
                placeholder="Enter your new password"
                required
                @input="validatePassword"
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showNewPassword = !showNewPassword"
              >
                {{ showNewPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm New Password</label>
            <div class="password-input-group">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password"
                v-model="confirmPassword"
                placeholder="Confirm your new password"
                required
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="confirmPassword && newPassword !== confirmPassword" class="error-message">
              Passwords do not match
            </div>
          </div>
        </div>

        <div class="password-requirements">
          <h4>Password Requirements:</h4>
          <ul class="requirements-list">
            <li :class="{ valid: hasMinLength }">
              <span class="requirement-icon">{{ hasMinLength ? '✅' : '❌' }}</span>
              At least 8 characters long
            </li>
            <li :class="{ valid: hasUppercase }">
              <span class="requirement-icon">{{ hasUppercase ? '✅' : '❌' }}</span>
              At least one uppercase letter
            </li>
            <li :class="{ valid: hasLowercase }">
              <span class="requirement-icon">{{ hasLowercase ? '✅' : '❌' }}</span>
              At least one lowercase letter
            </li>
            <li :class="{ valid: hasNumber }">
              <span class="requirement-icon">{{ hasNumber ? '✅' : '❌' }}</span>
              At least one number
            </li>
            <li :class="{ valid: hasSpecialChar }">
              <span class="requirement-icon">{{ hasSpecialChar ? '✅' : '❌' }}</span>
              At least one special character (!@#$%^&*)
            </li>
          </ul>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="resetForm">Cancel</button>
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="!canSubmit"
          >
            Change Password
          </button>
        </div>
      </form>

      <div class="security-tips">
        <h3>Security Tips</h3>
        <div class="tips-list">
          <div class="tip-item">
            <span class="tip-icon">🔒</span>
            <div class="tip-content">
              <strong>Use a unique password</strong>
              <p>Don't reuse passwords from other accounts</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🔄</span>
            <div class="tip-content">
              <strong>Change regularly</strong>
              <p>Update your password every 3-6 months</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">📱</span>
            <div class="tip-content">
              <strong>Enable 2FA</strong>
              <p>Add an extra layer of security to your account</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🚫</span>
            <div class="tip-content">
              <strong>Avoid personal info</strong>
              <p>Don't use names, birthdays, or common words</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Requirements Management UI -->
    <div class="document-settings-container" v-if="activeTab === 'documents'">
      <div class="document-settings">
        <div class="settings-header">
          <h3 class="settings-title">Provider Document Requirements</h3>
          <p class="settings-description">
            Manage document requirements for each provider category. These documents will be requested during provider registration.
          </p>
        </div>

        <div class="category-selector">
          <label for="category-select">Select Provider Category:</label>
          <div class="select-wrapper">
            <select id="category-select" v-model="selectedCategory" class="modern-select">
              <option v-for="category in Object.keys(categoryDocuments)" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <button class="btn-secondary" @click="addNewCategory">
            Add New Category
          </button>
        </div>

        <div v-if="selectedCategory" class="document-list-container">
          <h4 class="document-list-title">Documents for {{ selectedCategory }}</h4>

          <div class="document-list">
            <div v-for="doc in categoryDocuments[selectedCategory]" :key="doc.id" class="document-item">
              <div class="document-details">
                <span class="document-name">{{ doc.name }}</span>
                <span class="document-required" :class="{ 'required': doc.required }">
                  {{ doc.required ? 'Required' : 'Optional' }}
                </span>
              </div>
              <div class="document-actions">
                <button class="action-btn edit" @click="editDocument(doc)">Edit</button>
                <button class="action-btn delete" @click="deleteDocument(doc.id)">Delete</button>
              </div>
            </div>

            <div v-if="categoryDocuments[selectedCategory].length === 0" class="no-documents">
              No documents defined for this category. Add a document below.
            </div>
          </div>

          <div class="add-document-form">
            <h4 class="form-subtitle">{{ editingDocument ? 'Edit Document' : 'Add New Document' }}</h4>

            <div class="form-row">
              <div class="form-group">
                <label for="document-name">Document Name</label>
                <input 
                  type="text" 
                  id="document-name" 
                  v-model="documentForm.name" 
                  class="modern-input"
                  placeholder="Enter document name"
                  required
                >
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="documentForm.required"
                  >
                  Required Document
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="cancelDocumentEdit">
                Cancel
              </button>
              <button 
                type="button" 
                class="btn-primary" 
                @click="saveDocument"
                :disabled="!documentForm.name"
              >
                {{ editingDocument ? 'Update Document' : 'Add Document' }}
              </button>
            </div>
          </div>
        </div>

        <div class="settings-actions">
          <button class="btn-danger" @click="resetToDefaults">
            Reset to Defaults
          </button>
        </div>
      </div>

      <div class="settings-info">
        <h3>About Document Requirements</h3>
        <div class="info-content">
          <p>Document requirements are used to specify which documents providers need to upload during registration.</p>
          <ul class="info-list">
            <li>
              <strong>Required Documents</strong>
              <p>These documents must be uploaded to complete registration.</p>
            </li>
            <li>
              <strong>Optional Documents</strong>
              <p>These documents are not mandatory but may be helpful for verification.</p>
            </li>
            <li>
              <strong>Categories</strong>
              <p>Each provider category can have its own set of required documents.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SettingsService } from '@/services/settings'

// Tab management
const activeTab = ref('password')

// Password change state
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Document management state
const categoryDocuments = ref({})
const selectedCategory = ref('')
const documentForm = ref({
  name: '',
  required: false
})
const editingDocument = ref(null)

const hasMinLength = computed(() => newPassword.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value))
const hasLowercase = computed(() => /[a-z]/.test(newPassword.value))
const hasNumber = computed(() => /\d/.test(newPassword.value))
const hasSpecialChar = computed(() => /[!@#$%^&*]/.test(newPassword.value))

const passwordStrength = computed(() => {
  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]
    .filter(Boolean).length

  if (score === 0) return { text: '', width: '0%', class: '' }
  if (score <= 2) return { text: 'Weak', width: '25%', class: 'weak' }
  if (score <= 3) return { text: 'Fair', width: '50%', class: 'fair' }
  if (score <= 4) return { text: 'Good', width: '75%', class: 'good' }
  return { text: 'Strong', width: '100%', class: 'strong' }
})

const canSubmit = computed(() => {
  return currentPassword.value && 
         newPassword.value && 
         confirmPassword.value &&
         newPassword.value === confirmPassword.value &&
         hasMinLength.value &&
         hasUppercase.value &&
         hasLowercase.value &&
         hasNumber.value &&
         hasSpecialChar.value
})

const validatePassword = () => {
  // Password validation is handled by computed properties
}

const changePassword = () => {
  if (canSubmit.value) {
    // Simulate password change
    alert('Password changed successfully!')
    resetForm()
  }
}

const resetForm = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

// Document management methods
onMounted(async () => {
  await loadCategoryDocuments()
})

const loadCategoryDocuments = async () => {
  // Get current document mappings
  categoryDocuments.value = SettingsService.getCategoryDocuments()

  // If there are no mappings or we want to ensure we have the latest categories,
  // we can explicitly initialize from the API
  try {
    // This will initialize from API if needed and update localStorage
    await SettingsService.initializeFromAPI()

    // Get the updated mappings
    categoryDocuments.value = SettingsService.getCategoryDocuments()
  } catch (error) {
    console.error('Failed to initialize category documents from API:', error)
    // Continue with whatever mappings we have
  }

  if (Object.keys(categoryDocuments.value).length > 0) {
    selectedCategory.value = Object.keys(categoryDocuments.value)[0]
  }
}

const addNewCategory = async () => {
  const categoryName = prompt('Enter new category name:')
  if (categoryName && categoryName.trim()) {
    const trimmedName = categoryName.trim()
    try {
      if (!categoryDocuments.value[trimmedName]) {
        categoryDocuments.value[trimmedName] = []
        SettingsService.setCategoryDocuments(categoryDocuments.value)
        selectedCategory.value = trimmedName
      } else {
        alert('Category already exists')
      }
    } catch (error) {
      console.error('Failed to add new category:', error)
      alert('Failed to add new category. Please try again.')
    }
  }
}

const editDocument = (doc) => {
  editingDocument.value = doc
  documentForm.value = {
    name: doc.name,
    required: doc.required
  }
}

const cancelDocumentEdit = () => {
  editingDocument.value = null
  documentForm.value = {
    name: '',
    required: false
  }
}

const saveDocument = async () => {
  if (!documentForm.value.name.trim()) {
    alert('Document name is required')
    return
  }

  try {
    if (editingDocument.value) {
      // Update existing document
      SettingsService.updateDocumentInCategory(
        selectedCategory.value,
        editingDocument.value.id,
        {
          name: documentForm.value.name.trim(),
          required: documentForm.value.required
        }
      )
    } else {
      // Add new document
      SettingsService.addDocumentToCategory(
        selectedCategory.value,
        {
          name: documentForm.value.name.trim(),
          required: documentForm.value.required
        }
      )
    }

    // Refresh the data
    await loadCategoryDocuments()
    cancelDocumentEdit()
  } catch (error) {
    console.error('Failed to save document:', error)
    alert('Failed to save document. Please try again.')
  }
}

const deleteDocument = async (documentId) => {
  if (confirm('Are you sure you want to delete this document requirement?')) {
    try {
      SettingsService.removeDocumentFromCategory(selectedCategory.value, documentId)
      await loadCategoryDocuments()
    } catch (error) {
      console.error('Failed to delete document:', error)
      alert('Failed to delete document. Please try again.')
    }
  }
}

const resetToDefaults = async () => {
  if (confirm('Are you sure you want to reset all document requirements to defaults? This cannot be undone.')) {
    try {
      await SettingsService.resetToDefaults()
      await loadCategoryDocuments()
    } catch (error) {
      console.error('Failed to reset document requirements:', error)
      alert('Failed to reset document requirements. Please try again.')
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 1rem;
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

.password-form-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: start;
}

.password-form {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-group input {
  flex: 1;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.password-input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  z-index: 1;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: #f59e0b; }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #10b981; }

.strength-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-requirements {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.password-requirements h4 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.requirements-list li.valid {
  color: #059669;
}

.requirement-icon {
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.security-tips {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.security-tips h3 {
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tip-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.tip-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.tip-content strong {
  display: block;
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.tip-content p {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.4;
}

/* Tabs Styles */
.tabs-container {
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-button:hover {
  color: #1e293b;
}

.tab-button.active {
  color: #3b82f6;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3b82f6;
}

/* Document Settings Styles */
.document-settings-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: start;
}

.document-settings {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.settings-header {
  margin-bottom: 1.5rem;
}

.settings-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.settings-description {
  color: #64748b;
  font-size: 0.875rem;
}

.category-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.category-selector label {
  font-weight: 500;
  color: #374151;
}

.select-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.modern-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.document-list-container {
  margin-bottom: 1.5rem;
}

.document-list-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  border-left: 3px solid #cbd5e1;
}

.document-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.document-name {
  font-weight: 500;
  color: #334155;
}

.document-required {
  font-size: 0.75rem;
  color: #64748b;
}

.document-required.required {
  color: #ef4444;
  font-weight: 500;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.action-btn.edit {
  background: #3b82f6;
  color: white;
}

.action-btn.delete {
  background: #ef4444;
  color: white;
}

.no-documents {
  padding: 1rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.add-document-form {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.form-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.settings-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background: #dc2626;
}

.settings-info {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.settings-info h3 {
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.info-content p {
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.info-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-list li strong {
  display: block;
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.info-list li p {
  margin: 0;
  font-size: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .password-form-container,
  .document-settings-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .password-form,
  .security-tips,
  .document-settings,
  .settings-info {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .category-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .select-wrapper {
    width: 100%;
  }
}
</style>
