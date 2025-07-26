import { RegisterForm } from '@/components/register-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register-page',
  imports: [RegisterForm],
  template: ` <app-register-form /> `,
})
export class RegisterPage {}
