import { Poll } from '@/models/poll';
import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ReplaySubject, take } from 'rxjs';
import { Avatar } from './avatar';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PollQueries } from '@/services/poll-queries';

@Component({
  selector: 'app-poll-card',
  imports: [
    AsyncPipe,
    Avatar,
    RelativeDatePipe,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    @let poll = poll$ | async;
    <div class="flex items-center gap-2">
      <app-avatar [size]="20" />
      {{ poll?.createdBy?.username }}
      <span class="text-gray-500 text-xs">
        •
        {{ poll?.createdAt | relativeDate }}
      </span>
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
      <div class="pt-3">
        <mat-radio-group class="flex flex-col">
          @for (option of poll?.options; track option) {
            <mat-radio-button [value]="option.id" class="hover:bg-gray-100">
              {{ option.optionText }}
            </mat-radio-button>
          }
        </mat-radio-group>
      </div>
      <div class="flex">
        <button
          matIconButton
          aria-label="Like this poll"
          (click)="$event.stopPropagation(); likePoll(!poll?.likedByMe)"
        >
          <mat-icon fontSet="material-icons-outlined">
            {{ poll?.likedByMe ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>
        <button
          matIconButton
          (click)="$event.stopPropagation(); bookmark(!poll?.bookmarkedByMe)"
        >
          <mat-icon fontSet="material-icons-outlined">
            {{ poll?.bookmarkedByMe ? 'bookmark' : 'bookmark_border' }}
          </mat-icon>
        </button>
        <button matButton>
          <mat-icon>comment</mat-icon>
          {{ poll?.commentCount }}
        </button>
      </div>
    </div>
  `,
  host: {
    class: 'hover:bg-gray-50 rounded-xl flex flex-col py-1 px-3 cursor-pointer',
  },
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
