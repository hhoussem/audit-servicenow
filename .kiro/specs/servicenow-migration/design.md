# Design Document: OPSYS Audit ServiceNow Migration

## Overview

This design document describes the architecture and implementation approach for migrating the OPSYS Audit Management System from its current Java/Oracle/WebLogic stack to ServiceNow. The migration will leverage ServiceNow's platform capabilities including custom tables, Flow Designer for workflows, Business Rules for validation, and Integration Hub for external system connectivity.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ServiceNow Platform                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        Service Portal / Workspace                        ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      ││
│  │  │  Audit   │ │ Results  │ │Checklist │ │ Workflow │ │  Admin   │      ││
│  │  │  List    │ │  Entry   │ │  Entry   │ │  Tasks   │ │  Portal  │      ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         Business Logic Layer                             ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   ││
│  │  │Script Includes│ │Business Rules│ │ Flow Designer│ │Decision Tables│   ││
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           Data Layer                                     ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      ││
│  │  │x_audit   │ │x_audit_  │ │x_audit_  │ │x_audit_  │ │x_audit_  │      ││
│  │  │_audit    │ │result    │ │checklist │ │template  │ │ref_data  │      ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        Integration Layer                                 ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      ││
│  │  │  CRIS    │ │  SUMMA   │ │   HRS    │ │  ECAS    │ │  LDAP    │      ││
│  │  │ Spoke    │ │  Spoke   │ │  Spoke   │ │   SSO    │ │  Import  │      ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
              ┌──────────┐     ┌──────────┐     ┌──────────┐
              │   CRIS   │     │  SUMMA   │     │   HRS    │
              │  (REST)  │     │  (REST)  │     │  (REST)  │
              └──────────┘     └──────────┘     └──────────┘
