import type { CreateCustomerDto, CustomerDto, CustomerLoginDto, CustomerTokenDto, GetCustomersInput, UpdateCustomerDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiName = 'Default';
  

  activateCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/customer/activate-customer/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  deactivateCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/customer/deactivate-customer/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  deleteCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/customer/customer/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  getCurrentCustomer = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerTokenDto>({
      method: 'GET',
      url: '/api/app/customer/current-customer',
    },
    { apiName: this.apiName,...config });
  

  getCustomerById = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'GET',
      url: `/api/app/customer/customer-by-id/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  getCustomersList = (input: GetCustomersInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CustomerDto>>({
      method: 'GET',
      url: '/api/app/customer/customers-list',
      params: { filter: input.filter, customerName: input.customerName, customerEmail: input.customerEmail, orderNo: input.orderNo, isActive: input.isActive, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  login = (input: CustomerLoginDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerTokenDto>({
      method: 'POST',
      url: '/api/app/customer/login',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  register = (input: CreateCustomerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerTokenDto>({
      method: 'POST',
      url: '/api/app/customer/register',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateProfile = (input: UpdateCustomerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/customer/profile',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
