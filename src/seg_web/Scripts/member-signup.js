//Loads emtpy row to add a new site - load the new row at the end of the table - focus the first element and register the delete confirm dialog
function LoadSitePartial() {
    $.ajax({
        type: "GET",
        url: "/HelpDesk/AddNewSite",
        content: "application/html; charset=utf-8",
        cache: false,
        success: function (data) {
            $("#templateSite").addClass('show').removeClass('hide');
            $('#templateSite tr:last').after(data);
            $('#templateSite tr:last input[name="Site"]:first').focus();
            $('#templateSite tr').removeClass('highlight');
            $('#existingContactPanel').addClass('hide').removeClass('show');
            $("#templateSiteContact").addClass('hide').removeClass('show');

            $('.deleterow').easyconfirm();
        },
    });
}

// When select is clicked on any row
$(document).on('click', '.selectRow', function () {
    //Remove highlight from existing rows
    $('#templateSite tr').removeClass('highlight');
    //Get Reference of the newly selected row - highlight the class - show the panel to add new contacts - show the existing contacts
    var row = $(this).closest('tr').addClass('highlight');
    $(row).addClass('highlight').siblings().removeClass('highlight');
    $('#existingContactPanel').addClass('show').removeClass('hide');
    LoadExistingSiteContact();
});

//When save site is clicked parse the form using unobtrusive javascript and validate. If valid go ahead with the save or show the errors.
//On successfull save get the newly inserted site id put it as Id attribute of the row - Show the selection button and save confirmation dialog

$(document).on('click', '.saverow', function () {
    $.validator.unobtrusive.parse('#frmSite');
    $('#frmSite').validate();
    if ($('#frmSite').valid()) {
        // if form is valid then hide the validation summary div
        $("div.validation-summary-errors").addClass('hide').removeClass('show');
        var row = $(this).closest('tr');
        var rowId = "";
        if ($(this).closest('tr').attr('id')) {
            rowId = $(this).closest('tr').attr('id');
        }

        $.ajax({
            type: "POST",
            url: "/HelpDesk/SaveSite",
            cache: false,
            content: "application/html; charset=utf-8",
            data: {
                Id: rowId,
                Site: $(row).find('.site').val(),
                AddressLine1: $(row).find('.addressLine1').val(),
                AddressLine2: $(row).find('.addressLine2').val(),
                City: $(row).find('.siteCity').val(),
                PostCode: $(row).find('.postCode').val(),
                TypeAndSize: $(row).find('.siteTypeAndSize').val(),
                MemberId: $.trim($('#MemberId').text())
            },
            success: function (data) {
                if (data.success) {
                    $(row).attr('id', data.siteId);
                    $(row).find('input[name=btnSelect]').addClass('show').removeClass('hide');
                    $('#dialog').addClass('show').removeClass('hide');
                    ShowConfirmationDialogForSite();
                    $('.dialog-message').addClass('hide').removeClass('show');
                    $("#serverSideValidationContainer").addClass('hide').removeClass('show');
                    $(row).find('input').removeClass('input-validation-error');
                    $("#serverSideValidationContainer").empty();
                } else {
                    $("#serverSideValidationContainer").empty();
                    var response = data.modelErrors;
                    for (var i = 0; i < response.length; i++) {
                        var error = response[i];
                        $(row).find('.' + firstToLowerCase(error.Key)).addClass('input-validation-error');
                        $('<p>' + error.Message + '</p>').appendTo('#serverSideValidationContainer');
                    }

                    $("#serverSideValidationContainer").addClass('show').removeClass('hide');
                }
            },
        });
    } else {
        $("div.validation-summary-errors").addClass('show').removeClass('hide');
    }
});

//Called when delete is clicked for a site - hide any validation error on the row - get the referenced row. Check if this row is in db or still to be saved (It is checked by the presence of id attribute on the row)
//Remove row from the front end if not present in db or remove from db via ajax call
//Remove row from front end. Hide the table if this was the only row in the table

$(document).on('click', '.deleterow', function () {
    $('div.validation-summary-errors').addClass('hide').removeClass('show');
    var row = $(this).closest('tr');
    if (!$(this).closest('tr').attr('id')) {
        row.remove();
        if ($('#templateSite tr').length == 1) {
            $("#templateSite").addClass('hide').removeClass('show');
        }
    } else {
        $.ajax({
            type: "POST",
            url: "/HelpDesk/RemoveSite",
            content: "application/html; charset=utf-8",
            cache: false,
            data: {
                id: $(this).closest('tr').attr('id')
            },
            success: function () {
                row.remove();
                window.location.reload(true);
                if ($('#templateSite tr').length == 1) {
                    $("#templateSite").addClass('hide').removeClass('show');
                }
            },
        });
    }
    // $ajax put call of the current row's fields here
});

