import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '@proxy/customers';
import { OrderService, OrderStatus } from '@proxy/orders';
import { CustomerDto, CustomerTokenDto } from '@proxy/customers/dtos/models';
import { OrderDto } from '@proxy/orders/dtos/models';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  formFilters: FormGroup;
  currentCustomer: CustomerTokenDto;
  customerOrders: OrderDto[] = [];
  loading = false;
  error: string = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.formFilters = this.fb.group({
      times: null
    });
  }

  ngOnInit(): void {
    // Check if customer data exists
    console.log(this.authService.getCustomerToken());
    const customerData = this.authService.getCustomerData();
    // if (!customerData?.id) {
    //   this.router.navigate(['/account/login']);
    //   return;
    // }
    
    // Initialize with stored data
    this.currentCustomer = customerData;
    
    // Then fetch latest data
    this.getCurrentCustomer();
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
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (customer) => {
          this.currentCustomer = customer;
          // Update stored data
          this.authService.setCustomerData(customer);
          if (this.currentCustomer?.id) {
            this.getCustomerOrders();
          }
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
    if (!this.currentCustomer?.id) {
      return;
    }

    const filters = this.formFilters.get('times')?.value;
    
    this.loading = true;
    this.orderService.getOrderListPublic({
      customerId: this.currentCustomer.id,
      maxResultCount: 10,
      skipCount: 0,
      startDate: filters?.fromDate,
      endDate: filters?.toDate,
    })
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe({
      next: (result) => {
        this.customerOrders = result.items;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        if (error.status === 401 || error.status === 403) {
          this.authService.removeCustomerToken();
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
    return this.customerOrders?.filter(o => o.status === OrderStatus.Pending).length || 0;
  }

  get completedOrders(): number {
    return this.customerOrders?.filter(o => o.status === OrderStatus.Delivered).length || 0;
  }
}
