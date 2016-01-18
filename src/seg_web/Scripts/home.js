var scrolling = false;

// function: check if snap scrolling is currently in progress
function ScrollAnimating() {
    return scrolling;
}

function ScrollStarted() {
    scrolling = true;
}

function ScrollDone() {
    scrolling = false;
}

// function: animate the snap scroll
function SnapScroll(section, speed) {
    if (!ScrollAnimating()) {
        if (speed == undefined) {
            speed = 1100;
        }
        var windowHeight = $(window).height();
        var slideHeight = windowHeight * (section - 1);
        $('.slide-wrapper').animate({ marginTop: '-' + slideHeight }, { duration: speed, easing: 'easeOutCubic', start: ScrollStarted, done: ScrollDone });
        InvertNav(section);
    }
}

// function: scroll up or down by one slide
function SlideOnce(direction) {
    if (!ScrollAnimating()) {

        // variables
        var slideCount = $('.home-nav > ul > li:visible').length;
        var currentDot = $('.home-nav ul li.active').attr('data-slide');
        if (direction == 'up') {
            if (currentDot <= slideCount && currentDot > 1) {
                var scrollDot = $('.home-nav ul li.active').removeClass('active').prev().addClass('active').attr('data-slide');
                SnapScroll(scrollDot);
            }
        } else {
            if (currentDot < slideCount) {
                var scrollDot = $('.home-nav ul li.active').removeClass('active').next().addClass('active').attr('data-slide');
                SnapScroll(scrollDot);
            }
        }
    }
}

// function: invert the right nav if it blends in too much with the background
function InvertNav(section) {
    var navState = $('.home-nav ul li[data-slide=' + section + ']').attr('data-nav');
    if (navState == 'invert') {
        $('.home-nav').addClass('invert');
    } else {
        $('.home-nav').removeClass('invert');
    }
}

// set the right nav data attributes
function ReorderNav() {
    var totalDots = $('.home-nav ul li').length;
    for (var i = 1; i <= totalDots; i++) {
        $('.home-nav ul li:nth-child(' + i + ')').attr('data-slide', i);
    }
}

function ResizeSlides() {
    var windowHeight = $(window).height();
    var slideCount = $('.home-nav > ul > li:visible').length;
    $('section.slide').css('height', windowHeight);
    var totalHeight = windowHeight * slideCount;
    $('.slide-wrapper').css('height', totalHeight);
    var slideNumber = $('.home-nav ul li.active').attr('data-slide');
    var moveHeight = '-' + (windowHeight * (slideNumber - 1)) + 'px';
    $('.slide-wrapper').css('margin-top', moveHeight);
}

// mobile detector
function IsMobile() {
    var viewportWidth = $(window).width();
    if (viewportWidth <= 760) {
        return true;
    } else {
        return false;
    }
}

$(document).ready(function () {

    if (!IsMobile()) {
        // set first dot on right nav to active state
        $('.home-nav ul li:first-child').addClass('active');

        // right nav tool tips
        if (!$('html').hasClass('touch')) {
            $('.home-nav ul li').hover(function () {
                $(this).find('.nav-label').stop().fadeIn(150);
            }, function () {
                $(this).find('.nav-label').stop().fadeOut(150);
            });
        }

        // navigation: clicking right nav dots
        $('.home-nav ul li').on('click', function () {
            if (!ScrollAnimating()) {
                if (!$(this).hasClass('active')) {
                    $('.home-nav ul li').removeClass('active');
                    $(this).addClass('active');
                    var slideNumber = $(this).attr('data-slide');
                    SnapScroll(slideNumber);
                }
            }
        });

        // navigation: using mousewheel
        $('body').bind('mousewheel', function (e) {
            if (!ScrollAnimating()) {
                e.preventDefault();
                if (e.originalEvent.wheelDelta > 0) {
                    SlideOnce('up');
                } else {
                    SlideOnce('down');
                }
            }
            e.preventDefault();
        });

        $('body').bind('DOMMouseScroll', function (e) {
            if (!ScrollAnimating()) {
                e.preventDefault();
                if (e.originalEvent.detail < 0) {
                    SlideOnce('up');
                } else {
                    SlideOnce('down');
                }
            }
            e.preventDefault();
        });

        // navigation: using the keyboard
        $(document).keydown(function (e) {
            if (!$('textarea, input').is(':focus')) {
                if (e.keyCode == 32 || e.keyCode == 40 || e.keyCode == 34) {
                    e.preventDefault();
                    console.log('keydown');
                    SlideOnce('down');
                }
                if (e.keyCode == 38 || e.keyCode == 33) {
                    e.preventDefault();
                    console.log('keyup');
                    SlideOnce('up');
                }
            }
        });

        // navigation: swipe
        if ($('html').hasClass('touch')) {
            $('.slide-wrapper').touchwipe({
                wipeDown: function () {
                    SlideOnce('down');
                },
                wipeUp: function () {
                    SlideOnce('up');
                }
            });
        }

        // set first dot on right nav to active state
        $('.home-nav ul li:first-child').addClass('active');

        // establish slide dimensions
        $(window).load(function () {
            ResizeSlides();
        });
        $(window).resize(function () {
            ResizeSlides();
        });

        ReorderNav();
        ResizeSlides();

    }

    // Scrolls to any local href.
    $(".register").on("click", function (e) {
        if (!IsMobile()) {
            e.preventDefault();
            if (!ScrollAnimating()) {
                $('.home-nav ul li').removeClass('active');
                $('.home-nav ul li:nth-child(6)').addClass('active');
                SnapScroll("6", 3000);
            }
        }
    });
    

    if (window.location.hash == '#Register') {
        if (!IsMobile()) {
            if (!ScrollAnimating()) {
                $('.home-nav ul li').removeClass('active');
                $('.home-nav ul li:nth-child(6)').addClass('active');
                SnapScroll("6", 1);
            }
        }
       
    }

    $(".slide-container").fadeIn("slow");

    $.validator.addMethod(
            "date",
            function (value, element) {
                var bits = value.match(/([0-9]+)/gi), str;
                if (!bits)
                    return this.optional(element) || false;
                str = bits[1] + '/' + bits[0] + '/' + bits[2];
                return this.optional(element) || !/Invalid|NaN/.test(new Date(str));
            },
            ""
            );

    $('.jquery_bootstrapdatetimepicker').datetimepicker({
        format: 'DD/MM/YY hh:mm A',
        daysOfWeekDisabled: [0, 6],
        inline: false,
        sideBySide: false,
        showClose: true,
        showClear: true,
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'bottom'
        }


    });
});
