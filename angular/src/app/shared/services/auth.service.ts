import { Injectable } from '@angular/core';
import { CustomerService } from '../../proxy/customers/customer.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { CustomerLoginDto } from '../../proxy/customers/dtos/models';

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

  logout() {
    // Handle both customer and admin logout
    this.oAuthService.logOut();
  }
}