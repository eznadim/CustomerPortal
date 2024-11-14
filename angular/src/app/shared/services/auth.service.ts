import { Injectable } from '@angular/core';
import { CustomerService } from '../../proxy/customers/customer.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { CustomerLoginDto, CustomerTokenDto } from '../../proxy/customers/dtos/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private oAuthService: OAuthService // For admin login
  ) {}

  login(username: string, password: string, isCustomer: boolean) {
    if (isCustomer) {
      // Customer login
      const customerLoginDto: CustomerLoginDto = {
        email: username,
        password: password
      };
      return this.customerService.login(customerLoginDto);
    } else {
      // Admin login using ABP's built-in authentication
      return this.oAuthService.fetchTokenUsingPasswordFlow(username, password);
    }
  }

  getCustomerToken(): string | null {
    return localStorage.getItem('customer_token');
  }

  setCustomerToken(token: string): void {
    localStorage.setItem('customer_token', token);
  }

  removeCustomerToken(): void {
    localStorage.removeItem('customer_token');
  }

  logout() {
    if (this.isCustomerAuthenticated()) {
      // Handle customer logout
      this.removeCustomerToken();
      this.removeCustomerData();
    } else {
      // Handle admin logout using OAuth
      this.oAuthService.logOut();
    }
  }

  setCustomerData(data: Partial<CustomerTokenDto>): void {
    localStorage.setItem('customer_data', JSON.stringify(data));
  }

  getCustomerData(): Partial<CustomerTokenDto> | null {
    const data = localStorage.getItem('customer_data');
    return data ? JSON.parse(data) : null;
  }

  removeCustomerData(): void {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
  }

  isCustomerAuthenticated(): boolean {
    return !!this.getCustomerToken() && !!this.getCustomerData();
  }

  getCurrentCustomerId(): string | null {
    const customerData = this.getCustomerData();
    return customerData?.id || null;
  }
}