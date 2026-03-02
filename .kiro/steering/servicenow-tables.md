---
inclusion: fileMatch
fileMatchPattern: "**/implementation/*.md"
---

# ServiceNow Table Implementation Guide

When creating or modifying ServiceNow tables for this project, follow these conventions.

## Table Creation Checklist

1. Create table in Studio under `x_1936206_audit` scope
2. Use Oracle table name as label (e.g., `T_AUDITS`)
3. ServiceNow auto-prefixes with scope: `x_1936206_audit_t_audits`
4. Add all columns matching Oracle DDL specification
5. Configure reference fields to appropriate reference tables
6. Set up auto-numbering where applicable
7. Create unique constraints as defined in Oracle DDL
8. Set default values for standard audit fields

## Standard Audit Columns

Every table should include these audit columns:
```
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| optimistic_lock | Integer | 0 | Concurrency control |
| usr_cre | String(50) | | Created by user |
| cre_dat | Date/Time | | Creation timestamp |
| usr_upd | String(50) | | Updated by user |
| upd_dat | Date/Time | | Update timestamp |
```

## Reference Table Pattern (T_CREF_*)

All reference tables follow this structure:
```
| Column | Type | Notes |
|--------|------|-------|
| [prefix]_nsq | Integer | Primary key |
| [prefix]_code_cod | String | Unique code |
| [prefix]_label_fr_lib | String | French label |
| [prefix]_label_en_lib | String | English label |
| [prefix]_beg_dat | Date | Validity start |
| [prefix]_end_dat | Date | Validity end |
| [prefix]_val_swi | True/False | Currently valid |
```

## Column Type Mapping

| Oracle Type | ServiceNow Type |
|-------------|-----------------|
| NUMBER (integer) | Integer |
| NUMBER (decimal) | Decimal |
| VARCHAR2 | String |
| DATE | Date |
| TIMESTAMP | Date/Time |
| CHAR(1) for Y/N | True/False |
| Foreign Key | Reference |

## Verification Script Template

```javascript
// Verify table exists and has required columns
var gr = new GlideRecord('x_1936206_audit_[table_name]');
if (gr.isValid()) {
    gs.info('✓ Table exists');
    var columns = ['col1', 'col2', 'col3'];
    columns.forEach(function(col) {
        if (gr.isValidField(col)) {
            gs.info('  ✓ Column: ' + col);
        } else {
            gs.error('  ✗ Missing: ' + col);
        }
    });
} else {
    gs.error('✗ Table does not exist');
}
```
