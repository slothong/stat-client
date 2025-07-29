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
import { ReplaySubject, switchMap, take } from 'rxjs';
import { CommentCard } from './comment-card';
import { injectQueryClient } from '@ngneat/query';
import { PollQueries } from '@/services/poll-queries';
import { ToastManager } from './ui/toast/toast-manager';

@Component({
  selector: 'app-poll-comments-card',
  imports: [ReactiveFormsModule, AsyncPipe, CommentCard],
  template: `
    @let comments = (commentsResult$ | async)?.data;
    @if (comments) {
      <div class="flex flex-col">
        <form
          class="flex flex-col gap-2"
          [formGroup]="formGroup"
          (ngSubmit)="submitComment()"
        >
          <textarea
            class="box-border w-full textarea"
            formControlName="content"
          ></textarea>
          <div class="flex justify-end">
            <button
              class="btn btn-primary"
              type="submit"
              [disabled]="!formGroup.valid"
            >
              작성
            </button>
          </div>
        </form>
        <div class="flex flex-col gap-6">
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

  private readonly queryClient = injectQueryClient();

  private readonly toast = inject(ToastManager);

  protected submitComment() {
    const { content } = this.formGroup.value;
    if (!content) return;
    this.pollId$.pipe(take(1)).subscribe((pollId) => {
      this.commentQueries
        .postComment(pollId)
        .mutateAsync(content)
        .then(() => {
          this.queryClient.invalidateQueries({
            queryKey: PollQueries.getPollsQueryKey(),
          });
          this.queryClient.invalidateQueries({
            queryKey: PollQueries.getPollQueryKey(pollId),
          });
          this.formGroup.reset();
        })
        .catch(() => {
          this.toast.show('댓글 작성에 실패했습니다.');
        });
    });
  }

  protected getDateText(date: Date) {
    return getRelativeDateText(date);
  }
}
