import { Component, computed, input } from '@angular/core';
import { Poll } from '@/models/poll';
import { PollResultChart } from '../poll-result-chart/poll-result-chart';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.html',
  imports: [NzRadioModule, FormsModule, PollResultChart],
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
