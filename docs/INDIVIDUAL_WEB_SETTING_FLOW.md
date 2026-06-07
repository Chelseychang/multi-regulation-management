# Individual Web Setting Flow - Sequential Logic

**Date**: 2026-06-06  
**Change**: Modified from "bypass" to "sequential" flow

---

## 📊 NEW FLOW (Sequential)

### **Before This Change (Bypass Logic)**
```
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Personal Details Verification                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Is H5 Verification Enabled?                                │
│          ↓                         ↓                         │
│         YES                       NO                         │
│          ↓                         ↓                         │
│  Load H5 page (bypass)     Show default form                │
│  Skip default form         (First Name, Last Name, etc.)    │
│          ↓                         ↓                         │
│  H5 page completed         Default form completed           │
│          ↓                         ↓                         │
│  Return to onboarding      Next stage                       │
│          ↓                                                   │
│  Next stage                                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
    ❌ Problem: Default form is skipped entirely
```

### **After This Change (Sequential Logic) ✅**
```
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Personal Details Verification                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: Always Show Default Form                           │
│  ┌────────────────────────────────────────┐                │
│  │ ✓ First Name      [John          ]     │                │
│  │ ✓ Last Name       [Doe           ]     │                │
│  │ ✓ Gender          [Male     ▼   ]     │                │
│  │ ✓ Date of Birth   [1990-01-01   ]     │                │
│  │ ✓ Country         [Malaysia ▼   ]     │                │
│  │ ✓ Nationality     [Malaysian▼   ]     │                │
│  │                                         │                │
│  │         [Continue] button              │                │
│  └────────────────────────────────────────┘                │
│          ↓                                                   │
│  User clicks Continue                                       │
│          ↓                                                   │
│  ✅ Validate & Save default form data                       │
│          ↓                                                   │
│  STEP 2: Check if H5 Verification is Enabled               │
│          ↓                         ↓                         │
│         YES                       NO                         │
│          ↓                         ↓                         │
│  Redirect to H5 page       Go to next stage                │
│  (Additional step)          (Stage 3: KYC)                  │
│          ↓                                                   │
│  ┌────────────────────────────────────┐                    │
│  │ H5 Verification Page               │                    │
│  │ (kyc-individual-personal-info.html)│                    │
│  │                                    │                    │
│  │ [Additional custom fields...]      │                    │
│  │                                    │                    │
│  │       [Submit] button              │                    │
│  └────────────────────────────────────┘                    │
│          ↓                                                   │
│  H5 page completed                                          │
│          ↓                                                   │
│  Return to onboarding.html?completed=personalInfo           │
│          ↓                                                   │
│  Mark h5VerificationCompleted = true                        │
│          ↓                                                   │
│  Go to next stage (Stage 3: KYC)                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
    ✅ Benefit: Default form is ALWAYS filled first
```

---

## 🔄 Step-by-Step User Journey

### **Scenario A: H5 Verification Disabled**
```
User at Stage 2 (Personal Details)
    ↓
[1] Sees default form with configurable fields
    ↓
[2] Fills in:
    - First Name
    - Last Name
    - Gender
    - Date of Birth
    - Country of Residence
    - Nationality
    ↓
[3] Clicks "Continue"
    ↓
[4] System validates form
    ↓
[5] System checks: h5Verification.enabled === false
    ↓
[6] Saves data to localStorage
    ↓
[7] Moves to Stage 3 (KYC Verification)
    ✅ DONE
```

### **Scenario B: H5 Verification Enabled**
```
User at Stage 2 (Personal Details)
    ↓
[1] Sees default form with configurable fields
    ↓
[2] Fills in:
    - First Name
    - Last Name
    - Gender
    - Date of Birth
    - Country of Residence
    - Nationality
    ↓
[3] Clicks "Continue"
    ↓
[4] System validates form
    ↓
[5] System checks: h5Verification.enabled === true
    ↓
[6] Saves default form data to localStorage
    ↓
[7] Redirects to H5 page:
    URL: /kyc-individual-personal-info?session=123&returnUrl=/onboarding.html
    ↓
[8] H5 page loads (full page redirect)
    ↓
[9] User fills additional fields in H5 page
    (Custom fields not in default form)
    ↓
[10] User clicks "Submit" on H5 page
    ↓
[11] H5 page saves data
    ↓
[12] H5 page redirects back:
    URL: /onboarding.html?session=123&completed=personalInfo
    ↓
[13] Onboarding.html detects ?completed=personalInfo
    ↓
[14] Marks h5VerificationCompleted = true
    ↓
[15] Moves to Stage 3 (KYC Verification)
    ✅ DONE
```

---

## 💾 Data Flow

### **When Default Form is Submitted**
```javascript
// localStorage structure
{
  "onboardingSession": {
    "currentStage": 2,
    "userData": {
      "personalInfo": {
        // Default form data saved here
        "firstName": "John",
        "lastName": "Doe",
        "gender": "Male",
        "dateOfBirth": "1990-01-01",
        "countryOfResidence": "Malaysia",
        "nationality": "Malaysian",
        
        // Flag to track H5 verification status
        "h5VerificationCompleted": false  // ← Initially false
      }
    }
  }
}
```

