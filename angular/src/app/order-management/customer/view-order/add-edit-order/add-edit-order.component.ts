import { ListService, PermissionService } from '@abp/ng.core';
import { ConfirmationService } from '@abp/ng.theme.shared';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@proxy/orders/order.service';
import { CreateUpdateOrderDto } from '@proxy/orders/dtos/models';
import { CustomerInfoService } from 'src/app/shared/services/customerInfo.service';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrl: './add-edit-order.component.scss'
})
export class AddEditOrderComponent {

  id: any;
  isViewMode: boolean;
  orderNo: string;
  description: string;
  ;
  createUpdateOrder = {} as CreateUpdateOrderDto;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private location: Location,
    private confirmation: ConfirmationService,
    private router: Router,
    private _orderService: OrderService,
    private customerInfoService: CustomerInfoService
  ) { }

  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.queryParams['id'];

    if(this.id){
      this.getViewDetail();
     

      if(this._activatedRoute.snapshot.queryParams['action'] == 'view'){
        this.isViewMode = true;
        
      } else {
        this.isViewMode = false;
      }
      
    }
  }

  getCustomerId(){
    return this.customerInfoService.getCurrentCustomerValue();
  }

  getViewDetail(){
    if(this.id){
      this._orderService.get(this.id).subscribe(result => {
        this.orderNo = result.orderNumber;
        this.description = result.description;
      })
    }
  }

  submit(){
    this.confirmation.warn('::AddOrderAreYouSure', '::AddOrder').subscribe((result) => {
      if (result == "confirm") {
        this.createUpdateOrder.description = this.description;
        this.createUpdateOrder.customerId = this.getCustomerId();
        this._orderService.create(this.createUpdateOrder).subscribe(() => {
          this.confirmation.success("::SuccessfullySaved", "::AddOrder", {
            hideCancelBtn: true,
            yesText: 'OK'
          });

          this.router.navigate(['/order-management/customer/view-order'])
        })
      }
    })
    
   
  }

  update(){
    //should cancel
  }
  
  back(){
    this.location.back();
  }
}
