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
import { FormFieldError } from '@/components/ui/form-field-error';
import { zodValidator } from '@/utils/zod-validator';
import { NgIcon } from '@ng-icons/core';
import { FormField } from './ui/form-field';
import { ToastManager } from './ui/toast/toast-manager';

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
    ReactiveFormsModule,
    CommonModule,
    NgIcon,
    FormField,
    FormFieldError,
  ],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <div class="flex flex-col items-center gap-3 pb-5 w-sm">
        <h3 class="text-xl">회원가입</h3>
        <div class="flex flex-col gap-2 w-sm">
          <app-form-field>
            <label class="input validator box-border w-full">
              <ng-icon name="heroEnvelope" />
              <input placeholder="Email" formControlName="email" type="email" />
            </label>
            <app-form-field-error />
          </app-form-field>

          <app-form-field>
            <label class="input validator box-border w-full">
              <ng-icon name="heroUser" />
              <input
                placeholder="Username"
                formControlName="username"
                type="text"
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

          <app-form-field>
            <label class="input validator box-border w-full">
              <ng-icon name="heroKey" class="opacity-50" />
              <input
                name="confirmPassword"
                placeholder="Confirm Password"
                formControlName="confirmPassword"
                type="password"
              />
            </label>
            <app-form-field-error />
          </app-form-field>
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
        <button
          class="btn btn-primary btn-block"
          type="submit"
          [disabled]="!formGroup.valid"
        >
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
  private readonly toast = inject(ToastManager);

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
      this.toast.show('알 수 없는 에러');
      return;
    }

    this.auth
      .register$(email, username, password, new Date(birth), gender)
      .subscribe({
        next: () => {
          this.toast.show('회원 가입에 성공했습니다!');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toast.show('회원 가입에 실패했습니다.');
        },
      });
  }
}
