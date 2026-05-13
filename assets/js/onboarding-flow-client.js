// Client-side Onboarding Flow Service
class OnboardingFlowClient {
    constructor() {
        this.sessionKey = 'onboarding_session';
        this.currentStage = 1;
        this.totalStages = 7;
        this.userData = {};
        this.license = null;
        this.brand = null;
        this.config = null;
        this.stages = [
            { id: 1, name: 'Registration', key: 'registration' },
            { id: 2, name: 'Personal Details', key: 'personalDetails' },
            { id: 3, name: 'Identity Verification', key: 'identityVerification' },
            { id: 4, name: 'KYC Progress', key: 'kycProgress' },
            { id: 5, name: 'Trading Account', key: 'tradingAccount' },
            { id: 6, name: 'Agreements', key: 'agreements' },
            { id: 7, name: 'Questionnaire', key: 'questionnaire' }
        ];
    }

    // ===== Session Management =====

    saveSession() {
        const sessionData = {
            currentStage: this.currentStage,
            userData: this.userData,
            license: this.license,
            brand: this.brand,
            config: this.config,
            timestamp: new Date().toISOString()
        };

        try {
            sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            console.log('💾 Session saved:', sessionData);
            return true;
        } catch (error) {
            console.error('❌ Failed to save session:', error);
            return false;
        }
    }

    loadSession() {
        try {
            const data = sessionStorage.getItem(this.sessionKey);
            if (!data) {
                console.log('ℹ️ No existing session found');
                return null;
            }

            const sessionData = JSON.parse(data);

            // Check if session is expired (30 minutes)
            const timestamp = new Date(sessionData.timestamp);
            const now = new Date();
            const diffMinutes = (now - timestamp) / 1000 / 60;

            if (diffMinutes > 30) {
                console.log('⏰ Session expired, clearing...');
                this.clearSession();
                return null;
            }

            // Restore session data
            this.currentStage = sessionData.currentStage || 1;
            this.userData = sessionData.userData || {};
            this.license = sessionData.license;
            this.brand = sessionData.brand;
            this.config = sessionData.config;

            console.log('✅ Session loaded:', sessionData);
            return sessionData;
        } catch (error) {
            console.error('❌ Failed to load session:', error);
            return null;
        }
    }

    clearSession() {
        try {
            sessionStorage.removeItem(this.sessionKey);
            console.log('🧹 Session cleared');

            // Reset instance variables
            this.currentStage = 1;
            this.userData = {};
            this.license = null;
            this.brand = null;
            this.config = null;

            return true;
        } catch (error) {
            console.error('❌ Failed to clear session:', error);
            return false;
        }
    }

    // ===== License Determination =====

