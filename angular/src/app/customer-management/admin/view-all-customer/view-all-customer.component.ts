import { ABP, PagedResultDto } from '@abp/ng.core';
import { ListService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component } from '@angular/core';
import { CustomerService } from '@proxy/customers/customer.service';
import { GetCustomerListDto } from '@proxy/customers/dtos';
import { CustomerDto } from '@proxy/customers/dtos';

@Component({
  selector: 'app-view-all-customer',
  templateUrl: './view-all-customer.component.html',
  styleUrl: './view-all-customer.component.scss',
  providers: [ListService]
})
export class ViewAllCustomerComponent {

  isDeletedModalVisible = false;
  isActivateDeactivateModalVisible = false;
  customerData: any;
  filters = {} as GetCustomerListDto;
  minStatusDate: Date;
  maxStatusDate: Date;
  data: PagedResultDto<CustomerDto> = {
    items: [],
    totalCount: 0,
  };
  selectedCustomerId: string;
  customerStatus = [
    { boolean: true, name: 'ACTIVE' },
    { boolean: false, name: 'INACTIVE' }];

  
  constructor(
    public readonly list: ListService,
    private _customerService: CustomerService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.getCustomerList();
  }

  getCustomerList() {
    const getData = (query: ABP.PageQueryParams) =>
      this._customerService.getCustomerListAdmin({
        ...query,
        ...this.filters,
        filter: query.filter,
      });
  
    const setData = (list: PagedResultDto<CustomerDto>) => (this.data = list);
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

  deleteCustomer(customerId: string) {
    this.selectedCustomerId = customerId;
    this.isDeletedModalVisible = true;
  }

  onDeletedChanged() {
    this.isDeletedModalVisible = false;
    this.list.get();
    this.toasterService.success('Customer deleted successfully');
  }

  onDeletedChangeCancel() {
    this.isDeletedModalVisible = false;
  }

  activateDeactivate(customerId: string) {
    this.selectedCustomerId = customerId;
    this.isActivateDeactivateModalVisible = true;
  }

  onActivateDeactivateChanged() {
    this.isActivateDeactivateModalVisible = false;
    this.list.get();
    this.toasterService.success('Customer activated/deactivated successfully');
  }

  onActivateDeactivateChangeCancel() {
    this.isActivateDeactivateModalVisible = false;
  }
}
