import { Component, computed, signal } from '@angular/core';
import {
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '../ui/ui-dialog-helm/src';
import { LoginFormComponent } from '../login-form/login-form';
import { RegisterFormComponent } from '../register-form/register-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-dialog-content',
  templateUrl: './auth-dialog-content.html',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    CommonModule,
    LoginFormComponent,
    RegisterFormComponent,
  ],
})
export class AuthDialogContentComponent {
  readonly mode = signal<'login' | 'register'>('login');

  protected readonly title = computed(() =>
    this.mode() === 'login' ? 'Login' : 'Register'
  );
}
