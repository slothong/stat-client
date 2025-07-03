import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { Chart, ChartData } from 'chart.js/auto';

@Directive({
  selector: '[appChartMount]',
})
export class ChartMount {
  readonly chartData = input<ChartData | null>();

  private readonly el = inject<ElementRef<HTMLCanvasElement>>(ElementRef);

  constructor() {
    effect(() => {
      const chartData = this.chartData();
      if (chartData) {
        new Chart(this.el.nativeElement, {
          type: 'bar',
          data: chartData,
        });
      }
    });

    this.el.nativeElement.setAttribute('role', 'img');
  }
}
