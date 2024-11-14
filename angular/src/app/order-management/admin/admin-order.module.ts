import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule } from '@abp/ng.components/page';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AdminOrderRoutingModule } from './admin-order-routing.module';
import { ViewAllOrderComponent } from './view-all-order/view-all-order.component';
import { UpdateStatusOrderComponent } from './view-all-order/update-status-order/update-status-order.component';

@NgModule({
  declarations: [
    ViewAllOrderComponent,
    UpdateStatusOrderComponent
  ],
  imports: [
    CommonModule,
    AdminOrderRoutingModule,
    PageModule,
    NzSelectModule,
    SharedModule,
    NzDatePickerModule,
  ]
})
export class AdminOrderModule { }
