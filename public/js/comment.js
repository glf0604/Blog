var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];







$('#messageBtn').on('click', function() {

        var obj={msg:'login',user:'admin',contentId:$('#contentId').val(),content:$('#messageContent').val()}
        socket.send(JSON.stringify(obj))
        // return false

    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function(responseData) {
            //console.log(responseData);
            $('#messageContent').val('');
            comments = responseData.data.comments.reverse();
            renderComment();
        }
    })
});


$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function(responseData) {
        comments =responseData.data.reverse();
        renderComment();

    }
});

$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment();
});

function renderComment() {

    $('#messageCount').html(comments.length);

    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    var start = Math.max(0, (page-1) * prepage);
    var end = Math.min(start + prepage, comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html( page + ' / ' +  pages);

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>No previous!</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">Previous</a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>No next</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">Next</a>');
    }

    if (comments.length === 0) {
        $('.messageList').html('<div class="messageBox"><p>No comments!</p></div>');
    } else {
        var html = '';
        for (var i=start; i<end; i++) {
            html += '<div class="messageBox">'+
                '<p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+ formatDate(comments[i].postTime) +'</span></p><p>'+comments[i].content+'</p>'+
                '</div>';
        }
        $('.messageList').html(html);
    }

}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '/' + (date1.getMonth()+1) + '/' + date1.getDate() + '  ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}