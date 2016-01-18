// Customises jQuery Validation styles to support Bootstrap 3.
$(function () {

    // Used to show validation styling for server derived validation errors.
    var serverErrors = $(".form-group .input-validation-error").closest("div.form-group");
    serverErrors.each(function () {
        $(this).addClass("has-error");
    });

    var dateValidate = function (value, element, param) {
        value = $.trim(value);
        if (value.length == 0) {
            return true;
        }

        var parts = value.split("/");
        if (parts.length !== 3) return false;

        var day = parts[0];
        var month = parts[1];
        var year = parts[2];

        var isNotNumber = function (checkThis) {
            return checkThis.length == 0 || isNaN(checkThis);
        };

        if (isNotNumber(day) || isNotNumber(month) || isNotNumber(year)) return false;

        if (day < 1 || month < 0 || year < 1000 || year > 9999) return false;

        month--;
        var asDate = new Date(year, month, day);

        if (asDate.getFullYear() != year || asDate.getDate() != day || asDate.getMonth() != month) return false;

        return true;
    };

    var webFormsDateValidate = function (source, args) {
        args.IsValid = dateValidate(args.Value);
    };

    var webFormsIntegerValidate = function (source, args) {
        var regex = /^[-+]?\d*$/;
        args.IsValid = regex.test(args.Value);
    };

    var webFormsFloatValidate = function (source, args) {
        var regex = /^[-+]?\d*(\.\d+)?$/;
        args.IsValid = regex.test(args.Value);
    };

    if ($ && $.validator) {

        // Override the validation style to support Bootstrap.
        $.validator.setDefaults({
            highlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                    $(element).closest(".form-group, .form-inline").removeClass("has-success").addClass("has-error");
                }
            },
            unhighlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                    $(element).closest(".form-group, .form-inline").removeClass("has-error").addClass("has-success");
                }
            }
        });

        $.validator.addMethod('requiredif', function (value, element, parameters) {
            var id = '#' + parameters['dependentproperty'];

            // get the target value (as a string,
            // as that's what actual value will be)
            var targetvalue = parameters['targetvalue'];
            targetvalue =
                (targetvalue == null ? '' : targetvalue).toString();

            // get the actual value of the target control
            // note - this probably needs to cater for more
            // control types, e.g. radios
            var control = $(id);
            var controltype = control.attr('type');
            var actualvalue =
                controltype === 'checkbox' ?
                    control.is(':checked').toString() :
                    control.val();

            // if the condition is true, reuse the existing
            // required field validator functionality
            if (targetvalue === actualvalue)
                return $.validator.methods.required.call(
                    this, value, element, parameters);

            return true;
        });

        $.validator.unobtrusive.adapters.add(
            'requiredif',
            ['dependentproperty', 'targetvalue'],
            function (options) {
                options.rules['requiredif'] = {
                    dependentproperty: options.params['dependentproperty'],
                    targetvalue: options.params['targetvalue']
                };
                options.messages['requiredif'] = options.message;
            });

        $.validator.addMethod('datevalidator',
            dateValidate
        );

        $.validator.unobtrusive.adapters.add('datevalidator', [],
            function (options) {
                options.rules['datevalidator'] = {};
                if (options.message) {
                    options.messages['datevalidator'] = options.message;
                }
            });

        $.validator.addMethod('timevalidator',
            function (value, element, param) {
                value = $.trim(value);
                if (value.length == 0) {
                    return true;
                }

                var timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

                return timePattern.test(value);
            });

        $.validator.unobtrusive.adapters.add('timevalidator', [],
            function (options) {
                options.rules['timevalidator'] = {};
                if (options.message) {
                    options.messages['timevalidator'] = options.message;
                }
            });
    }
});