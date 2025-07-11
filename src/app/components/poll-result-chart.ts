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
  imports: [ChartMount],
  template: `
    <canvas
      appChartMount
      [chartConfig]="chartConfig()"
      width="400"
      height="100"
    ></canvas>
  `,
})
export class PollResultChart {
  readonly pollResult = input<Poll | null>();

  readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('chartContainer');

  protected readonly chartConfig = computed<ChartConfiguration | null>(() => {
    const options = this.pollResult()?.options;
    if (options == null) return null;
    return {
      type: 'bar',
      data: {
        labels: options.map((option) => option.optionText),
        datasets: [
          {
            label: 'Result',
            data: options.map((option) => option.voteCount ?? 0),
          },
        ],
      },
    };
  });
}
