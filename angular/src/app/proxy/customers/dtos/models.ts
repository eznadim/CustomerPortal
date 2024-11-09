import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateCustomerDto {
  [x: string]: any;
  customerName: string;
  email: string;
  password: string;
}

export interface CustomerDto extends EntityDto<string> {
  customerId?: string;
  customerName?: string;
  email?: string;
  isActive: boolean;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface CustomerLoginDto {
  email: string;
  password: string;
}

export interface CustomerTokenDto {
  token?: string;
  customerId?: string;
  customerName?: string;
  email?: string;
}

export interface GetCustomersInput extends PagedAndSortedResultRequestDto {
  filter?: string;
  customerName?: string;
  customerEmail?: string;
  orderNo?: string;
  isActive?: boolean;
}

export interface UpdateCustomerDto {
  customerName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}
