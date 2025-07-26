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
import { ReplaySubject, switchMap } from 'rxjs';
import { CommentCard } from './comment-card';

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
