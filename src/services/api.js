// API service for provider management
const API_BASE_URL = 'http://localhost:8080/api'

export class ProviderAPIService {
  static async getProviderEntities(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'companyName',
      sortDir: params.sortDir || 'asc'
    })

    try {
      const response = await fetch(`${API_BASE_URL}/actisure/providers?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        status: 0,
        content: {
          content: data.content,
          page: {
            totalPages: data.totalPages,
            totalElements: data.totalElements
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch provider entities:', error)
      throw error
    }
  }

  static async searchProviders(searchTerm, params = {}) {
    const queryParams = new URLSearchParams({
      search: searchTerm,
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'companyName',
      sortDir: params.sortDir || 'asc'
    })

    try {
      const response = await fetch(`${API_BASE_URL}/actisure/providers/search?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        status: 0,
        content: {
          content: data.content,
          page: {
            totalPages: data.totalPages,
            totalElements: data.totalElements
          }
        }
      }
    } catch (error) {
      console.error('Failed to search providers:', error)
      throw error
    }
  }

  // Provider Requests API methods
  static async getProviderRequests(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'id',
      sortDir: params.sortDir || 'desc',
      ...(params.status && { status: params.status }),
      ...(params.category && { category: params.category }),
      ...(params.country && { country: params.country }),
      ...(params.region && { region: params.region }),
      ...(params.providerName && { providerName: params.providerName }),
      ...(params.requestedBy && { requestedBy: params.requestedBy }),
      ...(params.actionBy && { actionBy: params.actionBy })
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-requests?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch provider requests:', error)
      throw error
    }
  }

  static async getCategoriesFromRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories?page=0&size=1000`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.content
    } catch (error) {
      console.error('Failed to fetch categories from requests:', error)
      throw error
    }
  }

  static async getProviderRequestById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-requests/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch provider request with ID ${id}:`, error)
      throw error
    }
  }

  static async createProviderRequest(requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to create provider request:', error)
      throw error
    }
  }

  static async updateProviderRequest(id, requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to update provider request with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteProviderRequest(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-requests/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error(`Failed to delete provider request with ID ${id}:`, error)
      throw error
    }
  }

  static async approveProviderRequest(id, actionBy, hodComments = '') {
    const queryParams = new URLSearchParams({
      actionBy,
      ...(hodComments && { hodComments })
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-requests/${id}/approve?${queryParams}`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to approve provider request with ID ${id}:`, error)
      throw error
    }
  }

  static async declineProviderRequest(id, actionBy, hodComments) {
    const queryParams = new URLSearchParams({
      actionBy,
      hodComments
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-requests/${id}/decline?${queryParams}`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to decline provider request with ID ${id}:`, error)
      throw error
    }
  }

  // Visit Meetings API methods
  static async getVisitMeetings(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'visitDate',
      sortDir: params.sortDir || 'desc',
      ...(params.providerId && { providerId: params.providerId }),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.meetingTitle && { meetingTitle: params.meetingTitle })
    })

    try {
      const response = await fetch(`${API_BASE_URL}/visit-meetings?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch visit meetings:', error)
      throw error
    }
  }

  static async getVisitMeetingById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/visit-meetings/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch visit meeting with ID ${id}:`, error)
      throw error
    }
  }

  static async createVisitMeeting(meetingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/visit-meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to create visit meeting:', error)
      throw error
    }
  }

  static async updateVisitMeeting(id, meetingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/visit-meetings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to update visit meeting with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteVisitMeeting(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/visit-meetings/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error(`Failed to delete visit meeting with ID ${id}:`, error)
      throw error
    }
  }

  // Provider Categories API methods
  static async getProviderCategories(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'categoryName',
      sortDir: params.sortDir || 'asc',
      ...(params.activeOnly !== undefined && { activeOnly: params.activeOnly }),
      ...(params.search && { search: params.search })
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch provider categories:', error)
      throw error
    }
  }

  static async getActiveProviderCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories/active`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch active provider categories:', error)
      throw error
    }
  }

  static async getProviderCategoryById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch provider category with ID ${id}:`, error)
      throw error
    }
  }

  static async createProviderCategory(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to create provider category:', error)
      throw error
    }
  }

  static async updateProviderCategory(id, categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to update provider category with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteProviderCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error(`Failed to delete provider category with ID ${id}:`, error)
      throw error
    }
  }

  static async activateProviderCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-categories/${id}/activate`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error(`Failed to activate provider category with ID ${id}:`, error)
      throw error
    }
  }

  // Provider Countries API methods
  static async getProviderCountries(search = '') {
    const queryParams = new URLSearchParams(
      search ? { search } : {}
    )

    try {
      const response = await fetch(`${API_BASE_URL}/provider-countries?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch provider countries:', error)
      throw error
    }
  }

  static async getProviderCountryById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-countries/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch provider country with ID ${id}:`, error)
      throw error
    }
  }

  static async createProviderCountry(countryName) {
    const queryParams = new URLSearchParams({
      countryName
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-countries?${queryParams}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to create provider country:', error)
      throw error
    }
  }

  static async updateProviderCountry(id, countryName) {
    const queryParams = new URLSearchParams({
      countryName
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-countries/${id}?${queryParams}`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to update provider country with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteProviderCountry(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/provider-countries/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error(`Failed to delete provider country with ID ${id}:`, error)
      throw error
    }
  }

  // Provider Reports API methods
  static async getDashboardStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/dashboard`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch dashboard statistics:', error)
      throw error
    }
  }

  static async getRequestStatusSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/requests/status-summary`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch request status summary:', error)
      throw error
    }
  }

  static async getRequestCountrySummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/requests/country-summary`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch request country summary:', error)
      throw error
    }
  }

  static async getRequestCategorySummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/requests/category-summary`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch request category summary:', error)
      throw error
    }
  }

  static async getRequestTrends(startDate, endDate) {
    const queryParams = new URLSearchParams({
      startDate,
      endDate
    })

    try {
      const response = await fetch(`${API_BASE_URL}/reports/requests/trends?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch request trends:', error)
      throw error
    }
  }

  static async getVisitSummaryByProvider(providerId) {
    const queryParams = new URLSearchParams({
      providerId
    })

    try {
      const response = await fetch(`${API_BASE_URL}/reports/visits/provider-summary?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch visit summary for provider ID ${providerId}:`, error)
      throw error
    }
  }

  static async getVisitsByDateRange(startDate, endDate) {
    const queryParams = new URLSearchParams({
      startDate,
      endDate
    })

    try {
      const response = await fetch(`${API_BASE_URL}/reports/visits/date-range?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch visits by date range:', error)
      throw error
    }
  }

  static async getPerformanceMetrics(startDate = null, endDate = null) {
    const queryParams = new URLSearchParams()
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    try {
      const response = await fetch(`${API_BASE_URL}/reports/performance?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error)
      throw error
    }
  }

  static async exportRequestsData(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.status) queryParams.append('status', params.status)
    if (params.category) queryParams.append('category', params.category)
    if (params.country) queryParams.append('country', params.country)

    try {
      const response = await fetch(`${API_BASE_URL}/reports/export/requests?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to export requests data:', error)
      throw error
    }
  }
}

// Transform API data to component-friendly format
export const transformProviderData = (entity) => {
  return {
    id: entity.entityId,
    name: entity.companyName || `${entity.firstName} ${entity.surname}`.trim() || 'Unknown Provider',
    category: getProviderCategory(entity),
    location: 'Kenya', // Default location since not provided by API
    phone: '+254-700-000000', // Default phone since not provided by API
    email: `contact@provider${entity.entityId}.co.ke`, // Generated email
    licenseNumber: `LIC-${entity.entityId}`,
    status: entity.isActiveEntity ? 'Active' : 'Inactive',
    rating: (4.0 + Math.random()).toFixed(1), // Generated rating
    icon: getProviderIcon(entity),
    patientsServed: `${Math.floor(Math.random() * 50)}K+`, // Generated stat
    yearsActive: Math.floor(Math.random() * 20) + 1, // Generated stat
    roles: entity.roles,
    entityType: entity.entityType
  }
}

// Helper function to determine provider category based on roles
const getProviderCategory = (entity) => {
  const hasHealthcareRole = entity.roles.some(role => 
    role.roleDescription.toLowerCase().includes('healthcare') ||
    role.roleDescription.toLowerCase().includes('provider')
  )

  if (hasHealthcareRole) {
    // Determine category based on company name or other criteria
    const name = entity.companyName?.toLowerCase() || ''

    if (name.includes('hospital')) return 'Hospital'
    if (name.includes('clinic')) return 'Clinic'
    if (name.includes('pharmacy') || name.includes('pharma')) return 'Pharmacy'
    if (name.includes('dental') || name.includes('teeth')) return 'Dental'
    if (name.includes('diagnostic') || name.includes('lab')) return 'Diagnostic'
    if (name.includes('mental') || name.includes('psychology')) return 'Mental Health'
    if (name.includes('eye') || name.includes('optic')) return 'Eye Care'

    return 'Hospital' // Default
  }

  return 'Other'
}

// Helper function to get icon based on category
const getProviderIcon = (entity) => {
  const category = getProviderCategory(entity)

  const iconMap = {
    'Hospital': '🏥',
    'Clinic': '🏪',
    'Pharmacy': '💊',
    'Dental': '🦷',
    'Diagnostic': '🔬',
    'Mental Health': '🧠',
    'Eye Care': '👁️',
    'Other': '🏢'
  }

  return iconMap[category] || '🏢'
}
