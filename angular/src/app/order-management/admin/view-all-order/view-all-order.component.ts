import { ABP, PagedResultDto } from '@abp/ng.core';
import { ListService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component } from '@angular/core';
import { OrderService } from '@proxy/orders/order.service';
import { GetOrderListDto, OrderDto } from '@proxy/orders/dtos';
import { OrderStatus } from '@proxy/orders/order-status.enum';

@Component({
  selector: 'app-view-all-order',
  templateUrl: './view-all-order.component.html',
  styleUrl: './view-all-order.component.scss',
  providers: [ListService]
})
export class ViewAllOrderComponent {
  data: PagedResultDto<OrderDto> = {
    items: [],
    totalCount: 0,
  };
  
  filters = {} as GetOrderListDto;
  minStatusDate: Date;
  maxStatusDate: Date;
  selectedOrderId: string;
  isEditModalVisible = false;
  orderStatus = OrderStatus;

  orderStatusToChange = [
    { id: OrderStatus.Pending, name: 'PENDING' },
    { id: OrderStatus.Confirmed, name: 'CONFIRMED' },
    { id: OrderStatus.Processing, name: 'PROCESSING' },
    { id: OrderStatus.Shipped, name: 'SHIPPED' },
    { id: OrderStatus.Delivered, name: 'DELIVERED' },
    { id: OrderStatus.Cancelled, name: 'CANCELLED' }
  ];

  constructor(
    public readonly list: ListService,
    private orderService: OrderService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.getOrderList();
  }

  getOrderList() {
    const getData = (query: ABP.PageQueryParams) =>
      this.orderService.getOrderListAdmin({
        ...query,
        ...this.filters,
        filter: query.filter,
      });
  
    const setData = (list: PagedResultDto<OrderDto>) => (this.data = list);
    this.list.hookToQuery(getData).subscribe(setData);
  }

  clearFilters() {
    this.filters = {} as GetOrderListDto;
    this.minStatusDate = null;
    this.maxStatusDate = null;
    this.list.get();
  }

  searchFilters() {
    if (this.maxStatusDate && this.minStatusDate && this.maxStatusDate > this.minStatusDate) {
      this.filters.startDate = this.minDateModel(this.minStatusDate);
      this.filters.endDate = this.maxDateModel(this.maxStatusDate);
    }
    this.list.get();
  }

  minStatusDateChange(){
    if(!this.minStatusDate){
      this.maxStatusDate = undefined;
    }
  }

  minMaxStatusValidate(){
    let minMaxValidate = false;
    if(this.maxStatusDate < this.minStatusDate){
      minMaxValidate = true;
    }else if(this.maxStatusDate >= this.minStatusDate){
      minMaxValidate = false;
    }
    return minMaxValidate;
  }

  minDateModel(date: Date | null): string | null {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).toISOString();
    }
    return null;
  }

  maxDateModel(date: Date | null): string | null {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).toISOString();
    }
    return null;
  }

  cancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId).subscribe(() => {
      this.list.get();
      this.toasterService.success('::OrderCancelledSuccessfully');
    });
  }

  updateOrderStatus(orderId: string, status: number) {
    this.orderService.updateStatus(orderId, { status: status }).subscribe(() => {
      this.list.get();
      this.toasterService.success('::OrderStatusUpdatedSuccessfully');
    });
  }

  editOrder(orderId: string) {
    this.selectedOrderId = orderId;
    this.isEditModalVisible = true;
  }

  onOrderEditChanged() {
    this.isEditModalVisible = false;
    this.list.get();
    this.toasterService.success('Order updated successfully');
  }

  onOrderCancelChangeCancel() {
    this.isEditModalVisible = false;
  }
}
