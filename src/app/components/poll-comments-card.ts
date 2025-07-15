import { CommentQueries } from '@/services/comment-queries';
import { getRelativeDateText } from '@/utils/date';
import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { ReplaySubject, switchMap } from 'rxjs';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommentCard } from './comment-card';

@Component({
  selector: 'app-poll-comments-card',
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    AsyncPipe,
    NzCommentModule,
    NzAvatarModule,
    NzIconModule,
    NzToolTipModule,
    CommentCard,
  ],
  template: `
    @let comments = (commentsResult$ | async)?.data;
    @if (comments) {
      <div class="flex flex-col">
        <form
          class="flex flex-col gap-2 h-[100px]"
          nz-form
          [formGroup]="formGroup"
          (ngSubmit)="submitComment()"
        >
          <nz-form-control>
            <textarea nz-input formControlName="content"></textarea>
          </nz-form-control>
          <div class="flex justify-end">
            <button
              nz-button
              nzType="primary"
              type="submit"
              [disabled]="!formGroup.valid"
            >
              작성
            </button>
          </div>
        </form>
        <div class="flex flex-col gap-3">
          @for (comment of comments; track comment.id) {
            <app-comment-card [comment]="comment" />
          }
        </div>
      </div>
    }
  `,
})
export class PollCommentsCard {
  @Input()
  set pollId(value: string | null) {
    if (value) {
      this.pollId$.next(value);
    }
  }

  readonly formGroup = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  readonly pollId$ = new ReplaySubject<string>(1);

  private readonly commentQueries = inject(CommentQueries);

  protected readonly commentsResult$ = this.pollId$.pipe(
    switchMap((pollId) => this.commentQueries.getComments(pollId).result$),
  );

  protected submitComment() {
    const { content } = this.formGroup.value;
    if (!content) return;
    this.pollId$.subscribe((pollId) => {
      this.commentQueries.postComment(pollId).mutate(content);
      this.formGroup.reset();
    });
  }

  protected getDateText(date: Date) {
    return getRelativeDateText(date);
  }
}
