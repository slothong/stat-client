import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `
    <img
      src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"
      alt="Avatar"
      [style.width.px]="size"
      [style.height.px]="size"
    />
  `,
  host: {
    class: 'inline-block rounded-full overflow-hidden',
    '[style.width.px]': 'size',
    '[style.height.px]': 'size',
  },
})
export class Avatar {
  @Input() size = 48;
}
