/// <reference path="_references.js" />
/// <reference path="jquery.toObject.js" />
/// <reference path="~/Scripts/json2.js" />

// Ctor
var LoadingDialog = function (options) {

    // Default options
    var defaults = {
        width: "auto",
        title: "Loading...",
        message: "Loading, please wait...",
        dialogClass: "ajax-loading-dialog",
        opening: undefined,
        closing: undefined
    };

    // Merge defaults and specified options
    this.settings = $.extend({}, defaults, options);

    // Create dialog element
    this.element = $("<div><p class=\"ajax-loading\">" + this.settings.message + "</p></div>");

};

// A value to indicate if the dialog has actually been opened
LoadingDialog.prototype.isOpen = false;

// Shows the loading dialog
LoadingDialog.prototype.show = function () {

    var self = this;

    // Opening callback
    if (self.settings.opening) {
        self.settings.opening();
    }

    // Show loading dialog
    $(this.element).dialog({
        autoOpen: true,
        closeOnEscape: false,
        width: self.settings.width,
        resizable: false,
        draggable: false,
        title: self.settings.title,
        dialogClass: self.settings.dialogClass,
        modal: true,
        open: function (event, ui) {

            // Don't want title bar or button pane
            $(".ui-dialog-titlebar, .ui-dialog-buttonpane", "." + self.settings.dialogClass).hide();

        }
    });

    self.isOpen = true;

};

// Change the dialog message
LoadingDialog.prototype.message = function (message) {

    $("p.ajax-loading", this.element).text(message);

};

// Closes the loading dialog
LoadingDialog.prototype.close = function () {

    var self = this;

    // Closing callback
    if (self.settings.closing) {
        self.settings.closing();
    }

    if (self.isOpen) {

        // Destroy loading dialog
        $(this.element).dialog("destroy");
        
    }

};

// Ctor
var FormDialog = function (options, contentElement) {

    // Default options
    var defaults = { 
        getUrl: undefined,
        postUrl: undefined,
        useJson: false,
        width: "50%",
        loadingMessage: "Loading, please wait...",
        submittingMessage: "Please wait...",
        isAjaxContent: true,
        success: undefined,
        error: undefined,
        opening: undefined,
        closing: undefined
    };

    // Merge defaults and specified options
    this.settings = $.extend({}, defaults, options);

    // Check if dialog content is provided
    if (contentElement != undefined) {
        this.contentElement = contentElement;
        this.settings.isAjaxContent = false;
    }

};

