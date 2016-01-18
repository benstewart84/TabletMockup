$(document).ready(function () {
    $("#Reason").change(function () {
        var selectedVal = $(this).find(":selected").val();
        if (selectedVal === "Other") {
            $(".certificate-query-other").show(500);
        } else {
            $(".certificate-query-other").hide();
        }
    });

    // Show the Observation Modal.
    $("#SaveQuery").on("click", function () {
        var queryText = $("#Reason").find(":selected").val();
        if (queryText === "Other") {
            queryText = $("#Other").val();
        }

        $.ajax({
            type: "POST",
            url: "QueryCertificate",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: { jobRef: $("#JobRef").val(), queryText: queryText },
            success: function (d) {
                if (d === "Error") {
                    $("#QueryError").show();
                } else {
                    $("#QueryCertificateModal").modal("hide");
                    $("#BackButton")[0].click();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#QueryError").show();
            }
        });
    });

    // Used to hide adobe object due to IE overlay and bootstrap modal issue.
    $("#QueryDocument").on("click", function () {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            $(".doc-view").hide();
        }
    });

    // Used to hide show object due to IE overlay and bootstrap modal issue.
    $('#QueryCertificateModal').on('hidden.bs.modal', function (e) {
        $(".doc-view").show();
    });
});