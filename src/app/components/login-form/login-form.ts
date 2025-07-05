import { AuthManager } from '@/services/auth-manager';
import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
})
export class LoginForm {
  readonly goToRegister = output();
  readonly loginSuccess = output();

  private readonly message = inject(NzMessageService);

  protected readonly formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/),
    ]),
  });

  private readonly auth = inject(AuthManager);

  onSubmit() {
    const email = this.formGroup.controls.email.value;
    const password = this.formGroup.controls.password.value;
    if (email == null || password == null) return;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.message.success('로그인에 성공했습니다.');
        this.loginSuccess.emit();
      },
      error: () => {
        this.message.error('로그인에 성공했습니다.');
      },
    });
  }
}
