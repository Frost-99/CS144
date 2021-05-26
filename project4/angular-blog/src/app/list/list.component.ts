import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Post } from '../post';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges {

    @Input() posts: Post[];
    @Output() openPost = new EventEmitter<Post>();
    @Output() newPost = new EventEmitter<Post>();


    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges() {
    }

}
