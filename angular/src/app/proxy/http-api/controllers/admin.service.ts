import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CustomerDto, GetCustomersInput } from '../../customers/dtos/models';
import type { ActionResult } from '../../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiName = 'Default';
  

  activateCustomerById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'POST',
      url: `/api/admin/customers/${id}/activate`,
    },
    { apiName: this.apiName,...config });
  

  deactivateCustomerById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'POST',
      url: `/api/admin/customers/${id}/deactivate`,
    },
    { apiName: this.apiName,...config });
  

  deleteCustomerById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'DELETE',
      url: `/api/admin/customers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCustomerById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<CustomerDto>>({
      method: 'GET',
      url: `/api/admin/customers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCustomersByInput = (input: GetCustomersInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<CustomerDto>>>({
      method: 'GET',
      url: '/api/admin/customers',
      params: { filter: input.filter, customerName: input.customerName, customerEmail: input.customerEmail, orderNo: input.orderNo, isActive: input.isActive, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
