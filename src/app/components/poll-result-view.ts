import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { PollResultChart } from './poll-result-chart';
import { map, ReplaySubject, switchMap } from 'rxjs';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-poll-result-view',
  imports: [FormsModule, PollResultChart, MatRadioModule, AsyncPipe],
  template: `
    @let pollResult = (pollResult$ | async)?.data;
    <app-poll-result-chart [pollResult]="pollResult" />
    <mat-radio-group [disabled]="true" class="flex flex-col">
      @for (option of pollResult?.options; track option) {
        <mat-radio-button [checked]="option.id === (myVote$ | async)">
          {{ option.optionText }}
        </mat-radio-button>
      }
    </mat-radio-group>
  `,
})
export class PollResultView {
  @Input()
  set pollId(value: string | null) {
    if (value) {
      this.pollId$.next(value);
    }
  }

  readonly pollId$ = new ReplaySubject<string>(1);

  private readonly pollQueries = inject(PollQueries);

  protected readonly pollResult$ = this.pollId$.pipe(
    switchMap((pollId) => this.pollQueries.getPollResult$(pollId)),
  );

  protected readonly myVote$ = this.pollResult$.pipe(
    map(
      (pollResult) =>
        pollResult.data?.options.find((option) => option.votedByMe)?.id,
    ),
  );
}
