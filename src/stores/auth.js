import { defineStore } from 'pinia'
import AuthService from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ROLE_ADMIN',
    isProvider: (state) => state.user?.role === 'ROLE_PROVIDER',
    isBackOffice: (state) => state.user?.role === 'ROLE_BACK_OFFICE',
    userInitials: (state) => {
      if (!state.user) return ''
      const first = state.user.firstName?.charAt(0) || ''
      const last = state.user.lastName?.charAt(0) || ''
      return (first + last).toUpperCase()
    },
    userDisplayName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    }
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

    logout() {
      AuthService.logout()
      this.user = null
      this.isAuthenticated = false
    },

    async initialize() {
      this.user = AuthService.getCurrentUser()
      this.isAuthenticated = AuthService.isAuthenticated()
      
      // If authenticated, try to refresh user data
      if (this.isAuthenticated && this.user) {
        try {
          await this.getProfile()
        } catch (error) {
          // If profile fetch fails, user might be using invalid token
          console.warn('Failed to refresh user profile:', error)
          this.logout()
        }
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