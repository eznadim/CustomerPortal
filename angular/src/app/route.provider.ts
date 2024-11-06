import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: '/',
        name: '::Menu:Dashboard',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/customer',
        name: 'Customer',
        iconClass: 'fas fa-file',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/order',
        name: 'Order',
        iconClass: 'fas fa-file',
        order: 3,
        layout: eLayoutType.application,
      }
    ]);
  };
}
