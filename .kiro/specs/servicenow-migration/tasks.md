# Implementation Plan: OPSYS Audit ServiceNow Migration

## Overview

This implementation plan provides a phased approach to migrating the OPSYS Audit Management System to ServiceNow. The tasks are organized to build incrementally, starting with foundational elements (tables, reference data) and progressing through business logic, integrations, and finally the user interface.

## Tasks

- [-] 1. Create Application Scope and Core Tables
  - [x] 1.1 Create scoped application `x_ec_audit` with appropriate settings
    - Configure application scope prefix
    - Set up application properties
    - _Requirements: 1.1, 1.2_

  - [ ] 1.2 Create core audit table `T_AUDITS` (x_ec_audit_t_audits) with all fields
    - Define all columns per Oracle DDL specification (AUDI_AUDIT_NSQ, AUDI_AUDIT_TITLE_LIB, etc.)
    - Set up auto-number for AUDI_AUDIT_NUMBER_NUM field
    - Configure field labels (EN/FR)
    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 1.3 Create audit result tables (`T_AUDIT_RESULTS`, `T_AUDIT_RESULT_AMOUNTS`, `T_AUDIT_RESULT_FINDINGS`, `T_AUDIT_RESULT_PILLARS`)
    - Define all columns per Oracle DDL specification
    - Set up reference relationships to parent audit (AUDIT_NSQ, AURE_NSQ)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ] 1.4 Create checklist tables (`T_AUDIT_CHECKLISTS`, `T_AUDIT_CHECKLIST_MASTERS`, `T_AUDIT_CHECKLIST_DETAILS`)
    - Define columns per Oracle DDL specification
    - Set up reference to audit and template detail (AUDIT_NSQ, ACDE_NSQ)
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 1.5 Create supporting tables (`T_PERSON_IN_CHARGES`, `T_VISAS`, `T_DOCUMENTS`, `T_AUDIT_NON_FINANCIAL_ACTIONS`, `T_AUDITED_CONTRACT_LINKS`, `T_AUDIT_RECOVERY_ACTIONS`, `T_AUDIT_VALIDATION_MSGS`)
    - Define all columns per Oracle DDL specification
    - Set up reference relationships
    - _Requirements: 3.1, 6.1, 6.2, 6.3, 7.1, 7.4, 8.8, 9.4_

- [ ] 2. Create Template and Reference Data Tables
  - [ ] 2.1 Create all T_CREF_* reference data tables
    - Create `T_CREF_AUDIT_TYPES`, `T_CREF_AUDIT_STATUS`, `T_CREF_AUDIT_REASONS`, `T_CREF_AUDIT_TIMINGS`, `T_CREF_AUDIT_ROLES`, `T_CREF_AUDIT_CANCEL_REASONS`, `T_CREF_AUDIT_FINDING_GROUPS`, `T_CREF_AUDIT_CHECK_GROUPS`, `T_CREF_AUDIT_DOCUMENTS`, `T_CREF_AUDIT_VISA_STEPS`, `T_CREF_AUDIT_VISA_DECISIONS`, `T_CREF_CURRENCIES`, `T_CREF_EXCHANGE_RATE_SOURCES`, `T_CREF_DELEGATIONS`, `T_CREF_DIRECTORATES`, `T_CREF_UNITS`, `T_CREF_CATEGORIES`, `T_CREF_OPINION_FIN_AUDITS`, `T_CREF_OPINION_SYS_AUDITS`, `T_CREF_OPINION_SYSTEM_TYPES`, `T_CREF_REASON_ADDITIONS`
    - Use Oracle DDL structure: [PREFIX]_NSQ, [PREFIX]_CODE_COD, [PREFIX]_LABEL_FR_LIB, [PREFIX]_LABEL_EN_LIB, [PREFIX]_BEG_DAT, [PREFIX]_END_DAT, [PREFIX]_VAL_SWI
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 2.2 Create finding template tables (`T_AUDIT_FINDINGS_MASTERS`, `T_AUDIT_FINDINGS_DETAILS`)
    - Define columns per Oracle DDL specification
    - Set up parent-child relationship (AFMA_NSQ)
    - _Requirements: 4.6, 10.2_

  - [ ] 2.3 Create pillar template tables (`T_AUDIT_PILLAR_MASTERS`, `T_AUDIT_PILLAR_DETAILS`)
    - Define columns per Oracle DDL specification
    - Set up parent-child relationship (APMA_NSQ)
    - _Requirements: 4.7, 10.3_

- [ ] 3. Checkpoint - Verify Table Structure
  - Ensure all tables are created correctly
  - Verify reference relationships work
  - Ask the user if questions arise

