import type { CreateUpdateOrderDto, GetOrderListDto, OrderDto, UpdateOrderStatusDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiName = 'Default';
  

  cancelOrder = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'POST',
      url: `/api/app/order/${id}/cancel-order`,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'POST',
      url: '/api/app/order',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/order/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'GET',
      url: `/api/app/order/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getOrderListAdmin = (input: GetOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderDto>>({
      method: 'GET',
      url: '/api/app/order/order-list-admin',
      params: { filter: input.filter, status: input.status, statusString: input.statusString, statusNumber: input.statusNumber, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, description: input.description, customerId: input.customerId, orderNumber: input.orderNumber, customerEmail: input.customerEmail, orderDate: input.orderDate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getOrderListPublic = (id: string, input: GetOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderDto>>({
      method: 'GET',
      url: `/api/app/order/${id}/order-list-public`,
      params: { filter: input.filter, status: input.status, statusString: input.statusString, statusNumber: input.statusNumber, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, description: input.description, customerId: input.customerId, orderNumber: input.orderNumber, customerEmail: input.customerEmail, orderDate: input.orderDate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updateStatus = (id: string, input: UpdateOrderStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'PUT',
      url: `/api/app/order/${id}/status`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
