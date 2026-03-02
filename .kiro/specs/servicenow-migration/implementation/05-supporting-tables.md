# Task 1.5: Create Supporting Tables

## Overview

Create supporting tables (matching original Oracle DDL):
1. `T_PERSON_IN_CHARGES` - Role assignments
2. `T_VISAS` - Approval records
3. `T_DOCUMENTS` - Document references
4. `T_AUDIT_NON_FINANCIAL_ACTIONS` - Non-financial actions
5. `T_AUDIT_RECOVERY_ACTIONS` - Financial recovery
6. `T_AUDIT_VALIDATION_MSGS` - Validation messages
7. `T_AUDITED_CONTRACT_LINKS` - Contract links

---

## Table 1: T_PERSON_IN_CHARGES

### Create Table

| Field | Value |
|-------|-------|
| Label | T_PERSON_IN_CHARGES |
| Name | t_person_in_charges |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| PINC_NSQ | pinc_nsq | Integer | | Yes | Primary key |
| AUDI_AUDIT_NSQ | audi_audit_nsq | Reference | | Yes | FK to T_AUDITS |
| PINC_LOGIN_LIB | pinc_login_lib | String | 400 | No | Login code of person |
| CAUR_NSQ | caur_nsq | Reference | | No | FK to T_CREF_AUDIT_ROLES |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 2: T_VISAS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_VISAS |
| Name | t_visas |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| VISA_NSQ | visa_nsq | Integer | | Yes | Primary key |
| AUDI_AUDIT_NSQ | audi_audit_nsq | Reference | | Yes | FK to T_AUDITS |
| CAVS_NSQ | cavs_nsq | Reference | | Yes | FK to T_CREF_AUDIT_VISA_STEPS |
| CAVD_NSQ | cavd_nsq | Reference | | Yes | FK to T_CREF_AUDIT_VISA_DECISIONS |
| VISA_VISA_DATE_DAT | visa_visa_date_dat | Date/Time | | No | Date of the visa |
| VISA_VISA_COMMENT_LIB | visa_visa_comment_lib | String | 4000 | No | Comment on the visa |
| VISA_LOGIN_USR_LIB | visa_login_usr_lib | String | 400 | No | User login |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 3: T_DOCUMENTS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_DOCUMENTS |
| Name | t_documents |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| DOCU_NSQ | docu_nsq | Integer | | Yes | Primary key |
| AUDIT_NSQ | audit_nsq | Reference | | Yes | FK to T_AUDITS |
| AUDO_NSQ | audo_nsq | Reference | | No | FK to T_CREF_AUDIT_DOCUMENTS |
| DOCU_DOCUMENT_TITLE_LIB | docu_document_title_lib | String | 250 | No | Document title |
| DOCU_DOCUMENT_DATE_DAT | docu_document_date_dat | Date | | No | Document date |
| DOCU_CRIS_REF_NUM | docu_cris_ref_num | Integer | | No | CRIS reference |
| DOCU_DOC_FILE_CLB | docu_doc_file_clb | String | 4000 | No | File reference (use Attachment in SN) |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

**Note:** For actual file storage, use ServiceNow's built-in Attachment functionality instead of CLOB.

---

