$(document).ready(function () {
    var controller = '@HttpContext.Current.Request.RequestContext.RouteData.Values["controller"].ToString()';
    var kkk='/' + controller + '/RenderReport';
    alert(kkk);
    $.ajax({
        url: '/'+controller+'/RenderReport',
        data: { reportTitle: $('#reportTitle').text(), path: $('#folderPath').text() },
        type: 'POST',
        success:
            function (data) {
                $('#Report').html(data);
            }
    });
});