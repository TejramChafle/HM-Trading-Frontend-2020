import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-draw-items-print',
    templateUrl: './draw-items-print.component.html'
})

export class DrawItemsPrintComponent implements OnInit, AfterViewInit {
    @Input()
    items: any[] = [];
    modalRef: any;

    constructor(public _appService: AppService, private _modalService: NgbModal) { }

    ngOnInit() {
        this.items = JSON.parse(localStorage.getItem('printContent'));
        // console.log(this.items);
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(DrawItemsPrintComponent, { centered: true, size: 'lg' });
        if (isPrint) {
            setTimeout(() => {
                this.print();
                setTimeout(() => {
                    this.modalRef.close();
                }, 300);
            }, 500);
        }
    }

    print() {
        let printContents, popupWin;
        popupWin = window.open('_blank');
        printContents = document.getElementById('print-page').innerHTML;
        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
        // Do not close window for mobile device and give user a chance to print manually
        if (this._appService.innerWidth > 768) {
            popupWin.document.close();
        } else {
            popupWin.document.title = 'hm-trading-items';
        }
    }
}
