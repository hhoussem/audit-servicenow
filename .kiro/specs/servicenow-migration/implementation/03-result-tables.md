# Task 1.3: Create Audit Result Tables

## Overview

Create four related tables for storing audit results (matching original Oracle DDL):
1. `T_AUDIT_RESULTS` - Main result record
2. `T_AUDIT_RESULT_AMOUNTS` - Financial amounts
3. `T_AUDIT_RESULT_FINDINGS` - Audit findings
4. `T_AUDIT_RESULT_PILLARS` - Pillar assessments

---

## Table 1: T_AUDIT_RESULTS

### Create Table

1. In Studio, right-click application > Create Application File > Data Model > Table
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Label | T_AUDIT_RESULTS |
   | Name | t_audit_results |
   | Extends table | None |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| AURE_NSQ | aure_nsq | Integer | | Yes | Primary key |
| AUDIT_NSQ | audit_nsq | Reference | | Yes | FK to T_AUDITS (unique) |
| AURE_OPI_AUDIT_COM_LIB | aure_opi_audit_com_lib | String | 4000 | No | Audit opinion comment |
| AURE_ADD_OBJ_SWI | aure_add_obj_swi | True/False | | No | Additional objectives? |
| AURE_ADD_OBJ_ACHIEVED_SWI | aure_add_obj_achieved_swi | True/False | | No | Objectives achieved? |
| AURE_ADD_OBJ_ACH_COM_LIB | aure_add_obj_ach_com_lib | String | 4000 | No | Objectives comment |
| AURE_ADD_OBJ_WHICH_ONES_LIB | aure_add_obj_which_ones_lib | String | 4000 | No | Which objectives |
| AURE_OP_FIN_AUDIT_LIB | aure_op_fin_audit_lib | String | 4000 | No | Financial audit opinion comment |
| AURE_OP_SYS_AUDIT_LIB | aure_op_sys_audit_lib | String | 4000 | No | System audit opinion comment |
| COSA_NSQ | cosa_nsq | Reference | | No | FK to T_CREF_OPINION_SYS_AUDITS |
| COFA_NSQ | cofa_nsq | Reference | | No | FK to T_CREF_OPINION_FIN_AUDITS |
| COST_NSQ | cost_nsq | Reference | | No | FK to T_CREF_OPINION_SYSTEM_TYPES |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

### Create Unique Constraint

Create unique index on AUDIT_NSQ (one result per audit):

| Field | Value |
|-------|-------|
| Name | uk_aure_audit_nsq |
| Unique | true |
| Columns | audit_nsq |

---

## Table 2: T_AUDIT_RESULT_AMOUNTS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_RESULT_AMOUNTS |
| Name | t_audit_result_amounts |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| AURA_NSQ | aura_nsq | Integer | | Yes | Primary key |
| AURE_NSQ | aure_nsq | Reference | | Yes | FK to T_AUDIT_RESULTS (unique) |
| CCUR_USED_NSQ | ccur_used_nsq | Reference | | Yes | FK to T_CREF_CURRENCIES (currency used) |
| CCUR_CUR_RECOVERY_NSQ | ccur_cur_recovery_nsq | Reference | | No | FK to T_CREF_CURRENCIES (recovery currency) |
| AURA_EXCH_RATE_USED | aura_exch_rate_used | Decimal | | No | Exchange rate used |
| AURA_EXCH_RATE_MONTH_LIB | aura_exch_rate_month_lib | String | 10 | No | Exchange rate month (YYYY-MM) |
| CERS_NSQ | cers_nsq | Reference | | No | FK to T_CREF_EXCHANGE_RATE_SOURCES |
| CAUT_NSQ | caut_nsq | Reference | | No | FK to T_CREF_AUDIT_TIMINGS |
| AURA_CUR_COMMENT_LIB | aura_cur_comment_lib | String | 4000 | No | Currency comment |
| AURA_TOT_EXPENSES_NUM | aura_tot_expenses_num | Decimal | | No | Total expenses |
| AURA_INELIGIBLE_EXP_NUM | aura_ineligible_exp_num | Decimal | | No | Ineligible expenses |
| AURA_QUEST_EXP_NUM | aura_quest_exp_num | Decimal | | No | Questionable expenses |
| AURA_INELIGIBLE_EXP_NUM_2 | aura_ineligible_exp_num_2 | Decimal | | No | Ineligible per decision |
| AURA_REPORT_COM_LIB | aura_report_com_lib | String | 4000 | No | Report comment |
| AURA_DECISION_COM_LIB | aura_decision_com_lib | String | 4000 | No | Decision comment |
| AURA_AMT_TO_REC_02_NUM | aura_amt_to_rec_02_num | Decimal | | No | Amount to recover (type 02) |
| AURA_AMT_TO_REC_04_NUM | aura_amt_to_rec_04_num | Decimal | | No | Amount to recover (type 04) |
| AURA_AMT_TO_REC_02_COM_LIB | aura_amt_to_rec_02_com_lib | String | 4000 | No | Recovery 02 comment |
| AURA_AMT_TO_REC_04_COM_LIB | aura_amt_to_rec_04_com_lib | String | 4000 | No | Recovery 04 comment |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

