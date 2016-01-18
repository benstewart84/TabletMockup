$(document).ready(function () {
    // Adds the RequestVerificationToken to all Ajax POSTS by default.
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajaxPrefilter(function (options, originalOptions) {
        if (options.type.toUpperCase() == "POST") {
            options.data = $.param($.extend(originalOptions.data, { __RequestVerificationToken: token }));
        }
    });

    // Fallback autofocus support for non compliant browsers.
    $('[autofocus]:not(:focus)').eq(0).focus();
});