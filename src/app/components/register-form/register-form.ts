import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HlmButtonDirective } from '@ui/button';
import { HlmErrorDirective, HlmFormFieldModule } from '@ui/form-field';
import { HlmInputModule } from '@ui/input';
import { toast } from 'ngx-sonner';
import { AuthManager } from '@/services/auth-manager';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@spartan-ng/brain/forms';

function passwordMatchValidator(
  passwordKey: string,
  confirmPasswordKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirmPassword = group.get(confirmPasswordKey)?.value;

    if (password !== confirmPassword) {
      group.get(confirmPasswordKey)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.html',
  imports: [
    HlmButtonDirective,
    HlmFormFieldModule,
    HlmInputModule,
    HlmErrorDirective,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class RegisterForm {
  protected readonly formGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/),
      ]),
      confirmPassword: new FormControl(''),
    },
    {
      validators: passwordMatchValidator('password', 'confirmPassword'),
    }
  );

  readonly registrationSuccess = output();

  private readonly auth = inject(AuthManager);

  onSubmit() {
    const email = this.formGroup.controls.email.value;
    const password = this.formGroup.controls.password.value;
    if (email == null || password == null) return;

    this.auth.register(email, password).subscribe({
      next: () => {
        toast('회원 가입에 성공했습니다!');
        this.registrationSuccess.emit();
      },
      error: () => {
        toast('회원 가입에 실패했습니다.');
      },
    });
  }
}