    async determineLicense(country, nationality, domain) {
        console.log('🔍 Determining license for:', { country, nationality, domain });

        try {
            // Get only enabled regulations from DataService
            const regulations = window.dataService.getActiveRegulations();

            if (!regulations || regulations.length === 0) {
                return {
                    matched: false,
                    error: 'No regulations configured in the system'
                };
            }

            console.log(`📋 Found ${regulations.length} regulations to match against`);

            // Filter regulations based on user inputs
            const matches = [];

            regulations.forEach(reg => {
                const registrationValues = reg.registrationValues || {};
                let score = 0;
                let reasons = [];

                console.log(`🔎 Checking regulation: ${reg.brand} - ${reg.code || reg.licenseCode}`, registrationValues);

                // Check domain (stored as "客名")
                const domainValue = registrationValues["客名"] || registrationValues["domain"];
                if (domainValue) {
                    console.log(`  📌 Domain check - Config:`, domainValue, `Looking for: "${domain}"`);

                    const domainMatch = domainValue === domain || domainValue === 'All';

                    if (domainMatch) {
                        score += 10;
                        reasons.push('domain match');
                        console.log(`  ✅ Domain matched!`);
                    } else {
                        console.log(`  ❌ Domain not matched (${domainValue} !== ${domain}), skipping regulation`);
                        return; // Skip this regulation if domain doesn't match
                    }
                } else {
                    console.log(`  ⏭️ Domain check skipped (no domain configured)`);
                }

                // Check country (stored as "国家" with whitelist/blacklist)
                const countryConfig = registrationValues["国家"] || registrationValues["country"];
                if (countryConfig && countryConfig.whitelist && countryConfig.whitelist.enabled) {
                    const countryWhitelist = countryConfig.whitelist.values || [];
                    console.log(`  🌍 Country check - Whitelist:`, countryWhitelist, `Looking for: "${country}"`);

                    // Get country code from country name
                    const countryCode = this.getCountryCode(country);
                    console.log(`  🔄 Converted "${country}" to code: "${countryCode}"`);

                    // Check both code and name
                    const countryMatch = countryWhitelist.includes(countryCode) ||
                                        countryWhitelist.includes(country) ||
                                        countryWhitelist.includes('All');

                    if (countryMatch) {
                        score += 5;
                        reasons.push('country match');
                        console.log(`  ✅ Country matched!`);
                    } else {
                        console.log(`  ❌ Country not matched, skipping regulation`);
                        return; // Skip this regulation
                    }
                } else {
                    console.log(`  ⏭️ Country check skipped (no country whitelist configured)`);
                }

                // Check nationality (stored as "国籍" with whitelist/blacklist)
                const nationalityConfig = registrationValues["国籍"] || registrationValues["nationality"];
                if (nationalityConfig && nationalityConfig.whitelist && nationalityConfig.whitelist.enabled) {
                    const nationalityWhitelist = nationalityConfig.whitelist.values || [];
                    console.log(`  🏴 Nationality check - Whitelist:`, nationalityWhitelist, `Looking for: "${nationality}"`);

                    // Convert to lowercase for comparison (stored as "indonesian", user selects "Indonesian")
                    const nationalityLower = nationality.toLowerCase();
                    const nationalityMatch = nationalityWhitelist.some(n =>
                        n.toLowerCase() === nationalityLower
                    ) || nationalityWhitelist.includes('All');

                    if (nationalityMatch) {
                        score += 5;
                        reasons.push('nationality match');
                        console.log(`  ✅ Nationality matched!`);
                    } else {
                        console.log(`  ❌ Nationality not matched, skipping regulation`);
                        return; // Skip this regulation
                    }
                } else {
                    console.log(`  ⏭️ Nationality check skipped (no nationality whitelist configured)`);
                }

                // Add to matches
                if (score > 0) {
                    console.log(`  ✨ Regulation matched with score: ${score}, reasons:`, reasons);
                    matches.push({
                        regulation: reg,
                        score,
                        reasons
                    });
                } else {
                    console.log(`  ⚠️ Regulation had score 0, not added to matches`);
                }
            });

            console.log(`✅ Found ${matches.length} matching regulation(s)`);

            if (matches.length === 0) {
                return {
                    matched: false,
                    error: 'No regulation found for your region/domain combination'
                };
            }

            // Sort by score (highest first)
            matches.sort((a, b) => b.score - a.score);

            // Take the best match
            const bestMatch = matches[0];
            const regulation = bestMatch.regulation;

            // The LICENSE is stored in the 'code' field, not 'licenseCode'
            const license = regulation.code || regulation.licenseCode;

            console.log('🎯 Best match:', {
                brand: regulation.brand,
                regulationType: regulation.regulation,
                license: license,
                score: bestMatch.score,
                reasons: bestMatch.reasons
            });

            return {
                matched: true,
                brand: regulation.brand,
                license: license,
                regulation: regulation,
                matchScore: bestMatch.score,
                matchReasons: bestMatch.reasons
            };

        } catch (error) {
            console.error('❌ Error determining license:', error);
            return {
                matched: false,
                error: 'System error while determining license'
            };
        }
    }

    // ===== Configuration Loading =====

    async loadConfig() {
        if (!this.brand || !this.license) {
            console.error('❌ Cannot load config: brand or license not set');
            return null;
        }

        console.log(`📥 Loading config for ${this.brand} - ${this.license}`);

        try {
            // Load from OnboardingService
            const config = window.onboardingService.getConfig(this.brand, this.license);

            if (!config) {
                console.warn('⚠️ No configuration found, using defaults');
                this.config = this.getDefaultConfig();
            } else {
                this.config = config;
                console.log('✅ Configuration loaded:', config);
            }

            return this.config;
        } catch (error) {
            console.error('❌ Error loading config:', error);
            this.config = this.getDefaultConfig();
            return this.config;
        }
    }

    getDefaultConfig() {
        return {
            registrationFields: {},
            personalInfoFields: [],
            otpConfig: { email: { enabled: true }, phone: { enabled: false, countries: [] } },
            kycConfig: { provider: 'Sumsub', poiDocuments: [], poaDocuments: [] },
            goldenFlowConfig: { selectedSystem: 1, mainFlowLevels: [], independentFlowLevels: [] },
            tradingAccountConfig: { primary: { enabled: true, defaultType: 'MT5' }, secondary: { enabled: false, supportedTypes: [] } },
            agreementConfig: { items: [], selectionMethod: 'all', generatePdf: false },
            questionnaireConfig: { enabled: false, questions: [] }
        };
    }

    // ===== Stage Navigation =====

    goToStage(stageNumber) {
        // Handle "complete" stage
        if (stageNumber === 'complete') {
            console.log('✅ Onboarding complete!');
            this.currentStage = 'complete';
            this.saveSession();

            // Trigger completion event
            $(document).trigger('stageChanged', {
                stage: 'complete',
                stageName: 'Complete',
                stageKey: 'complete'
            });

            return true;
        }

        if (stageNumber < 1 || stageNumber > this.totalStages) {
            console.error(`❌ Invalid stage number: ${stageNumber}`);
            return false;
        }

        console.log(`📍 Navigating to stage ${stageNumber}: ${this.stages[stageNumber - 1].name}`);

        this.currentStage = stageNumber;
        this.saveSession();

        // Trigger stage change event
        $(document).trigger('stageChanged', {
            stage: stageNumber,
            stageName: this.stages[stageNumber - 1].name,
            stageKey: this.stages[stageNumber - 1].key
        });

        return true;
    }

