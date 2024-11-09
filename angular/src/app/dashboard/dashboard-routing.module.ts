import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { authGuard } from '@abp/ng.core';
import { CustomerAuthGuard } from '../shared/guards/customer-auth.guard';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
    { path: 'customer', component: CustomerDashboardComponent, canActivate: [CustomerAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