### **After H5 Page is Completed**
```javascript
{
  "onboardingSession": {
    "currentStage": 3,  // ← Moved to next stage
    "userData": {
      "personalInfo": {
        // Default form data (preserved)
        "firstName": "John",
        "lastName": "Doe",
        "gender": "Male",
        "dateOfBirth": "1990-01-01",
        "countryOfResidence": "Malaysia",
        "nationality": "Malaysian",
        
        // H5 verification flag updated
        "h5VerificationCompleted": true  // ← Set to true after H5 completion
      },
      "personalInfoCompleted": true  // ← Stage marked as completed
    }
  }
}
```

---

## 🔧 Code Changes

### **Change 1: Remove Bypass Logic** (onboarding.html, Line ~971-982)

**BEFORE:**
```javascript
const h5Verification = personalInfoConfig.h5Verification;
if (h5Verification && h5Verification.enabled) {
    console.log('🔗 Individual Web Setting enabled, loading external form...');
    redirectToExternalPersonalInfo(h5Verification);
    return;  // ← STOPS HERE, bypasses default form
}

// Extract fields array - handle both array and object formats
let personalInfoFields = [];
```

**AFTER:**
```javascript
// Extract fields array - handle both array and object formats
// ✅ Always render default form, no bypass logic
let personalInfoFields = [];
```

---

### **Change 2: Check H5 After Default Form** (onboarding.html, Line ~1746)

**BEFORE:**
```javascript
function completePersonalDetails() {
    const $form = $('#dynamicPersonalInfoForm');
    const formData = {};
    let hasErrors = false;

    // Collect form data
    $form.find('input, select, textarea').each(function() {
        // ... validation ...
    });

    if (hasErrors) return false;

    // Save to session
    window.onboardingFlowClient.userData.personalInfo = formData;
    window.onboardingFlowClient.saveSession();

    console.log('Personal details saved:', formData);
    return true;  // ← Moves to next stage immediately
}
```

**AFTER:**
```javascript
function completePersonalDetails() {
    const client = window.onboardingFlowClient;
    const config = client.config;
    const personalInfoConfig = config?.personalInfoFields || {};

    // Check if we need to redirect to H5 verification page
    const h5Verification = personalInfoConfig.h5Verification;
    const h5Completed = client.userData.personalInfo?.h5VerificationCompleted;

    // ✅ NEW: If H5 enabled and NOT yet completed, redirect
    if (h5Verification && h5Verification.enabled && !h5Completed) {
        console.log('🔗 Default form completed. Redirecting to H5...');

        // Validate and save default form data first
        const $form = $('#dynamicPersonalInfoForm');
        const formData = {};
        let hasErrors = false;

        // ... validation logic ...

        if (hasErrors) return false;

        // Save default form data
        client.userData.personalInfo = formData;
        client.saveSession();

        console.log('✅ Default personal details saved:', formData);
        console.log('➡️ Redirecting to H5:', h5Verification.route);

        // Redirect to external H5 verification page
        redirectToExternalPersonalInfo(h5Verification);
        return false; // ← Don't move to next stage yet
    }

    // If H5 already completed OR not enabled, proceed normally
    // ... rest of validation ...
    return true;
}
```

---

### **Change 3: Update Redirect Function** (onboarding.html, Line ~1498)

**BEFORE:**
```javascript
function redirectToExternalPersonalInfo(h5Config) {
    // ... iframe embedding logic ...
    $('.stage-content').html(`
        <iframe src="${iframeUrl}"></iframe>
    `);
}
```

**AFTER:**
```javascript
function redirectToExternalPersonalInfo(h5Config) {
    let route = h5Config.route || '/kyc-individual-personal-info.html';

    // Ensure route starts with /
    if (!route.startsWith('/') && !route.startsWith('http')) {
        route = '/' + route;
    }

    // Save current session before redirecting
    window.onboardingFlowClient.saveSession();

    console.log('🔗 Redirecting to Individual Web Setting page:', route);

    // ✅ Full page redirect (not iframe)
    const sessionToken = Date.now();
    window.location.href = `${route}?session=${sessionToken}&returnUrl=${encodeURIComponent(window.location.pathname)}`;
}
```

---

### **Change 4: Handle Return from H5 Page** (onboarding.html, Line ~608)

**BEFORE:**
```javascript
if (completedStep === 'personalInfo') {
    console.log('✅ Returned from external personal info page');
    showToast('Personal information saved successfully!', 'success');

    // Load session and move to next stage
    window.onboardingFlowClient.loadSession();
    if (window.onboardingFlowClient.currentStage === 2) {
        window.onboardingFlowClient.userData.personalInfoCompleted = true;
        window.onboardingFlowClient.nextStage();
        window.onboardingFlowClient.saveSession();
    }

    window.history.replaceState({}, document.title, window.location.pathname);
}
```

