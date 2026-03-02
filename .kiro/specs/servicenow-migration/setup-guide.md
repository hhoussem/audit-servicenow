# ServiceNow Development Setup Guide

## For Java Developers New to ServiceNow

This guide will help you set up your ServiceNow development environment and understand the key differences from Java development.

---

## Step 1: Get a ServiceNow Developer Instance

ServiceNow provides free Personal Developer Instances (PDI) for learning and development.

### 1.1 Create a ServiceNow Developer Account

1. Go to: https://developer.servicenow.com/
2. Click "Sign Up" (top right)
3. Fill in your details and create an account
4. Verify your email

### 1.2 Request a Personal Developer Instance (PDI)

1. Log in to the Developer Portal
2. Click "Start Building" or go to "Manage Instance"
3. Click "Request Instance"
4. Select the latest release (e.g., "Washington DC" or "Xanadu")
5. Wait 5-10 minutes for provisioning
6. You'll receive instance URL like: `https://devXXXXX.service-now.com`

### 1.3 Access Your Instance

1. Note your instance URL, username (usually `admin`), and password
2. Navigate to your instance URL
3. Log in with the provided credentials
4. You're now in the ServiceNow platform!

---

## Step 2: Understand ServiceNow vs Java Development

| Java Concept | ServiceNow Equivalent |
|--------------|----------------------|
| Classes | Script Includes |
| Database Tables | Tables (created via UI or XML) |
| JPA/Hibernate | GlideRecord API |
| Spring Controllers | Business Rules, UI Actions |
| REST APIs | Scripted REST APIs |
| Maven/Gradle | Update Sets (version control) |
| IDE (IntelliJ/Eclipse) | ServiceNow Studio or Browser |
| Unit Tests (JUnit) | ATF (Automated Test Framework) |
| Workflows (Activiti) | Flow Designer |

### Key Differences:

1. **No local development** - Everything is done in the browser or ServiceNow Studio
2. **JavaScript, not Java** - Server-side scripting uses JavaScript (Rhino engine)
3. **No compilation** - Scripts run immediately after saving
4. **Built-in ORM** - GlideRecord handles all database operations
5. **Configuration over code** - Many features are configured, not coded

---

## Step 3: Navigate the ServiceNow Interface

### 3.1 Application Navigator (Left Sidebar)

The filter navigator lets you search for any module:
- Type "Tables" to find Table administration
- Type "Script" to find Script Includes
- Type "Studio" to open ServiceNow Studio

### 3.2 Key Modules for Development

| Module | How to Find | Purpose |
|--------|-------------|---------|
| System Definition > Tables | Type "Tables" | Create/modify tables |
| System Definition > Script Includes | Type "Script Include" | Create reusable classes |
| System Definition > Business Rules | Type "Business Rules" | Triggers on record changes |
| Flow Designer | Type "Flow Designer" | Visual workflow builder |
| Studio | Type "Studio" | IDE-like development environment |
| Update Sets | Type "Update Sets" | Version control |

---

## Step 4: Create Your First Scoped Application

ServiceNow applications are "scoped" to provide namespace isolation (like Java packages).

### 4.1 Open ServiceNow Studio

1. In the navigator, type "Studio"
2. Click "Studio" to open it (opens in new tab)
3. Click "Create Application"

### 4.2 Create the OPSYS Audit Application

Fill in the form:

| Field | Value |
|-------|-------|
| Name | OPSYS Audit Management |
| Scope | x_ec_audit |
| Description | OPSYS Audit Management System |
| Version | 1.0.0 |

Click "Create" - this creates your application scope.

### 4.3 Understanding Application Scope

- All tables will be prefixed with `x_ec_audit_`
- All scripts run in this scope by default
- Provides isolation from other applications
- Similar to Java package namespacing

---

## Step 5: Create Your First Table

### 5.1 Using Studio (Recommended)

1. In Studio, right-click on your application
2. Select "Create Application File"
3. Choose "Data Model" > "Table"
4. Click "Create"

### 5.2 Table Creation Form

For the main audit table:

| Field | Value |
|-------|-------|
| Label | Audit |
| Name | x_ec_audit_audit (auto-generated) |
| Extends table | Task [task] or None |
| Add module to menu | Yes |
| Create access controls | Yes |

### 5.3 Adding Columns

After creating the table, add columns:

1. Click on the table name in Studio
2. Click "New" in the Columns related list
3. Add each column with appropriate type

**Column Types in ServiceNow:**

| Java Type | ServiceNow Type |
|-----------|-----------------|
| String | String |
| Integer | Integer |
| Long | Long |
| BigDecimal | Decimal / Currency |
| Date | Date |
| DateTime | Date/Time |
| Boolean | True/False |
| Foreign Key | Reference |
| Enum | Choice |

