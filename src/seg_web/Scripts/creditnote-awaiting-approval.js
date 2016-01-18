/// <reference path="_references.js" />

$(document).ready(function () {

    // Masks the page to solve issues with the iFrame containing the documents
    var maskPage = function () {

        // Hide iframe and mask page
        $("iframe").css("visibility", "hidden");
        $("body").append("<div class=\"mask\"></div>");

    };

    // Unmasks the page
    var unmaskPage = function () {

        $(".mask").remove();
        $("iframe").css("visibility", "visible");

    };

    // Creates an error summary element
    var createErrorSummary = function (errorText) {

        // Create error summary element
        var errorSummary = document.createElement("div");
        $(errorSummary).addClass("validation-summary-errors").text(errorText);

        return errorSummary;

    };

    // Displays the validation summary using the specified function
    var displayValidationSummary = function (content, fn) {

        if ($(content).hasClass("validation-summary-errors")) {

            // There must be validation errors, show validation summary
            fn(content);

        } else {

            // Create error summary
            var errorSummary = createErrorSummary("Unexpected result returned from web server");
            fn(errorSummary.outerHTML);

        }

    };

    // A function to handle a post error
    var ajaxPostErrorHandler = function (jqXHR, textStatus, errorThrown, showValidationErrors) {

        // Create error summary
        var errorSummary = createErrorSummary("An unexpected error occurred and the requested action could not be completed");
        showValidationErrors(errorSummary.outerHTML);

    };

    // Reshow invoice details section
    $(".inv-details").show();

    // Handler to show invoice lines in dialog
    $("#view-closedown-events").click(function (event) {

        event.preventDefault();

        // Initialise dialog options
        var dialogOptions = {
            caption: "View Closedown Events",
            width: '50%',
            opening: function () {
                maskPage();
            },
            closing: function () {
                unmaskPage();
            }
        };

        // Open the dialog
        var dlg = new FormDialog(dialogOptions, $("#closedown-events"));
        dlg.show();
    });

    // Move FLB table to tab container
    $("#flb-table").appendTo("#info-tables");
    $("#flb-container").remove();

    var tabs = document.createElement("ul");

    // Create invoice tab
    var invoiceAnchor = document.createElement("a");
    $(invoiceAnchor).attr("href", "#tab1").text("CreditNote");
    var invoiceListItem = document.createElement("li");
    invoiceListItem.appendChild(invoiceAnchor);
    tabs.appendChild(invoiceListItem);

    // Create FLB tab
    var flbAnchor = document.createElement("a");
    $(flbAnchor).attr("href", "#tab2").text("Original Invoice");
    var flbListItem = document.createElement("li");
    flbListItem.appendChild(flbAnchor);
    tabs.appendChild(flbListItem);

    //Move verifications table to tab container
    $("#job-notes").appendTo("#info-tables");
    $("#job-notes-container").remove();

    //Create verifications tab
    //var jobNotesAnchor = document.createElement("a");
    //$(jobNotesAnchor).attr("href", "#tab3").text("Job Notes");
    //var jobNotesListItem = document.createElement("li");
    //jobNotesListItem.appendChild(jobNotesAnchor);
    //tabs.appendChild(jobNotesListItem);

    // Wrap tables in a div for formatting
    $("#invoice-table").wrap("<div id=\"tab1\"></div>");
    $("#flb-table").wrap("<div id=\"tab2\"></div>");
    //$("#job-notes").wrap("<div id=\"tab3\"></div>");

    // Build tabs
    $("#info-tables").prepend(tabs).tabs({ heightStyle: "auto" });

    // Ensure scrolling is off, otherwise there will be two scroll bars
    $("iframe").attr("scrolling", "no").attr("seamless", "true");

    $("#SelectedQueryReason").change(function () {
        var selectedVal = $(this).find(":selected").text();
        if (selectedVal === "Other") {
            $(".creditnote-query-other").show(500);
        } else {
            $(".creditnote-query-other").hide();
        }
    });

    // Show the Observation Modal.
    $("#SaveQuery").on("click", function () {
        var selectedVal = $("#SelectedQueryReason").find(":selected").val();
        if (selectedVal) {
            var queryText = $("#SelectedQueryReason").find(":selected").text();
            if (queryText === "Other") {
                queryText = $("#Notes").val();
            }

            $.ajax({
                type: "POST",
                url: "/CreditNoteApproval/QueryCreditNote",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#CreditNoteId").val(), Notes: queryText },
                success: function(d) {
                    if (d === "Error") {
                        $("#QueryError").show();
                    } else {
                        $("#QueryInvoiceModal").modal("hide");
                        $("#BackButton")[0].click();
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    $("#QueryError").show();
                }
            });
        }
    });

    // Show the Observation Modal.
    $("#SaveRejection").on("click", function () {
        var selectedVal = $("#SelectedRejectionReason").find(":selected").val();
        var notes = $("#RejectionNotes").val();
        if (selectedVal) {
            // InvoiceId, InvoiceHeader.Id, SelectedRejectionReason, RejectionNotes
            $.ajax({
                type: "POST",
                url: "/CreditNoteApproval/RejectFirstApproval",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#CreditNoteId").val(), SelectedRejectionReason: selectedVal, RejectionNotes: notes },
                success: function (d) {
                    if (d === "Error") {
                        $("#RejectError").show();
                    } else {
                        $("#RejectInvoiceModal").modal("hide");
                        $("#BackButton")[0].click();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#RejectError").show();
                }
            });
        }
    });

    // Used to hide adobe object due to IE overlay and bootstrap modal issue.
    $("#RejectInvoice, #QueryCreditNote, #ViewCreditNoteLines").on("click", function () {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            $(".doc-view").hide();
        }
    });

    // Used to hide show object due to IE overlay and bootstrap modal issue.
    $('#RejectInvoiceModal, #QueryInvoiceModal, #InvoiceLinesModal').on('hidden.bs.modal', function (e) {
        $(".doc-view").show();
    });

    ShowDefaultTab();

});

// Selects the appropriate tab to show based on the Document in the PDF Viewer.
function ShowDefaultTab() {
    if (document.URL.indexOf("documentIndex") > -1) {
        var index = document.URL.charAt(document.URL.length - 1);
        if (index == 1 || index == 2) {
            $("#ui-id-2").click();
        } else {
            $("#ui-id-1").click();
        }
    }
}

// Hide elements that will be managed client-side
$(".invoice-approval").hide();
$(".inv-details").hide();
$("#invoice-lines").hide();
$("#flb-container").hide();
$("#closedown-events").hide();
$(".invoice-approval").show(); 
