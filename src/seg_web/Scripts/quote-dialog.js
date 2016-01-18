/* File Created: August 16, 2013 */
$(function () {
    CfDialog = {
        dlg: null,
        tableInit: null,
        displayDialog: function (tableInitialiser, dialogTitle) {
            if (this.tableInit === null) {
                this.tableInit = tableInitialiser;
            }
            //Initialisation of dialog
            if (CfDialog.dlg == null) {
                CfDialog.dlg = $("#ActionTemplate").dialog({
                    title: dialogTitle || "Quote Details",
                    beforeClose: this.beforeClose,
                    width: 600,
                    resizable: false,
                    resize: "auto"
                });
                //Hide the message area
                $("#MessageArea", CfDialog.dlg).hide();

                //Ensure the unobtrusive validation is activated
                $.validator.unobtrusive.parse('form', CfDialog.dlg);

                //Set up the cancel buttons
                $("input[class='cancel']", CfDialog.dlg).on("click", function () { CfDialog.dlg.dialog("close"); });

                //Set up the radio buttons to show the different forms
                $("input[type='radio']", CfDialog.dlg).on("click", function () {
                    $("div[id$='Form']", CfDialog.dlg).hide();
                    $("#" + $(this).attr("id") + "Form").show();
                });

                //Show the div containing only a Cancel button
                $("#CancelButtonForm").show();

                //Set up the submit buttons

                $("input[type='submit']", CfDialog.dlg).on("click", function (evt) {
                    //Form to be posted using ajax
                    evt.preventDefault();
                    var frm = $(this).closest("form");
                    //Check if the form is valid
                    if (frm.validate() && frm.valid()) {
                        var formData = frm.serialize();
                        $("input", CfDialog.dlg).attr("disabled", "disabled");
                        $("#MessageArea", CfDialog.dlg).html("Saving, please wait").show();
                        var action = frm.attr("action");
                        $.ajax(action, {
                            type: "POST",
                            error: CfDialog.errorHandler,
                            success: CfDialog.successHandler,
                            data: formData
                        });
                    }
                });

                //Style the details table
                $("tr:first-child", CfDialog.dlg).addClass("FirstRow");
                $("tr:nth-child(even)", CfDialog.dlg).addClass("EvenRow");
            }
            else {
                CfDialog.dlg.dialog("open");
            }
        },

        //Tidies up the dialog when closed
        beforeClose: function () {
            $("input[type='radio']", CfDialog.dlg).prop("checked", false)
            $("div[id$='Form']", CfDialog.dlg).hide();
            $("div[class='validation-summary-errors'] ul > li").remove();
            $("select", CfDialog.dlg).val("");
            $("textarea", CfDialog.dlg).val("");
            $("#CancelButtonForm").show();
        },

        //Called when error raised from ajax POST
        errorHandler: function (jqXHR, textStatus, errorThrown) {
            $("#MessageArea", CfDialog.dlg).html("An error occurred while saving, please try again.").show();
            $("input", CfDialog.dlg).removeAttr("disabled");
        },

        //Called on successful submission of ajax POST
        successHandler: function (data) {
            $("#MessageArea", CfDialog.dlg).html("").hide();
            $("input", CfDialog.dlg).removeAttr("disabled");
            CfDialog.dlg.dialog("close");

            //Rest of method refreshes the table

            //Get reference to the table
            var table = $("#quotes-table").dataTable();
            //Get the current sort order
            var sortOrder = table.fnSettings().aaSorting;
            //Remove the data tables wrapper
            table.fnDestroy();

            //Remove all current rows
            $("#quotes-table tr[name='quote-row']").remove();

            //Add the fresh rows to the table
            var newRows = $("tr", "<table>" + data + "</table>");
            $("#quotes-table").append(newRows);

            //Initialise data tables wrapper
            CfDialog.tableInit();
            //Sort in previous order
            $("#quotes-table").dataTable().fnSort(sortOrder);
        }
    };
})