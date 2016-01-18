/* File Created: August 12, 2013 */

// Document ready
$(document).ready(function () {

    $.extend($.fn.dataTableExt.oSort, {
        "date-euro-pre": function(a) {
            var x = 100000000;

            a = $.trim(a);
            if (a != '') {

                var ukDate = $.trim(a).split('/');
                x = (ukDate[2] + ukDate[1] + ukDate[0]) * 1;
            }
            return x;
        },

        "date-euro-asc": function (a, b) {
            return a - b;
        },

        "date-euro-desc": function (a, b) {
            return b - a;
        },

        "currency-pre": function (a) {
            a = (a === "-") ? 0 : a.replace(/[^\d\-\.]/g, "");
            if (a.length === 0) {
                return Number.MIN_VALUE;
            }
            return parseFloat(a);
        },

        "currency-asc": function (a, b) {
            return a - b;
        },

        "currency-desc": function (a, b) {
            return b - a;
        },
        
        "datetime-euro-pre": function (a) {
            var x = 1000000000000;
            
            a = $.trim(a);
            
            if (a != '') {
                var parts = a.split(' ');

                if (parts.length == 2) {

                    var ukDate = parts[0].split('/');
                    var ukTime = parts[1].split(':');

                    x = (ukDate[2] + ukDate[1] + ukDate[0] + ukTime[0] + ukTime[1]) * 1;

                }
                
            }
            
            return x;
        },

        "datetime-euro-asc": function (a, b) {
            return a - b;
        },

        "datetime-euro-desc": function (a, b) {
            return b - a;
        },


    });

});