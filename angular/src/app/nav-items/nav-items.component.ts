import { NavItemsService, NavItem } from '@abp/ng.theme.shared';
import { Component, TrackByFunction } from '@angular/core';
import { eThemeLeptonComponents } from '@volo/abp.ng.theme.lepton/lib/enums/components';
import { AuthService } from '@abp/ng.core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-items',
  templateUrl: './nav-items.component.html'
})
export class NavItemsComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout().subscribe(() => { this.navigateToLogin(); });
  }

  navigateToLogin() {
    this.authService.navigateToLogin();
  }
}
