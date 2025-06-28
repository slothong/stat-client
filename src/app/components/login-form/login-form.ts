import { Auth } from '@/services/auth';
import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  ],
})
export class LoginFormComponent {
  readonly goToRegister = output();
  readonly loginSuccess = output();

  protected readonly formGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  private readonly auth = inject(Auth);

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
