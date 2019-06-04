function updateChar(id) {
    $.ajax({
        url: '/viewChar/' + id,
        type: 'PUT',
        data: $('#update-character').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};

function updateGrp(id){
    $.ajax({
        url: '/viewGrp/' + id,
        type: 'PUT',
        data: $('#update-group').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};

function updatePow(id){
    $.ajax({
        url: '/viewPow/' + id,
        type: 'PUT',
        data: $('#update-power').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};

function updateLoc(id){
    $.ajax({
        url: '/viewLoc/' + id,
        type: 'PUT',
        data: $('#update-location').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};