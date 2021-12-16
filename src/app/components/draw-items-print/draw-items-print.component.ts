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
        console.log(this.items);
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

    /* private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    } */

    print() {
        let printContents, popupWin;
        popupWin = window.open('_blank');
        printContents = document.getElementById('print-page').innerHTML;

        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
        popupWin.document.close();
    }
}
