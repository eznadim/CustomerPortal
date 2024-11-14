import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAllOrderComponent } from './view-all-order/view-all-order.component';

const routes: Routes = [
  { path: 'admin-order', component: ViewAllOrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrderRoutingModule { }
