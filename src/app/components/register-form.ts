import z from 'zod';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthManager } from '@/services/auth-manager';
import { Router } from '@angular/router';
import { ZodError } from '@/components/zod-error';
import { HasErrorRoot } from '@/directives/has-error-root';
import { zodValidator } from '@/utils/zod-validator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';

const registerFormSchema = z
  .object({
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
    confirmPassword: z.string(),
    birth: z.date(),
    gender: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

@Component({
  selector: 'app-register-form',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRadioModule,
    ZodError,
    HasErrorRoot,
    ReactiveFormsModule,
    CommonModule,
  ],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="w-lg">
      <mat-card appearance="outlined">
        <mat-card-content>
          <div class="flex flex-col items-center gap-3 px-5 pb-5">
            <div>
              <h3 class="text-xl">회원가입</h3>
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
                tabindex="-1"
                (click)="hidePassword.set(!hidePassword())"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword()"
              >
                <mat-icon>
                  {{ hidePassword() ? 'visibility_off' : 'visibility' }}
                </mat-icon>
              </button>
              <mat-error zod-error />
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>비밀번호 확인</mat-label>
              <input
                matInput
                placeholder="Confirm Password"
                formControlName="confirmPassword"
                [type]="hidePassword() ? 'password' : 'text'"
              />
              <mat-error zod-error />
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label>생년월일</mat-label>
              <input
                matInput
                [matDatepicker]="picker"
                [min]="minDate"
                [max]="maxDate"
                formControlName="birth"
              />
              <mat-hint>MM/DD/YYYY</mat-hint>
              <mat-datepicker-toggle
                matIconSuffix
                [for]="picker"
              ></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error zod-error />
            </mat-form-field>
            <div class="w-full flex flex-col">
              <label id="gender-label">성별</label>
              <mat-radio-group
                formControlName="gender"
                aria-labelledby="gender-label"
              >
                <mat-radio-button value="male">Male</mat-radio-button>
                <mat-radio-button value="female">Female</mat-radio-button>
              </mat-radio-group>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <div class="flex flex-col w-full px-5 gap-1 pb-3">
            <button
              matButton="filled"
              type="submit"
              [disabled]="!formGroup.valid"
            >
              회원가입
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </form>
  `,
})
export class RegisterForm {
  protected readonly formGroup = new FormGroup(
    {
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      birth: new FormControl<Date | null>(null, [Validators.required]),
      gender: new FormControl('male', [Validators.required]),
    },
    {
      validators: zodValidator(registerFormSchema),
    },
  );

  protected readonly hidePassword = signal(true);

  protected readonly minDate = new Date(1900, 0, 1);
  protected readonly maxDate = new Date();

  private readonly auth = inject(AuthManager);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  onSubmit() {
    const email = this.formGroup.controls.email.value;
    const password = this.formGroup.controls.password.value;
    const birth = this.formGroup.controls.birth.value;
    const gender = this.formGroup.controls.gender.value;
    if (email == null || password == null || birth == null || gender == null) {
      this.snackBar.open('알 수 없는 에러');
      return;
    }

    this.auth.register$(email, password, birth, gender).subscribe({
      next: () => {
        this.snackBar.open('회원 가입에 성공했습니다!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.snackBar.open('회원 가입에 실패했습니다.');
      },
    });
  }
}
