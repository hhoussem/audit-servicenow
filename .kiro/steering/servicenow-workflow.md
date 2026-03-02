---
inclusion: fileMatch
fileMatchPattern: "**/workflow*.js"
---

# ServiceNow Workflow Implementation

## Audit Workflow Overview

The audit workflow has 6 main steps with visa approvals at each transition.

```
STEP_1 → STEP_2 → STEP_3 → STEP_4 → STEP_4B → STEP_5 → STEP_6
ENCAUD   GESTAUD   RESPAUD   RESPAUD   ENCAUD   RESPOPE   GESTAUD
                                                RESPFIN
```

## Flow Designer Implementation

Use Flow Designer for the main workflow. Create a flow named `Audit Approval Workflow`.

### Flow Triggers
- Trigger: Record created on `x_1936206_audit_t_audits`
- Condition: Status = PROVISIONAL

### Flow Actions per Step

1. **Create Task** - Assign to role for current step
2. **Wait for Approval** - Wait for visa decision
3. **Validate Data** - Run validation service
4. **Update Audit** - Move to next step
5. **Send Notification** - Notify next responsible

## Visa Decision Handling

```javascript
// In AuditWorkflowService
completeStep: function(auditSysId, stepInfo) {
    // 1. Validate current step data
    var validation = this.validationService.validateAudit(auditSysId, stepInfo.scope);
    if (validation.hasErrors) {
        return { success: false, errors: validation.errors };
    }
    
    // 2. Record visa decision
    var visaGr = new GlideRecord('x_1936206_audit_t_visas');
    visaGr.initialize();
    visaGr.audit_nsq = auditSysId;
    visaGr.visa_step_nsq = stepInfo.stepSysId;
    visaGr.visa_decision_cod = 'ACCEPT';
    visaGr.visa_user_id = gs.getUserID();
    visaGr.visa_timestamp_dat = new GlideDateTime();
    visaGr.insert();
    
    // 3. Advance to next step
    var auditGr = new GlideRecord('x_1936206_audit_t_audits');
    if (auditGr.get(auditSysId)) {
        auditGr.current_workflow_step = this.getNextStep(stepInfo.stepCode);
        auditGr.update();
    }
    
    // 4. Notify next responsible
    this.notifyNextResponsible(auditSysId);
    
    return { success: true };
}
```

## Send-Back Logic

```javascript
sendBack: function(auditSysId, sendBackInfo) {
    // Record send-back visa
    var visaGr = new GlideRecord('x_1936206_audit_t_visas');
    visaGr.initialize();
    visaGr.audit_nsq = auditSysId;
    visaGr.visa_step_nsq = sendBackInfo.currentStepSysId;
    visaGr.visa_decision_cod = 'SEND_BACK';
    visaGr.visa_comment_lib = sendBackInfo.comment;
    visaGr.insert();
    
    // Return to previous step
    var auditGr = new GlideRecord('x_1936206_audit_t_audits');
    if (auditGr.get(auditSysId)) {
        auditGr.current_workflow_step = this.getPreviousStep(sendBackInfo.currentStepCode);
        auditGr.update();
    }
    
    // Notify previous responsible
    this.notifyPreviousResponsible(auditSysId, sendBackInfo.comment);
}
```

## Step-Role Mapping

```javascript
var STEP_ROLES = {
    'STEP_1': ['ENCAUD'],
    'STEP_2': ['GESTAUD'],
    'STEP_3': ['RESPAUD'],
    'STEP_4': ['RESPAUD'],
    'STEP_4B': ['ENCAUD'],
    'STEP_5': ['RESPOPE', 'RESPFIN'],
    'STEP_6': ['GESTAUD']
};
```

## Workflow Termination

When an audit is cancelled:
```javascript
terminateWorkflow: function(auditSysId, reason) {
    // Cancel active flow context
    var flowGr = new GlideRecord('sys_flow_context');
    flowGr.addQuery('record', auditSysId);
    flowGr.addQuery('state', 'IN_PROGRESS');
    flowGr.query();
    while (flowGr.next()) {
        flowGr.state = 'CANCELLED';
        flowGr.update();
    }
    
    // Close open tasks
    var taskGr = new GlideRecord('x_1936206_audit_workflow_task');
    taskGr.addQuery('audit', auditSysId);
    taskGr.addQuery('state', 'open');
    taskGr.query();
    while (taskGr.next()) {
        taskGr.state = 'closed_cancelled';
        taskGr.close_notes = reason;
        taskGr.update();
    }
}
```
