import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateCustomerDto, CustomerDto, CustomerLoginDto, CustomerTokenDto, GetCustomersInput, UpdateCustomerDto } from '../customers/dtos/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiName = 'Default';
  

  activateCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/customer/active-customer',
      params: { customerId },
    },
    { apiName: this.apiName,...config });
  

  deactivateCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/customer/deactivate-customer',
      params: { customerId },
    },
    { apiName: this.apiName,...config });
  

  deleteCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/customer/delete-customer',
      params: { customerId },
    },
    { apiName: this.apiName,...config });
  

  getCustomerById = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'GET',
      url: '/api/customer/get-customer-by-id',
      params: { customerId },
    },
    { apiName: this.apiName,...config });
  

  getCustomersList = (input: GetCustomersInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CustomerDto>>({
      method: 'GET',
      url: '/api/customer/get-customer-list',
      params: { filter: input.filter, customerName: input.customerName, customerEmail: input.customerEmail, orderNo: input.orderNo, isActive: input.isActive, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getProfile = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<CustomerTokenDto>>({
      method: 'GET',
      url: '/api/customer/profile',
    },
    { apiName: this.apiName,...config });
  

  loginByInput = (input: CustomerLoginDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<CustomerTokenDto>>({
      method: 'POST',
      url: '/api/customer/login',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  registerByInput = (input: CreateCustomerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<CustomerTokenDto>>({
      method: 'POST',
      url: '/api/customer/register',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateProfile = (input: UpdateCustomerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/customer/update-customer',
      params: { customerName: input.customerName, email: input.email, currentPassword: input.currentPassword, newPassword: input.newPassword },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
