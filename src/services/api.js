// API service for provider management
const API_BASE_URL = 'http://localhost:8080/api'

export class ProviderAPIService {
  static async getProviderEntities(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 0,
      size: params.size || 10,
      sortBy: params.sortBy || 'companyName',
      sortDirection: params.sortDirection || 'ASC',
      paginated: params.paginated !== false,
      ...params
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-entities?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch provider entities:', error)
      throw error
    }
  }

  static async searchProviders(searchTerm, params = {}) {
    const queryParams = new URLSearchParams({
      search: searchTerm,
      page: params.page || 0,
      size: params.size || 10,
      sortBy: params.sortBy || 'companyName',
      sortDirection: params.sortDirection || 'ASC',
      paginated: params.paginated !== false,
      ...params
    })

    try {
      const response = await fetch(`${API_BASE_URL}/provider-entities/search?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to search providers:', error)
      throw error
    }
  }
}

// Transform API data to component-friendly format
export const transformProviderData = (apiProvider) => {
  const entity = apiProvider.entityDetails
  
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
    if (name.includes('dental') || name.includes('dental')) return 'Dental'
    if (name.includes('diagnostic') || name.includes('lab')) return 'Diagnostic'
    if (name.includes('mental') || name.includes('psychology')) return 'Mental Health'
    
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
    'Other': '🏢'
  }
  
  return iconMap[category] || '🏢'
}