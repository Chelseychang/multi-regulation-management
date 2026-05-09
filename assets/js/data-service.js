// Data Service - Handles all data operations
class DataService {
  constructor() {
    this.countries = [];
    this.nationalities = [];
    this.regulations = this.loadRegulations();
  }

  // ==========================
  // Master Data Loading
  // ==========================

  async loadMasterData() {
    try {
      // Load countries
      this.countries = await this.loadCountries();
      console.log(`✅ Loaded ${this.countries.length} countries`);

      // Load nationalities
      this.nationalities = await this.loadNationalities();
      console.log(`✅ Loaded ${this.nationalities.length} nationalities`);

      // Load sample regulations if localStorage is empty
      await this.loadSampleDataIfNeeded();

    } catch (error) {
      console.error('❌ Error loading master data:', error);
      throw error;
    }
  }

  async loadSampleDataIfNeeded() {
    const existingData = localStorage.getItem('regulations');

    // Only load sample data if localStorage is empty
    if (!existingData || existingData === '[]') {
      try {
        console.log('📦 No data found in localStorage, loading sample data...');
        const sampleData = await $.getJSON('assets/data/sample-regulations.json');
        localStorage.setItem('regulations', JSON.stringify(sampleData));
        this.regulations = sampleData;
        console.log(`✅ Loaded ${sampleData.length} sample regulations`);
      } catch (error) {
        console.warn('⚠️ Could not load sample data:', error);
      }
    }
  }

  async loadCountries() {
    try {
      const data = await $.getJSON('assets/data/countries.json');
      return data;
    } catch (error) {
      console.warn('⚠️ countries.json not found, using fallback data');
      // Fallback data
      return this.getFallbackCountries();
    }
  }

  async loadNationalities() {
    try {
      const data = await $.getJSON('assets/data/nationalities.json');
      return data;
    } catch (error) {
      console.warn('⚠️ nationalities.json not found, using fallback data');
      // Fallback data
      return this.getFallbackNationalities();
    }
  }

  getFallbackCountries() {
    return [
      { code: 'CN', name: 'China' },
      { code: 'US', name: 'United States' },
      { code: 'UK', name: 'United Kingdom' },
      { code: 'SG', name: 'Singapore' },
      { code: 'AU', name: 'Australia' },
      { code: 'JP', name: 'Japan' },
      { code: 'HK', name: 'Hong Kong' },
      { code: 'MY', name: 'Malaysia' },
      { code: 'TH', name: 'Thailand' },
      { code: 'VN', name: 'Vietnam' },
      { code: 'ID', name: 'Indonesia' },
      { code: 'PH', name: 'Philippines' },
      { code: 'KR', name: 'South Korea' },
      { code: 'TW', name: 'Taiwan' },
      { code: 'IN', name: 'India' }
    ];
  }

  getFallbackNationalities() {
    return [
      { code: 'chinese', name: 'Chinese' },
      { code: 'american', name: 'American' },
      { code: 'british', name: 'British' },
      { code: 'singaporean', name: 'Singaporean' },
      { code: 'australian', name: 'Australian' },
      { code: 'japanese', name: 'Japanese' },
      { code: 'hongkonger', name: 'Hong Konger' },
      { code: 'malaysian', name: 'Malaysian' },
      { code: 'thai', name: 'Thai' },
      { code: 'vietnamese', name: 'Vietnamese' },
      { code: 'indonesian', name: 'Indonesian' },
      { code: 'filipino', name: 'Filipino' },
      { code: 'korean', name: 'Korean' },
      { code: 'taiwanese', name: 'Taiwanese' },
      { code: 'indian', name: 'Indian' }
    ];
  }

  getCountries() {
    return this.countries;
  }

  getNationalities() {
    return this.nationalities;
  }

  // ==========================
  // Regulation CRUD Operations
  // ==========================

  loadRegulations() {
    try {
      const data = localStorage.getItem('regulations');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading regulations from localStorage:', error);
      return [];
    }
  }

