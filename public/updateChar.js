function updatePerson(id) {
    $.ajax({
        url: '/viewChar/' + id,
        type: 'PUT',
        data: $('#update-character').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};
