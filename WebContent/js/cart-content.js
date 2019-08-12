/**************************************************************************
 * Handles the data returned by the API, read the jsonObject and populate 
 * data into html elements
 * @param resultData jsonObject
 **************************************************************************/
function handleCartResult(resultData) {
    console.log("handleCartResult: populating cart from resultData");

    let cartListElement = jQuery("#cart_list");
    cartListElement.empty();
    
    let cart = resultData["cart"];
    console.log(cart);
    
    if(cart == null) {
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
            listItem += cart[i]["itemArtist"];
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
    success: (resultData) => handleCartResult(resultData) // Setting callback function to handle data returned successfully by the CartServlet
});