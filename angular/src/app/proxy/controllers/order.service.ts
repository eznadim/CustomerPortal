import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateOrderDto, GetOrderListDto, OrderDto, UpdateOrderStatusDto } from '../orders/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiName = 'Default';
  

  cancelOrder = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/orders/${id}`,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'POST',
      url: '/api/orders',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/orders/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'GET',
      url: `/api/orders/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getOrderListAdmin = (input: GetOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderDto>>({
      method: 'GET',
      url: '/api/orders/get-order-admin-list',
      params: { filter: input.filter, status: input.status, statusString: input.statusString, statusNumber: input.statusNumber, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, description: input.description, customerId: input.customerId, orderNumber: input.orderNumber, customerEmail: input.customerEmail, orderDate: input.orderDate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getOrderListPublic = (id: string, input: GetOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderDto>>({
      method: 'GET',
      url: '/api/orders/get-order-public-list',
      params: { id, filter: input.filter, status: input.status, statusString: input.statusString, statusNumber: input.statusNumber, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, description: input.description, customerId: input.customerId, orderNumber: input.orderNumber, customerEmail: input.customerEmail, orderDate: input.orderDate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updateStatus = (id: string, input: UpdateOrderStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'PUT',
      url: `/api/orders/${id}/status`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
