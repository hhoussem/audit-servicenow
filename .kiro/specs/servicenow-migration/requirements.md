# Requirements Document: OPSYS Audit ServiceNow Migration

## Introduction

This document specifies the requirements for migrating the OPSYS Audit Management System from its current Java/Oracle-based architecture to ServiceNow. The OPSYS Audit system manages the complete lifecycle of audits for development cooperation projects, including planning, execution, validation, workflow approvals, and reporting.

## Glossary

- **Audit**: A formal examination of financial records, contracts, and compliance for EU-funded projects
- **Audit_System**: The ServiceNow-based audit management application
- **Visa**: An approval step in the audit workflow requiring digital signature
- **Checklist**: A structured set of verification items for audit quality control
- **Pillar**: A category of assessment criteria in system audits
- **Finding**: An identified issue or discrepancy discovered during an audit
- **CRIS**: Contract Reference Information System - external system for contract data
- **SUMMA**: Financial management system for invoice and payment data
- **HRS/Hermes**: Document management system for storing audit documents
- **ECAS/EU_Login**: Authentication Service for single sign-on
- **BRMS**: Business Rule Management System for validation rules
- **Workflow_Engine**: The process automation component managing audit approvals

---

## Requirements

### Requirement 1: Audit Lifecycle Management

**User Story:** As an audit manager, I want to manage the complete audit lifecycle from creation to closure, so that I can track and control all audit activities systematically.

#### Acceptance Criteria

1. WHEN a user with AUDIT_CREATE permission initiates audit creation, THE Audit_System SHALL generate a unique audit number and create an audit record with PROVISIONAL status
2. WHEN an audit is created, THE Audit_System SHALL automatically set the audit year to the current year and initialize default values
3. WHEN a user requests to cancel an audit, THE Audit_System SHALL require a cancellation reason and change the status to CANCELLED
4. WHEN an audit is cancelled, THE Audit_System SHALL terminate the associated workflow and make the audit read-only
5. WHEN a user requests to delete an audit, THE Audit_System SHALL only allow deletion if the audit status is PROVISIONAL
6. WHEN a user with REOPEN permission requests to reopen a closed or cancelled audit, THE Audit_System SHALL restore the audit to its previous active state and restart the workflow
7. IF an audit operation fails validation, THEN THE Audit_System SHALL return descriptive error messages without modifying the audit state

---

### Requirement 2: Audit General Information Management

**User Story:** As an audit encoder, I want to capture and maintain comprehensive audit information, so that all relevant details are recorded for tracking and reporting.

#### Acceptance Criteria

1. THE Audit_System SHALL capture the following audit attributes: title, year, plan year, category (PLANNED/UNPLANNED), type, timing (EX_ANTE/EX_POST/INTERIM), reason, and comments
2. WHEN an audit is linked to a contract, THE Audit_System SHALL retrieve contract details from CRIS and store the contract reference
3. THE Audit_System SHALL capture organizational assignment including delegation, unit, and directorate in charge
4. THE Audit_System SHALL capture key dates: request for service, signature order, letter notification, field work start/end, draft report receipt, pre-final report receipt, and final report receipt
5. THE Audit_System SHALL capture audit period start and end dates
6. THE Audit_System SHALL capture contract budget and actual cost amounts
7. WHEN general information is saved, THE Audit_System SHALL validate data against business rules and store validation messages
8. IF the audit is at workflow Step 3 (Launching), THEN THE Audit_System SHALL apply extended validation rules (LAUNCHING_DATA scope)

---

### Requirement 3: Persons in Charge Management

**User Story:** As an audit manager, I want to assign responsible persons to audit roles, so that accountability is clear and workflow tasks are properly routed.

#### Acceptance Criteria

1. THE Audit_System SHALL support the following audit roles: ENCAUD (Encoder), GESTAUD (Manager), RESPAUD (Responsible), RESPOPE (Operational Responsible), RESPFIN (Financial Responsible)
2. WHEN assigning a person to a role, THE Audit_System SHALL search for persons via ECAS/LDAP integration
3. THE Audit_System SHALL validate that required roles are filled before allowing workflow progression
4. WHEN a person is assigned to a role, THE Audit_System SHALL update workflow task assignments accordingly
5. THE Audit_System SHALL allow multiple persons to be assigned to certain roles where applicable
6. WHEN persons in charge are modified, THE Audit_System SHALL notify affected users of their new assignments

