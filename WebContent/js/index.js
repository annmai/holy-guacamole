/****************************************************************************
 * Toggles like/unlike Favorite Heart 
 ****************************************************************************/

function toggleFavorite(e) {
  var heart = e.getAttribute("data-fav-type");

  if (heart == "unliked") {
    e.innerHTML = "favorite";
    e.setAttribute("data-fav-type", "like");
    
  } else {
	  e.innerHTML = "favorite_border";
	  e.setAttribute("data-fav-type", "unliked");
  }
}

/************************************************************************
 * Toggles Arrow and displays artists' in ascending/descending order
 ***********************************************************************/

function toggleArtist(e) {
  var arrow = e.getAttribute("data-arrow-type");
  var text = document.getElementById("arrow1");
  if (arrow == "up") {
    text.innerHTML = "&darr; Artist";
    e.setAttribute("data-arrow-type", "down");
    
    // make post request to server
    doPost("name", "asc");
    
  } else {
	  text.innerHTML = "&uarr; Artist";
	  e.setAttribute("data-arrow-type", "up");
	  doPost("name", "desc");
  }
}

/****************************************************************************
 * Toggles Arrow and displays artists' origins in ascending/descending order
 ****************************************************************************/

function toggleOrigin(e) {
  var arrow = e.getAttribute("data-arrow-type");
  var text = document.getElementById("arrow2");
  if (arrow == "up") {
    text.innerHTML = "&darr; Origin";
    e.setAttribute("data-arrow-type", "down");
    doPost("origin", "asc");
    
  } else {
	  text.innerHTML = "&uarr; Origin";
	  e.setAttribute("data-arrow-type", "up");
	  doPost("origin", "desc");
  }
}


/**************************************************************************
 * Makes an HTTP Post Request to the backend API
 **************************************************************************/
function doPost(orderByParam, sort) {
	  $.ajax({
		    url: 'api/bands',
		    type: 'POST',
		    data: jQuery.param({ orderBy: orderByParam, order: sort}) ,
		    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		    success: (resultData) => handleBandsResult(resultData)
		}); 
}

/**************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate 
 * data into html elements
 * @param resultData jsonObject
 **************************************************************************/
function handleBandsResult(resultData) {
    console.log("handleBandsResult: populating artist table from resultData");

    // Populate the bands table
    // Find the empty table body by id "star_table_body"
    let bandsTableBodyElement = jQuery("#bands_table_body");
    bandsTableBodyElement.empty();

    // Iterate through resultData, no more than 10 entries
    for (let i = 0; i < resultData.length; i++) {

        // Concatenate the html tags with resultData jsonObject
        let rowHTML = "";
        rowHTML += "<tr>";
        rowHTML +=
            "<td>" +
            '<img src="img/band-pic/' + resultData[i]["id"] +  '.jpg" class="artist-pic">'
            +
            // Add a link to band.html with id passed with GET url parameter
            '<a href="artist.html?id=' + resultData[i]['id'] + '">'
            + resultData[i]["name"] +     // display star_name for the link text
            '</a>' +
            "</td>";
        rowHTML += "<td>" + resultData[i]["origin"] + "</td>";
        rowHTML += "</tr>";

        // Append the row created to the table body, which will refresh the page
        bandsTableBodyElement.append(rowHTML);
    }
}




/******************************************************************************
 * Once this .js is loaded, following scripts will be executed by the browser
 ******************************************************************************/

// Makes the HTTP GET request and registers on success callback function handleBandsResult
jQuery.ajax({
    dataType: "json", // Setting return data type
    method: "GET", // Setting request method
    url: "api/bands", // Setting request url, which is mapped by BandsServlet.java
    success: (resultData) => handleBandsResult(resultData) // Setting callback function to handle data returned successfully by the BandListServlet
});
