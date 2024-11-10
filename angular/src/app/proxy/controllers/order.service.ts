import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateOrderDto, GetOrderListDto, OrderDto, UpdateOrderStatusDto } from '../orders/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiName = 'Default';
  

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
  

  getOrderListPublic = (input: GetOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderDto>>({
      method: 'GET',
      url: '/api/orders/get-order-public-list',
      params: { filter: input.filter, status: input.status, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, customerId: input.customerId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
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
