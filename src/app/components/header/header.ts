import { Component, computed, input } from '@angular/core';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';
import clsx, { ClassValue } from 'clsx';
import { HlmDialogService } from '../ui/ui-dialog-helm/src';
import { AuthDialogContentComponent } from '../auth-dialog-content/auth-dialog-content';

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

  constructor(private readonly dialog: HlmDialogService) {}

  protected openLoginDialog() {
    this.dialog.open(AuthDialogContentComponent);
  }
}
