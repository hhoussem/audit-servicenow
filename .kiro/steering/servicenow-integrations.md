---
inclusion: fileMatch
fileMatchPattern: "**/*Spoke*.js"
---

# ServiceNow Integration Standards

## External System Integrations

This application integrates with EC corporate systems via REST APIs.

| System | Purpose | Spoke Class |
|--------|---------|-------------|
| CRIS | Contract/project data | CRISIntegrationSpoke |
| SUMMA | Financial data | SUMMAIntegrationSpoke |
| HRS/Hermes | Document storage | HRSIntegrationSpoke |
| ECAS/EU Login | Authentication | SSO Configuration |
| LDAP | User directory | LDAP Import |

## Integration Spoke Pattern

```javascript
var IntegrationSpoke = Class.create();
IntegrationSpoke.prototype = {
    initialize: function() {
        this.endpoint = gs.getProperty('x_ec_audit.[system].endpoint');
        this.timeout = 30000; // 30 seconds
    },
    
    _makeRequest: function(method, path, body) {
        try {
            var request = new sn_ws.RESTMessageV2();
            request.setEndpoint(this.endpoint + path);
            request.setHttpMethod(method);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setHttpTimeout(this.timeout);
            
            if (body) {
                request.setRequestBody(JSON.stringify(body));
            }
            
            var response = request.execute();
            var httpStatus = response.getStatusCode();
            var responseBody = response.getBody();
            
            if (httpStatus >= 200 && httpStatus < 300) {
                return {
                    success: true,
                    data: JSON.parse(responseBody)
                };
            } else {
                gs.error('Integration error: ' + httpStatus + ' - ' + responseBody);
                return {
                    success: false,
                    error: 'HTTP ' + httpStatus,
                    details: responseBody
                };
            }
        } catch (e) {
            gs.error('Integration exception: ' + e.message);
            return {
                success: false,
                error: e.message
            };
        }
    },
    
    type: 'IntegrationSpoke'
};
```

## CRIS Integration

```javascript
var CRISIntegrationSpoke = Class.create();
CRISIntegrationSpoke.prototype = Object.extendsObject(IntegrationSpoke, {
    initialize: function() {
        IntegrationSpoke.prototype.initialize.call(this);
        this.endpoint = gs.getProperty('x_ec_audit.cris.endpoint');
    },
    
    getContractDetails: function(contractId) {
        return this._makeRequest('GET', '/contracts/' + contractId);
    },
    
    getProjectDetails: function(projectId) {
        return this._makeRequest('GET', '/projects/' + projectId);
    },
    
    type: 'CRISIntegrationSpoke'
});
```

## SUMMA Integration

```javascript
var SUMMAIntegrationSpoke = Class.create();
SUMMAIntegrationSpoke.prototype = Object.extendsObject(IntegrationSpoke, {
    initialize: function() {
        IntegrationSpoke.prototype.initialize.call(this);
        this.endpoint = gs.getProperty('x_ec_audit.summa.endpoint');
    },
    
    getInvoiceDetails: function(invoiceRef) {
        return this._makeRequest('GET', '/invoices/' + invoiceRef);
    },
    
    getCreditNoteDetails: function(creditNoteRef) {
        return this._makeRequest('GET', '/credit-notes/' + creditNoteRef);
    },
    
    validateRecoveryOrder: function(recoveryOrderRef) {
        return this._makeRequest('GET', '/recovery-orders/' + recoveryOrderRef + '/validate');
    },
    
    type: 'SUMMAIntegrationSpoke'
});
```

## HRS Integration

```javascript
var HRSIntegrationSpoke = Class.create();
HRSIntegrationSpoke.prototype = Object.extendsObject(IntegrationSpoke, {
    initialize: function() {
        IntegrationSpoke.prototype.initialize.call(this);
        this.endpoint = gs.getProperty('x_ec_audit.hrs.endpoint');
    },
    
    uploadDocument: function(fileData, metadata) {
        return this._makeRequest('POST', '/documents', {
            file: fileData,
            metadata: metadata
        });
    },
    
    downloadDocument: function(documentRef) {
        return this._makeRequest('GET', '/documents/' + documentRef);
    },
    
    linkDocument: function(documentRef, auditSysId) {
        return this._makeRequest('POST', '/documents/' + documentRef + '/link', {
            auditId: auditSysId
        });
    },
    
    type: 'HRSIntegrationSpoke'
});
```

## Error Handling

Always handle integration failures gracefully:
```javascript
var result = crisSpoke.getContractDetails(contractId);
if (!result.success) {
    // Log error but don't block user
    gs.warn('CRIS unavailable: ' + result.error);
    return {
        success: true,
        warning: 'Contract details could not be retrieved from CRIS'
    };
}
```

## System Properties

Configure endpoints via system properties:
- `x_ec_audit.cris.endpoint` - CRIS REST API base URL
- `x_ec_audit.summa.endpoint` - SUMMA REST API base URL
- `x_ec_audit.hrs.endpoint` - HRS REST API base URL
