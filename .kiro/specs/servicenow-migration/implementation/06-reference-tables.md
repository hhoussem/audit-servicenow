# Task 2.1: Create Reference Data Tables (T_CREF_*)

## Overview

Create reference/lookup tables (matching original Oracle DDL). These tables store code values used throughout the application.

All T_CREF_* tables share a common structure:
- Primary key (NSQ)
- Code (COD)
- Labels in French and English (LIB)
- Validity dates (BEG_DAT, END_DAT)
- Valid switch (VAL_SWI)
- Audit fields (USR_CRE, CRE_DAT, USR_UPD, UPD_DAT, LAST_INS_DAT)

---

## Common Column Template

Use this template for all T_CREF_* tables:

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| [PREFIX]_NSQ | [prefix]_nsq | Integer | | Primary key |
| [PREFIX]_CODE_COD | [prefix]_code_cod | String | 15 | Code value |
| [PREFIX]_LABEL_FR_LIB | [prefix]_label_fr_lib | String | 250 | French label |
| [PREFIX]_LABEL_EN_LIB | [prefix]_label_en_lib | String | 250 | English label |
| [PREFIX]_BEG_DAT | [prefix]_beg_dat | Date | | Valid from |
| [PREFIX]_END_DAT | [prefix]_end_dat | Date | | Valid until |
| [PREFIX]_VAL_SWI | [prefix]_val_swi | True/False | | Is valid? |
| USR_CRE | usr_cre | String | 50 | Created by |
| CRE_DAT | cre_dat | Date/Time | | Creation date |
| USR_UPD | usr_upd | String | 50 | Updated by |
| UPD_DAT | upd_dat | Date/Time | | Update date |
| LAST_INS_DAT | last_ins_dat | Date | | Last insert date |

---

## Table 1: T_CREF_AUDIT_TYPES

Audit type codes (AUTY)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_TYPES |
| Name | t_cref_audit_types |

### Additional Column

| Column Label | Column Name | Type | Notes |
|--------------|-------------|------|-------|
| CCAT_NSQ | ccat_nsq | Reference | FK to T_CREF_CATEGORIES |

---

## Table 2: T_CREF_AUDIT_STATUS

Audit status codes (AUST)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_STATUS |
| Name | t_cref_audit_status |

Prefix: CAUS

---

## Table 3: T_CREF_AUDIT_REASONS

Audit reason codes (REAU)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_REASONS |
| Name | t_cref_audit_reasons |

Prefix: CARE

---

## Table 4: T_CREF_AUDIT_CANCEL_REASONS

Audit cancellation reason codes (AUCR)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_CANCEL_REASONS |
| Name | t_cref_audit_cancel_reasons |

Prefix: CACR

---

## Table 5: T_CREF_REASON_ADDITIONS

Audit addition reason codes (AUAR)

| Field | Value |
|-------|-------|
| Label | T_CREF_REASON_ADDITIONS |
| Name | t_cref_reason_additions |

Prefix: CRAD

---

## Table 6: T_CREF_AUDIT_ROLES

Audit role codes (AURO)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_ROLES |
| Name | t_cref_audit_roles |

Prefix: CAUR

---

## Table 7: T_CREF_AUDIT_VISA_STEPS

Visa step codes (AUVS)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_VISA_STEPS |
| Name | t_cref_audit_visa_steps |

Prefix: CAVS

---

## Table 8: T_CREF_AUDIT_VISA_DECISIONS

Visa decision codes (AUVD)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_VISA_DECISIONS |
| Name | t_cref_audit_visa_decisions |

Prefix: CAVD

---

## Table 9: T_CREF_AUDIT_TIMINGS

Audit timing codes (AUTM)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_TIMINGS |
| Name | t_cref_audit_timings |

Prefix: CATI

---

## Table 10: T_CREF_CURRENCIES

Currency codes

| Field | Value |
|-------|-------|
| Label | T_CREF_CURRENCIES |
| Name | t_cref_currencies |

### Columns (Different Structure)

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| CCUR_NSQ | ccur_nsq | Integer | | Primary key |
| CCUR_CURRENCY_COD | ccur_currency_cod | String | 10 | Currency code (EUR, USD, etc.) |
| CCUR_BEG_DAT | ccur_beg_dat | Date | | Valid from |
| CCUR_END_DAT | ccur_end_dat | Date | | Valid until |
| CCUR_VAL_SWI | ccur_val_swi | True/False | | Is valid? |

---

## Table 11: T_CREF_EXCHANGE_RATE_SOURCES

Exchange rate source codes (ERSO)

| Field | Value |
|-------|-------|
| Label | T_CREF_EXCHANGE_RATE_SOURCES |
| Name | t_cref_exchange_rate_sources |

Prefix: CERS

---

## Table 12: T_CREF_OPINION_FIN_AUDITS

Financial audit opinion codes (OPFI)

| Field | Value |
|-------|-------|
| Label | T_CREF_OPINION_FIN_AUDITS |
| Name | t_cref_opinion_fin_audits |

Prefix: COFA

---

## Table 13: T_CREF_OPINION_SYS_AUDITS

System audit opinion codes (OPSY)

| Field | Value |
|-------|-------|
| Label | T_CREF_OPINION_SYS_AUDITS |
| Name | t_cref_opinion_sys_audits |

Prefix: COSA

