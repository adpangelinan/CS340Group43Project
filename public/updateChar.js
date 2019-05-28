function updatePerson(id) {
    $.ajax({
        url: '/viewChar/' + id,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};