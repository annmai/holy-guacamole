/**************************************************************************
 * Callback function redirects to Cart.html
 **************************************************************************/

function handleCartResult(resultDataString) {
	
	sessionStorage.setItem("cart", resultDataString);
	console.log("Cart in session: " + sessionStorage.getItem("cart"));
	window.location.replace("cart.html");
	
}

/**************************************************************************
 * Adds Item to Cart by making a POST request to the backend Cart API
 **************************************************************************/
function addToCart(e) {
	
	var type = e.getAttribute("data-type");
	var name = e.getAttribute("data-name");
	var artist = e.getAttribute("data-artist");
	
	let cart = sessionStorage.getItem("cart");
	var isDup = false;
	
	if(cart != null) { 
		let cartItems = jQuery.parseJSON(cart);
	    
		//checks if you are trying to add duplicate items to cart
		for (let i = 0; i < cartItems.length; i++) {
	   	 	let itemType = cartItems[i]["itemType"];
	        let itemName = cartItems[i]["itemName"];
	        let itemArtist = cartItems[i]["itemArtist"];
	        
	        if(type == itemType && name == itemName && artist == itemArtist){
	        	alert("Item not added. Duplicate found in cart.");
	        	isDup = true;
	        	break;
	        }
	     }
		
	}

	if(!isDup) {
		console.log("added to cart:" + type + ", " + name + ", " + artist);
		doCartPost(type, name, artist, "add");
	}
	
}


/**************************************************************************
 * Removes Item from Cart by making a POST request to the backend Cart API
 **************************************************************************/

function removeFromCart(e) {
	var type = e.getAttribute("data-type");
	var name = e.getAttribute("data-name");
	var artist = e.getAttribute("data-artist");
	doCartPost(type, name, artist, "remove");
}

/**************************************************************************
 * Makes an HTTP Post Request to the backend Cart API
 **************************************************************************/
function doCartPost(type, name, artist, op) {
	  $.ajax({
		    url: 'api/cart',
		    type: 'POST',
		    data: jQuery.param({ itemType: type, itemName: name, itemArtist: artist, operation: op}) ,
		    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		    success: (resultData) => handleCartResult(resultData)
		}); 
}
