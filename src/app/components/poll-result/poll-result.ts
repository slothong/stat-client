import { Component, computed, input } from '@angular/core';
import { Poll } from '@/models/poll';
import { PollResultChart } from '../poll-result-chart/poll-result-chart';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.html',
  imports: [
    NzRadioModule,
    NzSpaceModule,
    NzCardModule,
    FormsModule,
    PollResultChart,
  ],
  styleUrl: './poll-result.scss',
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
