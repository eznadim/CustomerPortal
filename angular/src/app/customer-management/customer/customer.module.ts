import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule } from '@abp/ng.components/page';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './view-customer/customer.component';

@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    PageModule,
    NzSelectModule,
    SharedModule,
    NzDatePickerModule,
  ]
})
export class CustomerModule { }
