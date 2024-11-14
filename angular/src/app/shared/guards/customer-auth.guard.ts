import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToasterService } from '@abp/ng.theme.shared';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private toasterService: ToasterService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('customer_token');
    
    if (!token) {
      this.toasterService.error('Please login to access this page');
      this.router.navigate(['/account/login']);
      return false;
    }
    
    return true;
  }
} 