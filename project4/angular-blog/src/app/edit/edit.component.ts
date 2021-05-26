import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { Post } from '../post';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges {

    @Input() post: Post = new Post();
    @Output() savePost = new EventEmitter<Post>();
    @Output() deletePost = new EventEmitter<Post>();
    @Output() previewPost = new EventEmitter<Post>();
    
    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges() {}

}
