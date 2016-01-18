/* File Created: August 14, 2013 */
$(function () {
    var onRowClick = function () {
        //Pull the quote details from the table row
        //debugger
        var $this = $(this);
        var QasID = $this.attr("qas-id");
        var documentSource = $this.attr("document-source");
        var hasQuoteTemplate = !!$this.attr("has-template");
        var hasSupplierQuote = !!$this.attr("has-supplier-quote");
        var cells = $("td", this);
        var data = {};
        data.jobId = $(cells[0]).text();
        data.date = $(cells[1]).text();
        data.faultService = $(cells[3]).text();
        data.scopeOfWork = $(cells[2]).text();
        data.value = $(cells[5]).text();
        
        if (hasQuoteTemplate) {
            data.quoteTemplate = "<a target='_blank' href='" + documentSource + "/" + QasID + "'>Open</a>";
        } else {
            data.quoteTemplate = "N/A";
        }
        if (hasSupplierQuote) {
            data.supplierQuote = "<a target='_blank' href='" + documentSource + "/" + QasID + "?type=SupplierQuote'>Open</a>";
        } else {
            data.supplierQuote = "N/A";
        }


        CfDialog.displayDialog(tableInit);

        //Populate the dialog with quote details
        $("input[id$='QasID']").val(QasID);

        for (var prop in data) {
            if (prop == "quoteTemplate" || prop =="supplierQuote") {
                $("#qd-" + prop, CfDialog.dlg).text("");
                $("#qd-" + prop, CfDialog.dlg).append(data[prop]);
            } else {
                $("#qd-" + prop, CfDialog.dlg).text(data[prop]);
            }

        }
    };

    var tableInit = function () {
        $("#quotes-table").dataTable({
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "bSort": true,
            "bInfo": false,
            "bAutoWidth": false,
            "aoColumnDefs": [{ "sType": "date-euro", "aTargets": [1] }, { "sType": "currency", "aTargets": [5]}]
        });
        $("tr[name='quote-row']").on("click", onRowClick);
    };

    tableInit();
})