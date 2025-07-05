import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
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
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '../ui/ui-select-helm/src';

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
    BrnSelectImports,
    HlmSelectImports,
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
      year: new FormControl(null, [Validators.required]),
      month: new FormControl(null, [Validators.required]),
    },
    {
      validators: passwordMatchValidator('password', 'confirmPassword'),
    }
  );

  readonly registrationSuccess = output();

  private readonly auth = inject(AuthManager);

  protected readonly yearOptions = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  protected readonly monthOptions = Array.from({ length: 12 }, (_, i) => i + 1); // 1~12

  getDateOptions(year: number, month: number): number[] {
    const lastDate = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜
    return Array.from({ length: lastDate }, (_, i) => i + 1);
  }

  onSubmit() {
    console.log(this.formGroup);
    // const email = this.formGroup.controls.email.value;
    // const password = this.formGroup.controls.password.value;
    // if (email == null || password == null) return;

    // this.auth.register(email, password).subscribe({
    //   next: () => {
    //     toast('회원 가입에 성공했습니다!');
    //     this.registrationSuccess.emit();
    //   },
    //   error: () => {
    //     toast('회원 가입에 실패했습니다.');
    //   },
    // });
  }
}
