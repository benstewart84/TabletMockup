/// <reference path="_references.js" />
/// <reference path="common-helpers.js" />
/// <reference path="form-dialog.js" />

// Supplier Helpers
var supplierHelpers = function ($) {

    var helpers = new CommonHelpers();
    var lineTableSelector = "table#detail-lines";
    var totalLineValueOutput = undefined;
    //var vatRates = [];

    // Creates an error summary element
    var createErrorSummary = function (errorText) {

        // Create error summary element
        var errorSummary = document.createElement("div");
        $(errorSummary).addClass("validation-summary-errors").text(errorText);

        return errorSummary;

    };

    // Updates the total line value
    var updateTotalLineValue = function () {
        debugger;
        if (totalLineValueOutput) {

            var totalLineValue = 0;

            // Add each line value to the total
            $("td.in-total-line-net-value").each(function () {

                var val = $(this).text();
                if ($.isNumeric(val)) {
                    totalLineValue += parseFloat(val);
                }

            });

            // Refresh output
            $(totalLineValueOutput).val(totalLineValue.toFixed(2));
        }

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

    // Function to handle success of add or edit line
    var successfulAddOrEditLineHandler = function (data, closeDialog, showValidationErrors) {

        var id = $(data).attr("data-id");
        if (id) {

            // Get a reference to the line table
            var table = $(lineTableSelector);

            // Find existing table row
            var existing = $(table).find("tr[data-id='" + id + "']");
            if (existing.length > 0) {

                // Replace existing row with the new one
                $(existing).replaceWith(data);

            } else {

                // Doesn't exist, add new row to table
                $("tbody", table).append(data);

            }

            // Can close the dialog
            closeDialog();
            updateTotalLineValue();

        } else {

            // Show validation errors
            displayValidationSummary(data, showValidationErrors);

        }

    };

    // A function to handle a post error
    var ajaxPostErrorHandler = function (jqXHR, textStatus, errorThrown, showValidationErrors) {

        // Create error summary
        var errorSummary = createErrorSummary("An unexpected error occurred and the requested action could not be completed");
        showValidationErrors(errorSummary.outerHTML);

    };

    // Handles a request to add a new line
    var addNewLineClickHandler = function (event) {

        event.preventDefault();

        var target = $(event.target);

        helpers.openDialogFromLink(target, successfulAddOrEditLineHandler, ajaxPostErrorHandler);

    };

    // Handles a request to edit a line
    var editLineClickHandler = function (event) {

        event.preventDefault();

        var target = $(event.target);

        helpers.openDialogFromLink(target, successfulAddOrEditLineHandler, ajaxPostErrorHandler);

    };

    // Handles a request to delete a line
    var deleteLineClickHandler = function (event) {

        event.preventDefault();

        var target = $(event.target);

        // Function to handle success of dialog
        function successHandler(data, closeDialog, showValidationErrors) {

            var id = $(data).attr("data-id");
            if (id) {

                // Remove existing table row
                $(lineTableSelector).find("tr[data-id='" + id + "']").remove();

                // Can close the dialog
                closeDialog();
                updateTotalLineValue();

            } else {

                // Show validation errors
                displayValidationSummary(data, showValidationErrors);

            }
        };

        helpers.openDialogFromLink(target, successHandler, ajaxPostErrorHandler);

    };

    // Handles a request to delete a document
    var deleteDocumentClickHandler = function (event) {

        event.preventDefault();

        var target = $(event.target);

        // Function to handle success of dialog
        function successHandler(data, closeDialog, showValidationErrors) {

            var content = $(data);
            if ($(content).is("a")) {

                // Untick file as being uploaded
                var td = $(target).closest("td");
                var row = $(td).closest("tr");
                var colNum = row.children().length - 1;

                // Check status row has required data- attributes
                if (row.is("[data-missing-class]") && row.is("[data-missing-text]")) {

                    var missingClassName = row.attr("data-missing-class");
                    var missingText = row.attr("data-missing-text");

                    // Get cell to update
                    var statusCell = row.children().eq(colNum);

                    // Cell may override missing class
                    if (statusCell.is("[data-missing-class]")) {
                        missingClassName = statusCell.attr("data-missing-class");
                    }

                    // Cell may override missing class
                    if (statusCell.is("[data-missing-text]")) {
                        missingText = statusCell.attr("data-missing-text");
                    }

                    // Update status
                    statusCell.find("span").removeClass("doc-uploaded").addClass(missingClassName).text(missingText);
                }

                // Update link to be upload
                $(target).replaceWith(content);
                closeDialog();

            } else {

                // Show validation errors
                displayValidationSummary(data, showValidationErrors);

            }

        };

        // Set dialog options
        var options = helpers.getDialogOptionsFromLink(target);
        options.width = "25%";
        options.success = successHandler;
        options.error = ajaxPostErrorHandler;

        helpers.openDialog(options);
    };

    // Truncates a number to the specified number of decimal places
    var truncateDecimals = function (num, decimalPlaces) {

        // Split number at decimal point
        var decimalSplit = num.toString().split(".");

        if ((decimalSplit.length === 1) || (decimalSplit[1].length < decimalPlaces)) {

            // Number doesn't contain decimal places or less than required, return as-is
            return num;
        }
     
        // Result is all digits up to decimal place, then the required number of decimal places
        //var result = decimalSplit[0] + "." + decimalSplit[1].substr(0, decimalPlaces);
        var result = parseFloat(num).toFixed(decimalPlaces);
       
        if ($.isNumeric(result) == false) {
            result = 0;
        }

        return parseFloat(result);
    };

    //// Initialise the VAT calculator
    //var initialiseVatCalculator = function () {

    //    var decimalPlaces = 2;

    //    // Check if VAT is to be calculated
    //    var vatAmountField = $("#VatAmount");
    //    if (vatAmountField.length === 1) {

    //        var url = vatAmountField.parent().attr("data-rates-url");
    //        if (url && url.length > 0) {

    //            // Get the VAT rates
    //            $.get(url, function (data) {

    //                var results = JSON.parse(data);

    //                $.each(results, function (i, rate) {

    //                    vatRates.push({
    //                        DateEffective: new Date(rate.dateEffective),
    //                        Rate: rate.rate
    //                    });

    //                });
    //            });

    //            var netAmountField = $("#NetAmount");
    //            var grossAmountField = $("#GrossAmount");
    //            var vatExemptField = $("#IsVatExempt");
    //            var vatOverrideField = $("#IsVatOverride");

    //            var isVatOverride = false;

    //            // Sets the VAT override state
    //            var setVatOverrideState = function () {

    //                // Check if VAT is to be overridden
    //                isVatOverride = (vatOverrideField.length != 1) || ((vatOverrideField.length == 1) && vatOverrideField.is(':checked'));

    //                var vatExemptLabel = $(vatExemptField).parent().find("label");

    //                if (isVatOverride) {
    //                    $(vatAmountField).removeAttr("readonly");
    //                    $(vatAmountField).removeClass("readonly");
    //                    $(vatExemptField).attr("disabled", "disabled");
    //                    $(vatExemptLabel).addClass("disabled");
    //                } else {

    //                    $(vatAmountField).attr("readonly", "readonly");
    //                    $(vatAmountField).addClass("readonly");
    //                    $(vatExemptField).removeAttr("disabled");
    //                    $(vatExemptLabel).removeClass("disabled");
    //                }

    //                $(vatExemptLabel).css("display", "none");
    //                $(vatExemptLabel).css("display", "inline-block");

    //            };

    //            // Sets the VAT exempt state
    //            var setVatExemptState = function () {

    //                var vatOverrideLabel = $(vatOverrideField).parent().find("label");

    //                if (vatExemptField.is(':checked')) {
    //                    $(vatOverrideField).attr("disabled", "disabled");
    //                    $(vatOverrideField).addClass("disabled");
    //                } else {

    //                    $(vatOverrideField).removeAttr("disabled");
    //                    $(vatOverrideField).removeClass("disabled");
    //                }

    //                $(vatOverrideLabel).css("display", "none");
    //                $(vatOverrideLabel).css("display", "inline-block");

    //            };

    //            // Check if VAT is exempt
    //            var isVatExempt = (vatExemptField.length == 1) && (vatExemptField.is(':checked'));

    //            setVatOverrideState();

    //            // Calculates the amounts
    //            var calculate = function () {

    //                var netAmountVal = $(netAmountField).val();

    //                // Get the net amount
    //                var netAmount = $.isNumeric(netAmountVal) ? parseFloat(netAmountVal) : 0;

    //                var vatAmountVal;
    //                var vatAmount = 0;

    //                if (isVatOverride) {

    //                    // Get VAT amount entered by user
    //                    vatAmountVal = $(vatAmountField).val();

    //                    // Get the net amount
    //                    vatAmount = $.isNumeric(vatAmountVal) ? parseFloat(vatAmountVal) : 0;

    //                } else {

    //                    isVatExempt = (vatExemptField.length == 1) && (vatExemptField.is(':checked'));

    //                    // Only calculate VAT if not VAT exempt
    //                    if (isVatExempt == false) {

    //                        // Get the invoice date, need this to determine which rate to use
    //                        var invoiceDate = $("#InvoiceDate").datepicker('getDate');

    //                        var rate = null;
    //                        var i = vatRates.length - 1;

    //                        // Find the VAT rate to apply
    //                        while ((i > -1) && (rate == null)) {

    //                            if (invoiceDate >= vatRates[i].DateEffective) {
    //                                rate = vatRates[i];
    //                            }

    //                            i--;
    //                        }

    //                        // Default to the last VAT rate
    //                        if ((rate == null) && (vatRates.length > 0)) {
    //                            rate = vatRates[vatRates.length - 1];
    //                        }

    //                        if ((rate != null) && (netAmount != 0)) {

    //                            // Calculate VAT, truncate at 2 decimal places
    //                            vatAmount = truncateDecimals((netAmount / 100) * rate.Rate, decimalPlaces);

    //                        }
    //                    }

    //                    vatAmountVal = vatAmount.toFixed(decimalPlaces);

    //                    // Update VAT amount
    //                    vatAmountField.val(vatAmountVal);
    //                }

    //                // Update gross amount
    //                var grossAmount = parseFloat(netAmount + vatAmount);
    //                grossAmountField.val(grossAmount.toFixed(decimalPlaces));

    //            };

    //            // Handle the change event of the net amount
    //            var onChange = function () {

    //                calculate();

    //            };

    //            // Handle the change event of the VAT amount
    //            var onVatChange = function () {

    //                // Get the net amount
    //                var netAmountVal = $(netAmountField).val();
    //                var netAmount = $.isNumeric(netAmountVal) ? parseFloat(netAmountVal) : 0;

    //                // Get the VAT amount
    //                var vatAmountVal = $(vatAmountField).val();
    //                var vatAmount = $.isNumeric(vatAmountVal) ? parseFloat(vatAmountVal) : 0;

    //                // Update gross amount
    //                var grossAmount = parseFloat(netAmount + vatAmount);
    //                grossAmountField.val(grossAmount.toFixed(decimalPlaces));

    //            };

    //            // Handles a VAT override change
    //            var onVatOverrideChange = function () {

    //                setVatOverrideState();

    //                if (isVatOverride == false) {

    //                    // Recalculate VAT
    //                    calculate();
    //                }

    //            };

    //            // Handles a VAT override change
    //            var onVatExemptChange = function () {

    //                setVatExemptState();
    //                calculate();

    //            };

    //            // Attach events for changes to net amount and VAT inclusion
    //            $(netAmountField).change(onChange);
    //            $(netAmountField).keyup(function (event) {
    //                $(event.target).trigger('change');
    //            });
    //            $(vatExemptField).click(onVatExemptChange);
    //            $(vatExemptField).keyup(onVatExemptChange);
    //            $(vatAmountField).change(onVatChange);
    //            $(vatAmountField).keyup(function (event) {
    //                $(event.target).trigger('change');
    //            });
    //            $(vatOverrideField).click(onVatOverrideChange);
    //            $(vatOverrideField).keyup(onVatOverrideChange);

    //        }
    //    }

    //};

    // Initialise function
    var init = function () {

        helpers.initialiseDatePickers();
        helpers.disableFormFocusOutValidation();
        //helpers.maintainGrossAmount("#NetAmount", "#VatAmount", "#GrossAmount");
        helpers.maintainLineNetValue("#Quantity", "#UnitPrice", "#LineNetValue");
        helpers.maintainLineGrossValue("#Quantity", "#UnitPrice", "#UnitTaxAmount", "#LineGrossValue");
        //initialiseVatCalculator();

    };

    return {
        init: init
    };


} (jQuery);

// Document ready
$(document).ready(function () {

    supplierHelpers.init();

    // Show the ETA Date warning if the date is after the Due Date.
    $("#ETADate").change(function () {
        var dueDate = $("#DueDate").val();
        var etaDate = $("#ETADate").val();
        if (dueDate && etaDate) {
            var dueDateParts = dueDate.split("/");
            var dueDateParsed = new Date(Number(dueDateParts[2].substring(0, 4)), Number(dueDateParts[1]) - 1, Number(dueDateParts[0]));

            var etaDateParts = etaDate.split("/");
            var etaDateParsed = new Date(Number(etaDateParts[2]), Number(etaDateParts[1]) - 1, Number(etaDateParts[0]));

            if (etaDateParsed > dueDateParsed) {
                $(".eta-date-warning").show(1000);
                return;
            }
        }

        $(".eta-date-warning").slideUp(500);
    });

});
