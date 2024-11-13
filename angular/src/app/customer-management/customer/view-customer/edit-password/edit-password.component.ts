import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '@proxy/customers';
import { UpdatePasswordDto } from '@proxy/customers/dtos';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent {
  @Input() customerId: string;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  passwordForm: FormGroup;
  isModalBusy = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {
    this.initForm();
  }

  private initForm() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'mismatch': true };
  }

  onSave() {
    if (this.passwordForm.valid) {
      this.isModalBusy = true;
      
      const updateDto: UpdatePasswordDto = {
        currentPassword: this.passwordForm.get('currentPassword').value,
        newPassword: this.passwordForm.get('newPassword').value
      };

      this.customerService.updateCustomerPasswordByIdAndInput(this.customerId,updateDto).subscribe(
        () => {
          this.isModalBusy = false;
          this.save.emit();
        },
        error => {
          console.error('Error updating password:', error);
          this.isModalBusy = false;
        }
      );
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get f() {
    return this.passwordForm.controls;
  }
}