//Loads the site contacts for the highlighted row and remove any existing rows with contacts
function LoadExistingSiteContact() {
    if ($('#templateSite tr.highlight').attr('id') > 0) {
        $.ajax({
            type: "GET",
            url: "/HelpDesk/GetSiteExistingContacts",
            content: "application/html; charset=utf-8",
            cache: false,
            data: { id: $('#templateSite tr.highlight').attr('id') },
            success: function (data) {
                if ($.trim(data).length > 0) {
                    $("#templateSiteContact").find("tr:gt(0)").remove();
                    $("#templateSiteContact").append(data);
                    $("#templateSiteContact").addClass('show').removeClass('hide');
                    // Register the easy confirm delete dialog after we have loaded the contacts
                    $('.contactDeleteRow').easyconfirm();
                } else {
                    $("#templateSiteContact").addClass('hide').removeClass('show');
                }
            },
        });
    }
    $("#templateSiteContact").addClass('hide').removeClass('show');
}

//Loads a new row to add a new contact for the selected site. It adds the row at the end of the contacts table and focus is on the first element

function LoadContactPartial() {
    $.ajax({
        type: "GET",
        url: "/HelpDesk/AddNewSiteContact",
        content: "application/html; charset=utf-8",
        cache: false,
        data: { siteId: $('#templateSite tr.highlight').attr('id') },
        success: function (data) {
            $("#templateSiteContact").addClass('show').removeClass('hide');
            $('#templateSiteContact tr:last').after(data);
            $('#templateSiteContact tr:last input[class="name"]:first').focus();
        },
    });
}

//When save contact is clicked parse the form using unobtrusive javascript and validate. If valid go ahead with the save or show the errors.
//On successfull save get the newly inserted contact id put it as Id attribute of the row - show the confirmation dialog

$(document).on('click', '.contactSaveRow', function () {
    $.validator.unobtrusive.parse('#frmSite');
    if ($('#frmSite').valid()) {
        // if form is valid then hide the validation summary div
        $("div.validation-summary-errors").addClass('hide').removeClass('show');
        var row = $(this).closest('tr');
        var rowId = "";
        if ($(this).closest('tr').attr('id')) {
            rowId = $(this).closest('tr').attr('id');
        }

        $.ajax({
            type: "POST",
            url: "/HelpDesk/SaveSiteContact",
            content: "application/html; charset=utf-8",
            cache: false,
            data: {
                Id: rowId,
                Name: $(row).find('.name').val(),
                ContactNo: $(row).find('.contactNo').val(),
                Email: $(row).find('.email').val(),
                Role: $(row).find('.role').val(),
                MemberSiteId: $('#templateSite tr.highlight').attr('id')
            },
            success: function (data) {
                $(row).attr('id', data.contactId);
                UpdateContactsDropDownList();
                ShowConfirmationDialogForContact();
            },
        });
    } else {
        $("div.validation-summary-errors").addClass('show').removeClass('hide');
    }
});

//Called when delete is clicked for a contact - hide any validation error on the row - get the referenced row. Check if this row is in db or still to be saved (It is checked by the presence of id attribute on the row)
//Remove row from the front end if not present in db or remove from db via ajax call
//Remove row from front end. Hide the table if this was the only row in the table

$(document).on('click', '.contactDeleteRow', function () {
    $("div.validation-summary-errors").addClass('hide').removeClass('show');
    var row = $(this).closest('tr');
    if (!$(this).closest('tr').attr('id')) {
        row.remove();
        if ($('#templateSiteContact tr').length == 1) {
            $("#templateSiteContact").addClass('hide').removeClass('show');
        }
    } else {
        $.ajax({
            type: "POST",
            url: "/HelpDesk/RemoveMemberAsSiteContact",
            content: "application/html; charset=utf-8",
            cache: false,
            data: {
                contactId: $(this).closest('tr').attr('id'),
                siteId: $('#templateSite tr.highlight').attr('id')
            },
            success: function () {
                row.remove();
                UpdateContactsDropDownList();
                row.addClass('hide');
                if ($('#templateSiteContact tr').length == 1) {
                    $("#templateSiteContact").addClass('hide').removeClass('show');
                }
            },
        });
    }
});

