import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { CustomerService } from '../../proxy/customers/customer.service';
import { CreateCustomerDto, CustomerTokenDto } from '@proxy/customers/dtos/models';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html'
})
export class RegisterCustomerComponent {
  @Output() createRefund: EventEmitter<CreateCustomerDto> = new EventEmitter<CreateCustomerDto>();
  form: UntypedFormGroup;
  inProgress = false;

  customerCreate = {} as CreateCustomerDto;
  customerRegister = {} as CustomerTokenDto;
  customerId: any;
  loading: boolean;
  id: any;
  listTypeId: any;

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private _router: Router,
    private confirmation: ConfirmationService,
    private toasterService: ToasterService
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPassword: ['', [Validators.required, Validators.minLength(6)]],
      customerConfirmPassword: ['', Validators.required],
      customerName: ['', Validators.required],
      customerPhoneNumber: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: UntypedFormGroup) {
    return g.get('customerPassword').value === g.get('customerConfirmPassword').value
      ? null : { mismatch: true };
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) return;
    this.customerCreate.customerName = this.form.get('customerName').value;
    this.customerCreate.email = this.form.get('customerEmail').value;
    this.customerCreate.password = this.form.get('customerPassword').value;
    this.customerCreate.confirmPassword = this.form.get('customerConfirmPassword').value;
    this.inProgress = true;
    this.customerService.register(this.customerCreate)
      .subscribe((result)=>{
        this.customerId = result.customerId;
        this.createRefund.emit(this.customerCreate);
  
        this.confirmation.success(
          '::RegisterSuccessfully',
          '::SaveRecord',
          { hideCancelBtn: true, yesText: 'OK' }
        ).subscribe(()=>{
          this.inProgress = false;
          this._router.navigate(['/account/login']);
        });
      });

    
  }
}