### Create Unique Constraint

Create unique index on AURE_NSQ (one amount record per result):

| Field | Value |
|-------|-------|
| Name | uk_aura_aure_nsq |
| Unique | true |
| Columns | aure_nsq |

---

## Table 3: T_AUDIT_RESULT_FINDINGS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_RESULT_FINDINGS |
| Name | t_audit_result_findings |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ARFI_NSQ | arfi_nsq | Integer | | Yes | Primary key |
| AURE_NSQ | aure_nsq | Reference | | Yes | FK to T_AUDIT_RESULTS |
| AFDE_NSQ | afde_nsq | Reference | | Yes | FK to T_AUDIT_FINDINGS_DETAILS |
| ARFI_INELI_EXP_NUM | arfi_ineli_exp_num | Integer | | No | Ineligible expense count |
| ARFI_QUEST_EXP_NUM | arfi_quest_exp_num | Integer | | No | Questionable expense count |
| ARFI_AMT_INE_EXP_NUM | arfi_amt_ine_exp_num | Decimal | | No | Ineligible amount |
| ARFI_AMT_QUEST_EXP_NUM | arfi_amt_quest_exp_num | Decimal | | No | Questionable amount |
| ARFI_PRIORITY_1_NUM | arfi_priority_1_num | Integer | | No | Priority 1 count |
| ARFI_PRIORITY_2_NUM | arfi_priority_2_num | Integer | | No | Priority 2 count |
| ARFI_PRIORITY_3_NUM | arfi_priority_3_num | Integer | | No | Priority 3 count |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 4: T_AUDIT_RESULT_PILLARS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_RESULT_PILLARS |
| Name | t_audit_result_pillars |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ARPI_NSQ | arpi_nsq | Integer | | Yes | Primary key |
| AURE_NSQ | aure_nsq | Reference | | Yes | FK to T_AUDIT_RESULTS |
| APDE_NSQ | apde_nsq | Reference | | Yes | FK to T_AUDIT_PILLAR_DETAILS |
| ARPI_ANALYSIS_SWI | arpi_analysis_swi | True/False | | No | Part of analysis? |
| ARPI_CONCLUSION_SWI | arpi_conclusion_swi | True/False | | No | Concluded? |
| ARPI_COMMENT_LIB | arpi_comment_lib | String | 4000 | No | Comment |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Configure Relationships

### Set Up Cascade Delete

For child tables, configure cascade delete so when a parent is deleted, children are also deleted:

1. Open each child table's dictionary entry
2. Find the reference field to parent
3. Set "Delete" attribute to "Cascade"

**For T_AUDIT_RESULTS:**
- When audit is deleted, delete results

**For T_AUDIT_RESULT_AMOUNTS, T_AUDIT_RESULT_FINDINGS, T_AUDIT_RESULT_PILLARS:**
- When audit_result is deleted, delete these records

---

## Verification Script

Run this in "Scripts - Background" to verify all result tables:

```javascript
// Verify result tables exist with original Oracle column names
var tables = {
    'x_1936206_audit_t_audit_results': [
        'aure_nsq', 'audit_nsq', 'aure_opi_audit_com_lib', 
        'aure_add_obj_swi', 'cosa_nsq', 'cofa_nsq', 'cost_nsq'
    ],
    'x_1936206_audit_t_audit_result_amounts': [
        'aura_nsq', 'aure_nsq', 'ccur_used_nsq', 'aura_exch_rate_used',
        'aura_tot_expenses_num', 'aura_ineligible_exp_num', 'aura_quest_exp_num'
    ],
    'x_1936206_audit_t_audit_result_findings': [
        'arfi_nsq', 'aure_nsq', 'afde_nsq', 'arfi_ineli_exp_num',
        'arfi_priority_1_num', 'arfi_priority_2_num', 'arfi_priority_3_num'
    ],
    'x_1936206_audit_t_audit_result_pillars': [
        'arpi_nsq', 'aure_nsq', 'apde_nsq', 'arpi_analysis_swi',
        'arpi_conclusion_swi', 'arpi_comment_lib'
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

✅ Created T_AUDIT_RESULTS table with original Oracle columns
✅ Created T_AUDIT_RESULT_AMOUNTS table with financial fields
✅ Created T_AUDIT_RESULT_FINDINGS table with finding details
✅ Created T_AUDIT_RESULT_PILLARS table with pillar assessments
✅ Configured parent-child relationships with cascade delete
✅ Created unique constraints matching Oracle DDL

## Next Step

Proceed to Task 1.4: Create checklist tables (T_AUDIT_CHECKLISTS, T_AUDIT_CHECKLIST_MASTERS, T_AUDIT_CHECKLIST_DETAILS)
