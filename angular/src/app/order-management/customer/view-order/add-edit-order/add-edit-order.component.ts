import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '@proxy/orders/order.service';
import { CreateUpdateOrderDto, OrderDto } from '@proxy/orders/dtos/models';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrl: './add-edit-order.component.scss'
})
export class AddEditOrderComponent {
  @Input() customerId: string;
  @Input() orderId: string;
  @Input() modalType: 'create' | 'cancel' = 'create';
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  orderForm: FormGroup;
  isModalBusy = false;
  orderDetails: OrderDto;

  constructor(
    private _orderService: OrderService,
    private fb: FormBuilder,
  ) {
    this.initForms();
  }

  private initForms() {
    this.orderForm = this.fb.group({
      description: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.modalType === 'cancel' && this.orderId) {
      this._orderService.get(this.orderId).subscribe(order => {
        this.orderDetails = order;
      });
    }
  }

  submit() {
    if (this.modalType === 'create' && this.orderForm.valid) {
      this.isModalBusy = true;
      const createOrderDto: CreateUpdateOrderDto = {
        description: this.orderForm.get('description').value,
        customerId: this.customerId,
      };

      this._orderService.create(createOrderDto).subscribe(
        () => {
          this.isModalBusy = false;
          this.save.emit();
        },
        error => {
          console.error('Error creating order:', error);
          this.isModalBusy = false;
        }
      );
    }
  }

  confirmCancel() {
    this.isModalBusy = true;
    this._orderService.cancelOrder(this.orderId).subscribe(
      () => {
        this.isModalBusy = false;
        this.save.emit();
      },
      error => {
        console.error('Error canceling order:', error);
        this.isModalBusy = false;
      }
    );
  }

  onCancel() {
    this.cancel.emit();
  }

  // Getters for form controls
  get f() {
    return this.orderForm.controls;
  }
}
