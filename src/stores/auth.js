import { defineStore } from 'pinia'
import AuthService from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    initializing: true
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ROLE_ADMIN',
    isProvider: (state) => state.user?.role === 'ROLE_PROVIDER',
    isBackOffice: (state) => state.user?.role === 'ROLE_BACK_OFFICE',
    isEmailVerified: (state) => state.user?.emailVerified === true,
    isActive: (state) => state.user?.isActive === true,
    userInitials: (state) => {
      if (!state.user) return ''
      const first = state.user.firstName?.charAt(0) || ''
      const last = state.user.lastName?.charAt(0) || ''
      return (first + last).toUpperCase()
    },
    userDisplayName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    },
    userApiKey: (state) => state.user?.apiKey
  },

  actions: {
    async login(email, password) {
      this.loading = true
      try {
        const data = await AuthService.login(email, password)
        this.user = data.user
        this.isAuthenticated = true
        return data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithApiKey(apiKey) {
      this.loading = true
      try {
        const user = await AuthService.loginWithApiKey(apiKey)
        this.user = user
        this.isAuthenticated = true
        return user
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const data = await AuthService.register(userData)
        this.user = data.user
        this.isAuthenticated = true
        return data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email) {
      this.loading = true
      try {
        return await AuthService.forgotPassword(email)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(token, newPassword) {
      this.loading = true
      try {
        return await AuthService.resetPassword(token, newPassword)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async changePassword(currentPassword, newPassword) {
      this.loading = true
      try {
        return await AuthService.changePassword(currentPassword, newPassword)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProfile() {
      this.loading = true
      try {
        const user = await AuthService.getProfile()
        this.user = user
        return user
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      try {
        const user = await AuthService.updateProfile(profileData)
        this.user = user
        return user
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyEmail(token) {
      try {
        const result = await AuthService.verifyEmail(token)
        // Refresh user data to get updated emailVerified status
        await this.getProfile()
        return result
      } catch (error) {
        throw error
      }
    },

    async regenerateApiKey() {
      this.loading = true
      try {
        const user = await AuthService.regenerateApiKey()
        this.user = user
        return user
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Admin-only actions
    async getAllUsers() {
      try {
        return await AuthService.getAllUsers()
      } catch (error) {
        throw error
      }
    },

    async getUserById(id) {
      try {
        return await AuthService.getUserById(id)
      } catch (error) {
        throw error
      }
    },

    async deleteUser(id) {
      try {
        return await AuthService.deleteUser(id)
      } catch (error) {
        throw error
      }
    },

    async registerUser(userData) {
      try {
        return await AuthService.registerUser(userData)
      } catch (error) {
        throw error
      }
    },

    logout() {
      AuthService.logout()
      this.user = null
      this.isAuthenticated = false
    },

    async initialize() {
      this.initializing = true
      
      try {
        // Get stored user and auth state
        const storedUser = AuthService.getCurrentUser()
        const hasAuthToken = AuthService.isAuthenticated()
        
        if (hasAuthToken && storedUser) {
          // Set initial state from localStorage
          this.user = storedUser
          this.isAuthenticated = true
          
          try {
            // Try to refresh user data to ensure it's current
            const refreshedUser = await AuthService.getProfile()
            this.user = refreshedUser
          } catch (error) {
            // If profile fetch fails, token might be invalid/expired
            console.warn('Failed to refresh user profile, logging out:', error)
            this.logout()
          }
        } else if (hasAuthToken && !storedUser) {
          // We have a token but no user data, try to fetch it
          try {
            const user = await AuthService.getProfile()
            this.user = user
            this.isAuthenticated = true
          } catch (error) {
            console.warn('Failed to fetch user profile, logging out:', error)
            this.logout()
          }
        } else {
          // No authentication data
          this.user = null
          this.isAuthenticated = false
        }
      } finally {
        this.initializing = false
      }
    },

    hasRole(role) {
      return this.user?.role === role
    },

    hasAnyRole(roles) {
      return roles.some(role => this.hasRole(role))
    }
  }
})