---

### Requirement 4: Audit Results Management

**User Story:** As an audit encoder, I want to record audit findings and financial results, so that audit outcomes are properly documented and tracked.

#### Acceptance Criteria

1. THE Audit_System SHALL capture financial opinion with values: UNQUALIFIED, QUALIFIED, ADVERSE, DISCLAIMER
2. THE Audit_System SHALL capture system opinion and system opinion type for system audits
3. THE Audit_System SHALL capture financial amounts: total expenses, ineligible expenses, questionable expenses, amounts to recover
4. THE Audit_System SHALL support multiple currencies with exchange rate conversion
5. THE Audit_System SHALL capture exchange rate source and month for currency conversions
6. WHEN recording findings, THE Audit_System SHALL categorize them by finding group and priority levels (1, 2, 3)
7. THE Audit_System SHALL capture pillar assessments with analysis status and conclusion for each pillar
8. THE Audit_System SHALL integrate with SUMMA to retrieve invoice and credit note details
9. THE Audit_System SHALL validate recovery order references against SUMMA
10. WHEN results are saved, THE Audit_System SHALL validate data against business rules specific to the audit type

---

### Requirement 5: Checklist Management

**User Story:** As an audit reviewer, I want to complete structured checklists during the audit process, so that quality control is consistent and documented.

#### Acceptance Criteria

1. THE Audit_System SHALL present checklists based on the current visa step and audit type
2. THE Audit_System SHALL support checklist structure: Checklist → Pillars → Individual Checks
3. FOR EACH check item, THE Audit_System SHALL capture: check value (YES/NO/N/A), applicability flag, and comment
4. THE Audit_System SHALL support bilingual check descriptions (English and French)
5. WHEN a checklist is loaded, THE Audit_System SHALL use the active checklist template for the visa step and audit type
6. THE Audit_System SHALL capture pillar-level assessment conclusions
7. WHEN checklists are saved, THE Audit_System SHALL validate completeness before allowing workflow progression

---

### Requirement 6: Action Plan Management

**User Story:** As an audit manager, I want to track corrective actions resulting from audit findings, so that remediation is properly monitored.

#### Acceptance Criteria

1. THE Audit_System SHALL capture non-financial actions with: action description, realized status, and comments
2. THE Audit_System SHALL capture financial recovery actions with: amount to recover, recovery order reference, credit note reference, and invoice reference
3. THE Audit_System SHALL link recovery actions to specific audited contracts
4. WHEN a recovery action is created, THE Audit_System SHALL validate references against SUMMA
5. THE Audit_System SHALL track action completion status

---

### Requirement 7: Document Management

**User Story:** As an audit encoder, I want to attach and manage audit-related documents, so that supporting evidence is properly stored and accessible.

#### Acceptance Criteria

1. THE Audit_System SHALL integrate with HRS/Hermes for document storage
2. WHEN a document is uploaded, THE Audit_System SHALL store it in HRS and maintain the reference in the audit record
3. THE Audit_System SHALL support linking existing HRS documents to audits
4. THE Audit_System SHALL categorize documents by document type
5. THE Audit_System SHALL provide document download capability via ARES direct access
6. THE Audit_System SHALL track document metadata: upload date, user, and document type

---

### Requirement 8: Workflow and Visa System

**User Story:** As an audit approver, I want to progress audits through approval steps with digital signatures, so that proper authorization is maintained.

#### Acceptance Criteria

