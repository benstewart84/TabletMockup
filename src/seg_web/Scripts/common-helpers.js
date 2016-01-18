/// <reference path="_references.js" />
/// <reference path="form-dialog.js" />

// Ctor
var CommonHelpers = function () {
};

// Initialise date pickers
CommonHelpers.prototype.initialiseDatePickers = function () {
    var datePickers = $(".jquery_datepicker");
    if (datePickers.length > 0) {

         //Initialise date pickers
        $(".jquery_datepicker").datepicker({            
            dateFormat: "m/d/yy",
            // minDate: 0, this attribute sets the min date to be today 
            showStatus: true,
            showWeeks: true,
            highlightWeek: true,
            numberOfMonths: 1,
            showAnim: "scale",
            showOptions: {
                origin: ["top", "left"]
            }
        });
       // Initialise date and time pickers
       
    }

    var dateTimePickers = $(".jquery_datetimepicker");
    if (dateTimePickers.length > 0) {
        $('.jquery_datetimepicker').datetimepicker({
            dateFormat: "m/d/yy",
            minDate: 0,
            showWeeks: true,
            showStatus: true,
            highlightWeek: true,
            numberOfMonths: 1,
            showAnim: "scale",
            showOptions: {
                origin: ["top", "left"]
            },
            timeFormat: 'hh:mm tt'
        });
    }
};

// Disables submit validation for elements matching the specified selector
CommonHelpers.prototype.disableSubmitValidation = function (selector) {

    var elements = $(selector);

    $(elements).mouseenter(function (event) {

        // Fixes issue with jQuery Validate when clicking a cancel button with onfocusout validation
        // When a display:block error message shows it pushes cancel button down so click event isn't registered
        var validator = $(event.target).closest("form").validate();
        if (validator) {
            validator.settings.onfocusout = false;
        }

    });

    $(elements).mouseleave(function (event) {

        // Fixes issue with jQuery Validate when clicking a cancel button with onfocusout validation
        // When a display:block error message shows it pushes cancel button down so click event isn't registered
        var validator = $(event.target).closest("form").validate();
        if (validator) {
            validator.settings.onfocusout = function (element) {
                $(element).valid();
            };
        }

    });

};

// Disables focus out validation for the specified form or all forms if no form specified
CommonHelpers.prototype.disableFormFocusOutValidation = function (form) {

    var setOnFocusOut = function (target) {

        // Disable onfocusout validation
        var validator = $(target).validate();
        if (validator) {
            validator.settings.onfocusout = false;
        }

    };

    if (form) {

        // Disable focus out validation on specified form
        setOnFocusOut(form);

    } else {

        // Disable focus out validation on all forms
        $("form").each(function () {
            setOnFocusOut($(this));
        });

    }

};

// Maintains an amount using the specified first and second values and the specified results calculator
CommonHelpers.prototype.maintainAmount = function (firstSelector, secondSelector, thirdSelectorOptional, resultSelector, resultCalculator) {

    // Handle the change event
    var onChange = function () {

        var firstElement = $(firstSelector);
        var secondElement = $(secondSelector);
        var thirdElement = null;

        if (thirdSelectorOptional != null)
            thirdElement = $(thirdSelectorOptional);

        // Get values
        var firstVal = $(firstElement).is("[value]") ? $(firstElement).val() : $(firstElement).text();
        var secondVal = $(secondElement).is("[value]") ? $(secondElement).val() : $(secondElement).text();
        var thirdVal = null;
        if (thirdElement != null)
            thirdVal = $(thirdElement).is("[value]") ? $(thirdElement).val() : $(thirdElement).text();

        // Convert values to numeric
        var firstValNum = $.isNumeric(firstVal) ? parseFloat(firstVal) : 0;
        var secondValNum = $.isNumeric(secondVal) ? parseFloat(secondVal) : 0;
        var thirdValNum = null;
        if (thirdVal != null)
            thirdValNum = $.isNumeric(thirdVal) ? parseFloat(thirdVal) : 0;

        // Calculate result
        var resultVal = null;
        if (thirdSelectorOptional == null)
            resultVal = resultCalculator(firstValNum, secondValNum);
        else
            resultVal = resultCalculator(firstValNum, secondValNum, thirdValNum);

        // Refresh the result
        $(resultSelector).text(resultVal.toFixed(2));

    };

    // Handles the keyup event
    var onKeyUp = function (event) {

        $(event.target).trigger('change');

    };

    // Attach events for changes to fields that effect the amount
    $(document).on('change', firstSelector, onChange);
    $(document).on('change', secondSelector, onChange);
    $(document).on('keyup', firstSelector, onKeyUp);
    $(document).on('keyup', secondSelector, onKeyUp);
    if (thirdSelectorOptional != null) {
        $(document).on('change', thirdSelectorOptional, onChange);
        $(document).on('keyup', thirdSelectorOptional, onKeyUp);
    }
};

//// Maintains the gross amount using the specified net and vat amounts
//CommonHelpers.prototype.maintainGrossAmount = function (netSelector, vatSelector, grossSelector) {

//    var resultsCalculator = function (netAmount, vatAmount) {
//        return netAmount + vatAmount;
//    };

//    this.maintainAmount(netSelector, vatSelector, grossSelector, resultsCalculator);

//};

// Maintains the line net value using the specified quanity and unit rate amounts
CommonHelpers.prototype.maintainLineNetValue = function (quantitySelector, unitRateSelector, lineValueSelector) {

    var resultsCalculator = function (quantity, unitRate) {
        return quantity * unitRate;
    };

    this.maintainAmount(quantitySelector, unitRateSelector, null, lineValueSelector, resultsCalculator);

};

// Maintains the line gross value using the specified quanity and unit rate amounts
CommonHelpers.prototype.maintainLineGrossValue = function (quantitySelector, unitRateSelector, unitTaxRateSelector, lineGrossSelector) {

    var resultsCalculator = function (quantity, unitRate, unitTaxRate) {
        var unitVal = quantity * unitRate;
        var taxVal = quantity * unitTaxRate;
        return unitVal + taxVal;
    };

    this.maintainAmount(quantitySelector, unitRateSelector, unitTaxRateSelector, lineGrossSelector, resultsCalculator);

};

