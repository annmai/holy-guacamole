/**
 * This example is following frontend and backend separation.
 *
 * Before this .js is loaded, the html skeleton is created.
 *
 * This .js performs two steps:
 *      1. Use jQuery to talk to backend API to get the json data.
 *      2. Populate the data to correct html elements.
 */


/**
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */
function handleBandsResult(resultData) {
    console.log("handleBandsResult: populating artist table from resultData");

    // Populate the bands table
    // Find the empty table body by id "star_table_body"
    let bandsTableBodyElement = jQuery("#bands_table_body");

    // Iterate through resultData, no more than 10 entries
    for (let i = 0; i < resultData.length; i++) {

        // Concatenate the html tags with resultData jsonObject
        let rowHTML = "";
        rowHTML += "<tr>";
        rowHTML +=
            "<th>" +
            '<img src="img/triad.jpg" class="artist-pic">'
            +
            // Add a link to band.html with id passed with GET url parameter
            '<a href="band.html?id=' + resultData[i]['id'] + '">'
            + resultData[i]["name"] +     // display star_name for the link text
            '</a>' +
            "</th>";
        rowHTML += "<th>" + resultData[i]["origin"] + "</th>";
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
    success: (resultData) => handleBandsResult(resultData) // Setting callback function to handle data returned successfully by the BandsServlet
});