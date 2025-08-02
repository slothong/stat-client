import { Component, computed, contentChildren, signal } from '@angular/core';
import { CarouselItem } from './carousel-item';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, NgIcon],
  host: {
    class: 'overflow-hidden relative',
  },
  template: `
    <div class="absolute left-1 top-1/2 -translate-y-1/2 z-10">
      <button class="btn btn-sm btn-circle" (click)="prev()">
        <ng-icon name="heroChevronLeft" />
      </button>
    </div>

    @for (item of items(); track item) {
      <div
        class="w-full h-full absolute transition-all ease-in-out"
        [style.left]="positions()[$index]"
      >
        <ng-container [ngTemplateOutlet]="item.template" />
      </div>
    }

    <div class="absolute right-1 top-1/2 -translate-y-1/2 z-10">
      <button class="btn btn-sm btn-circle" (click)="next()">
        <ng-icon name="heroChevronRight" />
      </button>
    </div>
  `,
})
export class Carousel {
  protected readonly items = contentChildren(CarouselItem);
  protected index = signal(0);

  prev() {
    this.index.update((prev) => Math.max(0, prev - 1));
  }

  next() {
    this.index.update((prev) => Math.min(this.items().length - 1, prev + 1));
  }

  protected positions = computed(() => {
    return this.items().map((_, index) => {
      return `calc(100%*${index - this.index()})`;
    });
  });
}
