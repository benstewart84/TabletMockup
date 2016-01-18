/* File Created: June 25, 2014 */

function LoadInvoiceLines() {
    $.ajax({
        type: "GET",
        url: "/Supplier/GetInvoiceLines",
        content: "application/json; charset=utf-8",
        cache: false,
        dataType: "json",
        data: { workOrderRef: $("#WorkOrder_WorkOrderRef").val() },
        success: function (data) {
            var source = $("#invoice-line-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $("#InvoiceLinesBody").empty().append(html);
        },
        error: function (xhr, textStatus, errorThrown) {

        }
    });
}

$(function () {

    // Initially load the Quote Lines via AJAX.
    LoadInvoiceLines();

    // Shows or hides the PartNumber if the type is a Part.
    $(document).on("change", "#InvoiceLineTypeId", function () {
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
        var frm = $("#InvoiceLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Supplier/CreateInvoiceLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), WorkOrderRef: $("#WorkOrderRef").val(), HeaderId: $("#HeaderId").val(), InvoiceLineTypeId: $("#InvoiceLineTypeId").val(), PartNumber: $("#PartNumber").val(), Description: $("#Description").val(), Quantity: $("#Quantity").val(), UnitPrice: $("#UnitPrice").val(), UnitTaxAmount: $("#UnitTaxAmount").val() },
                success: function (d) {
                    if (d.indexOf("Error") === 0) {
                        $("#InvoiceLineError").text(d)
                        $("#InvoiceLineError").show();
                    } else {
                        LoadInvoiceLines();
                        $('#NewLineModal').modal('hide');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#InvoiceLineError").show();
                }
            });
        }
    });

    //saves the note by supplier on an invoice query.
    $("#btnSaveNotes").on("click", function () {

        $.ajax({
            type: "POST",
            url: "/Supplier/SaveSupplierNotes",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: { invoiceId: $("#InvoiceHeader_Id").val(), queryResponse: $("#QueryResponse").val() },
            success: function (d) {
                if (d.Success == true) {
                    $("#resultContainer").addClass('show').removeClass('hide');
                    $("#resultContainer").text('Successfully saved!');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#resultContainer").addClass('show').removeClass('hide');
                $("#resultContainer").text('Error Occured!');
            }
        });
    });


    // Edits a quote line.
    $("#EditLine").on("click", function () {
        var frm = $("#InvoiceLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Supplier/EditInvoiceLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), WorkOrderRef: $("#WorkOrderRef").val(), HeaderId: $("#HeaderId").val(), InvoiceLineTypeId: $("#InvoiceLineTypeId").val(), PartNumber: $("#PartNumber").val(), Description: $("#Description").val(), Quantity: $("#Quantity").val(), UnitPrice: $("#UnitPrice").val(), UnitTaxAmount: $("#UnitTaxAmount").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#InvoiceLineError").show();
                    } else {
                        LoadInvoiceLines();
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
        var frm = $("#InvoiceLineForm");
        if (frm.validate() && frm.valid()) {
            $.ajax({
                type: "POST",
                url: "/Supplier/DeleteInvoiceLine",
                content: "application/json; charset=utf-8",
                dataType: "json",
                data: { Id: $("#Id").val(), JobRef: $("#JobRef").val() },
                success: function (d) {
                    if (d === "Error") {
                        $("#InvoiceLineError").show();
                    } else {
                        LoadInvoiceLines();
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
    $("#DeleteInvoiceDoc").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/Supplier/DeleteInvoiceDocument",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: { UploadType: $("#UploadType").val(), JobRef: $("#JobRef").val(), DocumentRef: $("#DocumentRef").val() },
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

    // Removes an Invoice Document by Accounts Payable user
    $("#RemoveInvoiceDoc").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/AccountsPayable/RemoveInvoiceDocument",
            content: "application/json; charset=utf-8",
            dataType: "json",
            data: { DocumentType: $("#DocumentType").val(), WorkOrderRef: $("#WorkOrderRef").val(), DocumentRef: $("#DocumentRef").val() },
            success: function (d) {
                if (d === "Error") {
                    $("#InvoiceLineError").show();
                } else {
                    location.reload(false);
                    $('#RemoveInvoiceDocModal').modal('hide');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#InvoiceLineError").show();
            }
        });
    });

    // Show the Remove Document Dialog for Accounts Payable user
    $(document).on("click", ".remove-doc", function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.get(url, function (data) {
            $('#RemoveInvoiceDocModal .modal-body').html(data);
            $('#RemoveInvoiceDocModal').modal('show');
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
    $('#RemoveInvoiceDocModal').on('hidden.bs.modal', function (e) {
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