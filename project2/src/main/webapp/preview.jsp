<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Preview Post</title>
</head>
<body>
    <div>
        <form action="post" method="POST">
            <input type="hidden" name="username" value="<%= request.getParameter("username") %>">
            <input type="hidden" name="postid" value="<%= request.getParameter("postid") %>">
            <input type="hidden" name="title" value="<%= request.getParameter("title") %>">
            <input type="hidden" name="body" value="<%= request.getParameter("body") %>">
            <button type="submit" name="action" value="open">Close Preview</button>
        </form>
    </div>
    <div>
        <h1><%= request.getParameter("title") %></h1>
        <%= request.getAttribute("htmlBody") %>
    </div>
</body>
</html>

