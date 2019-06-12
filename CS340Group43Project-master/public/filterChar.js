function filterCharByHomeworld() {
    //get the id of the selected homeworld from the filter dropdown
    var homeworld_id = document.getElementById('loc_filter').value
    //construct the URL and redirect to it
    window.location = '/viewChar/filter/' + parseInt(homeworld_id)
}
