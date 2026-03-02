# Task 1.4: Create Checklist Tables

## Overview

Create three checklist-related tables (matching original Oracle DDL):
1. `T_AUDIT_CHECKLIST_MASTERS` - Master checklist templates
2. `T_AUDIT_CHECKLIST_DETAILS` - Checklist item definitions
3. `T_AUDIT_CHECKLISTS` - Actual checklist responses per audit

---

## Table 1: T_AUDIT_CHECKLIST_MASTERS

### Create Table

1. In Studio, right-click application > Create Application File > Data Model > Table
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Label | T_AUDIT_CHECKLIST_MASTERS |
   | Name | t_audit_checklist_masters |
   | Extends table | None |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ACMA_NSQ | acma_nsq | Integer | | Yes | Primary key |
| ACMA_START_DAT | acma_start_dat | Date | | Yes | Start date of validity |
| CCGR_NSQ | ccgr_nsq | Reference | | Yes | FK to T_CREF_AUDIT_CHECK_GROUPS |
| CAUT_NSQ | caut_nsq | Reference | | Yes | FK to T_CREF_AUDIT_TYPES |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

### Create Unique Constraint

Create unique index on (ACMA_START_DAT, CCGR_NSQ, CAUT_NSQ):

| Field | Value |
|-------|-------|
| Name | uk_acma_strt_dat_ccgr_caut_nsq |
| Unique | true |
| Columns | acma_start_dat, ccgr_nsq, caut_nsq |

---

## Table 2: T_AUDIT_CHECKLIST_DETAILS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_CHECKLIST_DETAILS |
| Name | t_audit_checklist_details |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ACDE_NSQ | acde_nsq | Integer | | Yes | Primary key |
| ACMA_NSQ | acma_nsq | Reference | | Yes | FK to T_AUDIT_CHECKLIST_MASTERS |
| ACDE_CHCK_NUM | acde_chck_num | Integer | | No | Check number |
| ACDE_TEXT_FR_LIB | acde_text_fr_lib | String | 2000 | No | Check description (French) |
| ACDE_TEXT_EN_LIB | acde_text_en_lib | String | 2000 | No | Check description (English) |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 3: T_AUDIT_CHECKLISTS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_CHECKLISTS |
| Name | t_audit_checklists |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ACKL_NSQ | ackl_nsq | Integer | | Yes | Primary key |
| AUDIT_NSQ | audit_nsq | Reference | | Yes | FK to T_AUDITS |
| ACDE_NSQ | acde_nsq | Reference | | Yes | FK to T_AUDIT_CHECKLIST_DETAILS |
| ACKL_CHECK_SWI | ackl_check_swi | True/False | | No | Check value (Yes/No) |
| ACKL_CHECK_APPLICABLE_SWI | ackl_check_applicable_swi | True/False | | No | Is check applicable? |
| ACKL_COMMENT_LIB | ackl_comment_lib | String | 4000 | No | Comment on the check |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Configure Table Properties

### Set Unique Constraint for T_AUDIT_CHECKLISTS

Each audit should have only one response per checklist item:

1. Navigate to "System Definition > Tables"
2. Find x_ec_audit_t_audit_checklists
3. Click on "Indexes" related list
4. Create new index:

   | Field | Value |
   |-------|-------|
   | Name | u_audit_checklist_unique |
   | Unique | true |
   | Columns | audit_nsq, acde_nsq |

### Set Default Values

For **ackl_check_applicable_swi** column:
- Default value: `true`

For **optimistic_lock** column:
- Default value: `0`

---

## Verification Script

Run this in "Scripts - Background" to verify checklist tables:

```javascript
// Verify checklist tables
var tables = {
    'x_ec_audit_t_audit_checklist_masters': [
        'acma_nsq', 'acma_start_dat', 'ccgr_nsq', 'caut_nsq', 'optimistic_lock'
    ],
    'x_ec_audit_t_audit_checklist_details': [
        'acde_nsq', 'acma_nsq', 'acde_chck_num', 'acde_text_fr_lib', 'acde_text_en_lib'
    ],
    'x_ec_audit_t_audit_checklists': [
        'ackl_nsq', 'audit_nsq', 'acde_nsq', 'ackl_check_swi', 
        'ackl_check_applicable_swi', 'ackl_comment_lib'
    ]
};

for (var tableName in tables) {
    var gr = new GlideRecord(tableName);
    if (gr.isValid()) {
        gs.info('✓ Table exists: ' + tableName);
        
        var columns = tables[tableName];
        columns.forEach(function(col) {
            if (gr.isValidField(col)) {
                gs.info('  ✓ Column: ' + col);
            } else {
                gs.error('  ✗ Missing column: ' + col);
            }
        });
    } else {
        gs.error('✗ Table missing: ' + tableName);
    }
}
```

---

## What You've Accomplished

✅ Created T_AUDIT_CHECKLIST_MASTERS table for templates
✅ Created T_AUDIT_CHECKLIST_DETAILS table for checklist items
✅ Created T_AUDIT_CHECKLISTS table for audit responses
✅ Configured unique constraints matching Oracle DDL
✅ Set default values for applicable and optimistic_lock fields

## Next Step

Proceed to Task 1.5: Create supporting tables (T_PERSON_IN_CHARGES, T_VISAS, T_DOCUMENTS, etc.)