---

## Table 14: T_CREF_OPINION_SYSTEM_TYPES

System opinion type codes (OPST)

| Field | Value |
|-------|-------|
| Label | T_CREF_OPINION_SYSTEM_TYPES |
| Name | t_cref_opinion_system_types |

Prefix: COST

---

## Table 15: T_CREF_AUDIT_DOCUMENTS

Document type codes (AUDO)

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_DOCUMENTS |
| Name | t_cref_audit_documents |

Prefix: AUDO

---

## Table 16: T_CREF_AUDIT_CHECK_GROUPS

Checklist group codes

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_CHECK_GROUPS |
| Name | t_cref_audit_check_groups |

Prefix: CCGR

---

## Table 17: T_CREF_AUDIT_FINDING_GROUPS

Finding group codes

| Field | Value |
|-------|-------|
| Label | T_CREF_AUDIT_FINDING_GROUPS |
| Name | t_cref_audit_finding_groups |

Prefix: CAFG

---

## Table 18: T_CREF_CATEGORIES

Category codes

| Field | Value |
|-------|-------|
| Label | T_CREF_CATEGORIES |
| Name | t_cref_categories |

Prefix: CCAT

---

## Table 19: T_CREF_DIRECTORATES

Directorate codes

| Field | Value |
|-------|-------|
| Label | T_CREF_DIRECTORATES |
| Name | t_cref_directorates |

### Columns (Different Structure)

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| CDIR_NSQ | cdir_nsq | Integer | | Primary key |
| CDIR_CODE_COD | cdir_code_cod | String | 40 | Directorate code |
| CDIR_FLG_UNIT | cdir_flg_unit | String | 1 | D=Directorate, U=Unit |
| CDIR_BEG_DAT | cdir_beg_dat | Date | | Valid from |
| CDIR_END_DAT | cdir_end_dat | Date | | Valid until |
| CDIR_VAL_SWI | cdir_val_swi | True/False | | Is valid? |

---

## Table 20: T_CREF_UNITS

Unit codes

| Field | Value |
|-------|-------|
| Label | T_CREF_UNITS |
| Name | t_cref_units |

### Columns

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| CUNI_NSQ | cuni_nsq | Integer | | Primary key |
| CUNI_CODE_COD | cuni_code_cod | String | 40 | Unit code |
| CUNI_FLG_UNIT | cuni_flg_unit | String | 1 | D=Directorate, U=Unit |
| CUNI_BEG_DAT | cuni_beg_dat | Date | | Valid from |
| CUNI_END_DAT | cuni_end_dat | Date | | Valid until |
| CUNI_VAL_SWI | cuni_val_swi | True/False | | Is valid? |

---

## Table 21: T_CREF_DELEGATIONS

Delegation codes

| Field | Value |
|-------|-------|
| Label | T_CREF_DELEGATIONS |
| Name | t_cref_delegations |

### Columns

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| CDEL_NSQ | cdel_nsq | Integer | | Primary key |
| CDEL_CODE_COD | cdel_code_cod | String | 40 | Delegation code |
| CDEL_FLG_UNIT | cdel_flg_unit | String | 1 | Flag |
| CDEL_BEG_DAT | cdel_beg_dat | Date | | Valid from |
| CDEL_END_DAT | cdel_end_dat | Date | | Valid until |
| CDEL_VAL_SWI | cdel_val_swi | True/False | | Is valid? |

---

## Verification Script

```javascript
// Verify all T_CREF_* reference tables
var refTables = [
    'x_1936206_audit_t_cref_audit_types',
    'x_1936206_audit_t_cref_audit_status',
    'x_1936206_audit_t_cref_audit_reasons',
    'x_1936206_audit_t_cref_audit_cancel_reasons',
    'x_1936206_audit_t_cref_reason_additions',
    'x_1936206_audit_t_cref_audit_roles',
    'x_1936206_audit_t_cref_audit_visa_steps',
    'x_1936206_audit_t_cref_audit_visa_decisions',
    'x_1936206_audit_t_cref_audit_timings',
    'x_1936206_audit_t_cref_currencies',
    'x_1936206_audit_t_cref_exchange_rate_sources',
    'x_1936206_audit_t_cref_opinion_fin_audits',
    'x_1936206_audit_t_cref_opinion_sys_audits',
    'x_1936206_audit_t_cref_opinion_system_types',
    'x_1936206_audit_t_cref_audit_documents',
    'x_1936206_audit_t_cref_audit_check_groups',
    'x_1936206_audit_t_cref_audit_finding_groups',
    'x_1936206_audit_t_cref_categories',
    'x_1936206_audit_t_cref_directorates',
    'x_1936206_audit_t_cref_units',
    'x_1936206_audit_t_cref_delegations'
];

refTables.forEach(function(tableName) {
    var gr = new GlideRecord(tableName);
    if (gr.isValid()) {
        gs.info('✓ Table exists: ' + tableName);
    } else {
        gs.error('✗ Table missing: ' + tableName);
    }
});
```

---

## What You've Accomplished

✅ Created 21 reference data tables (T_CREF_*)
✅ All tables use original Oracle column names
✅ Configured validity date fields for temporal data
✅ Set up bilingual labels (French/English)

## Next Step

Proceed to Task 2.2: Create Findings and Pillar Master/Detail Tables
