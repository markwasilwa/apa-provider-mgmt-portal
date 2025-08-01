// Settings service for managing user settings and configurations
import { ProviderAPIService } from '@/services/api'

// Default document types for common categories
// These will be used as templates for categories from the API
const defaultDocumentTemplates = {
  'Healthcare Provider': [
    { id: 1, name: 'Hospital License', required: true },
    { id: 2, name: 'Medical Practitioner License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: true },
    { id: 4, name: 'Insurance Certificate', required: false },
    { id: 5, name: 'Provider Rates', required: true }
  ],
  'Specialist': [
    { id: 1, name: 'Specialist License', required: true },
    { id: 2, name: 'Medical Practitioner License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: true },
    { id: 4, name: 'Provider Rates', required: true }
  ],
  'Optical': [
    { id: 1, name: 'Optical License', required: true },
    { id: 2, name: 'Optometrist License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: false },
    { id: 4, name: 'Provider Rates', required: true }
  ],
  'Others': [
    { id: 1, name: 'Business License', required: true },
    { id: 2, name: 'Practitioner License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: true },
    { id: 4, name: 'Provider Rates', required: true }
  ],
  'Dental': [
    { id: 1, name: 'Dental Practice License', required: true },
    { id: 2, name: 'Dentist License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: false },
    { id: 4, name: 'Provider Rates', required: true }
  ],
  'Radiology': [
    { id: 1, name: 'Radiology License', required: true },
    { id: 2, name: 'Medical Practitioner License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: true },
    { id: 4, name: 'Equipment Certification', required: true },
    { id: 5, name: 'Provider Rates', required: true }
  ],
  'Orthopaedic': [
    { id: 1, name: 'Orthopaedic License', required: true },
    { id: 2, name: 'Medical Practitioner License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: true },
    { id: 4, name: 'Provider Rates', required: true }
  ],
  'Physiotherapy': [
    { id: 1, name: 'Physiotherapy License', required: true },
    { id: 2, name: 'Medical Practitioner License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: false },
    { id: 4, name: 'Provider Rates', required: true }
  ],
  'Default': [
    { id: 1, name: 'Business License', required: true },
    { id: 2, name: 'Practitioner License', required: true },
    { id: 3, name: 'Tax Compliance Certificate', required: true },
    { id: 4, name: 'Provider Rates', required: true }
  ]
};

export class SettingsService {
  // Initialize document mappings from API categories
  static async initializeFromAPI() {
    try {
      const categories = await ProviderAPIService.getCategoriesFromRequests();
      const mappings = {};

      // Create mappings for each category from the API
      categories.forEach(category => {
        const categoryName = category.categoryName;

        // Use template if available, otherwise use default template
        // First try exact match, then try case-insensitive match
        let template = defaultDocumentTemplates[categoryName];
        
        if (!template) {
          // Try to find a matching template by case-insensitive comparison
          const templateKey = Object.keys(defaultDocumentTemplates).find(key => 
            key.toLowerCase() === categoryName.toLowerCase()
          );
          template = templateKey ? defaultDocumentTemplates[templateKey] : null;
        }
        
        if (template) {
          mappings[categoryName] = [...template];
        } else {
          // Use default template and log for debugging
          console.log(`No template found for category: "${categoryName}", using default template`);
          mappings[categoryName] = [...defaultDocumentTemplates['Default']];
        }
      });

      this.setCategoryDocuments(mappings);
      return mappings;
    } catch (error) {
      console.error('Failed to initialize category document mappings from API:', error);
      // Create a basic mapping with just the templates we have
      return defaultDocumentTemplates;
    }
  }

  // Get category document mappings
  static getCategoryDocuments() {
    try {
      const storedMappings = localStorage.getItem('categoryDocumentMappings');
      if (storedMappings) {
        return JSON.parse(storedMappings);
      }

      // If no mappings found, initialize with defaults based on templates
      // We'll use the templates directly for now and initialize from API asynchronously
      this.initializeFromAPI().then(mappings => {
        console.log('Initialized category document mappings from API');
      });

      return defaultDocumentTemplates;
    } catch (error) {
      console.error('Failed to get category document mappings:', error);
      return defaultDocumentTemplates;
    }
  }

  // Save category document mappings
  static setCategoryDocuments(mappings) {
    try {
      localStorage.setItem('categoryDocumentMappings', JSON.stringify(mappings));
      return true;
    } catch (error) {
      console.error('Failed to save category document mappings:', error);
      return false;
    }
  }

  // Get documents for a specific category
  static getDocumentsForCategory(category) {
    const mappings = this.getCategoryDocuments();
    
    // First try exact match
    if (mappings[category]) {
      return mappings[category];
    }
    
    // Try case-insensitive match
    const mappingKey = Object.keys(mappings).find(key => 
      key.toLowerCase() === category.toLowerCase()
    );
    
    if (mappingKey && mappings[mappingKey]) {
      return mappings[mappingKey];
    }
    
    // Log for debugging if no match found
    console.log(`No documents found for category: "${category}". Available categories:`, Object.keys(mappings));
    
    // Return default documents if no match found
    return [...defaultDocumentTemplates['Default']];
  }

  // Add a new document to a category
  static addDocumentToCategory(category, document) {
    try {
      const mappings = this.getCategoryDocuments();

      // Create category if it doesn't exist
      if (!mappings[category]) {
        mappings[category] = [];
      }

      // Generate a new ID
      const maxId = mappings[category].length > 0 
        ? Math.max(...mappings[category].map(doc => doc.id)) 
        : 0;
      const newDocument = { ...document, id: maxId + 1 };

      mappings[category].push(newDocument);
      this.setCategoryDocuments(mappings);
      return newDocument;
    } catch (error) {
      console.error('Failed to add document to category:', error);
      return null;
    }
  }

  // Update a document in a category
  static updateDocumentInCategory(category, documentId, updatedDocument) {
    try {
      const mappings = this.getCategoryDocuments();

      if (!mappings[category]) {
        return false;
      }

      const index = mappings[category].findIndex(doc => doc.id === documentId);
      if (index === -1) {
        return false;
      }

      mappings[category][index] = { ...mappings[category][index], ...updatedDocument };
      this.setCategoryDocuments(mappings);
      return true;
    } catch (error) {
      console.error('Failed to update document in category:', error);
      return false;
    }
  }

  // Remove a document from a category
  static removeDocumentFromCategory(category, documentId) {
    try {
      const mappings = this.getCategoryDocuments();

      if (!mappings[category]) {
        return false;
      }

      mappings[category] = mappings[category].filter(doc => doc.id !== documentId);
      this.setCategoryDocuments(mappings);
      return true;
    } catch (error) {
      console.error('Failed to remove document from category:', error);
      return false;
    }
  }

  // Reset to default mappings
  static async resetToDefaults() {
    try {
      // Initialize from API to get the latest categories
      await this.initializeFromAPI();
      return true;
    } catch (error) {
      console.error('Failed to reset to default mappings:', error);

      // Fallback to templates if API fails
      try {
        this.setCategoryDocuments(defaultDocumentTemplates);
        return true;
      } catch (innerError) {
        console.error('Failed to reset to default templates:', innerError);
        return false;
      }
    }
  }

  // Clear cached settings and force refresh from defaults
  static clearCache() {
    try {
      localStorage.removeItem('categoryDocumentMappings');
      return true;
    } catch (error) {
      console.error('Failed to clear settings cache:', error);
      return false;
    }
  }

  // Force refresh settings with latest defaults
  static forceRefresh() {
    this.clearCache();
    this.setCategoryDocuments(defaultDocumentTemplates);
    return defaultDocumentTemplates;
  }

  // Force refresh from API - clear cache and reinitialize
  static async forceRefreshFromAPI() {
    this.clearCache();
    try {
      const mappings = await this.initializeFromAPI();
      console.log('Force refreshed category mappings from API:', mappings);
      return mappings;
    } catch (error) {
      console.error('Failed to force refresh from API, using defaults:', error);
      return this.forceRefresh();
    }
  }
}
