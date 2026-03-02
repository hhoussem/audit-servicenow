# ServiceNow Development Standards

This project is a ServiceNow scoped application (`x_ec_audit`) for the OPSYS Audit Management System, migrated from Java/Oracle/WebLogic.

## Application Context

- Application Scope: `x_ec_audit`
- Application Name: OPSYS Audit Management
- Full specs: #[[file:.kiro/specs/servicenow-migration/requirements.md]]
- Design: #[[file:.kiro/specs/servicenow-migration/design.md]]
- Tasks: #[[file:.kiro/specs/servicenow-migration/tasks.md]]

## Table Naming Convention

Tables preserve original Oracle names with ServiceNow scope prefix:
- Oracle `T_AUDITS` → ServiceNow `x_ec_audit_t_audits`
- Oracle `T_AUDIT_RESULTS` → ServiceNow `x_ec_audit_t_audit_results`
- Oracle `T_CREF_*` → ServiceNow `x_ec_audit_t_cref_*`

Column names also preserve Oracle naming (e.g., `audi_audit_nsq`, `audi_audit_title_lib`, `caut_nsq`).

## ServiceNow Script Patterns

### Script Include Structure
```javascript
var ServiceName = Class.create();
ServiceName.prototype = {
    initialize: function() {
        // Constructor - inject dependencies
    },
    
    methodName: function(params) {
        // Implementation
    },
    
    type: 'ServiceName'
};
```

### GlideRecord Operations
```javascript
// Query
var gr = new GlideRecord('x_ec_audit_t_audits');
gr.addQuery('caus_nsq', statusSysId);
gr.query();
while (gr.next()) {
    // Process record
}

// Create
var gr = new GlideRecord('x_ec_audit_t_audits');
gr.initialize();
gr.audi_audit_title_lib = 'Title';
var sysId = gr.insert();

// Update
var gr = new GlideRecord('x_ec_audit_t_audits');
if (gr.get(sysId)) {
    gr.audi_audit_title_lib = 'New Title';
    gr.update();
}
```

## Core Services

- `AuditService` - Audit lifecycle (create, cancel, delete, reopen)
- `AuditValidationService` - Business rule validation via Decision Tables
- `AuditWorkflowService` - Workflow operations (start, complete step, send back)
- `AuditTemplateService` - Template retrieval (checklist, finding, pillar)
- `AuditPermissionService` - Permission resolution based on step/role/status

## Integration Spokes

- `CRISIntegrationSpoke` - Contract/project data from CRIS
- `SUMMAIntegrationSpoke` - Financial data (invoices, credit notes, recovery orders)
- `HRSIntegrationSpoke` - Document storage via HRS/Hermes

## Workflow Steps

1. STEP_1 (Initial Entry) - ENCAUD
2. STEP_2 (Manager Review) - GESTAUD
3. STEP_3 (Launching) - RESPAUD
4. STEP_4 (Field Work) - RESPAUD
5. STEP_4B (Results Entry) - ENCAUD
6. STEP_5 (Final Review) - RESPOPE/RESPFIN
7. STEP_6 (Closure) - GESTAUD

## Audit Statuses

- PROVISIONAL - Initial state, can be deleted
- ONGOING - Active workflow
- CLOSED - Completed
- CANCELLED - Terminated

## Bilingual Support

All user-facing text must support English and French:
- Reference data: `*_label_en_lib`, `*_label_fr_lib`
- Templates: `text_en`, `text_fr` or `title_en`, `title_fr`
