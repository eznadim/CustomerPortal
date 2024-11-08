import { Component, TrackByFunction } from '@angular/core';
import { NavItemsService, NavItem, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { AuthWrapperService } from '@volo/abp.ng.account.core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IdentityLinkUserService, LinkUserInput } from '@volo/abp.ng.account/public/proxy';
import { of, switchMap, tap, finalize, catchError, from, throwError, pipe} from 'rxjs';
import { AuthService, ConfigStateService } from '@abp/ng.core';
import {
    eAccountComponents,
    getRedirectUrl,
    RecaptchaService,
    RECAPTCHA_STRATEGY,
    SecurityCodeData,
    SecurityCodeService,
    PERIODICALLY_CHANGE_PASSWORD,
    REQUIRES_TWO_FACTOR,
    SHOULD_CHANGE_PASSWORD_ON_NEXT_LOGIN,
  } from '@volo/abp.ng.account/public';
  import { ActivatedRoute, Params, Router } from '@angular/router';
  

const { maxLength, required } = Validators;
@Component({
  selector: 'app-account-layout',
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.scss'],
  providers: [AuthWrapperService],
})
export class AccountLayoutComponent {

  trackByFn: TrackByFunction<NavItem> = (_, element) => element?.id;
  form: UntypedFormGroup;
  inProgress: boolean;
  redirectUrl = '';
  linkUser: LinkUserInput;
  fieldTextType: boolean;
  isCustomer: boolean = false;


  protected fb: UntypedFormBuilder;
  protected recaptchaService: RecaptchaService;
  protected authService: AuthService;
  protected securityCodeService: SecurityCodeService;
  protected router: Router;
  protected toasterService: ToasterService;
  protected identityLinkUserService: IdentityLinkUserService;
  protected route: ActivatedRoute;

  constructor(
    public authWrapperService: AuthWrapperService,
    public readonly navItems: NavItemsService,
    private _confirmation: ConfirmationService,
  ) { }

  protected buildForm() {
    this.form = this.fb.group({
      username: ['', [required, maxLength(255)]],
      password: ['', [required, maxLength(128)]],
      rememberMe: [false],
    });
  }

  onRoleChange() {
    console.log('Role changed:', this.isCustomer ? 'Customer' : 'Admin');
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.inProgress = true;

    const { username, password, rememberMe } = this.form.value;
    const redirectUrl = this.redirectUrl || (this.linkUser ? null : '/');
    const loginParams = { username, password, rememberMe, redirectUrl };

    (this.recaptchaService.isEnabled ? this.recaptchaService.validate() : of(true))
      .pipe(
        switchMap(isValid =>
          isValid
            ? this.authService
                .login(loginParams)
                .pipe(this.handleLoginError(loginParams))
                .pipe(this.linkUser ? this.switchToLinkUser() : tap())
            : of(null),
        ),
        finalize(() => (this.inProgress = false)),
      )
      .subscribe();
  }

  private handleLoginError(loginParams?: Omit<SecurityCodeData, 'twoFactorToken' | 'userId'>) {
    return catchError(err => {
      const errorDescription = err.error?.error_description;

      switch (errorDescription) {
        case REQUIRES_TWO_FACTOR:
          this.securityCodeService.data = {
            ...loginParams,
            twoFactorToken: err.error.twoFactorToken,
            userId: err.error.userId,
          };
          return from(this.router.navigate(['/account/send-security-code']));
        case PERIODICALLY_CHANGE_PASSWORD:
        case SHOULD_CHANGE_PASSWORD_ON_NEXT_LOGIN: {
          const queryParams = {
            token: err.error.changePasswordToken,
            redirectUrl: loginParams.redirectUrl,
            username: loginParams.username,
          };
          return from(
            this.router.navigate(['/account/change-password'], {
              queryParams,
            }),
          );
        }
        case "The user account has been locked out due to invalid login attempts. Please wait a while and try again.": {
          this._confirmation.warn('::LockedMessage', '',{hideCancelBtn: true,yesText: 'Close'}).subscribe(result => {
            if (result == 'confirm') {
              
              this.inProgress = false;
              this.router.navigateByUrl('/account/login');
            }
        });
        }
      }

      this.recaptchaService.reset();

      this.toasterService.error(
        err.error?.error_description ||
          err.error?.error?.message ||
          'AbpAccount::DefaultErrorMessage',
        null,
        { life: 7000 },
      );

      return throwError(err);

    });
  }

  private switchToLinkUser() {
    return pipe(
      switchMap(() => this.identityLinkUserService.link(this.linkUser)),
      tap(() => {
        this.router.navigate(['/account/link-logged'], {
          queryParams: this.route.snapshot.queryParams,
        });
      }),
    );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
}


}