  saveRegulation(regulation) {
    // Validate Code uniqueness (Regulation Type + License Code combination)
    if (this.isCodeExists(regulation.regulation, regulation.code, regulation.id)) {
      throw new Error('This combination of Regulation Type and License Code already exists.');
    }

    const regulations = this.loadRegulations();

    if (regulation.id) {
      // Update existing regulation
      const index = regulations.findIndex(r => r.id === regulation.id);
      if (index !== -1) {
        const existingRegulation = regulations[index];
        regulations[index] = {
          ...regulation,
          createdAt: existingRegulation.createdAt || new Date().toISOString(), // Preserve original createdAt
          updatedAt: new Date().toISOString()
        };
        console.log('✅ Updated regulation:', regulation.code);
      }
    } else {
      // Create new regulation
      const newRegulation = {
        ...regulation,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      regulations.push(newRegulation);
      console.log('✅ Created new regulation:', newRegulation.code);
    }

    // Save to localStorage
    localStorage.setItem('regulations', JSON.stringify(regulations));
    this.regulations = regulations;

    return regulation;
  }

  getRegulation(id) {
    const regulations = this.loadRegulations();
    return regulations.find(r => r.id === parseInt(id));
  }

  deleteRegulation(id) {
    const regulations = this.loadRegulations();
    const filteredRegulations = regulations.filter(r => r.id !== parseInt(id));

    localStorage.setItem('regulations', JSON.stringify(filteredRegulations));
    this.regulations = filteredRegulations;

    console.log('✅ Deleted regulation ID:', id);
    return true;
  }

  getAllRegulations() {
    return this.loadRegulations();
  }

  // ==========================
  // Validation Methods
  // ==========================

  isCodeExists(regulationType, code, excludeId = null) {
    const regulations = this.loadRegulations();
    return regulations.some(r =>
      r.regulation === regulationType &&
      r.code === code &&
      r.id !== excludeId
    );
  }

  validateRegulation(regulation) {
    const errors = [];

    // Required fields
    if (!regulation.regulation) {
      errors.push('Regulation type is required');
    }

    if (!regulation.description || regulation.description.trim() === '') {
      errors.push('Description is required');
    }

    if (regulation.description && regulation.description.length > 30) {
      errors.push('Description must not exceed 30 characters');
    }

    // License required for V1/V2
    if ((regulation.regulation === 'V1' || regulation.regulation === 'V2') &&
        (!regulation.license || regulation.license.trim() === '')) {
      errors.push('License is required for V1 and V2 regulations');
    }

    if (regulation.license && regulation.license.length > 5) {
      errors.push('License must not exceed 5 characters');
    }

    // Code validation
    if (!regulation.code || regulation.code.trim() === '') {
      errors.push('Code is required');
    }

    // Code uniqueness (Regulation Type + License Code combination)
    if (regulation.code && this.isCodeExists(regulation.regulation, regulation.code, regulation.id)) {
      errors.push('This combination of Regulation Type and License Code already exists.');
    }

    // Registration Type
    if (!regulation.registrationTypes || regulation.registrationTypes.length === 0) {
      errors.push('At least one Registration Type must be selected');
    }

    // CP/IBP Domain
    if (!regulation.cpibpDomain || !regulation.cpibpDomain.default) {
      errors.push('Default CP/IBP Domain is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // ==========================
  // Statistics & Analytics
  // ==========================

  getStatistics() {
    const regulations = this.loadRegulations();

    return {
      total: regulations.length,
      byType: {
        V1: regulations.filter(r => r.regulation === 'V1').length,
        V2: regulations.filter(r => r.regulation === 'V2').length,
        ASIC: regulations.filter(r => r.regulation === 'ASIC').length,
        FCA: regulations.filter(r => r.regulation === 'FCA').length
      },
      recent: regulations.slice(-5).reverse()
    };
  }

  // ==========================
  // Export/Import (Future Enhancement)
  // ==========================

  exportToJSON() {
    const regulations = this.loadRegulations();
    const dataStr = JSON.stringify(regulations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `regulations_export_${Date.now()}.json`;
    link.click();

    console.log('✅ Exported regulations to JSON');
  }

  importFromJSON(jsonString) {
    try {
      const regulations = JSON.parse(jsonString);

      // Validate structure
      if (!Array.isArray(regulations)) {
        throw new Error('Invalid JSON format: expected an array');
      }

      // Save to localStorage
      localStorage.setItem('regulations', JSON.stringify(regulations));
      this.regulations = regulations;

      console.log(`✅ Imported ${regulations.length} regulations`);
      return { success: true, count: regulations.length };

    } catch (error) {
      console.error('❌ Import failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ==========================
  // Utility Methods
  // ==========================

  clearAllData() {
    if (confirm('Are you sure you want to delete ALL regulations? This action cannot be undone.')) {
      localStorage.removeItem('regulations');
      this.regulations = [];
      console.log('✅ Cleared all regulations');
      return true;
    }
    return false;
  }
}

// Make DataService globally available
window.DataService = DataService;
