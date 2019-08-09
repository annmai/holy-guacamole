/******************************************************************************
 * gets Parameter passed in URL by name
 ******************************************************************************/

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
function handleAlbumInfoResult(resultData) {
    console.log("handleAlbumInfoResult: populating album info from resultData");


    let albumContentDivElement = jQuery("#album-content");
    
    let html = "<img id='album-picture' src='img/album-pics/" + id + ".jpg'>";
    html += "<br><br><div id='album-info'><b>" + resultData[0]["album_title"] + "</b><br>" + resultData[0]["artist"] + "<br>" + resultData[0]["label"] + " " + resultData[0]["year"] + "</div>";
    html += "<br><button>addToCart</button>"
    albumContentDivElement.append(html);
    
    console.log(resultData.length);
    
    let prev_disk_num = 0;
    let listElement = $("#tracklisting");
    listElement.empty();
    
    // Iterate through resultData
    for (let i = 1; i < resultData.length; i++) {
    
    	let curr_disk_num = resultData[i]["disk_number"];
    	
    	if(prev_disk_num != curr_disk_num) {
    		
    		if(i != 1) {
    			listElement.append("<li>&nbsp;</li>");
    		}
    		
    		listElement.append("<li><u>Disk #" + curr_disk_num + "</u></li>");
    		prev_disk_num = curr_disk_num;
    		
    	}
    	
    	let listItem = "<li>" + resultData[i]["track_number"] + ". " + resultData[i]["song_name"] + "</li>";
    	listElement.append(listItem);
    	
    }
    
    let prevURL = sessionStorage.getItem("prevURL");
    $("#backToPrev").append("<a href='" + prevURL + "'>back</a>");
}


/******************************************************************************
 * Once this .js is loaded, following scripts will be executed by the browser
 ******************************************************************************/

let id = getParameterByName("id");

// Makes the HTTP GET request and registers on success callback function handleAlbumInfoResult
jQuery.ajax({
    dataType: "json", // Setting return data type
    method: "GET", // Setting request method
    url: "api/album?id=" + id,
    success: (resultData) => handleAlbumInfoResult(resultData) 
});