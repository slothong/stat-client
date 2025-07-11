import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vote } from '@/services/vote';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
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

@Component({
  selector: 'app-vote-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  template: `
    @let formGroup = formGroup$ | async;
    @let poll = (pollQuery$ | async)?.data;
    @if (formGroup && poll) {
      <form (ngSubmit)="submitForm()" [formGroup]="formGroup">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title> {{ poll.question }} </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="pt-5">
              <div>{{ poll.description }}</div>
              <mat-radio-group
                [disabled]="!!poll.hasVoted"
                class="flex flex-col"
                formControlName="optionId"
              >
                @for (option of poll.options; track option.id) {
                  <mat-radio-button [value]="option.id">
                    {{ option.optionText }}
                  </mat-radio-button>
                }
              </mat-radio-group>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button
              matButton="filled"
              type="submit"
              [disabled]="!!poll.hasVoted"
            >
              투표하기
            </button>
          </mat-card-actions>
        </mat-card>
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
}
