import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isCustomerSource = new BehaviorSubject<boolean>(false);
  isCustomer$ = this.isCustomerSource.asObservable();

  setCustomerMode(isCustomer: boolean) {
    this.isCustomerSource.next(isCustomer);
  }
} 