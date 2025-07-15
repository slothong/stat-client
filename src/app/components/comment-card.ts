import { Comment } from '@/models/comment';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-comment-card',
  imports: [NzCommentModule, NzIconModule, RelativeDatePipe, AsyncPipe],
  template: `
    @let comment = comment$ | async;
    @if (comment) {
      <nz-comment
        [nzAuthor]="comment.author.username"
        [nzDatetime]="comment.createdAt | relativeDate"
      >
        <nz-avatar nz-comment-avatar nzIcon="user"></nz-avatar>
        <nz-comment-content>
          <p>
            {{ comment.content }}
          </p>
        </nz-comment-content>
        <nz-comment-action>
          <nz-icon nz-tooltip nzTooltipTitle="Like" nzType="like" />
          <span class="ms-1">0</span>
        </nz-comment-action>
        <nz-comment-action>
          <nz-icon nz-tooltip nzTooltipTitle="Dislike" nzType="dislike" />
          <span class="ms-1">0</span>
        </nz-comment-action>
        <nz-comment-action>Reply to</nz-comment-action>
      </nz-comment>
    }
  `,
})
export class CommentCard {
  readonly comment = input<Comment>();
  readonly comment$ = toObservable(this.comment);
}
