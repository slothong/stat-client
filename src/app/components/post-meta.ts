import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-post-meta',
  imports: [RelativeDatePipe],
  template: `
    <div class="flex items-center gap-2">
      <div
        class="avatar avatar-placeholder cursor-pointer"
        role="button"
        tabindex="0"
      >
        <div class="bg-neutral text-neutral-content text-xs w-7 rounded-full">
          <span>SY</span>
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
}