- [ ] 4. Implement Core Business Logic - AuditService
  - [ ] 4.1 Create `AuditService` Script Include with basic structure
    - Implement initialize method
    - Set up service dependencies
    - _Requirements: 1.1_

  - [ ] 4.2 Implement `createAudit` method
    - Generate unique audit number
    - Set default values (PROVISIONAL status, current year)
    - Create audit record
    - _Requirements: 1.1, 1.2_

  - [ ]* 4.3 Write property test for audit creation
    - **Property 1: Audit Number Uniqueness**
    - **Property 2: Audit Creation Defaults**
    - **Validates: Requirements 1.1, 1.2**

  - [ ] 4.4 Implement `cancelAudit` method
    - Validate cancellation is allowed
    - Set cancellation reason and comment
    - Update status to CANCELLED
    - _Requirements: 1.3, 1.4_

  - [ ]* 4.5 Write property test for audit cancellation
    - **Property 3: Cancellation State Transition**
    - **Validates: Requirements 1.3, 1.4**

  - [ ] 4.6 Implement `deleteAudit` method
    - Verify status is PROVISIONAL
    - Delete related records
    - Delete audit record
    - _Requirements: 1.5_

  - [ ]* 4.7 Write property test for audit deletion
    - **Property 4: Deletion Precondition**
    - **Validates: Requirements 1.5**

  - [ ] 4.8 Implement `reopenAudit` method
    - Verify user has REOPEN permission
    - Restore previous active status
    - _Requirements: 1.6_

  - [ ]* 4.9 Write property test for audit reopen
    - **Property 5: Reopen State Restoration**
    - **Validates: Requirements 1.6**

- [ ] 5. Implement Validation Service
  - [ ] 5.1 Create `AuditValidationService` Script Include
    - Implement initialize method
    - Set up decision table service dependency
    - _Requirements: 9.1_

  - [ ] 5.2 Implement `validateAudit` method with scope parameter
    - Get audit data
    - Execute decision table rules for scope
    - Return validation messages
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 5.3 Implement scope-specific validation methods
    - `validateGeneralInfo`, `validateLaunchingData`, `validateResults`, `validateChecklists`
    - _Requirements: 9.1, 9.2_

  - [ ]* 5.4 Write property test for validation
    - **Property 6: Validation Error Immutability**
    - **Property 24: Validation Message Categorization**
    - **Property 25: Validation Message Persistence**
    - **Validates: Requirements 1.7, 9.3, 9.4**

  - [ ] 5.5 Create Decision Tables for business rules
    - Migrate rules from copa-brms to ServiceNow Decision Tables
    - Configure rule packages by validation scope
    - _Requirements: 9.1, 9.2_

- [ ] 6. Checkpoint - Verify Core Business Logic
  - Ensure all tests pass
  - Verify audit lifecycle operations work correctly
  - Ask the user if questions arise

- [ ] 7. Implement Template Service
  - [ ] 7.1 Create `AuditTemplateService` Script Include
    - Implement initialize method
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 7.2 Implement `getActiveChecklistTemplate` method
    - Find template with matching step/type
    - Filter by start_date <= today
    - Return most recent active template
    - _Requirements: 5.1, 5.5, 10.1_

  - [ ] 7.3 Implement `getActiveFindingTemplate` and `getActivePillarTemplate` methods
    - Filter by start_date <= today
    - Return most recent active template
    - _Requirements: 10.2, 10.3_

  - [ ]* 7.4 Write property tests for template service
    - **Property 14: Checklist Template Selection**
    - **Property 26: Template Uniqueness**
    - **Property 27: Template Date Selection**
    - **Validates: Requirements 5.1, 5.5, 10.4, 10.6**

- [ ] 8. Implement Permission Service
  - [ ] 8.1 Create `AuditPermissionService` Script Include
    - Implement initialize method
    - _Requirements: 13.1_

  - [ ] 8.2 Implement `getUserPermission` method
    - Get audit status and current step
    - Get user's role assignment for audit
    - Calculate permissions based on step/role/status
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ] 8.3 Implement permission check methods
    - `canUpdateGeneralInfo`, `canUpdatePersonsInCharge`, `canUpdateResults`, `canUpdateChecklists`, `canUpdateActionPlan`, `canUpdateDocuments`, `canGiveVisa`, `canReopen`
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 8.4 Write property test for permissions
    - **Property 32: Closed Audit Immutability**
    - **Validates: Requirements 13.5**

