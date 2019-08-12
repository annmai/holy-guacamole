/**************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate 
 * data into html elements
 * @param resultData jsonObject
 **************************************************************************/
function handleCartContentResult(resultData) {
    console.log("handleCartContentResult: populating cart from resultData");

    let cartListElement = jQuery("#cart_list");
    cartListElement.empty();
    
    let cart = resultData["cart"];
    console.log(cart);
    
    if(cart == null || cart.length == 0) {
    	cartListElement.append("There are no items in your shopping cart.");
    }
    else {
    	
    	cartListElement.append("<h4>Items</h4>");
    	
        // Iterate through resultData, no more than 10 entries
        for (let i = 0; i < cart.length; i++) {

            // Concatenate the html tags with resultData jsonObject
            let listItem = "";
            listItem += "<li>";
            listItem += cart[i]["itemType"] + " &middot; " + cart[i]['itemName'] + " &middot; ";
            listItem += cart[i]["itemArtist"] + '&nbsp;&nbsp;&nbsp;<button id="remove-btn" data-type="' + cart[i]['itemType'] + '" data-name="' + cart[i]['itemName'] + '" data-artist="' + cart[i]['itemArtist'] + '" onclick="removeFromCart(this)">remove</button>';
            listItem += "</li>";

            // Append the row created to the table body, which will refresh the page
            cartListElement.append(listItem);
        }
    	
    }


}

/******************************************************************************
 * Once this .js is loaded, following scripts will be executed by the browser
 ******************************************************************************/

// Makes the HTTP GET request and registers on success callback function handleCartResult
jQuery.ajax({
    dataType: "json", // Setting return data type
    method: "GET", // Setting request method
    url: "api/cart", // Setting request url, which is mapped by CartServlet.java
    success: (resultData) => handleCartContentResult(resultData) // Setting callback function to handle data returned successfully by the CartServlet
});