```

### Application Scope

The application will be developed as a scoped application with the prefix `x_ec_audit` to ensure proper namespace isolation and maintainability.

### Table Naming Convention

To preserve compatibility with the original Oracle data model and facilitate data migration, tables will use the original Oracle table names with the ServiceNow scope prefix:

| Oracle Table | ServiceNow Table |
|--------------|------------------|
| T_AUDITS | x_ec_audit_t_audits |
| T_AUDIT_RESULTS | x_ec_audit_t_audit_results |
| T_AUDIT_RESULT_AMOUNTS | x_ec_audit_t_audit_result_amounts |
| T_AUDIT_RESULT_FINDINGS | x_ec_audit_t_audit_result_findings |
| T_AUDIT_RESULT_PILLARS | x_ec_audit_t_audit_result_pillars |
| T_AUDIT_CHECKLISTS | x_ec_audit_t_audit_checklists |
| T_AUDIT_CHECKLIST_MASTERS | x_ec_audit_t_audit_checklist_masters |
| T_AUDIT_CHECKLIST_DETAILS | x_ec_audit_t_audit_checklist_details |
| T_PERSON_IN_CHARGES | x_ec_audit_t_person_in_charges |
| T_VISAS | x_ec_audit_t_visas |
| T_DOCUMENTS | x_ec_audit_t_documents |
| T_AUDIT_NON_FINANCIAL_ACTIONS | x_ec_audit_t_audit_non_financial_actions |
| T_AUDIT_RECOVERY_ACTIONS | x_ec_audit_t_audit_recovery_actions |
| T_AUDIT_VALIDATION_MSGS | x_ec_audit_t_audit_validation_msgs |
| T_AUDITED_CONTRACT_LINKS | x_ec_audit_t_audited_contract_links |
| T_CREF_* (reference tables) | x_ec_audit_t_cref_* |

Column names also preserve the original Oracle naming convention (e.g., `audi_audit_nsq`, `audi_audit_title_lib`, `caut_nsq`).

**Note:** The tables described below use simplified names for readability. Refer to the implementation guides for exact Oracle-compatible column names.


## Components and Interfaces

### Core Tables

#### x_ec_audit_audit (Main Audit Table)
| Field | Type | Description |
|-------|------|-------------|
| number | String | Auto-generated audit number (unique) |
| title | String | Audit title |
| year | Integer | Audit year |
| plan_year | Integer | Plan year |
| category | Reference | PLANNED/UNPLANNED |
| type | Reference | Audit type reference |
| timing | Reference | EX_ANTE/EX_POST/INTERIM |
| status | Reference | PROVISIONAL/ONGOING/CLOSED/CANCELLED |
| reason | Reference | Audit reason |
| delegation | Reference | Delegation in charge |
| unit | Reference | Unit in charge |
| directorate | Reference | Directorate in charge |
| contract_reference | String | CRIS contract ID |
| contract_budget | Currency | Contract budget amount |
| actual_cost | Currency | Actual cost amount |
| period_start | Date | Audit period start |
| period_end | Date | Audit period end |
| request_for_service_date | Date | RFS date |
| signature_order_date | Date | Order signature date |
| letter_date | Date | Notification letter date |
| field_work_start | Date | Field work start date |
| field_work_end | Date | Field work end date |
| draft_report_date | Date | Draft report receipt date |
| pre_final_report_date | Date | Pre-final report date |
| final_report_date | Date | Final report date |
| current_workflow_step | Reference | Current visa step |
| workflow_context | String | Workflow context ID |
| cancellation_reason | Reference | Cancellation reason |
| cancellation_comment | String | Cancellation comment |
| migrated | Boolean | Migration flag |
| comments | String | General comments |

#### x_ec_audit_result (Audit Results)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| financial_opinion | Choice | UNQUALIFIED/QUALIFIED/ADVERSE/DISCLAIMER |
| system_opinion | Choice | System audit opinion |
| system_opinion_type | Reference | System opinion type |
| opinion_comment | String | Opinion comment |
| additional_objectives | Boolean | Has additional objectives |
| objectives_achieved | Boolean | Objectives achieved |
| objectives_comment | String | Objectives comment |

#### x_ec_audit_result_amount (Financial Results)
| Field | Type | Description |
|-------|------|-------------|
| audit_result | Reference | Parent result |
| currency_used | Reference | Currency used |
| currency_recovery | Reference | Recovery currency |
| exchange_rate | Decimal | Exchange rate |
| exchange_rate_month | String | Rate month |
| exchange_rate_source | Reference | Rate source |
| total_expenses | Currency | Total expenses |
| ineligible_expenses | Currency | Ineligible amount |
| questionable_expenses | Currency | Questionable amount |
| ineligible_decision | Currency | Decision ineligible |
| amount_to_recover_02 | Currency | Recovery amount 02 |
| amount_to_recover_04 | Currency | Recovery amount 04 |
| report_comment | String | Report comment |
| decision_comment | String | Decision comment |


#### x_ec_audit_finding (Audit Findings)
| Field | Type | Description |
|-------|------|-------------|
| audit_result | Reference | Parent result |
| finding_detail | Reference | Finding template detail |
| ineligible_count | Integer | Ineligible count |
| questionable_count | Integer | Questionable count |
| ineligible_amount | Currency | Ineligible amount |
| questionable_amount | Currency | Questionable amount |
| priority_1 | Integer | Priority 1 count |
| priority_2 | Integer | Priority 2 count |
| priority_3 | Integer | Priority 3 count |

#### x_ec_audit_pillar_result (Pillar Assessments)
| Field | Type | Description |
|-------|------|-------------|
| audit_result | Reference | Parent result |
| pillar_detail | Reference | Pillar template detail |
| analysis | Boolean | Part of analysis |
| conclusion | Boolean | Concluded |
| comment | String | Assessment comment |

#### x_ec_audit_checklist (Checklist Responses)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| checklist_detail | Reference | Checklist template detail |
| check_value | Choice | YES/NO/N_A |
| applicable | Boolean | Is applicable |
| comment | String | Check comment |

#### x_ec_audit_person_in_charge (Role Assignments)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| user | Reference | sys_user reference |
| role | Reference | Audit role |
| active | Boolean | Currently active |

#### x_ec_audit_action_plan (Non-Financial Actions)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| action_description | String | Action description |
| realized | Boolean | Action completed |
| comment | String | Action comment |

#### x_ec_audit_recovery_action (Financial Recovery)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| contract_link | Reference | Contract link |
| amount_to_recover | Currency | Recovery amount |
| recovery_order_ref | String | Recovery order reference |
| credit_note_ref | String | Credit note reference |
| invoice_ref | String | Invoice reference |

#### x_ec_audit_document (Document References)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| document_type | Reference | Document type |
| hrs_reference | String | HRS document ID |
| title | String | Document title |
| upload_date | Date/Time | Upload timestamp |
| uploaded_by | Reference | Uploading user |

#### x_ec_audit_visa (Approval Records)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| step | Reference | Visa step |
| decision | Choice | ACCEPT/REJECT/SEND_BACK |
| user | Reference | Approving user |
| timestamp | Date/Time | Decision timestamp |
| signature_id | String | ECAS signature ID |
| comment | String | Decision comment |

#### x_ec_audit_validation_message (Validation Messages)
| Field | Type | Description |
|-------|------|-------------|
| audit | Reference | Parent audit |
| code | String | Message code |
| level | Choice | ERROR/WARNING/INFO/SUCCESS |
| type | String | Validation scope |
| description | String | Message description |
| modified_date | Date/Time | Last modified |
| modified_by | Reference | Modified by user |


### Template Tables

#### x_ec_audit_checklist_template (Checklist Templates)
| Field | Type | Description |
|-------|------|-------------|
| visa_step | Reference | Applicable visa step |
| audit_type | Reference | Applicable audit type |
| start_date | Date | Validity start date |
| active | Boolean | Currently active |

#### x_ec_audit_checklist_template_detail (Checklist Items)
| Field | Type | Description |
|-------|------|-------------|
| template | Reference | Parent template |
| check_number | Integer | Check sequence |
| text_en | String | English description |
| text_fr | String | French description |

#### x_ec_audit_finding_template (Finding Templates)
| Field | Type | Description |
|-------|------|-------------|
| finding_group | Reference | Finding group |
| start_date | Date | Validity start date |
| active | Boolean | Currently active |

#### x_ec_audit_finding_template_detail (Finding Items)
| Field | Type | Description |
|-------|------|-------------|
| template | Reference | Parent template |
| finding_number | Integer | Finding sequence |
| group_code | String | Group code |
| text_en | String | English description |
| text_fr | String | French description |

#### x_ec_audit_pillar_template (Pillar Templates)
| Field | Type | Description |
|-------|------|-------------|
| start_date | Date | Validity start date |
| active | Boolean | Currently active |

#### x_ec_audit_pillar_template_detail (Pillar Items)
| Field | Type | Description |
|-------|------|-------------|
| template | Reference | Parent template |
| pillar_number | Integer | Pillar sequence |
| title_en | String | English title |
| title_fr | String | French title |
| text_en | String | English description |
| text_fr | String | French description |

### Reference Data Tables

#### x_ec_audit_ref_audit_type
#### x_ec_audit_ref_audit_status
#### x_ec_audit_ref_audit_reason
#### x_ec_audit_ref_audit_timing
#### x_ec_audit_ref_audit_role
#### x_ec_audit_ref_cancel_reason
#### x_ec_audit_ref_finding_group
#### x_ec_audit_ref_check_group
#### x_ec_audit_ref_document_type
#### x_ec_audit_ref_visa_step
#### x_ec_audit_ref_currency
#### x_ec_audit_ref_exchange_rate_source
#### x_ec_audit_ref_delegation
#### x_ec_audit_ref_directorate
#### x_ec_audit_ref_unit

All reference tables follow the same structure:
| Field | Type | Description |
|-------|------|-------------|
| code | String | Unique code |
| label_en | String | English label |
| label_fr | String | French label |
| begin_date | Date | Validity start |
| end_date | Date | Validity end |
| active | Boolean | Currently valid |


### Script Includes (Business Logic)

#### AuditService
Primary service class for audit operations.

```javascript
var AuditService = Class.create();
AuditService.prototype = {
    initialize: function() {
        this.validationService = new AuditValidationService();
        this.workflowService = new AuditWorkflowService();
    },
    
    createAudit: function(generalInfo) {
        // Generate unique audit number
        // Set default values (PROVISIONAL status, current year)
        // Create audit record
        // Initialize workflow
        // Return audit sys_id
    },
    
    cancelAudit: function(auditNumber, cancelInfo) {
        // Validate cancellation is allowed
        // Set cancellation reason and comment
        // Update status to CANCELLED
        // Terminate workflow
    },
    
    deleteAudit: function(auditNumber) {
        // Verify status is PROVISIONAL
        // Delete related records
        // Delete audit record
    },
    
    reopenAudit: function(auditNumber) {
        // Verify user has REOPEN permission
        // Restore previous active status
        // Restart workflow
    },
    
    type: 'AuditService'
};
```

#### AuditValidationService
Handles business rule validation.

```javascript
var AuditValidationService = Class.create();
AuditValidationService.prototype = {
    initialize: function() {
        this.decisionTableService = new AuditDecisionTableService();
    },
    
    validateAudit: function(auditSysId, scope) {
        // Get audit data
        // Execute decision table rules for scope
        // Return validation messages
    },
    
    validateGeneralInfo: function(auditSysId) {
        return this.validateAudit(auditSysId, 'GENERAL_INFO');
    },
    
    validateLaunchingData: function(auditSysId) {
        return this.validateAudit(auditSysId, 'LAUNCHING_DATA');
    },
    
    validateResults: function(auditSysId) {
        return this.validateAudit(auditSysId, 'RESULTS');
    },
    
    validateChecklists: function(auditSysId) {
        return this.validateAudit(auditSysId, 'CHECKLISTS');
    },
    
    type: 'AuditValidationService'
};
```

#### AuditWorkflowService
Manages workflow operations.

```javascript
var AuditWorkflowService = Class.create();
AuditWorkflowService.prototype = {
    initialize: function() {},
    
    startWorkflow: function(auditSysId) {
        // Start Flow Designer flow
        // Create initial task for ENCAUD
    },
    
    completeStep: function(auditSysId, stepInfo) {
        // Validate current step data
        // Record visa decision
        // Advance to next step
        // Assign task to next responsible
        // Send notification
    },
    
    sendBack: function(auditSysId, sendBackInfo) {
        // Record send-back decision
        // Return to previous step
        // Notify previous responsible
    },
    
    getWorkflowStatus: function(auditSysId) {
        // Return current step, responsible, available actions
    },
    
    terminateWorkflow: function(auditSysId, reason) {
        // Cancel active workflow
        // Close open tasks
    },
    
    type: 'AuditWorkflowService'
};
```


#### AuditTemplateService
Manages template retrieval and selection.

```javascript
var AuditTemplateService = Class.create();
AuditTemplateService.prototype = {
    initialize: function() {},
    
    getActiveChecklistTemplate: function(visaStep, auditType) {
        // Find template with matching step/type
        // Filter by start_date <= today
        // Return most recent active template
    },
    
    getActiveFindingTemplate: function(findingGroup) {
        // Find template with matching group
        // Filter by start_date <= today
        // Return most recent active template
    },
    
    getActivePillarTemplate: function() {
        // Filter by start_date <= today
        // Return most recent active template
    },
    
    type: 'AuditTemplateService'
};
```

#### AuditPermissionService
Handles permission resolution.

```javascript
var AuditPermissionService = Class.create();
AuditPermissionService.prototype = {
    initialize: function() {},
    
    getUserPermission: function(auditSysId, userId) {
        // Get audit status and current step
        // Get user's role assignment for audit
        // Calculate permissions based on step/role/status
        // Return permission object
    },
    
    canUpdateGeneralInfo: function(auditSysId, userId) {},
    canUpdatePersonsInCharge: function(auditSysId, userId) {},
    canUpdateResults: function(auditSysId, userId) {},
    canUpdateChecklists: function(auditSysId, userId) {},
    canUpdateActionPlan: function(auditSysId, userId) {},
    canUpdateDocuments: function(auditSysId, userId) {},
    canGiveVisa: function(auditSysId, userId) {},
    canReopen: function(auditSysId, userId) {},
    
    type: 'AuditPermissionService'
};
```

### Integration Spokes

#### CRISIntegrationSpoke
REST integration with CRIS for contract data.

```javascript
var CRISIntegrationSpoke = Class.create();
CRISIntegrationSpoke.prototype = {
    initialize: function() {
        this.endpoint = gs.getProperty('x_ec_audit.cris.endpoint');
    },
    
    getContractDetails: function(contractId) {
        // Call CRIS REST API
        // Return contract data
    },
    
    getProjectDetails: function(projectId) {
        // Call CRIS REST API
        // Return project data
    },
    
    type: 'CRISIntegrationSpoke'
};
```

#### SUMMAIntegrationSpoke
REST integration with SUMMA for financial data.

```javascript
var SUMMAIntegrationSpoke = Class.create();
SUMMAIntegrationSpoke.prototype = {
    initialize: function() {
        this.endpoint = gs.getProperty('x_ec_audit.summa.endpoint');
    },
    
    getInvoiceDetails: function(invoiceRef) {},
    getCreditNoteDetails: function(creditNoteRef) {},
    validateRecoveryOrder: function(recoveryOrderRef) {},
    
    type: 'SUMMAIntegrationSpoke'
};
```

#### HRSIntegrationSpoke
REST integration with HRS/Hermes for documents.

```javascript
var HRSIntegrationSpoke = Class.create();
HRSIntegrationSpoke.prototype = {
    initialize: function() {
        this.endpoint = gs.getProperty('x_ec_audit.hrs.endpoint');
    },
    
    uploadDocument: function(fileData, metadata) {},
    downloadDocument: function(documentRef) {},
    linkDocument: function(documentRef, auditSysId) {},
    
    type: 'HRSIntegrationSpoke'
};
```


## Data Models

### Audit State Machine

```
                    ┌─────────────┐
                    │ PROVISIONAL │
                    └──────┬──────┘
                           │ Start Workflow
                           ▼
                    ┌─────────────┐
         ┌─────────│   ONGOING   │─────────┐
         │         └──────┬──────┘         │
         │                │                │
    Cancel│          Complete              │Cancel
         │                │                │
         ▼                ▼                ▼
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │  CANCELLED  │  │   CLOSED    │  │  CANCELLED  │
  └──────┬──────┘  └──────┬──────┘  └─────────────┘
         │                │
         │    Reopen      │
         └───────┬────────┘
                 │
                 ▼
          ┌─────────────┐
          │   ONGOING   │
          └─────────────┘
