# Final KYC Level Structure

**Date**: 2026-06-05  
**Status**: ✅ Complete

---

## 📊 Current KYC Level Organization

### Main Flow Levels (6 total)

| Order | Level Key | Level Name | Description |
|-------|-----------|------------|-------------|
| 1 | level1 | Personal Details Verification | Basic personal info validation |
| 2 | level2 | Identity Verification | POI document upload & validation |
| 3 | level3 | Residency Address Verification | POA document upload & validation |
| 4 | **level12** | **Face Verification** ✅ | Biometric face matching |
| 5 | level13 | Video Verification | Live video KYC verification |
| 6 | level14 | Questionnaire Verification | Risk assessment questionnaire |

### Independent Flow Levels (2 total)

| Order | Level Key | Level Name | Description |
|-------|-----------|------------|-------------|
| 1 | level11 | Bank Transfer Verification | Proof of bank account ownership |
| 2 | **level12** | **Face Verification** ✅ | Biometric face matching |

---

## 🔑 Key Points

✅ **Face Verification (level12)** appears in **BOTH** Main Flow and Independent Flow  
✅ **Video Verification (level13)** is in Main Flow only  
✅ **Questionnaire Verification (level14)** is in Main Flow only  
✅ **Bank Transfer Verification (level11)** is in Independent Flow only  

---

## 📋 Dropdown Options

### "Add Main Flow Level" Dropdown (6 options):
```
1. Personal Details Verification
2. Identity Verification
3. Residency Address Verification
4. Face Verification            ← NEW: Added to Main Flow ✅
5. Video Verification           ← Moved from Independent
6. Questionnaire Verification   ← Moved from Independent
```

### "Add Independent Flow Level" Dropdown (2 options):
```
1. Bank Transfer Verification
2. Face Verification            ← Remains in Independent Flow ✅
```

---

## 🎯 Business Logic

### Why Face Verification Appears in Both Flows?

**In Main Flow:**
- Core identity verification step for high-security jurisdictions
- Required by some regulators as part of primary KYC
- Sequential verification: Personal → Identity → Residency → Face → Video
- Part of the standard onboarding journey

**In Independent Flow:**
- Alternative/supplementary verification method
- Optional enhancement for lower-risk accounts
- Can be triggered independently post-registration
- Used when video verification is not available/required

### Level Mapping Strategy

**Shared Level Key (level12):**
- Face Verification uses `level12` in BOTH flows
- System determines context based on which flow it's added to
- Configuration saved per KYC System determines its role
- No data duplication - same level definition, different usage contexts

---

## 🔄 Visual Flow

### User Onboarding Journey (Example: High-Security Region)

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN FLOW (Sequential)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Personal Details Verification (level1)             │
│           ↓                                                  │
│  Step 2: Identity Verification (level2)                     │
│           ↓                                                  │
│  Step 3: Residency Address Verification (level3)            │
│           ↓                                                  │
│  Step 4: Face Verification (level12) ← NEW POSITION ✅       │
│           ↓                                                  │
│  Step 5: Video Verification (level13)                       │
│           ↓                                                  │
│  Step 6: Questionnaire Verification (level14)               │
│           ↓                                                  │
│         ✓ Account Activated                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              INDEPENDENT FLOW (Optional/Async)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • Bank Transfer Verification (level11)                     │
│      - Triggered when user makes first deposit              │
│      - Verifies bank account ownership                      │
│                                                              │
│  • Face Verification (level12) ← ALSO HERE ✅                │
│      - Alternative verification if not done in Main Flow    │
│      - Can be triggered for account upgrades                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Files Modified

### 1. `pages/kyc-system-config.html` (Line 786-798)

**Constants:**
```javascript
const KYC_LEVEL_OPTIONS_MAIN = [
    'Personal Details Verification',
    'Identity Verification',
    'Residency Address Verification',
    'Face Verification',          // ✅ Added
    'Video Verification',         // ✅ Moved from Independent
    'Questionnaire Verification'  // ✅ Moved from Independent
];

const KYC_LEVEL_OPTIONS_INDEPENDENT = [
    'Bank Transfer Verification',
    'Face Verification'          // ✅ Remains here
];
```

### 2. `pages/onboarding-flow.html` (Lines 3815-3867, 4162-4172)

**Constants:**
```javascript
const MAIN_FLOW_LEVELS = [
    'Personal Details Verification',
    'Identity Verification',
    'Residency Address Verification',
    'Face Verification',          // ✅ Added
    'Video Verification',
    'Questionnaire Verification'
];

const INDEPENDENT_FLOW_LEVELS = [
    'Bank Transfer Verification',
    'Face Verification'          // ✅ Remains here
];
```

**Mapping Logic:**
```javascript
const mainLevelMapping = {
    'Personal Details Verification': 'level1',
    'Identity Verification': 'level2',
    'Residency Address Verification': 'level3',
    'Face Verification': 'level12',          // ✅ Added to Main Flow mapping
    'Video Verification': 'level13',
    'Questionnaire Verification': 'level14'
};

const independentLevelMapping = {
    'Bank Transfer Verification': 'level11',
    'Face Verification': 'level12'          // ✅ Remains in Independent mapping
};
```

