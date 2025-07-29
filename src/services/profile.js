import api from './api'

class ProfileService {
  async createProfile(profileData) {
    try {
      const response = await api.post('/api/user-profiles', profileData)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create profile')
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/api/user-profiles', profileData)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  async getCurrentProfile() {
    try {
      const response = await api.get('/api/user-profiles')
      if (response.data.status === 0) {
        return response.data.content
      }
      // Return null if no profile found (status 0 but content is null)
      return null
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile')
    }
  }

  async deleteProfile() {
    try {
      const response = await api.delete('/api/user-profiles')
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete profile')
    }
  }

  async getProfileById(profileId) {
    try {
      const response = await api.get(`/api/user-profiles/${profileId}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile')
    }
  }

  async getProfileByUserId(userId) {
    try {
      const response = await api.get(`/api/user-profiles/user/${userId}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile')
    }
  }

  async getProfileByEmail(email) {
    try {
      const response = await api.get(`/api/user-profiles/email/${email}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile')
    }
  }

  async getProfilesByRole(role, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 0,
        size: params.size || 20,
        sortBy: params.sortBy || 'createdAt',
        sortDir: params.sortDir || 'DESC'
      })

      const response = await api.get(`/api/user-profiles/role/${role}?${queryParams}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profiles')
    }
  }

  async searchProfiles(searchTerm, role = null, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        searchTerm,
        page: params.page || 0,
        size: params.size || 20,
        sortBy: params.sortBy || 'createdAt',
        sortDir: params.sortDir || 'DESC'
      })

      if (role) {
        queryParams.append('role', role)
      }

      const response = await api.get(`/api/user-profiles/search?${queryParams}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Search failed')
    }
  }

  // Provider-specific methods
  async getProvidersBySpecialization(specialization) {
    try {
      const response = await api.get(`/api/user-profiles/providers/specialization/${specialization}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get providers')
    }
  }

  async getProvidersByHospital(hospital) {
    try {
      const response = await api.get(`/api/user-profiles/providers/hospital/${hospital}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get providers')
    }
  }

  // Back Office methods
  async getBackOfficeByDepartment(department) {
    try {
      const response = await api.get(`/api/user-profiles/back-office/department/${department}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get back office staff')
    }
  }

  // Admin methods
  async getAdminsByLevel(adminLevel) {
    try {
      const response = await api.get(`/api/user-profiles/admins/level/${adminLevel}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get admins')
    }
  }

  // Statistics methods
  async getProfileStatsByRole(role) {
    try {
      const response = await api.get(`/api/user-profiles/stats/role/${role}`)
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get statistics')
    }
  }

  async getAllProfileStats() {
    try {
      const response = await api.get('/api/user-profiles/stats/all')
      if (response.data.status === 0) {
        return response.data.content
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get statistics')
    }
  }
}

export default new ProfileService()