```

### Workflow Steps Flow

```
STEP_1 (Initial Entry) ──► STEP_2 (Manager Review) ──► STEP_3 (Launching)
        │                          │                          │
        │                          │                          │
        ▼                          ▼                          ▼
     ENCAUD                     GESTAUD                    RESPAUD
                                                              │
                                                              ▼
STEP_6 (Closure) ◄── STEP_5 (Final Review) ◄── STEP_4 (Field Work)
        │                    │                        │
        │                    │                        │
        ▼                    ▼                        ▼
     GESTAUD            RESPOPE/RESPFIN            RESPAUD
                                                      │
                                                      ▼
                                              STEP_4B (Results Entry)
                                                      │
                                                      ▼
                                                   ENCAUD
```

### Permission Matrix

| Action | STEP_1 | STEP_2 | STEP_3 | STEP_4 | STEP_4B | STEP_5 | STEP_6 |
|--------|--------|--------|--------|--------|---------|--------|--------|
| Update General Info | ENCAUD | GESTAUD | RESPAUD | - | - | - | - |
| Update Persons | ENCAUD | GESTAUD | RESPAUD | - | - | - | - |
| Update Results | - | - | - | - | ENCAUD | RESPOPE/FIN | - |
| Update Checklists | ENCAUD | GESTAUD | RESPAUD | RESPAUD | ENCAUD | RESPOPE/FIN | GESTAUD |
| Update Action Plan | - | - | - | - | ENCAUD | RESPOPE/FIN | - |
| Update Documents | ENCAUD | GESTAUD | RESPAUD | RESPAUD | ENCAUD | RESPOPE/FIN | GESTAUD |
| Give Visa | ENCAUD | GESTAUD | RESPAUD | RESPAUD | ENCAUD | RESPOPE/FIN | GESTAUD |


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Audit Number Uniqueness
*For any* two audits created in the system, their audit numbers SHALL be different.
**Validates: Requirements 1.1**

### Property 2: Audit Creation Defaults
*For any* newly created audit, the status SHALL be PROVISIONAL and the year SHALL equal the current year.
**Validates: Requirements 1.1, 1.2**

### Property 3: Cancellation State Transition
*For any* audit that is cancelled, the status SHALL be CANCELLED and the audit SHALL be read-only (no modifications allowed except reopen).
**Validates: Requirements 1.3, 1.4**

### Property 4: Deletion Precondition
*For any* audit deletion request, the operation SHALL succeed only if the audit status is PROVISIONAL.
**Validates: Requirements 1.5**

### Property 5: Reopen State Restoration
*For any* closed or cancelled audit that is reopened, the status SHALL be restored to ONGOING and the workflow SHALL be active.
**Validates: Requirements 1.6**

### Property 6: Validation Error Immutability
*For any* audit operation that fails validation, the audit state before the operation SHALL equal the audit state after the operation.
**Validates: Requirements 1.7**

### Property 7: General Info Data Completeness
*For any* audit with general information saved, all mandatory fields (title, year, type, category, status) SHALL be non-null.
**Validates: Requirements 2.1**

### Property 8: Contract Reference Persistence
*For any* audit linked to a contract, the contract_reference field SHALL contain the CRIS contract ID.
**Validates: Requirements 2.2**

### Property 9: Role Assignment Validity
*For any* person assigned to an audit role, the role code SHALL be one of: ENCAUD, GESTAUD, RESPAUD, RESPOPE, RESPFIN.
**Validates: Requirements 3.1**

### Property 10: Required Roles for Workflow Progression
*For any* audit attempting workflow progression, all required roles for the current step SHALL have at least one person assigned.
**Validates: Requirements 3.3**

### Property 11: Financial Opinion Values
*For any* audit result with a financial opinion, the value SHALL be one of: UNQUALIFIED, QUALIFIED, ADVERSE, DISCLAIMER.
**Validates: Requirements 4.1**

### Property 12: Currency Conversion Consistency
*For any* audit result with currency conversion, the exchange rate and exchange rate source SHALL both be non-null.
**Validates: Requirements 4.4, 4.5**

### Property 13: Finding Categorization
*For any* audit finding, the finding_group reference SHALL be non-null and the priority values SHALL be non-negative integers.
**Validates: Requirements 4.6**


### Property 14: Checklist Template Selection
*For any* checklist loaded for an audit, the template used SHALL match the audit's current visa step and audit type, with start_date <= current date.
**Validates: Requirements 5.1, 5.5**

### Property 15: Checklist Structure Integrity
*For any* checklist response, it SHALL reference a valid checklist_detail from the active template.
**Validates: Requirements 5.2**

### Property 16: Check Item Data Completeness
*For any* checklist response, the check_value SHALL be one of: YES, NO, N_A.
**Validates: Requirements 5.3**

### Property 17: Bilingual Support
*For any* template detail (checklist, finding, pillar), both text_en and text_fr fields SHALL be non-null.
**Validates: Requirements 5.4, 10.1, 10.2, 10.3**

### Property 18: Recovery Action Contract Link
*For any* recovery action, the contract_link reference SHALL be non-null and reference a valid audited contract.
**Validates: Requirements 6.3**

### Property 19: Document Metadata Completeness
*For any* document attached to an audit, the document_type, upload_date, and uploaded_by fields SHALL be non-null.
**Validates: Requirements 7.4, 7.6**

### Property 20: Workflow Step Sequence
*For any* workflow progression, the next step SHALL follow the defined sequence: STEP_1 → STEP_2 → STEP_3 → STEP_4 → STEP_4B → STEP_5 → STEP_6.
**Validates: Requirements 8.1**

### Property 21: Visa Validation Precondition
*For any* visa approval, the validation for the current step SHALL have no ERROR-level messages.
**Validates: Requirements 8.2, 8.3**

### Property 22: Visa Record Completeness
*For any* visa record, the step, decision, user, and timestamp fields SHALL be non-null.
**Validates: Requirements 8.8**

### Property 23: Send-Back Step Regression
*For any* send-back operation, the audit's current_workflow_step SHALL be set to the previous step in the sequence.
**Validates: Requirements 8.6**

### Property 24: Validation Message Categorization
*For any* validation message, the level SHALL be one of: ERROR, WARNING, INFO, SUCCESS.
**Validates: Requirements 9.3**

### Property 25: Validation Message Persistence
*For any* audit that has been validated, the validation messages SHALL be stored and retrievable.
**Validates: Requirements 9.4**

### Property 26: Template Uniqueness
*For any* two templates of the same type, the combination of key fields (visa_step + audit_type for checklists, finding_group for findings) and start_date SHALL be unique.
**Validates: Requirements 10.6**

### Property 27: Template Date Selection
*For any* template retrieval, the returned template SHALL have the maximum start_date that is <= current date.
**Validates: Requirements 10.4**

### Property 28: Bulk Upload Validation
*For any* bulk upload file, each line SHALL be validated before processing begins.
**Validates: Requirements 11.4**

### Property 29: Async Processing Non-Blocking
*For any* bulk upload or export operation, the initiating request SHALL return immediately without waiting for completion.
**Validates: Requirements 11.7, 14.5**

### Property 30: Search Result Accuracy
*For any* search query, all returned audits SHALL match all specified search criteria.
**Validates: Requirements 14.1**

### Property 31: Reference Data Validity Filtering
*For any* reference data query for user selection, only items with begin_date <= current date AND (end_date is null OR end_date >= current date) SHALL be returned.
**Validates: Requirements 15.5**

### Property 32: Closed Audit Immutability
*For any* audit with status CLOSED or CANCELLED, modification operations (except reopen) SHALL be rejected.
**Validates: Requirements 13.5**

### Property 33: User Preference Round-Trip
*For any* user preference saved, retrieving the preference for the same user SHALL return the saved values.
**Validates: Requirements 16.1, 16.2**

### Property 34: Migration Data Integrity
*For any* migrated audit, all fields from the source system SHALL be present in the target system with equivalent values.
**Validates: Requirements 18.1, 18.6**


## Error Handling

### Error Categories

| Category | HTTP Status | ServiceNow Handling |
|----------|-------------|---------------------|
| Validation Error | 400 | Return validation messages with ERROR level |
| Permission Denied | 403 | ACL rejection, log attempt |
| Not Found | 404 | GlideRecord not found |
| Conflict | 409 | Optimistic lock failure |
| External System Error | 502 | Integration spoke failure |
| Internal Error | 500 | Script error, log and alert |

### Error Response Format

```javascript
{
    "status": "error",
    "code": "VALIDATION_ERROR",
    "messages": [
        {
            "code": "BR_001",
            "level": "ERROR",
            "field": "title",
            "description": "Audit title is required"
        }
    ]
}
```

### External System Fallback

When external systems (CRIS, SUMMA, HRS) are unavailable:
1. Log the error with full details
2. Return user-friendly error message
3. Allow retry after timeout
4. For non-critical operations, allow manual data entry

### Audit Trail

All errors are logged to:
- System Log (syslog) for technical details
- Custom audit log table for business audit trail
- Email notification for critical errors

## Testing Strategy

### Unit Tests
- Test each Script Include method in isolation
- Mock external dependencies (GlideRecord, integrations)
- Verify business logic correctness
- Test edge cases and error conditions

### Property-Based Tests
- Use ServiceNow ATF (Automated Test Framework)
- Generate random valid audit data
- Verify all correctness properties hold
- Minimum 100 iterations per property test
- Tag format: **Feature: servicenow-migration, Property {number}: {property_text}**

### Integration Tests
- Test external system integrations with mock servers
- Verify data transformation correctness
- Test error handling for unavailable systems

### End-to-End Tests
- Test complete audit lifecycle flows
- Verify workflow progression
- Test permission enforcement
- Validate notification delivery

### Data Migration Tests
- Verify record count matches source
- Validate data integrity for sample records
- Test reference data relationships
- Verify historical data preservation

### Performance Tests
- Search performance with large datasets
- Bulk upload processing time
- Concurrent user load testing
- Integration response times

