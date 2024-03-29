import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit {
    @Input() message: string;
    @Input() type: string;
    @Input() error: string;
    constructor(public _activeModal: NgbActiveModal) { }

    ngOnInit() {
    }
}
