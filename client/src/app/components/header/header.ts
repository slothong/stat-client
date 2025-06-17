import { Component, computed, input } from '@angular/core';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  host: {
    '[class]': 'computedClass()',
  },
  imports: [HlmButtonDirective],
})
export class HeaderComponent {
  public readonly userClass = input<string>('', { alias: 'class' });
  protected readonly computedClass = computed(() => {
    return this.userClass();
  });
}
