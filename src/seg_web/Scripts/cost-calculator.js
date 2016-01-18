
$(document).ready(function () {

    $(window).resize(resize);
    resize();

    $(".register").attr("href", "/home/Register");

    // Registering the tool tip intialiser
    $('.tipso_style').tipso();

    var aLength = $('#servicesContainer .A').length;
    var bLength = $('#servicesContainer .B').length;
    var cLength = $('#servicesContainer .C').length;
    //Setting up the row span
    $('#servicesContainer .A').first().find("td:first").attr('rowspan', aLength).css('vertical-align', 'middle');
    $('#servicesContainer .B').first().find("td:first").attr('rowspan', bLength).css('vertical-align', 'middle');
    $('#servicesContainer .C').first().find("td:first").attr('rowspan', cLength).css('vertical-align', 'middle');
    // styling setup for the 1st cell
    $('#servicesContainer .A,#servicesContainer .B,#servicesContainer .C,#servicesContainer .D,#servicesContainer .E,#servicesContainer .F').find("td:nth-child(1)").addClass('serviceSequence');

    //Removing first cell in the consective rowas after using row span
    $('#servicesContainer .A, #servicesContainer .B,#servicesContainer .C').each(function (i, obj) {
        if (!$(obj).find("td:first").attr("rowspan")) {
            $(obj).find("td:first").remove();
        }
    });
});

//Attaching the onclick for register now to redirect to register page
$('a.register').click(function (event) {
    event.preventDefault();
    window.location.href = "/home/register";
    return false; //for good measure
});

function CalculateServiceCost(rowId) {
    var token = $('[name=__RequestVerificationToken]').val();

    $('tr#' + rowId).find("input.hide").toggleClass('show hide');
    $('tr#' + rowId).find("span.hide").toggleClass('show hide');

    if ($('tr#' + rowId).find("input.yesNo:checked").val() == 'False') {
        $('tr#' + rowId).find("input.show").val('1');
        $('tr#' + rowId).find("input.show").toggleClass('hide show');
        $('tr#' + rowId).find("span.show").toggleClass('hide show');
    }

    $.ajax({
        url: '/Home/CostCalculator',
        type: 'POST',
        data: {
            Selected1BIT: $('tr#1').find("input.yesNo:checked").val(),
            Selected1Qty: $('tr#1').find("input.quantity").val(),
            Selected2BIT: $('tr#2').find("input.yesNo:checked").val(),
            Selected2Qty: $('tr#2').find("input.quantity").val(),
            Selected3BIT: $('tr#3').find("input.yesNo:checked").val(),
            Selected3Qty: $('tr#3').find("input.quantity").val(),
            Selected4BIT: $('tr#4').find("input.yesNo:checked").val(),
            Selected4Qty: $('tr#4').find("input.quantity").val(),
            Selected5BIT: $('tr#5').find("input.yesNo:checked").val(),
            Selected5Qty: $('tr#5').find("input.quantity").val(),
            Selected6BIT: $('tr#6').find("input.yesNo:checked").val(),
            Selected6Qty: $('tr#6').find("input.quantity").val(),
            Selected7BIT: $('tr#7').find("input.yesNo:checked").val(),
            Selected7Qty: $('tr#7').find("input.quantity").val(),
            Selected8BIT: $('tr#8').find("input.yesNo:checked").val(),
            Selected8Qty: $('tr#8').find("input.quantity").val(),
            Selected9BIT: $('tr#9').find("input.yesNo:checked").val(),
            Selected9Qty: $('tr#9').find("input.quantity").val(),
            Selected10BIT: $('tr#10').find("input.yesNo:checked").val(),
            Selected10Qty: $('tr#10').find("input.quantity").val(),
            __RequestVerificationToken: token,

        },

        success: function (data) {
            $('#MonthlyCost').val(roundDown(data.TotalMonthlyCost, 2));
            $('#AnnualCost').val(roundDown(data.TotalAnnualCost, 2));
            $('#Discounts').val(roundDown(data.TotalDiscounts, 2));
        }
    });

}

function roundDown(number, decimals) {
    return number.toFixed(2);
}
//Update settings on mob resolution
function resize() {
    if ($(window).width() < 700) {
        //$('#servicesContainer tr td:first-child').addClass('hide');
        //$('#servicesContainer tr th:first-child').addClass('hide');
        $('.totalCostPanel').removeClass('noMargin');
        $('.totalCostPanel').addClass('resetTotalCostPanel');
        $('#discountContainer').addClass('resetDiscountContainer');


    } else {
        //$('#servicesContainer tr td:first-child').removeClass('hide');
        //$('#servicesContainer tr th:first-child').removeClass('hide');
        $('.totalCostPanel').addClass('noMargin');
        $('.totalCostPanel').removeClass('resetTotalCostPanel');
        $('#discountContainer').removeClass('resetDiscountContainer');
    }
}