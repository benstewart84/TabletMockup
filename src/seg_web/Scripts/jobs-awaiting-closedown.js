/// <reference path="_references.js" />

$(document).ready(function () {

    // Get all the table cells containing notes
    var notecells = $("td.notes");

    // Surround content in notes cells with a span and add a view hyperlink
    $(notecells).each(function () {

        if ($(this).text().length > 0) {
            $(this).wrapInner("<span></span>").append("<a data-toggle='modal' data-target='#NotesModal' href=\"#\"><img src='/Content/images/notes.png' height='24px' width='24px' alt='View Notes' /></a>");
        }
        
    });

    // Hide all the note text
    $("span", notecells).hide();

    // Click handler for view hyperlink
    $("a", notecells).click(function (event) {

        event.preventDefault();

        //// Find the span containing the notes associated with the hyperlink
        var notes = $(event.target).closest('td').find('span');
        $("div.modal-body").text(notes.text());
    });

});