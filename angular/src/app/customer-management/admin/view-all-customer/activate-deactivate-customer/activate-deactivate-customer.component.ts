import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '@proxy/customers/customer.service';
import { CustomerDto } from '@proxy/customers/dtos/models';

@Component({
  selector: 'app-activate-deactivate-customer',
  templateUrl: './activate-deactivate-customer.component.html',
  styleUrl: './activate-deactivate-customer.component.scss'
})
export class ActivateDeactivateCustomerComponent {
  @Input() customerId: string;
  @Input() modalType: 'active/deactive' | 'delete' = 'active/deactive';
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  customerForm: FormGroup;
  isModalBusy = false;
  customerDetails: CustomerDto;

  constructor(
    private _customerService: CustomerService,
  ) {
  }

  ngOnInit() {
    if (this.customerId) {
      this._customerService.getCustomerById(this.customerId).subscribe(customer => {
        this.customerDetails = customer;
      });
    }
  }

  activateDeactivateCustomer() {
    if (this.modalType === 'active/deactive') {
      this.isModalBusy = true;
      this._customerService.activateDeactivateCustomer(this.customerId).subscribe(
        () => {
          this.isModalBusy = false;
          this.save.emit();
        },
        error => {
          console.error('Error activating/deactivating customer:', error);
          this.isModalBusy = false;
        }
      );
    }
  }

  deleteCustomer() {
    this.isModalBusy = true;
    this._customerService.deleteCustomer(this.customerId).subscribe(
      () => {
        this.isModalBusy = false;
        this.save.emit();
      },
      error => {
        console.error('Error deleting customer:', error);
        this.isModalBusy = false;
      }
    );
  }

  onCancel() {
    this.cancel.emit();
  }
}
