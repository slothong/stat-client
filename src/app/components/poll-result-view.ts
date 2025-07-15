import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PollResultChart } from './poll-result-chart';
import { map, ReplaySubject, take } from 'rxjs';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';
import { PollCommentsCard } from './poll-comments-card';
import { Poll } from '@/models/poll';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-poll-result-view',
  imports: [
    FormsModule,
    PollResultChart,
    AsyncPipe,
    PollCommentsCard,
    NzAvatarModule,
    NzRadioModule,
    RelativeDatePipe,
    NzIconModule,
  ],
  template: `
    @let poll = poll$ | async;
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

      <app-poll-result-chart [pollResult]="poll" />

      <nz-radio-group
        [ngModel]="(selectedOption$ | async)?.id"
        [nzDisabled]="true"
      >
        @for (option of poll?.options; track option) {
          <div class="hover:bg-gray-100 py-1 px-1">
            <label nz-radio [nzValue]="option.id">
              {{ option.optionText }}
            </label>
          </div>
        }
      </nz-radio-group>
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
          (click)="$event.stopPropagation(); bookmark(!poll?.bookmarkedByMe)"
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

    @if (poll) {
      <app-poll-comments-card [pollId]="poll.id" />
    }
  `,
})
export class PollResultView {
  @Input()
  set poll(value: Poll) {
    if (value) {
      this.poll$.next(value);
    }
  }
  readonly poll$ = new ReplaySubject<Poll>(1);

  protected readonly selectedOption$ = this.poll$.pipe(
    map((poll) => poll.options.find((option) => option.votedByMe)),
  );

  private readonly pollQueries = inject(PollQueries);

  protected readonly myVote$ = this.poll$.pipe(
    map((poll) => poll.options.find((option) => option.votedByMe)?.id),
  );

  protected likePoll(liked: boolean) {
    this.poll$.pipe(take(1)).subscribe((poll) => {
      this.pollQueries.likePoll(poll.id).mutate(liked);
    });
  }

  protected bookmark(bookmarked: boolean) {
    this.poll$.pipe(take(1)).subscribe((poll) => {
      this.pollQueries.bookmarkPoll(poll.id).mutate(bookmarked);
    });
  }
}
