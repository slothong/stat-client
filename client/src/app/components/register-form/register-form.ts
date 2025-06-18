import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmButtonDirective } from '@ui/button';
import { HlmErrorDirective, HlmFormFieldModule } from '@ui/form-field';
import { HlmInputModule } from '@ui/input';

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

  onSubmit() {
    console.log('submit');
  }
}
