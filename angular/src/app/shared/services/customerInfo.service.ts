import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerInfoService {
    private customerSubject = new BehaviorSubject<any>(null);
    public customer$ = this.customerSubject.asObservable();

    constructor() {
        // Check localStorage on service initialization
        const storedCustomer = localStorage.getItem('currentCustomer');
        if (storedCustomer) {
            this.customerSubject.next(JSON.parse(storedCustomer));
        }
    }

    setCustomer(customer: any) {
        // Store in localStorage and update BehaviorSubject
        localStorage.setItem('currentCustomerId', JSON.stringify(customer));
        this.customerSubject.next(customer);
    }

    getCustomer(): Observable<any> {
        return this.customer$;
    }

    getCurrentCustomerValue() {
        return this.customerSubject.value;
    }

    clearCustomer() {
        // Clear from localStorage and reset BehaviorSubject
        localStorage.removeItem('currentCustomer');
        this.customerSubject.next(null);
    }
} 