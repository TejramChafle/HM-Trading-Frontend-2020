import { Component, OnInit } from '@angular/core';
import { DrawService } from 'src/app/services/draw.service';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemComponent } from 'src/app/forms/item/item.component';
import { AppService } from 'src/app/app.service';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { DrawItemsPrintComponent } from 'src/app/components/draw-items-print/draw-items-print.component';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {

    public loading = false;
    items: any[];
    pagination: any = {};
    limit: number = limit;
    distribution: Array<any>;

    constructor(
        public _drawService: DrawService, private _modalService: NgbModal, public _appService: AppService,
        private router: Router) {
    }

    ngOnInit() {
        this.getItems({ limit: this.limit, offset: 0, page: 1 });
        // this.itemDistribution({ limit: 100, offset: 0, page: 1 });
    }

    getItems(params) {
        this.loading = true;
        this._drawService.getItems(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.items = data.records;
                this.pagination = data.pagination;

                this.items.forEach((item)=>{
                    let draw_item = data.lucky_customer_distribution.find((ditem)=>{
                        return item.item_id == ditem.lucky_draw_item;
                    });
                    if (draw_item) {
                        item.draw_item_total = draw_item.count;
                        item.total = parseInt(item.card_item_total) + parseInt(draw_item.count);
                    } else {
                        item.total = parseInt(item.card_item_total);
                    }
                    let free_item = data.free_item_distribution.find((fitem)=>{
                        return item.item_id == fitem.free_item;
                    });
                    item.free_count = free_item ? free_item.count : null;
                    item.total = item.free_count ? item.total + parseInt(item.free_count) : item.total;

                    let item_delivered = data.items_delivered.find((delivered) => {
                        return item.item_id == delivered.item_id;
                    });
                    console.log({item_delivered});
                    item.item_delivered = item_delivered ? item_delivered.count : null;
                    // item.total = item.item_delivered ? item.total + parseInt(item.item_delivered) : item.total;
                });
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get items information.', 'Error!');
                // console.log('--------------------------------------------------------');
                // console.log('ITEMS ERROR');
                // console.log(error);
                // console.log('--------------------------------------------------------');
            });
    }

    editItem(item) {
        // this._drawService.editItem = item;
        this.router.navigate(['items', item.item_id]);
    }

    deleteItem(item) {
        const modalRef = this._modalService.open(ConfirmComponent, { centered: true, size: 'sm' });
        modalRef.componentInstance.type = 'Delete?';
        modalRef.componentInstance.message = 'Are you sure you want to delete item ' + item.name + '?';
        modalRef.result.then((data) => {
            if (data) {
                this.loading = true;
                this._drawService.deleteItem(item.item_id).subscribe(
                    data => {
                        this._appService.notify('Item deleted successfully.', 'Success!');
                        this.loading = false;
                        // Refresh the customer list
                        this.ngOnInit();
                    }, error => {
                        this.loading = false;
                        this._appService.notify('Sorry, we cannot process your request.', 'Error!');
                    });
            }
        });
    }

    pageChange(page) {
        // console.log(page);
        const params = {
            limit: this.limit,
            offset: this.limit * (parseInt(page, 10) - 1),
            page: page
        };
        this.getItems(params);
    }

    addItem(item?: any) {
        const modalRef = this._modalService.open(ItemComponent, { size: 'lg' });
        modalRef.componentInstance.formdata = item || {};
        modalRef.result.then((data) => {
            // console.log('_modalService data : ', data);
            if (data) {
                this.ngOnInit();
            }
        }).catch((error) => {
            // console.log(error);
            // this._appService.notify('Failed to perform operation.', 'Error!');
        });
    }


    itemDistribution(params) {
        this.loading = true;
        this._drawService.itemDistribution(params).subscribe(
            data => {
                this.loading = false;
                // console.log(data);
                this.distribution = data.records;
                this.distribution.forEach((item)=>{
                    let draw_item = data.lucky_customer_distribution.find((ditem)=>{
                        return item.item_id == ditem.lucky_draw_item;
                    });
                    if (draw_item) {
                        item.draw_item_total = draw_item.draw_item_total;
                    }
                });
                localStorage.setItem('distribution', JSON.stringify(this.distribution));
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the item distribution information.', 'Error!');
                // console.log(error);
            }
        );
    }

    print() {
        localStorage.setItem('printContent', JSON.stringify(this.items));
        const page = new DrawItemsPrintComponent(this._appService, this._modalService);
        page.open(true);
    }
}
