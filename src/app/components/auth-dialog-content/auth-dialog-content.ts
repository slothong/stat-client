import { Component, computed, inject, signal } from '@angular/core';
import { HlmDialogHeaderComponent, HlmDialogTitleDirective } from '@ui/dialog';
import { LoginFormComponent } from '../login-form/login-form';
import { RegisterFormComponent } from '../register-form/register-form';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

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

  private readonly dialogRef = inject(BrnDialogRef);

  protected readonly title = computed(() =>
    this.mode() === 'login' ? 'Login' : 'Register'
  );

  protected closeDialog() {
    this.dialogRef.close();
  }
}
