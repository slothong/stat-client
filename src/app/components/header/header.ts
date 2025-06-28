import { Component, computed, inject, input } from '@angular/core';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';
import clsx, { ClassValue } from 'clsx';
import { HlmDialogService } from '../ui/ui-dialog-helm/src';
import { AuthDialogContentComponent } from '../auth-dialog-content/auth-dialog-content';
import { Auth } from '@/services/auth';
import { Me } from '@/services/me';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  host: {
    '[class]': 'computedClass()',
  },
  imports: [HlmButtonDirective],
})
export class HeaderComponent {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => {
    return clsx('flex justify-between items-center', this.userClass());
  });

  private readonly auth = inject(Auth);

  protected readonly me = inject(Me).me;

  constructor(private readonly dialog: HlmDialogService) {}

  protected readonly isAuthenticated = inject(Auth).isAuthenticated;

  protected openLoginDialog() {
    this.dialog.open(AuthDialogContentComponent);
  }

  protected logout() {
    this.auth.logout();
  }
}
