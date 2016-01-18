/// <reference path="_references.js" />

function LoadNotes() {
    $.ajax({
        type: "GET",
        url: "/Helpdesk/GetNotes",
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: { id: $("#Id").val() },
        success: function (data) {
            var context = $.parseJSON(data); // convert string into object. As the template expects the objects
            var source = $("#notes-template").html();
            var template = Handlebars.compile(source);

            var html = template(context);
            $("#NotesBody").html(html);
        },
        error: function (xhr, textStatus, errorThrown) {

        }
    });
}


function SaveLead() {
    $.validator.unobtrusive.parse('#FollowUpLeadForm');
    $('#FollowUpLeadForm').validate();
    if ($('#FollowUpLeadForm').valid()) {
        HideValidationSummary();
        $.ajax({
            type: "POST",
            url: "/Helpdesk/SaveLead",
            dataType: "json",
            data: { id: $("#Id").val(), callbackDateTime: $("#CallBackDateTime").val() },
            success: function (data) {
                $('#Output').addClass('show').removeClass('hide');
                if (data.Error) {
                    $('#responseText').text(data.ErrorMessage).toggleClass('alert-success alert-danger');
                    $('#CallBackDateTime').addClass('input-error');
                } else {
                    
                    $('#responseText').text('Successfully saved!').toggleClass('alert-danger alert-success');
                    $('#CallBackDateTime').removeClass('input-error');
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                $('#Output').addClass('hide').removeClass('show');
            }
        });
    } else {
        ShowValidationSummary();
        $('#Output').addClass('hide').removeClass('show');
    }
}

function SaveServiceDecline() {

    $.ajax({
        type: "POST",
        url: "/Helpdesk/SaveServiceDecline",
        dataType: "json",
        data: { id: $("#Id").val(), declineReasonId: $('#DeclineReasonId').val() },
        success: function (data) {
            $('#leadStatus').text('Declined');
          
        },
        error: function (xhr, textStatus, errorThrown) {
            $('#Output').addClass('hide').removeClass('show');
        }
    });
}

// Jquery date and time picker
$(document).ready(function () {
    LoadNotes();
    $.validator.addMethod(
               "date",
               function (value, element) {
                   var bits = value.match(/([0-9]+)/gi), str;
                   if (!bits)
                       return this.optional(element) || false;
                   str = bits[1] + '/' + bits[0] + '/' + bits[2];
                   return this.optional(element) || !/Invalid|NaN/.test(new Date(str));
               },
               ""
               );

    $(function () {

        $('.jquery_bootstrapdatetimepicker').datetimepicker({
            format: 'MM/DD/YY hh:mm A',
            daysOfWeekDisabled: [0, 6],
            inline: false,
            sideBySide: false,
            showClose: true,
            showClear: true,
            widgetPositioning: {
                horizontal: 'left',
                vertical: 'bottom'
            }

        });

    });


 

    // Show the Notes Modal.
    $("#AddNotes").on("click", function () {
        if ($("#NotesText").val()) {
            $.ajax({
                type: "POST",
                url: "/Helpdesk/AddNotes",
                cache:false,
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { id: $("#Id").val(), note: $("#NotesText").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#NotesError").show();
                    } else {
                        LoadNotes();
                        $('#NotesModal').modal('hide');
                    }
                },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#NotesError").show();
                }
            });            
        }
    });

    // Hide the previous on close.
    $('#NotesModal').on('hidden.bs.modal', function (e) {
        $("#NotesError").hide();
        $("#NotesText").val('');
    });

    // Show the Service decline Modal.
    $("#ServiceDeclineAddNotes").on("click", function () {
        if ($("#ServiceDeclineNotesText").val().length > 0) {
            $('#btnMemberSignUp').addClass('disabled');
            $('#ServiceDeclineModal').removeClass('input-validation-error');
            SaveServiceDecline();
            $.ajax({
                type: "POST",
                url: "/Helpdesk/AddNotes",
                content: "application/json; charset=utf-8",
                dataType: "json",
                cache:false,
                data: { id: $("#Id").val(), note: $("#ServiceDeclineNotesText").val() },
                success: function(d) {
                    if (d === "Error") {
                        $("#ServiceDeclineError").show();
                    } else {
                        LoadNotes();
                        $('#ServiceDeclineModal').modal('hide');
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    $("#ServiceDeclineError").show();
                }
            });
        } else {
            $('#ServiceDeclineNotesText').addClass('input-validation-error');
            //$('#ServiceDeclineModal').modal('hide');
            //$("#ServiceDeclineNotesText").val('');
        }

    });

    // Hide the previous on close.
    $('#ServiceDeclineModal').on('hidden.bs.modal', function (e) {
        $("#ServiceDeclineError").hide();
        $("#ServiceDeclineError").val('');
        $('#ServiceDeclineModal').removeClass('input-validation-error');
    });
});

function HideValidationSummary() {
    $(".validation-summary-errors").hide();
}


function ShowValidationSummary() {
    $(".validation-summary-errors").show();
}
