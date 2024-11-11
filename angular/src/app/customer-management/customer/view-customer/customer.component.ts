import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@abp/ng.theme.shared';
import { CustomerService } from '../../../proxy/customers/customer.service';
import { CustomerDto } from '@proxy/customers/dtos';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  isEditModalVisible = false;
  customerData: any;
  customerDto = {} as CustomerDto;
  isPasswordModalVisible = false;

  constructor(
    private customerService: CustomerService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    const customerDataStr = localStorage.getItem('customer_data');
    if (customerDataStr) {
      this.customerData = JSON.parse(customerDataStr);
      this.loadCustomerDetails();
    } else {
      this.toasterService.error('Customer data not found');
    }
  }

  loadCustomerDetails() {
    if (!this.customerData?.id) {
      this.toasterService.error('Customer ID not found');
      return;
    }

    this.customerService.getCustomerById(this.customerData.id).subscribe({
      next: (result) => {
        this.customerDto = result;
      },
      error: (error) => {
        console.error('Error loading customer details:', error);
        this.toasterService.error('Failed to load customer details');
      }
    });
  }

  editProfile() {
    this.isEditModalVisible = true;
  }

  onProfileSaved() {
    this.isEditModalVisible = false;
    this.loadCustomerDetails();
    this.toasterService.success('Profile updated successfully');
  }

  onEditCancelled() {
    this.isEditModalVisible = false;
  }

  changePassword() {
    this.isPasswordModalVisible = true;
  }

  onPasswordChanged() {
    this.isPasswordModalVisible = false;
    this.toasterService.success('Password updated successfully');
  }

  onPasswordChangeCancel() {
    this.isPasswordModalVisible = false;
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
