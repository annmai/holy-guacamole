import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import javax.annotation.Resource;
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


// Declaring a WebServlet called SongsServlet, which maps to url "/api/songs"
@WebServlet(name = "SongsServlet", urlPatterns = "/api/songs")
public class SongsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Create a dataSource which registered in web.xml
    @Resource(name = "jdbc/musicdb")
    private DataSource dataSource;
    private String limit;
    private String offset;
    private String orderByParam;
    private String sortDirection;
    private String keywords;

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

       response.setContentType("application/json"); // Response mime type
       keywords = request.getParameter("keywords");
       
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
	   	
	   	String query_songs = "SELECT * FROM songs s WHERE MATCH(s.name) AGAINST(? IN BOOLEAN MODE) ORDER BY artist";
	   	executeSearchRequest(query_songs, words, response);
    }
    
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json"); // Response mime type
        
    	sortDirection = request.getParameter("order");
    	orderByParam = request.getParameter("orderBy");
    	limit = request.getParameter("limit");
    	offset = request.getParameter("offset");
    	keywords = request.getParameter("keywords");
        String query = "SELECT * FROM SONGS ORDER BY ? ? LIMIT ? OFFSET ?";
        
        if(keywords == null || keywords.length() == 0)
        	executeRequest(query, response);

    }
    
    private void executeRequest(String query, HttpServletResponse response) throws IOException {
    	
        // Output stream to STDOUT
        PrintWriter out = response.getWriter();

        try {
            // Get a connection from dataSource
            Connection dbcon = dataSource.getConnection();

            // Declare our statement
            PreparedStatement statement = dbcon.prepareStatement(query);

			// Set the parameter represented by "?" in the query to the id we get from URL,
			// Number 1 indicates the first "?" in the query
			statement.setString(1, orderByParam);
			
			statement.setString(2, sortDirection);
			statement.setInt(3, Integer.parseInt(limit));
			statement.setInt(4, Integer.parseInt(offset));
			
            // Perform the query
            ResultSet rs = statement.executeQuery();

            JsonArray jsonArray = new JsonArray();

            // Iterate through each row of rs
            while (rs.next()) {
                String id = rs.getString("id");
                String name = rs.getString("name");
                String album = rs.getString("album");
                String artist = rs.getString("artist");

                // Create a JsonObject based on the data we retrieve from rs
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id", id);
                jsonObject.addProperty("name", name);
                jsonObject.addProperty("album", album);
                jsonObject.addProperty("artist", artist);

                jsonArray.add(jsonObject);
            }
            
            String countQuery = "SELECT COUNT(*) from songs";
            rs = statement.executeQuery(countQuery);
            int numResultRecords = 0;
            
            if(rs.next())
            	numResultRecords = rs.getInt("COUNT(*)");
            
            //for debugging
            System.out.println("Total Results: " + numResultRecords);
            
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("numRecords", numResultRecords);
            jsonObject.addProperty("limit", limit);
            jsonObject.addProperty("offset", offset);
            jsonArray.add(jsonObject);
            
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
                String name = rs.getString("name");
                String album = rs.getString("album");
                String artist = rs.getString("artist");

                // Create a JsonObject based on the data we retrieve from rs
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id", id);
                jsonObject.addProperty("name", name);
                jsonObject.addProperty("album", album);
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