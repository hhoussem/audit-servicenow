# Task 1.1: Create Scoped Application

## Step-by-Step Instructions

### Prerequisites
- ServiceNow PDI instance is running
- You're logged in as admin

---

## Create the Application

### Option A: Using Studio (Recommended)

1. **Open Studio**
   - In the Application Navigator (left sidebar), type "Studio"
   - Click "Studio" - it opens in a new browser tab

2. **Create New Application**
   - Click "Create Application"
   - Select "Start from scratch"
   - Click "Continue"

3. **Fill Application Details**

   | Field | Value |
   |-------|-------|
   | Name | OPSYS Audit Management |
   | Scope | x_1936206_audit |
   | Description | OPSYS Audit Management System - Migrated from Java/Oracle/WebLogic |

4. **Configure Application Settings**
   - Click "Create"
   - Wait for the application to be created

5. **Set Application Properties**
   - In Studio, click on "Application Properties" (gear icon)
   - Set Version: 1.0.0
   - Save

### Option B: Using Application Manager

1. **Navigate to Application Manager**
   - Type "Application Manager" in navigator
   - Click "Application Manager"

2. **Create Custom Application**
   - Click "Create Custom Application"
   - Follow the wizard with same values as above

---

## Create Update Set

Before making any changes, create an update set to track your work:

1. **Navigate to Update Sets**
   - Type "Local Update Sets" in navigator
   - Click "System Update Sets > Local Update Sets"

2. **Create New Update Set**
   - Click "New"
   - Fill in:
     | Field | Value |
     |-------|-------|
     | Name | OPSYS Audit - Core Tables v1.0 |
     | Application | OPSYS Audit Management |
     | Description | Initial table structure for audit management |
   - Click "Submit"

3. **Make It Current**
   - Open the update set you just created
   - Click "Make This My Current Update Set"

---

## Configure Application Properties

After creating the application, set up system properties:

1. **Navigate to System Properties**
   - In Studio, right-click your application
   - Select "Create Application File"
   - Choose "System Property" > "System Property"

2. **Create Properties**

   Create these properties for external integrations:

   | Name | Value | Description |
   |------|-------|-------------|
   | x_1936206_audit.cris.endpoint | https://cris.example.ec.europa.eu/api | CRIS REST API endpoint |
   | x_1936206_audit.summa.endpoint | https://summa.example.ec.europa.eu/api | SUMMA REST API endpoint |
   | x_1936206_audit.hrs.endpoint | https://hrs.example.ec.europa.eu/api | HRS REST API endpoint |
   | x_1936206_audit.default.year | (leave empty) | Default audit year (uses current if empty) |

---

## Verify Application Creation

1. **Check Application Scope**
   - Type "Applications" in navigator
   - Find "OPSYS Audit Management"
   - Verify scope is `x_1936206_audit`

2. **Check in Studio**
   - Your application should appear in Studio's application list
   - All files you create will be under this application

---

## What You've Accomplished

✅ Created scoped application `x_1936206_audit`
✅ Set up update set for version control
✅ Configured application properties

## Important: Table Naming Convention

This migration preserves the original Oracle table and column names. Tables will be created as:
- `x_1936206_audit_t_audits` (from Oracle `T_AUDITS`)
- `x_1936206_audit_t_audit_results` (from Oracle `T_AUDIT_RESULTS`)
- `x_1936206_audit_t_cref_audit_types` (from Oracle `T_CREF_AUDIT_TYPES`)
- etc.

Column names also match the original Oracle DDL (e.g., `audi_audit_nsq`, `audi_audit_title_lib`).

## Next Step

Proceed to Task 1.2: Create the main audit table `T_AUDITS` (x_1936206_audit_t_audits)
