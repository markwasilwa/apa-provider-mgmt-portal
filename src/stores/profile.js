import { defineStore } from 'pinia'
import ProfileService from '@/services/profile'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    currentProfile: null,
    profiles: [],
    profileStats: null,
    loading: false,
    searchResults: [],
    searchLoading: false,
    pagination: {
      totalElements: 0,
      totalPages: 0,
      size: 20,
      number: 0
    }
  }),

  getters: {
    hasProfile: (state) => !!state.currentProfile,
    isProfileComplete: (state) => {
      if (!state.currentProfile) return false
      
      // Basic required fields for all profiles
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber']
      const hasBasicFields = requiredFields.every(field => 
        state.currentProfile[field] && state.currentProfile[field].trim() !== ''
      )
      
      if (!hasBasicFields) return false
      
      // Role-specific requirements
      const role = state.currentProfile.role
      if (role === 'ROLE_PROVIDER') {
        const providerFields = ['specialization', 'hospital', 'licenseNumber']
        return providerFields.every(field => 
          state.currentProfile[field] && state.currentProfile[field].trim() !== ''
        )
      } else if (role === 'ROLE_BACK_OFFICE') {
        const backOfficeFields = ['department', 'position']
        return backOfficeFields.every(field => 
          state.currentProfile[field] && state.currentProfile[field].trim() !== ''
        )
      } else if (role === 'ROLE_ADMIN') {
        const adminFields = ['adminLevel', 'permissions']
        return adminFields.every(field => 
          state.currentProfile[field] && 
          (typeof state.currentProfile[field] === 'string' ? state.currentProfile[field].trim() !== '' : true)
        )
      }
      
      return true
    },
    profileCompletionPercentage: (state) => {
      if (!state.currentProfile) return 0
      
      const role = state.currentProfile.role
      let totalFields = 0
      let completedFields = 0
      
      // Basic fields (required for all roles)
      const basicFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'city', 'country']
      basicFields.forEach(field => {
        totalFields++
        if (state.currentProfile[field] && state.currentProfile[field].trim() !== '') {
          completedFields++
        }
      })
      
      // Role-specific fields
      if (role === 'ROLE_PROVIDER') {
        const providerFields = ['specialization', 'hospital', 'licenseNumber', 'yearsOfExperience', 'consultationFee']
        providerFields.forEach(field => {
          totalFields++
          if (state.currentProfile[field] && 
              (typeof state.currentProfile[field] === 'string' ? state.currentProfile[field].trim() !== '' : state.currentProfile[field] > 0)) {
            completedFields++
          }
        })
      } else if (role === 'ROLE_BACK_OFFICE') {
        const backOfficeFields = ['department', 'position', 'managerId']
        backOfficeFields.forEach(field => {
          totalFields++
          if (state.currentProfile[field] && state.currentProfile[field].trim() !== '') {
            completedFields++
          }
        })
      } else if (role === 'ROLE_ADMIN') {
        const adminFields = ['adminLevel', 'permissions']
        adminFields.forEach(field => {
          totalFields++
          if (state.currentProfile[field]) {
            completedFields++
          }
        })
      }
      
      return Math.round((completedFields / totalFields) * 100)
    }
  },

  actions: {
    async createProfile(profileData) {
      this.loading = true
      try {
        const profile = await ProfileService.createProfile(profileData)
        this.currentProfile = profile
        return profile
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      try {
        const profile = await ProfileService.updateProfile(profileData)
        this.currentProfile = profile
        return profile
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getCurrentProfile() {
      this.loading = true
      try {
        const profile = await ProfileService.getCurrentProfile()
        this.currentProfile = profile
        return profile
      } catch (error) {
        this.currentProfile = null
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProfile() {
      this.loading = true
      try {
        await ProfileService.deleteProfile()
        this.currentProfile = null
        return true
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProfileById(profileId) {
      this.loading = true
      try {
        return await ProfileService.getProfileById(profileId)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProfileByUserId(userId) {
      this.loading = true
      try {
        return await ProfileService.getProfileByUserId(userId)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProfileByEmail(email) {
      this.loading = true
      try {
        return await ProfileService.getProfileByEmail(email)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProfilesByRole(role, params = {}) {
      this.loading = true
      try {
        const response = await ProfileService.getProfilesByRole(role, params)
        this.profiles = response.content || response
        
        // Update pagination if response includes pagination info
        if (response.totalElements !== undefined) {
          this.pagination = {
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            size: response.size,
            number: response.number
          }
        }
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchProfiles(searchTerm, role = null, params = {}) {
      this.searchLoading = true
      try {
        const response = await ProfileService.searchProfiles(searchTerm, role, params)
        this.searchResults = response.content || response
        
        // Update pagination for search results
        if (response.totalElements !== undefined) {
          this.pagination = {
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            size: response.size,
            number: response.number
          }
        }
        
        return response
      } catch (error) {
        throw error
      } finally {
        this.searchLoading = false
      }
    },

    clearSearchResults() {
      this.searchResults = []
      this.searchLoading = false
    },

    // Provider-specific actions
    async getProvidersBySpecialization(specialization) {
      this.loading = true
      try {
        const providers = await ProfileService.getProvidersBySpecialization(specialization)
        return providers
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProvidersByHospital(hospital) {
      this.loading = true
      try {
        const providers = await ProfileService.getProvidersByHospital(hospital)
        return providers
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Back Office actions
    async getBackOfficeByDepartment(department) {
      this.loading = true
      try {
        const staff = await ProfileService.getBackOfficeByDepartment(department)
        return staff
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Admin actions
    async getAdminsByLevel(adminLevel) {
      this.loading = true
      try {
        const admins = await ProfileService.getAdminsByLevel(adminLevel)
        return admins
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Statistics actions
    async getProfileStatsByRole(role) {
      this.loading = true
      try {
        const stats = await ProfileService.getProfileStatsByRole(role)
        this.profileStats = stats
        return stats
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getAllProfileStats() {
      this.loading = true
      try {
        const stats = await ProfileService.getAllProfileStats()
        this.profileStats = stats
        return stats
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Utility actions
    clearProfiles() {
      this.profiles = []
      this.currentProfile = null
      this.searchResults = []
      this.profileStats = null
    },

    updatePagination(paginationData) {
      this.pagination = { ...this.pagination, ...paginationData }
    }
  }
})