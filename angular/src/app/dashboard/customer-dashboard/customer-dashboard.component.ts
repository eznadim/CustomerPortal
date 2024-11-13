import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '@proxy/customers';
import { OrderService, OrderStatus } from '@proxy/orders';
import { CustomerTokenDto } from '@proxy/customers/dtos/models';
import { OrderDto, GetOrderListDto } from '@proxy/orders/dtos/models';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  currentCustomer: CustomerTokenDto;
  customerOrders: OrderDto[] = [];
  loading = false;
  error: string = null;
  OrderStatus = OrderStatus; // Make enum available in template

  constructor(
    private customerService: CustomerService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const customerData = this.authService.getCustomerData();
    if (!customerData?.id) {
      this.router.navigate(['/account/login']);
      return;
    }
    
    this.currentCustomer = customerData;
    this.getCurrentCustomer();
    this.getCustomerOrders();
  }

  getCurrentCustomer() {
    this.loading = true;
    this.error = null;

    const customerId = this.authService.getCurrentCustomerId();
    if (!customerId) {
      this.error = 'No customer ID found';
      this.loading = false;
      return;
    }

    this.customerService.getCurrentCustomer(customerId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (customer) => {
          this.currentCustomer = customer;
          this.authService.setCustomerData(customer);
        },
        error: (error) => {
          console.error('Error fetching customer:', error);
          if (error.status === 401 || error.status === 403) {
            this.authService.removeCustomerData();
            this.router.navigate(['/account/login']);
          }
          this.error = 'Failed to load customer information';
        }
      });
  }

  getCustomerOrders() {
    const customerId = this.authService.getCurrentCustomerId();
    if (!customerId) return;

    this.loading = true;

    const filters: GetOrderListDto = {
      customerId: customerId,
      maxResultCount: 5, // Show only 5 recent orders in dashboard
      skipCount: 0,
      // Add any other filter parameters you need
    };

    this.orderService.getOrderListPublic(customerId, filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (result) => {
          this.customerOrders = result.items;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
          if (error.status === 401 || error.status === 403) {
            this.authService.removeCustomerData();
            this.router.navigate(['/account/login']);
          }
          this.error = 'Failed to load orders';
        }
      });
  }

  refresh() {
    this.getCustomerOrders();
  }

  get isAuthenticated(): boolean {
    return this.authService.isCustomerAuthenticated();
  }

  get customerName(): string {
    return this.currentCustomer?.customerName || 'Guest';
  }

  get totalOrders(): number {
    return this.customerOrders?.length || 0;
  }

  get pendingOrders(): number {
    return this.customerOrders?.filter(o => 
      o.status === OrderStatus.Pending || 
      o.status === OrderStatus.Processing
    ).length || 0;
  }

  get completedOrders(): number {
    return this.customerOrders?.filter(o => 
      o.status === OrderStatus.Delivered
    ).length || 0;
  }

  getStatusBadgeClass(status: OrderStatus): string {
    const statusMap = {
      [OrderStatus.Pending]: 'badge bg-warning',
      [OrderStatus.Processing]: 'badge bg-info',
      [OrderStatus.Shipped]: 'badge bg-primary',
      [OrderStatus.Delivered]: 'badge bg-success',
      [OrderStatus.Cancelled]: 'badge bg-danger'
    };
    return statusMap[status] || 'badge bg-secondary';
  }

  getStatusLabel(status: OrderStatus): string {
    return OrderStatus[status];
  }
  
  viewAllOrders(): void {
    this.router.navigate(['/order-management/view-order']);
  }
}