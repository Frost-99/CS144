import { Injectable } from '@angular/core';
import { Post } from './post';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    constructor() { }

    fetchPosts(username: string): Promise<Post[]> {
        return fetch(`/api/posts?username=${username}`).then((res) => {
            if (res.ok)
                return Promise.resolve(res.json());
            else
                return Promise.reject(new Error(String(res.status)));
                
        });
    }

    getPost(username: string, postid: number): Promise<Post> {
        return fetch(`/api/posts?username=${username}&postid=${postid}`).then((res) => {
            if (res.ok)
                return Promise.resolve(res.json());
            else
                return Promise.reject(new Error(String(res.status)));
        });
    }

    setPost(username: string, post: Post): Promise<Post> {
        return fetch('/api/posts', 
            {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                'body': `username=${encodeURIComponent(username)}&postid=${encodeURIComponent(post.postid)}&title=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.body)}`
            }
        )
        .then(res => {
            if (res.ok)
                return Promise.resolve(res.json());
            else
                return Promise.reject(new Error(String(res.status)));
        });
    }

    deletePost(username: string, postid: number): Promise<void> {
        return fetch(`/api/posts?username=${username}&postid=${postid}`, {'method': 'DELETE'})
        .then((res) => {
            if (res.ok)
                return Promise.resolve();
            else
                return Promise.reject(new Error(String(res.status)));
        });
    }

}
