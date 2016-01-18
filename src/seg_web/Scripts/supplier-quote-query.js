/// <reference path="_references.js" />
/// <reference path="common-helpers.js" />

$(document).ready(function () {

    var helpers = new CommonHelpers();

    var queryHistoryTable = $("table.query-history");
    var queryHistoryTitle = $("#query-history-title");

    // Create toggle link
    var displayToggleLink = document.createElement("a");
    displayToggleLink.href = "#";
    displayToggleLink.textContent = "Show/hide";
    $(displayToggleLink).click(function () {
        queryHistoryTable.toggleClass("hidden");
    });

    // Add toggle link to history title
    queryHistoryTitle.append(displayToggleLink);

    helpers.disableFormFocusOutValidation();

});

// Hide query history by default
$("table.query-history").addClass("hidden");