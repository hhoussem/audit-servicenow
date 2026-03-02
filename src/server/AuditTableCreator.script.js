var AuditTableCreator = Class.create();
AuditTableCreator.prototype = {
    initialize: function() {
        this.scope = 'x_1936206_audit';
    },
    
    /**
     * Creates the main T_AUDITS table with all Oracle-compatible columns
     * Requirements: 1.1, 2.1, 2.2
     */
    createAuditTable: function() {
        var tableName = this.scope + '_t_audits';
        
        // Check if table already exists
        var gr = new GlideRecord('sys_db_object');
        gr.addQuery('name', tableName);
        gr.query();
        if (gr.next()) {
            gs.info('Table ' + tableName + ' already exists');
            return tableName;
        }
        
        // Create table
        var table = new GlideRecord('sys_db_object');
        table.initialize();
        table.name = tableName;
        table.label = 'Audit';
        table.sys_scope = this._getScopeId();
        table.super_class = new GlideRecord('sys_db_object').get('name', 'sys_metadata');
        table.insert();
        
        gs.info('Created table: ' + tableName);
        
        // Create columns
        this._createAuditColumns(tableName);
        
        // Set up auto-number for audit number
        this._setupAutoNumber(tableName);
        
        return tableName;
    },
    
    _createAuditColumns: function(tableName) {
        var columns = [
            // Primary key
            {name: 'audi_audit_nsq', type: 'GUID', label: 'Audit ID', label_fr: 'ID d\'audit', max_length: 32},
            
            // Auto-generated audit number
            {name: 'audi_audit_number_num', type: 'string', label: 'Audit Number', label_fr: 'Numéro d\'audit', max_length: 40, unique: true},
            
            // Basic info
            {name: 'audi_audit_title_lib', type: 'string', label: 'Audit Title', label_fr: 'Titre de l\'audit', max_length: 255, mandatory: true},
            {name: 'audi_audit_year_num', type: 'integer', label: 'Audit Year', label_fr: 'Année d\'audit', mandatory: true},
            {name: 'audi_plan_year_num', type: 'integer', label: 'Plan Year', label_fr: 'Année du plan'},
            
            // Reference fields
            {name: 'ccat_nsq', type: 'reference', reference: this.scope + '_t_cref_categories', label: 'Category', label_fr: 'Catégorie'},
            {name: 'caut_nsq', type: 'reference', reference: this.scope + '_t_cref_audit_types', label: 'Audit Type', label_fr: 'Type d\'audit'},
            {name: 'cati_nsq', type: 'reference', reference: this.scope + '_t_cref_audit_timings', label: 'Timing', label_fr: 'Calendrier'},
            {name: 'caus_nsq', type: 'reference', reference: this.scope + '_t_cref_audit_status', label: 'Status', label_fr: 'Statut', mandatory: true},
            {name: 'care_nsq', type: 'reference', reference: this.scope + '_t_cref_audit_reasons', label: 'Reason', label_fr: 'Raison'},
            {name: 'cdel_nsq', type: 'reference', reference: this.scope + '_t_cref_delegations', label: 'Delegation', label_fr: 'Délégation'},
            {name: 'cuni_nsq', type: 'reference', reference: this.scope + '_t_cref_units', label: 'Unit', label_fr: 'Unité'},
            {name: 'cdir_nsq', type: 'reference', reference: this.scope + '_t_cref_directorates', label: 'Directorate', label_fr: 'Direction'},
            
            // Contract info
            {name: 'audi_contract_ref_cod', type: 'string', label: 'Contract Reference', label_fr: 'Référence du contrat', max_length: 100},
            {name: 'audi_contract_budget_amt', type: 'currency', label: 'Contract Budget', label_fr: 'Budget du contrat'},
            {name: 'audi_actual_cost_amt', type: 'currency', label: 'Actual Cost', label_fr: 'Coût réel'},
            
            // Dates
            {name: 'audi_period_start_dat', type: 'glide_date', label: 'Period Start', label_fr: 'Début de période'},
            {name: 'audi_period_end_dat', type: 'glide_date', label: 'Period End', label_fr: 'Fin de période'},
            {name: 'audi_rfs_dat', type: 'glide_date', label: 'Request for Service Date', label_fr: 'Date de demande de service'},
            {name: 'audi_signature_order_dat', type: 'glide_date', label: 'Signature Order Date', label_fr: 'Date de signature de l\'ordre'},
            {name: 'audi_letter_dat', type: 'glide_date', label: 'Letter Date', label_fr: 'Date de la lettre'},
            {name: 'audi_field_work_start_dat', type: 'glide_date', label: 'Field Work Start', label_fr: 'Début du travail sur le terrain'},
            {name: 'audi_field_work_end_dat', type: 'glide_date', label: 'Field Work End', label_fr: 'Fin du travail sur le terrain'},
            {name: 'audi_draft_report_dat', type: 'glide_date', label: 'Draft Report Date', label_fr: 'Date du rapport provisoire'},
            {name: 'audi_pre_final_report_dat', type: 'glide_date', label: 'Pre-Final Report Date', label_fr: 'Date du rapport pré-final'},
            {name: 'audi_final_report_dat', type: 'glide_date', label: 'Final Report Date', label_fr: 'Date du rapport final'},
            
            // Workflow
            {name: 'cvis_nsq', type: 'reference', reference: this.scope + '_t_cref_audit_visa_steps', label: 'Current Workflow Step', label_fr: 'Étape actuelle du workflow'},
            {name: 'audi_workflow_context_cod', type: 'string', label: 'Workflow Context', label_fr: 'Contexte du workflow', max_length: 100},
            
            // Cancellation
            {name: 'ccar_nsq', type: 'reference', reference: this.scope + '_t_cref_audit_cancel_reasons', label: 'Cancellation Reason', label_fr: 'Raison d\'annulation'},
            {name: 'audi_cancel_comment_txt', type: 'string', label: 'Cancellation Comment', label_fr: 'Commentaire d\'annulation', max_length: 4000},
            
            // Other
            {name: 'audi_migrated_swi', type: 'boolean', label: 'Migrated', label_fr: 'Migré', default_value: 'false'},
            {name: 'audi_comments_txt', type: 'string', label: 'Comments', label_fr: 'Commentaires', max_length: 4000}
        ];
        
        for (var i = 0; i < columns.length; i++) {
            this._createColumn(tableName, columns[i]);
        }
    },
    
    _createColumn: function(tableName, columnDef) {
        var col = new GlideRecord('sys_dictionary');
        col.initialize();
        col.name = tableName;
        col.element = columnDef.name;
        col.column_label = columnDef.label;
        col.internal_type = columnDef.type;
        
        if (columnDef.max_length) {
            col.max_length = columnDef.max_length;
        }
        if (columnDef.mandatory) {
            col.mandatory = true;
        }
        if (columnDef.unique) {
            col.unique = true;
        }
        if (columnDef.reference) {
            col.reference = columnDef.reference;
        }
        if (columnDef.default_value) {
            col.default_value = columnDef.default_value;
        }
        
        col.insert();
        gs.info('Created column: ' + tableName + '.' + columnDef.name);
    },
    
    _setupAutoNumber: function(tableName) {
        // Create number maintenance record for auto-numbering
        var nm = new GlideRecord('sys_number');
        nm.initialize();
        nm.table = tableName;
        nm.category = 'audit_number';
        nm.prefix = 'AUD';
        nm.number = 1000;
        nm.insert();
        
        gs.info('Set up auto-number for ' + tableName);
    },
    
    _getScopeId: function() {
        var scope = new GlideRecord('sys_scope');
        scope.addQuery('scope', this.scope);
        scope.query();
        if (scope.next()) {
            return scope.sys_id;
        }
        return null;
    },
    
    type: 'AuditTableCreator'
};
