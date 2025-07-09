import { Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vote } from '@/services/vote';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { PollQueries } from '@/services/poll-queries';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  selector: 'app-poll-detail',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    @let poll = pollResult()?.data;
    <form (ngSubmit)="submitForm()" [formGroup]="formGroup()">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title> {{ poll?.question }} </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="pt-5">
            <div>{{ poll?.description }}</div>
            <mat-radio-group
              [disabled]="!!poll?.hasVoted"
              class="flex flex-col"
              formControlName="optionId"
            >
              @for (option of poll?.options; track option.id) {
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
            [disabled]="!!poll?.hasVoted"
          >
            투표하기
          </button>
        </mat-card-actions>
      </mat-card>
    </form>
  `,
})
export class PollDetail {
  readonly pollId = input<string>();

  readonly query = inject(PollQueries);

  readonly pollQuery = inject(PollQueries);

  readonly pollResult = derivedAsync(
    () => this.pollQuery.getPoll(this.pollId()).result$,
  );

  private readonly vote = inject(Vote);

  protected formGroup = computed(() => {
    const poll = this.pollResult()?.data;
    return new FormGroup({
      optionId: new FormControl<string | null>(poll?.options[0]?.id ?? null),
    });
  });

  protected submitForm() {
    const pollId = this.pollResult()?.data?.id;
    if (pollId == null) return;

    const optionId = this.formGroup().controls.optionId.value;

    if (optionId == null) return;

    this.vote.vote(pollId, optionId).subscribe();
  }
}
