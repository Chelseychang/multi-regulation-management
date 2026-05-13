// KYC System Service - Shared between pages
class KycSystemService {
    constructor() {
        this.storageKey = 'kyc_systems_data';
        this.defaultSystemsCache = null;
    }

    // Load all KYC systems
    loadAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                return JSON.parse(data);
            } else {
                // First time load - fetch from JSON file
                return this.getDefaultSystems();
            }
        } catch (error) {
            console.error('Error loading KYC systems:', error);
            return this.getDefaultSystems();
        }
    }

    // Get default systems from JSON file
    getDefaultSystems() {
        // Return cached data if available
        if (this.defaultSystemsCache) {
            return this.defaultSystemsCache;
        }

        // Fallback data in case JSON file fails to load
        const fallbackData = [
            {
                id: 1,
                kycConfigCode: "1",
                type: "Standard",
                name: "通用KYC体系",
                countries: ["All"],
                creator: "chelsey",
                createdAt: "2026-02-06 09:54:52",
                editor: "-",
                editedAt: "-"
            },
            {
                id: 1001,
                kycConfigCode: "1001",
                type: "Custom",
                name: "严格体系",
                countries: ["Afghanistan"],
                creator: "chelsey",
                createdAt: "2026-02-06 09:54:52",
                editor: "-",
                editedAt: "-"
            },
            {
                id: 1002,
                kycConfigCode: "1002",
                type: "Custom",
                name: "宽松体系（GS）",
                countries: ["Antigua and Barbuda", "Argentina"],
                creator: "chelsey",
                createdAt: "2026-02-06 09:54:52",
                editor: "-",
                editedAt: "-"
            },
            {
                id: 1003,
                kycConfigCode: "1003",
                type: "Custom",
                name: "宽松体系（APAC）OWS无POF",
                countries: ["Nigeria", "Benin", "India"],
                creator: "chelsey",
                createdAt: "2026-02-06 09:54:52",
                editor: "-",
                editedAt: "-"
            },
            {
                id: 1004,
                kycConfigCode: "1004",
                type: "Custom",
                name: "通用体系（MENA）OWS无POF",
                countries: ["Algeria", "Bahrain", "Iran"],
                creator: "chelsey",
                createdAt: "2026-02-06 09:54:52",
                editor: "-",
                editedAt: "-"
            },
            {
                id: 1005,
                kycConfigCode: "1005",
                type: "Custom",
                name: "严格体系（GS APAC）OWS无POF",
                countries: ["Hong Kong", "Macao"],
                creator: "chelsey",
                createdAt: "2026-02-06 09:54:52",
                editor: "-",
                editedAt: "-"
            },
            {
                id: 1006,
                kycConfigCode: "1006",
                type: "Custom",
                name: "UAE体系",
                countries: ["United Arab Emirates"],
                creator: "chelsey",
                createdAt: "2026-02-10 11:32:44",
                editor: "-",
                editedAt: "-"
            }
        ];

        // Try to load from JSON file synchronously
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'assets/data/kyc-systems.json', false); // Synchronous request
            xhr.send();
            if (xhr.status === 200) {
                this.defaultSystemsCache = JSON.parse(xhr.responseText);
                return this.defaultSystemsCache;
            }
        } catch (error) {
            console.warn('Failed to load kyc-systems.json, using fallback data:', error);
        }

        this.defaultSystemsCache = fallbackData;
        return fallbackData;
    }

    // Save all systems
    saveAll(systems) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(systems));
            return true;
        } catch (error) {
            console.error('Error saving KYC systems:', error);
            return false;
        }
    }

    // Get system by ID
    getById(id) {
        const systems = this.loadAll();
        return systems.find(s => s.id === parseInt(id));
    }

    // Create new system
    create(systemData) {
        const systems = this.loadAll();
        const newSystem = {
            ...systemData,
            id: Date.now(),
            kycConfigCode: Date.now().toString(),
            type: 'Custom',
            creator: 'Admin',
            createdAt: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(',', ''),
            editor: '-',
            editedAt: '-'
        };
        systems.push(newSystem);
        this.saveAll(systems);
        return newSystem;
    }

    // Update system
    update(id, systemData) {
        const systems = this.loadAll();
        const index = systems.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            systems[index] = {
                ...systems[index],
                ...systemData,
                editor: 'Admin',
                editedAt: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replace(',', '')
            };
            this.saveAll(systems);
            return systems[index];
        }
        return null;
    }

    // Delete system
    delete(id) {
        const systems = this.loadAll();
        const filtered = systems.filter(s => s.id !== parseInt(id));
        this.saveAll(filtered);
        return filtered.length < systems.length;
    }

    // Get configuration for a specific KYC system
    getConfig(id) {
        const system = this.getById(id);
        if (!system) return null;

        return system.config || {
            mainFlowLevels: [],
            independentFlowLevels: []
        };
    }

    // Save configuration for a specific KYC system
    saveConfig(id, configData) {
        const systems = this.loadAll();
        const index = systems.findIndex(s => s.id === parseInt(id));

        if (index === -1) return false;

        systems[index].config = configData;
        systems[index].editor = 'Admin';
        systems[index].editedAt = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '');

        return this.saveAll(systems);
    }
}

// Make globally available
window.KycSystemService = KycSystemService;
window.kycSystemService = new KycSystemService();
