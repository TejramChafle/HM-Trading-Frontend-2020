import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'print-header',
    templateUrl: './print-header.component.html'
})

export class PrintHeaderComponent implements OnInit {
    @Input() title: string; 
    constructor() { }

    ngOnInit() {
        // console.log('PRINT ', this.title);
    }
}
