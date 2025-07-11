import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { PollResultChart } from './poll-result-chart';
import { map, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';
import { PollCommentsCard } from './poll-comments-card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LikeButton } from './like-button';
import { Poll } from '@/models/poll';

@Component({
  selector: 'app-poll-result-view',
  imports: [
    FormsModule,
    PollResultChart,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    PollCommentsCard,
    LikeButton,
  ],
  template: `
    @let pollValue = poll$ | async;
    <app-poll-result-chart [pollResult]="pollValue" />
    <mat-radio-group [disabled]="true" class="flex flex-col">
      @for (option of pollValue?.options; track option) {
        <mat-radio-button [checked]="option.id === (myVote$ | async)">
          {{ option.optionText }}
        </mat-radio-button>
      }
    </mat-radio-group>
    <app-like-button
      [liked]="pollValue?.likedByMe ?? false"
      (likedChange)="likePoll($event)"
    />

    @if (pollValue) {
      <app-poll-comments-card [pollId]="pollValue.id" />
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

  private readonly pollQueries = inject(PollQueries);

  protected readonly myVote$ = this.poll$.pipe(
    map((poll) => poll.options.find((option) => option.votedByMe)?.id),
  );

  protected likePoll(liked: boolean) {
    this.poll$.pipe(take(1)).subscribe((poll) => {
      this.pollQueries.likePoll(poll.id).mutate(liked);
    });
  }
}
