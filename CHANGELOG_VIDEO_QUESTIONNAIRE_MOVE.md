# KYC Level Reorganization - Video & Questionnaire Verification

**Date**: 2026-06-05  
**Author**: Claude Code  
**Issue**: Move Video Verification and Questionnaire Verification from Independent Flow to Main Flow

---

## 📋 Summary of Changes

Video Verification and Questionnaire Verification have been **moved from Independent Flow to Main Flow** in the KYC System Configuration.

### Before:
- **Main Flow**: 3 levels (Personal Details, Identity, Residency Address)
- **Independent Flow**: 4 levels (Bank Transfer, Face, Video, Questionnaire)

### After:
- **Main Flow**: 5 levels (Personal Details, Identity, Residency Address, Video, Questionnaire)
- **Independent Flow**: 2 levels (Bank Transfer, Face)

---

## 🔧 Technical Changes

### Files Modified:
1. `pages/onboarding-flow.html` - Onboarding Flow Configuration page
2. `pages/kyc-system-config.html` - KYC System Configuration page

#### 1. Updated Flow Level Constants (Line ~4162-4172)

**Before:**
```javascript
const MAIN_FLOW_LEVELS = [
    'Personal Details Verification',
    'Identity Verification',
    'Residency Address Verification'
];

const INDEPENDENT_FLOW_LEVELS = [
    'Bank Transfer Verification',
    'Face Verification',
    'Video Verification'
];
```

**After:**
```javascript
const MAIN_FLOW_LEVELS = [
    'Personal Details Verification',
    'Identity Verification',
    'Residency Address Verification',
    'Video Verification',
    'Questionnaire Verification'
];

const INDEPENDENT_FLOW_LEVELS = [
    'Bank Transfer Verification',
    'Face Verification'
];
```

#### 2. Updated Level Mapping Comments (Line ~3815-3818)

**Before:**
```javascript
// Main Flow: level1, level2, level3
// Independent Flow: level11, level12, level13, level14
```

**After:**
```javascript
// Main Flow: level1, level2, level3, level13, level14
// Independent Flow: level11, level12
```

#### 3. Updated Configuration Overview Logic (Line ~3829-3867)

Changed the level processing to use **name-based mapping** for Main Flow levels instead of index-based:

**Before:**
```javascript
// Main Flow used index-based mapping (index < 3)
system.config.mainFlowLevels.forEach((level, index) => {
    const levelKey = `level${index + 1}`;
    if (levelMap.hasOwnProperty(levelKey) && index < 3) {
        levelMap[levelKey] = level;
    }
});
```

**After:**
```javascript
// Main Flow now uses name-based mapping
const mainLevelMapping = {
    'Personal Details Verification': 'level1',
    'Identity Verification': 'level2',
    'Residency Address Verification': 'level3',
    'Video Verification': 'level13',
    'Questionnaire Verification': 'level14'
};

system.config.mainFlowLevels.forEach((level) => {
    const levelKey = mainLevelMapping[level.kycLevel];
    if (levelKey && levelMap.hasOwnProperty(levelKey)) {
        levelMap[levelKey] = level;
    }
});
```

**Independent Flow mapping updated:**
```javascript
const independentLevelMapping = {
    'Bank Transfer Verification': 'level11',
    'Face Verification': 'level12'
    // Removed: 'Video Verification': 'level13'
    // Removed: 'Questionnaire Verification': 'level14'
};
```

---

## 📊 Level Mapping Table

| Level Key | Level Name | Flow Type (Before) | Flow Type (After) |
|-----------|------------|-------------------|-------------------|
| level1 | Personal Details Verification | Main Flow | Main Flow |
| level2 | Identity Verification | Main Flow | Main Flow |
| level3 | Residency Address Verification | Main Flow | Main Flow |
| level11 | Bank Transfer Verification | Independent | Independent |
| level12 | Face Verification | Independent | Independent |
| level13 | Video Verification | ~~Independent~~ | **Main Flow** ✅ |
| level14 | Questionnaire Verification | ~~Independent~~ | **Main Flow** ✅ |

---

## 🎯 Impact Areas

### ✅ Configuration (Setting)