- [ ] 9. Implement Workflow Service
  - [ ] 9.1 Create `AuditWorkflowService` Script Include
    - Implement initialize method
    - _Requirements: 8.1_

  - [ ] 9.2 Implement `startWorkflow` method
    - Start Flow Designer flow
    - Create initial task for ENCAUD
    - _Requirements: 8.1_

  - [ ] 9.3 Implement `completeStep` method
    - Validate current step data
    - Record visa decision
    - Advance to next step
    - Assign task to next responsible
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

  - [ ] 9.4 Implement `sendBack` method
    - Record send-back decision
    - Return to previous step
    - _Requirements: 8.6_

  - [ ] 9.5 Implement `getWorkflowStatus` and `terminateWorkflow` methods
    - Return current step, responsible, available actions
    - Cancel active workflow and close open tasks
    - _Requirements: 8.7_

  - [ ]* 9.6 Write property tests for workflow
    - **Property 20: Workflow Step Sequence**
    - **Property 21: Visa Validation Precondition**
    - **Property 22: Visa Record Completeness**
    - **Property 23: Send-Back Step Regression**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.6, 8.8**

  - [ ] 9.7 Create Flow Designer workflow
    - Define 6-step visa workflow (STEP_1 through STEP_6)
    - Configure task assignments per step
    - Set up notifications
    - _Requirements: 8.1, 8.4, 8.5_

- [ ] 10. Checkpoint - Verify Business Logic Complete
  - Ensure all tests pass
  - Verify workflow progression works
  - Ask the user if questions arise

- [ ] 11. Implement Integration Spokes
  - [ ] 11.1 Create `CRISIntegrationSpoke` Script Include
    - Implement `getContractDetails` method
    - Implement `getProjectDetails` method
    - Configure REST endpoint properties
    - _Requirements: 2.2, 2.3_

  - [ ] 11.2 Create `SUMMAIntegrationSpoke` Script Include
    - Implement `getInvoiceDetails`, `getCreditNoteDetails`, `validateRecoveryOrder` methods
    - Configure REST endpoint properties
    - _Requirements: 6.3_

  - [ ] 11.3 Create `HRSIntegrationSpoke` Script Include
    - Implement `uploadDocument`, `downloadDocument`, `linkDocument` methods
    - Configure REST endpoint properties
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 11.4 Write integration tests with mock servers
    - Test data transformation correctness
    - Test error handling for unavailable systems
    - _Requirements: 2.2, 6.3, 7.1_

- [ ] 12. Implement Data Operations
  - [ ] 12.1 Implement general info save operations
    - Create Business Rules for audit record updates
    - Validate mandatory fields
    - _Requirements: 2.1_

  - [ ]* 12.2 Write property test for general info
    - **Property 7: General Info Data Completeness**
    - **Property 8: Contract Reference Persistence**
    - **Validates: Requirements 2.1, 2.2**

  - [ ] 12.3 Implement person-in-charge operations
    - Create CRUD operations for role assignments
    - Validate role codes
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 12.4 Write property test for role assignments
    - **Property 9: Role Assignment Validity**
    - **Property 10: Required Roles for Workflow Progression**
    - **Validates: Requirements 3.1, 3.3**

  - [ ] 12.5 Implement audit result operations
    - Create CRUD operations for results, amounts, findings, pillars
    - Validate financial data
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 12.6 Write property tests for results
    - **Property 11: Financial Opinion Values**
    - **Property 12: Currency Conversion Consistency**
    - **Property 13: Finding Categorization**
    - **Validates: Requirements 4.1, 4.4, 4.5, 4.6**

  - [ ] 12.7 Implement checklist operations
    - Create CRUD operations for checklist responses
    - Load template details
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 12.8 Write property tests for checklists
    - **Property 15: Checklist Structure Integrity**
    - **Property 16: Check Item Data Completeness**
    - **Property 17: Bilingual Support**
    - **Validates: Requirements 5.2, 5.3, 5.4**

  - [ ] 12.9 Implement action plan and recovery operations
    - Create CRUD operations for action plans and recovery actions
    - Validate contract links
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 12.10 Write property test for recovery actions
    - **Property 18: Recovery Action Contract Link**
    - **Validates: Requirements 6.3**

  - [ ] 12.11 Implement document operations
    - Create CRUD operations for document references
    - Integrate with HRS spoke
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 12.12 Write property test for documents
    - **Property 19: Document Metadata Completeness**
    - **Validates: Requirements 7.4, 7.6**

- [ ] 13. Checkpoint - Verify Data Operations
  - Ensure all tests pass
  - Verify all CRUD operations work correctly
  - Ask the user if questions arise

