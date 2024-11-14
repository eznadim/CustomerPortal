import type { CreateCustomerDto, CustomerDto, CustomerLoginDto, CustomerTokenDto, GetCustomerListDto, UpdateCustomerDto, UpdatePasswordDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiName = 'Default';
  

  activateDeactivateCustomer = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/customer/${id}/activate-deactivate-customer`,
    },
    { apiName: this.apiName,...config });
  

  deleteCustomer = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/customer/${id}/customer`,
    },
    { apiName: this.apiName,...config });
  

  getCurrentCustomer = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'GET',
      url: `/api/app/customer/${id}/current-customer`,
    },
    { apiName: this.apiName,...config });
  

  getCustomerById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'GET',
      url: `/api/app/customer/${id}/customer-by-id`,
    },
    { apiName: this.apiName,...config });
  

  getCustomerListAdmin = (input: GetCustomerListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CustomerDto>>({
      method: 'GET',
      url: '/api/app/customer/customer-list-admin',
      params: { filter: input.filter, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, email: input.email, address: input.address, isActive: input.isActive, isDeleted: input.isDeleted, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
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
  

  updateCustomerPasswordByIdAndInput = (id: string, input: UpdatePasswordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/customer/${id}/customer-password`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateProfile = (id: string, input: UpdateCustomerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'PUT',
      url: `/api/app/customer/${id}/profile`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
