import type { AdminDashboardDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CustomerDto, GetCustomersInput } from '../customers/dtos/models';
import type { GetOrderListDto, OrderDto, UpdateOrderStatusDto } from '../orders/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class AdministratorService {
  apiName = 'Default';
  

  activateCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/administrator/activate-customer/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  deactivateCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/administrator/deactivate-customer/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  getCustomerDetails = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'GET',
      url: `/api/app/administrator/customer-details/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  getCustomersList = (input: GetCustomersInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CustomerDto>>({
      method: 'GET',
      url: '/api/app/administrator/customers-list',
      params: { filter: input.filter, customerName: input.customerName, customerEmail: input.customerEmail, orderNo: input.orderNo, isActive: input.isActive, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getDashboardStatistics = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AdminDashboardDto>({
      method: 'GET',
      url: '/api/app/administrator/dashboard-statistics',
    },
    { apiName: this.apiName,...config });
  

  getOrderDetails = (orderId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'GET',
      url: `/api/app/administrator/order-details/${orderId}`,
    },
    { apiName: this.apiName,...config });
  

  getOrdersAdminList = (input: GetOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderDto>>({
      method: 'GET',
      url: '/api/app/administrator/orders-admin-list',
      params: { filter: input.filter, status: input.status, statusString: input.statusString, statusNumber: input.statusNumber, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, description: input.description, customerId: input.customerId, orderNumber: input.orderNumber, customerEmail: input.customerEmail, orderDate: input.orderDate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updateOrderStatus = (orderId: string, input: UpdateOrderStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'PUT',
      url: `/api/app/administrator/order-status/${orderId}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
