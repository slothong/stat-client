import { Poll } from '@/models/poll';
import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { PollQueries } from '@/services/poll-queries';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Card } from './ui/card';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-poll-card',
  imports: [
    AsyncPipe,
    RelativeDatePipe,
    NzButtonModule,
    NzAvatarModule,
    NzRadioModule,
    NzIconModule,
    Card,
    NgIcon,
  ],
  template: `
    @let poll = poll$ | async;
    <app-card>
      <div class="flex items-center gap-2">
        <div
          class="avatar avatar-placeholder cursor-pointer"
          role="button"
          tabindex="0"
        >
          <div class="bg-neutral text-neutral-content text-xs w-7 rounded-full">
            <span>SY</span>
          </div>
        </div>
        <div>
          <span class="text-sm">
            {{ poll?.createdBy?.username }}
          </span>
          <span class="text-gray-500 text-xs">
            •
            {{ poll?.createdAt | relativeDate }}
          </span>
        </div>
      </div>
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
