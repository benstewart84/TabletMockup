$(function () {

    // Scrolls to any local href.
    $("a[href^='#'").on("click", function (event) {
        var target = $($(this).attr('href'));
        if (target.length) {
            event.preventDefault();
            $("html, body").animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
});