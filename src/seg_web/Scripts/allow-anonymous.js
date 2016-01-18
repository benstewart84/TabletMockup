$(document).ready(function() {

    // Disable submit button on click to prevent double-clicking which causes issue with anti-forgery token
    $("input[type='submit']").click(function (event) {

        event.preventDefault();

        // Find the form in which the submit button is contained
        var frm = $(event.target).closest("form");

        var valid;

        // Check if form can be validated client side with javascript
        if (typeof $(frm).validate == 'function') {

            // Validate form
            frm.validate();
            valid = frm.valid();

        } else {

            // Cannot validate client side, so default to being valid, server will validate
            valid = true;
        }

        if (valid) {

            // Disable submit button and then submit form
            $(event.target).attr('disabled', 'disabled');
            $(frm).submit();

        }
    });

});