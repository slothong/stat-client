import { Comment } from '@/models/comment';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgIcon } from '@ng-icons/core';
import { Avatar } from './ui/avatar';

@Component({
  selector: 'app-comment-card',
  imports: [RelativeDatePipe, AsyncPipe, NgIcon, Avatar],
  template: `
    @let comment = comment$ | async;
    @if (comment) {
      <div class="flex items-center gap-2">
        <app-avatar [avatarUrl]="comment.author.avatarUrl" size="sm" />
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