**AFTER:**
```javascript
if (completedStep === 'personalInfo') {
    console.log('✅ Returned from H5 verification');
    showToast('Individual Web Setting completed!', 'success');

    window.onboardingFlowClient.loadSession();
    if (window.onboardingFlowClient.currentStage === 2) {
        // ✅ Mark H5 verification as completed
        if (!window.onboardingFlowClient.userData.personalInfo) {
            window.onboardingFlowClient.userData.personalInfo = {};
        }
        window.onboardingFlowClient.userData.personalInfo.h5VerificationCompleted = true;

        // Mark stage as completed
        window.onboardingFlowClient.userData.personalInfoCompleted = true;
        window.onboardingFlowClient.nextStage();
        window.onboardingFlowClient.saveSession();
    }

    window.history.replaceState({}, document.title, window.location.pathname);
}
```

---

## 🧪 Testing Steps

### **Test Case 1: H5 Verification Disabled**
1. Navigate to Onboarding Flow Configuration
2. Go to Personal Info Tab
3. ✅ Ensure "Activate" checkbox is **UNCHECKED**
4. Save Configuration
5. Open onboarding.html
6. Complete registration (Stage 1)
7. At Stage 2 (Personal Details):
   - ✅ Default form should appear
   - Fill in all fields
   - Click Continue
   - ✅ Should go directly to Stage 3 (KYC)
   - ✅ Should NOT redirect to H5 page

### **Test Case 2: H5 Verification Enabled**
1. Navigate to Onboarding Flow Configuration
2. Go to Personal Info Tab
3. ✅ CHECK "Activate" checkbox
4. Enter route: `/kyc-individual-personal-info`
5. Save Configuration
6. Open onboarding.html
7. Complete registration (Stage 1)
8. At Stage 2 (Personal Details):
   - ✅ Default form should appear (First Name, Last Name, etc.)
   - Fill in all required fields
   - Click Continue
   - ✅ Should validate and save default form data
   - ✅ Should redirect to `/kyc-individual-personal-info?session=xxx&returnUrl=...`
9. On H5 page:
   - ✅ Should see additional fields
   - Fill in additional information
   - Click Submit
   - ✅ Should redirect back to onboarding.html?completed=personalInfo
10. Back on onboarding.html:
    - ✅ Should show success message
    - ✅ Should automatically move to Stage 3 (KYC)
    - ✅ localStorage should have h5VerificationCompleted: true

### **Test Case 3: Refresh During H5 Page**
1. Follow Test Case 2 steps 1-8
2. On H5 page, press F5 (refresh)
3. ✅ Should still be on H5 page
4. ✅ Session data should be preserved
5. Complete H5 page
6. ✅ Should return to onboarding normally

---

## 🎯 Benefits of Sequential Flow

| Feature | Bypass Logic (OLD) | Sequential Logic (NEW) |
|---------|-------------------|------------------------|
| **Default fields always collected** | ❌ Skipped if H5 enabled | ✅ Always filled first |
| **Data completeness** | ❌ Missing default data | ✅ Both default + H5 data |
| **User experience** | ❌ Confusing (why skip?) | ✅ Clear progression |
| **Backward compatibility** | ❌ Breaking change | ✅ Works with old configs |
| **Debugging** | ❌ Hard to track flow | ✅ Clear sequence |
| **Compliance** | ❌ May miss required fields | ✅ All fields captured |

---

## 📊 Configuration Reference

### **Configuration in pages/onboarding-flow.html**
```javascript
// Personal Info Tab Configuration
{
  fields: [
    { key: 'firstName', label: 'First Name', enabled: true, required: true },
    { key: 'lastName', label: 'Last Name', enabled: true, required: true },
    { key: 'gender', label: 'Gender', enabled: true, required: true },
    // ... more fields
  ],
  h5Verification: {
    enabled: true,           // ← Toggle Sequential flow
    route: '/kyc-individual-personal-info'  // ← H5 page path
  }
}
```

### **What Happens with Different Configurations**

| h5Verification.enabled | Route Set | Behavior |
|------------------------|-----------|----------|
| `false` or missing | N/A | Default form only, move to Stage 3 |
| `true` | Valid path | Default form → H5 page → Stage 3 |
| `true` | Empty/invalid | Default form → Error (validation fails) |

---

## 🔗 Related Files

| File | Purpose | Changes Made |
|------|---------|--------------|
| `onboarding.html` | Main onboarding flow | Remove bypass logic, add sequential checks |
| `kyc-individual-personal-info.html` | H5 verification page | No changes (already has return logic) |
| `pages/onboarding-flow.html` | Configuration UI | No changes (config structure stays same) |

---

## 📝 Summary

**What Changed:**
- ✅ Default form is now ALWAYS rendered first
- ✅ H5 verification is triggered AFTER default form is completed (if enabled)
- ✅ Full page redirect instead of iframe (better UX)
- ✅ Proper state tracking with `h5VerificationCompleted` flag

**What Stayed the Same:**
- ✅ Configuration structure unchanged
- ✅ H5 page return mechanism unchanged
- ✅ Data storage structure compatible

**User Impact:**
- ✅ More intuitive flow (clear progression)
- ✅ Better data completeness (both default + H5 data)
- ✅ No confusion about missing steps

---

**Status**: ✅ Implementation Complete  
**Version**: 2.0 (Sequential Flow)  
**Last Updated**: 2026-06-06
