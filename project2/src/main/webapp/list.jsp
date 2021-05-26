<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.util.*, mypost.Post" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Post List</title>
</head>
<body>

    <div>
        <form action="post" id="0>">
            <input type="hidden" name="username" value="<%= request.getParameter("username") %>">
            <input type="hidden" name="postid" value="0">
            <button type="submit" name="action" value="open">New Post</button>
        </form>
    </div>

    <div><h1>Post List</h1></div>

    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
            <th>Modified</th>
        </tr>
        <% ArrayList<Post> posts = (ArrayList<Post>) request.getAttribute("posts"); %>
        <% for (int i = 0; i < posts.size(); i++) { %>
                <tr>
                    <form id="<%= posts.get(i).getid() %>" action="post" method="POST"> 
                        <input type="hidden" name="username" value="<%= request.getParameter("username") %>">
                        <input type="hidden" name="postid" value="<%= posts.get(i).getid() %>">
                        <td><%= posts.get(i).getTitle() %></td>
                        <td><%= posts.get(i).getCreateDate() %></td>
                        <td><%= posts.get(i).getModifiedDate() %></td>
                        <td>
                            <button type="submit" name="action" value="open">Open</button>
                            <button type="submit" name="action" value="delete">Delete</button>
                        </td>
                    </form>
                </tr>
        <% } %>
    </table>
</body>
</html>
