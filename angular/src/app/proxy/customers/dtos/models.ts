import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { OrderStatus } from '../../orders/order-status.enum';

export interface CreateCustomerDto {
  customerName: string;
  email: string;
  password: string;
  address?: string;
}

export interface CustomerDto extends EntityDto<string> {
  customerName?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  creationTime?: string;
  lastModificationTime?: string;
  orderId?: string;
  orderNo?: string;
  orderStatus: OrderStatus;
}

export interface CustomerLoginDto {
  email: string;
  password: string;
}

export interface CustomerTokenDto {
  token?: string;
  id?: string;
  customerName?: string;
  email?: string;
  address?: string;
}

export interface GetCustomersInput extends PagedAndSortedResultRequestDto {
  filter?: string;
  customerName?: string;
  customerEmail?: string;
  orderNo?: string;
  isActive?: boolean;
}

export interface UpdateCustomerDto {
  customerName?: string;
  email?: string;
  address?: string;
}

export interface UpdatePasswordDto {
  customerId?: string;
  currentPassword?: string;
  newPassword?: string;
}
