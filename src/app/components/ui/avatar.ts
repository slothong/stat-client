import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-avatar',
  imports: [NgIcon],
  template: `
    <div class="avatar avatar-placeholder cursor-pointer">
      <div class="bg-gray-300 text-gray-600 w-7 rounded-full">
        @let avatarUrlValue = avatarUrl();
        @if (avatarUrlValue) {
          <img
            [src]="avatarUrlValue"
            [style.width]="'100%'"
            [style.height]="'100%'"
            alt="avatar"
          />
        } @else {
          <ng-icon name="heroUser" size="20" />
        }
      </div>
    </div>
  `,
})
export class Avatar {
  readonly avatarUrl = input<string>();
}
