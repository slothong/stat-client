import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmButtonDirective } from '@ui/button';
import { HlmFormFieldModule } from '@ui/form-field';
import { HlmInputModule } from '@ui/input';

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

  protected readonly formGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    console.log('submit');
  }
}
