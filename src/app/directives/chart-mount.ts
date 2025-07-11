import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Directive({
  selector: '[appChartMount]',
})
export class ChartMount implements OnDestroy {
  readonly chartConfig = input<ChartConfiguration | null>();

  private readonly el = inject<ElementRef<HTMLCanvasElement>>(ElementRef);

  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const chartConfig = this.chartConfig();
      if (chartConfig) {
        this.chart?.destroy();
        setTimeout(() => {
          this.chart = new Chart(this.el.nativeElement, chartConfig);
        });
      }
    });

    this.el.nativeElement.setAttribute('role', 'img');
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
