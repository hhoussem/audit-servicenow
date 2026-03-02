# Task 1.2: Create Core Audit Table (T_AUDITS)

## Create T_AUDITS Table

### Step 1: Create the Table

1. **In Studio**, right-click your application
2. Select "Create Application File"
3. Choose "Data Model" > "Table"
4. Click "Create"

5. **Fill Table Details:**

   | Field | Value |
   |-------|-------|
   | Label | T_AUDITS |
   | Name | t_audits (will become x_1936206_audit_t_audits) |
   | Extends table | None |
   | Add module to menu | Yes |
   | Create access controls | Yes |

6. Click "Submit"

---

### Step 2: Add Columns

After creating the table, add these columns matching the original Oracle DDL. In Studio, click on your table and use the "Columns" related list.

#### Primary Key and Basic Fields

| Column Label | Column Name | Type | Max Length | Mandatory | Notes |
|--------------|-------------|------|------------|-----------|-------|
| AUDI_AUDIT_NSQ | audi_audit_nsq | Integer | | Yes | Primary key (auto-generated) |
| AUDI_AUDIT_NUMBER_NUM | audi_audit_number_num | Integer | | Yes | Unique audit number |
| AUDI_AUDIT_YEAR_NUM | audi_audit_year_num | Integer | | No | Year audit was created |
| AUDI_AUDIT_PLAN_NUM | audi_audit_plan_num | Integer | | No | Year of audit plan |
| AUDI_AUDIT_TITLE_LIB | audi_audit_title_lib | String | 4000 | No | Title describing the audit |
| AUDI_AUDIT_VERSION_NUM | audi_audit_version_num | Integer | | No | Audit version |
| AUDI_COMMENT_LIB | audi_comment_lib | String | 4000 | No | General comment |
| AUDI_MIGRATED_SWI | audi_migrated_swi | True/False | | No | Migrated from old IS |

#### Initial Audit Plan Fields

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| AUDI_INITIAL_AUDIT_PLAN_SWI | audi_initial_audit_plan_swi | True/False | | Part of initial audit plan? |
| AUDI_ADDITION_REASON_COM_LIB | audi_addition_reason_com_lib | String | 4000 | Reason not in initial plan |
| AUDI_AUDIT_REASON_COMMENT_LIB | audi_audit_reason_comment_lib | String | 4000 | Audit reason comment |
| AUDI_CANCEL_REASON_COM_LIB | audi_cancel_reason_com_lib | String | 4000 | Cancellation reason comment |

#### Final Report Fields

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| AUDI_FINAL_REP_WITHOUT_RES_SWI | audi_final_rep_without_res_swi | True/False | | Final report without result |
| AUDI_FINAL_REP_SCOPE_LIM_LIB | audi_final_rep_scope_lim_lib | String | 4000 | Scope limitation comment |
| AUDI_FIN_REP_WITH_SCP_LIM_SWI | audi_fin_rep_with_scp_lim_swi | True/False | | Final report with scope limitation |

#### Contract Fields

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| AUDI_CONTRACT_ID_NUM | audi_contract_id_num | Integer | | Link to audited contract (CRIS) |
| AUDI_CONTRACT_BUDGET_NUM | audi_contract_budget_num | Decimal | | Budget of audit contract |
| AUDI_CONT_ACTUAL_COST_NUM | audi_cont_actual_cost_num | Decimal | | Actual cost |
| AUCO_AUDIT_CONTRACT_ID_NSQ | auco_audit_contract_id_nsq | Integer | | Audit contract (ABAC) |

#### Date Fields

| Column Label | Column Name | Type | Notes |
|--------------|-------------|------|-------|
| AUDI_REQUEST_FOR_SERVICE_DAT | audi_request_for_service_dat | Date | Request for service date |
| AUDI_SIGNATURE_ORDER_DAT | audi_signature_order_dat | Date | Order form signature date |
| AUDI_LETTER_DAT | audi_letter_dat | Date | Notification letter date |
| AUDI_FIELD_WORK_STARTED_DAT | audi_field_work_started_dat | Date | Field work start |
| AUDI_FIELD_WORK_ENDED_DAT | audi_field_work_ended_dat | Date | Field work end |
| AUDI_RECEIPT_DRAFT_REPORT_DAT | audi_receipt_draft_report_dat | Date | Draft report received |
| AUDI_RECEIPT_PRE_FIN_REP_DAT | audi_receipt_pre_fin_rep_dat | Date | Pre-final report received |
| AUDI_RECEIPT_FINAL_REPORT_DAT | audi_receipt_final_report_dat | Date | Final report received |
| AUDI_PERIOD_START_DATE_DAT | audi_period_start_date_dat | Date | Audit period start |
| AUDI_PERIOD_END_DATE_DAT | audi_period_end_date_dat | Date | Audit period end |

#### Reference Fields (Foreign Keys)

