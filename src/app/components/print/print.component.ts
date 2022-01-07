import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.css'],
})

export class PrintComponent implements OnInit, AfterViewInit {
    @Input()
    paidInstallments: any[] = [];
    installments: any[] = [];
    // paidInstallments: Array<any>;
    agent: any;
    count: String;
    totalPaid: any;
    receiptNo: String;
    total: any;
    billingDate: any;
    customer: any;
    totalInWords: String;
    isAgentPrint: Boolean = false;
    modalRef: any;

    constructor(public _appService: AppService, private _modalService: NgbModal) { }

    ngOnInit() {
        this.paidInstallments = JSON.parse(localStorage.getItem('printContent'));
        this.count = localStorage.getItem('count');
        // this.totalPaid = localStorage.getItem('totalPaid');
        this.receiptNo = localStorage.getItem('receipt');
        // console.log(this.paidInstallments);

        localStorage.getItem('customer') ? this.customer = JSON.parse(localStorage.getItem('customer')) : false;
        this.agent = JSON.parse(localStorage.getItem('agent'));

        localStorage.getItem('isAgent') == '1' ? this.isAgentPrint = true : this.isAgentPrint = false;

        if (!localStorage.getItem('billingDate')) {
            let today = new Date();
            this.billingDate = this._appService.GetFormattedDate(today);
        } else {
            let today = new Date(localStorage.getItem('billingDate').replace(' ', 'T'));
            this.billingDate = this._appService.GetFormattedDate(today);
        }

        this.totalPaid = 0;
        this.paidInstallments.forEach((inst) => {
            if (inst.installments.length > 1) {
                let months = [];
                let amount = 0;
                let fine = 0;
                inst.installments.forEach((installment) => {
                    months.push(installment.month);
                    amount += parseInt(installment.amount, 10);
                    fine += installment.fine ? parseInt(installment.fine, 10) : 0;
                });
                inst.last_paid_month = months.join(', ');
                inst.last_paid_amount = amount;
                inst.last_paid_fine = fine;
                inst.last_paid_total = parseInt(inst.last_paid_amount, 10) + parseInt(inst.last_paid_fine, 10);
                this.totalPaid += parseInt(inst.last_paid_total, 10);
            } else {
                inst.last_paid_month = inst.installments[0].month.toString();
                inst.last_paid_amount = inst.installments[0].amount;
                inst.last_paid_fine = inst.installments[0].fine ? inst.installments[0].fine : 0;
                inst.last_paid_total = parseInt(inst.last_paid_amount, 10) + parseInt(inst.last_paid_fine, 10);
                this.totalPaid += parseInt(inst.last_paid_total, 10);
            }
        });

        this.totalInWords = this._appService.inWords(this.totalPaid);
        this.totalInWords = 'Rupees ' + this._appService.capitalizeFirstLetter(this.totalInWords);
        // console.log('---------------------------------------------------------------------');
        // console.log('Total Paid in numbers : ' + this.totalPaid);
        // console.log(this.totalInWords);
        // console.log('---------------------------------------------------------------------');
    }

    ngAfterViewInit() {
        // window.print();
    }

    open(isPrint: Boolean) {
        this.modalRef = this._modalService.open(PrintComponent, { centered: true, size: 'lg' });
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
            popupWin.document.title = 'hm-trading-installments';
        }
    }
}
