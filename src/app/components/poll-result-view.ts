import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PollResultChart } from './poll-result-chart';
import { map, ReplaySubject, take } from 'rxjs';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';
import { PollCommentsCard } from './poll-comments-card';
import { Poll } from '@/models/poll';
import { PostMeta } from './post-meta';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-poll-result-view',
  imports: [
    FormsModule,
    PollResultChart,
    AsyncPipe,
    PollCommentsCard,
    PostMeta,
    NgIcon,
  ],
  template: `
    @let poll = poll$ | async;
    @let selectedOption = selectedOption$ | async;
    <app-post-meta [createdAt]="poll?.createdAt">
      {{ poll?.createdBy?.username }}
    </app-post-meta>
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

      <div class="mb-3">
        @for (option of poll?.options; track option) {
          <label class="hover:bg-gray-100 py-1 px-1 flex items-center gap-2">
            <input
              type="radio"
              class="radio radio-xs m-0"
              [checked]="selectedOption?.id === option.id"
              [disabled]="true"
            />
            {{ option.optionText }}
          </label>
        }
      </div>
      <div class="flex gap-2 mt-6">
        <button
          type="button"
          class="btn btn-circle btn-sm"
          (click)="$event.stopPropagation(); likePoll(!poll?.likedByMe)"
        >
          <ng-icon
            [name]="poll?.likedByMe ? 'heroHeartSolid' : 'heroHeart'"
            size="15"
          />
        </button>
        <button
          type="button"
          class="btn btn-circle btn-sm"
          (click)="$event.stopPropagation(); bookmark(!poll?.bookmarkedByMe)"
        >
          <ng-icon
            [name]="poll?.bookmarkedByMe ? 'heroBookmarkSolid' : 'heroBookmark'"
            size="15"
          />
        </button>
        <button type="button" class="btn btn-sm font-normal">
          <ng-icon name="heroChatBubbleOvalLeft" size="15" />
          {{ poll?.commentCount }}
        </button>
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