- [ ] 14. Implement Bulk Operations
  - [ ] 14.1 Implement bulk upload functionality
    - Create file upload UI component
    - Parse CSV/Excel files
    - Validate all lines before processing
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ] 14.2 Implement async processing for bulk operations
    - Use ServiceNow Scheduled Jobs or Flow Designer
    - Provide progress tracking
    - _Requirements: 11.5, 11.6, 11.7_

  - [ ]* 14.3 Write property tests for bulk upload
    - **Property 28: Bulk Upload Validation**
    - **Property 29: Async Processing Non-Blocking**
    - **Validates: Requirements 11.4, 11.7**

- [ ] 15. Implement Search and Export
  - [ ] 15.1 Implement advanced search functionality
    - Create search form with all filter criteria
    - Implement search logic
    - _Requirements: 14.1, 14.2_

  - [ ] 15.2 Implement export functionality
    - Export to Excel/CSV
    - Async processing for large datasets
    - _Requirements: 14.3, 14.4, 14.5_

  - [ ]* 15.3 Write property test for search
    - **Property 30: Search Result Accuracy**
    - **Validates: Requirements 14.1**

- [ ] 16. Implement Reference Data Management
  - [ ] 16.1 Create reference data administration UI
    - CRUD forms for all reference tables
    - Validity date filtering
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [ ]* 16.2 Write property test for reference data
    - **Property 31: Reference Data Validity Filtering**
    - **Validates: Requirements 15.5**

- [ ] 17. Implement User Preferences
  - [ ] 17.1 Create user preference storage
    - Store language preference
    - Store default filter settings
    - _Requirements: 16.1, 16.2_

  - [ ]* 17.2 Write property test for preferences
    - **Property 33: User Preference Round-Trip**
    - **Validates: Requirements 16.1, 16.2**

- [ ] 18. Checkpoint - Verify All Business Logic
  - Ensure all tests pass
  - Verify all features work end-to-end
  - Ask the user if questions arise

- [ ] 19. Implement Access Control
  - [ ] 19.1 Create ACL rules for all tables
    - Configure read/write/delete permissions
    - Implement role-based access
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ] 19.2 Configure ECAS/EU Login SSO integration
    - Set up SAML or OAuth integration
    - Map external roles to ServiceNow roles
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 19.3 Implement session management
    - Configure timeout settings
    - Implement concurrent session handling
    - _Requirements: 12.4, 12.5_

- [ ] 20. Create User Interface
  - [ ] 20.1 Create Service Portal pages
    - Audit list page with search/filter
    - Audit detail page with tabs
    - Workflow task page
    - _Requirements: 2.1, 4.1, 5.1, 8.1_

  - [ ] 20.2 Create forms for all data entry
    - General info form
    - Results entry form
    - Checklist entry form
    - Action plan form
    - Document management form
    - _Requirements: 2.1, 4.1, 5.1, 6.1, 7.1_

  - [ ] 20.3 Create administration portal
    - Reference data management
    - Template management
    - User management
    - _Requirements: 15.1, 10.5, 10.6_

  - [ ] 20.4 Implement bilingual support
    - Configure EN/FR translations
    - Language switcher
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 21. Implement Notifications
  - [ ] 21.1 Create email notification templates
    - Workflow task assignment
    - Visa approval/rejection
    - Send-back notification
    - _Requirements: 8.4, 8.5_

  - [ ] 21.2 Configure notification triggers
    - Business Rules for notification events
    - Flow Designer notification actions
    - _Requirements: 8.4, 8.5_

- [ ] 22. Checkpoint - Verify UI and Notifications
  - Ensure all UI components work correctly
  - Verify notifications are sent
  - Ask the user if questions arise

- [ ] 23. Data Migration
  - [ ] 23.1 Create data migration scripts
    - Extract data from Oracle source
    - Transform to ServiceNow format
    - Load into ServiceNow tables
    - _Requirements: 18.1, 18.2, 18.3_

  - [ ] 23.2 Implement migration validation
    - Record count verification
    - Data integrity checks
    - Reference data mapping
    - _Requirements: 18.4, 18.5_

  - [ ]* 23.3 Write property test for migration
    - **Property 34: Migration Data Integrity**
    - **Validates: Requirements 18.1, 18.6**

  - [ ] 23.4 Create rollback procedures
    - Document rollback steps
    - Test rollback process
    - _Requirements: 18.7_

- [ ] 24. Final Checkpoint - Complete System Verification
  - Ensure all tests pass
  - Verify complete audit lifecycle
  - Verify all integrations work
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- ServiceNow ATF (Automated Test Framework) should be used for all testing
- Flow Designer should be used for workflow implementation
- Integration Hub should be used for external system integrations
