import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add authentication
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token')
  const apiKey = localStorage.getItem('api_key')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (apiKey) {
    config.headers['X-API-Key'] = apiKey
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('api_key')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Legacy API service for provider management (keeping existing functionality)
const API_BASE_URL = '/api'

export class ProviderAPIService {
  static async getProviderEntities(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'companyName',
      sortDir: params.sortDir || 'asc'
    })

    try {
      const response = await api.get(`${API_BASE_URL}/actisure/providers?${queryParams}`)
      return {
        status: 0,
        content: {
          content: response.data.content,
          page: {
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements
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
      const response = await api.get(`${API_BASE_URL}/actisure/providers/search?${queryParams}`)
      return {
        status: 0,
        content: {
          content: response.data.content,
          page: {
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements
          }
        }
      }
    } catch (error) {
      console.error('Failed to search providers:', error)
      throw error
    }
  }

  static async searchVenues(companyName, params = {}) {
    const queryParams = new URLSearchParams({
      companyName: companyName,
      page: params.page || 0,
      size: params.size || 10,
      sortBy: params.sortBy || 'companyName',
      sortDir: params.sortDir || 'asc'
    })

    try {
      const response = await api.get(`${API_BASE_URL}/actisure/providers?${queryParams}`)
      return {
        status: 0,
        content: {
          content: response.data.content,
          page: {
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements
          }
        }
      }
    } catch (error) {
      console.error('Failed to search venues:', error)
      throw error
    }
  }

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
      const response = await api.get(`${API_BASE_URL}/provider-requests?${queryParams}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch provider requests:', error)
      throw error
    }
  }

  static async getCategoriesFromRequests() {
    try {
      const response = await api.get(`${API_BASE_URL}/provider-categories?page=0&size=1000`)
      return response.data.content
    } catch (error) {
      console.error('Failed to fetch categories from requests:', error)
      throw error
    }
  }

  static async getProviderRequestById(id) {
    try {
      const response = await api.get(`${API_BASE_URL}/provider-requests/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch provider request with ID ${id}:`, error)
      throw error
    }
  }

  static async createProviderRequest(requestData) {
    try {
      const response = await api.post(`${API_BASE_URL}/provider-requests`, requestData)
      return response.data
    } catch (error) {
      console.error('Failed to create provider request:', error)
      throw error
    }
  }

  static async updateProviderRequest(id, requestData) {
    try {
      const response = await api.put(`${API_BASE_URL}/provider-requests/${id}`, requestData)
      return response.data
    } catch (error) {
      console.error(`Failed to update provider request with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteProviderRequest(id) {
    try {
      await api.delete(`${API_BASE_URL}/provider-requests/${id}`)
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
      const response = await api.put(`${API_BASE_URL}/provider-requests/${id}/approve?${queryParams}`)
      return response.data
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
      const response = await api.put(`${API_BASE_URL}/provider-requests/${id}/decline?${queryParams}`)
      return response.data
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
      const response = await api.get(`${API_BASE_URL}/visit-meetings?${queryParams}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch visit meetings:', error)
      throw error
    }
  }

  static async getVisitMeetingById(id) {
    try {
      const response = await api.get(`${API_BASE_URL}/visit-meetings/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch visit meeting with ID ${id}:`, error)
      throw error
    }
  }

  static async getVisitMeetingsByProviderId(providerId, params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 20
    })

    try {
      const response = await api.get(`${API_BASE_URL}/visit-meetings/provider/${providerId}?${queryParams}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch visit meetings for provider ID ${providerId}:`, error)
      throw error
    }
  }

  static async getRecentVisitMeetings(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 10
    })

    try {
      const response = await api.get(`${API_BASE_URL}/visit-meetings/recent?${queryParams}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch recent visit meetings:', error)
      throw error
    }
  }

  static async createVisitMeeting(meetingData) {
    try {
      const response = await api.post(`${API_BASE_URL}/visit-meetings`, meetingData)
      return response.data
    } catch (error) {
      console.error('Failed to create visit meeting:', error)
      throw error
    }
  }

  static async updateVisitMeeting(id, meetingData) {
    try {
      const response = await api.put(`${API_BASE_URL}/visit-meetings/${id}`, meetingData)
      return response.data
    } catch (error) {
      console.error(`Failed to update visit meeting with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteVisitMeeting(id, comment) {
    try {
      await api.delete(`${API_BASE_URL}/visit-meetings/${id}`, {
        data: { deletionComment: comment }
      })
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
      const response = await api.get(`${API_BASE_URL}/provider-categories?${queryParams}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch provider categories:', error)
      throw error
    }
  }

  static async getActiveProviderCategories() {
    try {
      const response = await api.get(`${API_BASE_URL}/provider-categories/active`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch active provider categories:', error)
      throw error
    }
  }

  static async getProviderCategoryById(id) {
    try {
      const response = await api.get(`${API_BASE_URL}/provider-categories/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch provider category with ID ${id}:`, error)
      throw error
    }
  }

  static async createProviderCategory(categoryData) {
    try {
      const response = await api.post(`${API_BASE_URL}/provider-categories`, categoryData)
      return response.data
    } catch (error) {
      console.error('Failed to create provider category:', error)
      throw error
    }
  }

  static async updateProviderCategory(id, categoryData) {
    try {
      const response = await api.put(`${API_BASE_URL}/provider-categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      console.error(`Failed to update provider category with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteProviderCategory(id) {
    try {
      await api.delete(`${API_BASE_URL}/provider-categories/${id}`)
      return true
    } catch (error) {
      console.error(`Failed to delete provider category with ID ${id}:`, error)
      throw error
    }
  }

  static async activateProviderCategory(id) {
    try {
      await api.put(`${API_BASE_URL}/provider-categories/${id}/activate`)
      return true
    } catch (error) {
      console.error(`Failed to activate provider category with ID ${id}:`, error)
      throw error
    }
  }

  // Actisure Core System API methods for provider creation
  static async createProviderInActisure(providerName, kraPin, licenseNo) {
    const createProviderPayload = {
      CorporateClientEntityDetails: {
        CompanyName: providerName,
        ListRoleAdditionalInfo: [
          {
            Description: "Gender",
            Value: "Male"
          }
        ]
      }
    }

    try {
      // Step 1: Create Provider
      const createResponse = await api.post('/client/add', createProviderPayload)
      
      if (!createResponse.data.success) {
        throw new Error(createResponse.data.errorMessage || 'Failed to create provider')
      }

      const entityId = createResponse.data.entityId

      // Step 2: Add Healthcare Provider Role
      const healthcareRolePayload = {
        entityId: entityId,
        additionalInfo: {
          "KRA PIN No": kraPin,
          "License No": licenseNo
        },
        changedBy: "admin.user"
      }

      const healthcareRoleResponse = await api.post('/api/entity/add-role-info/healthcare-provider', healthcareRolePayload)
      
      if (healthcareRoleResponse.data.status !== 0) {
        throw new Error(healthcareRoleResponse.data.error || 'Failed to add healthcare provider role')
      }

      // Step 3: Add Payee Details
      const payeePayload = {
        entityId: entityId,
        name: providerName,
        changedBy: "admin.user"
      }

      const payeeResponse = await api.post('/api/entity/add-role-info/payee', payeePayload)
      
      if (payeeResponse.data.status !== 0) {
        throw new Error(payeeResponse.data.error || 'Failed to add payee role')
      }

      return {
        success: true,
        entityId: entityId,
        message: 'Provider successfully created in Actisure system'
      }

    } catch (error) {
      console.error('Failed to create provider in Actisure:', error)
      throw error
    }
  }

  // Sync entity details from Actisure backend
  static async syncEntityDetailsFromActisure(entityId) {
    try {
      const response = await api.get(`/api/actisure/providers/${entityId}`)
      
      return {
        success: true,
        entityData: response.data,
        message: 'Entity details synced successfully'
      }

    } catch (error) {
      console.error('Failed to sync entity details from Actisure:', error)
      throw error
    }
  }

  // Add contact details to provider in Actisure
  static async addContactDetailsToActisure(entityId, providerData) {
    const contactDetailsPayload = {
      EntityId: entityId,
      ContactDetails: {
        Addresses: [
          {
            Territory: "Kenya",
            StartDate: new Date().toISOString().split('T')[0],
            AddressLine1: providerData.address || "123 Kenyatta Avenue",
            AddressLine2: "1st Floor",
            AddressLine3: "Suite 12",
            AddressLine4: "",
            PostCode: "00100",
            AddressType: "Physical",
            Latitude: -1.2921,
            Longitude: 36.8219
          }
        ],
        Phones: [
          {
            PhoneNumber: providerData.phone ? providerData.phone.replace(/[^0-9]/g, '') : "721234567",
            CountryDialCode: "+254",
            RegionDialCode: "20",
            PhoneType: "Mobile"
          }
        ]
      }
    }

    try {
      const response = await api.post('/api/entity/add-contact-details', contactDetailsPayload)
      
      if (response.data.status !== 0) {
        throw new Error(response.data.error || 'Failed to add contact details')
      }

      return {
        success: true,
        addressIds: response.data.content.addressIds,
        phoneIds: response.data.content.phoneIds,
        message: 'Contact details added successfully'
      }

    } catch (error) {
      console.error('Failed to add contact details in Actisure:', error)
      throw error
    }
  }

  // Provider Countries API methods
  static async getProviderCountries(search = '') {
    const queryParams = new URLSearchParams(
      search ? { search } : {}
    )

    try {
      const response = await api.get(`${API_BASE_URL}/provider-countries?${queryParams}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch provider countries:', error)
      throw error
    }
  }

  static async createProviderCountry(countryName) {
    const queryParams = new URLSearchParams({
      countryName
    })

    try {
      const response = await api.post(`${API_BASE_URL}/provider-countries?${queryParams}`)
      return response.data
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
      const response = await api.put(`${API_BASE_URL}/provider-countries/${id}?${queryParams}`)
      return response.data
    } catch (error) {
      console.error(`Failed to update provider country with ID ${id}:`, error)
      throw error
    }
  }

  static async deleteProviderCountry(id) {
    try {
      await api.delete(`${API_BASE_URL}/provider-countries/${id}`)
      return true
    } catch (error) {
      console.error(`Failed to delete provider country with ID ${id}:`, error)
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
    location: 'Kenya',
    phone: '+254-700-000000',
    email: `contact@provider${entity.entityId}.co.ke`,
    licenseNumber: `LIC-${entity.entityId}`,
    status: entity.isActiveEntity ? 'Active' : 'Inactive',
    rating: (4.0 + Math.random()).toFixed(1),
    icon: getProviderIcon(entity),
    patientsServed: `${Math.floor(Math.random() * 50)}K+`,
    yearsActive: Math.floor(Math.random() * 20) + 1,
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
    const name = entity.companyName?.toLowerCase() || ''

    if (name.includes('hospital')) return 'Hospital'
    if (name.includes('clinic')) return 'Clinic'
    if (name.includes('pharmacy') || name.includes('pharma')) return 'Pharmacy'
    if (name.includes('dental') || name.includes('teeth')) return 'Dental'
    if (name.includes('diagnostic') || name.includes('lab')) return 'Diagnostic'
    if (name.includes('mental') || name.includes('psychology')) return 'Mental Health'
    if (name.includes('eye') || name.includes('optic')) return 'Eye Care'

    return 'Hospital'
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