/// <reference path="_references.js" />

function LoadObservations() {
    $.ajax({
        type: "GET",
        url: "GetObservations",
        cache: false,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: { jobRef: $("#JobRef").val() },
        success: function (data) {
            var source = $("#observations-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $("#ObservationsBody").empty().append(html);
        },
        error: function (xhr, textStatus, errorThrown) {

        }
    });
}

function UpdateAffirmationUI() {
    var selectedVal = $("#SelectedAffirmation").find(":selected").val();
    // Reactive = Complete OR PPM Complete Fail.
    if (selectedVal == 1) {
        $("#QuoteRequiredSpan").show(1000);
    } else {
        $("#QuoteRequiredSpan").slideUp(500);
    }

    // Reactive = Complete OR PPM Complete Pass.
    if (selectedVal == 1 || selectedVal == 5 || selectedVal == 6) {
        $("#CertificateCompletedSpan").show(1000);
        $(".signature-container").show(1000, function() {
            OnResize();
        });
    } else {
        $("#CertificateCompleted").attr('checked', false);
        $("#CertificateCompletedSpan").slideUp(500);
        $(".signature-container").slideUp(500);
        UpdateCertificateUI();
    }

    // Awaiting parts OR Returning.
    if (selectedVal == 2 || selectedVal == 4) {
        $(".return-date-row").show(1000);
    } else {
        $(".return-date-row").slideUp(500);
    }
}

function UpdateCertificateUI() {
    if ($("#CertificateCompleted").is(":checked"))
    {
        $(".closedown-certificate-input").show(1000);
    }
    else
    {
        $(".closedown-certificate-input").slideUp(500);      
    }
}

function ToJavaScriptDate(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
}

function UpdateNotesCountdown() {
    var len = $("#SupplierNotes").val().length;
    var remaining = 500 - len;
    if (remaining <= 25) {
        $(".countdown").addClass("warning-text");
    } else {
        $(".countdown").removeClass("warning-text");
    }
    $(".countdown").text("(" + remaining + " characters remaining)");
}

function OnResize() {
    // Resize the signature Canvas to be 100% its container.
    signature.width = $(".signature-container").innerWidth();
    StoreBlankSignatureData();
}

// Used to compare against the submitted Signature for required validation.
function StoreBlankSignatureData() {
    $("#BlankSignatureData").val(signature.toDataURL());
}

function InitialiseSignaturePad() {
    var canvas = document.querySelector("canvas");
    var signaturePad = new window.SignaturePad(canvas);
    window.addEventListener('resize', OnResize, false);
    StoreBlankSignatureData();
    $(".closedown-form").submit(function () {
        $("#SignatureData").val(signaturePad.toDataURL());
        return true;
    });
}

$(document).ready(function () {

    LoadObservations();
    UpdateAffirmationUI();
    UpdateCertificateUI();
    UpdateNotesCountdown();
    OnResize();

    InitialiseSignaturePad();

    // Updates the Supplier Notes field with a max char counter.
    $('#SupplierNotes').change(UpdateNotesCountdown);
    $('#SupplierNotes').keyup(UpdateNotesCountdown);
    $('#SupplierNotes').keydown(UpdateNotesCountdown);

    // Show QuoteRequired option if Affirmation is a Successful one.
    $("#CertificateCompleted").on("click", function () {
        UpdateCertificateUI();
    });

    // Show QuoteRequired option if Affirmation is a Successful one.
    $("#SelectedAffirmation").change(function () {
        UpdateAffirmationUI();
    });

    // Monitors for changes in state and removes validation error if changed.
    $("#SelectedCertificateType").change(function () {
        $(this).closest("div.form-group").removeClass("has-error");
    });

    // Monitors for changes in state and removes validation error if changed.
    $("#CertificateNumber").change(function () {
        $(this).closest("div.form-group").removeClass("has-error");
    });

    // Monitors for changes in state and removes validation error if changed.
    $("#ReturnDate").change(function () {
        $(this).closest("div.form-group").removeClass("has-error");
    });

    // Show the Return Date warning if the date is after the Due Date.
    $("#ReturnDate").change(function () {
        var dueDate = $("#DueDate").val();
        var returnDate = $("#ReturnDate").val();
        if (dueDate && returnDate)
        {
            var dueDateParts = dueDate.split("/");
            var dueDateParsed = new Date(Number(dueDateParts[2].substring(0, 4)), Number(dueDateParts[1]) - 1, Number(dueDateParts[0]));

            var returnDateParts = returnDate.split("/");
            var returnDateParsed = new Date(Number(returnDateParts[2]), Number(returnDateParts[1]) - 1, Number(returnDateParts[0]));

            if (returnDateParsed > dueDateParsed)
            {
                $(".return-date-warning").show(1000);
                return;
            }
        }

        $(".return-date-warning").slideUp(500);
    });

    // Show the Observation Modal.
    $("#AddObservation").on("click", function () {
        if ($("#ObservationText").val()) {
            $.ajax({
                type: "POST",
                url: "AddObservation",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { jobRef: $("#JobRef").val(), observation: $("#ObservationText").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#ObservationError").show();
                    } else {
                        LoadObservations();
                        $('#ObservationModal').modal('hide');
                    }
                },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#ObservationError").show();
                }
            });            
        }
    });

    // Hide the previous on close.
    $('#ObservationModal').on('hidden.bs.modal', function (e) {
        $("#ObservationError").hide();
        $("#ObservationText").val('');
    });
});