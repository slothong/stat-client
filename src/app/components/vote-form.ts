import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vote } from '@/services/vote';
import { PollQueries } from '@/services/poll-queries';
import {
  combineLatest,
  filter,
  map,
  ReplaySubject,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-vote-form',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NzAvatarModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzButtonModule,
    NzCommentModule,
    NzIconModule,
    RelativeDatePipe,
  ],
  template: `
    @let formGroup = formGroup$ | async;
    @let poll = (pollQuery$ | async)?.data;
    @if (formGroup && poll) {
      <form nz-form (ngSubmit)="submitForm()" [formGroup]="formGroup">
        <div class="flex items-center gap-2 pt-3">
          <nz-avatar nzIcon="user" nzSize="small" />
          {{ poll?.createdBy?.username }}
          <span class="text-gray-500 text-xs">
            •
            {{ poll?.createdAt | relativeDate }}
          </span>
        </div>
        <div class="flex flex-col pb-3">
          <strong class="pt-3">
            {{ poll?.question }}
          </strong>
          @if (poll?.description) {
            <p>
              {{ poll?.description }}
            </p>
          }

          <nz-radio-group formControlName="optionId">
            @for (option of poll?.options; track option) {
              <div>
                <label nz-radio [nzValue]="option.id">
                  {{ option.optionText }}
                </label>
              </div>
            }
          </nz-radio-group>

          <button
            nz-button
            type="submit"
            nzType="primary"
            [disabled]="!!poll.hasVoted"
          >
            투표하기
          </button>

          <div class="flex gap-2">
            <div
              [class]="
                'flex items-center justify-center text-sm transition-all hover:text-cyan-500 ' +
                (poll?.likedByMe ? 'text-cyan-500' : 'text-gray-400')
              "
              (click)="$event.stopPropagation(); likePoll(!poll?.likedByMe)"
            >
              <nz-icon
                nzType="heart"
                [nzTheme]="poll?.likedByMe ? 'fill' : 'outline'"
              />
            </div>
            <div
              [class]="
                'flex items-center justify-center text-sm transition-all hover:text-cyan-500 ' +
                (poll?.bookmarkedByMe ? 'text-cyan-500' : 'text-gray-400')
              "
              (click)="
                $event.stopPropagation(); bookmark(!poll?.bookmarkedByMe)
              "
            >
              <nz-icon
                nzType="book"
                [nzTheme]="poll?.bookmarkedByMe ? 'fill' : 'outline'"
              />
            </div>
            <div
              [class]="
                'h-6 flex gap-1 items-center justify-center text-sm transition-all hover:text-cyan-500 text-gray-400'
              "
            >
              <nz-icon nzType="comment" />
              {{ poll?.commentCount }}
            </div>
          </div>
        </div>
      </form>
    }
  `,
})
export class VoteForm {
  @Input()
  set pollId(value: string | null) {
    if (value) {
      this.pollId$.next(value);
    }
  }

  private readonly pollId$ = new ReplaySubject<string>(1);

  private readonly pollQueries = inject(PollQueries);

  readonly pollQuery$ = this.pollId$.pipe(
    switchMap((pollId) => this.pollQueries.getPoll$(pollId)),
    shareReplay(1),
  );

  private readonly vote = inject(Vote);

  protected formGroup$ = this.pollQuery$.pipe(
    map((pollResult) => {
      const poll = pollResult.data;
      return new FormGroup({
        optionId: new FormControl<string | null>(poll?.options[0]?.id ?? null),
      });
    }),
    shareReplay(1),
  );

  protected submitForm() {
    combineLatest([this.formGroup$, this.pollQuery$])
      .pipe(
        take(1),
        map(([formGroup, pollResult]) => ({
          optionId: formGroup.controls.optionId.value,
          pollId: pollResult.data?.id,
        })),
        filter(
          (result): result is { optionId: string; pollId: string } =>
            !!result.optionId && !!result.pollId,
        ),
        switchMap(({ optionId, pollId }) => this.vote.vote$(pollId, optionId)),
      )
      .subscribe();
  }

  protected likePoll(liked: boolean) {
    this.pollQuery$.pipe(take(1)).subscribe((poll) => {
      if (poll.data?.id) {
        this.pollQueries.likePoll(poll.data.id).mutate(liked);
      }
    });
  }

  protected bookmark(bookmarked: boolean) {
    this.pollQuery$.pipe(take(1)).subscribe((poll) => {
      if (poll.data?.id) {
        this.pollQueries.bookmarkPoll(poll.data.id).mutate(bookmarked);
      }
    });
  }
}
