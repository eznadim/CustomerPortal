import { Component, OnInit } from '@angular/core';
import { RoutesService, ABP, eLayoutType, ReplaceableComponentsService } from '@abp/ng.core';
import { OAuthService } from 'angular-oauth2-oidc';
import { LoginComponent } from './login/login.component';
import { AccountLayoutComponent } from './login/account-layout/account-layout.component';
import { eThemeSharedRouteNames } from '@abp/ng.theme.shared';
import { eAccountComponents, ForgotPasswordComponent, RefreshPasswordComponent, ResetPasswordComponent } from '@volo/abp.ng.account/public';
import { eThemeLeptonComponents } from '@volo/abp.ng.theme.lepton';
import { NavItemsComponent } from './nav-items/nav-items.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  get hasLoggedIn(): boolean {
    return this._authService.hasValidAccessToken();
  }

  constructor(
    private replaceableComponents: ReplaceableComponentsService,
    private _authService: OAuthService,
    private routes: RoutesService
  ){
    this.patchHomeRoute();
    this.routes.patch(eThemeSharedRouteNames.Administration, { invisible: true });
  }

  ngOnInit() {
      this.replaceableComponents.add({
        component: LoginComponent,
        key: eAccountComponents.Login
      });
      this.replaceableComponents.add({
        component: AccountLayoutComponent,
        key: eThemeLeptonComponents.AccountLayout,
        });
        this.replaceableComponents.add({
          component: ForgotPasswordComponent,
          key: eAccountComponents.ForgotPassword
        });
        this.replaceableComponents.add({
          component: ResetPasswordComponent,
          key: eAccountComponents.ResetPassword
        });
        this.replaceableComponents.add({
          component: RefreshPasswordComponent,
          key: eAccountComponents.RefreshPassword
        });
        this.replaceableComponents.add({
          component: NavItemsComponent,
          key: eThemeLeptonComponents.NavItems,
        });
  }

  patchHomeRoute() {

    if(!this.hasLoggedIn){
      const newHomeRouteConfig: Partial<ABP.Route> = {
        layout: eLayoutType.empty,
        path: '/account/login',
      };

      this.routes.patch('::Menu:Dashboard', newHomeRouteConfig);
    }
    else(this.hasLoggedIn)
    {
      const newHomeRouteConfig: Partial<ABP.Route> = {
        layout: eLayoutType.application,
        path: '/dashboard/admin',
      };

      this.routes.patch('::Menu:Dashboard', newHomeRouteConfig);
    }
  }

}