---

## Step 6: GlideRecord - The ServiceNow ORM

GlideRecord is ServiceNow's equivalent to JPA/Hibernate.

### Java (JPA) vs ServiceNow (GlideRecord)

**Java - Find by ID:**
```java
Audit audit = entityManager.find(Audit.class, id);
```

**ServiceNow - Find by sys_id:**
```javascript
var gr = new GlideRecord('x_ec_audit_audit');
if (gr.get(sysId)) {
    gs.info('Found: ' + gr.title);
}
```

**Java - Query with criteria:**
```java
List<Audit> audits = entityManager
    .createQuery("SELECT a FROM Audit a WHERE a.status = :status")
    .setParameter("status", "ONGOING")
    .getResultList();
```

**ServiceNow - Query with conditions:**
```javascript
var gr = new GlideRecord('x_ec_audit_audit');
gr.addQuery('status', 'ONGOING');
gr.query();
while (gr.next()) {
    gs.info('Audit: ' + gr.number);
}
```

**Java - Create new record:**
```java
Audit audit = new Audit();
audit.setTitle("New Audit");
audit.setStatus("PROVISIONAL");
entityManager.persist(audit);
```

**ServiceNow - Create new record:**
```javascript
var gr = new GlideRecord('x_ec_audit_audit');
gr.initialize();
gr.title = 'New Audit';
gr.status = 'PROVISIONAL';
var sysId = gr.insert();
```

---

## Step 7: Script Includes - ServiceNow Classes

Script Includes are reusable server-side JavaScript classes.

### Java Class vs Script Include

**Java:**
```java
public class AuditService {
    private AuditRepository repository;
    
    public Audit createAudit(AuditDTO dto) {
        Audit audit = new Audit();
        audit.setTitle(dto.getTitle());
        return repository.save(audit);
    }
}
```

**ServiceNow Script Include:**
```javascript
var AuditService = Class.create();
AuditService.prototype = {
    initialize: function() {
        // Constructor
    },
    
    createAudit: function(title) {
        var gr = new GlideRecord('x_ec_audit_audit');
        gr.initialize();
        gr.title = title;
        gr.status = 'PROVISIONAL';
        return gr.insert();
    },
    
    type: 'AuditService'
};
```

---

## Step 8: Update Sets - Version Control

Update Sets are ServiceNow's version control mechanism.

### 8.1 Create an Update Set

1. Navigate to "System Update Sets" > "Local Update Sets"
2. Click "New"
3. Name: "OPSYS Audit - Initial Tables"
4. Click "Submit"
5. Click on the update set and click "Make This My Current Update Set"

### 8.2 How Update Sets Work

- All changes you make are captured in the current update set
- You can export update sets as XML files
- Import update sets to other instances
- Similar to Git commits, but for configuration

---

## Step 9: Development Workflow

### Recommended Workflow:

1. **Create Update Set** for your work
2. **Open Studio** for development
3. **Create/modify** tables, scripts, etc.
4. **Test** in the same instance
5. **Complete Update Set** when done
6. **Export** for deployment to other environments

### Testing Your Code:

1. **Background Scripts** - Quick testing (System Definition > Scripts - Background)
2. **ATF** - Automated Test Framework for formal tests
3. **Debug** - Use `gs.info()` or `gs.debug()` for logging

---

## Step 10: Useful ServiceNow APIs

### Global Objects:

| Object | Purpose | Java Equivalent |
|--------|---------|-----------------|
| `gs` | System utilities | System.out, Logger |
| `current` | Current record in Business Rules | this |
| `previous` | Previous values in Business Rules | - |
| `GlideRecord` | Database operations | EntityManager |
| `GlideDateTime` | Date/time operations | LocalDateTime |
| `GlideAggregate` | Aggregations (COUNT, SUM) | JPA Criteria |

### Common gs Methods:

```javascript
gs.info('Info message');           // Logging
gs.error('Error message');         // Error logging
gs.getUser().getID();              // Current user sys_id
gs.getUser().getName();            // Current user name
gs.now();                          // Current date/time
gs.getProperty('property.name');   // System property
gs.nil(value);                     // Check if null/empty
```

---

## Next Steps

Once you have your PDI set up:

1. Create the `x_ec_audit` scoped application
2. Create an Update Set for tracking changes
3. Start creating tables as defined in the design document
4. I'll provide the specific table definitions and scripts

**Ready to proceed?** Let me know when you have your ServiceNow instance ready, and we'll create the application and tables together.
