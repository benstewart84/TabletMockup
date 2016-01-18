$(document).ready(function () {
    var cache = {};
    var urlDataService = $(this.element).data('url');
    var pageSize = 20;

    $('#autocomplete').select2(
    {
        placeholder: "Enter value",
        //Does the user have to enter any data before sending the ajax request
        minimumInputLength: 0,            
        allowClear: true,
        ajax: {
            //How long the user has to pause their typing before sending the next request
            quietMillis: 150,
            //The url of the json service
            url: urlDataService,
            dataType: 'jsonp',
            //Our search term and what page we are on
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            results: function (data, page) {
                //Used to determine whether or not there are more results available,
                //and if requests for more data should be sent in the infinite scrolling                    
                var more = (page * pageSize) < data.Total; 
                return { results: data.Results, more: more };
            }
        }
    });
});
