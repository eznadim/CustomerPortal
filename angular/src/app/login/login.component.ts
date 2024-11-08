import { AuthService, ConfigStateService } from '@abp/ng.core';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { AfterViewInit, Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { IdentityLinkUserService, LinkUserInput } from '@volo/abp.ng.account/public/proxy';
import { from, of, pipe, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

const { maxLength, required } = Validators;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [RecaptchaService],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('recaptcha', { static: false })
  recaptchaRef: ElementRef<HTMLDivElement>;
  
  @Input() isCustomer: boolean = false;

  form: UntypedFormGroup;

  inProgress: boolean;

  fieldTextType: boolean;

  isSelfRegistrationEnabled = true;

  authWrapperKey = eAccountComponents.AuthWrapper;

  linkUser: LinkUserInput;
  timeout = '';
  redirectUrl = '';

  protected fb: UntypedFormBuilder;
  protected toasterService: ToasterService;
  protected authService: AuthService;
  protected configState: ConfigStateService;
  protected route: ActivatedRoute;
  protected router: Router;
  protected identityLinkUserService: IdentityLinkUserService;
  protected recaptchaService: RecaptchaService;
  protected securityCodeService: SecurityCodeService;

  constructor(
    protected injector: Injector,
    private _confirmation: ConfirmationService) {
    this.fb = injector.get(UntypedFormBuilder);
    this.toasterService = injector.get(ToasterService);
    this.authService = injector.get(AuthService);
    this.configState = injector.get(ConfigStateService);
    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.identityLinkUserService = injector.get(IdentityLinkUserService);
    this.recaptchaService = injector.get(RecaptchaService);
    this.securityCodeService = injector.get(SecurityCodeService);
  }

  ngOnInit() {
    this.init();
    this.buildForm();
    this.setLinkUserParams();
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
    this.timeout = this.route.snapshot.queryParamMap.get('timeout');
  }

  ngAfterViewInit() {
    this.recaptchaService.setStrategy(
      RECAPTCHA_STRATEGY.Login(this.configState, this.recaptchaRef.nativeElement),
    );
  }

  protected setLinkUserParams() {
    const {
      linkUserId: userId,
      linkToken: token,
      linkTenantId: tenantId,
    } = this.route.snapshot.queryParams;

    if (userId && token) {
      this.identityLinkUserService.verifyLinkToken({ token, userId, tenantId }).subscribe(res => {
        if (res) {
          this.linkUser = { userId, token, tenantId };
        }
      });
    }
  }

  protected init() {
    this.isSelfRegistrationEnabled =
      (
        (this.configState.getSetting('Abp.Account.IsSelfRegistrationEnabled') as string) || ''
      ).toLowerCase() !== 'false';
  }

  protected buildForm() {
    this.form = this.fb.group({
      username: ['', [required, maxLength(255)]],
      password: ['', [required, maxLength(128)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.inProgress = true;

    const { username, password, rememberMe } = this.form.value;
    const redirectUrl = this.redirectUrl || (this.linkUser ? null : '/');
    const loginParams = { username, password, rememberMe, redirectUrl };
    this.authService
    .login(loginParams)
    .pipe(
      switchMap(() => {
        console.log('Login successful, redirecting...');
        // Navigate to the final redirect URL after successful login
        return this.router.navigate([redirectUrl], {
          queryParams: this.route.snapshot.queryParams,});
      }),
      this.handleLoginError(loginParams),
      this.linkUser ? this.switchToLinkUser() : tap(),
      finalize(() => (this.inProgress = false))
    )
    .subscribe();
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
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
}
}
