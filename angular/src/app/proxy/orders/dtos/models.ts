import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { OrderStatus } from '../order-status.enum';

export interface OrderDto extends AuditedEntityDto<string> {
  orderNumber?: string;
  description?: string;
  orderDate?: string;
  status: OrderStatus;
  statusString?: string;
  trackingNumber?: string;
  shippedDate?: string;
  deliveredDate?: string;
  customerId?: string;
  customerName?: string;
}

export interface CreateUpdateOrderDto {
  description: string;
  customerId: string;
}

export interface GetOrderListDto extends PagedAndSortedResultRequestDto {
  filter?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  customerName?: string;
  customerId?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  trackingNumber?: string;
}
