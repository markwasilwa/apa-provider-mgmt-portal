<template>
  <form @submit.prevent="handleSubmit" class="profile-form">
    <div class="form-sections">
      <!-- Basic Information -->
      <div class="form-section">
        <h4 class="section-title">Basic Information</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name *</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              class="form-input"
              :class="{ 'error': errors.firstName }"
              required
            >
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Last Name *</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              class="form-input"
              :class="{ 'error': errors.lastName }"
              required
            >
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :class="{ 'error': errors.email }"
              required
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="phoneNumber" class="form-label">Phone Number *</label>
            <input
              id="phoneNumber"
              v-model="formData.phoneNumber"
              type="tel"
              class="form-input"
              :class="{ 'error': errors.phoneNumber }"
              required
            >
            <span v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</span>
          </div>

          <div class="form-group">
            <label for="dateOfBirth" class="form-label">Date of Birth</label>
            <input
              id="dateOfBirth"
              v-model="formData.dateOfBirth"
              type="date"
              class="form-input"
              :class="{ 'error': errors.dateOfBirth }"
            >
            <span v-if="errors.dateOfBirth" class="error-message">{{ errors.dateOfBirth }}</span>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="form-section">
        <h4 class="section-title">Address Information</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="address" class="form-label">Address</label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              class="form-input"
              :class="{ 'error': errors.address }"
            >
            <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
          </div>

          <div class="form-group">
            <label for="city" class="form-label">City</label>
            <input
              id="city"
              v-model="formData.city"
              type="text"
              class="form-input"
              :class="{ 'error': errors.city }"
            >
            <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
          </div>

          <div class="form-group">
            <label for="country" class="form-label">Country</label>
            <input
              id="country"
              v-model="formData.country"
              type="text"
              class="form-input"
              :class="{ 'error': errors.country }"
            >
            <span v-if="errors.country" class="error-message">{{ errors.country }}</span>
          </div>

          <div class="form-group">
            <label for="postalCode" class="form-label">Postal Code</label>
            <input
              id="postalCode"
              v-model="formData.postalCode"
              type="text"
              class="form-input"
              :class="{ 'error': errors.postalCode }"
            >
            <span v-if="errors.postalCode" class="error-message">{{ errors.postalCode }}</span>
          </div>
        </div>
      </div>

      <!-- Provider-specific Information -->
      <div v-if="userRole === 'ROLE_PROVIDER'" class="form-section">
        <h4 class="section-title">Provider Information</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="specialization" class="form-label">Specialization *</label>
            <select
              id="specialization"
              v-model="formData.specialization"
              class="form-input"
              :class="{ 'error': errors.specialization }"
              required
            >
              <option value="">Select specialization</option>
              <option value="General Practice">General Practice</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Surgery">Surgery</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Neurology">Neurology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Radiology">Radiology</option>
              <option value="Anesthesiology">Anesthesiology</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="ENT">ENT</option>
              <option value="Other">Other</option>
            </select>
            <span v-if="errors.specialization" class="error-message">{{ errors.specialization }}</span>
          </div>

          <div class="form-group">
            <label for="hospital" class="form-label">Hospital *</label>
            <input
              id="hospital"
              v-model="formData.hospital"
              type="text"
              class="form-input"
              :class="{ 'error': errors.hospital }"
              required
            >
            <span v-if="errors.hospital" class="error-message">{{ errors.hospital }}</span>
          </div>

          <div class="form-group">
            <label for="licenseNumber" class="form-label">License Number *</label>
            <input
              id="licenseNumber"
              v-model="formData.licenseNumber"
              type="text"
              class="form-input"
              :class="{ 'error': errors.licenseNumber }"
              required
            >
            <span v-if="errors.licenseNumber" class="error-message">{{ errors.licenseNumber }}</span>
          </div>

          <div class="form-group">
            <label for="yearsOfExperience" class="form-label">Years of Experience</label>
            <input
              id="yearsOfExperience"
              v-model.number="formData.yearsOfExperience"
              type="number"
              min="0"
              max="50"
              class="form-input"
              :class="{ 'error': errors.yearsOfExperience }"
            >
            <span v-if="errors.yearsOfExperience" class="error-message">{{ errors.yearsOfExperience }}</span>
          </div>

          <div class="form-group">
            <label for="consultationFee" class="form-label">Consultation Fee</label>
            <input
              id="consultationFee"
              v-model.number="formData.consultationFee"
              type="number"
              min="0"
              step="0.01"
              class="form-input"
              :class="{ 'error': errors.consultationFee }"
            >
            <span v-if="errors.consultationFee" class="error-message">{{ errors.consultationFee }}</span>
          </div>

          <div class="form-group">
            <label for="availableHours" class="form-label">Available Hours</label>
            <input
              id="availableHours"
              v-model="formData.availableHours"
              type="text"
              placeholder="e.g., Mon-Fri 9AM-5PM"
              class="form-input"
              :class="{ 'error': errors.availableHours }"
            >
            <span v-if="errors.availableHours" class="error-message">{{ errors.availableHours }}</span>
          </div>
        </div>
      </div>

      <!-- Back Office-specific Information -->
      <div v-if="userRole === 'ROLE_BACK_OFFICE'" class="form-section">
        <h4 class="section-title">Back Office Information</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="department" class="form-label">Department *</label>
            <select
              id="department"
              v-model="formData.department"
              class="form-input"
              :class="{ 'error': errors.department }"
              required
            >
              <option value="">Select department</option>
              <option value="Claims">Claims</option>
              <option value="Underwriting">Underwriting</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Legal">Legal</option>
              <option value="Compliance">Compliance</option>
            </select>
            <span v-if="errors.department" class="error-message">{{ errors.department }}</span>
          </div>

          <div class="form-group">
            <label for="position" class="form-label">Position *</label>
            <input
              id="position"
              v-model="formData.position"
              type="text"
              class="form-input"
              :class="{ 'error': errors.position }"
              required
            >
            <span v-if="errors.position" class="error-message">{{ errors.position }}</span>
          </div>

          <div class="form-group">
            <label for="managerId" class="form-label">Manager ID</label>
            <input
              id="managerId"
              v-model="formData.managerId"
              type="text"
              class="form-input"
              :class="{ 'error': errors.managerId }"
            >
            <span v-if="errors.managerId" class="error-message">{{ errors.managerId }}</span>
          </div>
        </div>
      </div>

      <!-- Admin-specific Information -->
      <div v-if="userRole === 'ROLE_ADMIN'" class="form-section">
        <h4 class="section-title">Admin Information</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="adminLevel" class="form-label">Admin Level *</label>
            <select
              id="adminLevel"
              v-model="formData.adminLevel"
              class="form-input"
              :class="{ 'error': errors.adminLevel }"
              required
            >
              <option value="">Select admin level</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
              <option value="USER_ADMIN">User Admin</option>
              <option value="CONTENT_ADMIN">Content Admin</option>
            </select>
            <span v-if="errors.adminLevel" class="error-message">{{ errors.adminLevel }}</span>
          </div>

          <div class="form-group permissions-group">
            <label class="form-label">Permissions</label>
            <div class="permissions-container">
              <label 
                v-for="permission in availablePermissions"
                :key="permission"
                class="permission-checkbox"
              >
                <input
                  type="checkbox"
                  :value="permission"
                  v-model="formData.permissions"
                  class="checkbox-input"
                >
                <span class="checkbox-label">{{ permission }}</span>
              </label>
            </div>
            <span v-if="errors.permissions" class="error-message">{{ errors.permissions }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="btn btn-outline">
        Cancel
      </button>
      <button type="submit" :disabled="loading" class="btn btn-primary">
        <span v-if="loading" class="loading-spinner"></span>
        {{ profile ? 'Update Profile' : 'Create Profile' }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="submitError" class="submit-error">
      {{ submitError }}
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

const props = defineProps({
  profile: {
    type: Object,
    default: null
  },
  userRole: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const loading = ref(false)
const submitError = ref('')
const errors = reactive({})

const availablePermissions = [
  'USER_MANAGEMENT',
  'PROVIDER_MANAGEMENT',
  'SYSTEM_CONFIGURATION',
  'REPORT_ACCESS',
  'AUDIT_LOGS',
  'BILLING_MANAGEMENT',
  'ANALYTICS_ACCESS'
]

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  // Provider fields
  specialization: '',
  hospital: '',
  licenseNumber: '',
  yearsOfExperience: null,
  consultationFee: null,
  availableHours: '',
  // Back Office fields
  department: '',
  position: '',
  managerId: '',
  // Admin fields
  adminLevel: '',
  permissions: []
})

const initializeForm = () => {
  if (props.profile) {
    Object.keys(formData).forEach(key => {
      if (props.profile[key] !== undefined) {
        formData[key] = props.profile[key]
      }
    })
    
    // Handle date formatting
    if (props.profile.dateOfBirth) {
      const date = new Date(props.profile.dateOfBirth)
      formData.dateOfBirth = date.toISOString().split('T')[0]
    }
  }
}

const validateForm = () => {
  const newErrors = {}

  // Basic validation
  if (!formData.firstName.trim()) {
    newErrors.firstName = 'First name is required'
  }
  
  if (!formData.lastName.trim()) {
    newErrors.lastName = 'Last name is required'
  }
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email format is invalid'
  }
  
  if (!formData.phoneNumber.trim()) {
    newErrors.phoneNumber = 'Phone number is required'
  }

  // Role-specific validation
  if (props.userRole === 'ROLE_PROVIDER') {
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required'
    }
    if (!formData.hospital.trim()) {
      newErrors.hospital = 'Hospital is required'
    }
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required'
    }
  } else if (props.userRole === 'ROLE_BACK_OFFICE') {
    if (!formData.department) {
      newErrors.department = 'Department is required'
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required'
    }
  } else if (props.userRole === 'ROLE_ADMIN') {
    if (!formData.adminLevel) {
      newErrors.adminLevel = 'Admin level is required'
    }
  }

  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, newErrors)
  
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  submitError.value = ''

  try {
    const profileData = { ...formData }
    
    // Clean up empty values
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === '' || profileData[key] === null || profileData[key] === undefined) {
        delete profileData[key]
      }
    })

    await emit('submit', profileData)
  } catch (error) {
    submitError.value = error.message || 'Failed to save profile'
  } finally {
    loading.value = false
  }
}

watch(() => props.profile, initializeForm, { immediate: true, deep: true })

onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
.profile-form {
  padding: 1.5rem;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 2rem;
}

.form-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.permissions-group {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-input.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.permissions-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #f9fafb;
}

.permission-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #1e40af;
}

.checkbox-label {
  color: #374151;
  user-select: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
  min-width: 120px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1e40af;
  color: white;
  border-color: #1e40af;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-outline {
  background-color: transparent;
  color: #64748b;
  border-color: #d1d5db;
}

.btn-outline:hover {
  background-color: #f8fafc;
  color: #1e40af;
  border-color: #1e40af;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.submit-error {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .permissions-container {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>