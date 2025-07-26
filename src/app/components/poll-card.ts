import { Poll } from '@/models/poll';
import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { PollQueries } from '@/services/poll-queries';
import { Card } from './ui/card';
import { NgIcon } from '@ng-icons/core';
import { PostMeta } from './post-meta';

@Component({
  selector: 'app-poll-card',
  imports: [AsyncPipe, Card, NgIcon, PostMeta],
  template: `
    @let poll = poll$ | async;
    <app-card>
      <app-post-meta [createdAt]="poll?.createdAt">
        {{ poll?.createdBy?.username }}
      </app-post-meta>
      <div class="flex flex-col">
        <strong class="pt-3">
          {{ poll?.question }}
        </strong>
        @if (poll?.description) {
          <p>
            {{ poll?.description }}
          </p>
        }
        <div class="pb-3">
          @for (option of poll?.options; track option) {
            <div class="hover:bg-gray-100 py-1 px-1 flex items-center gap-2">
              <input type="radio" class="radio radio-xs m-0" />
              {{ option.optionText }}
            </div>
          }
        </div>
        <div class="flex gap-1">
          <button
            class="btn btn-circle btn-sm"
            (click)="$event.stopPropagation(); likePoll(!poll?.likedByMe)"
          >
            <ng-icon
              [name]="poll?.likedByMe ? 'heroHeartSolid' : 'heroHeart'"
              size="15"
            />
          </button>
          <button
            class="btn btn-circle btn-sm"
            (click)="$event.stopPropagation(); bookmark(!poll?.bookmarkedByMe)"
          >
            <ng-icon
              [name]="
                poll?.bookmarkedByMe ? 'heroBookmarkSolid' : 'heroBookmark'
              "
              size="15"
            />
          </button>
          <button class="btn btn-sm font-normal">
            <ng-icon name="heroChatBubbleOvalLeft" size="15" />
            {{ poll?.commentCount }}
          </button>
        </div>
      </div>
    </app-card>
  `,
})
export class PollCard {
  @Input()
  set poll(value: Poll) {
    this.poll$.next(value);
  }

  protected readonly poll$ = new ReplaySubject<Poll>();

  private readonly pollQueries = inject(PollQueries);

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
