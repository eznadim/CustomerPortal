import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SubscriptionService } from '@abp/ng.core';
//import { ChangePasswordService } from 'src/app/shared/services/change-password.service';

@Component({
  selector: 'refresh-password',
  templateUrl: './refresh-password.component.html',
  providers: [SubscriptionService],
})
export class RefreshPasswordComponent implements OnInit {
  form: UntypedFormGroup;
  //private readonly service: ChangePasswordService = inject(ChangePasswordService);
  protected readonly subscription = inject(SubscriptionService);
  //mapErrorsFn = this.service.MapErrorsFnFactory();

  ngOnInit(): void {
    //this.form = this.service.buildForm();
  }

  onSuccess() {
    //const sub = this.service.redirectToReturnUrl();
    //this.subscription.addOne(sub);
  }

  onSubmit() {
    if (this.form.invalid) return;

    // const sub = this.service.changePasswordAndLogin(this.form.value);
    // this.subscription.addOne(
    //   sub,
    //   () => this.onSuccess(),
    //   e => this.service.showErrorMessage(e),
    // );
  }
}
