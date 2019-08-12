

/**************************************************************************
 * Paginates results that can be loaded by clicking on the page number
 **************************************************************************/

function paginate(resultData) {
	
	$("#pagination").empty();
	
	let last = resultData.length - 1;
	let numRecords = resultData[last]['numRecords'];
	let limit = parseInt(resultData[last]['limit']);
	let currOffset = parseInt(resultData[last]['offset']);
	
	let totalPages = Math.ceil(numRecords / limit);
	
	// for debugging
	console.log(numRecords + " " + totalPages);
	
	let currentPage = Math.floor((currOffset + limit) / limit);
	
	
	let mid = Math.floor(limit/2);
	let startRange = ((currentPage - mid) < 1 ? 1 : (currentPage + mid) > numRecords ? (numRecords - limit + 1) : currentPage - mid);
	let endRange = ((currentPage + mid) > numRecords ? numRecords : (currentPage - mid < 1 ? (limit) : currentPage + mid));
	
	
	let pageNumElement = "";
	
	endRange = (totalPages <= endRange) ? totalPages + 1 : endRange;
	
	
	let prevOffset = currOffset - limit;
	
	if(prevOffset >= 0) {
		pageNumElement  = '<div id="prev" class="pageNum"><a href="#" onClick="doSongsPost(' + "'name', 'asc', " + limit + ' , ' + prevOffset + ');">prev</a>';
		
	}
	else {
		pageNumElement = '<div id="noPrev" class="pageNum">prev</di>';
	}

	$("#pagination").append(pageNumElement);
	
	let offset = currOffset;
	
		for(i = startRange; i < endRange; ++i) {
			
			let styleID = (startRange == currentPage) ? ' id="currPage"' : "";
			offset = startRange * limit - limit;
			pageNumElement  = '<div class="pageNum" data-id="' + (endRange - 1) + '"' + styleID + '><a href="#" onClick="doSongsPost(' + "'name', 'asc', " + limit + ' , ' + offset + ');">' + startRange + '</a>';
			$("#pagination").append(pageNumElement);
			++startRange;

		}
		
		let nextOffset = currOffset + limit;
		
		
		if(nextOffset <= numRecords) {
			pageNumElement  = '<div id="prev" class="pageNum"><a href="#" onClick="doSongsPost(' + "'name', 'asc', " + limit + ' , ' + nextOffset + ');">next</a>';
			
		}
		else {
			pageNumElement = '<div id="noPrev" class="pageNum">next</div>';
		}

		$("#pagination").append(pageNumElement);
			
		
}

/**************************************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 **************************************************************************************************/
function handleSongsResult(resultData) {
    console.log("handleSongsResult: populating songs table from resultData");

    let songsTableBodyElement = jQuery("#songs_table_body");
    songsTableBodyElement.empty();
    
    // Iterate through resultData
    for (let i = 0; i < resultData.length - 1; i++) {

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
        songsTableBodyElement.append(rowHTML);
    }
    
    paginate(resultData);
}

/**************************************************************************
 * Makes an HTTP Post Request to the backend API
 **************************************************************************/
function doSongsPost(orderByParam, dir, lim, off) {
	  $.ajax({
		    url: 'api/songs',
		    type: 'POST',
		    data: jQuery.param({ orderBy: orderByParam, order: dir, limit: lim, offset: off}) ,
		    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		    success: (resultData) => handleSongsResult(resultData)
		}); 
}
/********************************************************************************
 * Once this .js is loaded, following scripts will be executed by the browser
 ********************************************************************************/

doSongsPost("name", "asc", 10, 0);