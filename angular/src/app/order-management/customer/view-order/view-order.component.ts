import { PagedResultDto, ListService, ABP } from '@abp/ng.core';
import { Component } from '@angular/core';
import { GetOrderListDto, OrderDto } from '@proxy/orders/dtos';
import { OrderService } from '@proxy/orders/order.service';
import { ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss',
  providers: [ListService]
})
export class ViewOrderComponent {

  isOrderModalVisible = false;
  isCancelModalVisible = false;
  customerData: any;
  filters = {} as GetOrderListDto;
  minStatusDate: Date;
  maxStatusDate: Date;
  orderStatus = [
    {id: 1, name: 'PENDING' },
    {id: 2, name: 'SHIPPED' },
    {id: 3, name: 'DELIVERED' }
  ];
  data: PagedResultDto<OrderDto> = {
    items: [],
    totalCount: 0,
  };
  selectedOrderId: string;

  
  constructor(
    public readonly list: ListService,
    private _orderService: OrderService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    const customerDataStr = localStorage.getItem('customer_data');
    if (customerDataStr) {
      this.customerData = JSON.parse(customerDataStr);
    } else {
      this.toasterService.error('Customer data not found');
    }
    this.getOrderList();
  }

  getOrderList() {
    const getData = (query: ABP.PageQueryParams) =>
      this._orderService.getOrderListPublic(this.customerData.id, {
        ...query,
        ...this.filters,
        filter: query.filter,
        customerId: this.customerData.id
      });
  
    const setData = (list: PagedResultDto<OrderDto>) => (this.data = list);
    this.list.hookToQuery(getData).subscribe(setData);
  }

  clearFilters(){
    //not working for some reason
    // this.filters = {} as GetOrderListDto;
    // this.minStatusDate = null;
    // this.maxStatusDate = null;
    window.location.reload();
  }

  searchFilters(){
    if(this.maxStatusDate > this.minStatusDate){
      this.filters.startDate = this.minDateModel(this.minStatusDate);
      this.filters.endDate = this.maxDateModel(this.maxStatusDate);
    }
    this.list.get();

  }

  minDateModel(date: Date | null): string | null {
    if(date){
      let dateString = (
        new Date(date.getFullYear(),date.getMonth(),date.getDate(),8,0,0)
        ).toISOString();
      return dateString;
    }
    return null;
  }

  maxDateModel(date: Date | null): string | null {
    if(date){
      let dateString = (
        new Date(date.getFullYear(),date.getMonth(),date.getDate(),19,59,59)
        ).toISOString();
      return dateString;
    }
    return null;
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

  addOrder() {
    this.isOrderModalVisible = true;
  }

  onOrderChanged() {
    this.isOrderModalVisible = false;
    this.list.get();
    this.toasterService.success('Order updated successfully');
  }

  onOrderChangeCancel() {
    this.isOrderModalVisible = false;
  }

  cancelOrder(orderId: string) {
    this.selectedOrderId = orderId;
    this.isCancelModalVisible = true;
  }

  onOrderCancelChanged() {
    this.isCancelModalVisible = false;
    this.list.get();
    this.toasterService.success('Order cancelled successfully');
  }

  onOrderCancelChangeCancel() {
    this.isCancelModalVisible = false;
  }
}
