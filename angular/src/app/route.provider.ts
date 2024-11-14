import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService,  AuthService], multi: true },
];

function configureRoutes(routes: RoutesService, authService: AuthService) {
  return () => {
    // Admin Routes
    routes.add([
      {
        path: '/dashboard/admin',
        name: 'Admin Dashboard',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
        requiredPolicy: 'CustomerPortal.Customers',
        invisible: authService.isCustomerAuthenticated()
      },
      {
        path: '/admin-customer/admin-customer',
        name: 'Customer Management',
        iconClass: 'fas fa-users',
        order: 2,
        layout: eLayoutType.application,
        requiredPolicy: 'CustomerPortal.Customers',
        invisible: authService.isCustomerAuthenticated()
      },
      {
        path: '/admin-order/admin-order',
        name: 'Order Management',
        iconClass: 'fas fa-shopping-cart',
        order: 3,
        layout: eLayoutType.application,
        requiredPolicy: 'CustomerPortal.Orders',
        invisible: authService.isCustomerAuthenticated()
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
        invisible: !authService.isCustomerAuthenticated()
      },
      {
        path: '/customer-management/view-customer',
        name: 'View Profile',
        iconClass: 'fas fa-user',
        order: 2,
        layout: eLayoutType.application,
        invisible: !authService.isCustomerAuthenticated()
      },
      {
        path: '/order-management/view-order',
        name: 'View Order',
        iconClass: 'fas fa-shopping-cart',
        order: 3,
        layout: eLayoutType.application,
        invisible: !authService.isCustomerAuthenticated()
      }
    ]);
  };
}
