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
import { NgIcon } from '@ng-icons/core';
import { FormField } from './ui/form-field';

const registerFormSchema = z
  .object({
    email: z
      .string()
      .nonempty('이메일을 입력하세요')
      .email('유효하지 않은 이메일'),
    username: z.string().nonempty('닉네임을 입력하세요'),
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
    // birth: z.date(),
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
    ReactiveFormsModule,
    CommonModule,
    NgIcon,
    FormField,
    ZodError,
  ],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="w-xs">
      <div class="flex flex-col items-center gap-3 px-5 pb-5">
        <h3 class="text-xl">회원가입</h3>
        <div class="w-full">
          <app-form-field>
            <label class="input validator box-border w-full">
              <ng-icon name="heroEnvelope" />
              <input placeholder="Email" formControlName="email" type="email" />
            </label>
            <app-zod-error />
          </app-form-field>
        </div>

        <div class="w-full">
          <app-form-field>
            <label class="input validator box-border w-full">
              <input
                placeholder="Username"
                formControlName="username"
                type="text"
              />
            </label>
            <app-zod-error />
          </app-form-field>
        </div>
        <div class="w-full">
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
            <app-zod-error />
          </app-form-field>
        </div>
        <div class="w-full">
          <label class="input validator box-border w-full">
            <ng-icon name="heroKey" class="opacity-50" />
            <input
              name="confirmPassword"
              placeholder="Confirm Password"
              formControlName="confirmPassword"
              type="password"
            />
          </label>
        </div>
        <input
          class="input w-full box-border"
          type="date"
          [min]="minDate"
          [max]="maxDate"
          formControlName="birth"
        />
        <div class="text-sm w-full">Gender</div>
        <div class="w-full flex gap-5 text-gray-600">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="radio"
              formControlName="gender"
              name="gender"
              value="male"
              class="radio radio-xs"
            />
            Male
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              type="radio"
              formControlName="gender"
              value="female"
              name="gender"
              class="radio radio-xs"
            />
            Female
          </label>
        </div>
      </div>
      <div class="flex flex-col w-full px-5 gap-1 pb-3">
        <button matButton="filled" type="submit" [disabled]="!formGroup.valid">
          회원가입
        </button>
      </div>
    </form>
  `,
})
export class RegisterForm {
  protected readonly formGroup = new FormGroup(
    {
      email: new FormControl(''),
      password: new FormControl(''),
      username: new FormControl(''),
      confirmPassword: new FormControl(''),
      birth: new FormControl('', [Validators.required]),
      gender: new FormControl('male', [Validators.required]),
    },
    {
      validators: zodValidator(registerFormSchema),
    },
  );

  protected readonly hidePassword = signal(true);

  protected readonly minDate = '1900-01-01';
  protected readonly maxDate = new Date().toISOString().split('T')[0];

  private readonly auth = inject(AuthManager);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  onSubmit() {
    const email = this.formGroup.controls.email.value;
    const username = this.formGroup.controls.username.value;
    const password = this.formGroup.controls.password.value;
    const birth = this.formGroup.controls.birth.value;
    const gender = this.formGroup.controls.gender.value;
    if (
      email == null ||
      password == null ||
      birth == null ||
      gender == null ||
      username == null
    ) {
      this.snackBar.open('알 수 없는 에러');
      return;
    }

    this.auth
      .register$(email, username, password, new Date(birth), gender)
      .subscribe({
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
