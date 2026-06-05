# Quick Reference: KYC Level Organization

**Updated**: 2026-06-05

---

## 🎯 Current Structure

### Main Flow Levels (5 total)
| Level Key | Level Name | Description |
|-----------|------------|-------------|
| level1 | Personal Details Verification | Basic personal info validation |
| level2 | Identity Verification | POI document upload & validation |
| level3 | Residency Address Verification | POA document upload & validation |
| **level13** | **Video Verification** | Live video KYC verification ✅ |
| **level14** | **Questionnaire Verification** | Risk assessment questionnaire ✅ |

### Independent Flow Levels (2 total)
| Level Key | Level Name | Description |
|-----------|------------|-------------|
| level11 | Bank Transfer Verification | Proof of bank account ownership |
| level12 | Face Verification | Biometric face matching |

---

## 📝 Configuration

### Adding Main Flow Level
Navigate to: **KYC Management > System Configuration**

1. Edit KYC System
2. Click "Add Main Flow Level"
3. Select from dropdown:
   - Personal Details Verification
   - Identity Verification
   - Residency Address Verification
   - **Video Verification** ← New here
   - **Questionnaire Verification** ← New here

### Adding Independent Flow Level
1. Edit KYC System
2. Click "Add Independent Flow Level"
3. Select from dropdown:
   - Bank Transfer Verification
   - Face Verification

---

## 🔑 Key Points

✅ **Video Verification** is now part of **Main Flow** (was Independent)  
✅ **Questionnaire Verification** is now part of **Main Flow** (was Independent)  
✅ Level keys (level13, level14) remain unchanged for data compatibility  
✅ No data migration required  
✅ Fully backward compatible

---

## 📂 Files Modified

1. `pages/kyc-system-config.html` (Lines 786-798) - **KYC System Configuration dropdown options**
2. `pages/onboarding-flow.html` (Lines 3815-3867, 4162-4172) - **Onboarding Flow configuration logic**

## 📖 Full Documentation

- [CHANGELOG_VIDEO_QUESTIONNAIRE_MOVE.md](CHANGELOG_VIDEO_QUESTIONNAIRE_MOVE.md) - Detailed change log
- [docs/KYC_LEVEL_REORGANIZATION.md](docs/KYC_LEVEL_REORGANIZATION.md) - Visual guide & rationale
- [docs/PRD.md](docs/PRD.md) - Product Requirements Document

---

**Quick Help**: If dropdown options don't reflect changes, clear browser cache and reload page.