// Shows the dialog
FormDialog.prototype.show = function () {

    var self = this;

    var loading = undefined;

    // Shows the loading dialog
    var showLoading = function () {

        loading = new LoadingDialog();
        loading.show();

    };

    // Show loading dialog after a slight detail to allow content to load with showing loading (avoids flashing)
    var loadingTimer = setTimeout(showLoading, 250);

    // Create div element to load dialog in
    var dialogElement = self.settings.isAjaxContent ? document.createElement("div") : self.contentElement;

    // Ajax submitting progress element
    var ajaxSubmitting = $("<p class=\"ajax-form-loading\">" + this.settings.submittingMessage + "</p>");

    // Opens the jQuery UI dialog
    var openDialog = function () {

        var fn = function () {

            // No longer need the loading dialog
            clearTimeout(loadingTimer);

            // Clear loading dialog if it was displayed
            if (loading != undefined) {
                loading.close();
            }

            // Opening callback
            if (self.settings.opening) {
                self.settings.opening();
            }

            // Show dialog
            $(dialogElement).dialog("open");

            // Add ajax submitting progress element
            var buttonPane = $(".ui-dialog-buttonpane", ".ajax-form-dialog");
            buttonPane.append(ajaxSubmitting);
            ajaxSubmitting.css("line-height", buttonPane.height() + "px");
            ajaxSubmitting.hide();

        };

        setTimeout(fn, 0);

    };

    // Submits the dialog
    var submitDialog = function () {

        var forms = $(dialogElement).is("form") ? dialogElement : $("form", dialogElement);

        if (forms.length === 1) {

            var frm = $(forms[0]);
            var valid;

            // Check if form can be validated client side with javascript
            if (typeof $(frm).validate == 'function') {

                // Hook up validation controls
                $.validator.unobtrusive.parse(frm);

                // Validate form data
                frm.validate();
                valid = frm.valid();

            } else {

                // Cannot validate client side, so default to being valid, server will validate
                valid = true;
            }

            if (valid) {

                // Disable submit buttons
                $(".form-dialog-button").button("option", "disabled", true).addClass("ui-state-disabled");
                $(ajaxSubmitting).show();

                // Initialise AJAX options
                var options = {
                    type: "POST",
                    url: self.settings.postUrl,
                    async: false,
                    success: function (data, textStatus, jqXHR) {

                        // Renable submit buttons
                        $(ajaxSubmitting).hide();
                        $(".form-dialog-button").button("option", "disabled", false).removeClass("ui-state-disabled");

                        // Call success function
                        if (self.settings.success) {
                            self.settings.success(data, closeDialog, showValidationSummary);
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        // Renable submit buttons
                        $(ajaxSubmitting).hide();
                        $(".form-dialog-button").button("option", "disabled", false).removeClass("ui-state-disabled");

                        // Call error function
                        if (self.settings.error) {
                            self.settings.error(jqXHR, textStatus, errorThrown, showValidationSummary);
                        }

                    }
                };

                if (self.settings.useJson === true) {

                    // Convert form values to JSON
                    options.data = JSON.stringify($(frm).toObject({ mode: 'first' }));
                    options.dataType = "json";
                    options.contentType = "application/json; charset=utf-8";

                } else {

                    // Serialize form values
                    options.data = frm.serialize();

                }

                // Post request to server
                $.ajax(options);
            }
        }
    };

    // Closes the dialog
    var closeDialog = function () {

        $(dialogElement).dialog("close");

    };

    // Function to display validation error summary
    var showValidationSummary = function (validationSummary) {

        var container = $("#DialogValidationSummary");
        if ((container == undefined) || (container.length == 0)) {

            // Create the validation summary container
            container = document.createElement("div");
            container.id = "DialogValidationSummary";

            if ($(dialogElement).is("form")) {

                // Add as first element of the form
                $(dialogElement).prepend(container);

            } else {

                // Add as first element of the form
                $("form", dialogElement).prepend(container);
            }
        }

        // Show validation summary
        $(container).html(validationSummary);

    };

    var buttons;
    if (self.settings.postUrl) {

        // Postback, so need ok and cancel buttons
        buttons = [{
            text: "OK",
            "class": "form-dialog-button",
            click: submitDialog
        },
            {
                text: "Cancel",
                "class": "form-dialog-button",
                click: closeDialog
            }];

    } else {

        // No postback, just need close button
        buttons = [{
            text: "Close",
            "class": "form-dialog-button",
            click: closeDialog
        }];

    }

    // Initialise the dialog
    $(dialogElement).dialog({
        autoOpen: false,
        width: self.settings.width,
        resizable: false,
        title: self.settings.caption,
        dialogClass: "ajax-form-dialog",
        modal: true,
        create: function (event, ui) {

            if (self.settings.isAjaxContent) {

                // Load contents of dialog from url
                $.ajax({
                    type: "GET",
                    url: self.settings.getUrl,
                    cache: false,
                    dataType: "html",
                    success: function (data) {

                        $(dialogElement).html(data);
                        openDialog();

                    },
                    error: closeDialog
                });

            } else {

                openDialog();

            }

        },
        close: function (event, ui) {

            // Destroy dialog
            $(dialogElement).dialog("destroy");

            // Remove dialog content if loaded via AJAX
            if (self.isAjaxContent) {
                $(dialogElement).remove();
            }

            // Closing callback
            if (self.settings.closing) {
                self.settings.closing();
            }

        },
        buttons: buttons
    });
};
