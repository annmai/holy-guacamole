

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
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
 * Servlet implementation class SingleArtistServlet
 */
@WebServlet(name = "ArtistServlet", urlPatterns = "/api/artist")
public class SingleArtistServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Create a dataSource which registered in web.xml
    @Resource(name = "jdbc/musicdb")
    private DataSource dataSource;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SingleArtistServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json"); // Response mime type
        
        String id = request.getParameter("id");
        String query = "SELECT name from bands where id = '" + id + "'";
       
        // for debugging
        System.out.println(id);
        
        // Output stream to STDOUT
        PrintWriter out = response.getWriter();

        try {
            // Get a connection from dataSource
            Connection dbcon = dataSource.getConnection();

            // Declare our statement
            Statement statement = dbcon.createStatement();

            // Perform the query
            ResultSet rs = statement.executeQuery(query);
            
        
            if(rs.next()) {
            	String artist_name = rs.getString("name");
            	query = "Select * from albums where artist = '" + artist_name + "' order by year asc";
            	rs = statement.executeQuery(query);
            }
            
            JsonArray jsonArray = new JsonArray();

            // Iterate through each row of rs
            while (rs.next()) {
                String album_id = rs.getString("id");
                String album_title = rs.getString("title");
                String artist = rs.getString("artist");
                
                // for debugging
                System.out.println(artist);
                
                String label = rs.getString("label");
                int year = rs.getInt("year");
                int num_disks = rs.getInt("number_of_disks");

                // Create a JsonObject based on the data we retrieve from rs
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("id", album_id);
                jsonObject.addProperty("title", album_title);
                jsonObject.addProperty("artist", artist);
                jsonObject.addProperty("label", label);
                jsonObject.addProperty("year", year);
                jsonObject.addProperty("num_disks", num_disks);

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

}
