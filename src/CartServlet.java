import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * This IndexServlet is declared in the web annotation below, 
 * which is mapped to the URL pattern /cart.
 */
@WebServlet(name = "CartServlet", urlPatterns = "/api/cart")
public class CartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * handles GET requests to add and show the item list information
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    	String itemType = request.getParameter("itemType");
    	String itemName = request.getParameter("itemName");
    	String itemArtist = request.getParameter("itemArtist");
    	String operation = request.getParameter("operation");
        
        HttpSession session = request.getSession();     
        JsonArray cartItems = null;
        
        if(operation.equalsIgnoreCase("add"))
        	cartItems = add(session, itemType, itemName, itemArtist, operation);
        
        if(operation.equalsIgnoreCase("remove"))
        	cartItems = remove(session, itemName);

        response.getWriter().write(cartItems.toString());
        
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        JsonArray cartItems = (JsonArray) session.getAttribute("cartItems");
        
        JsonObject jsonObject = new JsonObject();
        jsonObject.add("cart", cartItems);

        System.out.println(jsonObject.toString());
        
        // write all the data into the jsonObject
        response.getWriter().write(jsonObject.toString());
        

    }
    
    private JsonArray add(HttpSession session, 
    		String itemType, String itemName, String itemArtist, String operation) {
    	
        // get the previous items in a JsonArray
        JsonArray cartItems = (JsonArray) session.getAttribute("cartItems");

        if (cartItems == null) {
            cartItems = new JsonArray();
            JsonObject item = new JsonObject();
            item.addProperty("itemType", itemType);
            item.addProperty("itemName", itemName);
            item.addProperty("itemArtist", itemArtist);
            cartItems.add(item);
            session.setAttribute("cartItems", cartItems);
            
        } else {
            // prevent corrupted states through sharing under multi-threads
            // will only be executed by one thread at a time
            synchronized (cartItems) {
            	
                JsonObject item = new JsonObject();
                item.addProperty("itemType", itemType);
                item.addProperty("itemName", itemName);
                item.addProperty("itemArtist", itemArtist);
                cartItems.add(item);
            }
        }
                  
        return cartItems;
    }
    
    private JsonArray remove(HttpSession session, String id) {
    	
    	// get the previous items in a JsonArray
        JsonArray cartItems = (JsonArray) session.getAttribute("cartItems");
        
        synchronized (cartItems) {
        	
        	for(int i = 0; i < cartItems.size(); ++i) {
        		JsonObject item = (JsonObject) cartItems.get(i);
        			
        		String movieId = item.get("movie_id").getAsString();
        			
        		if(movieId.equalsIgnoreCase(id)) {
            		cartItems.remove(i);
            		break;
        		}
        	}
        }
        
        return cartItems;
    }
}