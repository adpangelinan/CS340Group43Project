function deleteChar(id){
    $.ajax({
        url: '/viewChar/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};