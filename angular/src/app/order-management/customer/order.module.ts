import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule } from '@abp/ng.components/page';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { OrderRoutingModule } from './order-routing.module';
import { AddEditOrderComponent } from './view-order/add-edit-order/add-edit-order.component';
import { ViewOrderComponent } from './view-order/view-order.component';

@NgModule({
  declarations: [
    ViewOrderComponent, 
    AddEditOrderComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    PageModule,
    NzSelectModule,
    SharedModule,
    NzDatePickerModule,
  ]
})
export class OrderModule { }
