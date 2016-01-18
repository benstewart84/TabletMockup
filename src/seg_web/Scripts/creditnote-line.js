/* File Created: July 21, 2015 */

function LoadCreditNoteLines() {
    $.ajax({
        type: "GET",
        url: "/Supplier/GetCreditNoteLines",
        content: "application/json; charset=utf-8",
        cache: false,
        dataType: "json",
        data: { workOrderRef: $("#WorkOrder_WorkOrderRef").val() },
        success: function (data) {
            var source = $("#creditnote-line-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $("#CreditNoteLinesBody").empty().append(html);
        },
        error: function (xhr, textStatus, errorThrown) {

        }
    });
}

$(function () {

    // Initially load the Quote Lines via AJAX.
    LoadCreditNoteLines();

    // Shows or hides the PartNumber if the type is a Part.
    $(document).on("change", "#CreditNoteLineTypeId", function () {
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
        var frm = $("#CreditNoteLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Supplier/CreateCreditNoteLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), WorkOrderRef: $("#WorkOrderRef").val(), HeaderId: $("#HeaderId").val(), CreditNoteLineTypeId: $("#CreditNoteLineTypeId").val(), PartNumber: $("#PartNumber").val(), Description: $("#Description").val(), Quantity: $("#Quantity").val(), UnitPrice: $("#UnitPrice").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#invoiceLineError").show();
                    } else {
                        LoadCreditNoteLines();
                        $('#NewLineModal').modal('hide');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#InvoiceLineError").show();
                }
            });
        }
    });

   

    // Edits a quote line.
    $("#EditLine").on("click", function () {
        var frm = $("#CreditNoteLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Supplier/EditCreditNoteLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), WorkOrderRef: $("#WorkOrderRef").val(), HeaderId: $("#HeaderId").val(), CreditNoteLineTypeId: $("#CreditNoteLineTypeId").val(), PartNumber: $("#PartNumber").val(), Description: $("#Description").val(), Quantity: $("#Quantity").val(), UnitPrice: $("#UnitPrice").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#CreditNoteLineError").show();
                    } else {
                        LoadCreditNoteLines();
                        $('#EditLineModal').modal('hide');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#InvoiceLineError").show();
                }
            });
        }
    });

    // Deletes a quote line.
    $("#DeleteLine").on("click", function () {
        var frm = $("#CreditNoteLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Supplier/DeleteCreditNoteLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), JobRef: $("#JobRef").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#InvoiceLineError").show();
                    } else {
                        LoadCreditNoteLines();
                        $('#DeleteLineModal').modal('hide');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#InvoiceLineError").show();
                }
            });
        }
    });

    // Deletes an Invoice Document.
    $("#DeleteCreditNoteDoc").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/Supplier/DeleteCreditNoteDocument",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: { UploadType: $("#UploadType").val(), JobRef: $("#JobRef").val(),DocumentRef:$("#DocumentRef").val() },
            success: function (d) {
                if (d === "Error") {
                    $("#InvoiceLineError").show();
                } else {
                    location.reload(false);
                    $('#DeleteInvoiceDocModal').modal('hide');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#InvoiceLineError").show();
            }
        });
    });

    // Show the Delete Quote Document Dialog.
    $(document).on("click", ".delete-doc", function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function (data) {
            $('#DeleteInvoiceDocModal .modal-body').html(data);
            $('#DeleteInvoiceDocModal').modal('show');
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
    $('#DeleteInvoiceDocModal').on('hidden.bs.modal', function (e) {
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