//Pulls existing sites for a member and register easy confirm dialog for save confirmation. Also initialise the jquery ui tabs
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/HelpDesk/GetMemberExistingSites",
        content: "application/html; charset=utf-8",
        cache: false,
        data: {
            id: $.trim($('#MemberId').text())
        },
        success: function (data) {
            if ($.trim(data).length != 0) {
                $("#templateSite").addClass('show').removeClass('hide');
                $("#templateSite").append(data);
                $('.deleterow').easyconfirm();
            } else {
            }
        },
    });

    $("#tabs").tabs();
    MonthAndYearDatePicker();


    // Setting the size dropdown to show the default size based on the given site information on the previous tab
    var size = $.trim($('.sizeIndicator').val());
    if (size == 1)
        $('.sizeDropDown').val("Small");
    if (size == 2)
        $('.sizeDropDown').val("Medium");
    if (size == 3)
        $('.sizeDropDown').val("Large");
});

//Pulls existing contacts for a highlighted site.
function AddExistingContactToSite() {
    if ($.trim($('#ExistingContacts').val()) != 0) {
        $.ajax({
            type: "POST",
            url: "/HelpDesk/AddContactToSite",
            content: "application/html; charset=utf-8",
            cache: false,
            data: {
                contactId: $('#ExistingContacts').val(),
                siteId: $('#templateSite tr.highlight').attr('id')
            },
            success: function (data) {
                LoadExistingSiteContact();
                $('#existingContactPanel').addClass('show').removeClass('hide');
                $('tr#' + data.siteId).addClass("highlight").find("input[class='selectRow']").trigger('click');
            },
        });
    }
};

//This method calculates cost for all the packages use has selected for sign up
function CalculateCost() {
    //$('input, textarea, select').focus(function () {
    //    this.blur();
    //});

    $.ajax({
        url: '/HelpDesk/CalculateCost',
        contentType: false,
        data: $("#PackageSubscription").serialize(),
        type: 'GET',
        cache: false,
        success: function (data) {
            $('#totalCost').addClass('show').removeClass('hide');
            $('#totalCost').text('Monthly £' + roundDown(data.cost / 12, 2) + '       Annual £' + data.cost).css('white-space', 'pre');
            $('#costing').addClass('show').removeClass('hide');
            $('#totalCostContainer').addClass('show').removeClass('hide');
            for (var i = 0; i < data.sitesCost.length; i++) {
                $('#span' + i).text('  Monthly £' + roundDown(data.sitesCost[i] / 12, 2) + '       Annual £' + data.sitesCost[i]).css('white-space', 'pre');
                $('#costing' + i).addClass('show').removeClass('hide');
            }
        }
    });
}

// tableId will be the table Id of the table where selections are made for packages during signup
function ValidateSelectedPackages(tableId) {
    // Arrary to store all the PPMType Packages with only single PPMType
    var singlePPMTypePackagesList = [];

    $('table[data-table-id=' + tableId + '] tr[data-ppmtypeids]').each(function (i, row) {
        if (($(row).attr('data-ppmtypeids').match(/,/g) || []).length == 1) {
            //Fill the array with the single ppm type packages
            singlePPMTypePackagesList.push(($(row).attr('data-ppmtypeids')));
        }
    });

    //Iterating through all the rows of the table to find rows containing group packages where single PPMType package exists and then comparing
    //the size. If there is a match, alert the user, disable that row for that package size
    for (var j = 0; j < singlePPMTypePackagesList.length; j++) {
        var rrow = 'table[data-table-id=' + tableId + '] tr[data-ppmtypeids]';

        $(rrow).each(function (i, row) {
            if (($(row).attr('data-ppmtypeids').match(/,/g) || []).length > 1) {
                if (($(row).attr('data-ppmtypeids')).indexOf(singlePPMTypePackagesList[j]) > -1) {

                    if ($(row).find('input[type="radio"]:checked').length>0) {

                        if ($(row).find('.sizeDropDown').val() == $("table[data-table-id=" + tableId + "] tr[data-ppmtypeids='" + singlePPMTypePackagesList[j] + "']").find('.sizeDropDown').val() &&
                            ($(row).find('input[type="radio"]:checked').closest('label').text() == 'Yes' &&
                            $("table[data-table-id=" + tableId + "] tr[data-ppmtypeids='" + singlePPMTypePackagesList[j] + "']").find('input[type="radio"]:checked').closest('label').text() == 'Yes')) {
                            alertify.alert('You cannot select an individual PPM Type Package when you have already selected a group package of the same size!');

                            $("table[data-table-id=" + tableId + "] tr[data-ppmtypeids='" + singlePPMTypePackagesList[j] + "']").find('select').attr("disabled", 'disabled').val('');

                            $("table[data-table-id=" + tableId + "] tr[data-ppmtypeids='" + singlePPMTypePackagesList[j] + "']").find('input[type="radio"]:not(:checked)').prop('checked', true);
                            ProcessRowSelections(row);
                        } else
                            $("table[data-table-id=" + tableId + "] tr[data-ppmtypeids='" + singlePPMTypePackagesList[j] + "']").find('select').removeAttr("disabled").removeAttr('checked');
                        ProcessRowSelections(row);
                    }
                }
            };
        });
    }
}

