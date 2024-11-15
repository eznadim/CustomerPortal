import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateCustomerDto, CustomerDto, CustomerLoginDto, CustomerTokenDto, GetCustomerListDto, UpdateCustomerDto, UpdatePasswordDto } from '../customers/dtos/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiName = 'Default';
  

  activateDeactivateCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/customer/activate-deactive-customer',
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
  

  getCurrentCustomer = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'GET',
      url: '/api/customer/current-customer',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  getCustomerById = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'GET',
      url: '/api/customer/get-customer-by-id',
      params: { customerId },
    },
    { apiName: this.apiName,...config });
  

  getCustomerListAdmin = (input: GetCustomerListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CustomerDto>>({
      method: 'GET',
      url: '/api/customer/get-customer-admin-list',
      params: { filter: input.filter, startDate: input.startDate, endDate: input.endDate, customerName: input.customerName, email: input.email, address: input.address, isActive: input.isActive, isDeleted: input.isDeleted, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
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
  

  updateCustomerPasswordByIdAndInput = (id: string, input: UpdatePasswordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/customer/update-customer-password',
      params: { id, customerId: input.customerId, currentPassword: input.currentPassword, newPassword: input.newPassword },
    },
    { apiName: this.apiName,...config });
  

  updateProfile = (id: string, input: UpdateCustomerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CustomerDto>({
      method: 'PUT',
      url: '/api/customer/update-customer',
      params: { id, customerName: input.customerName, email: input.email, address: input.address },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