1. THE Audit_System SHALL implement the following workflow steps: STEP_1 (Initial Entry), STEP_2 (Manager Review), STEP_3 (Launching), STEP_4 (Field Work), STEP_4B (Results Entry), STEP_5 (Final Review), STEP_6 (Closure)
2. WHEN a user completes a step (gives visa), THE Audit_System SHALL validate all data for the current step against business rules
3. IF validation passes with no blocking errors, THEN THE Audit_System SHALL allow the user to give visa
4. WHEN giving visa, THE Audit_System SHALL require digital signature via ECAS for certain steps
5. WHEN a visa is given, THE Audit_System SHALL advance the workflow to the next step and notify the next responsible person
6. THE Audit_System SHALL support send-back functionality to return an audit to a previous step with comments
7. WHEN an audit is sent back, THE Audit_System SHALL notify the previous responsible person
8. THE Audit_System SHALL track all visa decisions with timestamps and user information
9. THE Audit_System SHALL provide workflow status query showing current step, responsible role, and available actions

---

### Requirement 9: Business Rules Validation

**User Story:** As a system administrator, I want business rules to validate audit data automatically, so that data quality is ensured consistently.

#### Acceptance Criteria

1. THE Audit_System SHALL execute validation rules from the BRMS for each data section
2. THE Audit_System SHALL support validation scopes: GENERAL_INFO, LAUNCHING_DATA, PERSONS_IN_CHARGE, CHECKLISTS, RESULTS, ACTION_PLAN
3. THE Audit_System SHALL categorize validation messages as: ERROR (blocks progression), WARNING (requires acknowledgment), INFO (informational), SUCCESS (passed)
4. THE Audit_System SHALL store validation messages per audit for review
5. THE Audit_System SHALL support validation rule exceptions for exceptional cases
6. WHEN creating a rule exception, THE Audit_System SHALL validate the exception request
7. THE Audit_System SHALL track rule exception creation and updates

---

### Requirement 10: Template Management

**User Story:** As a system administrator, I want to manage templates for checklists, findings, and pillars, so that audit structures can be configured without code changes.

#### Acceptance Criteria

1. THE Audit_System SHALL support checklist templates with: visa step, audit type, start date, and check items
2. THE Audit_System SHALL support finding templates with: finding group, start date, and finding items with bilingual descriptions
3. THE Audit_System SHALL support pillar templates with: start date and pillar items with bilingual titles and descriptions
4. WHEN retrieving a template, THE Audit_System SHALL return the active template based on the start date
5. THE Audit_System SHALL support template CRUD operations with appropriate permissions
6. THE Audit_System SHALL ensure template uniqueness by combination of key fields and start date

---

### Requirement 11: Bulk Upload Processing

**User Story:** As an audit administrator, I want to bulk create audits and upload results from Excel files, so that large volumes of data can be processed efficiently.

#### Acceptance Criteria

1. THE Audit_System SHALL support bulk audit creation from Excel file upload
2. THE Audit_System SHALL support ECA (European Court of Auditors) results upload from Excel
3. THE Audit_System SHALL support RER (Residual Error Rate) results upload from Excel
4. WHEN a file is uploaded, THE Audit_System SHALL parse and validate each line before processing
5. THE Audit_System SHALL allow users to review validation results before initiating processing
6. WHEN processing is initiated, THE Audit_System SHALL require ECAS digital signature
7. THE Audit_System SHALL process uploads asynchronously
8. WHEN processing completes, THE Audit_System SHALL send email notification to the user with results
9. IF processing fails, THEN THE Audit_System SHALL send failure notification with error details

---

### Requirement 12: External System Integrations

**User Story:** As a system integrator, I want the audit system to integrate with EC corporate systems, so that data is consistent across the organization.

#### Acceptance Criteria

1. THE Audit_System SHALL integrate with CRIS for contract and project reference data retrieval
2. THE Audit_System SHALL integrate with SUMMA for invoice, credit note, and recovery order data
3. THE Audit_System SHALL integrate with HRS/Hermes for document storage and retrieval
4. THE Audit_System SHALL integrate with ECAS/EU Login for authentication and digital signatures
5. THE Audit_System SHALL integrate with LDAP for user information lookup
6. IF an external system is unavailable, THEN THE Audit_System SHALL handle the error gracefully and inform the user

---

### Requirement 13: Security and Access Control

**User Story:** As a security administrator, I want role-based access control for all audit functions, so that users can only perform authorized actions.

