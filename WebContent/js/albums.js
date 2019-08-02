/**************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate 
 * data into html elements
 * @param resultData jsonObject
 **************************************************************************/
function handleAlbumsResult(resultData) {

    // Populate the bands table
    // Find the empty table body by id "star_table_body"
    let albumsTableBodyElement = jQuery("#album-list");
    albumsTableBodyElement.empty();

    // Iterate through resultData, no more than 10 entries
    for (let i = 0; i < resultData.length; i++) {

        // Concatenate the html tags with resultData jsonObject
        let gridItemHTML = "";
        gridItemHTML += '<div class="grid-item">';
        gridItemHTML += '<img class="album-pic" src="img/album-pics/' + resultData[i]["id"] + '.jpg"><br>';
        gridItemHTML += '<p class="album-caption">' + resultData[i]["title"] + '<br>' + resultData[i]["artist"] + '</p>';
        gridItemHTML += '<p><i class="material-icons fav-heart" data-fav-type="unliked" onclick="toggleFavorite(this)">favorite_border</i></p>';
        gridItemHTML += '</div>';
        
        // Append the grid item created to the grid container, which will refresh the page
        albumsTableBodyElement.append(gridItemHTML);
    }
}


/******************************************************************************
 * Once this .js is loaded, following scripts will be executed by the browser
 ******************************************************************************/

// Makes the HTTP GET request and registers on success callback function handleBandsResult
jQuery.ajax({
    dataType: "json", // Setting return data type
    method: "GET", // Setting request method
    url: "api/albums", // Setting request url, which is mapped by AlbumListServlet.java
    success: (resultData) => handleAlbumsResult(resultData) // Setting callback function to handle data returned successfully by the AlbumListServlet
});
