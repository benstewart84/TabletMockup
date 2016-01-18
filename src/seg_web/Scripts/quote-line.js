/* File Created: June 25, 2014 */

function LoadQuoteLines() {
    $.ajax({
        type: "GET",
        url: "/Quote/GetQuoteLines",
        content: "application/json; charset=utf-8",
        cache: false,
        dataType: "json",
        data: { jobRef: $("#Job_JobRef").val() },
        success: function (data) {
            var source = $("#quote-line-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $("#QuoteLinesBody").empty().append(html);
        },
        error: function (xhr, textStatus, errorThrown) {

        }
    });
}

$(function () {

    // Initially load the Quote Lines via AJAX.
    LoadQuoteLines();

    // Shows or hides the PartNumber if the type is a Part.
    $(document).on("change", "#QuoteLineTypeValue", function () {
        var partNumberContainer = $("#PartNumber").closest(".form-group");
        var makeVisible = $(this).val() == cf.partsLineType;
        if (makeVisible) {
            partNumberContainer.show(1000);
        } else {
            partNumberContainer.slideUp(500);
        }
    });

    // Adds the new line to a quote.
    $("#AddNewLine").on("click", function () {
        var frm = $("#QuoteLineForm");        
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Quote/CreateQuoteLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), JobRef: $("#JobRef").val(), ProjectQuoteId: $("#ProjectQuoteId").val(), QuoteLineTypeValue: $("#QuoteLineTypeValue").val(), PartNumber: $("#PartNumber").val(), Description: $("#Description").val(), Quantity: $("#Quantity").val(), UnitPrice: $("#UnitPrice").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#QuoteLineError").show();
                    } else {
                        LoadQuoteLines();
                        $('#NewLineModal').modal('hide');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#QuoteLineError").show();
                }
            });
        }
    });

    // Edits a quote line.
    $("#EditLine").on("click", function () {
        var frm = $("#QuoteLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Quote/EditQuoteLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), JobRef: $("#JobRef").val(), ProjectQuoteId: $("#ProjectQuoteId").val(), QuoteLineTypeValue: $("#QuoteLineTypeValue").val(), PartNumber: $("#PartNumber").val(), Description: $("#Description").val(), Quantity: $("#Quantity").val(), UnitPrice: $("#UnitPrice").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#QuoteLineError").show();
                    } else {
                        LoadQuoteLines();
                        $('#EditLineModal').modal('hide');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#QuoteLineError").show();
                }
            });
        }
    });

    // Deletes the Quote Document.
    $("#DeleteQuoteDoc").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/Quote/DeleteQuoteDocument",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: { UploadType: $("#UploadType").val(), JobRef: $("#JobRef").val() },
            success: function (d) {
                if (d === "Error") {
                    $("#QuoteLineError").show();
                } else {
                    location.reload(false);
                    $('#DeleteQuoteDocModal').modal('hide');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#QuoteLineError").show();
            }
        });
    });

    // Deletes a quote line.
    $("#DeleteLine").on("click", function () {
        var frm = $("#QuoteLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Quote/DeleteQuoteLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), JobRef: $("#JobRef").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#QuoteLineError").show();
                    } else {
                        LoadQuoteLines();
                        $('#DeleteLineModal').modal('hide');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#QuoteLineError").show();
                }
            });
        }
    });

    // Show the Delete Quote Document Dialog.
    $(document).on("click", ".delete-doc", function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function (data) {
            $('#DeleteQuoteDocModal .modal-body').html(data);
            $('#DeleteQuoteDocModal').modal('show');
        });
    });

    // Show the Delete Line Dialog.
    $(document).on("click", ".delete-detail-line", function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function (data) {
            $('#DeleteLineModal .modal-body').html(data);
            $('#DeleteLineModal').modal('show');
        });
    });

    // Show the Edit Line Dialog.
    $(document).on("click", ".edit-detail-line", function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function (data) {
            $('#EditLineModal .modal-body').html(data);
            $('#EditLineModal').modal('show');
        });
    });

    // Show the Add Line Dialog.
    $(document).on("click", ".add-detail-line", function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function (data) {
            $('#NewLineModal .modal-body').html(data);
            $('#NewLineModal').modal('show');
        });
    });

    // Hide the previous on close.
    $('#DeleteQuoteDocModal').on('hidden.bs.modal', function (e) {
        $(e.target).removeData("bs.modal").find(".modal-body").empty();
    });

    // Hide the previous on close.
    $('#DeleteLineModal').on('hidden.bs.modal', function (e) {
        $(e.target).removeData("bs.modal").find(".modal-body").empty();
    });

    // Hide the previous on close.
    $('#NewLineModal').on('hidden.bs.modal', function (e) {
        $(e.target).removeData("bs.modal").find(".modal-body").empty();
    });

    // Hide the previous on close.
    $('#EditLineModal').on('hidden.bs.modal', function (e) {
        $(e.target).removeData("bs.modal").find(".modal-body").empty();
    });
});