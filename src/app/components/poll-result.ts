import { Component, computed, input } from '@angular/core';
import { Poll } from '@/models/poll';
import { PollResultChart } from './poll-result-chart';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-poll-result',
  imports: [
    NzRadioModule,
    NzSpaceModule,
    NzCardModule,
    FormsModule,
    PollResultChart,
    MatRadioModule,
  ],
  template: `
    <app-poll-result-chart [poll]="poll()" />
    <mat-radio-group [value]="myVote()" [disabled]="true" class="flex flex-col">
      @for (option of poll()?.options; track option) {
      <mat-radio-button>
        {{ option.optionText }}
      </mat-radio-button>
      }
    </mat-radio-group>
  `,
})
export class PollResult {
  readonly poll = input<Poll | null>();

  protected readonly myVote = computed(() => {
    const selectedOption = this.poll()?.options.find(
      (option) => option.votedByMe
    );
    return selectedOption?.id;
  });
}
