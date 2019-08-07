

/**************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate 
 * data into html elements
 * @param resultData jsonObject
 **************************************************************************/
function handleAlbumsResult(resultData) {

    // Populate the bands table
    // Find the empty table body by id "star_table_body"
    let albumsGridBodyElement = jQuery("#album-list");
    albumsGridBodyElement.empty();

    // Iterate through resultData, no more than 10 entries
    for (let i = 0; i < resultData.length; i++) {

        // Concatenate the html tags with resultData jsonObject
        let gridItemHTML = "";
        gridItemHTML += '<div class="grid-item">';
        gridItemHTML += '<a href="album.html?id=' + resultData[i]["id"] + '">';
        gridItemHTML += '<img class="album-pic" src="img/album-pics/' + resultData[i]["id"] + '.jpg"></a><br>';
        gridItemHTML += '<p class="album-caption">' + resultData[i]["title"] + '<br>' + resultData[i]["artist"] + '</p>';
        gridItemHTML += '<p><i class="material-icons fav-heart" data-fav-type="unliked" onclick="toggleFavorite(this)">favorite_border</i></p>';
        gridItemHTML += '</div>';
        
        // Append the grid item created to the grid container, which will refresh the page
        albumsGridBodyElement.append(gridItemHTML);
    }
}


/******************************************************************************
 * Once this .js is loaded, following scripts will be executed by the browser
 ******************************************************************************/

sessionStorage.setItem("prevURL", "albums.html");

$.ajax({
    url: 'api/albums',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: (resultData) => handleAlbumsResult(resultData)
}); 
