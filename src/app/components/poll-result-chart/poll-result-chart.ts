import { Poll } from '@/models/poll';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';

const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];
@Component({
  selector: 'app-poll-result-chart',
  templateUrl: './poll-result-chart.html',
})
export class PollResultChart {
  readonly poll = input<Poll | null | undefined>();

  readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('chartContainer');

  readonly data = computed(() => {
    const options = this.poll()?.options;
    if (options == null) return null;
    return options.map((option) => ({
      name: option.optionText,
      votes: option.votes,
    }));
  });

  constructor() {
    effect(() => {
      const canvasRef = this.canvasRef();
      const data = this.data();
      console.log(data);
      if (canvasRef && data) {
        new Chart(canvasRef.nativeElement, {
          type: 'bar',
          data: {
            labels: data.map((row) => row.name),
            datasets: [
              {
                label: 'label',
                data: data.map((row) => row.votes),
              },
            ],
          },
        });
      }
    });
  }
}