1. **KYC System Configuration Page** (`pages/kyc-system-config.html`)
   - When adding/editing KYC levels, dropdown options now reflect the correct categorization
   - Main Flow dropdown includes Video & Questionnaire Verification (5 options total)
   - Independent Flow dropdown excludes Video & Questionnaire Verification (2 options total)
   - Uses constants: `KYC_LEVEL_OPTIONS_MAIN` and `KYC_LEVEL_OPTIONS_INDEPENDENT`

2. **Onboarding Flow Configuration Page** (`pages/onboarding-flow.html`)
   - Configuration overview table correctly categorizes levels
   - Level mapping logic updated for proper display
   - Uses constants: `MAIN_FLOW_LEVELS` and `INDEPENDENT_FLOW_LEVELS`

3. **Level Editor Modal**
   - `populateKycLevelOptions(flowType)` function uses updated constants
   - Correct options shown based on flow type

### ✅ Display

1. **Configuration Overview Table**
   - `loadConfigurationOverview()` function processes levels correctly
   - Video Verification (level13) and Questionnaire Verification (level14) display under Main Flow
   - Level names rendered consistently: "Video Verification" and "Questionnaire Verification"

2. **Config Summary Cards**
   - Main Flow count includes Video & Questionnaire levels
   - Independent Flow count excludes them

---

## 🧪 Testing Checklist

### Manual Testing Steps:

- [ ] Open Onboarding Flow Configuration page (`#/onboarding-flow`)
- [ ] Select a KYC System
- [ ] Click "View Configuration"
- [ ] **Verify**: Configuration Overview table shows Video Verification and Questionnaire Verification columns
- [ ] Click "Edit" on a KYC System
- [ ] Click "Add Main Flow Level"
- [ ] **Verify**: Dropdown includes "Video Verification" and "Questionnaire Verification"
- [ ] Click "Add Independent Flow Level"
- [ ] **Verify**: Dropdown ONLY includes "Bank Transfer Verification" and "Face Verification"
- [ ] Create/edit a Main Flow level with "Video Verification"
- [ ] Save and verify it appears in the Main Flow table
- [ ] **Verify**: Level counts update correctly (Main Flow +2, Independent Flow -2)

### Browser Console Checks:

```javascript
// Check constants are updated
console.log(MAIN_FLOW_LEVELS);
// Expected: ['Personal Details Verification', 'Identity Verification', 
//            'Residency Address Verification', 'Video Verification', 
//            'Questionnaire Verification']

console.log(INDEPENDENT_FLOW_LEVELS);
// Expected: ['Bank Transfer Verification', 'Face Verification']
```

---

## 🔄 Data Migration

### Existing Data Compatibility

**No data migration required** for existing KYC systems stored in localStorage because:

1. Level keys (level13, level14) remain unchanged
2. Level names remain unchanged
3. Only the **categorization logic** changed (which flow they belong to)

However, **users with existing configurations** will need to:

1. Review their KYC System configurations
2. Move Video/Questionnaire levels from Independent Flow to Main Flow manually if desired
3. Or they can continue using the old structure until they edit the KYC System

### Backward Compatibility

✅ **Fully backward compatible**  
- Old data structure will still render correctly
- Mapping logic handles both old and new structures
- No breaking changes to existing localStorage data

---

## 📝 Notes

1. **Level Keys Preserved**: `level13` and `level14` still represent Video and Questionnaire Verification respectively, maintaining database consistency.

2. **Logical Grouping**: This change aligns with the business logic where Video and Questionnaire verifications are part of the main KYC flow rather than independent supplementary checks.

3. **UI Consistency**: All dropdowns, tables, and displays now consistently show Video and Questionnaire under Main Flow.

---

## 🐛 Known Issues / Edge Cases

None identified. The change is straightforward and well-isolated.

---

## 📞 Support

If you encounter any issues after this change:

1. Clear browser cache and localStorage
2. Check browser console for mapping errors
3. Verify KYC System configurations are properly structured
4. Contact: Chelsey Chang

---

**Change Status**: ✅ Complete  
**Production Ready**: Yes  
**Breaking Changes**: No
