import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { PollApi } from '@/services/poll-api';
import { PollResult } from '@/models/poll-result';
import { PollResultChart } from './poll-result-chart';
@Component({
  selector: 'app-poll-result-view',
  imports: [FormsModule, PollResultChart, MatRadioModule],
  template: `
    <app-poll-result-chart [pollResult]="pollResult()" />
    <mat-radio-group [disabled]="true" class="flex flex-col">
      @for (option of pollResult()?.options; track option) {
        <mat-radio-button [checked]="option.id === myVote()">
          {{ option.optionText }}
        </mat-radio-button>
      }
    </mat-radio-group>
  `,
})
export class PollResultView {
  readonly pollId = input<string | null>();

  protected readonly pollResult = signal<PollResult | null>(null);

  private readonly api = inject(PollApi);

  protected readonly myVote = computed(() => {
    const pollResult = this.pollResult();
    return pollResult?.options.find((option) => option.votedByMe)?.id;
  });

  constructor() {
    effect(() => {
      const pollId = this.pollId();
      if (pollId) {
        this.api.getPollResult$(pollId).subscribe({
          next: (result) => this.pollResult.set(result),
        });
      }
    });
  }
}
