"use strict";

// Document ready
$(document).ready(function () {    
    var tableManager = new DataTableManager();
    tableManager.initialise();

});

// Ctor
var DataTableManager = function () {
};

// Initialises the data tables
DataTableManager.prototype.initialise = function () {
    var self = this;

    $("table").each(function () {

        var table = $(this);

        if ($(table).hasClass("clicktable")) {
            self.setClickableRows(table);
        }

        // Check the id of the table
        var tableId = table.attr("id");
        switch (tableId) {
            case "awaiting-supplier-invoice":                
                self.initialiseAwaitingSupplierInvoiceTable(table);
                break;

            case "awaiting-supplier-quote":                
                self.initialiseAwaitingSupplierQuoteTable(table);
                break;

            case "quote-query-pending":                
                self.initialiseQuoteQueryPendingTable(table);
                break;

            case "invoice-awaiting-approval":                
                self.initialiseInvoiceAwaitingApprovalTable(table);
                break;

            case "historical-batches":                
                self.initialiseHistoricalBatchesTable(table);
                break;

            case "awaiting-invoice":                
                self.initialiseOrdersAwaitingInvoiceTable(table);
                break;

            case "jobs-awaiting-quote":                
                self.initialiseJobsAwaitingQuoteTable(table);
                break;

            case "store-jobs-awaiting-quote":
                self.initialiseStoreJobsAwaitingQuoteTable(table);
                break;

            case "quotes-query-pending":                
                self.initialiseQuotesQueryPendingTable(table);
                break;

            case "supplier-invoices":                
                self.initialiseSupplierInvoicesTable(table);
                break;

            case "supplier-quotes":                
                self.initialiseSupplierQuotesTable(table);
                break;

            case "quotes-awaiting-approval":                
                self.initialiseQuotesAwaitingApprovalTable(table, false);
                break;

            case "quotes-awaiting-approval-readonly":
                self.initialiseQuotesAwaitingApprovalTable(table, true);
                break;

            case "awaiting-store-verification":                
                self.initialiseStoreVerificationTable(table);
                break;

            case "query-responded-table":                
                self.initialiseQueryRespondedTable(table);
                break;

            case "user-selection-table":                
                self.initialiseUserSelectionTable(table);
                break;

            case "supplier-warranty-work-orders":                
                self.initialiseSupplierWarrantyWorkOrdersTable(table);
                break;

            case "completed-warranty-orders":
                self.initialiseCompletedWarrantyWorkOrdersTable(table);
                break;
                
            case "jobs-awaiting-closedown":
                self.initialiseJobsAwaitingClosedownTable(table);
                break;

            case "jobs-awaiting-closedown-supplier":
                self.initialiseJobsAwaitingClosedownSupplierTable(table);
                break;

            case "approved-invoices":
                self.initialiseApprovedInvoicesTable(table);
                break;

            case "completed-jobs":
                self.initialiseCompletedJobsTable(table);
                break;

            case "members-renewedAutomatically":
                  self.initialisemembersRenewedAutomaticallyTable (table);
                  break;


            case "all-customers":
                self.initialiseallCustomersTable(table);
                break;

          
            case "asset-search-results":
            case "awaiting-eta":
            case "awaiting-confirmation":
            case "unverified-certificates":
            case "active-quotes":
            case "safe-and-legal-jobs":
            case "queried-certificates":
            case "queried-supplier-certificates":
            case "members-active":
            case "members-stopped":
            case "invoices-in-query":
            case "creditnote-awaiting-approval":
            case "awaiting-certificate":
            case "members-awaiting-approval":
            case "members-rejected":
            case "active-leads":
            case "validate-leads":
            case "resource-availability":
                self.initialiseDefaultTable(table);
                break;

            case "choose-invoice-document":
            case "choose-invoice-directory":
            case "awaiting-supplyonly-invoice":
            case "supplyonly-invoices":
                self.initialiseAllATargetsTable(table);

            default:
                break;
        }

    });

};

// Initialises the specified table using the specified column definitions
DataTableManager.prototype.initialiseTable = function (table, columnDefs) {

    var options = {
        "bPaginate": false,
        "bInfo": true,
        "aaSorting": [],
        "aoColumnDefs": columnDefs
    };

    var emptyTableMessage = $(table).attr("data-empty-table");
    if (emptyTableMessage) {

        // Use empty table message if one has been displayed
        options["oLanguage"] = {
            "sEmptyTable": emptyTableMessage
        };

    };

    $(table).dataTable(options);

};

// Sets clickable rows on the table
DataTableManager.prototype.setClickableRows = function (table) {

    $("tbody tr", table).addClass("clickable").click(function (event) {

        event.preventDefault();

        // Make rows clickable using first anchor tag in row
        var href = $(event.target).closest("tr").find("a:first").attr("href");
        if (href) {
            window.location.assign(href);
        }

    });

};

// Initialises the awaiting supplier invoice table
DataTableManager.prototype.initialiseAwaitingSupplierInvoiceTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [5]}]);
};

// Initialises the awaiting supplier quote table
DataTableManager.prototype.initialiseAwaitingSupplierQuoteTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1, 3]}]);
};

// Initialises the quote query pending table
DataTableManager.prototype.initialiseQuoteQueryPendingTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1]}]);
};

