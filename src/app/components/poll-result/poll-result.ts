import { Component, computed, input } from '@angular/core';
import {
  HlmRadioComponent,
  HlmRadioGroupComponent,
  HlmRadioIndicatorComponent,
} from '../ui/ui-radio-group-helm/src';
import { Poll } from '@/models/poll';
import { PollResultChart } from '../poll-result-chart/poll-result-chart';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.html',
  imports: [
    HlmRadioComponent,
    HlmRadioIndicatorComponent,
    HlmRadioGroupComponent,
    PollResultChart,
  ],
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
