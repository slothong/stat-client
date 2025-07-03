import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';

@Directive({
  selector: '[appChartMount]',
})
export class ChartMount {
  readonly chartConfig = input<ChartConfiguration | null>();

  private readonly el = inject<ElementRef<HTMLCanvasElement>>(ElementRef);

  constructor() {
    effect(() => {
      const chartConfig = this.chartConfig();
      if (chartConfig) {
        new Chart(this.el.nativeElement, chartConfig);
      }
    });

    this.el.nativeElement.setAttribute('role', 'img');
  }
}
