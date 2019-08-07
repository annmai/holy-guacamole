/**************************************************************************
 * Gets parameter by name passed in URL
 **************************************************************************/

function getParameterByName(target) {
    // Get request URL
    let url = window.location.href;
    // Encode target parameter name to url encoding
    target = target.replace(/[\[\]]/g, "\\$&");

    // Ues regular expression to find matched parameter value
    let regex = new RegExp("[?&]" + target + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    // Return the decoded parameter value
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



/**************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate 
 * data into html elements
 * @param resultData jsonObject
 **************************************************************************/
function handleArtistResult(resultData) {
    console.log("handleArtistResult: populating albums table from resultData");

    
    let artistNameHeaderElement = jQuery("#artist-name");
    artistNameHeaderElement.append(resultData[0]["artist"]);
    
    
    // Populate the albums table
    // Find the empty table body by id "star_table_body"
    let albumsTableBodyElement = jQuery("#albums_table_body");
    albumsTableBodyElement.empty();

    // Iterate through resultData, no more than 10 entries
    for (let i = 0; i < resultData.length; i++) {


        // Concatenate the html tags with resultData jsonObject
        let rowHTML = "";
        rowHTML += "<tr>";
        rowHTML +=
            "<td>" + 
            "<img id='album-pic' src='img/album-pics/" + resultData[i]['id'] + ".jpg'>" +
            // Add a link to album.html with id passed with GET url parameter
            '<a href="album.html?id=' + resultData[i]['id'] + '">'
            + resultData[i]["title"] +     // display album name for the link text
            '</a>' +
            "</td>";
        rowHTML += "<td>" + resultData[i]["year"] + "</td>";
        rowHTML += "<td>" + resultData[i]["label"] + "</td>";
        rowHTML += "</tr>";

        // Append the row created to the table body, which will refresh the page
        albumsTableBodyElement.append(rowHTML);
    }
}




/******************************************************************************
 * Once this .js is loaded, following scripts will be executed by the browser
 ******************************************************************************/

let artistId = getParameterByName('id');
sessionStorage.setItem("prevURL", "artist.html?id=" + artistId);


// Makes the HTTP GET request and registers on success callback function handleArtistResult
jQuery.ajax({
    dataType: "json", // Setting return data type
    method: "GET", // Setting request method
    url: "api/artist?id=" + artistId, // Setting request url, which is mapped by ArtistServlet.java
    success: (resultData) => handleArtistResult(resultData) // Setting callback function to handle data returned successfully by the ArtistServlet
});