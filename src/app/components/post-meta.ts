import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-post-meta',
  imports: [RelativeDatePipe, NgIcon],
  template: `
    <div class="flex items-center gap-2">
      <div
        class="avatar avatar-placeholder cursor-pointer"
        role="button"
        tabindex="0"
      >
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
      <div>
        <span class="text-sm">
          <ng-content></ng-content>
        </span>
        <span class="text-gray-500 text-xs">
          •
          {{ createdAt() | relativeDate }}
        </span>
      </div>
    </div>
  `,
})
export class PostMeta {
  readonly createdAt = input<Date>();
  readonly avatarUrl = input<string>();
}
