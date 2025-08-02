import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCarouselItem]',
})
export class CarouselItem {
  readonly template = inject(TemplateRef<null>);
}
