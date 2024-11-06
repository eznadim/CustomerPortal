import { getPasswordValidators } from '@abp/ng.theme.shared';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
//import { CustomIdentityUserService } from '@proxy/custom-service/custom-identity-user.service';
import { ConfirmationService } from '@abp/ng.theme.shared';

@Component({
  selector: 'abp-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  form: UntypedFormGroup;

  fieldPassword: boolean;
  fieldConfirmPassword: boolean;
  inProgress = false;
  isPasswordReset = false;
  tenantId: any;
  userId: any;
  resetToken: any;
  password: any;
  confirmPassword: any;
  passwordPattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$"

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    //private _customIdentityUserService: CustomIdentityUserService,
    private _activatedRoute: ActivatedRoute,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(({ userId, resetToken }) => {
      if (!userId || !resetToken) this.router.navigateByUrl('/account/login');
    });

    this.tenantId = this._activatedRoute.snapshot.queryParams['_tenant'];
    this.userId = this._activatedRoute.snapshot.queryParams['userId'];
    this.resetToken = this._activatedRoute.snapshot.queryParams['resetToken'];
  }

  onSubmit() {
    this.inProgress = true;

    if (this.tenantId != null) {
      // this._customIdentityUserService
      //   .resetForgotPasswordByUserIdAndTenantIdAndTokenAndPassword(
      //     this.userId,
      //     this.tenantId,
      //     encodeURIComponent(this.resetToken),
      //     this.password
      //   )
      //   .pipe(finalize(() => (this.inProgress = false)))
      //   .subscribe(() => {
      //     this.isPasswordReset = true;
      //     this.confirmation
      //     .success('::YourPasswordIsSuccessfullyReset', '::ResetPassword', { hideCancelBtn: true, yesText: 'OK' })
      //     .subscribe(() => {
      //       this.router.navigateByUrl('/account/login');
      //     });
      //   });
    } else {
      // this._customIdentityUserService
      //   .resetForgotPasswordOfficerByUserIdAndTokenAndPassword(
      //     this.userId,
      //     encodeURIComponent(this.resetToken),
      //     this.password
      //   )
      //   .pipe(finalize(() => (this.inProgress = false)))
      //   .subscribe(() => {
      //     this.isPasswordReset = true;
      //     this.confirmation
      //     .success('::YourPasswordIsSuccessfullyReset', '::ResetPassword', { hideCancelBtn: true, yesText: 'OK' })
      //     .subscribe(() => {
      //       this.router.navigateByUrl('/account/login');
      //     });
      //   });
    }
  }
  toggleFieldPassword() {
    this.fieldPassword = !this.fieldPassword;
  }

  toggleFieldConfirmPassword() {
    this.fieldConfirmPassword = !this.fieldConfirmPassword;
  }
}
