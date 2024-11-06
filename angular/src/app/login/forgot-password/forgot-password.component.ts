import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
//import { CustomIdentityUserService } from '@proxy/custom-service/custom-identity-user.service';
import { SessionStateService } from '@abp/ng.core';
import { ConfirmationService } from '@abp/ng.theme.shared';
import { Router } from '@angular/router';
//import { RecaptchaService } from '@proxy/recaptcha';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'abp-forgot-password',
  templateUrl: 'forgot-password.component.html',
})
export class ForgotPasswordComponent {
  form: UntypedFormGroup;

  inProgress: boolean;

  isEmailSent = false;
  tenantId: any;
  recaptcha = false;
  recaptchaSiteKey = environment.googleRecaptcha.siteKey;

  constructor(
    private fb: UntypedFormBuilder,
    //private _customIdentityUserService: CustomIdentityUserService,
    private sessionState: SessionStateService,
    private _confirmation: ConfirmationService,
    private router: Router,
    //public _recaptchaService: RecaptchaService
    ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.getTenant();
  }

  onSubmit() {
    if(this.recaptcha){
      if (this.form.invalid) return;
      this.inProgress = true;
  
      this.tenantId = this.sessionState.getTenant().id;
      this.forgotPassword(this.tenantId);
    }
  }

  forgotPassword(tenantId){
    if(tenantId != null){
      // this._customIdentityUserService.forgotUserPasswordByTenantIdAndEmail(tenantId, this.form.get('email').value).subscribe(result => {
      //   if(result == 'Error'){
      //     this._confirmation.warn('', '::EmailNotFound',{hideCancelBtn: true,yesText: 'Close'}).subscribe(result => {
      //     if (result == 'confirm') {
      //       this.inProgress = false;
      //       this.router.navigateByUrl('/account/forgot-password');
      //     }
      // });
      //   }else{
      //     this.isEmailSent = true;
      //   }
      // });
    }else{
      // this._customIdentityUserService.forgotOfficerPasswordByEmail(this.form.get('email').value).subscribe(result => {
      //   if(result == 'Error'){
      //     this._confirmation.warn('', '::EmailNotFound',{hideCancelBtn: true,yesText: 'Close'}).subscribe(result => {
      //       if (result == 'confirm') {
      //         this.inProgress = false;
      //         this.router.navigateByUrl('/account/forgot-password');
      //       }
      //   });
      //   }
      //   else{
      //     this.isEmailSent = true;
      //   }
      // });
    }
  }

  getTenant(){
    this.tenantId = this.sessionState.getTenant().id;
  }

  resolveCaptcha(captchaResponse: string) {
    // this._recaptchaService.validateByEncodedResponse(captchaResponse).subscribe(e => {
    //     this.recaptcha = e;
    //   });
  }
}
