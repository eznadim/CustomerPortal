import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token based on the URL or user type
    const customerToken = localStorage.getItem('customer_token');
    
    if (customerToken && request.url.includes('/api/app/customer')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${customerToken}`
        }
      });
    }

    return next.handle(request);
  }
} 