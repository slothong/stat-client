import { LoginForm } from '@/components/login-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  template: ` <app-login-form /> `,
})
export class LoginPage {}