| Column Label | Column Name | Type | Reference Table | Notes |
|--------------|-------------|------|-----------------|-------|
| CAUT_NSQ | caut_nsq | Reference | x_1936206_audit_t_cref_audit_types | Audit type (mandatory) |
| CAUS_NSQ | caus_nsq | Reference | x_1936206_audit_t_cref_audit_status | Audit status (mandatory) |
| CARE_NSQ | care_nsq | Reference | x_1936206_audit_t_cref_audit_reasons | Audit reason |
| CRAD_NSQ | crad_nsq | Reference | x_1936206_audit_t_cref_reason_additions | Reason not in initial plan |
| CACR_NSQ | cacr_nsq | Reference | x_1936206_audit_t_cref_audit_cancel_reasons | Cancellation reason |
| CDIR_NSQ | cdir_nsq | Reference | x_1936206_audit_t_cref_directorates | Directorate in charge |
| CUNI_NSQ | cuni_nsq | Reference | x_1936206_audit_t_cref_units | Unit in charge |
| CDEL_NSQ | cdel_nsq | Reference | x_1936206_audit_t_cref_delegations | Delegation in charge |

#### ABAC Reference Fields

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| ENTT_ABAC_REF_ID_LIB | entt_abac_ref_id_lib | String | 255 | Legal entity (ABAC) |
| AUDIT_ABAC_REF_ID_LIB | audit_abac_ref_id_lib | String | 255 | Audit (ABAC) |
| LCM_ABAC_REF_ID_LIB | lcm_abac_ref_id_lib | String | 255 | Legal commitment (ABAC) |

#### Audit Fields (Standard)

| Column Label | Column Name | Type | Max Length | Notes |
|--------------|-------------|------|------------|-------|
| OPTIMISTIC_LOCK | optimistic_lock | Integer | | Default: 0 |
| USR_CRE | usr_cre | String | 50 | Created by user |
| CRE_DAT | cre_dat | Date/Time | | Creation date |
| USR_UPD | usr_upd | String | 50 | Updated by user |
| UPD_DAT | upd_dat | Date/Time | | Update date |

---

### Step 3: Configure Auto-Number

1. **Navigate to Number Maintenance**
   - Type "Number Maintenance" in navigator
   - Click "System Definition > Number Maintenance"

2. **Create Number Record**
   - Click "New"
   - Fill in:
   
   | Field | Value |
   |-------|-------|
   | Table | T_AUDITS [x_1936206_audit_t_audits] |
   | Number | AUDI_AUDIT_NUMBER_NUM |
   | Prefix | AUD |
   | Number of digits | 7 |
   | Maximum number | 9999999 |

3. Click "Submit"

---

### Step 4: Set Default Values

1. **Open the table definition**
   - In Studio, click on x_1936206_audit_t_audits table

2. **Set defaults on columns:**

   For **audi_audit_year_num** column:
   - Click on the column
   - Set Default value: `javascript:new Date().getFullYear()`

   For **optimistic_lock** column:
   - Click on the column
   - Set Default value: `0`

   For **audi_migrated_swi** column:
   - Click on the column
   - Set Default value: `false`

---

### Step 5: Create Unique Constraint

The original Oracle DDL has a unique constraint on AUDI_AUDIT_NUMBER_NUM:

1. Navigate to "System Definition > Tables"
2. Find x_1936206_audit_t_audits
3. Click on "Indexes" related list
4. Create new index:

   | Field | Value |
   |-------|-------|
   | Name | ux_audi_audit_number_num |
   | Unique | true |
   | Columns | audi_audit_number_num |

---

### Step 6: Test the Table

1. **Open the table form**
   - Type "x_1936206_audit_t_audits.list" in navigator
   - Or find "T_AUDITS" in your application menu

2. **Create a test record**
   - Click "New"
   - Fill in required fields:
     - AUDI_AUDIT_TITLE_LIB: "Test Audit 2026"
     - CAUT_NSQ: (select an audit type)
     - CAUS_NSQ: (select a status)
   - Click "Submit"

3. **Verify**
   - AUDI_AUDIT_NUMBER_NUM should be auto-generated
   - AUDI_AUDIT_YEAR_NUM should default to current year
   - OPTIMISTIC_LOCK should default to 0

---

## Quick Verification Script

Run this in "Scripts - Background" to verify the table:

```javascript
// Verify T_AUDITS table
var gr = new GlideRecord('x_1936206_audit_t_audits');
if (gr.isValid()) {
    gs.info('✓ T_AUDITS table exists');
    
    // Check key columns
    var columns = [
        'audi_audit_nsq', 'audi_audit_number_num', 'audi_audit_year_num',
        'audi_audit_title_lib', 'caut_nsq', 'caus_nsq', 'care_nsq',
        'audi_period_start_date_dat', 'audi_period_end_date_dat',
        'usr_cre', 'cre_dat', 'usr_upd', 'upd_dat'
    ];
    columns.forEach(function(col) {
        if (gr.isValidField(col)) {
            gs.info('  ✓ Column: ' + col);
        } else {
            gs.error('  ✗ Missing column: ' + col);
        }
    });
} else {
    gs.error('✗ T_AUDITS table does not exist');
}
```

---

## What You've Accomplished

✅ Created T_AUDITS table with all original Oracle columns
✅ Configured auto-numbering for AUDI_AUDIT_NUMBER_NUM
✅ Set up default values for year and optimistic_lock
✅ Created unique constraint on audit number
✅ Tested table creation

## Next Step

Proceed to Task 1.3: Create audit result tables (T_AUDIT_RESULTS, T_AUDIT_RESULT_AMOUNTS, etc.)
