import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService, OrderStatus } from '@proxy/orders';
import { OrderDto, UpdateOrderStatusDto } from '@proxy/orders/dtos';

@Component({
  selector: 'app-update-status-order',
  templateUrl: './update-status-order.component.html',
  styleUrl: './update-status-order.component.scss'
})
export class UpdateStatusOrderComponent {
  @Input() orderId: string;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  customerForm: FormGroup;
  isModalBusy = false;
  orderDetails: OrderDto;
  orderUpdateStatus: UpdateOrderStatusDto;
  statusToChange: any;
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
    private _orderService: OrderService,
  ) {
  }

  ngOnInit() {
    if (this.orderId) {
      this._orderService.get(this.orderId).subscribe(order => {
        this.orderDetails = order;
      });
    }
  }

  updateStatusOrder() {
    if (this.statusToChange === undefined) {
      return; // Add validation if needed
    }

    this.isModalBusy = true;
    
    const updateStatusDto: UpdateOrderStatusDto = {
      status: this.statusToChange 
    };

    this._orderService.updateStatus(this.orderId, updateStatusDto).subscribe(
      () => {
        this.isModalBusy = false;
        this.save.emit();
      },
      error => {
        console.error('Error updating status order:', error);
        this.isModalBusy = false;
      }
    );
  }

  onCancel() {
    this.cancel.emit();
  }
}