#### Acceptance Criteria

1. THE Audit_System SHALL authenticate users via ECAS/EU Login
2. THE Audit_System SHALL support user roles: ENCAUD, ENCAUD_BXL, GESTAUD, RESPAUD, RESPOPE, RESPFIN
3. THE Audit_System SHALL support permission tasks: AUDIT_VIEW, AUDIT_CREATE, CHECKLIST_TEMPLATE_*, FINDING_TEMPLATE_*, PILLAR_TEMPLATE_*, BR_EXCEPTION_*, HELP_LINK_*
4. THE Audit_System SHALL resolve user permissions based on: current workflow step, user's role assignment for the audit, and audit status
5. THE Audit_System SHALL prevent modifications to CLOSED or CANCELLED audits except for authorized reopen operations
6. THE Audit_System SHALL log all user actions for audit trail purposes

---

### Requirement 14: Search and Reporting

**User Story:** As an audit manager, I want to search and export audit data, so that I can analyze and report on audit activities.

#### Acceptance Criteria

1. THE Audit_System SHALL support search by: audit number, year, plan year, status, category, type, delegation, unit, directorate, contract reference, person in charge, and date ranges
2. THE Audit_System SHALL return search results with audit summary information
3. THE Audit_System SHALL support workflow summary search including current workflow status
4. THE Audit_System SHALL support export to Excel format
5. WHEN export is requested, THE Audit_System SHALL process the export asynchronously
6. WHEN export completes, THE Audit_System SHALL send email notification with download link

---

### Requirement 15: Reference Data Management

**User Story:** As a system administrator, I want to manage reference data tables, so that dropdown values and codes can be maintained.

#### Acceptance Criteria

1. THE Audit_System SHALL maintain reference data for: Audit Categories, Audit Types, Audit Reasons, Audit Statuses, Audit Timings, Visa Steps, Visa Decisions, Financial Opinions, System Opinions, Finding Groups, Cancellation Reasons, Addition Reasons, ECA Error Classifications, Check Values
2. THE Audit_System SHALL maintain common reference data for: Currencies, Delegations, Directorates, Units, Roles, Document Types, Exchange Rate Sources
3. THE Audit_System SHALL support bilingual labels (English and French) for all reference data
4. THE Audit_System SHALL support validity periods (begin date, end date) for reference data items
5. THE Audit_System SHALL filter reference data by validity when presenting to users

---

### Requirement 16: User Preferences

**User Story:** As a user, I want to save my preferences, so that my experience is personalized.

#### Acceptance Criteria

1. THE Audit_System SHALL store user preferences per user login
2. THE Audit_System SHALL retrieve user preferences when the user logs in
3. THE Audit_System SHALL allow users to update their preferences

---

### Requirement 17: Notification System

**User Story:** As an audit participant, I want to receive notifications about audit activities, so that I am informed of tasks requiring my attention.

#### Acceptance Criteria

1. WHEN a workflow task is assigned, THE Audit_System SHALL send email notification to the assigned user
2. WHEN a visa is given at Step 4B, THE Audit_System SHALL send specific notification email
3. THE Audit_System SHALL use configurable email templates for notifications
4. THE Audit_System SHALL include relevant audit information in notification emails

---

### Requirement 18: Data Migration

**User Story:** As a project manager, I want existing audit data migrated to ServiceNow, so that historical records are preserved.

#### Acceptance Criteria

1. THE Audit_System SHALL migrate all existing audit records with complete data
2. THE Audit_System SHALL migrate all reference data tables
3. THE Audit_System SHALL migrate all templates (checklist, finding, pillar)
4. THE Audit_System SHALL migrate all validation rule exceptions
5. THE Audit_System SHALL migrate all user preferences
6. THE Audit_System SHALL preserve audit history and visa records
7. THE Audit_System SHALL mark migrated records with a migration flag
8. THE Audit_System SHALL validate data integrity after migration

---

## Data Model Summary

### Core Entities

