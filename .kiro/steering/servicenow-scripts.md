---
inclusion: fileMatch
fileMatchPattern: "**/*.js"
---

# ServiceNow Script Standards

## Script Include Pattern

All Script Includes must follow this structure:

```javascript
var ClassName = Class.create();
ClassName.prototype = {
    initialize: function() {
        // Inject service dependencies
        this.validationService = new AuditValidationService();
    },
    
    /**
     * Method description
     * @param {string} param1 - Description
     * @returns {string} - Description
     */
    methodName: function(param1) {
        // Implementation
        return result;
    },
    
    type: 'ClassName'
};
```

## GlideRecord Best Practices

### Always check record existence
```javascript
var gr = new GlideRecord('x_ec_audit_t_audits');
if (gr.get(sysId)) {
    // Record exists, safe to use
}
```

### Use encoded queries for complex conditions
```javascript
var gr = new GlideRecord('x_ec_audit_t_audits');
gr.addEncodedQuery('caus_nsq.caus_code_cod=ONGOING^audi_audit_year_num=2026');
gr.query();
```

### Limit queries when possible
```javascript
gr.setLimit(100);
gr.orderByDesc('cre_dat');
```

## Logging Standards

Use appropriate log levels:
```javascript
gs.info('Informational message');      // Normal operations
gs.warn('Warning message');            // Potential issues
gs.error('Error message');             // Errors
gs.debug('Debug message');             // Development only
```

Include context in log messages:
```javascript
gs.info('AuditService.createAudit: Created audit ' + auditNumber);
gs.error('AuditService.cancelAudit: Failed to cancel audit ' + auditNumber + ': ' + error);
```

## Error Handling

```javascript
try {
    // Operation
} catch (e) {
    gs.error('ClassName.methodName: ' + e.message);
    return {
        success: false,
        error: e.message
    };
}
```

## Validation Message Levels

- `ERROR` - Blocks workflow progression
- `WARNING` - Requires acknowledgment
- `INFO` - Informational only
- `SUCCESS` - Validation passed

## Permission Check Pattern

```javascript
var permService = new AuditPermissionService();
var canUpdate = permService.canUpdateGeneralInfo(auditSysId, gs.getUserID());
if (!canUpdate) {
    return {
        success: false,
        error: 'User does not have permission to update general info'
    };
}
```

## Transaction Pattern

For operations that modify multiple records:
```javascript
var gr = new GlideRecord('x_ec_audit_t_audits');
gr.setWorkflow(false);  // Disable business rules if needed
gr.autoSysFields(false); // Disable auto sys fields if needed
// ... operations
gr.setWorkflow(true);
```
