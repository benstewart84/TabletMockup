/// <reference path="_references.js" />


$(document).ready(function () {
    $('.numbersOnly').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
        $('#spendLimitValidator').addClass('hide').removeClass('show');
        $('#MemberSignup_MonthlyAdditionalSpendLimit').removeAttr('style');

    });
});


$('#Approve').on('click', function (event) {
    return validateFields();
});

function validateFields() {
    if ($('#MemberSignup_MonthlyAdditionalSpendLimit').val().trim() == "") {
        $('#spendLimitValidator').addClass('show').removeClass('hide');
        $('#spendLimitValidator').attr('style', "color: #a94442;");
        $('#MemberSignup_MonthlyAdditionalSpendLimit').attr('style', "border-radius: 5px; border:#a94442 1px solid;");
        $('#MemberSignup_MonthlyAdditionalSpendLimit').focus();
        return false;
    } else {
       
        return true;

    }
}