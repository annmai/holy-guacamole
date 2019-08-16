import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import javax.annotation.Resource;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;


// Declaring a WebServlet called AlbumListServlet, which maps to url "/api/albums"
@WebServlet(name = "AlbumListServlet", urlPatterns = "/api/albums")
public class AlbumListServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Create a dataSource which registered in web.xml
    @Resource(name = "jdbc/musicdb")
    private DataSource dataSource;
    private String keywords;

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json"); // Response mime type
        String query = "SELECT * from albums";
        executeRequest(query, response);

    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        
    	String searchType = request.getParameter("search");
    	keywords = request.getParameter("keywords");

    	if(searchType == null || searchType.length() == 0) {
    		String query = "SELECT * from albums";
        	executeRequest(query, response);
    	}
    	else {
    		String[] searchwords = keywords.split("\\s+");
    	       String words = "";
    	   	
    		   	for(int i = 0; i < searchwords.length; ++i) {
    		   		
    		   		String word = "+" + searchwords[i] + "*";
    		   		
    		   		if(i != searchwords.length - 1)
    		   			word += " ";
    		   		
    		   		words += word;
    		   	}
    	   	
    		   	words += "";
    		   	keywords = words;
    		   	
    		   	String query_albums = "SELECT * FROM albums a WHERE MATCH(a.title) AGAINST(? IN BOOLEAN MODE) ORDER BY artist";
    		   	executeSearchRequest(query_albums, words, response);
    	}
    
    }
    
    private void executeRequest(String query, HttpServletResponse response) throws IOException {
    	
    	response.setContentType("application/json"); // Response mime type

        // Output stream to STDOUT
        PrintWriter out = response.getWriter();

        try {
            // Get a connection from dataSource
            Connection dbcon = dataSource.getConnection();

            // Declare our statement
            Statement statement = dbcon.createStatement();

            // Perform the query
            ResultSet rs = statement.executeQuery(query);

            JsonArray jsonArray = new JsonArray();

            // Iterate through each row of rs
            while (rs.next()) {
                String id = rs.getString("id");
                String title = rs.getString("title");
                String artist = rs.getString("artist");

                // Create a JsonObject based on the data we retrieve from rs
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id", id);
                jsonObject.addProperty("title", title);
                jsonObject.addProperty("artist", artist);

                jsonArray.add(jsonObject);
            }
            
            // write JSON string to output
            out.write(jsonArray.toString());
            // set response status to 200 (OK)
            response.setStatus(200);

            rs.close();
            statement.close();
            dbcon.close();
        }
            
        catch (Exception e) {
        	
			// write error message JSON object to output
			JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("errorMessage", e.getMessage());
			out.write(jsonObject.toString());
			
			System.out.println("Error: " + e.getMessage());
			e.printStackTrace();

			// set response status to 500 (Internal Server Error)
			response.setStatus(500);

        }
        
        out.close();
    }
    
	private void executeSearchRequest(String query, String words, HttpServletResponse response) throws IOException {
	    	
	        // Output stream to STDOUT
	        PrintWriter out = response.getWriter();
	
	        try {
	            // Get a connection from dataSource
	            Connection dbcon = dataSource.getConnection();
	
	            // Declare our statement
	            PreparedStatement statement = dbcon.prepareStatement(query);
	
				// Set the parameter represented by "?" in the query to the id we get from URL,
				// Number 1 indicates the first "?" in the query
				statement.setString(1, words);
				
				//for debugging
				System.out.println(statement);
				
	            // Perform the query
	            ResultSet rs = statement.executeQuery();
	
	            JsonArray jsonArray = new JsonArray();
	
	            // Iterate through each row of rs
	            while (rs.next()) {
	                String id = rs.getString("id");
	                String title = rs.getString("title");
	                String label = rs.getString("label");
	                String year = rs.getString("year");
	
	                // Create a JsonObject based on the data we retrieve from rs
	                JsonObject jsonObject = new JsonObject();
	                jsonObject.addProperty("id", id);
	                jsonObject.addProperty("title", title);
	                jsonObject.addProperty("label", label);
	                jsonObject.addProperty("year", year);
	
	                jsonArray.add(jsonObject);
	            }
	            
	            // write JSON string to output
	            out.write(jsonArray.toString());
	            // set response status to 200 (OK)
	            response.setStatus(200);
	
	            rs.close();
	            statement.close();
	            dbcon.close();
	            
	        } catch (Exception e) {
	        	
				// write error message JSON object to output
				JsonObject jsonObject = new JsonObject();
				jsonObject.addProperty("errorMessage", e.getMessage());
				out.write(jsonObject.toString());
	
				// set response status to 500 (Internal Server Error)
				response.setStatus(500);
	
	        }
	        out.close();
	    }
}
