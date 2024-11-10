import { mapEnumToOptions } from '@abp/ng.core';

export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
}

export const orderStatusOptions = mapEnumToOptions(OrderStatus);
