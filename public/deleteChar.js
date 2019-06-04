function deleteChar(id){
    $.ajax({
        url: '/viewChar/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteGrp(id){
    $.ajax({
        url: '/viewGrp/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePow(id){
    $.ajax({
        url: '/viewPow/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteLoc(id){
    $.ajax({
        url: '/viewLoc/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

/*function deleteCharPow(id){
    $.ajax({
        url: '/viewChar/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}*/