| Entity | Description | Key Fields |
|--------|-------------|------------|
| T_AUDITS | Main audit record | audit_number, year, title, status, type, category |
| T_AUDIT_RESULTS | Audit outcome data | financial_opinion, system_opinion, amounts |
| T_AUDIT_RESULT_AMOUNTS | Financial result details | expenses, ineligible amounts, currency |
| T_AUDIT_RESULT_FINDINGS | Finding records | finding_type, priority, amounts |
| T_AUDIT_RESULT_PILLARS | Pillar assessments | analysis_status, conclusion |
| T_AUDIT_CHECKLISTS | Checklist responses | check_value, applicable, comment |
| T_AUDIT_NON_FINANCIAL_ACTIONS | Action plan items | action, realized, comment |
| T_AUDIT_RECOVERY_ACTIONS | Financial recovery items | amount, recovery_order, credit_note |
| T_AUDITED_CONTRACT_LINKS | Contract associations | contract_id, legal_commitment |
| T_AUDIT_VALIDATION_MSGS | Validation messages | code, level, type, description |
| T_PERSONS_IN_CHARGE | Role assignments | person_id, role, audit_id |
| T_DOCUMENTS | Document references | document_type, hrs_reference |
| T_VISAS | Approval records | step, decision, timestamp, user |

### Template Entities

| Entity | Description |
|--------|-------------|
| T_AUDIT_CHECKLIST_MASTERS | Checklist template headers |
| T_AUDIT_CHECKLIST_DETAILS | Checklist template items |
| T_AUDIT_FINDINGS_MASTERS | Finding template headers |
| T_AUDIT_FINDINGS_DETAILS | Finding template items |
| T_AUDIT_PILLAR_MASTERS | Pillar template headers |
| T_AUDIT_PILLAR_DETAILS | Pillar template items |

### Reference Data Entities

| Entity | Description |
|--------|-------------|
| T_CREF_AUDIT_TYPES | Audit type codes |
| T_CREF_AUDIT_STATUS | Audit status codes |
| T_CREF_AUDIT_REASONS | Audit reason codes |
| T_CREF_AUDIT_TIMINGS | Audit timing codes |
| T_CREF_AUDIT_ROLES | Person role codes |
| T_CREF_AUDIT_CANCEL_REASONS | Cancellation reason codes |
| T_CREF_AUDIT_FINDING_GROUPS | Finding group codes |
| T_CREF_AUDIT_CHECK_GROUPS | Check group codes |
| T_CREF_AUDIT_DOCUMENTS | Document type codes |

---

## Integration Points Summary

| System | Purpose | Protocol |
|--------|---------|----------|
| CRIS | Contract/project data | REST API |
| SUMMA | Financial data (invoices, credit notes) | REST API |
| HRS/Hermes | Document storage | REST API |
| ECAS/EU Login | Authentication, digital signatures | SAML/OAuth |
| LDAP | User directory lookup | LDAP |
| copa-brms | Business rules execution | REST API |
| copa-workflow | Workflow management | REST API |

---

## ServiceNow Migration Considerations

### Platform Mapping

| Current Component | ServiceNow Equivalent |
|-------------------|----------------------|
| Oracle Database | ServiceNow Tables |
| JPA Entities | ServiceNow Table Records |
| EJB Services | ServiceNow Business Rules, Script Includes |
| REST/SOAP Services | ServiceNow REST APIs, Scripted REST APIs |
| copa-workflow (Activiti) | ServiceNow Flow Designer / Workflow |
| copa-brms | ServiceNow Business Rules, Decision Tables |
| JSF Web UI | ServiceNow Service Portal / Workspace |
| ECAS Integration | ServiceNow SSO Integration |
| Email Templates | ServiceNow Email Notifications |
| Batch Jobs | ServiceNow Scheduled Jobs |

### Key Migration Challenges

1. Complex workflow with 6+ approval steps requiring digital signatures
2. Integration with multiple EC corporate systems (CRIS, SUMMA, HRS, ECAS)
3. Business rules engine migration from Groovy-based copa-brms
4. Bilingual support (English/French) for all labels and templates
5. Historical data migration with audit trail preservation
6. Template versioning with validity date logic
