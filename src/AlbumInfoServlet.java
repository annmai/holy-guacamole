

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 * Servlet implementation class AlbumInfoServlet
 */
@WebServlet(name = "AlbumInfoServlet", urlPatterns = "/api/album")
public class AlbumInfoServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
    // Create a dataSource which registered in web.xml
    @Resource(name = "jdbc/musicdb")
    private DataSource dataSource;
	private String album_id;
	private String album_title;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AlbumInfoServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json"); // Response mime type
        album_id = request.getParameter("id");
       
        String query1 = "SELECT * FROM ALBUMS WHERE ID = ?";
        String query2 = "SELECT * FROM SONGS WHERE album = ? ORDER BY disk_number, track_number ASC";
        executeRequest(query1, query2, response);
        
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        //response.setContentType("application/json"); // Response mime type

    }
    
    private void executeRequest(String query1, String query2, HttpServletResponse response) throws IOException {
    	
        // Output stream to STDOUT
        PrintWriter out = response.getWriter();

        try {
            // Get a connection from dataSource
            Connection dbcon = dataSource.getConnection();       
            
			// Declare our statement
			PreparedStatement statement = dbcon.prepareStatement(query1);

			// Set the parameter represented by "?" in the query to the id we get from URL,
			// Number 1 indicates the first "?" in the query
			statement.setString(1, album_id);

			// Perform the query
			ResultSet rs = statement.executeQuery();

            JsonArray jsonArray = new JsonArray();

            // Iterate through each row of rs
            while (rs.next()) {
                album_title = rs.getString("title");
                String label = rs.getString("label");
                String artist = rs.getString("artist");
                String year = rs.getString("year");

                // Create a JsonObject based on the data we retrieve from rs
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("album_title", album_title);
                jsonObject.addProperty("label", label);
                jsonObject.addProperty("year", year);
                jsonObject.addProperty("artist", artist);

                jsonArray.add(jsonObject);
            }
            
			// Declare our second statement
			statement = dbcon.prepareStatement(query2);
			
			// Set the parameter represented by "?" in the query to the id we get from URL,
			// Number 1 indicates the first "?" in the query
			statement.setString(1, album_title);
			
			// Perform the query
			rs = statement.executeQuery();
			
            // Iterate through each row of rs
            while (rs.next()) {
                int disk_number = rs.getInt("disk_number");
                int track_number = rs.getInt("track_number");
                String name = rs.getString("name");

                // Create a JsonObject based on the data we retrieve from rs
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("disk_number", disk_number);
                jsonObject.addProperty("track_number", track_number);
                jsonObject.addProperty("song_name", name);

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