## Table 4: T_AUDIT_NON_FINANCIAL_ACTIONS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_NON_FINANCIAL_ACTIONS |
| Name | t_audit_non_financial_actions |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ANFA_NSQ | anfa_nsq | Integer | | Yes | Primary key |
| AURE_NSQ | aure_nsq | Reference | | Yes | FK to T_AUDIT_RESULTS |
| ANFA_ACTION_LIB | anfa_action_lib | String | 250 | No | Action description |
| ANFA_ACTION_REALIZED_SWI | anfa_action_realized_swi | True/False | | No | Action realized? |
| ANFA_ACTION_COMMENT_LIB | anfa_action_comment_lib | String | 4000 | No | Comment on action |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 5: T_AUDITED_CONTRACT_LINKS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDITED_CONTRACT_LINKS |
| Name | t_audited_contract_links |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ACLI_NSQ | acli_nsq | Integer | | Yes | Primary key |
| AUDIT_NSQ | audit_nsq | Reference | | Yes | FK to T_AUDITS |
| ACLI_CONTRACT_ID_NUM | acli_contract_id_num | Integer | | Yes | Contract ID (CRIS) |
| ACLI_LEGAL_COMM_ID_NUM | acli_legal_comm_id_num | String | 255 | No | Legal commitment (ABAC) |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 6: T_AUDIT_RECOVERY_ACTIONS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_RECOVERY_ACTIONS |
| Name | t_audit_recovery_actions |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| ARAC_NSQ | arac_nsq | Integer | | Yes | Primary key |
| AURA_NSQ | aura_nsq | Reference | | Yes | FK to T_AUDIT_RESULT_AMOUNTS |
| ACLI_NSQ | acli_nsq | Reference | | Yes | FK to T_AUDITED_CONTRACT_LINKS |
| ARAC_AMOUNT_TO_RECOVER_NUM | arac_amount_to_recover_num | Decimal | | No | Amount to recover |
| RECO_NSQ | reco_nsq | String | 255 | No | Recovery order (ABAC) |
| CRNT_NSQ | crnt_nsq | String | 255 | No | Credit note (ABAC) |
| INV_NSQ | inv_nsq | String | 255 | No | Invoice (ABAC) |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 7: T_AUDIT_VALIDATION_MSGS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_VALIDATION_MSGS |
| Name | t_audit_validation_msgs |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| AVMS_NSQ | avms_nsq | Integer | | Yes | Primary key |
| AUDI_AUDIT_NSQ | audi_audit_nsq | Reference | | Yes | FK to T_AUDITS |
| AVMS_CODE_LIB | avms_code_lib | String | 255 | Yes | Message code |
| AVMS_LVL_LIB | avms_lvl_lib | String | 255 | Yes | Level (ERROR/WARNING/INFO) |
| AVMS_TYPE_LIB | avms_type_lib | String | 255 | Yes | Validation type |
| AVMS_DESCRIPTION_LIB | avms_description_lib | String | 2000 | No | Description |
| AVMS_MOD_DAT | avms_mod_dat | Date/Time | | No | Modification date |
| AVMS_MOD_USR_LIB | avms_mod_usr_lib | String | 30 | No | Modification user |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Verification Script

Run this in "Scripts - Background" to verify all supporting tables:

```javascript
// Verify all supporting tables with original Oracle column names
var tables = {
    'x_1936206_audit_t_person_in_charges': [
        'pinc_nsq', 'audi_audit_nsq', 'pinc_login_lib', 'caur_nsq'
    ],
    'x_1936206_audit_t_visas': [
        'visa_nsq', 'audi_audit_nsq', 'cavs_nsq', 'cavd_nsq',
        'visa_visa_date_dat', 'visa_visa_comment_lib', 'visa_login_usr_lib'
    ],
    'x_1936206_audit_t_documents': [
        'docu_nsq', 'audit_nsq', 'audo_nsq', 'docu_document_title_lib',
        'docu_document_date_dat', 'docu_cris_ref_num'
    ],
    'x_1936206_audit_t_audit_non_financial_actions': [
        'anfa_nsq', 'aure_nsq', 'anfa_action_lib', 
        'anfa_action_realized_swi', 'anfa_action_comment_lib'
    ],
    'x_1936206_audit_t_audited_contract_links': [
        'acli_nsq', 'audit_nsq', 'acli_contract_id_num', 'acli_legal_comm_id_num'
    ],
    'x_1936206_audit_t_audit_recovery_actions': [
        'arac_nsq', 'aura_nsq', 'acli_nsq', 'arac_amount_to_recover_num',
        'reco_nsq', 'crnt_nsq', 'inv_nsq'
    ],
    'x_1936206_audit_t_audit_validation_msgs': [
        'avms_nsq', 'audi_audit_nsq', 'avms_code_lib', 'avms_lvl_lib',
        'avms_type_lib', 'avms_description_lib'
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

✅ Created T_PERSON_IN_CHARGES for role assignments
✅ Created T_VISAS for approval records
✅ Created T_DOCUMENTS for document references
✅ Created T_AUDIT_NON_FINANCIAL_ACTIONS for non-financial actions
✅ Created T_AUDITED_CONTRACT_LINKS for contract links
✅ Created T_AUDIT_RECOVERY_ACTIONS for financial recovery
✅ Created T_AUDIT_VALIDATION_MSGS for validation messages
✅ All tables use original Oracle column names

## Task 1 Complete!

You have completed Task 1: Create Application Scope and Core Tables.

## Next Step

Proceed to Task 2: Create Template and Reference Data Tables (T_CREF_* tables)
