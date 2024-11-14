import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule } from '@abp/ng.components/page';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AdminCustomerRoutingModule } from './admin-customer-routing.module';
import { ViewAllCustomerComponent } from './view-all-customer/view-all-customer.component';
import { ActivateDeactivateCustomerComponent } from './view-all-customer/activate-deactivate-customer/activate-deactivate-customer.component';

@NgModule({
  declarations: [
    ViewAllCustomerComponent,
    ActivateDeactivateCustomerComponent
  ],
  imports: [
    CommonModule,
    AdminCustomerRoutingModule,
    PageModule,
    NzSelectModule,
    SharedModule,
    NzDatePickerModule,
  ]
})
export class AdminCustomerModule { }
