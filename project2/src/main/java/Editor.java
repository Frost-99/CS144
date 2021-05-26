import java.io.IOException;
import java.sql.* ;
import java.util.*;

import javax.lang.model.util.ElementScanner6;
import javax.management.modelmbean.RequiredModelMBean;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.swing.Renderer;
import javax.swing.text.Position;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import jdk.nashorn.api.tree.SwitchTree;
import mypost.Post;


/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */
public class Editor extends HttpServlet {
    /**
     * The Servlet constructor
     * 
     * @see javax.servlet.http.HttpServlet#HttpServlet()
     */
    public Editor() {}

    public void init() throws ServletException
    {
        /*  write any servlet initialization code here or remove this function */
    }
    
    public void destroy()
    {
        /*  write any servlet cleanup code here or remove this function */
    }

    /**
     * Handles HTTP GET requests
     * 
     * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        // We've done parameter check before, so here we assume all parameters are not null
        String method = request.getMethod();
        String action = request.getParameter("action");
        String postidStr = request.getParameter("postid");
        String username = request.getParameter("username");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        int postid = 0;

        if (postidStr != null)
        {
            try {
                postid = Integer.parseInt(postidStr);
            } catch (NumberFormatException e) {
                System.err.println("NumberFormatException: " + e.getMessage());
                response.sendError(404);
            }
        }
        
        if (checkParameter(request))
        {
            if (action.equals("open"))
            {
                if (open(username, postid, title, body, request, response))
                    // Forward to edit page
                    request.getRequestDispatcher("/edit.jsp").forward(request, response);
            }
            else if (action.equals("preview"))
            {
                preview(username, postid, title, body, request, response);
                request.getRequestDispatcher("/preview.jsp").forward(request, response);
            }
            else if (action.equals("list"))
                list(username, request, response);
            else
                response.sendError(400);
        }
        else
        {
            response.sendError(400);;
        }
        
    }
    
    /**
     * Handles HTTP POST requests
     * 
     * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {

        // We've done parameter check before, so here we assume all parameters are not null
        String method = request.getMethod();
        String action = request.getParameter("action");
        String postidStr = request.getParameter("postid");
        String username = request.getParameter("username");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        int postid = 0;

        if (postidStr != null)
        {
            try {
                postid = Integer.parseInt(postidStr);
            } catch (NumberFormatException e) {
                System.err.println("NumberFormatException: " + e.getMessage());
                response.sendError(404);
            }
        }
        
        if (checkParameter(request))
        {
            if (action.equals("open"))
            {
                if (open(username, postid, title, body, request, response))
                    // Forward to edit page
                    request.getRequestDispatcher("/edit.jsp").forward(request, response);
            }
            else if (action.equals("save"))
                save(username, postid, title, body, request, response);
            else if (action.equals("delete"))
                delete(username, postid, request, response);
            else if (action.equals("preview"))
            {
                preview(username, postid, title, body, request, response);
                request.getRequestDispatcher("/preview.jsp").forward(request, response);
            }
            else if (action.equals("list"))
                list(username, request, response);
            else
                response.sendError(400);
        }
        else
        {
            response.sendError(400);;
        }
    }

    public boolean checkParameter(HttpServletRequest request)
    {
        String method = request.getMethod();
        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String postid = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        
        if (action != null && method != null)
        {
            switch (method)
            {
                case "GET":
                case "POST":
                    break;
                default:
                    return false;
            }
            if (method.equals("GET"))
            {
                // Save and delete must use POST
                switch (action)
                {
                    case "save":
                    case "delete":
                        return false;
                    default: 
                        break;
                }
            }
            switch (action)
            {
                case "open":
                    if (username == null || postid == null)
                        return false;
                    break;
                case "save":
                    if (username == null || postid == null 
                        || title == null || body == null)
                        return false;
                    break;

                case "delete":
                    if (username == null || postid == null)
                        return false;
                    break;
                case "preview":
                    if (username == null || postid == null 
                        || title == null || body == null)
                        return false;
                    break;
                case "list":
                    if (username == null)
                        return false;
                    break;
                default:
                    return false;
            }
            return true;
        }
        else
            return false;

    }


   
    public boolean open(String username, int postid, String title, String body, HttpServletRequest request, HttpServletResponse response)
    {
        Connection con = null;
        PreparedStatement sql = null;
        ResultSet rs = null;
        boolean exp = false;

        try {
            con = DriverManager.getConnection(
                "jdbc:mariadb://localhost:3306/CS144", "cs144", ""
            );
    
            sql = con.prepareStatement(
                "SELECT title, body FROM Posts WHERE username = ? AND postid = ?"
            );
            sql.setString(1, username);
            sql.setInt(2, postid);
    
            if (postid == 0)
            {
                if (title == null)
                    request.setAttribute("title", "");
                else
                    request.setAttribute("title", title);
                if (body == null)
                    request.setAttribute("body", "");
                else
                    request.setAttribute("body", body);
            }
            else if (postid > 0)
            {
                if (title != null && body != null)
                {
                    request.setAttribute("title", title);
                    request.setAttribute("body", body);
                }
                else
                {
                    rs = sql.executeQuery();
                    if (rs.first())
                    {
                        request.setAttribute("title", rs.getString(1));
                        request.setAttribute("body", rs.getString(2));
                    }
                    else
                    {
                        throw new SQLException("No matching (username, postid) found in DB");
                    }
                }
            }
        } catch (SQLException ex) {
            exp = true;
            System.err.println("SQLException: " + ex.getMessage());
            try { response.sendError(404); } catch (IOException ioe) { System.err.println("IOException: " + ex.getMessage()); } catch (IllegalStateException ise) { System.err.println("IllegalStateException: " + ex.getMessage()); }
        } finally {
            // Close result, statements, and connection
            try { rs.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
            try { sql.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
            try { con.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
        }
        return !exp;

    }

    public boolean save(String username, int postid, String title, String body, HttpServletRequest request, HttpServletResponse response)
    {
        Connection con = null;
        PreparedStatement sql = null;
        int updateRow = 0;
        boolean exp = false;

        try {
            con = DriverManager.getConnection(
                "jdbc:mariadb://localhost:3306/CS144", "cs144", ""
            );

            if (postid == 0)
            {
                sql = con.prepareStatement(
                    "INSERT INTO Posts (SELECT IFNULL(username, ?), IFNULL(MAX(postid), 0)+1, ?, ?, NOW(), NOW() FROM Posts WHERE username = ?)"
                );
                sql.setString(1, username);
                sql.setString(2, title);
                sql.setString(3, body);
                sql.setString(4, username);
                updateRow = sql.executeUpdate();

                // Transfer the handling to list
                list(username, request, response);
            }
            else if (postid > 0)
            {
                sql = con.prepareStatement(
                    "UPDATE Posts SET title= ?, body= ?, modified = NOW() WHERE username = ? AND postid = ?"
                );
                sql.setString(1, title);
                sql.setString(2, body);
                sql.setString(3, username);
                sql.setInt(4, postid);
                updateRow = sql.executeUpdate();

                if (updateRow == 0)
                    throw new SQLException("Updated 0 rows, (username, postid) do not exist in DB.");
                else
                    // Transfer the handling to list
                    list(username, request, response);
            }
            else
            {
                exp = true;
                try { response.sendError(400); } catch (IOException ioe) { System.err.println("IOException: " + ioe.getMessage()); } catch (IllegalStateException ise) { System.err.println("IllegalStateException: " + ise.getMessage()); }
            }
        } catch (SQLException ex) {
            exp = true;
            System.err.println("SQLException: " + ex.getMessage());
            try { response.sendError(404); } catch (IOException ioe) { System.err.println("IOException: " + ex.getMessage()); } catch (IllegalStateException ise) { System.err.println("IllegalStateException: " + ex.getMessage()); }
        } finally {
            // Close statements, and connection
            // No result to close in this case
            try { sql.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
            try { con.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
        }
        return !exp;
    }

    public boolean delete(String username, int postid, HttpServletRequest request, HttpServletResponse response)
    {
        Connection con = null;
        PreparedStatement sql = null;
        int updateRow = 0;
        boolean exp = false;

        try {
            con = DriverManager.getConnection(
                "jdbc:mariadb://localhost:3306/CS144", "cs144", ""
            );

            sql = con.prepareStatement(
                "DELETE FROM Posts WHERE username = ? AND postid = ?"
            );

            sql.setString(1, username);
            sql.setInt(2, postid);

            updateRow = sql.executeUpdate();

            if (updateRow == 0)
                throw new SQLException("Updated 0 rows, (username, postid) do not exist in DB.");
            else {
                try { response.getWriter().println("<head><meta http-equiv=\"Refresh\" content=\"0; URL=/editor/post?action=list&username=" + username + "\"></head>"); } catch (IOException ioe) { System.err.println("IOException: " + ioe.getMessage()); } catch (IllegalStateException ise) { System.err.println("IllegalStateException: " + ise.getMessage()); }
            }


        } catch (SQLException ex) {
            exp = true;
            System.err.println("SQLException: " + ex.getMessage());
            try { response.sendError(404); } catch (IOException ioe) { System.err.println("IOException: " + ioe.getMessage()); } catch (IllegalStateException ise) { System.err.println("IllegalStateException: " + ise.getMessage()); }
        } finally {
            // Close statements, and connection
            try { sql.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
            try { con.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
        }
        return !exp;
    }

    public void preview(String username, int postid, String title, String body, HttpServletRequest request, HttpServletResponse response)
    {

        Parser parser = Parser.builder().build();
        HtmlRenderer renderer = HtmlRenderer.builder().build();
        
        // open(username, postid, title, body, request, response);

        request.setAttribute("htmlBody", renderer.render(parser.parse((String)request.getParameter("body"))));

    }

    public boolean list(String username, HttpServletRequest request, HttpServletResponse response)
    {
        Connection con = null;
        PreparedStatement sql = null;
        ResultSet rs = null;
        boolean exp = false;

        try {
            // Connect to DB
            con = DriverManager.getConnection(
                "jdbc:mariadb://localhost:3306/CS144", "cs144", ""
            );

            sql = con.prepareStatement(
                    "SELECT title, created, modified, postid FROM Posts WHERE username = ? ORDER BY postid ASC"
            );

            sql.setString(1, username);
            // Issue query
            rs = sql.executeQuery();
            // Collect result
            ArrayList<Post> retrievedPosts = new ArrayList<Post>();
            if (!rs.next())
                throw new SQLException("No matches in DB for user: " + username + ".");
            else {
                do
                {
                    Post post = new Post(rs.getString(1), rs.getString(2), rs.getString(3), rs.getInt(4));
                    retrievedPosts.add(post);
                } while (rs.next());
            }
            // Add collected result to request, so jsp can process it later
            request.setAttribute("posts", retrievedPosts);

            // Forward to list jsp page
            try {
                request.getRequestDispatcher("/list.jsp").forward(request, response);
            } catch (ServletException se) {
                System.err.println("ServletException: " + se.getMessage());
            } catch (IOException ioe) {
                System.err.println("IOException: " + ioe.getMessage());
            }
            
        } catch (SQLException ex) {
            exp = true;
            System.err.println("SQLException: " + ex.getMessage());
            try { response.sendError(404); } catch (IOException ioe) { System.err.println("IOException: " + ex.getMessage()); } catch (IllegalStateException ise) { System.err.println("IllegalStateException: " + ex.getMessage()); }
        } finally {
            // Close result, statements, and connection
            try { rs.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
            try { sql.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
            try { con.close(); } catch (Exception e) { System.err.println("SQLException: " + e.getMessage()); }
        }
        return !exp;
    }


}
