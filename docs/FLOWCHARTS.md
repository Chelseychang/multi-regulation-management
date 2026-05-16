# Multi-Regulation Management System - Flow Charts

**Visual Process Documentation**

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [User Flows](#2-user-flows)
3. [Data Flow](#3-data-flow)
4. [Component Interaction](#4-component-interaction)
5. [State Management](#5-state-management)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend SPA"
        UI[User Interface Layer]
        Router[Hash Router]
        Services[Service Layer]
        Storage[Storage Layer]
    end
    
    subgraph "User Interface"
        RegList[Regulation List]
        RegForm[Regulation Form]
        OnbConfig[Onboarding Config]
        KYCConfig[KYC System Config]
        OnbPreview[Onboarding Preview]
    end
    
    subgraph "Services"
        DataSvc[DataService]
        OnbSvc[OnboardingService]
        KYCSvc[KYCSystemService]
        FlowClient[OnboardingFlowClient]
    end
    
    subgraph "Storage"
        LS[localStorage]
        SS[sessionStorage]
    end
    
    UI --> Router
    Router --> RegList
    Router --> RegForm
    Router --> OnbConfig
    Router --> KYCConfig
    Router --> OnbPreview
    
    RegList --> DataSvc
    RegForm --> DataSvc
    OnbConfig --> OnbSvc
    KYCConfig --> KYCSvc
    OnbPreview --> FlowClient
    
    DataSvc --> LS
    OnbSvc --> LS
    KYCSvc --> LS
    FlowClient --> SS
```

### 1.2 Component Hierarchy

```mermaid
graph TD
    A[index.html] --> B[Navigation Sidebar]
    A --> C[Main Content Area]
    
    B --> B1[Regulation Management]
    B --> B2[Onboarding Flow Config]
    B --> B3[KYC System Config]
    
    C --> D[Router Outlet]
    
    D --> E1[regulation-list-new.html]
    D --> E2[onboarding-flow.html]
    D --> E3[kyc-system-config.html]
    D --> E4[onboarding.html]
    
    E1 --> F1[DataTables Component]
    E1 --> F2[Action Buttons]
    
    E2 --> G1[Tab Navigation]
    E2 --> G2[Configuration Forms]
    E2 --> G3[TagInputManager Components]
    
    E4 --> H1[Stage Stepper]
    E4 --> H2[Dynamic Form Renderer]
    E4 --> H3[Progress Indicator]
```

---

## 2. User Flows

### 2.1 Create Regulation Flow

```mermaid
flowchart TD
    Start([User clicks Create Regulation]) --> Load[Load regulation-form page]
    Load --> Form[Display empty form]
    Form --> FillBrand[User selects Brand]
    FillBrand --> FillReg[User selects Regulation Type]
    
    FillReg --> CheckReg{Is V1 or V2?}
    CheckReg -->|Yes| ShowLicense[Show License field]
    CheckReg -->|No| HideLicense[Hide License field]
    
    ShowLicense --> FillLicense[User enters License]
    HideLicense --> AutoCode[Auto-generate Code]
    FillLicense --> GenCode[Generate Code from Reg+License]
    
    GenCode --> FillDesc[User enters Description]
    AutoCode --> FillDesc
    
    FillDesc --> FillRegType[User selects Registration Types]
    FillRegType --> ConfigValues[Configure Registration Values]
    
    ConfigValues --> CheckDomain{Domain selected?}
    CheckDomain -->|Yes| FillDomain[Select domain whitelist]
    CheckDomain -->|No| CheckNat{Nationality selected?}
    
    FillDomain --> CheckNat
    CheckNat -->|Yes| ConfigNat[Configure Nationality white/blacklist]
    CheckNat -->|No| CheckCountry{Country selected?}
    
    ConfigNat --> CheckCountry
    CheckCountry -->|Yes| ConfigCountry[Configure Country white/blacklist]
    CheckCountry -->|No| Submit[User clicks Save]
    
    ConfigCountry --> Submit
    Submit --> Validate{Validation}
    
    Validate -->|Failed| ShowError[Display error messages]
    ShowError --> Form
    
    Validate -->|Success| SaveData[Save to localStorage]
    SaveData --> ShowToast[Show success toast]
    ShowToast --> RedirectList[Redirect to Regulation List]
    RedirectList --> End([End])
```

### 2.2 Configure Onboarding Flow

```mermaid
flowchart TD
    Start([Navigate to Onboarding Config]) --> SelectBrand[Select Brand dropdown]
    SelectBrand --> LoadLicense[Load available Licenses]
    LoadLicense --> SelectLicense[Select License dropdown]
    
    SelectLicense --> CheckExist{Config exists?}
    CheckExist -->|Yes| LoadConfig[Load saved configuration]
    CheckExist -->|No| LoadDefault[Load default configuration]
    
    LoadConfig --> ShowTabs[Display configuration tabs]
    LoadDefault --> ShowTabs
    
    ShowTabs --> TabChoice{User selects tab}
    
    TabChoice -->|Registration| RegTab[Registration Fields Config]
    TabChoice -->|Personal Info| PersonalTab[Personal Info Config]
    TabChoice -->|OTP| OTPTab[OTP Verification Config]
    TabChoice -->|KYC| KYCTab[KYC Provider Config]
    TabChoice -->|Trading| TradingTab[Trading Account Config]
    TabChoice -->|Agreement| AgreementTab[Agreement Config]
    TabChoice -->|Questionnaire| QuestionnaireTab[Questionnaire Config]
    
    RegTab --> Modify[User modifies configuration]
    PersonalTab --> Modify
    OTPTab --> Modify
    KYCTab --> Modify
    TradingTab --> Modify
    AgreementTab --> Modify
    QuestionnaireTab --> Modify
    
    Modify --> ClickSave[User clicks Save]
    ClickSave --> ValidateAll{Validate all sections}
    
    ValidateAll -->|Failed| ShowErrors[Show validation errors]
    ShowErrors --> ShowTabs
    
    ValidateAll -->|Success| SaveAll[Save to localStorage]
    SaveAll --> SuccessToast[Show success toast]
    SuccessToast --> EnablePreview[Enable Preview Onboarding button]
    EnablePreview --> End([End])
```

### 2.3 User Onboarding Journey (onboarding.html)

```mermaid
flowchart TD
    Start([User opens onboarding.html]) --> Stage1[Stage 1: Registration]
    
    Stage1 --> FillEmail[Fill Email, Password]
    FillEmail --> FillCountry[Select Country, Nationality]
    FillCountry --> FillDomain[Select Domain]
    
    FillDomain --> SubmitReg[Submit Registration]
    SubmitReg --> MatchLicense[System matches Brand+License]
    
    MatchLicense --> CheckMatch{Match found?}
    CheckMatch -->|No| ShowError1[Show error: No regulation found]
    CheckMatch -->|Yes| LoadConfig[Load Onboarding Config]
    
    ShowError1 --> Stage1
    
    LoadConfig --> Stage2[Stage 2: Personal Info]
    Stage2 --> FillPersonal[Fill dynamic fields]
    FillPersonal --> SendOTP[System sends OTP]
    SendOTP --> Stage3[Stage 3: OTP Verification]
    
    Stage3 --> EnterOTP[Enter OTP code]
    EnterOTP --> VerifyOTP{OTP valid?}
    VerifyOTP -->|No| ShowError2[Show error: Invalid OTP]
    VerifyOTP -->|Yes| Stage4[Stage 4: Identity Verification]
    
    ShowError2 --> Stage3
    
    Stage4 --> CheckKYCEnabled{KYC enabled?}
    CheckKYCEnabled -->|No| Stage5[Stage 5: Trading Account]
    CheckKYCEnabled -->|Yes| SelectPOI[Upload POI document]
    
    SelectPOI --> SelectPOA[Upload POA document]
    SelectPOA --> ValidateAddr[Validate POA address]
    ValidateAddr --> SubmitKYC[Submit to KYC provider]
    
    SubmitKYC --> Stage5
    Stage5 --> SelectAccount[Select MT4/MT5]
    SelectAccount --> CreateAccount[Create trading account]
    
    CreateAccount --> Stage6[Stage 6: Agreement]
    Stage6 --> ShowAgreements[Display agreements]
    ShowAgreements --> CheckMethod{Selection method?}
    
    CheckMethod -->|All| CheckAll[User must agree to all]
    CheckMethod -->|Any| CheckAny[User must agree to at least one]
    
    CheckAll --> AgreeAll{All agreed?}
    CheckAny --> AgreeAny{Any agreed?}
    
    AgreeAll -->|No| ShowError3[Show error: Must agree to all]
    AgreeAll -->|Yes| Stage7[Stage 7: Questionnaire]
    
    AgreeAny -->|No| ShowError4[Show error: Must agree to at least one]
    AgreeAny -->|Yes| Stage7
    
    ShowError3 --> Stage6
    ShowError4 --> Stage6
    
    Stage7 --> CheckQEnabled{Questionnaire enabled?}
    CheckQEnabled -->|No| Complete[Stage 8: Complete]
    CheckQEnabled -->|Yes| ShowQuestions[Display questions]
    
    ShowQuestions --> AnswerQ[User answers questions]
    AnswerQ --> CheckPopup{Option has popup?}
    CheckPopup -->|Yes| ShowPopup[Display popup dialog]
    CheckPopup -->|No| NextQuestion[Continue to next question]
    
    ShowPopup --> UserConfirm{User confirms?}
    UserConfirm -->|No| AnswerQ
    UserConfirm -->|Yes| NextQuestion
    
    NextQuestion --> AllAnswered{All answered?}
    AllAnswered -->|No| AnswerQ
    AllAnswered -->|Yes| CalcScore[Calculate total score]
    
    CalcScore --> CheckScore{Score >= pass criteria?}
    CheckScore -->|No| ShowFailure[Show failure message]
    CheckScore -->|Yes| Complete
    
    ShowFailure --> Stage7
    
    Complete --> ShowSuccess[Display completion screen]
    ShowSuccess --> End([End])
```

---

## 3. Data Flow

### 3.1 Regulation Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Layer
    participant DS as DataService
    participant LS as localStorage
    participant DT as DataTables
    
    U->>UI: Click Save Regulation
    UI->>UI: Validate form data
    
    alt Validation Failed
        UI-->>U: Show error messages
    else Validation Success
        UI->>DS: saveRegulation(data)
        DS->>DS: Generate timestamp ID
        DS->>DS: Add audit fields
        DS->>LS: localStorage.setItem('regulations')
        LS-->>DS: Success
        DS-->>UI: Return saved regulation
        UI-->>U: Show success toast
        UI->>UI: Redirect to list page
        UI->>DS: getAllRegulations()
        DS->>LS: localStorage.getItem('regulations')
        LS-->>DS: Return regulations array
        DS-->>UI: Return regulations
        UI->>DT: Initialize DataTable
        DT-->>U: Display regulation list
    end
```

### 3.2 Onboarding Configuration Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant Config as Onboarding Config Page
    participant OS as OnboardingService
    participant LS as localStorage
    participant Preview as onboarding.html
    participant FC as OnboardingFlowClient
    
    U->>Config: Select Brand + License
    Config->>OS: getConfig(brand, license)
    OS->>LS: Get 'onboarding_configs'
    LS-->>OS: Return configs object
    OS->>OS: Find config by key 'BRAND_LICENSE'
    
    alt Config exists
        OS-->>Config: Return saved config
    else No config
        OS-->>Config: Return default config
    end
    
    Config-->>U: Display configuration form
    
    U->>Config: Modify configuration
    U->>Config: Click Save
    Config->>Config: Validate all sections
    
    alt Validation success
        Config->>OS: saveConfig(brand, license, config)
        OS->>LS: Save to 'onboarding_configs'
        LS-->>OS: Success
        OS-->>Config: Saved successfully
        Config-->>U: Show success toast
    end
    
    U->>Preview: Click Preview Onboarding
    Preview->>FC: Initialize client
    FC->>OS: getConfig(brand, license)
    OS->>LS: Get 'onboarding_configs'
    LS-->>OS: Return configs
    OS-->>FC: Return config
    FC->>Preview: Render stage with config
    Preview-->>U: Display onboarding flow
```

### 3.3 License Matching Flow

```mermaid
sequenceDiagram
    participant U as User
    participant Reg as Registration Form
    participant FC as OnboardingFlowClient
    participant DS as DataService
    participant LS as localStorage
    
    U->>Reg: Fill registration form
    U->>Reg: Submit registration
    Reg->>FC: determineLicense(country, nationality, domain)
    
    FC->>DS: getActiveRegulations()
    DS->>LS: Get 'regulations'
    LS-->>DS: Return all regulations
    DS->>DS: Filter by enabled = true
    DS-->>FC: Return active regulations
    
    FC->>FC: Start matching algorithm
    
    loop For each regulation
        FC->>FC: Check domain match
        
        alt Domain matches
            FC->>FC: Score +10
            FC->>FC: Check country whitelist
            
            alt Country in whitelist
                FC->>FC: Score +5
                FC->>FC: Check nationality whitelist
                
                alt Nationality in whitelist
                    FC->>FC: Score +5
                    FC->>FC: Add to matches array
                end
            end
        end
    end
    
    FC->>FC: Sort matches by score (highest first)
    
    alt Matches found
        FC->>FC: Take best match
        FC->>FC: Extract brand + license
        FC-->>Reg: Return match result
        Reg->>Reg: Set brand and license
        Reg->>FC: loadConfig()
        FC-->>Reg: Return onboarding config
        Reg-->>U: Show success, proceed to next stage
    else No matches
        FC-->>Reg: Return error: No regulation found
        Reg-->>U: Show error message
    end
```

---

## 4. Component Interaction

### 4.1 TagInputManager Component

```mermaid
stateDiagram-v2
    [*] --> Initialized: new TagInputManager(containerId, options)
    Initialized --> Ready: HTML rendered
    
    Ready --> Focused: User clicks input
    Focused --> Searching: User types text
    Searching --> FilteredResults: Filter options by query
    FilteredResults --> ShowDropdown: Display filtered list
    
    ShowDropdown --> OptionClicked: User clicks option
    OptionClicked --> AddTag: Add tag to container
    AddTag --> UpdateHidden: Update hidden input value
    UpdateHidden --> Ready: Close dropdown
    
    Ready --> TagRemoved: User clicks tag × button
    TagRemoved --> RemoveTag: Remove from selected items
    RemoveTag --> UpdateHidden2: Update hidden input
    UpdateHidden2 --> Ready
    
    Ready --> SetValues: External call to setCountries()
    SetValues --> RenderTags: Render all tags
    RenderTags --> Ready
    
    Ready --> GetValues: External call to getSelectedItems()
    GetValues --> Ready: Return array of selected items
```

### 4.2 DataTables Integration

```mermaid
flowchart TB
    Start[Page Load] --> LoadData[Load regulations from localStorage]
    LoadData --> InitDT[Initialize DataTables]
    
    InitDT --> ConfigColumns[Configure 11 columns]
    ConfigColumns --> ConfigSearch[Configure search functionality]
    ConfigSearch --> ConfigSort[Configure sorting]
    ConfigSort --> ConfigPage[Configure pagination]
    ConfigPage --> RenderTable[Render table with data]
    
    RenderTable --> UserInteract{User interaction}
    
    UserInteract -->|Search| FilterData[Filter data by search query]
    UserInteract -->|Sort| SortData[Sort data by column]
    UserInteract -->|Page| ChangePage[Change page]
    UserInteract -->|Filter| FilterColumn[Apply column filter]
    
    FilterData --> UpdateDisplay[Update table display]
    SortData --> UpdateDisplay
    ChangePage --> UpdateDisplay
    FilterColumn --> UpdateDisplay
    
    UpdateDisplay --> UserInteract
    
    UserInteract -->|Click Action| ActionButton{Which action?}
    ActionButton -->|View| ShowModal[Display view modal]
    ActionButton -->|Edit| RedirectEdit[Redirect to edit form]
    ActionButton -->|Toggle| ToggleStatus[Toggle enable/disable]
    ActionButton -->|Delete| ConfirmDelete[Show confirmation dialog]
    
    ToggleStatus --> UpdateLS[Update localStorage]
    ConfirmDelete --> DeleteLS[Delete from localStorage]
    
    UpdateLS --> ReloadTable[Reload table data]
    DeleteLS --> ReloadTable
    
    ReloadTable --> RenderTable
```

---

## 5. State Management

### 5.1 Application State

```mermaid
graph TB
    subgraph "localStorage (Persistent)"
        RegData[regulations: Array]
        OnbConfig[onboarding_configs: Object]
        KYCData[kyc_systems: Array]
    end
    
    subgraph "sessionStorage (Session)"
        OnbSession[onboarding_session: Object]
        CurrentStage[currentStage: Number]
        UserData[userData: Object]
    end
    
    subgraph "Global Variables (Runtime)"
        CurrentBrand[currentBrand: String]
        CurrentLicense[currentLicense: String]
        EditMode[isEditMode: Boolean]
        FormState[formState: Object]
    end
    
    RegData --> DataService
    OnbConfig --> OnboardingService
    KYCData --> KYCSystemService
    
    OnbSession --> OnboardingFlowClient
    CurrentStage --> OnboardingFlowClient
    UserData --> OnboardingFlowClient
    
    DataService --> UI1[Regulation Pages]
    OnboardingService --> UI2[Config Pages]
    KYCSystemService --> UI3[KYC Pages]
    OnboardingFlowClient --> UI4[onboarding.html]
```

### 5.2 Onboarding State Machine

```mermaid
stateDiagram-v2
    [*] --> Registration
    
    Registration --> PersonalInfo: Form valid + License matched
    Registration --> Registration: Validation error
    
    PersonalInfo --> OTPVerification: Personal info saved + OTP sent
    PersonalInfo --> PersonalInfo: Validation error
    
    OTPVerification --> IdentityVerification: OTP verified
    OTPVerification --> OTPVerification: Invalid OTP
    
    IdentityVerification --> TradingAccount: KYC submitted
    IdentityVerification --> IdentityVerification: Document upload failed
    
    TradingAccount --> Agreement: Account created
    TradingAccount --> TradingAccount: Account creation failed
    
    Agreement --> Questionnaire: All agreements signed
    Agreement --> Agreement: Agreement validation failed
    
    Questionnaire --> Complete: Score passed
    Questionnaire --> Questionnaire: Score failed / incomplete
    
    Complete --> [*]
    
    note right of Registration
        userData.registrationComplete = false
        currentStage = 1
    end note
    
    note right of Complete
        userData.onboardingComplete = true
        currentStage = 'complete'
    end note
```

### 5.3 Configuration State Lifecycle

```mermaid
sequenceDiagram
    participant Page as Config Page
    participant State as Local State
    participant Service as OnboardingService
    participant Storage as localStorage
    
    Note over Page,Storage: LOAD PHASE
    
    Page->>Page: User selects Brand + License
    Page->>Service: getConfig(brand, license)
    Service->>Storage: getItem('onboarding_configs')
    Storage-->>Service: Return configs object
    Service->>Service: Find by key 'BRAND_LICENSE'
    Service-->>Page: Return config or default
    Page->>State: Store in component state
    Page->>Page: Render form fields with values
    
    Note over Page,Storage: EDIT PHASE
    
    loop User edits fields
        Page->>Page: User changes field value
        Page->>State: Update local state
        Page->>Page: Re-render affected UI
    end
    
    Note over Page,Storage: SAVE PHASE
    
    Page->>Page: User clicks Save
    Page->>Page: Validate all sections
    
    alt Validation success
        Page->>State: Collect all form values
        State-->>Page: Return complete config object
        Page->>Service: saveConfig(brand, license, config)
        Service->>Storage: Update 'onboarding_configs'
        Storage-->>Service: Success
        Service-->>Page: Saved successfully
        Page->>Page: Show success toast
        Page->>Page: Mark as saved (disable Save button)
    else Validation failed
        Page->>Page: Show error messages
        Page->>Page: Focus first error field
    end
```

---

## 6. Error Handling Flow

### 6.1 Form Validation Error Handling

```mermaid
flowchart TD
    Start[User submits form] --> Collect[Collect form data]
    Collect --> ValidateStep[Start validation]
    
    ValidateStep --> CheckReq{All required fields filled?}
    CheckReq -->|No| AddError1[Add to errors array]
    CheckReq -->|Yes| CheckFormat{All formats valid?}
    
    AddError1 --> CheckFormat
    CheckFormat -->|No| AddError2[Add format errors]
    CheckFormat -->|Yes| CheckLogic{Business logic valid?}
    
    AddError2 --> CheckLogic
    CheckLogic -->|No| AddError3[Add logic errors]
    CheckLogic -->|Yes| HasErrors{errors.length > 0?}
    
    AddError3 --> HasErrors
    
    HasErrors -->|Yes| DisplayErrors[Display all error messages]
    DisplayErrors --> FocusFirst[Focus first error field]
    FocusFirst --> HighlightFields[Highlight invalid fields]
    HighlightFields --> ShowToast[Show error toast]
    ShowToast --> End1([User corrects errors])
    
    HasErrors -->|No| SaveData[Save data]
    SaveData --> SuccessToast[Show success toast]
    SuccessToast --> End2([Continue workflow])
```

### 6.2 Data Loading Error Handling

```mermaid
flowchart TD
    Start[Attempt to load data] --> TryLoad{Try localStorage.getItem}
    
    TryLoad -->|Success| ParseJSON{Parse JSON}
    TryLoad -->|Error| CatchError1[Catch localStorage error]
    
    ParseJSON -->|Success| ValidateSchema{Validate data schema}
    ParseJSON -->|Error| CatchError2[Catch JSON parse error]
    
    ValidateSchema -->|Valid| ReturnData[Return data]
    ValidateSchema -->|Invalid| UseDefault[Use default data]
    
    CatchError1 --> LogError1[Log error to console]
    CatchError2 --> LogError2[Log error to console]
    
    LogError1 --> ShowWarning[Show warning toast]
    LogError2 --> ShowWarning
    
    ShowWarning --> UseDefault
    UseDefault --> ReturnDefault[Return default configuration]
    
    ReturnData --> End1([Data loaded successfully])
    ReturnDefault --> End2([Fallback to defaults])
```

---

## 7. Performance Optimization

### 7.1 Data Loading Strategy

```mermaid
flowchart LR
    subgraph "Initial Load"
        A[Page Load] --> B[Load Critical Data]
        B --> C[Render UI]
        C --> D[Display to User]
    end
    
    subgraph "Lazy Loading"
        D --> E{User interaction}
        E -->|Navigate to tab| F[Load tab data]
        E -->|Open modal| G[Load modal content]
        E -->|Search/Filter| H[Process data]
    end
    
    subgraph "Caching"
        F --> I[Check cache]
        I -->|Hit| J[Return cached]
        I -->|Miss| K[Fetch and cache]
    end
    
    subgraph "Debouncing"
        H --> L[Start debounce timer]
        L --> M{Timer expired?}
        M -->|Yes| N[Execute search]
        M -->|No| O[Cancel previous]
        O --> L
    end
```

---

## 8. Deployment Flow

### 8.1 CI/CD Pipeline

```mermaid
flowchart TD
    Start[Developer commits code] --> Push[Push to GitHub]
    Push --> Webhook[GitHub webhook triggers]
    Webhook --> Vercel[Vercel receives event]
    
    Vercel --> Build[Start build process]
    Build --> Install[npm install dependencies]
    Install --> Lint[Run linting]
    
    Lint --> LintCheck{Lint passed?}
    LintCheck -->|No| BuildFail[Build failed]
    LintCheck -->|Yes| Bundle[Bundle assets]
    
    Bundle --> Optimize[Optimize images/CSS/JS]
    Optimize --> Deploy[Deploy to CDN]
    
    Deploy --> Preview{Is main branch?}
    Preview -->|No| CreatePreview[Create preview URL]
    Preview -->|Yes| Production[Deploy to production]
    
    CreatePreview --> Notify1[Notify via GitHub comment]
    Production --> Invalidate[Invalidate CDN cache]
    Invalidate --> Notify2[Notify deployment success]
    
    BuildFail --> NotifyFail[Notify build failure]
    
    Notify1 --> End1([Preview ready])
    Notify2 --> End2([Production deployed])
    NotifyFail --> End3([Fix and retry])
```

---

**END OF FLOWCHARTS DOCUMENT**
