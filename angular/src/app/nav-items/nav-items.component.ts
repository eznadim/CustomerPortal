import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-nav-items',
  templateUrl: './nav-items.component.html',
  styleUrls: ['./nav-items.component.scss']
})
export class NavItemsComponent implements OnInit {
  isAdmin: boolean = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if(this.authService.getCustomerData() != null){
      console.log(this.currentUser)
      this.currentUser = this.authService.getCustomerData();
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.authService.removeCustomerData();
    this.router.navigate(['/account/login']);
  }

  get userName(): string {
    return this.currentUser?.name || 'User';
  }
}
