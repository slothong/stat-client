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
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@spartan-ng/brain/forms';
import { HlmButtonDirective } from '@ui/button';
import { HlmFormFieldModule } from '@ui/form-field';
import { HlmInputModule } from '@ui/input';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.html',
  imports: [
    HlmButtonDirective,
    HlmFormFieldModule,
    HlmInputModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class LoginForm {
  readonly goToRegister = output();
  readonly loginSuccess = output();

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
        toast('로그인에 성공했습니다.');
        this.loginSuccess.emit();
      },
      error: () => {
        toast('로그인에 실패했습니다.');
      },
    });
  }
}
