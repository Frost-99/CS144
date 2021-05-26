package mypost;

public class Post {
    private String postTitle, createdTime, modifiedTime;
    private int postid;

    public Post(String title, String created, String modified, int id)
    {
        postTitle = title;
        createdTime = created;
        modifiedTime = modified;
        postid = id;
    }

    public String getTitle()
    {
        return postTitle;
    }

    public String getCreateDate()
    {
        return createdTime;
    }

    public String getModifiedDate()
    {
        return modifiedTime;
    }

    public int getid()
    {
        return postid;
    }
}