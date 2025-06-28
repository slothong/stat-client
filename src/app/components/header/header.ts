import { Component, computed, effect, inject, input } from '@angular/core';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';
import clsx, { ClassValue } from 'clsx';
import { HlmDialogService } from '../ui/ui-dialog-helm/src';
import { AuthDialogContent } from '../auth-dialog-content/auth-dialog-content';
import { Auth } from '@/services/auth';
import { Me } from '@/services/me';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  host: {
    '[class]': 'computedClass()',
  },
  imports: [HlmButtonDirective, RouterLink],
})
export class Header {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => {
    return clsx('flex justify-between items-center', this.userClass());
  });

  private readonly auth = inject(Auth);

  protected readonly me = inject(Me).user;

  constructor(private readonly dialog: HlmDialogService) {}

  protected readonly isAuthenticated = inject(Auth).isAuthenticated;

  protected openLoginDialog() {
    this.dialog.open(AuthDialogContent);
  }

  protected logout() {
    this.auth.logout();
  }

  protected goToPost() {}
}
