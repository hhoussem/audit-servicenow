---
inclusion: fileMatch
fileMatchPattern: "**/*test*.js"
---

# ServiceNow Testing Standards

## Automated Test Framework (ATF)

Use ServiceNow ATF for all automated tests. Tests should validate the correctness properties defined in the design document.

## Property Tests

Property tests validate universal correctness guarantees. Reference the design document for the full list of properties.

### Key Properties to Test

1. **Audit Number Uniqueness** - No two audits share the same number
2. **Audit Creation Defaults** - New audits have PROVISIONAL status and current year
3. **Cancellation State Transition** - Cancelled audits are read-only
4. **Deletion Precondition** - Only PROVISIONAL audits can be deleted
5. **Workflow Step Sequence** - Steps follow defined order
6. **Visa Validation Precondition** - No ERROR messages before visa approval

## Test Script Pattern

```javascript
// ATF Test Step - Server Script
(function(outputs, steps, params, stepResult, assertEqual) {
    
    // Arrange
    var auditService = new AuditService();
    
    // Act
    var result = auditService.createAudit({
        title: 'Test Audit',
        type: 'FINANCIAL'
    });
    
    // Assert
    assertEqual({
        name: 'Audit created successfully',
        shouldbe: true,
        value: result.success
    });
    
    assertEqual({
        name: 'Status is PROVISIONAL',
        shouldbe: 'PROVISIONAL',
        value: result.status
    });
    
})(outputs, steps, params, stepResult, assertEqual);
```

## Test Data Setup

```javascript
// Create test reference data
function createTestAuditType() {
    var gr = new GlideRecord('x_1936206_audit_t_cref_audit_types');
    gr.initialize();
    gr.caut_code_cod = 'TEST_TYPE';
    gr.caut_label_en_lib = 'Test Type';
    gr.caut_label_fr_lib = 'Type Test';
    gr.caut_val_swi = true;
    return gr.insert();
}
```

## Test Cleanup

Always clean up test data:
```javascript
// In test teardown
var gr = new GlideRecord('x_1936206_audit_t_audits');
gr.addQuery('audi_audit_title_lib', 'STARTSWITH', 'TEST_');
gr.deleteMultiple();
```

## Background Script Testing

For quick validation during development:
```javascript
// Run in Scripts - Background
var service = new AuditService();
var result = service.createAudit({ title: 'Quick Test' });
gs.info('Result: ' + JSON.stringify(result));

// Cleanup
var gr = new GlideRecord('x_1936206_audit_t_audits');
if (gr.get(result.sysId)) {
    gr.deleteRecord();
}
```

## Verification Scripts

Use verification scripts to validate table structure:
```javascript
// Verify T_AUDITS table
var gr = new GlideRecord('x_1936206_audit_t_audits');
if (gr.isValid()) {
    gs.info('✓ T_AUDITS table exists');
} else {
    gs.error('✗ T_AUDITS table missing');
}
```
