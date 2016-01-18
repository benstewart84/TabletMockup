$(function () {
    var cache = {};
    $('.autocomplete-with-hidden').autocomplete({
        minLength: 2,
        source: function (request, response) {

            var term = request.term;
            if (term in cache) {
                response(cache[term]);
                return;
            }
            var url = $(this.element).data('url');
            $.getJSON(url, request, function (data, status, xhr) {
                cache[term] = data;
                response(data);
            });
            /*
            var url = $(this.element).data('url');
            $.getJSON(url, { term: request.term }, function (data) {
                response(data);
            });
            */
        },
        select: function (event, ui) {
            $(event.target).next('input[type=hidden]').val(ui.item.id);
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(event.target).val('').next('input[type=hidden]').val('');
            }
        }
    });
})