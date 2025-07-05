import { ChartMount } from '@/directives/chart-mount';
import { Poll } from '@/models/poll';
import {
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-poll-result-chart',
  templateUrl: './poll-result-chart.html',
  imports: [ChartMount],
})
export class PollResultChart {
  readonly poll = input<Poll | null | undefined>();

  readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('chartContainer');

  protected readonly chartConfig = computed<ChartConfiguration | null>(() => {
    const options = this.poll()?.options;
    console.log(this.poll());
    if (options == null) return null;
    return {
      type: 'bar',
      data: {
        labels: options.map((option) => option.optionText),
        datasets: [
          {
            label: 'Result',
            data: options.map((option) => option.votes),
          },
        ],
      },
    };
  });
}
