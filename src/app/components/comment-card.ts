import { Comment } from '@/models/comment';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-comment-card',
  imports: [NzCommentModule, NzIconModule, RelativeDatePipe, AsyncPipe, NgIcon],
  template: `
    @let comment = comment$ | async;
    @if (comment) {
      <div class="flex items-center gap-2">
        <div
          class="avatar avatar-placeholder cursor-pointer"
          role="button"
          tabindex="0"
        >
          <div class="bg-neutral text-neutral-content text-xs w-7 rounded-full">
            <span>{{ comment.author.username }}</span>
          </div>
        </div>
        <span class="text-sm">{{ comment.author.username }}</span>
        <span class="text-gray-500 text-xs">
          •
          {{ comment.createdAt | relativeDate }}
        </span>
      </div>
      <div class="py-3">
        {{ comment.content }}
      </div>
      <div class="flex gap-1">
        <button type="button" class="btn btn-sm btn-ghost font-normal">
          <ng-icon name="heroHeart" size="15" />
          0
        </button>
        <button type="button" class="btn btn-sm btn-ghost font-normal">
          <ng-icon name="heroChatBubbleOvalLeft" size="15" />
          Reply to
        </button>
      </div>
    }
  `,
})
export class CommentCard {
  readonly comment = input<Comment>();
  readonly comment$ = toObservable(this.comment);
}
