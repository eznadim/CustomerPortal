import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { OrderStatus } from '../order-status.enum';

export interface CreateUpdateOrderDto {
  description: string;
  customerId: string;
}

export interface GetOrderListDto extends PagedAndSortedResultRequestDto {
  filter?: string;
  status?: OrderStatus;
  statusString?: string;
  statusNumber?: number;
  startDate?: string;
  endDate?: string;
  customerName?: string;
  description?: string;
  customerId?: string;
  orderNumber?: string;
  customerEmail?: string;
  orderDate?: string;
}

export interface OrderDto extends AuditedEntityDto<string> {
  orderNumber?: string;
  description?: string;
  orderDate?: string;
  status: OrderStatus;
  statusString?: string;
  lastModificationTime?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
