import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmButtonDirective } from '@ui/button';
import { HlmErrorDirective, HlmFormFieldModule } from '@ui/form-field';
import { HlmInputModule } from '@ui/input';
import { toast } from 'ngx-sonner';
import { Auth } from '@/services/auth';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.html',
  imports: [
    HlmButtonDirective,
    HlmFormFieldModule,
    HlmInputModule,
    HlmErrorDirective,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class RegisterFormComponent {
  protected readonly formGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  readonly registrationSuccess = output();

  private readonly auth = inject(Auth);

  onSubmit() {
    const email = this.formGroup.controls.email.value;
    const password = this.formGroup.controls.password.value;
    if (email == null || password == null) return;

    this.auth.register(email, password).subscribe({
      next: () => {
        toast('회원 가입에 성공했습니다!');
        this.registrationSuccess.emit();
      },
      error: () => {
        toast('회원 가입에 실패했습니다.');
      },
    });
  }
}
