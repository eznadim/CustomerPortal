import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routes: RoutesService) {
  return () => {
    // Admin Routes
    routes.add([
      {
        path: '/dashboard/admin',
        name: 'Admin Dashboard',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
        requiredPolicy: 'admin'
      },
      {
        path: '/customer',
        name: 'Customer Management',
        iconClass: 'fas fa-users',
        order: 2,
        layout: eLayoutType.application,
        requiredPolicy: 'admin'
      },
      {
        path: '/order',
        name: 'Order Management',
        iconClass: 'fas fa-shopping-cart',
        order: 3,
        layout: eLayoutType.application,
        requiredPolicy: 'admin'
      },
    ]);

    // Customer Routes
    routes.add([
      {
        path: '/dashboard/customer',
        name: 'Dashboard',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/customer-management/view-customer',
        name: 'View Profile',
        iconClass: 'fas fa-shopping-cart',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/order-management/view-order',
        name: 'View Order',
        iconClass: 'fas fa-user',
        order: 3,
        layout: eLayoutType.application,
      }
    ]);
  };
}
