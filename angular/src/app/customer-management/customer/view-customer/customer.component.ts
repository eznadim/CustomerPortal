import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '@abp/ng.theme.shared';
import { CustomerService } from '../../../proxy/customers/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customer: any;
  customerToken: any;
  editForm: FormGroup;
  isEditModalVisible = false;
  isModalBusy = false;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    console.log(localStorage.getItem('customer_token'));
    this.loadCustomerDetails();
  }

  loadCustomerDetails() {
    // Implement loading customer details from your service
    this.customerService.getCurrentCustomer(this.customerToken.id).subscribe(
      (result) => {
        this.customer = result;
      }
    );
  }

  editProfile() {
    this.editForm = this.fb.group({
      name: [this.customer?.name, Validators.required],
      email: [this.customer?.email, [Validators.required, Validators.email]],
      phoneNumber: [this.customer?.phoneNumber, Validators.required]
    });
    this.isEditModalVisible = true;
  }

  saveProfile() {
    if (this.editForm.invalid) return;
    
    this.isModalBusy = true;
    const updateData = this.editForm.value;
    
    this.customerService.updateProfile(updateData).subscribe({
      next: () => {
        this.toasterService.success('Profile updated successfully');
        this.loadCustomerDetails();
        this.isEditModalVisible = false;
      },
      error: (error) => {
        this.toasterService.error('Failed to update profile');
        console.error(error);
      },
      complete: () => {
        this.isModalBusy = false;
      }
    });
  }

  changePassword() {
    // Implement password change logic
  }

  updateContactInfo() {
    // Implement contact info update logic
  }

  manageNotifications() {
    // Implement notifications management logic
  }

  deactivateAccount() {
    // Implement account deactivation logic with confirmation
  }
}