**Comments:**
```javascript
// Main Flow: level1, level2, level3, level12, level13, level14
// Independent Flow: level11, level12 (note: level12 appears in BOTH flows)
```

---

## 🧪 Testing Checklist

### Manual Testing:

- [ ] Refresh browser at `localhost:8000/#/kyc/system-config`
- [ ] Edit any KYC System
- [ ] Click "Add Main Flow Level"
- [ ] **Verify**: Dropdown shows 6 options with Face Verification between Residency and Video
- [ ] Click "Add Independent Flow Level"
- [ ] **Verify**: Dropdown shows 2 options including Face Verification
- [ ] Add a Main Flow level with "Face Verification"
- [ ] Save configuration
- [ ] **Verify**: Face Verification appears in Main Flow table
- [ ] Add an Independent Flow level with "Face Verification"
- [ ] **Verify**: Both instances can coexist without conflict

### Browser Console Verification:

```javascript
// Check Main Flow
console.log(MAIN_FLOW_LEVELS);
// Expected: 6 items, includes 'Face Verification' at index 3

console.log(KYC_LEVEL_OPTIONS_MAIN);
// Expected: 6 items, includes 'Face Verification' at index 3

// Check Independent Flow
console.log(INDEPENDENT_FLOW_LEVELS);
// Expected: 2 items, includes 'Face Verification'

console.log(KYC_LEVEL_OPTIONS_INDEPENDENT);
// Expected: 2 items, includes 'Face Verification'
```

---

## 📊 Level Distribution Table

| Level Key | Level Name | Main Flow | Independent Flow | Notes |
|-----------|------------|-----------|------------------|-------|
| level1 | Personal Details Verification | ✅ | ❌ | Main Flow only |
| level2 | Identity Verification | ✅ | ❌ | Main Flow only |
| level3 | Residency Address Verification | ✅ | ❌ | Main Flow only |
| level11 | Bank Transfer Verification | ❌ | ✅ | Independent Flow only |
| **level12** | **Face Verification** | **✅** | **✅** | **BOTH flows** |
| level13 | Video Verification | ✅ | ❌ | Main Flow only |
| level14 | Questionnaire Verification | ✅ | ❌ | Main Flow only |

---

## 🎨 UI Order Comparison

### Main Flow Level Order in UI:

```
┌─────────────────────────────────────────────────────┐
│  Main Flow Levels                                   │
├─────────────────────────────────────────────────────┤
│  1. Personal Details Verification                   │
│  2. Identity Verification                           │
│  3. Residency Address Verification                  │
│  4. Face Verification            ← Position 4 ✅    │
│  5. Video Verification           ← Position 5       │
│  6. Questionnaire Verification   ← Position 6       │
└─────────────────────────────────────────────────────┘
```

### Independent Flow Level Order in UI:

```
┌─────────────────────────────────────────────────────┐
│  Independent Flow Levels                            │
├─────────────────────────────────────────────────────┤
│  1. Bank Transfer Verification                      │
│  2. Face Verification            ← Position 2 ✅    │
└─────────────────────────────────────────────────────┘
```

---

## 💡 Configuration Examples

### Example 1: Standard KYC System

**Main Flow:**
- Level 1: Personal Details Verification
- Level 2: Identity Verification
- Level 3: Residency Address Verification
- Level 12: Face Verification ✅
- Level 13: Video Verification

**Independent Flow:**
- Level 11: Bank Transfer Verification

---

### Example 2: High-Security KYC System

**Main Flow:**
- Level 1: Personal Details Verification
- Level 2: Identity Verification
- Level 3: Residency Address Verification
- Level 12: Face Verification ✅
- Level 13: Video Verification
- Level 14: Questionnaire Verification

**Independent Flow:**
- Level 11: Bank Transfer Verification
- Level 12: Face Verification ✅ (for account upgrades)

---

### Example 3: Simplified KYC System

**Main Flow:**
- Level 1: Personal Details Verification
- Level 2: Identity Verification
- Level 3: Residency Address Verification

**Independent Flow:**
- Level 12: Face Verification ✅ (optional)

---

## 🔐 Data Compatibility

### Backward Compatibility: ✅ YES

- Existing KYC systems remain functional
- No data migration required
- Old configurations will continue to work
- New configurations can use expanded options

### Level Key Consistency: ✅ YES

- `level12` consistently represents Face Verification
- Context (Main vs Independent) determined by configuration
- No conflicts in data structure

---

## 📞 Support

**Questions?** Contact: Chelsey Chang  
**Documentation**: See `/docs/PRD.md` for complete product specifications

---

**Status**: ✅ Implementation Complete  
**Version**: 1.1 (Updated with Face Verification in Main Flow)  
**Last Updated**: 2026-06-05  
**Breaking Changes**: None
