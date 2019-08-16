/**************************************************************
 * Do a full text search  
 **************************************************************/
function handleNormalSearch(query, cat) {
	console.log("doing normal search with query: " + query + " on " + cat);
	
	if(cat == "songs")
		doSongsGet(query);
	else if(cat == "albums")
		doAlbumsPost(query);
	else
		doArtistPost(query);
    
    
}

// bind pressing enter key to a handler function
$('#search-bar').keypress(function(event) {
	// keyCode 13 is the enter key
	if (event.keyCode == 13) {
		// pass the value of the input box to the handler function
		handleNormalSearch($('#search-bar').val(), $('#select-box').val())
	}
})


function submitSearchForm(formSubmitEvent) {
    console.log("submit search form");
    /**
     * When users click the submit button, the browser will not direct
     * users to the url defined in HTML form. Instead, it will call this
     * event handler when the event is triggered.
     */
    formSubmitEvent.preventDefault();
    handleNormalSearch($('#search-bar').val(), $('#select-box').val())

}

// Bind the submit action of the search form to a handler function
$("#search-form").submit((event) => submitSearchForm(event));


/**************************************************************************
 * Makes an HTTP Get Request to the backend Songs API
 **************************************************************************/
function doSongsGet(query){
	
	// sending the HTTP GET request to the Java Servlet with the query data
	jQuery.ajax({
		"method": "GET",
		// generate the request url from the query.
		// escape the query string to avoid errors caused by special characters 
		"url": "api/songs?keywords=" + escape(query),
		"success": function(resultData) {
			// pass the data, query, and doneCallback function into the success handler
			handleSearchSongsResult(resultData) 
		},
		"error": function(errorData) {
			console.log("lookup ajax error")
			console.log(errorData)
		}
	})	
	
}

/**************************************************************************
 * Makes an HTTP Post Request to the backend Albums API
 **************************************************************************/
function doAlbumsPost(query){
	
	// sending the HTTP Post request to the Java Servlet with the query data
	  $.ajax({
		    url: 'api/albums',
		    type: 'POST',
		    data: jQuery.param({ keywords: escape(query), search: "fulltext"}) ,
		    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		    success: (resultData) => handleSearchAlbumsResult(resultData)
		});
	
}

/**************************************************************************
 * Makes an HTTP Post Request to the backend Artist API
 **************************************************************************/
function doArtistPost(query){
	
	// sending the HTTP Post request to the Java Servlet with the query data
	  $.ajax({
		    url: 'api/bands',
		    type: 'POST',
		    data: jQuery.param({ keywords: query, search: "fulltext"}) ,
		    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		    success: (resultData) => handleSearchArtistResult(resultData)
		});
	
}

/**************************************************************************
 * Handles Search Songs Results
 **************************************************************************/
function handleSearchSongsResult(resultData) {
	
	 // Populate the search results
   let searchResultsElement = jQuery("#search-results");
   searchResultsElement.empty();
   
   if(resultData == null || resultData.length == 0)
   	searchResultsElement.append("<h2>0 Search Results</h2><br><br>");
   else
   	searchResultsElement.append("<h2>" + resultData.length + " Search Results</h2><br><br>");
   
   let searchContentElement = $("#search-content");
   searchContentElement.empty();
   searchContentElement.append("<thead><tr><th></th><th></th><th></th></tr></thead><tbody>");

   // Iterate through resultData
   for (let i = 0; i < resultData.length; i++) {

       // Concatenate the html tags with resultData jsonObject
	   let rowHTML = "";
       rowHTML += "<tr>";
       rowHTML +=
           '<td><i class="material-icons">audiotrack</i>'
           + resultData[i]["name"] +   
           "</td>";
       rowHTML += "<td>" + resultData[i]["album"] + "</td>";
       rowHTML += "<td>" + resultData[i]["artist"] + "</td>";
       rowHTML += '<td><i class="material-icons" id="add-to-cart-btn" data-type="Track" data-name="' + resultData[i]["name"] + '" data-artist="' + resultData[i]["artist"] + '" onclick="addToCart(this);">add_shopping_cart</i></td>';
       rowHTML += "</tr>";

       // Append the row created to the table body, which will refresh the page
       searchContentElement.append(rowHTML);
   }
}

/**************************************************************************
 * Handles Search Albums Results
 **************************************************************************/
function handleSearchAlbumsResult(resultData) {
	resultData = jQuery.parseJSON(resultData);
	
	 // Populate the search results
   let searchResultsElement = jQuery("#search-results");
   searchResultsElement.empty();
   
   if(resultData == null || resultData.length == 0)
   	searchResultsElement.append("<h2>0 Search Results</h2><br><br>");
   else
   	searchResultsElement.append("<h2>" + resultData.length + " Search Results</h2><br><br>");
   
   let searchContentElement = $("#search-content");
   searchContentElement.empty();
   searchContentElement.append("<thead><tr><th></th><th></th><th></th></tr></thead><tbody>");

   // Iterate through resultData
   for (let i = 0; i < resultData.length; i++) {

       // Concatenate the html tags with resultData jsonObject
       let rowHTML = "";
       rowHTML += "<tr>";
       rowHTML += '<td><a href="album.html?id=' + resultData[i]["id"] + '">';
       rowHTML += '<img class="album-pic" src="img/album-pics/' + resultData[i]["id"] + '.jpg"></a></td>';
       rowHTML += '<td><a href="album.html?id=' + resultData[i]["id"] + '">' + resultData[i]["title"] + '</a></td>';
       rowHTML += "</tr>";

       // Append the row created to the table body, which will refresh the page
       searchContentElement.append(rowHTML);
   }
}

/**************************************************************************
 * Handles Search Artist Results
 **************************************************************************/
function handleSearchArtistResult(resultData) {
	
	resultData = jQuery.parseJSON(resultData);
	
	 // Populate the search results
    let searchResultsElement = jQuery("#search-results");
    searchResultsElement.empty();
    
    if(resultData == null || resultData.length == 0)
    	searchResultsElement.append("<h2>0 Search Results</h2><br><br>");
    else
    	searchResultsElement.append("<h2>" + resultData.length + " Search Results</h2><br><br>");
    
    let searchContentElement = $("#search-content");
    searchContentElement.empty();
    searchContentElement.append("<thead><tr><th></th><th></th><th></th></tr></thead><tbody>");

    // Iterate through resultData
    for (let i = 0; i < resultData.length; i++) {

        // Concatenate the html tags with resultData jsonObject
        let rowHTML = "";
        rowHTML += "<tr>";
        rowHTML +=
            "<td>" +
            '<img src="img/band-pic/' + resultData[i]["id"] +  '.jpg" class="artist-pic"></td><td>'
            +
            // Add a link to band.html with id passed with GET url parameter
            '<a href="artist.html?id=' + resultData[i]['id'] + '">'
            + resultData[i]["name"] +     // display star_name for the link text
            '</a>' +
            "</td>";
        //rowHTML += "<td>" + resultData[i]["origin"] + "</td>";
        rowHTML += "</tr>";

        // Append the row created to the table body, which will refresh the page
        searchContentElement.append(rowHTML);
    }
    
}
