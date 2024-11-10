import type { OrderDto } from '../orders/dtos/models';

export interface AdminDashboardDto {
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  recentOrders: OrderDto[];
}
