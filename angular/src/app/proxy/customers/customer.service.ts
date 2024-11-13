import type { CreateCustomerDto, CustomerDto, CustomerLoginDto, CustomerTokenDto, UpdateCustomerDto, UpdatePasswordDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiName = 'Default';
  

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
