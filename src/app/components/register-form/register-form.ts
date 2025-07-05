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
import { AuthManager } from '@/services/auth-manager';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Router } from '@angular/router';

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
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzRadioModule,
    ReactiveFormsModule,
    CommonModule,
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
      birth: new FormControl<Date | null>(null, [Validators.required]),
      gender: new FormControl('male', [Validators.required]),
    },
    {
      validators: passwordMatchValidator('password', 'confirmPassword'),
    }
  );

  private readonly message = inject(NzMessageService);
  private readonly auth = inject(AuthManager);
  private readonly router = inject(Router);

  protected readonly disabledDate = (date: Date) => {
    return date.getTime() >= new Date().getTime();
  };

  onSubmit() {
    const email = this.formGroup.controls.email.value;
    const password = this.formGroup.controls.password.value;
    const birth = this.formGroup.controls.birth.value;
    const gender = this.formGroup.controls.gender.value;
    if (email == null || password == null || birth == null || gender == null) {
      this.message.error('알 수 없는 에러');
      return;
    }

    this.auth.register(email, password, birth, gender).subscribe({
      next: () => {
        this.message.success('회원 가입에 성공했습니다!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.message.error('회원 가입에 실패했습니다.');
      },
    });
  }
}
