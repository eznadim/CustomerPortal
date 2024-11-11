import { PagedResultDto, ListService, ABP } from '@abp/ng.core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetOrderListDto, OrderDto } from '@proxy/orders/dtos';
import { OrderService } from '@proxy/orders/order.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss',
  providers: [ListService]
})
export class ViewOrderComponent {

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

  
  constructor(
    public readonly list: ListService,
    private _orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getOrderList();
  }

  getOrderList() {
    const getData = (query: ABP.PageQueryParams) =>
      this._orderService.getOrderListPublic({
        ...query,
        ...this.filters,
        filter: query.filter,
      });
  
    const setData = (list: PagedResultDto<OrderDto>) => (this.data = list);
    this.list.hookToQuery(getData).subscribe(setData);
  }

  clearFilters(){
    this.filters = {} as GetOrderListDto;
    this.getOrderList();
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
}
