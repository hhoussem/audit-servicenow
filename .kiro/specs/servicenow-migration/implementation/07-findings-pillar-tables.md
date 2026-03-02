# Task 2.2: Create Findings and Pillar Master/Detail Tables

## Overview

Create master/detail tables for findings and pillars (matching original Oracle DDL):
1. `T_AUDIT_FINDINGS_MASTERS` - Finding template masters
2. `T_AUDIT_FINDINGS_DETAILS` - Finding template details
3. `T_AUDIT_PILLAR_MASTERS` - Pillar template masters
4. `T_AUDIT_PILLAR_DETAILS` - Pillar template details

---

## Table 1: T_AUDIT_FINDINGS_MASTERS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_FINDINGS_MASTERS |
| Name | t_audit_findings_masters |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| AFMA_NSQ | afma_nsq | Integer | | Yes | Primary key |
| AFMA_FINDING_GROUP_NUM | afma_finding_group_num | Integer | | No | Finding group number |
| AFMA_START_DAT | afma_start_dat | Date | | No | Start date of validity |
| CAFG_NSQ | cafg_nsq | Reference | | Yes | FK to T_CREF_AUDIT_FINDING_GROUPS |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

### Create Unique Constraint

| Field | Value |
|-------|-------|
| Name | uk_afma_find_group_date |
| Unique | true |
| Columns | afma_finding_group_num, afma_start_dat |

---

## Table 2: T_AUDIT_FINDINGS_DETAILS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_FINDINGS_DETAILS |
| Name | t_audit_findings_details |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| AFDE_NSQ | afde_nsq | Integer | | Yes | Primary key |
| AFMA_NSQ | afma_nsq | Reference | | Yes | FK to T_AUDIT_FINDINGS_MASTERS |
| AFDE_FINDING_NUM | afde_finding_num | Integer | | Yes | Finding number |
| AFDE_TEXT_FR_LIB | afde_text_fr_lib | String | 2000 | No | Finding text (French) |
| AFDE_TEXT_EN_LIB | afde_text_en_lib | String | 2000 | No | Finding text (English) |
| AFDE_GROUP_LIB | afde_group_lib | String | 10 | No | Finding group |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Table 3: T_AUDIT_PILLAR_MASTERS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_PILLAR_MASTERS |
| Name | t_audit_pillar_masters |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| APMA_NSQ | apma_nsq | Integer | | Yes | Primary key |
| APMA_START_DAT | apma_start_dat | Date | | No | Start date of validity |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

### Create Unique Constraint

| Field | Value |
|-------|-------|
| Name | uk_apma_start_dat |
| Unique | true |
| Columns | apma_start_dat |

---

## Table 4: T_AUDIT_PILLAR_DETAILS

### Create Table

| Field | Value |
|-------|-------|
| Label | T_AUDIT_PILLAR_DETAILS |
| Name | t_audit_pillar_details |

### Add Columns

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| APDE_NSQ | apde_nsq | Integer | | Yes | Primary key |
| APMA_NSQ | apma_nsq | Reference | | Yes | FK to T_AUDIT_PILLAR_MASTERS |
| APDE_PILLAR_NUM | apde_pillar_num | Integer | | No | Pillar number |
| APDE_TITLE_FR_LIB | apde_title_fr_lib | String | 50 | No | Pillar title (French) |
| APDE_TITLE_EN_LIB | apde_title_en_lib | String | 50 | No | Pillar title (English) |
| APDE_TEXT_FR_LIB | apde_text_fr_lib | String | 2000 | No | Pillar description (French) |
| APDE_TEXT_EN_LIB | apde_text_en_lib | String | 2000 | No | Pillar description (English) |
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | No | Default: 0 |
| USR_CRE | usr_cre | String | 50 | No | Created by |
| CRE_DAT | cre_dat | Date/Time | | No | Creation date |
| USR_UPD | usr_upd | String | 50 | No | Updated by |
| UPD_DAT | upd_dat | Date/Time | | No | Update date |

---

## Verification Script

```javascript
// Verify findings and pillar master/detail tables
var tables = {
    'x_1936206_audit_t_audit_findings_masters': [
        'afma_nsq', 'afma_finding_group_num', 'afma_start_dat', 'cafg_nsq'
    ],
    'x_1936206_audit_t_audit_findings_details': [
        'afde_nsq', 'afma_nsq', 'afde_finding_num', 
        'afde_text_fr_lib', 'afde_text_en_lib', 'afde_group_lib'
    ],
    'x_1936206_audit_t_audit_pillar_masters': [
        'apma_nsq', 'apma_start_dat'
    ],
    'x_1936206_audit_t_audit_pillar_details': [
        'apde_nsq', 'apma_nsq', 'apde_pillar_num',
        'apde_title_fr_lib', 'apde_title_en_lib',
        'apde_text_fr_lib', 'apde_text_en_lib'
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

✅ Created T_AUDIT_FINDINGS_MASTERS for finding templates
✅ Created T_AUDIT_FINDINGS_DETAILS for finding items
✅ Created T_AUDIT_PILLAR_MASTERS for pillar templates
✅ Created T_AUDIT_PILLAR_DETAILS for pillar items
✅ Configured unique constraints matching Oracle DDL
✅ All tables use original Oracle column names

## Next Step

Proceed to Task 3: Create Business Rules and Script Includes
