import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <app-host-dashboard *abpPermission="'CustomerPortal.Dashboard.Host'"></app-host-dashboard>
    <app-tenant-dashboard *abpPermission="'CustomerPortal.Dashboard.Tenant'"></app-tenant-dashboard>
  `,
})
export class DashboardComponent {}
