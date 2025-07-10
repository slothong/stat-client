import { z } from 'zod';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ZodError } from '@/components/zod-error';
import { HasErrorRoot } from '@/directives/has-error-root';
import { zodValidator } from '@/utils/zod-validator';
import { AuthManager } from '@/services/auth-manager';

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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    ZodError,
    CommonModule,
    RouterLink,
    HasErrorRoot,
    MatCardModule,
    MatIconModule,
  ],
  host: {
    class: 'block w-fit',
  },
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="w-lg">
      <mat-card appearance="outlined">
        <mat-card-content>
          <div class="flex flex-col items-center gap-3 px-5 pb-5">
            <div>
              <h3 class="text-xl">로그인</h3>
            </div>
            <mat-form-field class="w-full">
              <mat-label>이메일</mat-label>
              <input
                matInput
                placeholder="Email"
                formControlName="email"
                type="email"
              />
              <mat-error zod-error />
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>비밀번호</mat-label>
              <input
                matInput
                placeholder="Password"
                formControlName="password"
                [type]="hidePassword() ? 'password' : 'text'"
              />
              <button
                type="button"
                matIconButton
                matSuffix
                (click)="hidePassword.set(!hidePassword())"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword()"
              >
                <mat-icon>{{
                  hidePassword() ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
              <mat-error zod-error />
            </mat-form-field>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <div class="flex flex-col w-full px-5 gap-1 pb-3">
            <button
              matButton="filled"
              type="submit"
              [disabled]="!formGroup.valid"
            >
              로그인
            </button>
            <button matButton routerLink="/register">회원가입</button>
          </div>
        </mat-card-actions>
      </mat-card>
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
