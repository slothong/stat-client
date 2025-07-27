import { cn } from '@/utils/cn';
import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgIcon } from '@ng-icons/core';
import { cva } from 'class-variance-authority';
import { map } from 'rxjs';

const avatarSize = cva('bg-gray-300 text-gray-600 rounded-full', {
  variants: {
    size: { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-15 h-15' },
  },
});

@Component({
  selector: 'app-avatar',
  imports: [NgIcon, AsyncPipe],
  template: `
    <div class="avatar avatar-placeholder cursor-pointer">
      <div [class]="sizeClass$ | async">
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
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  private readonly size$ = toObservable(this.size);
  protected readonly sizeClass$ = this.size$.pipe(
    map((size) => cn(avatarSize({ size }))),
  );
}
