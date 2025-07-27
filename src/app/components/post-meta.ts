import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { Component, input } from '@angular/core';
import { Avatar } from './ui/avatar';

@Component({
  selector: 'app-post-meta',
  imports: [RelativeDatePipe, Avatar],
  template: `
    <div class="flex items-center gap-2">
      <app-avatar [avatarUrl]="avatarUrl()" size="sm" />
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
