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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { injectQueryClient } from '@ngneat/query';
import { map, ReplaySubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-poll-comments-card',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  template: `
    @let comments = (commentsResult$ | async)?.data;
    @if (comments) {
      <mat-card appearance="outlined">
        <mat-card-content>
          <div class="flex flex-col gap-5">
            <span class="text-xl">댓글 {{ comments.length }}</span>
            <form
              class="flex flex-col gap-2"
              [formGroup]="formGroup"
              (ngSubmit)="submitComment()"
            >
              <mat-form-field subscriptSizing="dynamic">
                <textarea matInput formControlName="content"></textarea>
              </mat-form-field>
              <div class="flex justify-end">
                <button
                  matButton="filled"
                  type="submit"
                  [disabled]="!formGroup.valid"
                >
                  작성
                </button>
              </div>
            </form>
            <div class="flex flex-col gap-3">
              @for (comment of comments; track comment.id) {
                <mat-card appearance="outlined">
                  <mat-card-content>
                    <div class="text-sm mb-3">
                      <span class="text-black">
                        {{ comment.author.username }}
                      </span>
                      <span class="text-gray-400">
                        •
                        {{ getDateText(comment.createdAt) }}
                      </span>
                    </div>
                    <div>
                      {{ comment.content }}
                    </div>
                    <div>
                      <mat-icon fontSet="material-icons-outlined">
                        comment
                      </mat-icon>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </div>
        </mat-card-content>
      </mat-card>
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

  private readonly queryClient = injectQueryClient();

  private readonly commentQueries = inject(CommentQueries);

  protected readonly commentsResult$ = this.pollId$.pipe(
    switchMap((pollId) => this.commentQueries.getComments$(pollId).result$),
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
