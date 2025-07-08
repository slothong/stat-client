import { LoginForm } from '@/components/login-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  host: {
    class: 'flex justify-center pt-20',
  },
  template: ` <app-login-form /> `,
})
export class LoginPage {}
