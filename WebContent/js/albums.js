/******************************************************************
 * Handles result data returned by FavoriteServlet
 ******************************************************************/
function handleFavResult(resultData) {
	sessionStorage.setItem("favoriteItems", resultData);
}


/****************************************************************************
 * Toggles like/unlike Favorite Heart 
 ****************************************************************************/

function toggleFavorite(e) {
  var heart = e.getAttribute("data-fav-type");
  var id = e.getAttribute("data-id");
  var title = e.getAttribute("data-title");
  var artist = e.getAttribute("data-artist");

  if (heart == "unliked") {
    e.innerHTML = "favorite";
    e.setAttribute("data-fav-type", "like");
    doFavPost(id, title, artist, "like")
    
  } else {
	  e.innerHTML = "favorite_border";
	  e.setAttribute("data-fav-type", "unliked");
	  doFavPost(id, title, artist, "unliked")
  }
}

/**************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate 
 * data into html elements
 * @param resultData jsonObject
 **************************************************************************/
function handleAlbumsResult(resultData) {

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
        //gridItemHTML += '<p><i class="material-icons fav-heart" data-id="' + resultData[i]["id"] + '" data-title="' + resultData[i]["title"] + '" data-artist="' + resultData[i]["artist"] + '" data-fav-type="unliked" onclick="toggleFavorite(this)">favorite_border</i></p>';
        gridItemHTML += '</div>';
        
        // Append the grid item created to the grid container, which will refresh the page
        albumsGridBodyElement.append(gridItemHTML);
    }
}

/********************************************************************
 * Updates favorites, liked/unliked albums, to the backend by making 
 * a POST request
 *********************************************************************/
function doFavPost(albumId, albumTitle, albumArtist, op) {
	  $.ajax({
		    url: 'api/fav',
		    type: 'POST',
		    data: jQuery.param({ id: albumId, title: albumTitle, artist: albumArtist, operation: op}) ,
		    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		    success: (resultData) => handleFavResult(resultData)
		}); 
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
