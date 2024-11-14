import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewOrderComponent } from './view-order/view-order.component';
import { AddEditOrderComponent } from './view-order/add-edit-order/add-edit-order.component';

const routes: Routes = [
    { path: 'view-order', component: ViewOrderComponent },
    { path: 'add-edit-order', component: AddEditOrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
    