// Initialises the invoice awaiting approval table
DataTableManager.prototype.initialiseInvoiceAwaitingApprovalTable = function (table) {

    var columns = $("th", table);

    var dateColNumber = columns.length === 8 ? 2 : 1;

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [dateColNumber]}]);

};

// Initialises the historical batches table
DataTableManager.prototype.initialiseHistoricalBatchesTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1] }, { "sType": "currency", "aTargets": [3]}]);

    $("tbody > tr", table).on("click", function () {
        var id = $("td:first-child", this).text();
        var baseUrl = $("#BaseUrl").val();
        window.open(baseUrl + "/" + id);
    });

};

// Initialises the orders awaiting invoice table
DataTableManager.prototype.initialiseOrdersAwaitingInvoiceTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [2, 4]}]);

};

// Initialises the jobs awaiting quote table
DataTableManager.prototype.initialiseJobsAwaitingQuoteTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1,2]}]);

};

// Initialises the store jobs awaiting quote table
DataTableManager.prototype.initialiseStoreJobsAwaitingQuoteTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1, 3]}]);

    $("tr.clickable").on("click", function(event) {
        var href = $(event.target).closest("tr").find("a:first").attr("href");
        if (href) {
            window.location.assign(href);
        }
    });
};

// Initialises the quotes query pending table
DataTableManager.prototype.initialiseQuotesQueryPendingTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1] }, { "sType": "currency", "aTargets": [3]}]);
    
    $("tr[qas-id]", table).on("click", function () {
        var baseHref = $("#QueryNotesLink").attr("href");
        var qasid = $(this).attr("qas-id");
        window.location = baseHref + "/" + qasid;
    });

};

// Initialises the supplier invoices table
DataTableManager.prototype.initialiseSupplierInvoicesTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4]}]);

};

// Initialises the supplier quotes table
DataTableManager.prototype.initialiseSupplierQuotesTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [3]}]);

};

// Initialises the quotes awaiting approval table
DataTableManager.prototype.initialiseQuotesAwaitingApprovalTable = function (table, readOnly) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1] }, { "sType": "currency", "aTargets": [3]}]);
    if (readOnly === false) {
        this.setClickableRows(table);
    }
};

// Initialises the store verification table
DataTableManager.prototype.initialiseStoreVerificationTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [7]}]);
};

//Init the query responded table
DataTableManager.prototype.initialiseQueryRespondedTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [5]}]);
};

//Init the user selection table
DataTableManager.prototype.initialiseUserSelectionTable = function (table) {
    this.initialiseTable(table);
    $("[name='NonJsSelect']").hide();
    $("tbody > tr", table).addClass("clickable").on("click", function () {

        var submitFunction = function (scope) {
            var selectedRow = $(scope);
            var selectedUser = $("#SelectedUser");
            var username = $("td:first-child", selectedRow).text();
            selectedUser.val(username);
            selectedRow.closest("form").submit();
        };

        var prompt = $("#ActionPrompt").val();
        if (prompt != undefined && prompt.length > 0) {
            if (confirm(prompt)) {
                submitFunction(this);
            }
        } else {
            submitFunction(this);
        }

    });
};

// Initialises the supplier warranty work orders table
DataTableManager.prototype.initialiseSupplierWarrantyWorkOrdersTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [3]}]);

};

// Initialises the completed warranty orders table
DataTableManager.prototype.initialiseCompletedWarrantyWorkOrdersTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [1, 3]}]);

};

// Initialises the jobs awaiting closedown table
DataTableManager.prototype.initialiseJobsAwaitingClosedownTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [2] }]);

}; 

// Initialises the jobs awaiting closedown table
DataTableManager.prototype.initialiseCompletedJobsTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4]}]);

};

// Initialises the members renewed automatically table
DataTableManager.prototype.initialisemembersRenewedAutomaticallyTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4] }]);

};

// Initialises the all customers table
DataTableManager.prototype.initialiseallCustomersTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4] }]);

};

// Initialises the active leads table
DataTableManager.prototype.initialiseActiveLeadsTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4] }]);

};

// Initialises the validate leads table
DataTableManager.prototype.initialiseValidateLeadsTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4] }]);

};

// Initialises the members active table
DataTableManager.prototype.initialiseMembersActiveTable = function (table) {
    this.initialiseTable(table);

};

// Initialises the members awaiting approval table
DataTableManager.prototype.initialiseMembersAwaitingApprovalTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4] }]);

};

// Initialises the members rejected table
DataTableManager.prototype.initialiseMembersRejectedTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4] }]);

};

// Initialises the members on stop table
DataTableManager.prototype.initialiseMembersOnStopTable = function (table) {
    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4] }]);

};




// Init the approved invoices table
DataTableManager.prototype.initialiseApprovedInvoicesTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [4]}]);

};

// Init the asset search results table
DataTableManager.prototype.initialiseAssetSearchResultsTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [2,3]}]);

};

// Init the observations table
DataTableManager.prototype.initialiseDefaultTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": [2, 3] }]);

};

// Init the choose invoice tables
DataTableManager.prototype.initialiseAllATargetsTable = function (table) {

    this.initialiseTable(table, [{ "sType": "date-euro", "aTargets": ["_all"] }]);

};