//This function will Get all the member contacts and update the dropdownlist

function UpdateContactsDropDownList() {
    $.ajax({
        url: '/HelpDesk/GetMembersContactList',
        contentType: false,
        data: { id: $.trim($('#MemberId').text()) },
        type: 'GET',
        cache: false,
        success: function (data) {
            $("#ExistingContacts").empty();
            $.each(data, function (index, optiondata) {
                $("#ExistingContacts").append("<option value='" + optiondata.Value + "'>" + optiondata.Text + "</option>");
            });
        }
    });
}

//This function will get the package size info from the database

function GetPackageSizeDescription(element) {
    var row = $(element).closest('tr');

    $.ajax({
        url: '/HelpDesk/GetPackageSizeDescription',
        contentType: false,
        data: { packageId: $(row).find('.packageId').val(), size: $(row).find('.sizeDropDown').val() },
        type: 'GET',
        cache: false,
        success: function (data) {
            $('#myModal').modal('show');
            $(".modal-body").text(data.Text);
        }
    });
}

//This method will be used if we need to extract value for anti forgery token
AddAntiForgeryToken = function (data) {
    data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
    return data;
};

//This method shows the confirmation dialog after saving. Reloads the page using window.location.reload as changes on the site screens can impact the values on the package selection screen
function ShowConfirmationDialogForSite() {
    $("#dialog").dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        },
        close: function (event, ui) {
            window.location.reload(true);
        }
    });
}

function ShowConfirmationDialogForContact() {
    $("#dialog").addClass('show').removeClass('hide');
    $("#dialog").dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
                $("#dialog").addClass('hide').removeClass('show');
            }
        },
    });
}

function roundDown(number, decimals) {
    decimals = decimals || 0;
    return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(2);
}

function firstToLowerCase(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}

$('input:radio').on('click', function () {
    var row = $(this).closest('tr');
    ProcessRowSelections(row);
});

function ProcessRowSelections(row)
{
    if ($(row).find("input[type=radio]:checked").val() == 'False') {
        $(row).find('select').attr("disabled", "disabled");
        $(row).find('select').val('');
    } else {
        //if ($(row).find('select').val() != null) {
        $(row).find('select').removeAttr("disabled");
        //}
    }
}

function ValidateAllPackagesHaveBeenSelected() {
    var names = {};
    $('tr:not(".hide") input:radio').each(function () {
        names[$(this).attr('name')] = true;
    });

    var count = 0;
    $.each(names, function (key, value) {
        if (!$('input[name=\'' + key + '\']').is(':checked')) {
            count++;
            $('td input[name=\'' + key + '\']').closest('td').addClass('packageSelect');
            $('.validation-summary-errors').addClass('show');
        } else {
            $('td input[name=\'' + key + '\']').closest('td').removeClass('packageSelect');
        }
    });

    if (count == 0) {
        $('td').removeClass('packageSelect');
        $('.validation-summary-errors').removeClass('show').addClass('hide');
    }

    return (count == 0) ? true : false;
}

function MonthAndYearDatePicker() {
    $('.month_year_datepicker').datepicker(
    {
        dateFormat: "MM yy",
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        onClose: function (dateText, inst) {
            function isDonePressed() {
                return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
            }

            if (isDonePressed()) {
                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                $(this).datepicker('setDate', new Date(year, month, 1)).trigger('change');

                $('.date-picker').focusout(); //Added to remove focus from datepicker input box on selecting date
            }
        },
        beforeShow: function (input, inst) {
            inst.dpDiv.addClass('month_year_datepicker');

            if ((datestr = $(this).val()).length > 0) {
                year = datestr.substring(datestr.length - 4, datestr.length);
                month = datestr.substring(0, 2);
                $(this).datepicker('option', 'defaultDate', new Date(year, month - 1, 1));
                $(this).datepicker('setDate', new Date(year, month - 1, 1));
                $(".ui-datepicker-calendar").hide();
            }
        }
    });
    $(".month_year_datepicker").focus(function () {
        $(".ui-datepicker-calendar").hide();
        $('<style type="text/css"> .ui-datepicker-current { display: none; } </style>').appendTo("head");
        $('<style type="text/css"> .ui-datepicker-title select { font-size:0.9em !important; font-weight:normal !important; } </style>').appendTo("head");
        $('<style type="text/css"> .ui-priority-primary, .ui-widget-content .ui-priority-primary, .ui-widget-header .ui-priority-primary {font-weight:normal !important;} </style>').appendTo("head");
        $("#ui-datepicker-div").position({
            my: "center top",
            at: "center bottom",
            of: $(this)
        });
    });
}