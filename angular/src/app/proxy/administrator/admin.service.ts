import type { AdminDashboardDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CustomerDto, GetCustomersInput } from '../customers/dtos/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';
import type { GetOrderListDto, OrderDto, UpdateOrderStatusDto } from '../orders/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiName = 'Default';
  

  activateCustomer = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'POST',
      url: `/api/app/admin/customers/${id}/activate`,
    },
    { apiName: this.apiName,...config });
  

  deactivateCustomer = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'POST',
      url: `/api/app/admin/customers/${id}/deactivate`,
    },
    { apiName: this.apiName,...config });
  

  getCustomerDetails = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<CustomerDto>>({
      method: 'GET',
      url: `/api/app/admin/customers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCustomersList = (input: GetCustomersInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<CustomerDto>>>({
      method: 'GET',
      url: '/api/app/admin/customers',
      params: { filter: input.filter, customerName: input.customerName, customerEmail: input.customerEmail, orderNo: input.orderNo, isActive: input.isActive, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getDashboardStatistics = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<AdminDashboardDto>>({
      method: 'GET',
      url: '/api/app/admin/dashboard',
    },
    { apiName: this.apiName,...config });
  

  getOrderDetails = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<OrderDto>>({
      method: 'GET',
      url: `/api/app/admin/orders/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getOrdersAdminList = (input: GetOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<OrderDto>>>({
      method: 'GET',
      url: '/api/app/admin/orders',
      params: { filter: input.filter, status: input.status, statusString: input.statusString, statusNumber: input.statusNumber, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, description: input.description, customerId: input.customerId, orderNumber: input.orderNumber, customerEmail: input.customerEmail, orderDate: input.orderDate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updateOrderStatus = (id: string, input: UpdateOrderStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<OrderDto>>({
      method: 'PUT',
      url: `/api/app/admin/orders/${id}/status`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
