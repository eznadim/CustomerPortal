import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '@proxy/customers'; // Adjust import path as needed
import { UpdateCustomerDto } from '@proxy/customers/dtos'; // Adjust import path as needed

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @Input() customerId: string;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  editForm: FormGroup;
  isModalBusy = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {
    this.initForm();
  }

  private initForm() {
    this.editForm = this.fb.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.customerId) {
      this.loadCustomerData();
    }
  }

  private loadCustomerData() {
    this.customerService.getCurrentCustomer(this.customerId).subscribe(customer => {
      this.editForm.patchValue({
        customerName: customer.customerName,
        email: customer.email,
        address: customer.address
      });
    });
  }

  onSave() {
    if (this.editForm.valid) {
      this.isModalBusy = true;
      
      const updateDto: UpdateCustomerDto = {
        customerName: this.editForm.get('customerName').value,
        email: this.editForm.get('email').value,
        address: this.editForm.get('address').value,
      };

      this.customerService.updateProfile(updateDto).subscribe(
        () => {
          this.isModalBusy = false;
          this.save.emit();
        },
        error => {
          console.error('Error updating customer:', error);
          this.isModalBusy = false;
        }
      );
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get f() {
    return this.editForm.controls;
  }
}
