import { z } from 'zod';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { zodValidator } from '@/utils/zod-validator';
import { AuthManager } from '@/services/auth-manager';
import { NgIcon } from '@ng-icons/core';
import { FormField } from './ui/form-field';
import { FormFieldError } from './ui/form-field-error';

const loginFormSchema = {
  email: z
    .string()
    .nonempty('이메일을 입력하세요')
    .email('유효하지 않은 이메일'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(16, { message: 'Password must be at most 16 characters.' })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).*$/,
      {
        message:
          'Password must include letters, numbers, and special characters.',
      },
    )
    .regex(/^\S*$/, {
      message: 'Password must not contain spaces.',
    }),
};

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIcon,
    RouterLink,
    FormField,
    FormFieldError,
  ],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <div class="flex flex-col items-center pb-5">
        <h3 class="text-xl">로그인</h3>
        <div class="flex flex-col gap-2 w-sm">
          <app-form-field>
            <label class="input validator box-border w-full">
              <ng-icon name="heroEnvelope" class="opacity-50" />
              <input
                class="rounded-none"
                placeholder="Email"
                formControlName="email"
                type="email"
              />
            </label>
            <app-form-field-error />
          </app-form-field>
          <app-form-field>
            <label class="input validator box-border w-full">
              <ng-icon name="heroKey" class="opacity-50" />
              <input
                name="password"
                placeholder="Password"
                formControlName="password"
                type="password"
              />
            </label>
            <app-form-field-error />
          </app-form-field>
          <div class="flex flex-col">
            <button
              type="submit"
              class="btn btn-primary btn-block"
              [disabled]="!formGroup.valid"
            >
              로그인
            </button>
            <button class="btn btn-ghost btn-block" routerLink="/register">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class LoginForm {
  private readonly router = inject(Router);
  protected readonly hidePassword = signal(true);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly formGroup = new FormGroup(
    {
      email: new FormControl(''),
      password: new FormControl(''),
    },
    {
      validators: zodValidator(z.object(loginFormSchema)),
    },
  );

  private readonly auth = inject(AuthManager);

  onSubmit() {
    const email = this.formGroup.controls.email.value;
    const password = this.formGroup.controls.password.value;
    if (email == null || password == null) return;

    this.auth.login$(email, password).subscribe({
      next: () => {
        this.snackBar.open('로그인에 성공했습니다.');
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBar.open('로그인에 실패했습니다.');
      },
    });
  }
}
