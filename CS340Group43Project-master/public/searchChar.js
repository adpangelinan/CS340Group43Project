function searchCharByName() {
    //get the first name 
    var first_name_search_string  = document.getElementById('name_search').value
    //construct the URL and redirect to it
    window.location = '/viewChar/search/' + encodeURI(first_name_search_string)
}