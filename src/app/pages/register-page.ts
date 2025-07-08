import { RegisterForm } from '@/components/register-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register-page',
  imports: [RegisterForm],
  host: {
    class: 'flex justify-center pt-20',
  },
  template: ` <app-register-form /> `,
})
export class RegisterPage {}
