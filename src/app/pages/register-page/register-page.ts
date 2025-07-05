import { RegisterForm } from '@/components/register-form/register-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.html',
  imports: [RegisterForm],
  styleUrl: './register-page.scss',
})
export class RegisterPage {}
