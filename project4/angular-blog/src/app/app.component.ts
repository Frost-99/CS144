import { Component, HostListener } from '@angular/core';
import { Post } from './post'
import { BlogService } from './blog.service';
import * as cookie from 'cookie';

enum AppState { List = 0, Edit = 1, Preview = 2 };

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    posts: Post[] = [];
    currentPost: Post = new Post();
    appState: AppState = AppState.List;
    username: string = '';

    constructor(private blogService: BlogService) {
        this.username = this.parseJWT(cookie.parse(document.cookie).jwt).usr;
        this.fetchPosts()

        if (window.location.hash == '') {
            window.location.hash = '/';
        }
        this.onHashChange();
    }

    parseJWT(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    }

    fetchPosts() {
        this.blogService.fetchPosts(this.username)
        .then(res => this.posts = res)
        .catch(err => {
            this.posts = [];
            console.error(err);
        });
    }

    get(postid: number) {
        if (postid != 0) {
            this.blogService.getPost(this.username, postid)
            .then(res => this.currentPost = res)
            .catch(err => {
                this.currentPost = new Post();
                window.location.hash = '/';
                console.error(err);
            });

        }
        else
            this.currentPost = new Post();
    }
    
    @HostListener('window:hashchange')
    onHashChange(): void {
        let reList = /^#\/$/;
        let reEdit = /^#\/edit\/\d+$/;
        let rePreview = /^#\/preview\/\d+$/;

        if (reList.test(window.location.hash)) {
            this.appState = AppState.List;
        }
        else {
            if (reEdit.test(window.location.hash))
                this.appState = AppState.Edit;
            else if (rePreview.test(window.location.hash))
                this.appState = AppState.Preview;
            else
                window.location.hash = '/';
            
            let postid: number = parseInt(window.location.hash.split('/')[2]);
            this.get(postid);
        }
    }

    // event handlers for list component events
    openPost(post: Post) {
        window.location.hash = `/edit/${post.postid}`;
    }
    newPost() {
        window.location.hash = `/edit/${0}`;
    }
    // event handlers for edit component events
    previewPost(post: Post) {
        window.location.hash = `/preview/${post.postid}`;
    }
    savePost(post: Post) {
        if (post.postid == 0) {
            this.blogService.setPost(this.username, post).then(res => {
                this.currentPost.created = res.created;
                this.currentPost.modified = res.modified;
                this.currentPost.postid = res.postid;
            }).catch(err => console.error(err));
            
            this.posts.push(this.currentPost);
            // this.fetchPosts();
            window.location.hash = `/edit/${this.currentPost.postid}`;
        }
        else if (post.postid > 0) {
            this.blogService.setPost(this.username, post).then(res => this.currentPost.modified = res.modified).catch(err => console.error(err));
            this.fetchPosts();
        }
        else {
            console.error('Wrong postid!');
        }
    }
    deletePost(post: Post) {
        this.blogService.deletePost(this.username, post.postid)
        .then(res => {
            this.currentPost = new Post();
            window.location.hash = '/';
        })
        .catch(err => console.error(err));
        this.fetchPosts()

    }
    // event handlers for preview component events
    editPost(post: Post) {
        window.location.hash = `/edit/${post.postid}`;
    }

}
