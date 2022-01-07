import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-draw-lucky-customers-print',
    templateUrl: './draw-lucky-customers-print.component.html'
})

export class DrawLuckyCustomersPrintComponent implements OnInit, AfterViewInit {
    @Input()
    customers: any[] = [];
    modalRef: any;

    constructor(public _appService: AppService, private _modalService: NgbModal) { }

    ngOnInit() {
        this.customers = JSON.parse(localStorage.getItem('printContent'));
        // console.log(this.customers);
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(DrawLuckyCustomersPrintComponent, { centered: true, size: 'lg' });
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
            popupWin.document.title = 'hm-trading-lucky-customers';
        }
    }
}