    nextStage() {
        if (this.currentStage < this.totalStages) {
            return this.goToStage(this.currentStage + 1);
        } else {
            console.log('✅ Reached final stage');
            return this.goToStage('complete');
        }
    }

    previousStage() {
        if (this.currentStage > 1) {
            return this.goToStage(this.currentStage - 1);
        }
        return false;
    }

    getCurrentStage() {
        if (this.currentStage === 'complete') {
            return {
                id: 'complete',
                name: 'Complete',
                key: 'complete'
            };
        }
        return this.stages[this.currentStage - 1];
    }

    getStageProgress() {
        return {
            current: this.currentStage,
            total: this.totalStages,
            percentage: Math.round((this.currentStage / this.totalStages) * 100)
        };
    }

    // ===== Validation =====

    validateCurrentStage() {
        const stage = this.getCurrentStage();
        console.log(`🔍 Validating stage: ${stage.name}`);

        switch (stage.key) {
            case 'registration':
                return this.validateRegistration();
            case 'personalDetails':
                return this.validatePersonalDetails();
            case 'identityVerification':
                return this.validateIdentityVerification();
            case 'kycProgress':
                return { valid: true }; // Informational stage, always valid
            case 'tradingAccount':
                return this.validateTradingAccount();
            case 'agreements':
                return this.validateAgreements();
            case 'questionnaire':
                return this.validateQuestionnaire();
            default:
                return { valid: true };
        }
    }

    validateRegistration() {
        const required = ['email', 'password', 'country', 'nationality', 'domain'];
        const missing = required.filter(field => !this.userData[field]);

        if (missing.length > 0) {
            return {
                valid: false,
                errors: [`Missing required fields: ${missing.join(', ')}`]
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.userData.email)) {
            return {
                valid: false,
                errors: ['Invalid email format']
            };
        }

        return { valid: true };
    }

    validatePersonalDetails() {
        if (!this.userData.otpVerified) {
            return {
                valid: false,
                errors: ['OTP verification required']
            };
        }

        // Check required personal info fields
        const personalInfoFields = this.config?.personalInfoFields || [];
        const requiredFields = personalInfoFields.filter(f => f.required && f.enabled);
        const missing = [];

        requiredFields.forEach(field => {
            if (!this.userData.personalInfo || !this.userData.personalInfo[field.key]) {
                missing.push(field.label);
            }
        });

        if (missing.length > 0) {
            return {
                valid: false,
                errors: [`Missing required fields: ${missing.join(', ')}`]
            };
        }

        return { valid: true };
    }

    validateIdentityVerification() {
        // This stage is optional in most cases
        // Users can skip and come back later
        return { valid: true };
    }

    validateTradingAccount() {
        if (!this.userData.tradingAccount) {
            return {
                valid: false,
                errors: ['Please select a trading account type']
            };
        }

        return { valid: true };
    }

    validateAgreements() {
        const agreementConfig = this.config?.agreementConfig || { items: [], selectionMethod: 'all' };
        const agreedItems = this.userData.agreements || [];

        if (agreementConfig.selectionMethod === 'all') {
            const allAgreed = agreementConfig.items.every(item =>
                agreedItems.includes(item.key)
            );

            if (!allAgreed) {
                return {
                    valid: false,
                    errors: ['You must agree to all terms to continue']
                };
            }
        } else {
            if (agreedItems.length === 0) {
                return {
                    valid: false,
                    errors: ['You must agree to at least one term']
                };
            }
        }

        return { valid: true };
    }

    validateQuestionnaire() {
        const questionnaireConfig = this.config?.questionnaireConfig || { enabled: false };

        if (!questionnaireConfig.enabled) {
            return { valid: true };
        }

        if (!this.userData.questionnaire || !this.userData.questionnaire.answers) {
            return {
                valid: false,
                errors: ['Please complete the questionnaire']
            };
        }

        return { valid: true };
    }

    // ===== User Data Management =====

    updateUserData(field, value) {
        this.userData[field] = value;
        this.saveSession();
    }

    getUserData(field) {
        return this.userData[field];
    }

    // ===== Utility Methods =====

    getCountryCode(countryName) {
        // Get country code from name using DataService
        const countries = window.dataService?.getCountries() || [];
        const country = countries.find(c =>
            (typeof c === 'object' && c.name === countryName) ||
            c === countryName
        );

        if (typeof country === 'object' && country.code) {
            return country.code;
        }

        return countryName; // Fallback to name if not found
    }

    reset() {
        this.clearSession();
        this.currentStage = 1;
        this.userData = {};
        this.license = null;
        this.brand = null;
        this.config = null;
    }
}

// Make globally available
window.OnboardingFlowClient = OnboardingFlowClient;
window.onboardingFlowClient = new OnboardingFlowClient();

console.log('✅ OnboardingFlowClient initialized');
