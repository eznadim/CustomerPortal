import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '@proxy/orders/order.service';
import { CustomerService } from '@proxy/customers/customer.service';
import { map, forkJoin } from 'rxjs';

export interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  recentOrders: any[];
  ordersByStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  constructor(
    private orderService: OrderService,
    private customerService: CustomerService
  ) {}

  getDashboardStats(startDate?: string, endDate?: string): Observable<DashboardStats> {
    return forkJoin({
      orders: this.orderService.getOrderListAdmin({ maxResultCount: 1000, skipCount: 0, startDate, endDate }),
      customers: this.customerService.getCustomerListAdmin({ maxResultCount: 1000, skipCount: 0 })
    }).pipe(
      map(({ orders, customers }) => ({
        totalOrders: orders.totalCount,
        totalCustomers: customers.totalCount,
        recentOrders: orders.items.slice(0, 5),
        ordersByStatus: {
          pending: orders.items.filter(o => o.status === 0).length,
          confirmed: orders.items.filter(o => o.status === 1).length,
          processing: orders.items.filter(o => o.status === 2).length,
          shipped: orders.items.filter(o => o.status === 3).length,
          delivered: orders.items.filter(o => o.status === 4).length,
          cancelled: orders.items.filter(o => o.status === 5).length,
        }
      }))
    );
  }
} 