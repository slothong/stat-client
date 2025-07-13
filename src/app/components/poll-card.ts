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
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll-card',
  imports: [
    AsyncPipe,
    Avatar,
    RelativeDatePipe,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    NzButtonModule,
    FormsModule,
    NzRadioModule,
    NzIconModule,
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
      <div class="pb-3">
        @for (option of poll?.options; track option) {
          <div class="hover:bg-gray-100 py-1 px-1">
            <div nz-radio>
              {{ option.optionText }}
            </div>
          </div>
        }
      </div>
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
