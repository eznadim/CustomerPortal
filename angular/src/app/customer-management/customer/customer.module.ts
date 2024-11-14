import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule } from '@abp/ng.components/page';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './view-customer/customer.component';
import { EditProfileComponent } from './view-customer/edit-profile/edit-profile.component';
import { EditPasswordComponent } from './view-customer/edit-password/edit-password.component';

@NgModule({
  declarations: [
    CustomerComponent,
    EditProfileComponent,
    EditPasswordComponent
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
