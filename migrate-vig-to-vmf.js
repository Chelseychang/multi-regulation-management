/**
 * Migration Script: VIG → VMF License Update
 *
 * This script migrates all VIG license references to VMF in localStorage
 *
 * Usage:
 * 1. Open the Regulation Management System in browser
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter to execute
 * 5. Refresh the page to see updated data
 */

(function() {
    console.log('🔄 Starting VIG → VMF migration...');

    try {
        // 1. Migrate regulations data
        const regulationsData = localStorage.getItem('regulations');
        if (regulationsData) {
            const regulations = JSON.parse(regulationsData);
            let regulationCount = 0;

            regulations.forEach(reg => {
                if (reg.license === 'VIG') {
                    reg.license = 'VMF';
                    reg.code = 'VMF';
                    reg.updatedAt = new Date().toISOString();
                    reg.updatedBy = 'Migration Script';
                    regulationCount++;
                    console.log(`✅ Updated regulation: ${reg.brand}-${reg.regulation} (ID: ${reg.id})`);
                }
            });

            if (regulationCount > 0) {
                localStorage.setItem('regulations', JSON.stringify(regulations));
                console.log(`✅ Migrated ${regulationCount} regulation(s)`);
            } else {
                console.log('ℹ️ No regulations with VIG license found');
            }
        } else {
            console.log('ℹ️ No regulations data found in localStorage');
        }

        // 2. Migrate onboarding configurations (key format: BRAND_LICENSE)
        const onboardingConfigsData = localStorage.getItem('onboarding_configs');
        if (onboardingConfigsData) {
            const configs = JSON.parse(onboardingConfigsData);
            let configCount = 0;

            // Find all VIG keys
            const vigKeys = Object.keys(configs).filter(key => key.includes('_VIG'));

            vigKeys.forEach(oldKey => {
                const newKey = oldKey.replace('_VIG', '_VMF');
                configs[newKey] = configs[oldKey];
                delete configs[oldKey];
                configCount++;
                console.log(`✅ Migrated config: ${oldKey} → ${newKey}`);
            });

            if (configCount > 0) {
                localStorage.setItem('onboarding_configs', JSON.stringify(configs));
                console.log(`✅ Migrated ${configCount} onboarding config(s)`);
            } else {
                console.log('ℹ️ No onboarding configs with VIG license found');
            }
        } else {
            console.log('ℹ️ No onboarding configs found in localStorage');
        }

        // 3. Summary
        console.log('\n✨ Migration completed successfully!');
        console.log('📝 Summary:');
        console.log('   - VIG licenses updated to VMF');
        console.log('   - Configuration keys updated');
        console.log('   - Timestamps updated');
        console.log('\n🔄 Please refresh the page to see the changes.');

        // 4. Prompt user to refresh
        if (confirm('Migration completed! Click OK to refresh the page and see the changes.')) {
            window.location.reload();
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        console.error('Error details:', error.message);
        alert('Migration failed. Please check the console for details.');
    }
})();
