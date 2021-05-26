import { Component, Input, Output, OnInit, EventEmitter, OnChanges } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post } from '../post';

function markdownToHtml(markdownString: string): string {
    let reader = new Parser();
    let writer = new HtmlRenderer();
    let parsed = reader.parse(markdownString);
    return writer.render(parsed);
}

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnChanges {

    @Input() post: Post;
    @Output() editPost = new EventEmitter<Post>();

    title: string;
    body: string;

    
    constructor() { }
    
    ngOnInit(): void {
        this.title = markdownToHtml(this.post.title);
        this.body = markdownToHtml(this.post.body);
    }

    ngOnChanges(): void {
        this.title = markdownToHtml(this.post.title);
        this.body = markdownToHtml(this.post.body);
    }

}
