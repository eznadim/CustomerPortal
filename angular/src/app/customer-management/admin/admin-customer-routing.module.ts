import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAllCustomerComponent } from './view-all-customer/view-all-customer.component';

const routes: Routes = [
  { path: 'admin-customer', component: ViewAllCustomerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCustomerRoutingModule { }
    