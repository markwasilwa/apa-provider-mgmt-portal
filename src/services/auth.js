import api from './api'

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      if (response.data.status === 0) {
        localStorage.setItem('jwt_token', response.data.content.token)
        localStorage.setItem('user', JSON.stringify(response.data.content.user))
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async loginWithApiKey(apiKey) {
    try {
      const response = await api.get('/api/users/profile', {
        headers: { 'X-API-Key': apiKey }
      })
      if (response.data.status === 0) {
        localStorage.setItem('api_key', apiKey)
        localStorage.setItem('user', JSON.stringify(response.data.content))
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData)
      if (response.data.status === 0) {
        localStorage.setItem('jwt_token', response.data.content.token)
        localStorage.setItem('user', JSON.stringify(response.data.content.user))
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post('/api/auth/forgot-password', { email })
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword
      })
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/api/users/change-password', {
        currentPassword,
        newPassword
      })
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/api/users/profile')
      if (response.data.status === 0) {
        localStorage.setItem('user', JSON.stringify(response.data.content))
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/api/users/profile', profileData)
      if (response.data.status === 0) {
        localStorage.setItem('user', JSON.stringify(response.data.content))
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  logout() {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('api_key')
    localStorage.removeItem('user')
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null')
  }

  isAuthenticated() {
    return !!(localStorage.getItem('jwt_token') || localStorage.getItem('api_key'))
  }

  hasRole(role) {
    const user = this.getCurrentUser()
    return user && user.role === role
  }

  isAdmin() {
    return this.hasRole('ROLE_ADMIN')
  }

  isProvider() {
    return this.hasRole('ROLE_PROVIDER')
  }

  isBackOffice() {
    return this.hasRole('ROLE_BACK_OFFICE')
  }

  async verifyEmail(token) {
    try {
      const response = await api.post(`/api/auth/verify-email/${token}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async regenerateApiKey() {
    try {
      const response = await api.post('/api/users/regenerate-api-key')
      if (response.data.status === 0) {
        localStorage.setItem('user', JSON.stringify(response.data.content))
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  // Admin-only methods
  async getAllUsers() {
    try {
      const response = await api.get('/api/users')
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async registerUser(userData) {
    try {
      const response = await api.post('/api/auth/register', userData)
      if (response.data.status === 0) {
        return response.data.content.user
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async getUserById(id) {
    try {
      const response = await api.get(`/api/users/${id}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }

  async deleteUser(id) {
    try {
      const response = await api.delete(`/api/users/${id}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }
}

export default new AuthService()